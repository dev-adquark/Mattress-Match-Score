import { MathUtils } from 'three';

export function computeTargetPositions(
  routeContext: 'home' | 'quiz-results',
  progressOrBeat: number,
  count: number
): Float32Array {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    // Deterministic pseudo-random using index
    const rand1 = Math.sin(i * 12.9898) * 43758.5453;
    const rand2 = Math.sin(i * 78.233) * 43758.5453;
    const rand3 = Math.sin(i * 45.164) * 43758.5453;

    const r1 = rand1 - Math.floor(rand1);
    const r2 = rand2 - Math.floor(rand2);
    const r3 = rand3 - Math.floor(rand3);

    let x, y, z;

    if (routeContext === 'home') {
      // Home: 3 formations blending via progress (0..1)
      // 0-0.33: scattered ambient
      // 0.33-0.67: funnel converging toward mattress
      // 0.67-1.0: halo around mattress

      if (progressOrBeat < 0.33) {
        // Scattered ambient volume
        x = (r1 - 0.5) * 8;
        y = (r2 - 0.5) * 5 + 2;
        z = (r3 - 0.5) * 8;
      } else if (progressOrBeat < 0.67) {
        // Funnel converging
        const t = (progressOrBeat - 0.33) / 0.34;
        const scatterX = (r1 - 0.5) * 8;
        const scatterY = (r2 - 0.5) * 5 + 2;
        const scatterZ = (r3 - 0.5) * 8;

        x = MathUtils.lerp(scatterX, scatterX * 0.2, t);
        y = MathUtils.lerp(scatterY, 1.2, t);
        z = MathUtils.lerp(scatterZ, scatterZ * 0.1, t);
      } else {
        // Halo around mattress
        const angle = (r1 * Math.PI * 2);
        const radius = 2.5 + r2 * 0.5;
        x = Math.cos(angle) * radius;
        y = 1 + (r3 - 0.5) * 0.8;
        z = Math.sin(angle) * radius;
      }
    } else {
      // Quiz/results: binary (0 = Matching, 1 = Score Reveal)
      if (progressOrBeat < 0.5) {
        // Matching: scattered around the scene
        x = (r1 - 0.5) * 6;
        y = (r2 - 0.5) * 4 + 1.5;
        z = (r3 - 0.5) * 6;
      } else {
        // Score Reveal: halo, slightly tighter
        const angle = r1 * Math.PI * 2;
        const radius = 2 + r2 * 0.3;
        x = Math.cos(angle) * radius;
        y = 1.2 + (r3 - 0.5) * 0.6;
        z = Math.sin(angle) * radius;
      }
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  return positions;
}
