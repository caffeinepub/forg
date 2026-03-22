import { motion } from "motion/react";

const POND_VIDEO =
  "https://drive.google.com/uc?id=1RxvY5RISb9FIqZepDcufcjLfc8tbTzze&export=download";
const PAIR = "55kcmUzV47QDZdLh2SV3dPkRSyGzianRFYvEXgJdBWh6";
const DEXSCREENER_EMBED = `https://dexscreener.com/solana/${PAIR}?embed=1&theme=dark`;

export function PondEcosystem() {
  return (
    <section className="relative w-full overflow-hidden bg-[#071520]">
      {/* Top fade */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[oklch(0.07_0.02_245)] to-transparent z-10 pointer-events-none" />

      {/* Video background */}
      <video
        src={POND_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      />

      {/* Overlay for depth */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.5)", zIndex: 1 }}
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center px-4 pt-16 pb-16">
        {/* Section label + title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <p className="font-display text-xs uppercase tracking-[0.35em] text-green-300/70 mb-3">
            Welcome to the ecosystem
          </p>
          <h2 className="font-display font-black text-5xl md:text-7xl text-white drop-shadow-[0_4px_32px_rgba(0,0,0,0.8)] leading-none">
            THE FORG POND
          </h2>
          <p className="mt-4 text-green-200/60 text-sm md:text-base font-medium tracking-wide max-w-md mx-auto">
            Where frogs gather, memes are born, and the $FORG community thrives.
          </p>
        </motion.div>

        {/* DexScreener Chart */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,200,100,0.15)] border border-green-500/20"
        >
          <iframe
            src={DEXSCREENER_EMBED}
            title="FORG DexScreener Chart"
            allow="clipboard-write"
            style={{
              width: "100%",
              height: 500,
              border: "none",
              display: "block",
            }}
          />
        </motion.div>

        {/* Direct link fallback */}
        <motion.a
          href={`https://dexscreener.com/solana/${PAIR}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 text-green-300/60 text-xs hover:text-green-300 transition-colors underline underline-offset-4"
        >
          View on DexScreener ↗
        </motion.a>
      </div>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[oklch(0.10_0.022_240)] to-transparent z-10 pointer-events-none" />
    </section>
  );
}
