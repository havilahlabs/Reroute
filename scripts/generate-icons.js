const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Reroute logo: lavender circle with a white arrow curving back on itself
// representing "rerouting" / returning to focus
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B7FD4;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#6B5EC7;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background rounded square -->
  <rect width="1024" height="1024" rx="230" ry="230" fill="url(#bg)" />

  <!-- Reroute arrow: a curved path that goes forward, dips, and curves back up -->
  <!-- Main arrow body: a C-curve returning path -->
  <g transform="translate(512,512)" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round">
    <!-- Outer arc going right then down then left (the "drift" path) -->
    <path
      d="M -180,-60 C -180,-180 180,-180 180,-60 L 180,20"
      stroke="white"
      stroke-width="72"
      stroke-linecap="round"
      fill="none"
      opacity="0.35"
    />
    <!-- Main reroute arrow: curves back up -->
    <path
      d="M -180,-60 C -180,-180 180,-180 180,-60 L 180,80"
      stroke="white"
      stroke-width="72"
      stroke-linecap="round"
      fill="none"
    />
    <!-- Arrowhead pointing up on the right end -->
    <polyline
      points="110,30 180,80 250,30"
      stroke="white"
      stroke-width="72"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
    <!-- Small dot at start (the origin / goal) -->
    <circle cx="-180" cy="-60" r="44" fill="white" />
  </g>
</svg>`;

// Cleaner design: letter R with a reroute arrow integrated
const svgIconV2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B7FD4" />
      <stop offset="100%" style="stop-color:#5D52A8" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1024" height="1024" rx="220" ry="220" fill="url(#bg)" />

  <!-- Subtle inner glow circle -->
  <circle cx="512" cy="400" r="340" fill="white" opacity="0.05" />

  <!-- Reroute symbol: a path that goes straight then curves back -->
  <!-- Think of it as a road that diverges and returns -->
  <g transform="translate(512,512)" fill="none" stroke-linecap="round" stroke-linejoin="round">

    <!-- Left vertical bar (start/goal) -->
    <rect x="-260" y="-230" width="90" height="460" rx="45" fill="white" />

    <!-- Top horizontal connector -->
    <rect x="-215" y="-230" width="350" height="90" rx="45" fill="white" />

    <!-- Right side: curves down then back -->
    <!-- Upper right curve (downward part) -->
    <path
      d="M 180,-185 Q 270,-185 270,-95 L 270,60 Q 270,160 180,160 L 0,160"
      stroke="white"
      stroke-width="90"
      fill="none"
    />

    <!-- Arrow pointing left at the return -->
    <polygon
      points="30,105 -80,160 30,215"
      fill="white"
    />

  </g>
</svg>`;

async function generate() {
  const assetsDir = path.join(__dirname, '..', 'assets');

  // Generate icon.png (1024x1024)
  await sharp(Buffer.from(svgIconV2))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(assetsDir, 'icon.png'));
  console.log('✓ icon.png (1024x1024)');

  // Generate adaptive-icon.png (1024x1024, slightly smaller graphic for Android safe zone)
  const svgAdaptive = svgIconV2.replace('rx="220" ry="220"', 'rx="0" ry="0"').replace('fill="url(#bg)"', 'fill="#7C6FCD"');
  await sharp(Buffer.from(svgAdaptive))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(assetsDir, 'adaptive-icon.png'));
  console.log('✓ adaptive-icon.png (1024x1024)');

  // Generate favicon.png (48x48)
  await sharp(Buffer.from(svgIconV2))
    .resize(48, 48)
    .png()
    .toFile(path.join(assetsDir, 'favicon.png'));
  console.log('✓ favicon.png (48x48)');

  // Generate notification-icon.png (96x96, white on transparent for Android)
  const svgNotif = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
    <g transform="translate(512,512)" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <rect x="-260" y="-230" width="90" height="460" rx="45" fill="white" />
      <rect x="-215" y="-230" width="350" height="90" rx="45" fill="white" />
      <path d="M 180,-185 Q 270,-185 270,-95 L 270,60 Q 270,160 180,160 L 0,160" stroke="white" stroke-width="90" fill="none" />
      <polygon points="30,105 -80,160 30,215" fill="white" />
    </g>
  </svg>`;
  await sharp(Buffer.from(svgNotif))
    .resize(96, 96)
    .png()
    .toFile(path.join(assetsDir, 'notification-icon.png'));
  console.log('✓ notification-icon.png (96x96)');

  console.log('\nAll assets generated successfully.');
}

generate().catch(e => { console.error(e); process.exit(1); });
