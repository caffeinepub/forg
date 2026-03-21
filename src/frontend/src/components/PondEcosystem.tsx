import { motion } from "motion/react";
import { useEffect, useRef } from "react";

interface Frog {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  startX: number;
  startY: number;
  progress: number;
  speed: number;
  size: number;
  isMascot: boolean;
  jumpCount: number;
  waiting: number;
  phase: "jump" | "wait";
}

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
  const mascotImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = "/assets/uploads/F8DA6749-9BC2-45C6-A9D9-E260117430FC-1.jpg";
    img.onload = () => {
      mascotImgRef.current = img;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    let raf: number;
    let W = 0;
    let H = 0;
    let t = 0;
    let mascotTwerk = 0;
    let mascotTwerkTimer = 0;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
      initScene();
    };

    const lilyPads: LilyPad[] = [];
    const frogs: Frog[] = [];
    const fireflies: Firefly[] = [];
    const particles: Particle[] = [];

    const WATER_Y = () => H * 0.55;

    function initScene() {
      lilyPads.length = 0;
      frogs.length = 0;
      fireflies.length = 0;
      particles.length = 0;

      const wy = WATER_Y();

      // Lily pads
      for (let i = 0; i < 7; i++) {
        lilyPads.push({
          x: W * (0.1 + i * 0.12 + Math.random() * 0.05),
          y: wy + Math.random() * 80,
          r: 20 + Math.random() * 18,
          bobOffset: Math.random() * Math.PI * 2,
          bobSpeed: 0.3 + Math.random() * 0.4,
        });
      }

      // Frogs
      for (let i = 0; i < 4; i++) {
        const lp = lilyPads[i % lilyPads.length];
        frogs.push({
          x: lp.x,
          y: lp.y,
          targetX: lp.x,
          targetY: lp.y,
          startX: lp.x,
          startY: lp.y,
          progress: 1,
          speed: 0.008 + Math.random() * 0.006,
          size: 14 + Math.random() * 8,
          isMascot: i === 0,
          jumpCount: i * 4,
          waiting: Math.random() * 120,
          phase: "wait",
        });
      }

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
          // bubble
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
          // leaf
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
      // Night sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, wy);
      skyGrad.addColorStop(0, "oklch(0.06 0.025 250)");
      skyGrad.addColorStop(0.5, "oklch(0.09 0.02 240)");
      skyGrad.addColorStop(1, "oklch(0.12 0.025 195)");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, wy);

      // Moon glow
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

      // Silhouetted trees left
      drawTrees(ctx, W, H, wy, "left");
      drawTrees(ctx, W, H, wy, "right");

      // Ground between trees and water
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

      // Water
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
        let cx = side === "left" ? W * tree.xFrac : W * (1 - tree.xFrac);
        // Triangle tree
        ctx.beginPath();
        ctx.moveTo(cx, wy - tree.h);
        ctx.lineTo(cx - tree.w / 2, wy);
        ctx.lineTo(cx + tree.w / 2, wy);
        ctx.closePath();
        ctx.fill();
        // Second tier
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
      // Main water body
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

      // Water shimmer lines
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

      // Water caustic shimmer
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

        // Notch darker
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

        // Flower
        if (lp.r > 28) {
          ctx.beginPath();
          ctx.arc(lp.x, y - lp.r * 0.1, 4, 0, Math.PI * 2);
          ctx.fillStyle = "oklch(0.85 0.12 10)";
          ctx.fill();
        }
      }
    }

    function drawCartoonFrog(cx: number, cy: number, size: number) {
      const s = size;
      // Body
      ctx.beginPath();
      ctx.ellipse(cx, cy, s * 0.8, s * 0.65, 0, 0, Math.PI * 2);
      ctx.fillStyle = "oklch(0.55 0.17 145)";
      ctx.fill();
      ctx.strokeStyle = "oklch(0.40 0.15 140)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Belly
      ctx.beginPath();
      ctx.ellipse(cx, cy + s * 0.1, s * 0.45, s * 0.38, 0, 0, Math.PI * 2);
      ctx.fillStyle = "oklch(0.78 0.12 120)";
      ctx.fill();

      // Eyes
      for (let e = -1; e <= 1; e += 2) {
        ctx.beginPath();
        ctx.arc(cx + e * s * 0.35, cy - s * 0.55, s * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = "oklch(0.55 0.17 145)";
        ctx.fill();
        ctx.strokeStyle = "oklch(0.40 0.15 140)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx + e * s * 0.35, cy - s * 0.55, s * 0.14, 0, Math.PI * 2);
        ctx.fillStyle = "#111";
        ctx.fill();

        // Eye gleam
        ctx.beginPath();
        ctx.arc(
          cx + e * s * 0.35 + s * 0.05,
          cy - s * 0.58,
          s * 0.05,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fill();
      }

      // Smile
      ctx.beginPath();
      ctx.arc(cx, cy + s * 0.05, s * 0.3, 0.2, Math.PI - 0.2);
      ctx.strokeStyle = "oklch(0.30 0.12 140)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    function drawFrogs(t: number) {
      const wy = WATER_Y();

      for (const frog of frogs) {
        if (frog.phase === "wait") {
          frog.waiting--;
          if (frog.waiting <= 0) {
            // Pick a random lily pad as target
            const lpTarget =
              lilyPads[Math.floor(Math.random() * lilyPads.length)];
            frog.startX = frog.x;
            frog.startY = frog.y;
            frog.targetX = lpTarget.x + (Math.random() - 0.5) * 30;
            frog.targetY =
              lpTarget.y +
              Math.sin(t * lpTarget.bobSpeed * 0.05 + lpTarget.bobOffset) * 2;
            frog.progress = 0;
            frog.phase = "jump";
            frog.jumpCount++;
          }
        } else {
          frog.progress += frog.speed;
          if (frog.progress >= 1) {
            frog.progress = 1;
            frog.x = frog.targetX;
            frog.y = frog.targetY;
            frog.phase = "wait";
            frog.waiting = 60 + Math.random() * 120;
          } else {
            frog.x = frog.startX + (frog.targetX - frog.startX) * frog.progress;
            const arcHeight = 50 + Math.abs(frog.targetX - frog.startX) * 0.3;
            const arc = Math.sin(frog.progress * Math.PI) * arcHeight;
            frog.y =
              frog.startY + (frog.targetY - frog.startY) * frog.progress - arc;
          }
        }

        if (frog.y < wy - 5) continue; // don't draw if airborne above water

        const shouldUseMascot = frog.isMascot || frog.jumpCount % 4 === 0;

        if (shouldUseMascot && mascotImgRef.current) {
          const s = frog.size * 2.5;
          ctx.save();
          ctx.beginPath();
          ctx.arc(frog.x, frog.y, s, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(
            mascotImgRef.current,
            frog.x - s,
            frog.y - s,
            s * 2,
            s * 2,
          );
          ctx.restore();
        } else {
          drawCartoonFrog(frog.x, frog.y, frog.size);
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

        // Wrap
        if (ff.x < 0) ff.x = W;
        if (ff.x > W) ff.x = 0;
        if (ff.y < 5) ff.vy = Math.abs(ff.vy);
        if (ff.y > WATER_Y() - 10) ff.vy = -Math.abs(ff.vy);

        // Glow
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
          // leaf
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

    function drawMascotTwerk(t: number) {
      // Every ~600 frames trigger twerk
      if (t % 600 < 5 && mascotTwerk === 0) {
        mascotTwerk = 80;
      }

      if (mascotTwerk > 0 && mascotImgRef.current) {
        mascotTwerkTimer++;
        const bounce = Math.sin(mascotTwerkTimer * 0.4) * 12;
        const wobble = Math.sin(mascotTwerkTimer * 0.5) * 0.15;
        const s = 55;
        ctx.save();
        ctx.translate(W - 80, H - 80 + bounce);
        ctx.rotate(wobble);
        ctx.beginPath();
        ctx.arc(0, 0, s, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(mascotImgRef.current, -s, -s, s * 2, s * 2);
        ctx.restore();

        // Label
        ctx.fillStyle = `rgba(215, 179, 90, ${Math.min(mascotTwerk / 20, 1)})`;
        ctx.font = "bold 12px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("FORG PARTY! 🎉", W - 80, H - 145);

        mascotTwerk--;
        if (mascotTwerk === 0) mascotTwerkTimer = 0;
      }
    }

    const draw = () => {
      t++;
      spawnParticle();
      ctx.clearRect(0, 0, W, H);
      drawBackground();
      drawLilyPads(t);
      drawParticles();
      drawFrogs(t);
      drawFireflies(t);
      drawMascotTwerk(t);
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
      className="relative w-full overflow-hidden"
      style={{ minHeight: 640 }}
    >
      <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[oklch(0.07_0.02_245)] to-transparent z-10 pointer-events-none" />
      <canvas
        ref={canvasRef}
        className="w-full block"
        style={{ height: 640 }}
      />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[oklch(0.10_0.022_240)] to-transparent z-10 pointer-events-none" />

      {/* Label */}
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
