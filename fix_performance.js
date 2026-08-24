const fs = require('fs');

let content = fs.readFileSync('client/src/components/GlobalBackground.jsx', 'utf8');

// Remove aurora blobs
content = content.replace(/\{\/\*\s*Rich Aurora Gradient Blobs\s*\*\/\}[\s\S]*?<audio/m, '<audio');

fs.writeFileSync('client/src/components/GlobalBackground.jsx', content, 'utf8');
