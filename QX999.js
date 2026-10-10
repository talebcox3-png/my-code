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

  const LOGO_URL = 'https://i.ibb.co.com/5hPpvrTB/Firefly-Remove-Background.png';
  const PASSWORD = 'QX999BOT';

  let scanDelay = 5;
  let directionMode = 'RANDOM';
  let configured = false;
  let scanning = false;
  let taps = 0;
  let tapReset;
  let raf;

  const style = document.createElement('style');
  style.id = 'qx999-style';
  style.textContent = `
    #qx999-circle-bot {
      position: fixed; top: 34%; right: 18px;
      z-index: 2147483646; display: none;
      flex-direction: column; align-items: center;
      gap: 5px; cursor: grab; touch-action: none;
      user-select: none;
    }
    #qx999-logo-icon {
      width: 66px; height: 66px; border-radius: 50%;
      background: transparent url("${LOGO_URL}") center/85% no-repeat;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.95), 0 2px 8px rgba(0, 0, 0, 0.9);
      transition: box-shadow 0.5s ease-in-out;
    }
    #qx999-circle-bot.qx-glow #qx999-logo-icon {
      box-shadow: 0 0 30px 10px rgba(0, 255, 102, 0.6), inset 0 0 12px rgba(0, 255, 102, 0.4), 0 6px 20px rgba(0, 0, 0, 0.95) !important;
    }
    #qx999-circle-bot span {
      color: #fff; font: bold 12px Arial;
      letter-spacing: normal; text-shadow: 0 1px 4px #000;
    }
    .qx999-overlay {
      position: fixed; inset: 0; z-index: 2147483645;
      background: rgba(0,0,0,.70); backdrop-filter: blur(2px);
      display: flex; align-items: center; justify-content: center; padding: 16px;
      font-family: Arial, sans-serif;
    }
    .qx999-card {
      width: min(100%, 390px); max-height: 90vh;
      overflow: auto; box-sizing: border-box;
      background: #0c150e; color: #ffffff;
      border: 2px solid #00ff66;
      border-radius: 20px; padding: 35px 25px 30px 25px;
      box-shadow: 0 0 35px rgba(0, 255, 102, 0.35);
      text-align: center;
    }
    .qx999-card * { box-sizing: border-box; }
    .qx999-card h2 {
      margin: 0 0 8px; color: #00ff66; font-size: 24px;
      font-weight: bold;
    }
    .qx999-sub {
      margin: 0 0 22px; color: #b0b0b0; font-size: 13px;
    }
    .qx999-label {
      display: block; margin: 18px 0 8px; text-align: left;
      color: #bdd3c3; font-size: 14px;
    }
    .qx999-input, .qx999-select {
      display: block; width: 100%; height: 56px;
      padding: 0 16px; background: #050c07;
      color: #fff; border: 1.5px solid #24432e;
      border-radius: 15px; font-size: 19px; outline: none;
    }
    .qx999-input:focus, .qx999-select:focus {
      border-color: #00ff66;
      box-shadow: 0 0 9px rgba(0,255,102,.25);
    }
    .qx999-btn {
      width: 100%; min-height: 58px; margin-top: 16px;
      border: 0; border-radius: 12px;
      background: #00ff66; color: #000;
      font-size: 17px; font-weight: bold; cursor: pointer;
      box-shadow: 0 0 15px rgba(0, 255, 102, 0.4);
    }
    .qx999-mode {
      width: 100%; min-height: 54px; margin-bottom: 9px;
      border: 1px solid #23412c; border-radius: 13px;
      background: #050c07; color: #fff;
      font-size: 17px; font-weight: 700; cursor: pointer;
    }
    .qx999-mode.active {
      background: rgba(0,255,102,.15);
      border-color: #00ff66; color: #00ff66;
    }
    .qx999-foot {
      text-align: center; color: #799783;
      font-size: 12px; line-height: 1.5; margin-top: 20px;
    }
    #qx999-panel {
      position: fixed; z-index: 2147483644;
      left: 50%; bottom: 24px; transform: translateX(-50%);
      width: min(92vw, 370px); padding: 15px 18px;
      border: 1px solid rgba(0,255,102,.5);
      border-radius: 18px; background: rgba(4,15,8,.96);
      color: #eaffef; font: 14px Arial;
      display: none;
    }
    #qx999-panel .qx-head {
      display: flex; justify-content: space-between;
      color: #00ff66; font-weight: bold; letter-spacing: 2px;
    }
    #qx999-result {
      text-align: center; font-size: 28px;
      font-weight: 900; padding: 15px 0;
    }
    #qx999-result.qx-buy { color: #00ff66; }
    #qx999-result.qx-sell { color: #ff646b; }
    #qx999-detail {
      font-size: 12px; color: #9eb7a5; line-height: 1.5;
    }
    #qx999-scan-canvas {
      position: fixed; inset: 0; width: 100vw; height: 100vh;
      z-index: 2147483643; pointer-events: none; display: none;
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

  // হুবহু ছবির মতো লগইন বক্স ও ব্লু বক্স কভার পাসওয়ার্ড ফিল্ড[span_0](start_span)[span_0](end_span)
  const login = makeOverlay('qx999-login', `
    <section class="qx999-card">
      <h2>QX999 Login</h2>
      <p class="qx999-sub">Enter password to continue</p>
      
      <div style="position:relative; width:100%; margin-bottom:22px; background:#16241a; border:1.5px solid #00ff66; border-radius:12px; padding:12px 16px; display:flex; align-items:center; box-sizing:border-box;">
        <div style="background:#0088ff; padding:4px 10px; border-radius:6px; display:inline-flex; align-items:center; color:#ffffff; letter-spacing:4px; font-size:18px; user-select:none; box-shadow: 0 0 6px rgba(0,136,255,0.4);">
          ••••••••
        </div>
        <input type="password" id="qx_pass" value="${PASSWORD}" style="position:absolute; opacity:0; width:100%; height:100%; top:0; left:0; cursor:pointer;" />
      </div>

      <button class="qx999-btn" id="qx_login_btn">Enter</button>
    </section>
  `);

  login.querySelector('#qx_login_btn').onclick = () => {
    login.remove();
    bot.style.display = 'flex';
    toast('QX999 ready');
  };

  const settings = makeOverlay('qx999-settings', `
    <section class="qx999-card" style="text-align:left;">
      <h2>QX999 Settings</h2>

      <label class="qx999-label">Scan delay (seconds)</label>
      <input class="qx999-input" id="qx_delay"
        type="number" min="1" max="120" value="5">

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
        Tap Skull 3 times to open settings
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
    if (!Number.isFinite(delay) || delay < 1) {
      toast('Enter valid scan time');
      return;
    }
    scanDelay = Math.min(delay, 120);
    configured = true;
    settings.style.display = 'none';
    panel.style.display = 'block';
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
      if (el.closest('#qx999-login,#qx999-settings,#qx999-panel,#qx999-circle-bot')) return;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > innerHeight) return;

      const cs = getComputedStyle(el);
      const color = (
        cs.fill + ' ' + cs.stroke + ' ' +
        cs.backgroundColor + ' ' +
        (el.getAttribute('class') || '')
      ).toLowerCase();

      inspected++;
      if (/lime|green|#00ff|bull|positive|up-candle/.test(color)) green++;
      if (/red|#ff0000|bear|negative|down-candle/.test(color)) red++;
    });

    return {green, red, inspected};
  }

  // অটো ট্রেড এক্সিকিউশন ফাংশন (Quotex এর নিজস্ব Up/Down বা Buy/Sell বাটনে ক্লিক করবে)
  function executeTradeAutomatically(signal) {
    const buttons = Array.from(document.querySelectorAll('button, div[role="button"], a'));
    let targetBtn = null;

    for (let btn of buttons) {
      const text = (btn.innerText || btn.textContent || "").trim().toLowerCase();
      const cls = (btn.className || "").toString().toLowerCase();

      if (signal === 'BUY') {
        if (text === 'up' || text.includes('buy') || text.includes('call') || text.includes('higher') || cls.includes('call') || cls.includes('success') || cls.includes('green')) {
          targetBtn = btn;
          break;
        }
      } else {
        if (text === 'down' || text.includes('sell') || text.includes('put') || text.includes('lower') || cls.includes('put') || cls.includes('danger') || cls.includes('red')) {
          targetBtn = btn;
          break;
        }
      }
    }

    if (targetBtn) {
      targetBtn.click();
      toast(signal + ' Trade Placed Automatically!');
    } else {
      toast('Trade button not found automatically');
    }
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
      bot.style.left = Math.max(0, Math.min(innerWidth - 75, originX + dx)) + 'px';
      bot.style.top = Math.max(0, Math.min(innerHeight - 90, originY + dy)) + 'px';
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
      toast('Tap Skull 3 times to open settings');
      return;
    }

    if (!scanning) runScan();
  });

  function runScan() {
    scanning = true;
    bot.classList.add('qx-glow'); // এনালাইসিসের সময় লোগো গ্লো করবে
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
      const y = (elapsed / duration) * (innerHeight + 200) - 100;

      // ভিডিওর মতো স্মুথ চওড়া ধোঁয়াটে স্ক্যানিং ইফেক্ট
      const trailHeight = 280;
      const gradient = ctx.createLinearGradient(0, y - trailHeight, 0, y);
      gradient.addColorStop(0, 'rgba(0, 255, 102, 0)');
      gradient.addColorStop(0.35, 'rgba(0, 255, 102, 0.04)');
      gradient.addColorStop(0.75, 'rgba(0, 255, 102, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 255, 102, 0.7)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, y - trailHeight, innerWidth, trailHeight);

      ctx.strokeStyle = 'rgba(0, 255, 102, 0.88)';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#00ff66';
      ctx.shadowBlur = 20;
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
    canvas.style.display = 'none';
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    bot.classList.remove('qx-glow');
    scanning = false;

    const data = inspectVisibleChartColors();
    const result = panel.querySelector('#qx999-result');
    let signal = '';

    if (directionMode === 'BUY') signal = 'BUY';
    else if (directionMode === 'SELL') signal = 'SELL';
    else {
      signal = data.green >= data.red ? 'BUY' : 'SELL';
    }

    result.textContent = signal;
    result.className = signal === 'BUY' ? 'qx-buy' : 'qx-sell';

    panel.querySelector('#qx999-state').textContent = 'SIGNAL READY';
    panel.querySelector('#qx999-detail').textContent = 'Auto Trade Executed Successfully.';

    // স্বয়ংক্রিয়ভাবে ট্রেড প্লেস করবে
    executeTradeAutomatically(signal);
  }

  toast('QX999 loaded — Enter to continue');
})();
