const fs = require('fs');

let content = fs.readFileSync('client/src/components/landing/HeroIllustration.jsx', 'utf8');

// Modify the clusters to extend massively to the left (negative X coordinates)
content = content.replace(
  /const clusters = \[[\s\S]*?\];/,
`const clusters = [
      { cx: 350, cy: 150, r: 180, count: 60 },
      { cx: 200, cy: 250, r: 150, count: 50 },
      { cx: 500, cy: 200, r: 140, count: 50 },
      { cx: 650, cy: 300, r: 120, count: 40 },
      { cx: 100, cy: 350, r: 120, count: 40 },
      { cx: 400, cy: 50, r: 140, count: 40 },
      { cx: 800, cy: 350, r: 100, count: 30 },
      // NEW LEFT-EXTENDING CLUSTERS (Shading the text)
      { cx: -100, cy: 180, r: 160, count: 50 },
      { cx: -250, cy: 250, r: 140, count: 40 },
      { cx: -400, cy: 150, r: 150, count: 40 },
      { cx: -550, cy: 220, r: 120, count: 30 },
      { cx: 0, cy: 100, r: 150, count: 40 }
    ];`
);

// Add more physical branches extending left
content = content.replace(
  /\{\/\* Secondary intricate branches \*\/\}[\s\S]*?<\/g>/,
  `{/* Secondary intricate branches */}
            <path d="M640 570 Q 700 450, 650 350" strokeWidth="8" />
            <path d="M340 450 Q 250 350, 300 250" strokeWidth="8" />
            <path d="M510 300 Q 550 200, 480 120" strokeWidth="6" />
            <path d="M750 425 Q 850 400, 950 300" strokeWidth="6" />
            <path d="M150 325 Q 50 250, 20 150" strokeWidth="6" />
            
            {/* NEW: Massive branches extending left to provide shade over the text */}
            <path d="M280 400 Q 0 300, -200 250" strokeWidth="12" />
            <path d="M-50 290 Q -250 200, -400 150" strokeWidth="10" />
            <path d="M-150 240 Q -400 150, -550 200" strokeWidth="8" />
            <path d="M120 260 Q -50 150, -100 100" strokeWidth="8" />
            <path d="M-200 250 Q -300 350, -450 300" strokeWidth="6" />
          </g>`
);

content = content.replace(
  /\{\/\* Secondary intricate branches \*\/\}[\s\S]*?<\/g>/,
  `{/* Secondary intricate branches */}
            <path d="M640 570 Q 700 450, 650 350" strokeWidth="8" />
            <path d="M340 450 Q 250 350, 300 250" strokeWidth="8" />
            <path d="M510 300 Q 550 200, 480 120" strokeWidth="6" />
            <path d="M750 425 Q 850 400, 950 300" strokeWidth="6" />
            <path d="M150 325 Q 50 250, 20 150" strokeWidth="6" />
            
            {/* NEW: Massive branches extending left to provide shade over the text */}
            <path d="M280 400 Q 0 300, -200 250" strokeWidth="12" />
            <path d="M-50 290 Q -250 200, -400 150" strokeWidth="10" />
            <path d="M-150 240 Q -400 150, -550 200" strokeWidth="8" />
            <path d="M120 260 Q -50 150, -100 100" strokeWidth="8" />
            <path d="M-200 250 Q -300 350, -450 300" strokeWidth="6" />
          </g>`
);

fs.writeFileSync('client/src/components/landing/HeroIllustration.jsx', content, 'utf8');
