import gsapLib from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

let registered = false;

export function getGsap() {
  if (!registered && typeof window !== 'undefined') {
    gsapLib.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return gsapLib;
}

export default getGsap();
