interface BackgroundGlowProps {
  reducedMotion: boolean;
}

export function BackgroundGlow({ reducedMotion }: BackgroundGlowProps) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 38%, #14100C 0%, #0A0A0C 62%, #0A0A0C 100%)",
        }}
      />
      <div
        className={`absolute left-1/2 top-[30%] h-[520px] w-[900px] ${
          reducedMotion ? "-translate-x-1/2 -translate-y-1/2 opacity-40" : "animate-glow-pulse"
        }`}
        style={{
          background: "radial-gradient(ellipse, rgba(230,200,136,0.14) 0%, rgba(230,200,136,0) 70%)",
        }}
      />
      <div
        className="absolute left-[18%] top-[20%] h-[380px] w-[280px] rotate-[8deg] opacity-[0.06]"
        style={{
          background: "linear-gradient(180deg, rgba(230,200,136,0.5) 0%, rgba(230,200,136,0) 100%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute right-[16%] top-[16%] h-[420px] w-[260px] -rotate-[6deg] opacity-[0.05]"
        style={{
          background: "linear-gradient(180deg, rgba(243,240,231,0.5) 0%, rgba(243,240,231,0) 100%)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}
