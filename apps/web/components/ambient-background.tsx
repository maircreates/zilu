'use client';

import { useEffect, useRef } from 'react';

const ribbons = [
  { color: [35, 211, 130], width: 0.22, y: 0.18, speed: 0.11, phase: 0.2 },
  { color: [17, 139, 153], width: 0.29, y: 0.47, speed: -0.075, phase: 2.4 },
  { color: [240, 116, 87], width: 0.16, y: 0.72, speed: 0.065, phase: 4.1 },
  { color: [155, 108, 255], width: 0.12, y: 0.35, speed: -0.045, phase: 5.6 },
];

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let width = 0;
    let height = 0;
    let pointerX = 0.58;
    let pointerY = 0.38;
    let currentX = pointerX;
    let currentY = pointerY;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.max(1, Math.floor(width * scale));
      canvas.height = Math.max(1, Math.floor(height * scale));
      context.setTransform(scale, 0, 0, scale, 0, 0);
    };

    const trackPointer = (event: PointerEvent) => {
      pointerX = event.clientX / window.innerWidth;
      pointerY = event.clientY / window.innerHeight;
    };

    const drawBloom = (x: number, y: number, radius: number, color: string) => {
      const glow = context.createRadialGradient(x, y, 0, x, y, radius);
      glow.addColorStop(0, color);
      glow.addColorStop(0.45, color.replace('0.28', '0.12'));
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      context.fillStyle = glow;
      context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    };

    const render = (time = 0) => {
      const seconds = time * 0.001;
      currentX += (pointerX - currentX) * 0.025;
      currentY += (pointerY - currentY) * 0.025;

      context.clearRect(0, 0, width, height);
      context.save();
      context.globalCompositeOperation = 'screen';

      drawBloom(
        width * currentX,
        height * currentY,
        Math.max(width, height) * 0.42,
        'rgba(34,210,130,0.28)',
      );
      drawBloom(
        width * (0.82 - currentX * 0.08),
        height * (0.18 + currentY * 0.1),
        Math.max(width, height) * 0.38,
        'rgba(91,72,255,0.28)',
      );

      context.lineCap = 'round';
      context.filter = 'blur(30px)';

      ribbons.forEach((ribbon, index) => {
        const drift = Math.sin(seconds * ribbon.speed + ribbon.phase) * height * 0.16;
        const sway = Math.cos(seconds * ribbon.speed * 0.7 + ribbon.phase) * width * 0.08;
        const [red, green, blue] = ribbon.color;
        const gradient = context.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, `rgba(${red},${green},${blue},0)`);
        gradient.addColorStop(0.32, `rgba(${red},${green},${blue},0.18)`);
        gradient.addColorStop(0.68, `rgba(${red},${green},${blue},0.3)`);
        gradient.addColorStop(1, `rgba(${red},${green},${blue},0)`);

        context.beginPath();
        context.moveTo(-width * 0.18, height * ribbon.y + drift);
        context.bezierCurveTo(
          width * 0.22 + sway,
          height * (ribbon.y - 0.42) - drift * 0.4,
          width * 0.58 - sway,
          height * (ribbon.y + 0.48) + drift * 0.55,
          width * 1.18,
          height * (ribbon.y - 0.06) - drift * 0.3,
        );
        context.strokeStyle = gradient;
        context.lineWidth = Math.max(86, Math.min(width, height) * ribbon.width);
        context.globalAlpha = 0.9 - index * 0.1;
        context.stroke();
      });

      context.restore();

      if (!reducedMotion) frame = window.requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', trackPointer, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', trackPointer);
    };
  }, []);

  return (
    <div className="ambient-field" aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="ambient-grain" />
      <div className="ambient-calligraphy">字路</div>
    </div>
  );
}
