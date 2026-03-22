import { motion } from "motion/react";
import { useEffect, useRef } from "react";

interface Firefly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  alphaDir: number;
  r: number;
}

interface Particle {
  x: number;
  y: number;
  vy: number;
  alpha: number;
  r: number;
  type: "bubble" | "leaf";
  vx: number;
  rotation: number;
  rotationSpeed: number;
}

interface LilyPad {
  x: number;
  y: number;
  r: number;
  bobOffset: number;
  bobSpeed: number;
}

export function PondEcosystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftGifRef = useRef<HTMLImageElement>(null);
  const rightGifRef = useRef<HTMLImageElement>(null);

  // Store lily pad refs for position sync
  const mascotPadLeftRef = useRef<LilyPad | null>(null);
  const mascotPadRightRef = useRef<LilyPad | null>(null);
  const tRef = useRef(0);

  // Sync GIF overlay positions each animation frame
  useEffect(() => {
    let rafId: number;
    const sync = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      const leftImg = leftGifRef.current;
      const rightImg = rightGifRef.current;
      if (canvas && container && leftImg && rightImg) {
        const t = tRef.current;
        const H = canvas.offsetHeight;
        const WATER_Y = H * 0.55;
        const updateImg = (img: HTMLImageElement, lp: LilyPad | null) => {
          if (!lp) return;
          const bob = Math.sin(t * lp.bobSpeed * 0.05 + lp.bobOffset) * 2;
          const padY = lp.y + bob;
          const s = lp.r * 2.2;
          const left = lp.x - s / 2;
          const top = padY - lp.r * 0.55 - s / 2;
          img.style.left = `${left}px`;
          img.style.top = `${top}px`;
          img.style.width = `${s}px`;
          img.style.height = `${s}px`;
          // Hide if lily pad is below water (shouldn't happen but safety)
          img.style.opacity = padY > WATER_Y + 40 ? "0" : "1";
        };
        updateImg(leftImg, mascotPadLeftRef.current);
        updateImg(rightImg, mascotPadRightRef.current);
      }
      rafId = requestAnimationFrame(sync);
    };
    rafId = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    let raf: number;
    let W = 0;
    let H = 0;
    let t = 0;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
      initScene();
    };

    const lilyPads: LilyPad[] = [];
    const fireflies: Firefly[] = [];
    const particles: Particle[] = [];

    const WATER_Y = () => H * 0.55;

    function initScene() {
      lilyPads.length = 0;
      fireflies.length = 0;
      particles.length = 0;
      mascotPadLeftRef.current = null;
      mascotPadRightRef.current = null;

      const wy = WATER_Y();

      // Lily pads - ensure leftmost is well on the left, rightmost well on the right
      lilyPads.push({
        x: W * 0.12,
        y: wy + 30 + Math.random() * 40,
        r: 32 + Math.random() * 10,
        bobOffset: Math.random() * Math.PI * 2,
        bobSpeed: 0.3 + Math.random() * 0.3,
      });
      lilyPads.push({
        x: W * 0.88,
        y: wy + 30 + Math.random() * 40,
        r: 32 + Math.random() * 10,
        bobOffset: Math.random() * Math.PI * 2,
        bobSpeed: 0.3 + Math.random() * 0.3,
      });
      for (let i = 0; i < 5; i++) {
        lilyPads.push({
          x: W * (0.25 + i * 0.11 + Math.random() * 0.05),
          y: wy + Math.random() * 80,
          r: 22 + Math.random() * 14,
          bobOffset: Math.random() * Math.PI * 2,
          bobSpeed: 0.3 + Math.random() * 0.4,
        });
      }

      mascotPadLeftRef.current = lilyPads[0];
      mascotPadRightRef.current = lilyPads[1];

      // Fireflies
      for (let i = 0; i < 18; i++) {
        fireflies.push({
          x: W * 0.1 + Math.random() * W * 0.8,
          y: wy * 0.1 + Math.random() * wy * 0.85,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.3,
          alpha: Math.random(),
          alphaDir: Math.random() > 0.5 ? 0.01 : -0.01,
          r: 2 + Math.random() * 2,
        });
      }
    }

    function spawnParticle() {
      if (particles.length < 40 && Math.random() < 0.15) {
        const wy = WATER_Y();
        if (Math.random() < 0.7) {
          particles.push({
            x: W * 0.05 + Math.random() * W * 0.9,
            y: wy + 80 + Math.random() * 60,
            vy: -0.5 - Math.random() * 0.8,
            vx: (Math.random() - 0.5) * 0.2,
            alpha: 0.5 + Math.random() * 0.4,
            r: 2 + Math.random() * 3,
            type: "bubble",
            rotation: 0,
            rotationSpeed: 0,
          });
        } else {
          particles.push({
            x:
              Math.random() < 0.5
                ? Math.random() * W * 0.15
                : W * 0.85 + Math.random() * W * 0.15,
            y: Math.random() * WATER_Y() * 0.4,
            vy: 0.4 + Math.random() * 0.5,
            vx: (Math.random() - 0.5) * 0.8,
            alpha: 0.8,
            r: 5 + Math.random() * 5,
            type: "leaf",
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.04,
          });
        }
      }
    }

    function drawBackground() {
      const wy = WATER_Y();
      const skyGrad = ctx.createLinearGradient(0, 0, 0, wy);
      skyGrad.addColorStop(0, "oklch(0.06 0.025 250)");
      skyGrad.addColorStop(0.5, "oklch(0.09 0.02 240)");
      skyGrad.addColorStop(1, "oklch(0.12 0.025 195)");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, wy);

      const moonX = W * 0.75;
      const moonY = H * 0.12;
      const moonGlow = ctx.createRadialGradient(
        moonX,
        moonY,
        5,
        moonX,
        moonY,
        60,
      );
      moonGlow.addColorStop(0, "rgba(255, 245, 180, 0.8)");
      moonGlow.addColorStop(0.3, "rgba(255, 245, 180, 0.15)");
      moonGlow.addColorStop(1, "rgba(255, 245, 180, 0)");
      ctx.fillStyle = moonGlow;
      ctx.fillRect(moonX - 60, moonY - 60, 120, 120);
      ctx.beginPath();
      ctx.arc(moonX, moonY, 18, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 248, 200, 0.9)";
      ctx.fill();

      drawTrees(ctx, W, H, wy, "left");
      drawTrees(ctx, W, H, wy, "right");

      const groundGrad = ctx.createLinearGradient(0, wy - 30, 0, wy + 20);
      groundGrad.addColorStop(0, "oklch(0.12 0.04 145)");
      groundGrad.addColorStop(1, "oklch(0.15 0.05 175)");
      ctx.fillStyle = groundGrad;
      ctx.beginPath();
      ctx.moveTo(0, wy - 10);
      for (let x = 0; x <= W; x += 20) {
        const bump = Math.sin((x / W) * Math.PI * 4 + t * 0.005) * 5;
        ctx.lineTo(x, wy - 10 + bump);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fill();

      drawWater(ctx, W, H, wy, t);
    }

    function drawTrees(
      ctx: CanvasRenderingContext2D,
      W: number,
      _H: number,
      wy: number,
      side: "left" | "right",
    ) {
      const treeData = [
        { xFrac: 0.02, h: 180, w: 40 },
        { xFrac: 0.06, h: 220, w: 55 },
        { xFrac: 0.11, h: 160, w: 38 },
        { xFrac: 0.15, h: 200, w: 48 },
      ];
      ctx.fillStyle = "oklch(0.09 0.025 150)";
      for (const tree of treeData) {
        const cx = side === "left" ? W * tree.xFrac : W * (1 - tree.xFrac);
        ctx.beginPath();
        ctx.moveTo(cx, wy - tree.h);
        ctx.lineTo(cx - tree.w / 2, wy);
        ctx.lineTo(cx + tree.w / 2, wy);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx, wy - tree.h * 0.7);
        ctx.lineTo(cx - tree.w * 0.65, wy - tree.h * 0.25);
        ctx.lineTo(cx + tree.w * 0.65, wy - tree.h * 0.25);
        ctx.closePath();
        ctx.fill();
      }
    }

    function drawWater(
      ctx: CanvasRenderingContext2D,
      W: number,
      H: number,
      wy: number,
      t: number,
    ) {
      const waterGrad = ctx.createLinearGradient(0, wy, 0, H);
      waterGrad.addColorStop(0, "oklch(0.28 0.08 200)");
      waterGrad.addColorStop(0.3, "oklch(0.22 0.07 195)");
      waterGrad.addColorStop(1, "oklch(0.15 0.05 190)");
      ctx.fillStyle = waterGrad;
      ctx.beginPath();
      ctx.moveTo(0, wy);
      for (let x = 0; x <= W; x += 8) {
        const wave =
          Math.sin((x / W) * Math.PI * 6 + t * 0.04) * 4 +
          Math.sin((x / W) * Math.PI * 3 + t * 0.025) * 3;
        ctx.lineTo(x, wy + wave);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "rgba(57, 183, 198, 0.15)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const ly = wy + 20 + i * 22;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 6) {
          const wave = Math.sin((x / W) * Math.PI * 5 + t * 0.03 + i) * 3;
          if (x === 0) ctx.moveTo(x, ly + wave);
          else ctx.lineTo(x, ly + wave);
        }
        ctx.stroke();
      }

      for (let i = 0; i < 6; i++) {
        const cx = W * (0.1 + (i * 0.15 + Math.sin(t * 0.01 + i) * 0.05));
        const cy = wy + 30 + (i % 3) * 40;
        const shimmerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
        shimmerGrad.addColorStop(0, "rgba(57, 183, 198, 0.12)");
        shimmerGrad.addColorStop(1, "rgba(57, 183, 198, 0)");
        ctx.fillStyle = shimmerGrad;
        ctx.fillRect(cx - 40, cy - 40, 80, 80);
      }
    }

    function drawLilyPads(t: number) {
      for (const lp of lilyPads) {
        const bob = Math.sin(t * lp.bobSpeed * 0.05 + lp.bobOffset) * 2;
        const y = lp.y + bob;

        // Shadow
        ctx.beginPath();
        ctx.ellipse(lp.x + 3, y + 4, lp.r, lp.r * 0.35, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fill();

        // Pad
        ctx.beginPath();
        ctx.arc(lp.x, y, lp.r, 0.15, Math.PI * 2 - 0.15);
        ctx.lineTo(lp.x, y);
        ctx.fillStyle = "oklch(0.42 0.14 145)";
        ctx.fill();

        // Notch
        ctx.beginPath();
        ctx.moveTo(lp.x, y);
        ctx.arc(lp.x, y, lp.r, -0.15, 0.15);
        ctx.fillStyle = "oklch(0.35 0.12 140)";
        ctx.fill();

        // Vein lines
        ctx.strokeStyle = "oklch(0.35 0.12 140)";
        ctx.lineWidth = 0.8;
        for (let v = 0; v < 5; v++) {
          const angle = (v / 5) * Math.PI + 0.2;
          ctx.beginPath();
          ctx.moveTo(lp.x, y);
          ctx.lineTo(
            lp.x + Math.cos(angle) * lp.r * 0.9,
            y + Math.sin(angle) * lp.r * 0.9,
          );
          ctx.stroke();
        }

        // Flower for large pads
        if (lp.r > 28) {
          ctx.beginPath();
          ctx.arc(lp.x, y - lp.r * 0.1, 4, 0, Math.PI * 2);
          ctx.fillStyle = "oklch(0.85 0.12 10)";
          ctx.fill();
        }
      }
    }

    function drawFireflies(t: number) {
      for (const ff of fireflies) {
        ff.x += ff.vx + Math.sin(t * 0.02 + ff.r) * 0.2;
        ff.y += ff.vy + Math.cos(t * 0.015 + ff.r) * 0.15;
        ff.alpha += ff.alphaDir;
        if (ff.alpha > 1) {
          ff.alpha = 1;
          ff.alphaDir = -0.008 - Math.random() * 0.008;
        }
        if (ff.alpha < 0.05) {
          ff.alpha = 0.05;
          ff.alphaDir = 0.008 + Math.random() * 0.008;
        }
        if (ff.x < 0) ff.x = W;
        if (ff.x > W) ff.x = 0;
        if (ff.y < 5) ff.vy = Math.abs(ff.vy);
        if (ff.y > WATER_Y() - 10) ff.vy = -Math.abs(ff.vy);

        const glow = ctx.createRadialGradient(
          ff.x,
          ff.y,
          0,
          ff.x,
          ff.y,
          ff.r * 5,
        );
        glow.addColorStop(0, `rgba(240, 230, 80, ${ff.alpha})`);
        glow.addColorStop(0.4, `rgba(240, 220, 60, ${ff.alpha * 0.4})`);
        glow.addColorStop(1, "rgba(240, 200, 0, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(ff.x, ff.y, ff.r * 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ff.x, ff.y, ff.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 248, 120, ${ff.alpha})`;
        ctx.fill();
      }
    }

    function drawParticles() {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        if (p.type === "bubble") {
          p.alpha -= 0.003;
          if (p.y < WATER_Y() - 5 || p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(57, 183, 198, ${p.alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          p.alpha -= 0.004;
          if (p.y > WATER_Y() + 20 || p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(47, 168, 90, ${p.alpha})`;
          ctx.fill();
          ctx.restore();
        }
      }
    }

    const draw = () => {
      t++;
      tRef.current = t;
      spawnParticle();
      ctx.clearRect(0, 0, W, H);
      drawBackground();
      drawLilyPads(t);
      drawParticles();
      drawFireflies(t);
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: 640 }}
    >
      <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[oklch(0.07_0.02_245)] to-transparent z-10 pointer-events-none" />
      <canvas
        ref={canvasRef}
        className="w-full block"
        style={{ height: 640 }}
      />
      {/* Animated GIF mascots on lily pads */}
      <img
        ref={leftGifRef}
        src="/assets/uploads/ezgif.com-video-to-gif-converter-1.gif"
        alt="FORG mascot"
        className="absolute pointer-events-none"
        style={{
          position: "absolute",
          imageRendering: "auto",
          objectFit: "contain",
          zIndex: 5,
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))",
        }}
      />
      <img
        ref={rightGifRef}
        src="/assets/uploads/ezgif.com-video-to-gif-converter-1.gif"
        alt="FORG mascot"
        className="absolute pointer-events-none"
        style={{
          position: "absolute",
          imageRendering: "auto",
          objectFit: "contain",
          zIndex: 5,
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[oklch(0.10_0.022_240)] to-transparent z-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="absolute top-8 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none"
      >
        <span className="font-display font-bold text-sm uppercase tracking-[0.3em] text-gold/70 bg-[oklch(0.10_0.022_240/0.6)] px-4 py-1.5 rounded-full border border-gold/20">
          🐸 The FORG Pond
        </span>
      </motion.div>
    </section>
  );
}
