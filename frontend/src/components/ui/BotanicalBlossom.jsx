import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Flower2, RefreshCw, Sparkles, Sprout, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function BotanicalBlossom({
  title = "Organic Career Evolution",
  subtitle = "Like a delicate blossom growing from a single stem, your technical skills and career trajectory evolve organically with every screened milestone.",
  showOverlay = true,
  className = "",
}) {
  const canvasRef = useRef(null);
  const [bloomProgress, setBloomProgress] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);

    // Blossom particle cloud definition
    const blossomCount = 140;
    const blossoms = [];
    const driftPollenCount = 35;
    const pollen = [];

    // Stem spine control points (single delicate curving green stem)
    let growth = 0; // 0 to 1
    const growthSpeed = 0.0035;

    // Generate blossom positions along the upper canopy
    for (let i = 0; i < blossomCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.pow(Math.random(), 0.7) * 160;
      blossoms.push({
        relX: Math.cos(angle) * dist,
        relY: Math.sin(angle) * (dist * 0.75) - 180, // Centered around upper stem tip
        stemProgressThreshold: 0.35 + (dist / 160) * 0.6,
        size: Math.random() * 9 + 4,
        hueOffset: Math.random() * 25 - 12, // Slight variation in purple hues
        alpha: Math.random() * 0.5 + 0.45,
        petals: Math.floor(Math.random() * 3) + 5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.01,
        swayPhase: Math.random() * Math.PI * 2,
      });
    }

    // Floating ambient pollen
    for (let i = 0; i < driftPollenCount; i++) {
      pollen.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.6,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3 - 0.1,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    let time = 0;
    let lastReportedPercent = 0;

    const render = () => {
      time += 0.015;
      if (growth < 1) {
        growth = Math.min(1, growth + growthSpeed);
        const nextPercent = Math.floor(growth * 100);
        if (nextPercent !== lastReportedPercent) {
          lastReportedPercent = nextPercent;
          setBloomProgress(nextPercent);
        }
      }

      ctx.clearRect(0, 0, width, height);

      // Pure dark background with subtle botanical violet-emerald ambient vignette
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height * 0.45,
        40,
        width / 2,
        height * 0.5,
        Math.max(width, height) * 0.65
      );
      bgGrad.addColorStop(0, "rgba(30, 10, 45, 0.4)");
      bgGrad.addColorStop(0.5, "rgba(10, 20, 15, 0.2)");
      bgGrad.addColorStop(1, "rgba(5, 5, 8, 1)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Mouse influence for organic botanical breeze
      const swayX = Math.sin(time * 0.8) * 8 + (mouseX - width / 2) * 0.025;
      const swayY = Math.cos(time * 0.6) * 4 + (mouseY - height / 2) * 0.015;

      const startX = width / 2;
      const startY = height - 20;

      // Draw floating pollen drifting softly
      ctx.save();
      for (const p of pollen) {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(216, 180, 254, 0.6)"; // Soft lavender glow
        ctx.shadowColor = "#c084fc";
        ctx.shadowBlur = 6;
        ctx.globalAlpha = p.alpha * (0.6 + Math.sin(time + p.x) * 0.4);
        ctx.fill();
      }
      ctx.restore();

      // Stem points calculation using organic spline
      const stemSegments = 60;
      const visibleSegments = Math.floor(stemSegments * growth);
      const stemPoints = [];

      for (let i = 0; i <= stemSegments; i++) {
        const t = i / stemSegments;
        const curve = Math.sin(t * Math.PI * 1.4) * 45;
        const microSway = Math.sin(time * 1.2 + t * 4) * (t * 18) + (t * swayX);

        const x = startX + curve + microSway;
        const y = startY - t * (height * 0.65) + (t * swayY);
        stemPoints.push({ x, y, t });
      }

      // Draw delicate green stem
      if (visibleSegments > 1) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(stemPoints[0].x, stemPoints[0].y);

        for (let i = 1; i <= visibleSegments; i++) {
          ctx.lineTo(stemPoints[i].x, stemPoints[i].y);
        }

        const stemGrad = ctx.createLinearGradient(
          startX,
          startY,
          stemPoints[visibleSegments].x,
          stemPoints[visibleSegments].y
        );
        stemGrad.addColorStop(0, "#14532d"); // Deep organic emerald stem base
        stemGrad.addColorStop(0.5, "#22c55e"); // Vibrant botanic green
        stemGrad.addColorStop(1, "#86efac"); // Tender growing apex tip

        ctx.strokeStyle = stemGrad;
        ctx.lineWidth = 3.5 * (1 - (visibleSegments / stemSegments) * 0.45);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowColor = "rgba(34, 197, 94, 0.4)";
        ctx.shadowBlur = 8;
        ctx.stroke();

        // Draw delicate organic side branchlets and leaf buds along stem
        for (let i = 8; i <= visibleSegments; i += 7) {
          const pt = stemPoints[i];
          const side = i % 2 === 0 ? 1 : -1;
          const branchProgress = Math.max(0, Math.min(1, (growth - pt.t) * 4));

          if (branchProgress > 0) {
            const branchLen = 28 * branchProgress;
            const branchAngle = (side * Math.PI) / 3.8 + Math.sin(time + i) * 0.1;
            const bx = pt.x + Math.cos(branchAngle) * branchLen * side;
            const by = pt.y - Math.sin(Math.abs(branchAngle)) * branchLen * 0.7;

            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.quadraticCurveTo(
              pt.x + (side * branchLen * 0.5),
              pt.y - branchLen * 0.2,
              bx,
              by
            );
            ctx.strokeStyle = "#4ade80";
            ctx.lineWidth = 1.4;
            ctx.stroke();

            // Leaf bud tip
            ctx.beginPath();
            ctx.ellipse(
              bx,
              by,
              4 * branchProgress,
              2 * branchProgress,
              branchAngle,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = "#86efac";
            ctx.shadowColor = "#4ade80";
            ctx.shadowBlur = 4;
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // Draw Purple Blossoms Cloud
      const tip = stemPoints[Math.min(visibleSegments, stemSegments)];

      for (let i = 0; i < blossoms.length; i++) {
        const b = blossoms[i];
        if (growth >= b.stemProgressThreshold) {
          const bGrowth = Math.min(1, (growth - b.stemProgressThreshold) * 3.5);
          if (bGrowth <= 0) continue;

          b.rotation += b.rotSpeed;
          const sway = Math.sin(time * 1.5 + b.swayPhase) * 6;

          const flowerX = tip.x + b.relX * bGrowth + sway;
          const flowerY = tip.y + b.relY * bGrowth + Math.cos(time + i) * 3;
          const flowerSize = b.size * bGrowth;

          ctx.save();
          ctx.translate(flowerX, flowerY);
          ctx.rotate(b.rotation);

          // Subtle connection filament to cluster
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-b.relX * 0.1, -b.relY * 0.1);
          ctx.strokeStyle = "rgba(74, 222, 128, 0.2)";
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Petals
          const petalCount = b.petals;
          for (let p = 0; p < petalCount; p++) {
            const angle = (p / petalCount) * Math.PI * 2;
            ctx.save();
            ctx.rotate(angle);

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(
              flowerSize * 0.45,
              -flowerSize * 0.6,
              flowerSize * 0.3,
              -flowerSize * 1.1,
              0,
              -flowerSize * 1.3
            );
            ctx.bezierCurveTo(
              -flowerSize * 0.3,
              -flowerSize * 1.1,
              -flowerSize * 0.45,
              -flowerSize * 0.6,
              0,
              0
            );

            // Shading: Ethereal Lavender, Violet & Deep Purple Gradient
            const pGrad = ctx.createRadialGradient(
              0,
              -flowerSize * 0.6,
              0.5,
              0,
              -flowerSize * 0.6,
              flowerSize * 1.3
            );
            pGrad.addColorStop(0, `hsla(${275 + b.hueOffset}, 95%, 85%, ${b.alpha * bGrowth})`);
            pGrad.addColorStop(0.5, `hsla(${285 + b.hueOffset}, 85%, 62%, ${b.alpha * 0.85 * bGrowth})`);
            pGrad.addColorStop(1, `hsla(${295 + b.hueOffset}, 75%, 40%, ${b.alpha * 0.3 * bGrowth})`);

            ctx.fillStyle = pGrad;
            ctx.shadowColor = "#c084fc";
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.restore();
          }

          // Flower Core (Pistil golden glow)
          ctx.beginPath();
          ctx.arc(0, 0, Math.max(1.2, flowerSize * 0.22), 0, Math.PI * 2);
          ctx.fillStyle = "rgba(253, 224, 71, 0.95)"; // Ethereal golden pollen center
          ctx.shadowColor = "#facc15";
          ctx.shadowBlur = 8;
          ctx.fill();

          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [resetKey]);

  const handleReplay = () => {
    setResetKey((prev) => prev + 1);
    setBloomProgress(0);
  };

  return (
    <div
      className={`relative w-full min-h-[580px] rounded-3xl overflow-hidden bg-black border border-purple-500/20 shadow-2xl ${className}`}
    >
      {/* Interactive Botanical Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-pointer"
        onClick={handleReplay}
      />

      {/* Top Status & Replay Control */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-2.5 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-purple-500/30 shadow-lg">
        <div className="flex items-center gap-2">
          <Sprout size={14} className="text-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono font-bold text-purple-300">
            Bloom: {bloomProgress}%
          </span>
        </div>

        <div className="h-4 w-[1px] bg-slate-800" />

        <button
          type="button"
          onClick={handleReplay}
          title="Re-grow Blossom"
          className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 hover:text-white px-2 py-0.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <RefreshCw size={12} />
          <span>Regrow</span>
        </button>
      </div>

      {/* Content Overlay */}
      {showOverlay && (
        <div className="relative z-10 flex flex-col justify-end p-8 sm:p-12 md:p-14 min-h-[580px] pointer-events-none">
          <div className="max-w-xl pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md shadow-lg"
            >
              <Flower2 size={14} className="text-purple-400 animate-spin" />
              <span>Abstract Organic Growth</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight"
            >
              {title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Sparkles size={15} />
                <span>Nurture Your Resume</span>
                <ArrowRight size={15} />
              </Link>

              <button
                type="button"
                onClick={handleReplay}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-semibold text-xs sm:text-sm backdrop-blur-md transition-colors"
              >
                <RefreshCw size={14} />
                <span>Trigger Growth Bloom</span>
              </button>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
