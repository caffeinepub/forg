import { SiDiscord, SiTelegram, SiX } from "react-icons/si";

const FOOTER_SOCIALS = [
  { name: "twitter", icon: <SiX size={18} />, href: "#" },
  { name: "telegram", icon: <SiTelegram size={18} />, href: "#" },
  { name: "discord", icon: <SiDiscord size={18} />, href: "#" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="border-t border-border/20 bg-[oklch(0.08_0.018_235)] py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <img
            src="/assets/uploads/63C52A3F-5360-4A0B-82AB-3B4D9B931E46-2.png"
            alt="FORG"
            className="w-10 h-10 rounded-full ring-1 ring-gold/30"
          />
          <span className="font-display font-bold text-xl text-gold tracking-widest uppercase">
            FORG
          </span>
        </div>

        {/* Disclaimer */}
        <p className="text-muted-foreground text-xs max-w-2xl mx-auto mb-6 leading-relaxed">
          FORG is a meme coin with no intrinsic value or expectation of
          financial return. It is purely for entertainment and community. Not
          financial advice. Crypto is risky — never invest more than you can
          afford to lose. 🐸
        </p>

        {/* Socials */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {FOOTER_SOCIALS.map((s) => (
            <a
              key={s.name}
              href={s.href}
              className="w-9 h-9 rounded-full border border-border/40 flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/40 transition-all"
              data-ocid="footer.link"
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-muted-foreground text-xs">
          © {year} FORG. Built with <span className="text-gold">♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold/70 hover:text-gold transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
