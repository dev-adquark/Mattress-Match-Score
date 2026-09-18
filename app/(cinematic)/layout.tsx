import { ReactNode } from "react";
import { SceneLoader } from "@/components/three/scene-loader";

interface CinematicLayoutProps {
  children: ReactNode;
}

export default function CinematicLayout({ children }: CinematicLayoutProps) {
  return (
    <>
      <SceneLoader />
      {children}
    </>
  );
}
