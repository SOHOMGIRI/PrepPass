const fs = require('fs');

let content = fs.readFileSync('client/src/components/landing/HeroIllustration.jsx', 'utf8');

content = content.replace(/count: [0-9]+/g, (match) => {
    let count = parseInt(match.split(' ')[1]);
    return `count: ${Math.max(3, Math.floor(count / 4))}`;
});
content = content.replace(/r: Math.random\(\) \* 4 \+ 3/, 'r: Math.random() * 12 + 6');
content = content.replace(/r=\{leaf\.r \* 6\}/, 'r={leaf.r * 4}');
content = content.replace(/r=\{leaf\.r \* 1\.5\}/, 'r={leaf.r}');
content = content.replace(/const genButterflies = \[\];\s*for \(let i = 0; i < 15; i\+\+\)/, 'const genButterflies = [];\n    for (let i = 0; i < 6; i++)');
content = content.replace(/for \(let i = 0; i < 40; i\+\+\)/, 'for (let i = 0; i < 15; i++)');

fs.writeFileSync('client/src/components/landing/HeroIllustration.jsx', content, 'utf8');
