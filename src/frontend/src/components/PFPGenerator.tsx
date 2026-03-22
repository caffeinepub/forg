import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePfpCount, useRegisterPfp } from "@/hooks/useQueries";
import { Coins, Crown, Download, Tag, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type OverlayType = "mascot" | "coin" | "crown" | "watermark";

const OVERLAY_OPTIONS: {
  id: OverlayType;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "mascot",
    label: "FORG Mascot",
    icon: <span className="text-lg">🐸</span>,
  },
  { id: "coin", label: "FORG Coin", icon: <Coins size={18} /> },
  { id: "crown", label: "Frog Crown", icon: <Crown size={18} /> },
  { id: "watermark", label: "FORG Mark", icon: <Tag size={18} /> },
];

const EXAMPLE_CONFIGS = [
  { id: "og", rotate: -6, scale: 1.05, label: "OG Holder" },
  { id: "diamond", rotate: 3, scale: 1, label: "Diamond Hands" },
  { id: "lord", rotate: -2, scale: 0.98, label: "Pond Lord" },
];

const POND_STATS = [
  { id: "members", icon: "💧", label: "Pond Members", value: "512" },
  { id: "pfps", icon: "🐸", label: "PFPs Made", value: "0" },
];

export function PFPGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [userImage, setUserImage] = useState<HTMLImageElement | null>(null);
  const [overlay, setOverlay] = useState<OverlayType>("mascot");
  const [overlaySize, setOverlaySize] = useState(40);
  const [overlayX, setOverlayX] = useState(70);
  const [overlayY, setOverlayY] = useState(70);

  const mascotImgRef = useRef<HTMLImageElement | null>(null);
  const coinImgRef = useRef<HTMLImageElement | null>(null);

  const registerPfp = useRegisterPfp();
  const { data: pfpCount } = usePfpCount();

  useEffect(() => {
    const mascot = new Image();
    mascot.src = "/assets/uploads/F8DA6749-9BC2-45C6-A9D9-E260117430FC-1.jpg";
    mascot.onload = () => {
      mascotImgRef.current = mascot;
    };

    const coin = new Image();
    coin.src = "/assets/uploads/63C52A3F-5360-4A0B-82AB-3B4D9B931E46-2.png";
    coin.onload = () => {
      coinImgRef.current = coin;
    };
  }, []);

  const drawPFP = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 400;
    canvas.width = size;
    canvas.height = size;

    if (!userImage) {
      const grad = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2,
      );
      grad.addColorStop(0, "oklch(0.18 0.04 200)");
      grad.addColorStop(1, "oklch(0.10 0.022 240)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
    } else {
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();
      const img = userImage;
      const scale = Math.max(size / img.width, size / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
    ctx.strokeStyle = "oklch(0.76 0.10 82)";
    ctx.lineWidth = 8;
    ctx.stroke();

    const ovSize = (overlaySize / 100) * size;
    const ovX = (overlayX / 100) * size - ovSize / 2;
    const ovY = (overlayY / 100) * size - ovSize / 2;

    if (overlay === "mascot" && mascotImgRef.current) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(ovX + ovSize / 2, ovY + ovSize / 2, ovSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(mascotImgRef.current, ovX, ovY, ovSize, ovSize);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(ovX + ovSize / 2, ovY + ovSize / 2, ovSize / 2, 0, Math.PI * 2);
      ctx.strokeStyle = "oklch(0.76 0.10 82)";
      ctx.lineWidth = 3;
      ctx.stroke();
    } else if (overlay === "coin" && coinImgRef.current) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(ovX + ovSize / 2, ovY + ovSize / 2, ovSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(coinImgRef.current, ovX, ovY, ovSize, ovSize);
      ctx.restore();
    } else if (overlay === "crown") {
      ctx.save();
      ctx.fillStyle = "oklch(0.87 0.11 85)";
      ctx.strokeStyle = "oklch(0.64 0.10 80)";
      ctx.lineWidth = 2;
      const cx = ovX + ovSize / 2;
      const cy = ovY + ovSize * 0.4;
      const cw = ovSize * 0.9;
      const ch = ovSize * 0.5;
      ctx.beginPath();
      ctx.moveTo(cx - cw / 2, cy + ch / 2);
      ctx.lineTo(cx - cw / 2, cy);
      ctx.lineTo(cx - cw / 3, cy + ch / 3);
      ctx.lineTo(cx, cy - ch / 2);
      ctx.lineTo(cx + cw / 3, cy + ch / 3);
      ctx.lineTo(cx + cw / 2, cy);
      ctx.lineTo(cx + cw / 2, cy + ch / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      const jewels = [
        { x: cx - cw / 4, color: "oklch(0.65 0.15 25)" },
        { x: cx, color: "oklch(0.55 0.17 145)" },
        { x: cx + cw / 4, color: "oklch(0.65 0.15 25)" },
      ];
      for (const jewel of jewels) {
        ctx.beginPath();
        ctx.arc(jewel.x, cy + ch / 4, 3, 0, Math.PI * 2);
        ctx.fillStyle = jewel.color;
        ctx.fill();
      }
      ctx.restore();
    } else if (overlay === "watermark") {
      ctx.save();
      ctx.font = `bold ${ovSize * 0.35}px 'Bricolage Grotesque', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = "oklch(0.76 0.10 82)";
      ctx.fillText("$FORG", ovX + ovSize / 2, ovY + ovSize / 2);
      ctx.restore();
    }
  }, [userImage, overlay, overlaySize, overlayX, overlayY]);

  useEffect(() => {
    drawPFP();
  }, [drawPFP]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => setUserImage(img);
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
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
            CREATE YOUR <span className="text-gold">FORG PFP</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Upload your photo and FORG it up. Join thousands of FORG holders
            showing their pond pride.
          </p>
          {pfpCount !== undefined && (
            <p className="text-gold/60 text-sm mt-2">
              🐸{" "}
              <span className="font-bold text-gold">{pfpCount.toString()}</span>{" "}
              PFPs generated so far
            </p>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Generator */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-6 md:p-8"
            data-ocid="pfp.panel"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className="rounded-full border-2 border-gold/30 shadow-gold"
                  style={{ width: 260, height: 260 }}
                />
                {!userImage && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[oklch(0.10_0.022_240/0.5)] pointer-events-none">
                    <span className="text-muted-foreground text-sm text-center px-4">
                      Upload photo
                      <br />
                      to preview
                    </span>
                  </div>
                )}
              </div>
            </div>

            <label
              className="block w-full cursor-pointer"
              data-ocid="pfp.upload_button"
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
              <div className="flex items-center justify-center gap-2 border-2 border-dashed border-gold/30 rounded-xl py-3 px-4 hover:border-gold/60 hover:bg-gold/5 transition-all text-gold">
                <Upload size={18} />
                <span className="font-medium text-sm uppercase tracking-wider">
                  {userImage ? "Change Photo" : "Upload Your Photo"}
                </span>
              </div>
            </label>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Overlay Style
              </p>
              <div className="grid grid-cols-4 gap-2">
                {OVERLAY_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setOverlay(opt.id)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl py-2.5 px-1 border transition-all text-xs font-medium ${
                      overlay === opt.id
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-border text-muted-foreground hover:border-gold/40 hover:text-foreground"
                    }`}
                    data-ocid="pfp.toggle"
                  >
                    {opt.icon}
                    <span className="leading-tight text-center">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                  <span>Overlay Size</span>
                  <span className="text-gold">{overlaySize}%</span>
                </div>
                <Slider
                  value={[overlaySize]}
                  onValueChange={([v]) => setOverlaySize(v)}
                  min={10}
                  max={80}
                  step={1}
                  data-ocid="pfp.input"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                  <span>Horizontal Position</span>
                  <span className="text-gold">{overlayX}%</span>
                </div>
                <Slider
                  value={[overlayX]}
                  onValueChange={([v]) => setOverlayX(v)}
                  min={10}
                  max={90}
                  step={1}
                  data-ocid="pfp.input"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                  <span>Vertical Position</span>
                  <span className="text-gold">{overlayY}%</span>
                </div>
                <Slider
                  value={[overlayY]}
                  onValueChange={([v]) => setOverlayY(v)}
                  min={10}
                  max={90}
                  step={1}
                  data-ocid="pfp.input"
                />
              </div>
            </div>

            <Button
              onClick={handleDownload}
              className="mt-6 w-full bg-gold hover:bg-gold-bright text-[oklch(0.08_0.02_240)] font-bold uppercase tracking-widest rounded-full py-6 shadow-gold-sm hover:shadow-gold transition-all text-sm"
              data-ocid="pfp.submit_button"
            >
              <Download size={18} className="mr-2" />
              Download My FORG PFP
            </Button>
          </motion.div>

          {/* Example cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="font-display font-bold text-xl text-foreground uppercase tracking-wide">
              Join the <span className="text-gold">FORG Army</span> 🐸
            </h3>
            <p className="text-muted-foreground">
              Upload your selfie, add a FORG overlay, and download your new PFP.
              Show the world you&apos;re part of the pond.
            </p>

            <div className="flex gap-4 flex-wrap">
              {EXAMPLE_CONFIGS.map((cfg, i) => (
                <motion.div
                  key={cfg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-2xl p-3 flex flex-col items-center gap-2"
                  style={{
                    transform: `rotate(${cfg.rotate}deg) scale(${cfg.scale})`,
                  }}
                  data-ocid={`pfp.item.${i + 1}`}
                >
                  <div className="relative">
                    <img
                      src="/assets/uploads/F8DA6749-9BC2-45C6-A9D9-E260117430FC-1.jpg"
                      alt={`Example PFP ${i + 1}`}
                      className="w-24 h-24 rounded-full object-cover border-2 border-gold/40"
                    />
                    {i === 0 && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full overflow-hidden border-2 border-gold">
                        <img
                          src="/assets/uploads/63C52A3F-5360-4A0B-82AB-3B4D9B931E46-2.png"
                          alt="coin"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {i === 1 && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xl">
                        👑
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-gold uppercase tracking-wider">
                    {cfg.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    $FORG Holder
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {POND_STATS.map((stat) => (
                <div
                  key={stat.id}
                  className="glass-card rounded-xl p-4 flex items-center gap-3"
                >
                  <span className="text-gold text-lg">{stat.icon}</span>
                  <div>
                    <div className="font-bold text-foreground text-sm">
                      {stat.id === "pfps" && pfpCount
                        ? pfpCount.toString()
                        : stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
