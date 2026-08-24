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
      let changed = false;

      // Regex to match className="...", className={'...'}, or className={`...`}
      // This is a bit tricky, so we'll just do a global replace of 'bg-stamp-navy' to 'bg-gold'
      // ONLY on lines that also contain 'text-white'. This is still risky for multi-line.
      
      // Let's use a better approach: find all occurrences of bg-stamp-navy. 
      // If the surrounding 150 characters contain 'text-white', replace them.
      // Actually, since there are only a few files, let's write a targeted regex for className string literals and template literals.
      
      const regex = /className=(?:["']([^"']*)["']|\{`([^`]*)`\}|\{'([^']*)'\})/g;
      
      content = content.replace(regex, (match, p1, p2, p3) => {
        let classStr = p1 || p2 || p3;
        let isTemplate = p2 !== undefined;
        let isSingleQuoteObj = p3 !== undefined;
        
        if (!classStr) return match;
        
        const cls = classStr.split(/\s+/);
        if (cls.includes('bg-stamp-navy') && cls.includes('text-white')) {
          const newCls = cls.map(c => {
            if (c === 'bg-stamp-navy') return 'bg-gold';
            if (c === 'text-white') return 'text-[#0B0A14]';
            if (c === 'hover:bg-stamp-navy/90') return 'hover:bg-gold-dark';
            if (c === 'focus:ring-stamp-navy/50') return 'focus:ring-gold/50';
            if (c.includes('ring-stamp-navy')) return c.replace('ring-stamp-navy', 'ring-gold');
            return c;
          });
          changed = true;
          if (isTemplate) return `className={\`${newCls.join(' ')}\`}`;
          if (isSingleQuoteObj) return `className={'${newCls.join(' ')}'}`;
          return `className="${newCls.join(' ')}"`;
        }
        return match;
      });

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed buttons in', fullPath);
      }
    }
  }
}

replaceButtonClasses('client/src');
