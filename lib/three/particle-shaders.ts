export const particleVertexShader = `
  attribute float aSize;
  attribute float aAtlasIndex;
  attribute float aAlpha;

  varying float vAtlasIndex;
  varying float vAlpha;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    vAtlasIndex = aAtlasIndex;
    vAlpha = aAlpha;
  }
`;

export const particleFragmentShader = `
  uniform sampler2D map;
  varying float vAtlasIndex;
  varying float vAlpha;

  void main() {
    vec2 cell = vec2(mod(vAtlasIndex, 2.0), floor(vAtlasIndex * 0.5)) * 0.5;
    vec2 uv = cell + gl_PointCoord * 0.5;

    vec4 texColor = texture2D(map, uv);
    gl_FragColor = vec4(texColor.rgb, texColor.a * vAlpha);

    if (gl_FragColor.a < 0.1) discard;
  }
`;
