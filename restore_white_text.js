const fs = require('fs');
const path = require('path');

function replaceGoldWithWhite(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceGoldWithWhite(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Only replace text-gold in paragraph tags, span tags, and standard body text
      // We'll just replace all text-gold with text-white, and then selectively restore headings to gold if needed.
      // Actually, for maximum contrast and readability since the user complained about invisible text,
      // let's just make everything text-white again, which looks elegant.
      if (content.includes('text-gold')) {
        content = content.replace(/text-gold/g, 'text-white');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', fullPath);
      }
    }
  }
}

replaceGoldWithWhite('client/src/pages');
replaceGoldWithWhite('client/src/components/landing');
