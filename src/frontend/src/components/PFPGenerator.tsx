import { Button } from "@/components/ui/button";
import { usePfpCount, useRegisterPfp } from "@/hooks/useQueries";
import { Download, Shuffle } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

// ── Trait definitions ──────────────────────────────────────────────────────────

type Background = {
  id: string;
  label: string;
  emoji: string;
  src: string;
};

type Trait = {
  id: string;
  label: string;
  emoji: string;
  src: string | null;
};

const BACKGROUNDS: Background[] = [
  {
    id: "swamp",
    label: "Swamp",
    emoji: "🌿",
    src: "/assets/generated/bg-swamp.dim_1080x1080.png",
  },
  {
    id: "forest",
    label: "Forest",
    emoji: "🌳",
    src: "/assets/generated/bg-forest.dim_1080x1080.png",
  },
  {
    id: "pond",
    label: "Lily Pond",
    emoji: "🪷",
    src: "/assets/generated/bg-pond.dim_1080x1080.png",
  },
  {
    id: "cult",
    label: "Dark Cult",
    emoji: "🕯️",
    src: "/assets/generated/bg-cult.dim_1080x1080.png",
  },
  {
    id: "nightswamp",
    label: "Night Swamp",
    emoji: "🌙",
    src: "/assets/generated/bg-night-swamp.dim_1080x1080.png",
  },
];

const CLOTHES: Trait[] = [
  { id: "none", label: "None", emoji: "🚫", src: null },
  {
    id: "suit",
    label: "Suit",
    emoji: "🤵",
    src: "/assets/uploads/Mascot-suit-2.png",
  },
];

const HEADWEAR: Trait[] = [
  { id: "none", label: "None", emoji: "🚫", src: null },
  {
    id: "baseball",
    label: "Baseball Cap",
    emoji: "🧢",
    src: "/assets/generated/custom-baseball-cap-1080.dim_1080x1080.png",
  },
];

const FACE: Trait[] = [
  { id: "none", label: "None", emoji: "🚫", src: null },
  {
    id: "sunglasses",
    label: "Sunglasses",
    emoji: "😎",
    src: "/assets/uploads/Sunglasses-1.png",
  },
];

// ── Image cache ────────────────────────────────────────────────────────────────

const imgCache: Record<string, HTMLImageElement> = {};

function loadImage(src: string): Promise<HTMLImageElement> {
  if (imgCache[src]) return Promise.resolve(imgCache[src]);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgCache[src] = img;
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

const BASE_FROG = "/assets/uploads/Forg-mascot-1.png";
const CANVAS_SIZE = 1080;
const PREVIEW_SIZE = 340;

export function PFPGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedBg, setSelectedBg] = useState(BACKGROUNDS[0].id);
  const [selectedClothes, setSelectedClothes] = useState(CLOTHES[0].id);
  const [selectedHat, setSelectedHat] = useState(HEADWEAR[0].id);
  const [selectedFace, setSelectedFace] = useState(FACE[0].id);

  const registerPfp = useRegisterPfp();
  const { data: pfpCount } = usePfpCount();

  const drawPFP = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const bg = BACKGROUNDS.find((b) => b.id === selectedBg);
    const clothes = CLOTHES.find((c) => c.id === selectedClothes);
    const hat = HEADWEAR.find((h) => h.id === selectedHat);
    const face = FACE.find((f) => f.id === selectedFace);

    const srcs: (string | null)[] = [
      bg?.src ?? null,
      BASE_FROG,
      clothes?.src ?? null,
      hat?.src ?? null,
      face?.src ?? null,
    ];

    for (const src of srcs) {
      if (!src) continue;
      try {
        const img = await loadImage(src);
        ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
      } catch {
        // skip failed layer
      }
    }
  }, [selectedBg, selectedClothes, selectedHat, selectedFace]);

  const handleRandomize = () => {
    const rand = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
    setSelectedBg(rand(BACKGROUNDS).id);
    setSelectedClothes(rand(CLOTHES).id);
    setSelectedHat(rand(HEADWEAR).id);
    setSelectedFace(rand(FACE).id);
  };

  const handleDownload = async () => {
    await drawPFP();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "forg-pfp.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    registerPfp.mutate();
    toast.success("PFP downloaded! Welcome to the pond! 🐸");
  };

  const activeBg = BACKGROUNDS.find((b) => b.id === selectedBg);
  const activeClothes = CLOTHES.find((c) => c.id === selectedClothes);
  const activeHat = HEADWEAR.find((h) => h.id === selectedHat);
  const activeFace = FACE.find((f) => f.id === selectedFace);

  // Every layer fills the exact same 340×340 space — no transform scaling
  const layerStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
  };

  return (
    <section id="pfp" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[oklch(0.65_0.15_145/0.05)] rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-[oklch(0.76_0.10_82/0.06)] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-display text-xs uppercase tracking-[0.4em] text-gold/70 mb-3 block">
            Represent the Pond
          </span>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl uppercase text-foreground">
            BUILD YOUR <span className="text-gold">FORG PFP</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Dress up the official FORG mascot. Pick your background, gear, and
            accessories then download your custom PFP.
          </p>
          {pfpCount !== undefined && (
            <p className="text-gold/60 text-sm mt-2">
              🐸{" "}
              <span className="font-bold text-gold">{pfpCount.toString()}</span>{" "}
              PFPs generated so far
            </p>
          )}
        </motion.div>

        <div className="grid xl:grid-cols-[1fr_420px] gap-10 items-start">
          {/* ── Trait selectors ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <TraitPanel
              label="Clothes"
              emoji="🤵"
              items={CLOTHES.map((c) => ({
                id: c.id,
                label: c.label,
                emoji: c.emoji,
              }))}
              selected={selectedClothes}
              onSelect={setSelectedClothes}
            />
            <TraitPanel
              label="Background"
              emoji="🌄"
              items={BACKGROUNDS.map((b) => ({
                id: b.id,
                label: b.label,
                emoji: b.emoji,
              }))}
              selected={selectedBg}
              onSelect={setSelectedBg}
            />
            <TraitPanel
              label="Headwear"
              emoji="🎩"
              items={HEADWEAR.map((h) => ({
                id: h.id,
                label: h.label,
                emoji: h.emoji,
              }))}
              selected={selectedHat}
              onSelect={setSelectedHat}
            />
            <TraitPanel
              label="Face Accessories"
              emoji="👓"
              items={FACE.map((f) => ({
                id: f.id,
                label: f.label,
                emoji: f.emoji,
              }))}
              selected={selectedFace}
              onSelect={setSelectedFace}
            />
          </motion.div>

          {/* ── Preview + buttons ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="xl:sticky xl:top-24 flex flex-col items-center gap-5"
          >
            <div className="relative">
              {/* Preview container — exactly 340×340, no transform scaling */}
              <div
                className="rounded-2xl border-2 border-gold/30 shadow-[0_0_40px_oklch(0.76_0.10_82/0.15)]"
                style={{
                  position: "relative",
                  width: PREVIEW_SIZE,
                  height: PREVIEW_SIZE,
                  overflow: "hidden",
                }}
              >
                {activeBg?.src && (
                  <img src={activeBg.src} alt="" style={layerStyle} />
                )}
                <img src={BASE_FROG} alt="FORG mascot" style={layerStyle} />
                {activeClothes?.src && (
                  <img src={activeClothes.src} alt="" style={layerStyle} />
                )}
                {activeHat?.src && (
                  <img src={activeHat.src} alt="" style={layerStyle} />
                )}
                {activeFace?.src && (
                  <img src={activeFace.src} alt="" style={layerStyle} />
                )}
              </div>

              {/* Hidden canvas for PNG export at full 1080×1080 */}
              <canvas ref={canvasRef} style={{ display: "none" }} />

              <div className="absolute -bottom-3 -right-3 bg-gold text-[oklch(0.08_0.02_240)] text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                $FORG
              </div>
            </div>

            <div className="flex gap-3 w-full max-w-[340px]">
              <Button
                onClick={handleRandomize}
                variant="outline"
                className="flex-1 border-gold/40 text-gold hover:bg-gold/10 hover:border-gold rounded-full font-bold uppercase tracking-wider text-sm py-5"
              >
                <Shuffle size={16} className="mr-1.5" />
                Randomize
              </Button>
              <Button
                onClick={handleDownload}
                className="flex-1 bg-gold hover:bg-gold-bright text-[oklch(0.08_0.02_240)] font-bold uppercase tracking-wider rounded-full py-5 shadow-[0_4px_20px_oklch(0.76_0.10_82/0.35)] text-sm"
              >
                <Download size={16} className="mr-1.5" />
                Download
              </Button>
            </div>

            <p className="text-xs text-muted-foreground/60 text-center max-w-[280px]">
              Layers: Background → Frog → Clothes → Headwear → Face
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Trait panel sub-component ─────────────────────────────────────────────────

type TraitItem = { id: string; label: string; emoji: string };

function TraitPanel({
  label,
  emoji,
  items,
  selected,
  onSelect,
}: {
  label: string;
  emoji: string;
  items: TraitItem[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <p className="text-xs uppercase tracking-widest text-gold/70 font-bold mb-3">
        {emoji} {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              selected === item.id
                ? "border-gold bg-gold/15 text-gold shadow-[0_0_12px_oklch(0.76_0.10_82/0.3)]"
                : "border-border/60 text-muted-foreground hover:border-gold/40 hover:text-foreground hover:bg-white/5"
            }`}
          >
            <span>{item.emoji}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
