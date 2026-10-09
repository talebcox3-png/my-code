
(() => {
  const IDS = [
    'qx999-circle-bot',
    'qx999-panel',
    'qx999-login',
    'qx999-scan-canvas',
    'qx999-settings',
    'qx999-style'
  ];
  IDS.forEach(id => document.getElementById(id)?.remove());

  const LOGO_URL =
    'https://i.ibb.co.com/5hPpvrTB/Firefly-Remove-Background.png';

  const PASSWORD = 'QX999BOT';

  let scanDelay = 5;
  let directionMode = 'RANDOM';
  let configured = false;
  let scanning = false;
  let taps = 0;
  let tapReset;
  let scanTimer;
  let raf;

  const style = document.createElement('style');
  style.id = 'qx999-style';
  style.textContent = `
    #qx999-circle-bot {
      position:fixed; top:34%; right:18px;
      z-index:2147483646; display:none;
      flex-direction:column; align-items:center;
      gap:5px; cursor:grab; touch-action:none;
      user-select:none;
    }
    #qx999-logo-icon {
      width:66px; height:66px; border-radius:50%;
      background:rgba(0,0,0,.72) url("${LOGO_URL}")
        center/85% no-repeat;
      box-shadow:0 0 0 9px rgba(0,0,0,.20),
        0 0 0 18px rgba(0,0,0,.12);
      border:1px solid rgba(0,255,102,.32);
    }
    #qx999-circle-bot.qx-glow #qx999-logo-icon {
      box-shadow:0 0 0 9px rgba(0,0,0,.22),
        0 0 0 18px rgba(0,0,0,.13),
        0 0 24px 7px rgba(0,255,102,.35);
    }
    #qx999-circle-bot span {
      color:#fff; font:bold 12px Arial;
      letter-spacing:2px; text-shadow:0 1px 4px #000;
    }
    .qx999-overlay {
      position:fixed; inset:0; z-index:2147483645;
      background:rgba(0,0,0,.70);
      backdrop-filter:blur(2px);
      display:flex; align-items:center;
      justify-content:center; padding:16px;
      font-family:Arial,sans-serif;
    }
    .qx999-card {
      width:min(100%,390px); max-height:90vh;
      overflow:auto; box-sizing:border-box;
      background:#08150c; color:#eaffef;
      border:1.5px solid rgba(0,255,102,.75);
      border-radius:24px; padding:28px 22px;
      box-shadow:0 0 24px rgba(0,255,102,.16);
    }
    .qx999-card * { box-sizing:border-box; }
    .qx999-card h2 {
      margin:0 0 10px; text-align:center;
      color:#00ff66; font-size:27px;
      font-weight:600; letter-spacing:1px;
    }
    .qx999-sub {
      margin:0 0 25px; text-align:center;
      color:#b9d9c3; font-size:14px;
    }
    .qx999-label {
      display:block; margin:18px 0 8px;
      color:#bdd3c3; font-size:14px;
    }
    .qx999-input,.qx999-select {
      display:block; width:100%; height:56px;
      padding:0 16px; background:#050c07;
      color:#fff; border:1.5px solid #24432e;
      border-radius:15px; font-size:19px; outline:none;
    }
    .qx999-input:focus,.qx999-select:focus {
      border-color:#00ff66;
      box-shadow:0 0 9px rgba(0,255,102,.25);
    }
    .qx999-btn {
      width:100%; min-height:58px; margin-top:16px;
      border:0; border-radius:15px;
      background:#00ff66; color:#003a18;
      font-size:19px; font-weight:800; cursor:pointer;
    }
    .qx999-mode {
      width:100%; min-height:54px; margin-bottom:9px;
      border:1px solid #23412c; border-radius:13px;
      background:#050c07; color:#fff;
      font-size:17px; font-weight:700;
    }
    .qx999-mode.active {
      background:rgba(0,255,102,.15);
      border-color:#00ff66; color:#00ff66;
    }
    .qx999-foot {
      text-align:center; color:#799783;
      font-size:12px; line-height:1.5; margin-top:20px;
    }
    #qx999-panel {
      position:fixed; z-index:2147483644;
      left:50%; bottom:24px; transform:translateX(-50%);
      width:min(92vw,370px); padding:15px 18px;
      border:1px solid rgba(0,255,102,.5);
      border-radius:18px; background:rgba(4,15,8,.96);
      color:#eaffef; font:14px Arial;
      display:none;
    }
    #qx999-panel .qx-head {
      display:flex; justify-content:space-between;
      color:#00ff66; font-weight:bold; letter-spacing:2px;
    }
    #qx999-result {
      text-align:center; font-size:28px;
      font-weight:900; padding:15px 0;
    }
    #qx999-result.qx-buy { color:#00ff66; }
    #qx999-result.qx-sell { color:#ff646b; }
    #qx999-detail {
      font-size:12px; color:#9eb7a5; line-height:1.5;
    }
    #qx999-scan-canvas {
      position:fixed; inset:0; width:100vw; height:100vh;
      z-index:2147483643; pointer-events:none; display:none;
    }
  `;
  document.head.appendChild(style);

  function makeOverlay(id, html) {
    const el = document.createElement('div');
    el.id = id;
    el.className = 'qx999-overlay';
    el.innerHTML = html;
    document.body.appendChild(el);
    return el;
  }

  const login = makeOverlay('qx999-login', `
    <section class="qx999-card">
      <h2>QX999 Login</h2>
      <p class="qx999-sub">Enter password to continue</p>
      <input class="qx999-input" id="qx_pass"
        type="password" value="${PASSWORD}"
        autocomplete="off" aria-label="Password"
        style="letter-spacing:4px">
      <button class="qx999-btn" id="qx_login_btn">Enter</button>
    </section>
  `);

  const pass = login.querySelector('#qx_pass');

  setTimeout(() => {
    pass.focus({preventScroll:true});
    pass.select();
  }, 200);

  pass.addEventListener('click', () => {
    setTimeout(() => pass.select(), 0);
  });

  login.querySelector('#qx_login_btn').onclick = () => {
    login.remove();
    bot.style.display = 'flex';
    toast('QX999 ready');
  };

  pass.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      login.querySelector('#qx_login_btn').click();
    }
  });

  const settings = makeOverlay('qx999-settings', `
    <section class="qx999-card">
      <h2>QX999 Settings</h2>

      <label class="qx999-label">Scan delay (seconds)</label>
      <input class="qx999-input" id="qx_delay"
        type="number" min="1" max="120" value="5">

      <label class="qx999-label">After trade scan (seconds)</label>
      <input class="qx999-input" id="qx_after"
        type="number" min="0" max="3600" value="5">

      <label class="qx999-label">Market</label>
      <select class="qx999-select" id="qx_market">
        <option>EUR/USD OTC</option>
        <option>GBP/USD OTC</option>
        <option>USD/JPY OTC</option>
        <option>AUD/USD OTC</option>
        <option>EUR/GBP OTC</option>
        <option>EUR/USD</option>
        <option>GBP/USD</option>
        <option>USD/JPY</option>
      </select>

      <label class="qx999-label">Timeframe</label>
      <select class="qx999-select" id="qx_timeframe">
        <option>5 seconds</option>
        <option>10 seconds</option>
        <option>15 seconds</option>
        <option>30 seconds</option>
        <option>1 minute</option>
      </select>

      <label class="qx999-label">Signal direction</label>
      <div id="qx_modes">
        <button class="qx999-mode" data-mode="BUY">BUY</button>
        <button class="qx999-mode" data-mode="SELL">SELL</button>
        <button class="qx999-mode active" data-mode="RANDOM">
          AUTO ANALYSIS
        </button>
      </div>

      <button class="qx999-btn" id="qx_save_btn">Save</button>
      <p class="qx999-foot">
        3 taps on the Skull icon to open settings
      </p>
    </section>
  `);

  settings.style.display = 'none';

  settings.addEventListener('click', e => {
    if (e.target === settings) settings.style.display = 'none';
  });

  settings.querySelectorAll('[data-mode]').forEach(btn => {
    btn.onclick = () => {
      directionMode = btn.dataset.mode;
      settings.querySelectorAll('[data-mode]').forEach(b => {
        b.classList.toggle('active', b === btn);
      });
    };
  });

  settings.querySelector('#qx_save_btn').onclick = () => {
    const delay = Number(settings.querySelector('#qx_delay').value);
    const after = Number(settings.querySelector('#qx_after').value);

    if (!Number.isFinite(delay) || delay < 1 ||
        !Number.isFinite(after) || after < 0) {
      toast('Enter valid scan times');
      return;
    }

    scanDelay = Math.min(delay, 120);
    configured = true;
    settings.style.display = 'none';
    panel.style.display = 'block';

    panel.querySelector('#qx999-detail').textContent =
      settings.querySelector('#qx_market').value + ' · ' +
      settings.querySelector('#qx_timeframe').value +
      ' · Settings saved';

    toast('Settings saved');
  };

  const bot = document.createElement('div');
  bot.id = 'qx999-circle-bot';
  bot.innerHTML = `
    <div id="qx999-logo-icon"></div>
    <span>QX999</span>
  `;
  document.body.appendChild(bot);

  const panel = document.createElement('section');
  panel.id = 'qx999-panel';
  panel.innerHTML = `
    <div class="qx-head">
      <span>QX999 SIGNAL</span>
      <span id="qx999-state">READY</span>
    </div>
    <div id="qx999-result">WAITING</div>
    <div id="qx999-detail">
      Save settings, then tap Skull to scan.
    </div>
  `;
  document.body.appendChild(panel);

  const canvas = document.createElement('canvas');
  canvas.id = 'qx999-scan-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    const dpr = Math.max(1, devicePixelRatio || 1);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize);

  function toast(message) {
    document.getElementById('qx999-toast')?.remove();
    const t = document.createElement('div');
    t.id = 'qx999-toast';
    t.textContent = message;
    t.style.cssText =
      'position:fixed;z-index:2147483647;bottom:15px;left:50%;' +
      'transform:translateX(-50%);background:#092114;color:#eaffef;' +
      'border:1px solid #00ff66;border-radius:12px;padding:11px 15px;' +
      'font:13px Arial;max-width:90vw';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2400);
  }

  function inspectVisibleChartColors() {
    let green = 0, red = 0, inspected = 0;

    const nodes = document.querySelectorAll(
      'svg path, svg rect, svg polygon, [class*="candle" i]'
    );

    nodes.forEach(el => {
      if (el.closest(
        '#qx999-login,#qx999-settings,#qx999-panel,#qx999-circle-bot'
      )) return;

      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2 ||
          r.bottom < 0 || r.top > innerHeight) return;

      const cs = getComputedStyle(el);
      const color = (
        cs.fill + ' ' + cs.stroke + ' ' +
        cs.backgroundColor + ' ' +
        (el.getAttribute('class') || '')
      ).toLowerCase();

      inspected++;

      if (/lime|green|#00ff|bull|positive|up-candle/.test(color)) {
        green++;
      }

      if (/red|#ff0000|bear|negative|down-candle/.test(color)) {
        red++;
      }
    });

    return {green, red, inspected};
  }

  let startX = 0, startY = 0, originX = 0, originY = 0;
  let dragging = false, moved = false;

  bot.addEventListener('pointerdown', e => {
    dragging = true;
    moved = false;
    startX = e.clientX;
    startY = e.clientY;

    const r = bot.getBoundingClientRect();
    originX = r.left;
    originY = r.top;
    bot.style.right = 'auto';
    bot.style.left = originX + 'px';
    bot.style.top = originY + 'px';
    bot.setPointerCapture?.(e.pointerId);
  });

  bot.addEventListener('pointermove', e => {
    if (!dragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) moved = true;

    if (moved) {
      bot.style.left = Math.max(
        0, Math.min(innerWidth - 75, originX + dx)
      ) + 'px';

      bot.style.top = Math.max(
        0, Math.min(innerHeight - 90, originY + dy)
      ) + 'px';
    }
  });

  bot.addEventListener('pointerup', () => {
    dragging = false;
    setTimeout(() => { moved = false; }, 120);
  });

  bot.addEventListener('click', () => {
    if (moved) return;

    taps++;
    clearTimeout(tapReset);
    tapReset = setTimeout(() => taps = 0, 700);

    if (taps >= 3) {
      taps = 0;
      settings.style.display = 'flex';
      return;
    }

    if (!configured) {
      toast('Tap Skull 3 times to open Settings');
      return;
    }

    if (!scanning) runScan();
  });

  function runScan() {
    scanning = true;
    bot.classList.add('qx-glow');
    canvas.style.display = 'block';

    panel.style.display = 'block';
    panel.querySelector('#qx999-state').textContent = 'ANALYZING';

    const result = panel.querySelector('#qx999-result');
    result.className = '';
    result.textContent = 'SCANNING…';

    const started = performance.now();
    const duration = scanDelay * 1000;

    function frame(now) {
      ctx.clearRect(0, 0, innerWidth, innerHeight);

      const elapsed = now - started;
      const y = elapsed / duration * (innerHeight + 200) - 100;

      const gradient = ctx.createLinearGradient(0, y - 150, 0, y);
      gradient.addColorStop(0, 'rgba(0,255,102,0)');
      gradient.addColorStop(.7, 'rgba(0,255,102,.12)');
      gradient.addColorStop(1, 'rgba(0,255,102,.72)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, y - 150, innerWidth, 150);

      ctx.strokeStyle = '#00ff66';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00ff66';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(innerWidth, y);
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (elapsed < duration) {
        raf = requestAnimationFrame(frame);
      } else {
        finishScan();
      }
    }

    raf = requestAnimationFrame(frame);
  }

  function finishScan() {
    if (!scanning) return;

    clearTimeout(scanTimer);
    if (raf) cancelAnimationFrame(raf);

    canvas.style.display = 'none';
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    bot.classList.remove('qx-glow');
    scanning = false;

    const data = inspectVisibleChartColors();
    const result = panel.querySelector('#qx999-result');
    let signal = '';

    if (directionMode === 'BUY') signal = 'BUY';
    else if (directionMode === 'SELL') signal = 'SELL';
    else if (
      data.inspected > 0 &&
      data.green !== data.red &&
      Math.max(data.green, data.red) >= 2
    ) {
      signal = data.green > data.red ? 'BUY' : 'SELL';
    }

    if (!signal) {
      result.className = '';
      result.textContent = 'NO DATA';

      panel.querySelector('#qx999-state').textContent = 'UNAVAILABLE';
      panel.querySelector('#qx999-detail').textContent =
        'Could not reliably identify chart candles. ' +
        'A live candlestick data connection is needed for real analysis.';

      toast('No reliable chart data detected');
      return;
    }

    result.textContent = signal;
    result.className = signal === 'BUY' ? 'qx-buy' : 'qx-sell';

    panel.querySelector('#qx999-state').textContent = 'SIGNAL READY';
    panel.querySelector('#qx999-detail').textContent =
      'Visible chart-element heuristic only. ' +
      'No trade was placed. Signals are not guaranteed profitable.';

    toast(signal + ' signal displayed');
  }

  toast('QX999 loaded — Enter to continue');
})();
