import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as fs from 'fs';
import * as path from 'path';

const glbPath = path.join(process.cwd(), 'public/models/sleeper.glb');
const buffer = fs.readFileSync(glbPath);

const loader = new GLTFLoader();
loader.parse(buffer, '', (gltf) => {
  console.log('=== GLB Animation Clips ===');
  if (gltf.animations && gltf.animations.length > 0) {
    gltf.animations.forEach((clip, idx) => {
      console.log(`[${idx}] "${clip.name}" (duration: ${clip.duration.toFixed(2)}s, tracks: ${clip.tracks.length})`);
    });
  } else {
    console.log('No animation clips found');
  }

  console.log('\n=== Scene Hierarchy ===');
  gltf.scene.traverse((node) => {
    if (node.isSkinnedMesh || node.isMesh) {
      console.log(`Mesh: ${node.name} (bones: ${node.skeleton ? node.skeleton.bones.length : 0})`);
    }
  });

  process.exit(0);
}, undefined, (error) => {
  console.error('Error loading GLB:', error);
  process.exit(1);
});
