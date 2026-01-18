const fs = require('fs');
const path = require('path');

// SVG 아이콘 템플릿 (건물 아이콘)
const createSvgIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="#2563eb"/>
  <g transform="translate(${size * 0.15}, ${size * 0.15})">
    <!-- 건물 아이콘 -->
    <rect x="${size * 0.1}" y="${size * 0.25}" width="${size * 0.25}" height="${size * 0.45}" fill="white" rx="2"/>
    <rect x="${size * 0.4}" y="${size * 0.1}" width="${size * 0.3}" height="${size * 0.6}" fill="white" rx="2"/>
    <!-- 창문들 -->
    <rect x="${size * 0.14}" y="${size * 0.3}" width="${size * 0.07}" height="${size * 0.07}" fill="#2563eb"/>
    <rect x="${size * 0.24}" y="${size * 0.3}" width="${size * 0.07}" height="${size * 0.07}" fill="#2563eb"/>
    <rect x="${size * 0.14}" y="${size * 0.42}" width="${size * 0.07}" height="${size * 0.07}" fill="#2563eb"/>
    <rect x="${size * 0.24}" y="${size * 0.42}" width="${size * 0.07}" height="${size * 0.07}" fill="#2563eb"/>
    <rect x="${size * 0.45}" y="${size * 0.15}" width="${size * 0.08}" height="${size * 0.08}" fill="#2563eb"/>
    <rect x="${size * 0.57}" y="${size * 0.15}" width="${size * 0.08}" height="${size * 0.08}" fill="#2563eb"/>
    <rect x="${size * 0.45}" y="${size * 0.28}" width="${size * 0.08}" height="${size * 0.08}" fill="#2563eb"/>
    <rect x="${size * 0.57}" y="${size * 0.28}" width="${size * 0.08}" height="${size * 0.08}" fill="#2563eb"/>
    <rect x="${size * 0.45}" y="${size * 0.41}" width="${size * 0.08}" height="${size * 0.08}" fill="#2563eb"/>
    <rect x="${size * 0.57}" y="${size * 0.41}" width="${size * 0.08}" height="${size * 0.08}" fill="#2563eb"/>
    <!-- 문 -->
    <rect x="${size * 0.5}" y="${size * 0.54}" width="${size * 0.1}" height="${size * 0.16}" fill="#1d4ed8"/>
  </g>
</svg>
`.trim();

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// icons 디렉토리가 없으면 생성
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 각 사이즈별 SVG 아이콘 생성
sizes.forEach(size => {
  const svg = createSvgIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  fs.writeFileSync(path.join(iconsDir, filename), svg);
  console.log(`Created ${filename}`);
});

// favicon.ico용 SVG도 생성
const faviconSvg = createSvgIcon(32);
fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.svg'), faviconSvg);
console.log('Created favicon.svg');

console.log('\\nIcon generation complete!');
console.log('Note: For production, convert SVG files to PNG using tools like sharp or online converters.');
