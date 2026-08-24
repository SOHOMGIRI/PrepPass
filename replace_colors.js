const fs = require('fs');
const path = require('path');

function replaceWhiteWithGold(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceWhiteWithGold(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('text-white')) {
        content = content.replace(/text-white/g, 'text-gold');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', fullPath);
      }
    }
  }
}

replaceWhiteWithGold('client/src/pages');
replaceWhiteWithGold('client/src/components/landing');
