const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'docs', 'demo-linkedin.mp4'));
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const FFMPEG = path.join(ROOT, 'tools', 'ffmpeg', 'ffmpeg.exe');
const PORT = 9333;
const FPS = 30;
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'p5rec-'));
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const edge = spawn(EDGE, [
    '--headless=new', `--remote-debugging-port=${PORT}`, '--window-size=1920,1080', '--hide-scrollbars',
    '--no-first-run', '--mute-audio', `--user-data-dir=${path.join(work, 'profile')}`, 'about:blank',
  ], { stdio: 'ignore' });

  let targets;
  for (let i = 0; i < 50 && !targets; i++) {
    try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); } catch { await sleep(200); }
  }
  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  let id = 0;
  const pending = new Map();
  const frames = [];
  const send = (method, params = {}) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  ws.addEventListener('message', ev => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id); return; }
    if (msg.method === 'Page.screencastFrame') {
      const { data, metadata, sessionId } = msg.params;
      const file = path.join(work, `f${String(frames.length).padStart(5, '0')}.jpg`);
      fs.writeFileSync(file, Buffer.from(data, 'base64'));
      frames.push({ file, t: metadata.timestamp * 1000 });
      send('Page.screencastFrameAck', { sessionId });
    }
  });
  const evaluate = async expr => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value;

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 });
  await send('Page.navigate', { url: 'http://localhost:5173/?demo=1' });

  process.stdout.write('recording');
  for (let i = 0; i < 1200 && !(await evaluate('window.__demoDone === true')); i++) { await sleep(250); if (i % 8 === 0) process.stdout.write('.'); }
  const sfx = (await evaluate('JSON.stringify(window.__sfx || [])')) || '[]';
  const demoStart = await evaluate('window.__demoStart');
  await send('Page.stopScreencast');
  ws.close();
  edge.kill();
  console.log(`\n${frames.length} frames`);

  const t0 = demoStart;
  const kept = frames.filter(f => f.t >= t0 - 50);
  const lines = [];
  kept.forEach((f, i) => {
    const next = kept[i + 1] ? kept[i + 1].t : f.t + 1000 / FPS;
    lines.push(`file '${f.file.replace(/\\/g, '/')}'`, `duration ${Math.max(0.001, (next - f.t) / 1000).toFixed(4)}`);
  });
  lines.push(`file '${kept[kept.length - 1].file.replace(/\\/g, '/')}'`);
  fs.writeFileSync(path.join(work, 'list.txt'), lines.join('\n'));
  const duration = (kept[kept.length - 1].t - t0) / 1000 + 0.2;

  const events = JSON.parse(sfx).filter(e => e.t >= t0);
  const inputs = [];
  const filters = [];
  events.forEach((e, i) => {
    inputs.push('-i', path.join(ROOT, 'assets', 'sfx', `${e.name}.wav`));
    const ms = Math.max(0, Math.round(e.t - t0));
    filters.push(`[${i + 1}:a]aformat=sample_rates=48000:channel_layouts=stereo,adelay=${ms}|${ms}[a${i}]`);
  });
  const mix = events.length
    ? `${filters.join(';')};${events.map((_, i) => `[a${i}]`).join('')}amix=inputs=${events.length}:normalize=0:duration=longest,apad,atrim=0:${duration.toFixed(2)},volume=0.9[aout]`
    : null;

  const args = ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(work, 'list.txt'), ...inputs];
  if (mix) args.push('-filter_complex', mix, '-map', '0:v', '-map', '[aout]', '-c:a', 'aac', '-b:a', '192k');
  args.push('-vf', `fps=${FPS},format=yuv420p`, '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-movflags', '+faststart', '-t', duration.toFixed(2), OUT);
  execFileSync(FFMPEG, args, { stdio: 'inherit' });
  fs.rmSync(work, { recursive: true, force: true });
  console.log(`saved ${OUT} (${duration.toFixed(1)} s, ${events.length} sounds)`);
}

main().catch(err => { console.error(err); process.exit(1); });
