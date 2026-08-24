const fs = require('fs');
let content = fs.readFileSync('client/src/components/landing/HeroIllustration.jsx', 'utf8');

const bookContent = `
            {/* 3D Open Book */}
            <path d="M150 340 L 350 340 L 320 410 L 180 410 Z" fill="url(#bookGrad)" />
            {/* Flipping Page */}
            <path d="M250 330 L 350 340 L 320 410 L 250 410 Z" fill="#FFF4D6" style={{ transformOrigin: '250px 410px', animation: 'flipPage 4s ease-in-out infinite' }} />
            {/* Pages Edge */}
            <path d="M150 340 L 160 330 L 360 330 L 350 340 Z" fill="#D4AF37" />
            {/* Book Spine */}
            <path d="M250 330 L 250 410" stroke="#8B6F1F" strokeWidth="8" strokeLinecap="round" />
            {/* Hand Turning Page */}
            <g style={{ animation: 'turnHand 4s ease-in-out infinite', transformOrigin: '320px 450px' }}>
              <path d="M280 410 C 270 380, 300 370, 310 390 L 330 450 L 290 450 Z" fill="url(#faceGrad)" />
            </g>
`;
content = content.replace(/\{\/\* 3D Open Book \*\/\}[\s\S]*?strokeLinecap="round" \/>/g, bookContent);

fs.writeFileSync('client/src/components/landing/HeroIllustration.jsx', content, 'utf8');
