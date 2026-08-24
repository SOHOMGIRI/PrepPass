const fs = require('fs');

function fixInputs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/bg-stamp-navy\/[0-9]+/g, 'bg-white/5 text-white');
  content = content.replace(/bg-gold\/5 px-4 py-3 text-text-secondary/g, 'bg-red-500/10 px-4 py-3 text-white');
  content = content.replace(/text-text-secondary placeholder-white\/40/g, 'text-white placeholder-white/40');
  
  // Fix autofill styling in Tailwind via style
  fs.writeFileSync(filePath, content, 'utf8');
}

fixInputs('client/src/pages/Login.jsx');
fixInputs('client/src/pages/Register.jsx');

// Add global autofill fix to index.css
let css = fs.readFileSync('client/src/index.css', 'utf8');
if (!css.includes('autofill')) {
  css += `
/* Fix Chrome Autofill */
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active{
    -webkit-box-shadow: 0 0 0 30px #130E2E inset !important;
    -webkit-text-fill-color: white !important;
    transition: background-color 5000s ease-in-out 0s;
}
`;
  fs.writeFileSync('client/src/index.css', css, 'utf8');
}

