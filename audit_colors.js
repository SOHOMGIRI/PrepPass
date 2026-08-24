const fs = require('fs');
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
                results.push(file);
            }
        }
    });
    return results;
}
const files = walk('./client/src');
let count = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace indigo/blue/purple/teal with gold or text-primary depending on context
    
    // Logo text in NavBar:
    content = content.replace(/text-stamp-navy|text-white|text-indigo-100\/80/g, (match) => {
        if (file.includes('NavBar.jsx')) {
            // we will fix NavBar specifically
        }
        return match;
    });

    if (content !== original) {
        // fs.writeFileSync(file, content, 'utf8');
        // count++;
    }
});
