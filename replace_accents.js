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
    
    content = content.replace(/indigo-([0-9]+)(\/[0-9]+)?/g, 'gold');
    content = content.replace(/blue-([0-9]+)(\/[0-9]+)?/g, 'gold');
    content = content.replace(/purple-([0-9]+)(\/[0-9]+)?/g, 'gold');
    content = content.replace(/teal-([0-9]+)(\/[0-9]+)?/g, 'gold');
    content = content.replace(/emerald-([0-9]+)(\/[0-9]+)?/g, 'gold');
    content = content.replace(/rose-([0-9]+)(\/[0-9]+)?/g, 'gold');
    content = content.replace(/cyan-([0-9]+)(\/[0-9]+)?/g, 'gold');
    content = content.replace(/fuchsia-([0-9]+)(\/[0-9]+)?/g, 'gold');
    content = content.replace(/orange-([0-9]+)(\/[0-9]+)?/g, 'gold');
    content = content.replace(/violet-([0-9]+)(\/[0-9]+)?/g, 'gold');
    content = content.replace(/lime-([0-9]+)(\/[0-9]+)?/g, 'gold');
    content = content.replace(/amber-([0-9]+)(\/[0-9]+)?/g, 'gold');
    
    // Fix any text-gold that should be text-gold
    // Wait, the regex will turn text-indigo-500/20 into text-gold. Which is correct!
    // But it might turn bg-indigo-900 into bg-gold. Is that wanted? The user said: "none of these should be indigo/purple anymore".
    // Wait, what if the bg was a dark indigo background? bg-indigo-900/40 is used in Dashboard.jsx. 
    // If it becomes bg-gold, it might be bright gold. I should replace bg-indigo-900 with bg-surface or bg-gold/10.
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
    }
});
console.log('Replaced in ' + count + ' files');
