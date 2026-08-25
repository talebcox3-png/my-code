(function () {
    let oldBtn = document.getElementById('qx999-circle-bot');
    let oldPanel = document.getElementById('qx999-panel');
    let oldLogin = document.getElementById('qx999-login');
    if (oldBtn) oldBtn.remove();
    if (oldPanel) oldPanel.remove();
    if (oldLogin) oldLogin.remove();

    let isRunning = false;
    let tradeInterval = null;

    let loginBox = document.createElement('div');
    loginBox.id = 'qx999-login';
    loginBox.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 300px; background: #0b1a12; border: 2px solid #00ff66;
        color: #ffffff; padding: 20px; border-radius: 15px;
        box-shadow: 0 0 20px rgba(0,255,102,0.4); z-index: 999999;
        font-family: Arial, sans-serif; text-align: center;
    `;
    loginBox.innerHTML = `
        <h3 style="margin:0 0 5px 0; color:#00ff66; font-size:20px;">QX999 Login</h3>
        <p style="font-size:12px; color:#aaa; margin-bottom:15px;">Enter password to continue</p>
        <input type="password" id="qx_pass" placeholder="Password" style="width:100%; padding:10px; background:#112e1f; color:#fff; border:1px solid #00ff66; border-radius:6px; box-sizing:border-box; margin-bottom:15px; text-align:center; font-size:16px;">
        <button id="qx_login_btn" style="width:100%; padding:10px; background:#00ff66; color:#000; border:none; border-radius:6px; font-weight:bold; font-size:16px; cursor:pointer;">Enter</button>
    `;
    document.body.appendChild(loginBox);

    let circleBtn = document.createElement('div');
    circleBtn.id = 'qx999-circle-bot';
    circleBtn.style.cssText = `
        position: fixed; top: 100px; right: 20px; width: 60px; height: 60px;
        background: radial-gradient(circle, #00ff66, #0b4d2c); border: 2px solid #00ff66;
        border-radius: 50%; display: none; justify-content: center; align-items: center;
        box-shadow: 0 0 10px rgba(0,255,102,0.6); z-index: 999999; cursor: pointer; user-select: none;
    `;
    circleBtn.innerHTML = `<span style="font-size:24px;">💀</span>`;
    document.body.appendChild(circleBtn);

    let panel = document.createElement('div');
    panel.id = 'qx999-panel';
    panel.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 320px; background: #0b1a12; border: 2px solid #00ff66;
        color: #ffffff; padding: 20px; border-radius: 15px;
        box-shadow: 0 0 25px rgba(0,255,102,0.4); z-index: 999999; display: none;
        font-family: Arial, sans-serif;
    `;
    panel.innerHTML = `
        <h3 style="margin:0 0 15px 0; text-align:center; color:#00ff66; font-size:20px;">QX999 Settings</h3>
        <label style="font-size:12px; color:#ccc;">Scan delay (seconds)</label>
        <input type="number" id="scan_delay" value="5" style="width:100%; margin:5px 0 12px 0; padding:8px; background:#112e1f; color:#fff; border:1px solid #00ff66; border-radius:6px; box-sizing:border-box;">
        <label style="font-size:12px; color:#ccc;">After trade scan (seconds)</label>
        <input type="number" id="after_scan" value="5" style="width:100%; margin:5px 0 12px 0; padding:8px; background:#112e1f; color:#fff; border:1px solid #00ff66; border-radius:6px; box-sizing:border-box;">
        <label style="font-size:12px; color:#ccc; display:block; margin-bottom:5px;">Trade direction</label>
        <button class="dir-btn" data-val="Up" style="width:100%; padding:10px; margin-bottom:6px; background:#112e1f; color:#00ff66; border:1px solid #00ff66; border-radius:6px; font-weight:bold; cursor:pointer;">Up</button>
        <button class="dir-btn" data-val="Down" style="width:100%; padding:10px; margin-bottom:6px; background:#112e1f; color:#00ff66; border:1px solid #00ff66; border-radius:6px; font-weight:bold; cursor:pointer;">Down</button>
        <button class="dir-btn" data-val="Random" style="width:100%; padding:10px; margin-bottom:15px; background:#112e1f; color:#00ff66; border:1px solid #00ff66; border-radius:6px; font-weight:bold; cursor:pointer;">Random</button>
        <button id="save_bot_btn" style="width:100%; padding:12px; background:#00ff66; color:#000; border:none; border-radius:6px; font-weight:bold; font-size:16px; cursor:pointer;">Save & Start Bot</button>
    `;
    document.body.appendChild(panel);

    let selectedDirection = "Up";
    let dirButtons = panel.querySelectorAll('.dir-btn');
    dirButtons.forEach(btn => {
        btn.onclick = function() {
            dirButtons.forEach(b => b.style.background = "#112e1f");
            this.style.background = "#00ff66";
            this.style.color = "#000";
            selectedDirection = this.getAttribute('data-val');
        };
    });
    dirButtons[0].style.background = "#00ff66";
    dirButtons[0].style.color = "#000";

    document.getElementById('qx_login_btn').onclick = function () {
        let passInput = document.getElementById('qx_pass').value;
        if (passInput === "Alvi1234") {
            loginBox.remove();
            circleBtn.style.display = 'flex';
            panel.style.display = 'block';
        } else {
            alert("Incorrect Password!");
        }
    };

    circleBtn.onclick = function () {
        panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
    };

    document.getElementById('save_bot_btn').onclick = function () {
        let scanDelay = parseInt(document.getElementById('scan_delay').value) * 1000;
        panel.style.display = 'none';

        if (!isRunning) {
            isRunning = true;
            alert("QX999 Bot Analyzing Market & Started!");

            tradeInterval = setInterval(function () {
                let targetDir = selectedDirection;
                if (selectedDirection === "Random") {
                    targetDir = Math.random() < 0.5 ? "Up" : "Down";
                }

                let btnSelector = targetDir === "Up" ? 
                    ('.btn-call, .up-button, [data-action="call"]') : 
                    ('.btn-put, .down-button, [data-action="put"]');
                
                let tradeBtn = document.querySelector(btnSelector);
                if (tradeBtn) {
                    tradeBtn.click();
                }
            }, scanDelay);
        }
    };

    circleBtn.ontouchmove = function (e) {
        let touch = e.touches[0];
        circleBtn.style.left = (touch.clientX - 30) + 'px';
        circleBtn.style.top = (touch.clientY - 30) + 'px';
    };
})();
