import { ReactNode } from "react";
import { SceneLoader } from "@/components/three/scene-loader";

interface CinematicLayoutProps {
  children: ReactNode;
}

export default function CinematicLayout({ children }: CinematicLayoutProps) {
  return (
    <>
      <SceneLoader />
      {/*
        SceneLoader renders a `position: fixed; z-index: 0` full-viewport canvas.
        Per CSS stacking rules, a positioned element with z-index 0 paints ABOVE
        ordinary (non-positioned) in-flow content regardless of DOM order — so
        without an explicit stacking context here, the decorative canvas visually
        covers real page content as soon as the page is taller than one viewport
        and the user scrolls. The homepage's own CinematicStage already guards
        against this internally (each section is `relative z-10`), but /match,
        /match/full, and /results rendered their content with no stacking
        context at all, so the canvas painted over their form fields and results
        on scroll. Wrapping every route in this group fixes all of them at once.
      */}
      <div className="relative z-10">{children}</div>
    </>
  );
}
