(function () {
    let oldBtn = document.getElementById('qx999-circle-bot');
    let oldPanel = document.getElementById('qx999-panel');
    let oldLogin = document.getElementById('qx999-login');
    let oldStatus = document.getElementById('qx999-status');
    if (oldBtn) oldBtn.remove();
    if (oldPanel) oldPanel.remove();
    if (oldLogin) oldLogin.remove();
    if (oldStatus) oldStatus.remove();

    let isRunning = false;
    let tradeInterval = null;
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
        <h3 style="margin:0 0 5px 0; color:#00ff66; font-size:22px;">QX999 Login</h3>
        <p style="font-size:12px; color:#aaa; margin-bottom:20px;">Enter password to continue</p>
        <input type="password" id="qx_pass" value="${licenseKey}" readonly style="width:100%; padding:12px; background:#112e1f; color:#fff; border:1px solid #00ff66; border-radius:8px; box-sizing:border-box; margin-bottom:20px; text-align:center; font-size:16px; outline:none; cursor:not-allowed;">
        <button id="qx_login_btn" style="width:100%; padding:12px; background:#00ff66; color:#000; border:none; border-radius:8px; font-weight:bold; font-size:16px; cursor:pointer;">Enter</button>
    `;
    document.body.appendChild(loginBox);

    let circleBtn = document.createElement('div');
    circleBtn.id = 'qx999-circle-bot';
    circleBtn.style.cssText = `
        position: fixed; top: 100px; right: 20px; width: 60px; height: 60px;
        background: url('https://i.ibb.co.com/jvVK3jbt/1000321459-2.jpg') center/cover no-repeat;
        border: 2px solid #00ff66; border-radius: 50%; display: none;
        box-shadow: 0 0 10px rgba(0,255,102,0.6); z-index: 999999; cursor: pointer; user-select: none;
    `;
    document.body.appendChild(circleBtn);

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
        
        <label style="font-size:12px; color:#ccc; display:block; margin-bottom:8px;">Trade direction</label>
        <button class="dir-btn" data-val="Up" style="width:100%; padding:10px; margin-bottom:8px; background:#112e1f; color:#00ff66; border:1px solid #00ff66; border-radius:8px; font-weight:bold; cursor:pointer;">Up</button>
        <button class="dir-btn" data-val="Down" style="width:100%; padding:10px; margin-bottom:8px; background:#112e1f; color:#00ff66; border:1px solid #00ff66; border-radius:8px; font-weight:bold; cursor:pointer;">Down</button>
        <button class="dir-btn" data-val="Random" style="width:100%; padding:10px; margin-bottom:20px; background:#112e1f; color:#00ff66; border:1px solid #00ff66; border-radius:8px; font-weight:bold; cursor:pointer;">Random</button>
        
        <button id="save_bot_btn" style="width:100%; padding:12px; background:#00ff66; color:#000; border:none; border-radius:8px; font-weight:bold; font-size:16px; cursor:pointer;">Save</button>
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
        let passInput = document.getElementById('qx_pass').value;
        if (passInput === licenseKey) {
            loginBox.remove();
            circleBtn.style.display = 'flex';
            panel.style.display = 'block';
        } else {
            alert("Invalid License Key!");
        }
    };

    circleBtn.onclick = function () {
        panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
    };

    document.getElementById('save_bot_btn').onclick = function () {
        let scanDelay = parseInt(document.getElementById('scan_delay').value) * 1000;
        let afterScan = parseInt(document.getElementById('after_scan').value);
        panel.style.display = 'none';

        if (!isRunning) {
            isRunning = true;
            
            let statusBox = document.createElement('div');
            statusBox.id = 'qx999-status';
            statusBox.style.cssText = `
                position: fixed; top: 15px; left: 50%; transform: translateX(-50%);
                background: rgba(0, 255, 102, 0.95); color: #000; padding: 8px 18px;
                border-radius: 20px; font-weight: bold; font-size: 14px; z-index: 999999;
                box-shadow: 0 0 10px rgba(0,255,102,0.5);
            `;
            statusBox.innerText = "QX999: Analyzing Market...";
            document.body.appendChild(statusBox);

            tradeInterval = setInterval(function () {
                statusBox.innerText = "QX999: Analyzing Market...";
                
                setTimeout(() => {
                    let targetDir = selectedDirection;
                    if (selectedDirection === "Random") {
                        targetDir = Math.random() < 0.5 ? "Up" : "Down";
                    }

                    statusBox.innerText = "QX999 Signal: " + targetDir;

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

                    if (afterScan > 0) {
                        setTimeout(() => {
                            if(document.getElementById('qx999-status')) {
                                document.getElementById('qx999-status').innerText = "QX999: Analyzing Market...";
                            }
                        }, afterScan * 1000);
                    }
                }, 2000);

            }, scanDelay);
        }
    };

    circleBtn.ontouchmove = function (e) {
        let touch = e.touches[0];
        circleBtn.style.left = (touch.clientX - 30) + 'px';
        circleBtn.style.top = (touch.clientY - 30) + 'px';
    };
})();
