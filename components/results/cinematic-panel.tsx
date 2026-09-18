export function CinematicPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl border border-white/40 bg-white/60 p-1 shadow-xl backdrop-blur-md sm:p-2">
      {children}
    </div>
  );
}
