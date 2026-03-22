import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export function HeroSection() {
  return (
    <section
      id="about"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source
          src="/assets/16A1BD9D-AF8B-4608-ADC5-8293993A8D6E.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(0,0,0,0.45)", zIndex: 1 }}
      />

      {/* Silhouette trees */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ zIndex: 2 }}
      >
        <svg
          viewBox="0 0 1440 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <title>Forest Trees Background</title>
          <path
            d="M0 260 L0 180 L30 80 L60 180 L60 260Z"
            fill="oklch(0.12 0.03 155)"
          />
          <path
            d="M40 260 L40 190 L80 70 L120 190 L120 260Z"
            fill="oklch(0.10 0.025 155)"
          />
          <path
            d="M90 260 L90 200 L120 100 L150 200 L150 260Z"
            fill="oklch(0.13 0.03 155)"
          />
          <path
            d="M130 260 L130 210 L170 120 L210 210 L210 260Z"
            fill="oklch(0.09 0.02 155)"
          />
          <path
            d="M1440 260 L1440 180 L1410 80 L1380 180 L1380 260Z"
            fill="oklch(0.12 0.03 155)"
          />
          <path
            d="M1400 260 L1400 190 L1360 70 L1320 190 L1320 260Z"
            fill="oklch(0.10 0.025 155)"
          />
          <path
            d="M1350 260 L1350 200 L1320 100 L1290 200 L1290 260Z"
            fill="oklch(0.13 0.03 155)"
          />
          <path
            d="M1310 260 L1310 210 L1270 120 L1230 210 L1230 260Z"
            fill="oklch(0.09 0.02 155)"
          />
          <path
            d="M0 240 Q360 210 720 230 Q1080 250 1440 230 L1440 260 L0 260Z"
            fill="oklch(0.10 0.03 155)"
          />
        </svg>
      </div>

      {/* Content */}
      <div
        className="relative flex flex-col items-center text-center px-4 py-24"
        style={{ zIndex: 10 }}
      >
        {/* Coin logo */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, y: [0, -14, 0] }}
          transition={{
            scale: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
            opacity: { duration: 0.8 },
            y: {
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.8,
            },
          }}
          className="mb-8"
        >
          <img
            src="/assets/uploads/63C52A3F-5360-4A0B-82AB-3B4D9B931E46-2.png"
            alt="FORG Coin"
            className="w-32 h-32 md:w-44 md:h-44"
          />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="font-display font-extrabold text-5xl md:text-7xl lg:text-8xl uppercase tracking-tight leading-none mb-4"
        >
          <span className="text-foreground">THE POND</span>
          <br />
          <span className="gold-shimmer">IS CALLING</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="text-muted-foreground text-lg md:text-xl max-w-lg mb-2"
        >
          The cutest meme coin in the swamp.
        </motion.p>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="text-gold text-xl md:text-2xl font-bold mb-10 font-display uppercase tracking-wider"
        >
          Join the FORG Army. 🐸
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Button
            size="lg"
            className="bg-gold hover:bg-gold-bright text-[oklch(0.08_0.02_240)] font-bold uppercase tracking-widest rounded-full px-10 py-6 text-base shadow-gold hover:shadow-gold transition-all scale-100 hover:scale-105"
            data-ocid="hero.primary_button"
            onClick={() =>
              window.open(
                "https://x.com/i/communities/2034649883919941893",
                "_blank",
              )
            }
          >
            JOIN THE POND
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-gold text-gold hover:bg-gold/10 font-bold uppercase tracking-widest rounded-full px-10 py-6 text-base transition-all scale-100 hover:scale-105"
            data-ocid="hero.secondary_button"
          >
            LEARN MORE
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gold/60"
        style={{ zIndex: 10 }}
      >
        <span className="text-xs uppercase tracking-widest">Scroll Down</span>
        <div className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
