"use client";

import { useEffect, useRef } from "react";
import { CODE_CHARS, CODE_SNIPPETS } from "@/components/home/hero/code-snippets";

interface Column {
  x: number;
  y: number;
  speed: number;
  size: number;
  depth: number;
  text: string;
  offset: number;
}

function pickSnippet(index: number) {
  return CODE_SNIPPETS[index % CODE_SNIPPETS.length];
}

function randomChar() {
  return CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)] ?? "0";
}

export function CodeRainCanvas({
  active,
  parallaxX = 0,
  parallaxY = 0,
}: {
  active: boolean;
  parallaxX?: number;
  parallaxY?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const columnsRef = useRef<Column[]>([]);
  const frameRef = useRef<number | null>(null);
  const parallaxRef = useRef({ x: parallaxX, y: parallaxY });

  useEffect(() => {
    parallaxRef.current = { x: parallaxX, y: parallaxY };
  }, [parallaxX, parallaxY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const buildColumns = () => {
      const isMobile = width < 768;
      const gap = isMobile ? 22 : 18;
      const count = Math.max(12, Math.ceil(width / gap));
      columnsRef.current = Array.from({ length: count }, (_, index) => {
        const depth = 0.35 + Math.random() * 0.65;
        return {
          x: index * gap + Math.random() * 6,
          y: Math.random() * height,
          speed: (0.35 + Math.random() * 0.9) * depth,
          size: Math.round((isMobile ? 10 : 11) + depth * 5),
          depth,
          text: pickSnippet(index),
          offset: Math.random() * 100,
        };
      });
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildColumns();
    };

    const draw = () => {
      if (document.hidden) {
        frameRef.current = window.requestAnimationFrame(draw);
        return;
      }

      ctx.fillStyle = "rgba(10, 15, 20, 0.12)";
      ctx.fillRect(0, 0, width, height);

      const { x: px, y: py } = parallaxRef.current;

      for (const column of columnsRef.current) {
        column.y += column.speed;
        if (column.y > height + 120) {
          column.y = -120 - Math.random() * height * 0.4;
          column.text = pickSnippet(Math.floor(Math.random() * CODE_SNIPPETS.length));
        }

        const x = column.x + px * column.depth * 18;
        const y = column.y + py * column.depth * 12;
        const alpha = 0.08 + column.depth * 0.22;
        const isAccent = column.depth > 0.82;

        ctx.font = `${column.size}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
        ctx.textBaseline = "top";

        for (let i = 0; i < column.text.length; i += 1) {
          const charY = y - i * (column.size + 3);
          if (charY < -40 || charY > height + 20) continue;

          const fade = Math.max(0.15, 1 - i * 0.11);
          if (isAccent && i === 0) {
            ctx.fillStyle = `rgba(37, 211, 102, ${Math.min(0.85, alpha + 0.35) * fade})`;
          } else if (column.depth > 0.65) {
            ctx.fillStyle = `rgba(108, 76, 241, ${alpha * fade * 0.75})`;
          } else {
            ctx.fillStyle = `rgba(160, 190, 210, ${alpha * fade * 0.55})`;
          }

          const char = i === 0 ? column.text[i] : randomChar();
          ctx.fillText(char, x, charY);
        }
      }

      frameRef.current = window.requestAnimationFrame(draw);
    };

    resize();
    draw();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="hero-code-rain pointer-events-none absolute inset-0 h-full w-full touch-none opacity-80"
      aria-hidden
    />
  );
}
