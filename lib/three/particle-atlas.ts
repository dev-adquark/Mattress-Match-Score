import { CanvasTexture, SRGBColorSpace } from 'three';

let cachedAtlasTexture: CanvasTexture | null = null;

export function createParticleAtlasTexture(): CanvasTexture {
  if (cachedAtlasTexture) return cachedAtlasTexture;

  const size = 256;
  const cellSize = size / 2;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, size, size);

  // Cell 0: Soft glow dot
  {
    const x = cellSize * 0.5;
    const y = cellSize * 0.5;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, cellSize * 0.4);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, cellSize, cellSize);
  }

  // Cell 1: Four-point sparkle
  {
    const x = cellSize + cellSize * 0.5;
    const y = cellSize * 0.5;
    const r = cellSize * 0.3;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.lineTo(x + r, y);
    ctx.lineTo(x, y + r);
    ctx.lineTo(x - r, y);
    ctx.closePath();
    ctx.stroke();
  }

  // Cell 2: Thin ring
  {
    const x = cellSize * 0.5;
    const y = cellSize + cellSize * 0.5;
    const r = cellSize * 0.35;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Cell 3: Soft bloom
  {
    const x = cellSize + cellSize * 0.5;
    const y = cellSize + cellSize * 0.5;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, cellSize * 0.45);
    gradient.addColorStop(0, 'rgba(200, 230, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(200, 230, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(cellSize, cellSize, cellSize, cellSize);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  cachedAtlasTexture = texture;
  return texture;
}
