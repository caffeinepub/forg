import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePfpCount, useRegisterPfp } from "@/hooks/useQueries";
import { Download, Shuffle } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
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
    src: "/assets/generated/bg-swamp.dim_500x500.png",
  },
  {
    id: "forest",
    label: "Forest",
    emoji: "🌳",
    src: "/assets/generated/bg-forest.dim_500x500.png",
  },
  {
    id: "pond",
    label: "Lily Pond",
    emoji: "🪷",
    src: "/assets/generated/bg-pond.dim_500x500.png",
  },
  {
    id: "cult",
    label: "Dark Cult",
    emoji: "🕯️",
    src: "/assets/generated/bg-cult.dim_500x500.png",
  },
  {
    id: "nightswamp",
    label: "Night Swamp",
    emoji: "🌙",
    src: "/assets/generated/bg-night-swamp.dim_500x500.png",
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
    src: "/assets/generated/custom-baseball-cap.png",
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

// ── Layer descriptor ───────────────────────────────────────────────────────────

type LayerDescriptor = {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

function makeLayer(
  src: string,
  size: number,
  overrides?: Partial<{ x: number; y: number; w: number; h: number }>,
): LayerDescriptor {
  return { src, x: 0, y: 0, w: size, h: size, ...overrides };
}

// ── Wearable transform state ───────────────────────────────────────────────────

type WearableTransform = {
  scale: number; // 0.5 – 2.0
  offsetX: number; // -200 – 200
  offsetY: number; // -200 – 200
};

const DEFAULT_SUIT_TRANSFORM: WearableTransform = {
  scale: 1.0,
  offsetX: 0,
  offsetY: 0,
};
const DEFAULT_HAT_TRANSFORM: WearableTransform = {
  scale: 1.0,
  offsetX: 0,
  offsetY: 0,
};
const DEFAULT_FACE_TRANSFORM: WearableTransform = {
  scale: 1.0,
  offsetX: 0,
  offsetY: 0,
};

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
const SUIT_W = 750;
const SUIT_H = Math.round(750 * (1024 / 1536));
const SUIT_X = Math.round((500 - SUIT_W) / 2);
const SUIT_Y = Math.round((500 - SUIT_H) / 2) + 30;

export function PFPGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedBg, setSelectedBg] = useState(BACKGROUNDS[0].id);
  const [selectedClothes, setSelectedClothes] = useState(CLOTHES[0].id);
  const [selectedHat, setSelectedHat] = useState(HEADWEAR[0].id);
  const [selectedFace, setSelectedFace] = useState(FACE[0].id);
  const [rendering, setRendering] = useState(false);

  const [suitTransform, setSuitTransform] = useState<WearableTransform>(
    DEFAULT_SUIT_TRANSFORM,
  );
  const [hatTransform, setHatTransform] = useState<WearableTransform>(
    DEFAULT_HAT_TRANSFORM,
  );
  const [faceTransform, setFaceTransform] = useState<WearableTransform>(
    DEFAULT_FACE_TRANSFORM,
  );

  const registerPfp = useRegisterPfp();
  const { data: pfpCount } = usePfpCount();

  const drawPFP = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setRendering(true);

    const size = 500;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    const bg = BACKGROUNDS.find((b) => b.id === selectedBg);
    const clothes = CLOTHES.find((c) => c.id === selectedClothes);
    const hat = HEADWEAR.find((h) => h.id === selectedHat);
    const face = FACE.find((f) => f.id === selectedFace);

    // Build suit layer with transform
    let suitLayer: LayerDescriptor | null = null;
    if (clothes?.src === "/assets/uploads/Mascot-suit-2.png") {
      const w = Math.round(SUIT_W * suitTransform.scale);
      const h = Math.round(SUIT_H * suitTransform.scale);
      const x = SUIT_X + Math.round((SUIT_W - w) / 2) + suitTransform.offsetX;
      const y = SUIT_Y + Math.round((SUIT_H - h) / 2) + suitTransform.offsetY;
      suitLayer = makeLayer(clothes.src, size, { x, y, w, h });
    } else if (clothes?.src) {
      const w = Math.round(size * suitTransform.scale);
      const h = Math.round(size * suitTransform.scale);
      const x = Math.round((size - w) / 2) + suitTransform.offsetX;
      const y = Math.round((size - h) / 2) + suitTransform.offsetY;
      suitLayer = makeLayer(clothes.src, size, { x, y, w, h });
    }

    // Hat layer with transform
    let hatLayer: LayerDescriptor | null = null;
    if (hat?.src) {
      const w = Math.round(size * hatTransform.scale);
      const h = Math.round(size * hatTransform.scale);
      const x = Math.round((size - w) / 2) + hatTransform.offsetX;
      const y = Math.round((size - h) / 2) + hatTransform.offsetY;
      hatLayer = makeLayer(hat.src, size, { x, y, w, h });
    }

    // Face layer with transform
    let faceLayer: LayerDescriptor | null = null;
    if (face?.src) {
      const w = Math.round(size * faceTransform.scale);
      const h = Math.round(size * faceTransform.scale);
      const x = Math.round((size - w) / 2) + faceTransform.offsetX;
      const y = Math.round((size - h) / 2) + faceTransform.offsetY;
      faceLayer = makeLayer(face.src, size, { x, y, w, h });
    }

    const layers: LayerDescriptor[] = [
      bg?.src ? makeLayer(bg.src, size) : null,
      makeLayer(BASE_FROG, size),
      suitLayer,
      hatLayer,
      faceLayer,
    ].filter((l): l is LayerDescriptor => l !== null);

    for (const layer of layers) {
      try {
        const img = await loadImage(layer.src);
        ctx.drawImage(img, layer.x, layer.y, layer.w, layer.h);
      } catch {
        // skip failed layer
      }
    }

    setRendering(false);
  }, [
    selectedBg,
    selectedClothes,
    selectedHat,
    selectedFace,
    suitTransform,
    hatTransform,
    faceTransform,
  ]);

  useEffect(() => {
    drawPFP();
  }, [drawPFP]);

  const handleRandomize = () => {
    const rand = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
    setSelectedBg(rand(BACKGROUNDS).id);
    setSelectedClothes(rand(CLOTHES).id);
    setSelectedHat(rand(HEADWEAR).id);
    setSelectedFace(rand(FACE).id);
    setSuitTransform(DEFAULT_SUIT_TRANSFORM);
    setHatTransform(DEFAULT_HAT_TRANSFORM);
    setFaceTransform(DEFAULT_FACE_TRANSFORM);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "forg-pfp.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    registerPfp.mutate();
    toast.success("PFP downloaded! Welcome to the pond! 🐸");
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
            {/* Clothes */}
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
            {selectedClothes !== "none" && (
              <WearableControls
                label="Clothes Adjustment"
                transform={suitTransform}
                onChange={setSuitTransform}
              />
            )}

            {/* Background */}
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

            {/* Headwear */}
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
            {selectedHat !== "none" && (
              <WearableControls
                label="Headwear Adjustment"
                transform={hatTransform}
                onChange={setHatTransform}
              />
            )}

            {/* Face */}
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
            {selectedFace !== "none" && (
              <WearableControls
                label="Face Accessory Adjustment"
                transform={faceTransform}
                onChange={setFaceTransform}
              />
            )}
          </motion.div>

          {/* ── Preview + buttons ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="xl:sticky xl:top-24 flex flex-col items-center gap-5 max-h-[calc(100vh-6rem)] overflow-y-auto"
          >
            <div className="relative">
              <div
                className="rounded-2xl overflow-hidden border-2 border-gold/30 shadow-[0_0_40px_oklch(0.76_0.10_82/0.15)]"
                style={{ width: 340, height: 340 }}
              >
                <canvas
                  ref={canvasRef}
                  style={{ width: "100%", height: "100%", display: "block" }}
                />
              </div>
              {rendering && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40">
                  <span className="text-gold text-sm font-bold animate-pulse">
                    Rendering...
                  </span>
                </div>
              )}
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

// ── Wearable controls sub-component ──────────────────────────────────────────

function WearableControls({
  label,
  transform,
  onChange,
}: {
  label: string;
  transform: WearableTransform;
  onChange: (t: WearableTransform) => void;
}) {
  const set = (key: keyof WearableTransform, val: number) =>
    onChange({ ...transform, [key]: val });

  return (
    <div className="glass-card rounded-2xl p-4 space-y-4">
      <p className="text-xs uppercase tracking-widest text-gold/70 font-bold">
        ⚙️ {label}
      </p>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Size</span>
          <span className="text-gold font-semibold">
            {Math.round(transform.scale * 100)}%
          </span>
        </div>
        <Slider
          min={30}
          max={200}
          step={1}
          value={[Math.round(transform.scale * 100)]}
          onValueChange={([v]) => set("scale", v / 100)}
          className="w-full"
        />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Move Left / Right</span>
          <span className="text-gold font-semibold">
            {transform.offsetX > 0 ? "+" : ""}
            {transform.offsetX}px
          </span>
        </div>
        <Slider
          min={-200}
          max={200}
          step={1}
          value={[transform.offsetX]}
          onValueChange={([v]) => set("offsetX", v)}
          className="w-full"
        />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Move Up / Down</span>
          <span className="text-gold font-semibold">
            {transform.offsetY > 0 ? "+" : ""}
            {transform.offsetY}px
          </span>
        </div>
        <Slider
          min={-200}
          max={200}
          step={1}
          value={[transform.offsetY]}
          onValueChange={([v]) => set("offsetY", v)}
          className="w-full"
        />
      </div>

      <button
        type="button"
        onClick={() => onChange({ scale: 1.0, offsetX: 0, offsetY: 0 })}
        className="text-xs text-muted-foreground/60 hover:text-gold transition-colors underline underline-offset-2"
      >
        Reset to default
      </button>
    </div>
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
