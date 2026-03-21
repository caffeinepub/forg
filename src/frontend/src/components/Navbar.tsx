import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "PFP Gen", href: "#pfp" },
  { label: "Tokenomics", href: "#tokenomics" },
  { label: "How To Buy", href: "#howtobuy" },
  { label: "Community", href: "#community" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[oklch(0.08_0.02_240/0.95)] backdrop-blur-md border-b border-[oklch(0.76_0.10_82/0.15)] shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 group"
          data-ocid="nav.link"
        >
          <img
            src="/assets/uploads/63C52A3F-5360-4A0B-82AB-3B4D9B931E46-2.png"
            alt="FORG Logo"
            className="w-9 h-9 rounded-full ring-1 ring-gold/30 group-hover:ring-gold/70 transition-all"
          />
          <span className="font-display font-800 text-xl text-gold-bright tracking-widest uppercase">
            FORG
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-gold-bright transition-colors uppercase tracking-wider"
              data-ocid="nav.link"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <Button
            className="bg-gold hover:bg-gold-bright text-[oklch(0.08_0.02_240)] font-bold uppercase tracking-widest rounded-full px-6 shadow-gold-sm transition-all hover:shadow-gold"
            data-ocid="nav.primary_button"
          >
            BUY $FORG
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden text-foreground p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          data-ocid="nav.toggle"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[oklch(0.10_0.022_240/0.98)] backdrop-blur-md border-b border-[oklch(0.76_0.10_82/0.2)] px-4 pb-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block py-3 text-sm font-medium text-muted-foreground hover:text-gold-bright transition-colors uppercase tracking-wider border-b border-border/30 last:border-0"
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.link"
              >
                {link.label}
              </a>
            ))}
            <Button
              className="mt-4 w-full bg-gold hover:bg-gold-bright text-[oklch(0.08_0.02_240)] font-bold uppercase tracking-widest rounded-full shadow-gold-sm"
              data-ocid="nav.primary_button"
            >
              BUY $FORG
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
