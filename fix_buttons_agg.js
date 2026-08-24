const fs = require('fs');
const path = require('path');

function replaceButtonClasses(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceButtonClasses(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Specifically target the InterviewCard.jsx one and AptitudePractice/TestMode
      if (content.includes('bg-stamp-navy') && content.includes('text-white')) {
        content = content.replace(/bg-stamp-navy/g, 'bg-gold');
        content = content.replace(/text-white/g, 'text-[#0B0A14]');
        content = content.replace(/ring-stamp-navy/g, 'ring-gold');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Aggressive fix in', fullPath);
      }
    }
  }
}

replaceButtonClasses('client/src');
