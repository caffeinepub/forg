import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { SiDiscord, SiTelegram, SiX } from "react-icons/si";

const SOCIALS = [
  {
    id: "twitter",
    icon: <SiX size={22} />,
    label: "Twitter / X",
    handle: "@FORGcoin",
    href: "#",
    color: "oklch(0.76 0.10 82)",
  },
  {
    id: "telegram",
    icon: <SiTelegram size={22} />,
    label: "Telegram",
    handle: "t.me/FORGcoin",
    href: "#",
    color: "oklch(0.72 0.10 200)",
  },
  {
    id: "discord",
    icon: <SiDiscord size={22} />,
    label: "Discord",
    handle: "discord.gg/FORG",
    href: "#",
    color: "oklch(0.55 0.12 260)",
  },
];

const MEMES = [
  "🐸 We're all gonna make it.",
  "🌊 The pond never sleeps.",
  "💎 Diamond lily pads, never sell.",
  "🚀 Not financial advice. Just vibes.",
];

export function Community() {
  return (
    <section id="community" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.65_0.15_145/0.3)] to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[oklch(0.65_0.15_145/0.04)] rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <img
            src="/assets/uploads/F8DA6749-9BC2-45C6-A9D9-E260117430FC-1.jpg"
            alt="FORG Mascot"
            className="w-24 h-24 rounded-full mx-auto mb-6 border-2 border-gold/40 shadow-gold object-cover animate-float"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="font-display text-xs uppercase tracking-[0.4em] text-gold/70 mb-3 block">
            The Swamp Awaits
          </span>
          <h2 className="font-display font-extrabold text-4xl md:text-6xl uppercase leading-tight mb-6">
            JOIN THE <span className="gold-shimmer">FORG ARMY</span> 🐸
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-12">
            Thousands of FORGs are already in the pond. Don&apos;t be the last
            tadpole to evolve.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {SOCIALS.map((social, i) => (
            <motion.a
              key={social.id}
              href={social.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl px-6 py-4 flex items-center gap-3 hover:border-gold/40 transition-all group min-w-[180px]"
              data-ocid="community.link"
            >
              <span
                style={{ color: social.color }}
                className="group-hover:scale-110 transition-transform"
              >
                {social.icon}
              </span>
              <div className="text-left">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  {social.label}
                </div>
                <div className="text-sm font-bold text-foreground">
                  {social.handle}
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {MEMES.map((meme) => (
            <motion.span
              key={meme}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm text-muted-foreground glass-card rounded-full px-4 py-2 border-gold/10"
            >
              {meme}
            </motion.span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Button
            size="lg"
            className="bg-gold hover:bg-gold-bright text-[oklch(0.08_0.02_240)] font-bold uppercase tracking-widest rounded-full px-12 py-6 text-base shadow-gold hover:shadow-gold transition-all scale-100 hover:scale-105"
            data-ocid="community.primary_button"
          >
            Join The Pond 🐸
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
