'use client';

import { useEffect, useRef } from 'react';
import { getGsap, ScrollTrigger } from '@/lib/client/gsap';
import { narrativeStore } from '@/lib/three/narrative-store';

interface CinematicStageProps {
  hero: React.ReactNode;
  problem: React.ReactNode;
  profileTeaser: React.ReactNode;
}

export function CinematicStage({ hero, problem, profileTeaser }: CinematicStageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getGsap();
    if (!wrapperRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => narrativeStore.getState().setProgress(self.progress),
    });

    return () => trigger.kill();
  }, []);

  return (
    <div ref={wrapperRef} className="relative h-[500vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6">{hero}</div>
      </div>

      <div className="sticky top-0 flex h-screen items-center justify-center">
        <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6">{problem}</div>
      </div>

      <div className="sticky top-0 flex h-screen items-center justify-center">
        <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6">{profileTeaser}</div>
      </div>
    </div>
  );
}
