import { Vector3 } from 'three';

export interface CameraKeyframe {
  position: Vector3;
  lookAt: Vector3;
}

export const homeKeyframes: CameraKeyframe[] = [
  { position: new Vector3(3.4, 2.0, 7.2), lookAt: new Vector3(-7, 1.05, 0) },
  { position: new Vector3(1.6, 1.7, 5.4), lookAt: new Vector3(0, 1.15, 0) },
  { position: new Vector3(2.6, 1.5, 4.6), lookAt: new Vector3(0, 0.95, 0) },
];

export const quizResultsKeyframes: CameraKeyframe[] = [
  { position: new Vector3(2.5, 1.6, 4), lookAt: new Vector3(0, 0.2, 0) },
  { position: new Vector3(0, 1.4, 5.5), lookAt: new Vector3(0, 0.5, 0) },
];
