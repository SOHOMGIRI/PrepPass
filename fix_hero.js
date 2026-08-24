const fs = require('fs');
const file = 'client/src/components/landing/Hero.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/LOG IN\s*<\/Link>/, 'LOG IN\n                </Link>\n              </Magnetic>');
fs.writeFileSync(file, content, 'utf8');
