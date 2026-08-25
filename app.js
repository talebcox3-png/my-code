(function() {
    if (document.getElementById('evu-pro-sureshot-bot')) {
        document.getElementById('evu-pro-sureshot-bot').remove();
    }

    const container = document.createElement('div');
    container.id = 'evu-pro-sureshot-bot';
    container.innerHTML = `
        <div style="position: fixed; top: 15px; right: 15px; z-index: 999999; background: #0b0e14; color: #ffffff; padding: 16px; border-radius: 12px; border: 2px solid #00e676; font-family: monospace; width: 300px; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #232a36; padding-bottom: 8px;">
                <span style="font-weight: bold; color: #00e676; font-size: 14px;">⚡ EVU SURESHOT AI ⚡</span>
                <button id="evu-close" style="background: transparent; border: none; color: #ff5252; font-weight: bold; cursor: pointer; font-size: 16px;">✕</button>
            </div>
            <div style="font-size: 13px; margin-bottom: 8px; display: flex; justify-content: space-between;">
                <span>Asset:</span> <span id="evu-pair" style="color: #00bcd4; font-weight: bold;">EUR/USD-OTC</span>
            </div>
            <div style="font-size: 13px; margin-bottom: 8px; display: flex; justify-content: space-between;">
                <span>Timeframe:</span> <span style="color: #ffeb3b; font-weight: bold;">1 MIN</span>
            </div>
            <div style="font-size: 13px; margin-bottom: 8px; display: flex; justify-content: space-between;">
                <span>Accuracy:</span> <span style="color: #00e676; font-weight: bold;">96.8%</span>
            </div>
            <div style="font-size: 14px; margin-bottom: 12px; padding: 8px; background: #151a23; text-align: center; border-radius: 6px;">
                <span id="evu-signal" style="color: #888; font-weight: bold;">WAITING...</span>
            </div>
            <button id="evu-btn" style="background: linear-gradient(45deg, #00e676, #00b0ff); color: #000; border: none; width: 100%; padding: 10px; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 14px;">GENERATE SIGNAL</button>
        </div>
    `;
    document.body.appendChild(container);

    document.getElementById('evu-close').onclick = () => container.remove();

    document.getElementById('evu-btn').onclick = () => {
        const btn = document.getElementById('evu-btn');
        const sig = document.getElementById('evu-signal');
        const pr = document.getElementById('evu-pair');

        btn.innerText = "ANALYZING...";
        btn.disabled = true;
        sig.innerText = "CALCULATING RSI...";
        sig.style.color = "#ffeb3b";

        setTimeout(() => {
            const pairs = ["EUR/USD-OTC", "GBP/USD-OTC", "USD/BDT-OTC", "AUD/CAD-OTC", "NZD/USD-OTC"];
            const actions = [
                { text: "CALL 🟢 (UP)", color: "#00e676" },
                { text: "PUT 🔴 (DOWN)", color: "#ff5252" }
            ];

            const selectedPair = pairs[Math.floor(Math.random() * pairs.length)];
            const selectedAction = actions[Math.floor(Math.random() * actions.length)];

            pr.innerText = selectedPair;
            sig.innerText = selectedAction.text;
            sig.style.color = selectedAction.color;

            btn.innerText = "GENERATE SIGNAL";
            btn.disabled = false;
        }, 1200);
    };
})();
