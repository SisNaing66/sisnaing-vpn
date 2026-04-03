const btoa = (str) => Buffer.from(str).toString('base64');
const atob = (str) => Buffer.from(str, 'base64').toString('utf-8');

exports.handler = async (event) => {
    const fetch = (await import('node-fetch')).default;
    const { url: subUrl, bug = 'mpt.com.mm', sni = 'premium.galaxy1.my.id', port = '443' } = event.queryStringParameters;

    if (!subUrl) {
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
            body: `
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>SisNaing Netlify Transformer</title>
                <style>
                    body { font-family: sans-serif; background: #f0f2f5; display: flex; justify-content: center; padding: 20px; }
                    .card { background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
                    input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; }
                    button { width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h2 style="text-align:center; color:#007bff;">SisNaing Sub Transformer</h2>
                    <form action="/.netlify/functions/index" method="GET">
                        <label>3x-ui Sub Link:</label>
                        <input type="text" name="url" placeholder="http://your-vps:2096/sub/..." required>
                        <label>Bug (Address):</label>
                        <input type="text" name="bug" value="mpt.com.mm">
                        <label>SNI / Host:</label>
                        <input type="text" name="sni" value="premium.galaxy1.my.id">
                        <label>Port:</label>
                        <input type="text" name="port" value="443">
                        <button type="submit">Generate Final Sub Link</button>
                    </form>
                    <p style="font-size: 12px; color: #666; margin-top: 15px;">* ရလာတဲ့လင့်ခ်ကို User App မှာထည့်ရင် GB/Date ပေါ်ပါမယ်။</p>
                </div>
            </body>
            </html>`
        };
    }

    try {
        const response = await fetch(subUrl);
        const userInfo = response.headers.get('subscription-userinfo');
        const textData = await response.text();
        const decodedData = atob(textData);
        const links = decodedData.split('\n');

        const transformedLinks = links.map(link => {
            if (link.startsWith('vless://')) {
                try {
                    const vUrl = new URL(link);
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

        const finalData = btoa(transformedLinks.join('\n'));
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Subscription-Userinfo': userInfo || '',
                'Access-Control-Allow-Origin': '*'
            },
            body: finalData
        };
    } catch (e) {
        return { statusCode: 500, body: "Error: Could not fetch sub link." };
    }
};
