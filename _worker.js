export default {
  async fetch(request) {
    const url = new URL(request.url);

    // --- (၁) Website UI ပိုင်း ---
    if (url.pathname === '/') {
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SisNaing Sub Transformer</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); 
            margin: 0; padding: 20px; 
            display: flex; justify-content: center; min-height: 100vh;
        }
        .container { 
            background: white; padding: 25px; border-radius: 20px; 
            box-shadow: 0 10px 25px rgba(0,0,0,0.1); 
            width: 100%; max-width: 450px; 
        }
        h2 { text-align: center; color: #673ab7; margin-top: 0; font-size: 22px;}
        .form-group { margin-bottom: 18px; }
        label { display: block; font-weight: bold; margin-bottom: 8px; color: #333; font-size: 14px; }
        input[type="text"], select { 
            width: 100%; padding: 12px; border: 1px solid #ddd; 
            border-radius: 10px; box-sizing: border-box; font-size: 14px; 
            outline: none; background: #fff;
        }
        input[type="text"]:focus, select:focus { border-color: #8a2be2; }
        
        /* Port Grid Styles */
        .port-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .port-btn { 
            padding: 10px; border: 1px solid #ddd; background: #f9f9f9; 
            border-radius: 10px; cursor: pointer; text-align: center; 
            font-weight: bold; color: #555; transition: 0.3s;
        }
        .port-btn.active { background: #8a2be2; color: white; border-color: #8a2be2; }
        
        .custom-bug { display: none; margin-top: 10px; }
        
        /* Button Styles */
        .btn-group { display: flex; gap: 10px; margin-top: 10px; }
        button { 
            flex: 1; padding: 14px; border: none; border-radius: 10px; 
            font-weight: bold; font-size: 14px; cursor: pointer; color: white; transition: 0.3s; 
        }
        .btn-sub { background: #8a2be2; }
        .btn-sub:hover { background: #7b1fa2; }
        .btn-key { background: #ff4081; }
        .btn-key:hover { background: #f50057; }
        
        textarea { 
            width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 10px; 
            box-sizing: border-box; margin-top: 20px; resize: vertical; outline: none; 
            font-family: monospace; font-size: 13px;
        }
    </style>
</head>
<body>

<div class="container">
    <h2>SisNaing Config Transformer</h2>

    <div class="form-group">
        <label>Port</label>
        <div class="port-grid">
            <div class="port-btn active" onclick="setPort('443', this)">443</div>
            <div class="port-btn" onclick="setPort('2053', this)">2053</div>
            <div class="port-btn" onclick="setPort('2083', this)">2083</div>
            <div class="port-btn" onclick="setPort('2087', this)">2087</div>
            <div class="port-btn" onclick="setPort('2096', this)">2096</div>
            <div class="port-btn" onclick="setPort('8443', this)">8443</div>
        </div>
    </div>

    <div class="form-group">
        <label>Bug (Address Target)</label>
        <select id="bugSelect" onchange="toggleCustomBug()">
            <option value="mpt.com.mm">mpt.com.mm</option>
            <option value="speedtest.net">speedtest.net</option>
            <option value="wavemoney.com.mm">wavemoney.com.mm</option>
            <option value="truemoney.com.mm">truemoney.com.mm</option>
            <option value="mizzima.com">mizzima.com</option>
            <option value="yomabank.com">yomabank.com</option>
            <option value="mymedicine.com.mm">mymedicine.com.mm</option>
            <option value="custom">Custom...</option>
        </select>
        <input type="text" id="customBug" class="custom-bug" placeholder="Enter custom bug address...">
    </div>

    <div class="form-group">
        <label>Original Domain (SNI/Host)</label>
        <input type="text" id="sni" value="premium.galaxy1.my.id">
    </div>

    <div class="form-group">
        <label>Original 3x-ui Sub Link</label>
        <input type="text" id="subUrl" placeholder="http://.../sub/12345">
    </div>

    <div class="btn-group">
        <button class="btn-sub" onclick="generateSub()">Copy Sub Link</button>
        <button class="btn-key" onclick="getKeys()">View Keys</button>
    </div>

    <textarea id="output" rows="6" readonly placeholder="Result will appear here..."></textarea>
</div>

<script>
    let selectedPort = '443';

    function setPort(port, btn) {
        selectedPort = port;
        document.querySelectorAll('.port-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }

    function toggleCustomBug() {
        const select = document.getElementById('bugSelect');
        const customInput = document.getElementById('customBug');
        if (select.value === 'custom') {
            customInput.style.display = 'block';
            customInput.focus();
        } else {
            customInput.style.display = 'none';
        }
    }

    function getSelectedBug() {
        const select = document.getElementById('bugSelect');
        return select.value === 'custom' ? document.getElementById('customBug').value.trim() : select.value;
    }

    function buildApiUrl() {
        const subUrl = document.getElementById('subUrl').value.trim();
        const bug = getSelectedBug();
        const sni = document.getElementById('sni').value.trim();
        
        if (!subUrl) {
            alert("Please enter 3x-ui Sub Link first!");
            return null;
        }
        if (!bug) {
            alert("Please enter or select a Bug Address!");
            return null;
        }

        return window.location.origin + '/sub?url=' + encodeURIComponent(subUrl) + 
               '&bug=' + encodeURIComponent(bug) + 
               '&sni=' + encodeURIComponent(sni) + 
               '&port=' + selectedPort;
    }

    function generateSub() {
        const finalUrl = buildApiUrl();
        if (!finalUrl) return;

        const output = document.getElementById('output');
        output.value = finalUrl;
        
        output.select();
        document.execCommand("copy");
        alert("Sub Link Copied Successfully!");
    }

    async function getKeys() {
        const finalUrl = buildApiUrl();
        if (!finalUrl) return;

        const output = document.getElementById('output');
        output.value = "Transforming and fetching keys... Please wait.";

        try {
            const res = await fetch(finalUrl);
            if (!res.ok) throw new Error("Network Response Error");
            const base64Data = await res.text();
            output.value = atob(base64Data);
        } catch(e) {
            output.value = "Error fetching keys. Please check your sub link or server status.";
        }
    }
</script>

</body>
</html>
      `;
      return new Response(html, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
    }

    // --- (၂) Sub Link ပြောင်းပေးမည့် API ပိုင်း ---
    if (url.pathname === '/sub') {
      const subUrl = url.searchParams.get('url');
      const bug = url.searchParams.get('bug') || 'mpt.com.mm';
      const sni = url.searchParams.get('sni') || 'premium.galaxy1.my.id';
      const port = url.searchParams.get('port') || '443';

      if (!subUrl) return new Response("Error: Missing url parameter", { status: 400 });

      try {
        const response = await fetch(subUrl);
        const userInfo = response.headers.get('subscription-userinfo');
        const textData = await response.text();

        // 3x-ui က ထုတ်ပေးတဲ့ Base64 ကို ဖြည်မယ်
        const decodedData = atob(textData);
        const links = decodedData.split('\n');

        // VLESS Link တွေကို User ရွေးထားတဲ့ Data တွေနဲ့ Transform လုပ်မယ်
        const transformedLinks = links.map(link => {
          if (link.startsWith('vless://')) {
            try {
              const vUrl = new URL(link);
              vUrl.hostname = bug;      // User ရွေးထားတဲ့ Bug (Address Target)
              vUrl.port = port;         // User ရွေးထားတဲ့ Port
              
              vUrl.searchParams.set('security', 'tls');
              vUrl.searchParams.set('sni', sni);    // User ရိုက်ထည့်ထားတဲ့ SNI
              vUrl.searchParams.set('host', sni);   // User ရိုက်ထည့်ထားတဲ့ Host
              vUrl.searchParams.set('type', 'ws');
              
              return vUrl.toString();
            } catch (e) {
              return link;
            }
          }
          return link;
        });

        // ပြန်ပြီး Base64 ဖွဲ့မယ်
        const finalData = btoa(transformedLinks.join('\n'));

        // Header တွေ ပြန်ထည့်ပေးမယ်
        const headers = new Headers();
        headers.set('Content-Type', 'text/plain; charset=utf-8');
        headers.set('Access-Control-Allow-Origin', '*'); 
        if (userInfo) headers.set('subscription-userinfo', userInfo);

        return new Response(finalData, { status: 200, headers: headers });

      } catch (e) {
        return new Response("Error processing the sub link.", { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
      }
    }

    return new Response("Not Found", { status: 404 });
  }
};

