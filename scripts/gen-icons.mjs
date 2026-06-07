// Generates PWA PNG icons with no external dependencies (built-in zlib only).
// Draws an indigo gradient tile with a white speech bubble + three dots.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';

const OUT = new URL('../public/', import.meta.url);
mkdirSync(OUT, { recursive: true });

// --- CRC32 (for PNG chunks) ---
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}
function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // no filter
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

// --- drawing helpers ---
const lerp = (a, b, t) => Math.round(a + (b - a) * t);
function roundedRect(x, y, x0, y0, x1, y1, r) {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false;
  const cx = x < x0 + r ? x0 + r : x > x1 - r ? x1 - r : x;
  const cy = y < y0 + r ? y0 + r : y > y1 - r ? y1 - r : y;
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
}

function draw(size, maskable) {
  const rgba = Buffer.alloc(size * size * 4);
  const pad = maskable ? size * 0.0 : size * 0.0;
  const tileR = maskable ? 0 : size * 0.22; // rounded app-tile unless maskable (full bleed)
  // speech bubble geometry (scaled into central area for maskable safe zone)
  const inset = maskable ? size * 0.18 : size * 0.0;
  const bx0 = inset + size * 0.22, bx1 = size - inset - size * 0.22;
  const by0 = inset + size * 0.24, by1 = size - inset - size * 0.40;
  const bR = (bx1 - bx0) * 0.22;
  const dotR = size * 0.035;
  const dotY = (by0 + by1) / 2;
  const dotXs = [(bx0 + bx1) / 2 - (bx1 - bx0) * 0.22, (bx0 + bx1) / 2, (bx0 + bx1) / 2 + (bx1 - bx0) * 0.22];
  // tail
  const tailTipX = bx0 + (bx1 - bx0) * 0.30, tailTipY = by1 + size * 0.10;
  const tailLX = bx0 + (bx1 - bx0) * 0.18, tailRX = bx0 + (bx1 - bx0) * 0.46, tailTop = by1 - size * 0.02;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      // outside rounded tile => transparent
      if (!maskable && !roundedRect(x, y, pad, pad, size - pad, size - pad, tileR)) {
        rgba[i + 3] = 0; continue;
      }
      // gradient background
      const t = y / size;
      let r = lerp(99, 139, t), g = lerp(102, 92, t), b = lerp(241, 246, t), a = 255;

      // white bubble
      const inBubble = roundedRect(x, y, bx0, by0, bx1, by1, bR);
      // tail triangle
      const inTail = pointInTri(x, y, tailLX, tailTop, tailRX, tailTop, tailTipX, tailTipY);
      if (inBubble || inTail) { r = 245; g = 247; b = 255; }
      // dots inside bubble
      if (inBubble) {
        for (const dx of dotXs) {
          if ((x - dx) ** 2 + (y - dotY) ** 2 <= dotR * dotR) { r = 99; g = 102; b = 241; }
        }
      }
      rgba[i] = r; rgba[i + 1] = g; rgba[i + 2] = b; rgba[i + 3] = a;
    }
  }
  return encodePNG(size, size, rgba);
}
function pointInTri(px, py, ax, ay, bx, by, cx, cy) {
  const d1 = sign(px, py, ax, ay, bx, by);
  const d2 = sign(px, py, bx, by, cx, cy);
  const d3 = sign(px, py, cx, cy, ax, ay);
  const neg = d1 < 0 || d2 < 0 || d3 < 0;
  const pos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(neg && pos);
}
const sign = (px, py, ax, ay, bx, by) => (px - bx) * (ay - by) - (ax - bx) * (py - by);

writeFileSync(new URL('icon-192.png', OUT), draw(192, false));
writeFileSync(new URL('icon-512.png', OUT), draw(512, false));
writeFileSync(new URL('icon-maskable-512.png', OUT), draw(512, true));
writeFileSync(new URL('apple-touch-icon.png', OUT), draw(180, true));
console.log('icons written to public/');
