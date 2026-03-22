import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

const PIE_DATA = [
  { label: "Frogs", pct: 40, color: "oklch(0.72 0.10 200)" },
  { label: "Pond Liquidity", pct: 30, color: "oklch(0.65 0.15 145)" },
  { label: "Community Degens", pct: 20, color: "oklch(0.76 0.10 82)" },
  { label: "Memes", pct: 9, color: "oklch(0.55 0.12 260)" },
  {
    label: "The frog who started it all",
    pct: 1,
    color: "oklch(0.70 0.18 30)",
  },
];

const STATS = [
  {
    label: "Frogs",
    value: "40%",
    suffix: "",
  },
  {
    label: "Pond Liquidity",
    value: "30%",
    suffix: "",
  },
  {
    label: "Community Degens",
    value: "20%",
    suffix: "",
  },
  {
    label: "Token Contract",
    value: "G4QRtYNRPyxdKwcAqqW3xSeEynDDxEyRvrDT9FJEpump",
    suffix: "",
  },
];

const BADGES = [
  {
    id: "renounced",
    icon: <CheckCircle2 size={28} className="text-pond-green" />,
    title: "Memes — 9%",
    desc: "9% reserved for memes — because that's what we are. The pond runs on vibes.",
    color: "from-[oklch(0.65_0.15_145/0.12)] to-[oklch(0.65_0.15_145/0.04)]",
  },
];

export function Tokenomics() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 200;
    canvas.width = size;
    canvas.height = size;
    const cx = size / 2;
    const cy = size / 2;
    const r = 80;
    const innerR = 50;

    let startAngle = -Math.PI / 2;
    for (const seg of PIE_DATA) {
      const sweep = (seg.pct / 100) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, startAngle + sweep);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      startAngle += sweep;
    }

    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fillStyle = "oklch(0.14 0.015 230)";
    ctx.fill();

    ctx.textAlign = "center";
    ctx.fillStyle = "oklch(0.76 0.10 82)";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("$FORG", cx, cy + 6);
  }, []);

  return (
    <section id="tokenomics" className="py-24 px-4 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[oklch(0.76_0.10_82/0.03)] rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-display text-xs uppercase tracking-[0.4em] text-gold/70 mb-3 block">
            Distribution
          </span>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl uppercase text-gold">
            TOKENOMICS
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-8 md:p-12 border border-gold/10"
        >
          <div className="grid md:grid-cols-3 gap-10 items-center">
            {/* Stats */}
            <div className="space-y-5">
              {STATS.map((stat) => (
                <div
                  key={stat.label + stat.value}
                  className="border-b border-border/30 pb-4 last:border-0"
                >
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                    {stat.label}
                  </div>
                  <div className="font-display font-bold text-foreground text-sm break-all">
                    {stat.value}
                    {stat.suffix && (
                      <span className="text-gold ml-1 text-sm">
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Donut chart */}
            <div className="flex flex-col items-center gap-6">
              <canvas ref={canvasRef} style={{ width: 200, height: 200 }} />
              <div className="space-y-2 w-full">
                {PIE_DATA.map((seg) => (
                  <div
                    key={`${seg.color}-${seg.pct}`}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ background: seg.color }}
                      />
                      <span className="text-muted-foreground">{seg.label}</span>
                    </div>
                    <span className="font-bold text-foreground">
                      {seg.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="space-y-4">
              {BADGES.map((badge, i) => (
                <div
                  key={badge.id}
                  className={`rounded-2xl p-5 bg-gradient-to-br ${badge.color} border border-border/30`}
                  data-ocid={`tokenomics.item.${i + 1}`}
                >
                  <div className="flex items-start gap-3">
                    {badge.icon}
                    <div>
                      <div className="font-display font-bold text-foreground text-sm uppercase tracking-wide">
                        {badge.title}
                      </div>
                      <div className="text-muted-foreground text-xs mt-1 leading-relaxed">
                        {badge.desc}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl p-4 bg-[oklch(0.55_0.12_260/0.08)] border border-[oklch(0.55_0.12_260/0.2)]">
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                  The Frog Who Started It All
                </div>
                <div className="font-display font-bold text-foreground text-2xl">
                  1%
                </div>
                <div className="text-xs text-muted-foreground">
                  The OG frog's slice of the pond.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
