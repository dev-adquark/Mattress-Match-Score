import { Vector3 } from 'three';

export interface CameraKeyframe {
  position: Vector3;
  lookAt: Vector3;
}

export const homeKeyframes: CameraKeyframe[] = [
  { position: new Vector3(0, 1.2, 9), lookAt: new Vector3(0, 0.6, 0) },
  { position: new Vector3(-3.5, 0.6, 5), lookAt: new Vector3(0, 0.3, 0) },
  { position: new Vector3(0, 2.2, 3.2), lookAt: new Vector3(0, 0.4, 0) },
];

export const quizResultsKeyframes: CameraKeyframe[] = [
  { position: new Vector3(2.5, 1.6, 4), lookAt: new Vector3(0, 0.2, 0) },
  { position: new Vector3(0, 1.4, 5.5), lookAt: new Vector3(0, 0.5, 0) },
];
