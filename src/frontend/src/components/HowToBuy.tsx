import { ArrowLeftRight, PartyPopper, TrendingUp, Wallet } from "lucide-react";
import { motion } from "motion/react";

const STEPS = [
  {
    id: "wallet",
    num: "01",
    icon: <Wallet size={28} />,
    title: "Create a Wallet",
    desc: "Download Phantom wallet from phantom.app. Create your Solana wallet and save your seed phrase safely.",
    color: "oklch(0.76 0.10 82)",
  },
  {
    id: "buysol",
    num: "02",
    icon: <TrendingUp size={28} />,
    title: "Buy SOL",
    desc: "Purchase Solana (SOL) on any major exchange like Coinbase or Binance, then transfer to your Phantom wallet.",
    color: "oklch(0.72 0.10 200)",
  },
  {
    id: "swap",
    num: "03",
    icon: <ArrowLeftRight size={28} />,
    title: "Swap for $FORG",
    desc: "Go to Raydium.io, connect your wallet, paste the $FORG contract address, and swap your SOL for $FORG.",
    color: "oklch(0.65 0.15 145)",
  },
  {
    id: "hodl",
    num: "04",
    icon: <PartyPopper size={28} />,
    title: "HODL & Enjoy",
    desc: "Welcome to the pond! HODL your $FORG, vibe with the community, and watch the swamp grow. 🐸",
    color: "oklch(0.87 0.11 85)",
  },
];

export function HowToBuy() {
  return (
    <section id="howtobuy" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="font-display text-xs uppercase tracking-[0.4em] text-gold/70 mb-3 block">
            Get Started
          </span>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl uppercase text-foreground">
            HOW TO <span className="text-gold">BUY $FORG</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:border-gold/30 transition-all"
              data-ocid={`howtobuy.item.${i + 1}`}
            >
              <div
                className="absolute top-3 right-4 font-display font-extrabold text-6xl leading-none select-none"
                style={{ color: `${step.color}18` }}
              >
                {step.num}
              </div>

              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-6 h-px bg-gold/20 z-10" />
              )}

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${step.color}18`, color: step.color }}
              >
                {step.icon}
              </div>

              <h3 className="font-display font-bold text-foreground mb-2 uppercase tracking-wide text-sm">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
