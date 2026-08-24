const fs = require('fs');
const path = require('path');

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

walkSync('client/src', (filePath) => {
    if (!filePath.endsWith('.jsx')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    let original = content;

    // Pattern 1: bg-gold ... text-white (ensuring it's not bg-gold/something)
    content = content.replace(/bg-gold(?![\/\w])([^"']*)text-white/g, 'bg-gold$1text-[#0B0A14]');
    
    // Some lines might be text-white ... bg-gold. Let's run a second pass for those.
    content = content.replace(/text-white([^"']*)bg-gold(?![\/\w])/g, 'text-[#0B0A14]$1bg-gold');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
});
