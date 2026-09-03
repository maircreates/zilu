'use client';

import { useEffect, useRef } from 'react';

const darkRibbons = [
  { color: [35, 211, 130], width: 0.22, y: 0.18, speed: 0.11, phase: 0.2 },
  { color: [17, 139, 153], width: 0.29, y: 0.47, speed: -0.075, phase: 2.4 },
  { color: [240, 116, 87], width: 0.16, y: 0.72, speed: 0.065, phase: 4.1 },
  { color: [155, 108, 255], width: 0.12, y: 0.35, speed: -0.045, phase: 5.6 },
];

const lightRibbons = [
  { color: [20, 169, 116], width: 0.23, y: 0.2, speed: 0.1, phase: 0.3 },
  { color: [66, 126, 222], width: 0.27, y: 0.5, speed: -0.07, phase: 2.6 },
  { color: [236, 108, 78], width: 0.15, y: 0.73, speed: 0.06, phase: 4.2 },
  { color: [246, 181, 78], width: 0.11, y: 0.34, speed: -0.04, phase: 5.7 },
];

export function AmbientBackground({ mode }: { mode: 'light' | 'dark' }) {
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

    const drawCyberVeil = (seconds: number) => {
      context.save();
      context.globalCompositeOperation = 'screen';
      context.lineCap = 'round';

      Array.from({ length: 14 }, (_, index) => {
        const lane = ((index * 0.137 + 0.04) % 1) * width;
        const travel = (seconds * (18 + (index % 5) * 7) + index * 71) % (height * 1.45);
        const y = travel - height * 0.22;
        const length = 32 + (index % 4) * 29;
        const hue = index % 3 === 0 ? '118,255,214' : index % 3 === 1 ? '72,205,255' : '195,92,255';
        const beam = context.createLinearGradient(lane, y - length, lane, y + length);
        beam.addColorStop(0, `rgba(${hue},0)`);
        beam.addColorStop(0.65, `rgba(${hue},0.22)`);
        beam.addColorStop(1, `rgba(${hue},0)`);
        context.strokeStyle = beam;
        context.lineWidth = index % 4 === 0 ? 2 : 1;
        context.shadowColor = `rgba(${hue},0.7)`;
        context.shadowBlur = index % 4 === 0 ? 18 : 9;
        context.beginPath();
        context.moveTo(lane, y - length);
        context.quadraticCurveTo(lane + Math.sin(seconds * 0.5 + index) * 12, y, lane, y + length);
        context.stroke();
      });

      context.restore();
    };

    const drawSolarVeil = (seconds: number) => {
      context.save();
      context.globalCompositeOperation = 'multiply';
      context.filter = 'blur(18px)';
      context.lineCap = 'round';

      Array.from({ length: 7 }, (_, index) => {
        const x = width * (0.06 + index * 0.165) + Math.sin(seconds * 0.08 + index) * 42;
        const y = height * (0.8 - ((seconds * 0.012 + index * 0.17) % 0.9));
        const radius = 28 + (index % 3) * 17;
        const glow = context.createRadialGradient(x, y, 0, x, y, radius);
        glow.addColorStop(0, index % 2 ? 'rgba(255,190,76,0.22)' : 'rgba(35,170,112,0.18)');
        glow.addColorStop(1, 'rgba(255,255,255,0)');
        context.fillStyle = glow;
        context.beginPath();
        context.ellipse(x, y, radius * 0.55, radius, Math.sin(index) * 0.5, 0, Math.PI * 2);
        context.fill();
      });

      const sunlight = context.createLinearGradient(0, 0, width, height);
      sunlight.addColorStop(0, 'rgba(255,255,255,0)');
      sunlight.addColorStop(0.5, 'rgba(255,207,104,0.13)');
      sunlight.addColorStop(1, 'rgba(255,255,255,0)');
      context.strokeStyle = sunlight;
      context.lineWidth = Math.max(80, width * 0.09);
      context.beginPath();
      context.moveTo(width * 0.15, -height * 0.2);
      context.bezierCurveTo(width * 0.32, height * 0.3, width * 0.66, height * 0.44, width * 0.92, height * 1.2);
      context.stroke();
      context.restore();
    };

    const render = (time = 0) => {
      const seconds = time * 0.001;
      currentX += (pointerX - currentX) * 0.025;
      currentY += (pointerY - currentY) * 0.025;

      context.clearRect(0, 0, width, height);
      context.save();
      const dark = mode === 'dark';
      const ribbons = dark ? darkRibbons : lightRibbons;
      context.globalCompositeOperation = dark ? 'screen' : 'source-over';

      drawBloom(
        width * currentX,
        height * currentY,
        Math.max(width, height) * 0.42,
        dark ? 'rgba(34,210,130,0.28)' : 'rgba(37,184,128,0.18)',
      );
      drawBloom(
        width * (0.82 - currentX * 0.08),
        height * (0.18 + currentY * 0.1),
        Math.max(width, height) * 0.38,
        dark ? 'rgba(91,72,255,0.28)' : 'rgba(72,122,235,0.16)',
      );

      context.lineCap = 'round';
      context.filter = 'blur(30px)';

      ribbons.forEach((ribbon, index) => {
        const drift = Math.sin(seconds * ribbon.speed + ribbon.phase) * height * 0.16;
        const sway = Math.cos(seconds * ribbon.speed * 0.7 + ribbon.phase) * width * 0.08;
        const [red, green, blue] = ribbon.color;
        const gradient = context.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, `rgba(${red},${green},${blue},0)`);
        gradient.addColorStop(0.32, `rgba(${red},${green},${blue},${dark ? 0.18 : 0.1})`);
        gradient.addColorStop(0.68, `rgba(${red},${green},${blue},${dark ? 0.3 : 0.2})`);
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
      if (dark) drawCyberVeil(seconds);
      else drawSolarVeil(seconds);

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
  }, [mode]);

  return (
    <div className="ambient-field" aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="ambient-grain" />
      <div className="ambient-calligraphy">字路</div>
    </div>
  );
}
