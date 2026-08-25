(function () {
    let oldBtn = document.getElementById('qx999-circle-bot');
    let oldPanel = document.getElementById('qx999-panel');
    let oldLogin = document.getElementById('qx999-login');
    let oldCanvas = document.getElementById('qx999-scan-canvas');
    if (oldBtn) oldBtn.remove();
    if (oldPanel) oldPanel.remove();
    if (oldLogin) oldLogin.remove();
    if (oldCanvas) oldCanvas.remove();

    let isRunning = false;
    let licenseKey = "Alvi1234";

    let loginBox = document.createElement('div');
    loginBox.id = 'qx999-login';
    loginBox.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 320px; background: #0b1a12; border: 2px solid #00ff66;
        color: #ffffff; padding: 25px; border-radius: 15px;
        box-shadow: 0 0 25px rgba(0,255,102,0.4); z-index: 999999;
        font-family: Arial, sans-serif; text-align: center;
    `;
    loginBox.innerHTML = `
        <h3 style="margin:0 0 5px 0; color:#00ff66; font-size:22px;">QX999 VIP BOT</h3>
        <p style="font-size:12px; color:#aaa; margin-bottom:20px;">@tradewithevu Edition</p>
        <input type="password" id="qx_pass" value="${licenseKey}" readonly style="width:100%; padding:12px; background:#112e1f; color:#fff; border:1px solid #00ff66; border-radius:8px; box-sizing:border-box; margin-bottom:20px; text-align:center; font-size:16px; outline:none; cursor:not-allowed;">
        <button id="qx_login_btn" style="width:100%; padding:12px; background:#00ff66; color:#000; border:none; border-radius:8px; font-weight:bold; font-size:16px; cursor:pointer;">CONNECT BOT</button>
    `;
    document.body.appendChild(loginBox);

    let botContainer = document.createElement('div');
    botContainer.id = 'qx999-circle-bot';
    botContainer.style.cssText = `
        position: fixed; top: 100px; right: 20px;
        display: none; flex-direction: column; align-items: center;
        z-index: 999999; cursor: pointer; user-select: none;
    `;
    botContainer.innerHTML = `
        <div style="width: 60px; height: 60px; background: url('https://i.ibb.co.com/jvVK3jbt/1000321459-2.jpg') center/cover no-repeat; border: 2px solid #00ff66; border-radius: 50%; box-shadow: 0 0 12px rgba(0,255,102,0.6);"></div>
        <span style="color: #00ff66; font-weight: bold; font-size: 13px; margin-top: 5px; text-shadow: 0 0 5px #000; font-family: Arial, sans-serif;">QX HECK</span>
    `;
    document.body.appendChild(botContainer);

    let scanCanvas = document.createElement('canvas');
    scanCanvas.id = 'qx999-scan-canvas';
    scanCanvas.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        pointer-events: none; z-index: 999998; display: none;
    `;
    document.body.appendChild(scanCanvas);
    let ctx = scanCanvas.getContext('2d');

    function resizeCanvas() {
        scanCanvas.width = window.innerWidth;
        scanCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let scanAnimationId = null;
    let scanY = 0;
    let scanDirection = 1;

    function drawScanLine() {
        ctx.clearRect(0, 0, scanCanvas.width, scanCanvas.height);
        ctx.beginPath();
        ctx.strokeStyle = '#00ff66';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00ff66';
        ctx.shadowBlur = 15;
        ctx.moveTo(0, scanY);
        ctx.lineTo(scanCanvas.width, scanY);
        ctx.stroke();

        scanY += 5 * scanDirection;
        if (scanY >= scanCanvas.height || scanY <= 0) {
            scanDirection *= -1;
        }
        scanAnimationId = requestAnimationFrame(drawScanLine);
    }

    function startScanAnimation() {
        scanCanvas.style.display = 'block';
        scanY = 0;
        if (!scanAnimationId) drawScanLine();
    }

    function stopScanAnimation() {
        scanCanvas.style.display = 'none';
        if (scanAnimationId) {
            cancelAnimationFrame(scanAnimationId);
            scanAnimationId = null;
        }
    }

    function analyzeMarketSignal() {
        let greenCandles = document.querySelectorAll('.candle-green, .green-bar, [style*="rgb(0, 192, 127)"], [fill*="#00c07f"], [stroke*="#00c07f"]').length;
        let redCandles = document.querySelectorAll('.candle-red, .red-bar, [style*="rgb(255, 62, 85)"], [fill*="#ff3e55"], [stroke*="#ff3e55"]').length;
        let total = greenCandles + redCandles;
        if (total === 0) return Math.random() < 0.5 ? "Up" : "Down";
        let ratio = greenCandles / total;
        if (ratio > 0.65) return "Down";
        else if (ratio < 0.35) return "Up";
        else return greenCandles >= redCandles ? "Up" : "Down";
    }

    let panel = document.createElement('div');
    panel.id = 'qx999-panel';
    panel.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 340px; background: #0b1a12; border: 2px solid #00ff66;
        color: #ffffff; padding: 25px; border-radius: 15px;
        box-shadow: 0 0 25px rgba(0,255,102,0.4); z-index: 999999; display: none;
        font-family: Arial, sans-serif; max-height: 90vh; overflow-y: auto;
    `;
    panel.innerHTML = `
        <h3 style="margin:0 0 15px 0; text-align:center; color:#00ff66; font-size:22px;">QX999 Settings</h3>
        
        <label style="font-size:12px; color:#ccc; display:block; margin-bottom:5px;">Scan delay (seconds)</label>
        <input type="number" id="scan_delay" value="5" style="width:100%; margin:0 0 15px 0; padding:10px; background:#112e1f; color:#fff; border:1px solid #00ff66; border-radius:8px; box-sizing:border-box;">
        
        <label style="font-size:12px; color:#ccc; display:block; margin-bottom:2px;">After trade scan (seconds)</label>
        <span style="font-size:10px; color:#888; display:block; margin-bottom:5px;">0 = stop only when you tap the icon</span>
        <input type="number" id="after_scan" value="5" style="width:100%; margin:0 0 15px 0; padding:10px; background:#112e1f; color:#fff; border:1px solid #00ff66; border-radius:8px; box-sizing:border-box;">
        
        <label style="font-size:12px; color:#ccc; display:block; margin-bottom:5px;">Trade Amount ($)</label>
        <input type="number" id="trade_amount" value="10" style="width:100%; margin:0 0 15px 0; padding:10px; background:#112e1f; color:#fff; border:1px solid #00ff66; border-radius:8px; box-sizing:border-box;">

        <label style="font-size:12px; color:#ccc; display:block; margin-bottom:8px;">Trade direction</label>
        <button class="dir-btn" data-val="Up" style="width:100%; padding:10px; margin-bottom:8px; background:#112e1f; color:#00ff66; border:1px solid #00ff66; border-radius:8px; font-weight:bold; cursor:pointer;">Up</button>
        <button class="dir-btn" data-val="Down" style="width:100%; padding:10px; margin-bottom:8px; background:#112e1f; color:#00ff66; border:1px solid #00ff66; border-radius:8px; font-weight:bold; cursor:pointer;">Down</button>
        <button class="dir-btn" data-val="Random" style="width:100%; padding:10px; margin-bottom:15px; background:#112e1f; color:#00ff66; border:1px solid #00ff66; border-radius:8px; font-weight:bold; cursor:pointer;">Random</button>
        
        <button id="save_bot_btn" style="width:100%; padding:12px; background:#00ff66; color:#000; border:none; border-radius:8px; font-weight:bold; font-size:16px; cursor:pointer;">Start Scan & Trade</button>
    `;
    document.body.appendChild(panel);

    let selectedDirection = "Up";
    let dirButtons = panel.querySelectorAll('.dir-btn');
    dirButtons.forEach(btn => {
        btn.onclick = function() {
            dirButtons.forEach(b => {
                b.style.background = "#112e1f";
                b.style.color = "#00ff66";
            });
            this.style.background = "#00ff66";
            this.style.color = "#000";
            selectedDirection = this.getAttribute('data-val');
        };
    });
    dirButtons[0].style.background = "#00ff66";
    dirButtons[0].style.color = "#000";

    document.getElementById('qx_login_btn').onclick = function () {
        loginBox.remove();
        botContainer.style.display = 'flex';
        panel.style.display = 'block';
    };

    botContainer.onclick = function () {
        panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
    };

    document.getElementById('save_bot_btn').onclick = function () {
        let scanDelay = parseInt(document.getElementById('scan_delay').value) * 1000;
        let tradeAmount = document.getElementById('trade_amount').value;
        panel.style.display = 'none';

        if (!isRunning) {
            isRunning = true;
            startScanAnimation();

            setTimeout(function () {
                stopScanAnimation();

                let amountInput = document.querySelector('input[name="amount"]') || document.querySelector('.input-amount input') || document.querySelector('input[type="text"][value*="$"]');
                if (amountInput) {
                    amountInput.value = tradeAmount;
                    amountInput.dispatchEvent(new Event('input', { bubbles: true }));
                    amountInput.dispatchEvent(new Event('change', { bubbles: true }));
                }

                let targetDir = selectedDirection;
                if (selectedDirection === "Random") {
                    targetDir = analyzeMarketSignal();
                }

                let callBtn = document.querySelector('.btn-call') || document.querySelector('.up-button') || document.querySelector('button.success') || document.querySelector('.deal-button-call');
                let putBtn = document.querySelector('.btn-put') || document.querySelector('.down-button') || document.querySelector('button.danger') || document.querySelector('.deal-button-put');

                if (targetDir === "Up" && callBtn) {
                    callBtn.click();
                } else if (targetDir === "Down" && putBtn) {
                    putBtn.click();
                } else {
                    let allBtns = document.querySelectorAll('button');
                    allBtns.forEach(b => {
                        let text = b.innerText.toLowerCase();
                        if (targetDir === "Up" && (text.includes('higher') || text.includes('call') || text.includes('up'))) {
                            b.click();
                        } else if (targetDir === "Down" && (text.includes('lower') || text.includes('put') || text.includes('down'))) {
                            b.click();
                        }
                    });
                }
                isRunning = false;
            }, scanDelay);
        }
    };

    botContainer.ontouchmove = function (e) {
        let touch = e.touches[0];
        botContainer.style.left = (touch.clientX - 30) + 'px';
        botContainer.style.top = (touch.clientY - 30) + 'px';
    };
})();
