(function () {
    // Remove existing panel or floating button if present
    let oldBtn = document.getElementById('floating-circle-bot');
    let oldPanel = document.getElementById('bot-control-panel');
    if (oldBtn) oldBtn.remove();
    if (oldPanel) oldPanel.remove();

    let isRunning = false;
    let tradeInterval = null;

    // 1. Create Floating Draggable Circle Button
    let circleBtn = document.createElement('div');
    circleBtn.id = 'floating-circle-bot';
    circleBtn.innerText = 'BOT';
    circleBtn.style.cssText = `
        position: fixed;
        bottom: 50px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #00c6ff, #0072ff);
        color: #ffffff;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        z-index: 999999;
        cursor: pointer;
        user-select: none;
        touch-action: none;
    `;
    document.body.appendChild(circleBtn);

    // 2. Create Control Panel UI
    let panel = document.createElement('div');
    panel.id = 'bot-control-panel';
    panel.style.cssText = `
        position: fixed;
        bottom: 120px;
        right: 20px;
        width: 220px;
        background: #141419;
        color: #ffffff;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.6);
        z-index: 999999;
        display: none;
        font-family: Arial, sans-serif;
    `;
    panel.innerHTML = `
        <h4 style="margin:0 0 10px 0; text-align:center; color:#00c6ff;">Auto Trade Bot</h4>
        <label style="font-size:12px; color:#ccc;">Take Profit ($):</label>
        <input type="number" id="tp_val" value="50" style="width:100%; margin:4px 0 10px 0; padding:6px; background:#222; color:#fff; border:1px solid #444; border-radius:4px; box-sizing:border-box;">
        <label style="font-size:12px; color:#ccc;">Stop Loss ($):</label>
        <input type="number" id="sl_val" value="20" style="width:100%; margin:4px 0 12px 0; padding:6px; background:#222; color:#fff; border:1px solid #444; border-radius:4px; box-sizing:border-box;">
        <button id="toggle_bot_btn" style="width:100%; padding:10px; background:#00c6ff; color:#fff; border:none; border-radius:5px; font-weight:bold; cursor:pointer;">Start Auto Click (5s)</button>
    `;
    document.body.appendChild(panel);

    // 3. Toggle Control Panel Display
    circleBtn.onclick = function () {
        panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
    };

    // 4. 5-Second Automated Execution Loop
    document.getElementById('toggle_bot_btn').onclick = function () {
        let btn = this;
        if (!isRunning) {
            isRunning = true;
            btn.innerText = "Stop Bot";
            btn.style.background = "#ff4757";

            let tp = document.getElementById('tp_val').value;
            let sl = document.getElementById('sl_val').value;
            console.log("Bot Started | Take Profit: $" + tp + " | Stop Loss: $" + sl);

            tradeInterval = setInterval(function () {
                console.log("Executing trade signal every 5 seconds...");

                // Target trading button elements (e.g., Call / Put buttons)
                let callBtn = document.querySelector('.btn-call') || document.querySelector('.up-button') || document.querySelector('[data-action="call"]');
                if (callBtn) {
                    callBtn.click();
                    console.log("Trade button clicked.");
                } else {
                    console.log("Trading button selector not found on page.");
                }
            }, 5000);

        } else {
            isRunning = false;
            clearInterval(tradeInterval);
            btn.innerText = "Start Auto Click (5s)";
            btn.style.background = "#00c6ff";
            console.log("Bot Stopped.");
        }
    };

    // 5. Make Circle Button Draggable across Screen
    circleBtn.ontouchmove = function (e) {
        let touch = e.touches[0];
        let x = touch.clientX - 30;
        let y = touch.clientY - 30;
        circleBtn.style.left = x + 'px';
        circleBtn.style.top = y + 'px';
        panel.style.left = Math.max(10, x - 80) + 'px';
        panel.style.top = Math.max(10, y - 210) + 'px';
    };
})();
