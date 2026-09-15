import { useEffect, useRef } from "react";

interface DustCanvasProps {
  count: number;
  reducedMotion: boolean;
}

interface Mote {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  opacity: number;
}

export function DustCanvas({ count, reducedMotion }: DustCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const motes: Mote[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.6 + Math.random() * 1.4,
      speed: 4 + Math.random() * 8,
      drift: (Math.random() - 0.5) * 6,
      opacity: 0.12 + Math.random() * 0.22,
    }));

    if (reducedMotion) {
      ctx.clearRect(0, 0, width, height);
      for (const m of motes) {
        ctx.fillStyle = `rgba(230,200,136,${m.opacity * 0.6})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      return () => window.removeEventListener("resize", resize);
    }

    let raf = 0;
    let last = performance.now();
    function tick(now: number) {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      ctx!.clearRect(0, 0, width, height);
      for (const m of motes) {
        m.y -= m.speed * dt;
        m.x += m.drift * dt;
        if (m.y < -10) {
          m.y = height + 10;
          m.x = Math.random() * width;
        }
        if (m.x < -10) m.x = width + 10;
        if (m.x > width + 10) m.x = -10;
        ctx!.fillStyle = `rgba(230,200,136,${m.opacity})`;
        ctx!.beginPath();
        ctx!.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [count, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
    />
  );
}
