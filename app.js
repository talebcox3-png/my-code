(function() {
    if (document.getElementById('qx999-master-bot')) {
        document.getElementById('qx999-master-bot').remove();
    }

    const botContainer = document.createElement('div');
    botContainer.id = 'qx999-master-bot';
    botContainer.innerHTML = `
        <style>
            #qx9-login-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.85); z-index: 999998;
                display: flex; justify-content: center; align-items: center;
                font-family: 'Segoe UI', Tahoma, sans-serif;
            }
            #qx9-login-card {
                background: #0b0e14; border: 2px solid #00e676; padding: 30px;
                border-radius: 20px; width: 320px; text-align: center; color: #fff;
                box-shadow: 0 15px 35px rgba(0,230,118,0.2);
            }
            #qx9-login-card h2 { color: #00e676; margin-bottom: 5px; font-size: 24px; }
            #qx9-login-card p { color: #888; font-size: 13px; margin-bottom: 20px; }
            .qx9-input {
                width: 100%; padding: 12px; background: #151a23; border: 1px solid #232a36;
                border-radius: 8px; color: #fff; font-size: 16px; text-align: center;
                margin-bottom: 15px; outline: none; box-sizing: border-box;
            }
            .qx9-btn {
                width: 100%; padding: 12px; background: #00e676; border: none;
                border-radius: 8px; color: #000; font-weight: bold; font-size: 16px;
                cursor: pointer; transition: 0.2s;
            }
            .qx9-btn:hover { background: #00c853; }
            #qx9-logo {
                position: fixed; top: 80px; right: 30px; z-index: 999999;
                width: 75px; height: 75px; background: #111; border-radius: 50%;
                border: 3px solid #00e676; display: none; cursor: pointer;
                box-shadow: 0 5px 20px rgba(0,230,118,0.4); text-align: center;
                overflow: hidden; line-height: 75px; font-weight: bold; color: #00e676;
            }
            #qx9-settings {
                position: fixed; top: 170px; right: 30px; z-index: 999999;
                background: #0b0e14; border: 2px solid #00e676; border-radius: 14px;
                width: 300px; padding: 20px; display: none; color: #fff;
                box-shadow: 0 10px 30px rgba(0,0,0,0.8); font-family: monospace;
            }
            .qx9-setting-group { margin-bottom: 15px; }
            .qx9-setting-group label { display: block; font-size: 12px; color: #aaa; margin-bottom: 5px; }
            .qx9-radio-btn {
                background: #151a23; border: 1px solid #232a36; color: #fff;
                padding: 10px; width: 100%; border-radius: 6px; text-align: left;
                cursor: pointer; margin-bottom: 5px; font-weight: bold;
            }
            .qx9-radio-btn.active { border-color: #00e676; color: #00e676; background: #1c2331; }
        </style>

        <div id="qx9-login-overlay">
            <div id="qx9-login-card">
                <h2>QX999 Login</h2>
                <p>Enter password to continue</p>
                <input type="password" id="qx9-pass-input" class="qx9-input" value="Alvi1234" readonly style="letter-spacing: 3px; cursor: not-allowed; opacity: 0.8;">
                <button id="qx9-login-btn" class="qx9-btn">Enter</button>
            </div>
        </div>

        <div id="qx9-logo">QX999</div>

        <div id="qx9-settings">
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #232a36; padding-bottom:8px; margin-bottom:12px;">
                <span style="color:#00e676; font-weight:bold;">QX999 Settings</span>
                <span id="qx9-close-settings" style="color:#ff5252; cursor:pointer; font-weight:bold;">✕</span>
            </div>
            <div class="qx9-setting-group">
                <label>Scan delay (seconds)</label>
                <input type="number" id="qx-scan-delay" class="qx9-input" value="5" style="margin-bottom:0; text-align:left; padding:8px;">
            </div>
            <div class="qx9-setting-group">
                <label>After trade scan (seconds)</label>
                <input type="number" id="qx-after-delay" class="qx9-input" value="5" style="margin-bottom:0; text-align:left; padding:8px;">
            </div>
            <div class="qx9-setting-group">
                <label>Trade direction</label>
                <button class="qx9-radio-btn" data-dir="Up">Up</button>
                <button class="qx9-radio-btn" data-dir="Down">Down</button>
                <button class="qx9-radio-btn active" data-dir="QX999 Trade">QX999 Trade</button>
            </div>
            <button id="qx9-save-btn" class="qx9-btn" style="padding:8px; font-size:14px;">Save</button>
        </div>
    `;

    document.body.appendChild(botContainer);

    let selectedDirection = "QX999 Trade";

    document.getElementById('qx9-login-btn').onclick = function() {
        if (document.getElementById('qx9-pass-input').value === "Alvi1234") {
            document.getElementById('qx9-login-overlay').style.display = 'none';
            document.getElementById('qx9-logo').style.display = 'block';
        }
    };

    const dirButtons = document.querySelectorAll('.qx9-radio-btn');
    dirButtons.forEach(btn => {
        btn.onclick = function() {
            dirButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedDirection = this.getAttribute('data-dir');
        };
    });

    let tapCount = 0;
    let tapTimer = null;
    const logoElem = document.getElementById('qx9-logo');

    logoElem.onclick = function() {
        tapCount++;
        if (tapCount === 1) {
            tapTimer = setTimeout(() => {
                executeAnalysisAndTrade();
                tapCount = 0;
            }, 300);
        } else if (tapCount === 2) {
            clearTimeout(tapTimer);
            document.getElementById('qx9-settings').style.display = 'block';
            tapCount = 0;
        }
    };

    document.getElementById('qx9-close-settings').onclick = () => document.getElementById('qx9-settings').style.display = 'none';
    document.getElementById('qx9-save-btn').onclick = () => document.getElementById('qx9-settings').style.display = 'none';

    function executeAnalysisAndTrade() {
        logoElem.style.borderColor = "#ffeb3b";
        logoElem.innerText = "Scan";

        setTimeout(() => {
            const buttons = document.querySelectorAll('button');
            let targetButton = null;

            buttons.forEach(btn => {
                const text = btn.innerText.toLowerCase();
                if (selectedDirection === "Up" && (text.includes('call') || text.includes('up'))) {
                    targetButton = btn;
                } else if (selectedDirection === "Down" && (text.includes('put') || text.includes('down'))) {
                    targetButton = btn;
                } else if (selectedDirection === "QX999 Trade") {
                    if (text.includes('call') || text.includes('put') || text.includes('up') || text.includes('down')) {
                        targetButton = btn;
                    }
                }
            });

            if (targetButton) {
                targetButton.click();
                logoElem.style.borderColor = "#00e676";
                logoElem.innerText = "Done";
                setTimeout(() => { logoElem.innerText = "QX999"; }, 1500);
            } else {
                logoElem.style.borderColor = "#ff5252";
                logoElem.innerText = "Err";
                setTimeout(() => { logoElem.innerText = "QX999"; }, 1500);
            }
        }, 1500);
    }
})();
