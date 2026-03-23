import { CheckCircle2, Circle } from "lucide-react";
import { motion } from "motion/react";

const PHASES = [
  {
    id: "phase1",
    phase: "Phase 1",
    title: "The Tadpole Era",
    items: [
      { text: "Website Launch", completed: true },
      { text: "Token Creation", completed: true },
      { text: "Community Building", completed: true },
      { text: "Initial Liquidity", completed: true },
      { text: "CTO Takeover", completed: true },
      { text: "PFP Generator", completed: false },
      { text: "250 Holders", completed: true },
    ],
    active: true,
    color: "oklch(0.76 0.10 82)",
  },
  {
    id: "phase2",
    phase: "Phase 2",
    title: "The Froglet Rise",
    items: [
      { text: "CEX Listings", completed: false },
      { text: "Build LQ Pool", completed: false },
      { text: "500 Holders", completed: false },
      { text: "CoinGecko Listing", completed: false },
      { text: "CoinMarketCap", completed: false },
      { text: "Influencer Partnerships", completed: false },
    ],
    active: false,
    color: "oklch(0.72 0.10 200)",
  },
  {
    id: "phase3",
    phase: "Phase 3",
    title: "The FORG Kingdom",
    items: [
      { text: "NFT Collection Drop", completed: false },
      { text: "Art Creator Collab", completed: false },
      { text: "Collaborating with KOLs", completed: false },
      { text: "Meme Contest", completed: false },
      { text: "1,000 Holders", completed: false },
      { text: "Tier 1 CEX", completed: false },
      { text: "FORG DAO", completed: false },
    ],
    active: false,
    color: "oklch(0.65 0.15 145)",
  },
  {
    id: "phase4",
    phase: "Phase 4",
    title: "The Pond Ecosystem",
    items: [
      { text: "FORG Ecosystem", completed: false },
      { text: "Strategic Partnerships", completed: false },
      { text: "5,000 Holders", completed: false },
      { text: "Moon 🌕", completed: false },
    ],
    active: false,
    color: "oklch(0.55 0.12 260)",
  },
];

export function Roadmap() {
  return (
    <section id="roadmap" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="font-display text-xs uppercase tracking-[0.4em] text-gold/70 mb-3 block">
            The Journey
          </span>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl uppercase text-gold">
            ROADMAP
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PHASES.map((phase, i) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-6 border transition-all ${
                phase.active
                  ? "border-gold/40 bg-[oklch(0.76_0.10_82/0.06)] shadow-gold-sm"
                  : phase.items.some((it) => it.completed)
                    ? "border-border/50 glass-card"
                    : "border-border/30 glass-card opacity-70"
              }`}
              data-ocid={`roadmap.item.${i + 1}`}
            >
              {phase.active && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-[oklch(0.08_0.02_240)] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  LIVE NOW
                </div>
              )}

              <div
                className="text-xs uppercase tracking-widest font-bold mb-1"
                style={{ color: phase.color }}
              >
                {phase.phase}
              </div>
              <h3 className="font-display font-bold text-foreground text-lg mb-4 uppercase tracking-wide">
                {phase.title}
              </h3>

              <ul className="space-y-2">
                {phase.items.map((item) => (
                  <li
                    key={item.text}
                    className="flex items-center gap-2 text-sm"
                  >
                    {item.completed ? (
                      <CheckCircle2
                        size={14}
                        className="flex-shrink-0"
                        style={{ color: phase.color }}
                      />
                    ) : (
                      <Circle size={14} className="flex-shrink-0 text-border" />
                    )}
                    <span
                      className={
                        item.completed
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
