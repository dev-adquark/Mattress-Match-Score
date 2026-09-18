export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
    return !!gl;
  } catch {
    return false;
  }
}
