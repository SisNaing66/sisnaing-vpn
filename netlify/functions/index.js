const https = require('https');
const http = require('http');

const btoa = (str) => Buffer.from(str).toString('base64');
const atob = (str) => Buffer.from(str, 'base64').toString('utf-8');

exports.handler = async (event) => {
    const { url: subUrl, bug = 'mpt.com.mm', sni = 'premium.result69.my.id', port = '443' } = event.queryStringParameters;

    if (!subUrl) {
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
            body: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Config Transformer</title>
    <style>
        :root { --primary: #7c4dff; --bg: #f8f0fc; --text: #333; }
        body { font-family: 'Segoe UI', sans-serif; background-color: var(--bg); margin: 0; display: flex; justify-content: center; padding: 20px; color: var(--text); }
        .card { background: white; width: 100%; max-width: 400px; border-radius: 25px; box-shadow: 0 10px 30px rgba(124, 77, 255, 0.1); padding: 25px; border: 1px solid #eee; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        h2 { color: var(--primary); font-size: 20px; margin: 0; }
        .tabs { display: flex; gap: 10px; margin-bottom: 20px; }
        .tab { flex: 1; padding: 10px; text-align: center; background: #e0e0e0; border-radius: 12px; font-weight: bold; font-size: 14px; color: #666; cursor: pointer; }
        .tab.active { background: var(--primary); color: white; }
        label { display: block; font-weight: bold; margin: 15px 0 8px; font-size: 14px; }
        .port-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .port-item { padding: 12px; text-align: center; border-radius: 12px; border: 1px solid #ddd; cursor: pointer; font-weight: bold; transition: 0.3s; background: #fff; }
        .port-item.active { background: var(--primary); color: white; border-color: var(--primary); }
        select, input { width: 100%; padding: 15px; border-radius: 15px; border: 2px solid #eee; font-size: 14px; box-sizing: border-box; outline: none; transition: 0.3s; background: #fdfdfd; }
        select:focus, input:focus { border-color: var(--primary); }
        .btn-generate { width: 100%; padding: 16px; background: linear-gradient(90deg, #7c4dff, #b388ff); color: white; border: none; border-radius: 15px; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 25px; box-shadow: 0 5px 15px rgba(124, 77, 255, 0.3); }
        .footer-note { font-size: 11px; color: #999; text-align: center; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h2>Config Transformer</h2>
            <span style="font-size: 20px;">🌙</span>
        </div>
        <div class="tabs">
            <div class="tab active">Single</div>
            <div class="tab">Bulk</div>
            <div class="tab">History</div>
        </div>
        <form action="/.netlify/functions/index" method="GET">
            <label>Port</label>
            <div class="port-grid" id="portGrid">
                <div class="port-item active" onclick="selectPort('443', this)">443</div>
                <div class="port-item" onclick="selectPort('2053', this)">2053</div>
                <div class="port-item" onclick="selectPort('2083', this)">2083</div>
                <div class="port-item" onclick="selectPort('2087', this)">2087</div>
                <div class="port-item" onclick="selectPort('2096', this)">2096</div>
                <div class="port-item" onclick="selectPort('8443', this)">8443</div>
            </div>
            <input type="hidden" name="port" id="selectedPort" value="443">
            <label>Bug (Address Target)</label>
            <select name="bug">
                <option value="mpt.com.mm">mpt.com.mm</option>
                <option value="speedtest.net">speedtest.net</option>
                <option value="wavemoney.com.mm">wavemoney.com.mm</option>
                <option value="custom">Custom...</option>
            </select>
            <label>Original Domain (SNI/Host)</label>
            <input type="text" name="sni" value="premium.result69.my.id">
            <label>3x-ui Sub Link</label>
            <input type="text" name="url" placeholder="Paste Sub Link here..." required>
            <button type="submit" class="btn-generate">Transform Config</button>
        </form>
        <div class="footer-note">SisNaing VPN Service &copy; 2026</div>
    </div>
    <script>
        function selectPort(port, el) {
            document.querySelectorAll('.port-item').forEach(i => i.classList.remove('active'));
            el.classList.add('active');
            document.getElementById('selectedPort').value = port;
        }
    </script>
</body>
</html>`
        };
    }

    return new Promise((resolve) => {
        const client = subUrl.startsWith('https') ? https : http;
        client.get(subUrl, (res) => {
            const userInfo = res.headers['subscription-userinfo'];
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const decodedData = atob(data);
                    const links = decodedData.split('\n');
                    const transformedLinks = links.map(link => {
                        if (link.trim().startsWith('vless://')) {
                            try {
                                const vUrl = new URL(link.trim());
                                vUrl.hostname = bug;
                                vUrl.port = port;
                                vUrl.searchParams.set('security', 'tls');
                                vUrl.searchParams.set('sni', sni);
                                vUrl.searchParams.set('host', sni);
                                vUrl.searchParams.set('type', 'ws');
                                return vUrl.toString();
                            } catch (e) { return link; }
                        }
                        return link;
                    });

                    resolve({
                        statusCode: 200,
                        headers: {
                            'Content-Type': 'text/plain; charset=utf-8',
                            'Subscription-Userinfo': userInfo || '',
                            'Access-Control-Allow-Origin': '*'
                        },
                        body: btoa(transformedLinks.join('\n'))
                    });
                } catch (e) {
                    resolve({ statusCode: 500, body: "Error processing links." });
                }
            });
        }).on('error', (e) => {
            resolve({ statusCode: 500, body: "Fetch Error: " + e.message });
        });
    });
};

