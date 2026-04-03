const btoa = (str) => Buffer.from(str).toString('base64');
const atob = (str) => Buffer.from(str, 'base64').toString('utf-8');

exports.handler = async (event) => {
    const { url: subUrl, bug = 'mpt.com.mm', sni = 'premium.galaxy1.my.id', port = '443' } = event.queryStringParameters;

    // Website UI ပေါ်အောင် လုပ်ခြင်း
    if (!subUrl) {
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'text/html' },
            body: `<html><body style="font-family:sans-serif; text-align:center; padding:50px;">
                <h2>SisNaing Netlify Transformer</h2>
                <form action="/.netlify/functions/index" method="GET">
                    Sub Link: <input type="text" name="url" style="width:300px;" required><br><br>
                    Bug: <input type="text" name="bug" value="mpt.com.mm"><br><br>
                    SNI: <input type="text" name="sni" value="premium.galaxy1.my.id"><br><br>
                    Port: <input type="text" name="port" value="443"><br><br>
                    <button type="submit">Get Transformed Link</button>
                </form>
            </body></html>`
        };
    }

    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(subUrl);
        const userInfo = response.headers.get('subscription-userinfo');
        const textData = await response.text();
        const decodedData = atob(textData);
        const links = decodedData.split('\n');

        const transformedLinks = links.map(link => {
            if (link.startsWith('vless://')) {
                let parts = link.split('@');
                let addressPart = parts[1].split('?')[0];
                let params = parts[1].split('?')[1];
                return `${parts[0]}@${bug}:${port}?${params.replace(/sni=[^&]*/, 'sni=' + sni).replace(/host=[^&]*/, 'host=' + sni).replace(/security=[^&]*/, 'security=tls')}`;
            }
            return link;
        });

        const finalData = btoa(transformedLinks.join('\n'));
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/plain',
                'Subscription-Userinfo': userInfo || ''
            },
            body: finalData
        };
    } catch (e) {
        return { statusCode: 500, body: "Error processing link" };
    }
};
