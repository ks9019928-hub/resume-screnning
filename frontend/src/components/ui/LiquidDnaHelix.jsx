import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Dna, ArrowRight, Zap, Play, Pause, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export default function LiquidDnaHelix({
  title = "Unlock Your Career DNA with AI",
  subtitle = "Deep neural genome parsing that decodes your technical competencies, ATS compatibility, and executive job fit.",
  showOverlay = true,
  primaryColor = "#eab308", // Golden amber
  secondaryColor = "#f59e0b",
  glowColor = "rgba(234, 179, 8, 0.4)",
  className = "",
}) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activePreset, setActivePreset] = useState("amber-gold"); // amber-gold, cyber-neon, emerald-ats

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
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);

    // Floating Spores / Particles in 3D
    const sporeCount = 45;
    const spores = Array.from({ length: sporeCount }).map(() => ({
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 600,
      z: Math.random() * 800 - 200,
      radius: Math.random() * 2.5 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      speedZ: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    // DNA Helix Parameters
    const nodePairs = 32;
    const helixRadius = 140;
    const helixHeight = 700;
    const turns = 2.8;
    const fov = 420;
    const cameraZ = -500;

    let time = 0;

    const render = () => {
      if (isPlaying) {
        time += 0.015;
      }

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerping
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const mouseRotY = (mouseX - width / 2) * 0.0018;
      const mouseRotX = (mouseY - height / 2) * 0.0012;

      const originX = width / 2;
      const originY = height / 2;

      // Color Schemes
      const themeColors = {
        "amber-gold": {
          strand1Start: "#fde047",
          strand1End: "#ca8a04",
          strand2Start: "#18181b",
          strand2End: "#3f3f46",
          rung: "rgba(250, 204, 21, 0.45)",
          spore: "rgba(253, 224, 71, 0.8)",
          specular: "#ffffff",
        },
        "cyber-neon": {
          strand1Start: "#38bdf8",
          strand1End: "#0284c7",
          strand2Start: "#c084fc",
          strand2End: "#7c3aed",
          rung: "rgba(192, 132, 252, 0.5)",
          spore: "rgba(56, 189, 248, 0.8)",
          specular: "#e0f2fe",
        },
        "emerald-ats": {
          strand1Start: "#34d399",
          strand1End: "#059669",
          strand2Start: "#818cf8",
          strand2End: "#4f46e5",
          rung: "rgba(52, 211, 153, 0.5)",
          spore: "rgba(52, 211, 153, 0.8)",
          specular: "#d1fae5",
        },
      }[activePreset] || {
        strand1Start: primaryColor,
        strand1End: secondaryColor,
        strand2Start: "#27272a",
        strand2End: "#52525b",
        rung: glowColor,
        spore: primaryColor,
        specular: "#ffffff",
      };

      // Draw background ambient depth gradient
      const bgGrad = ctx.createRadialGradient(
        originX,
        originY,
        50,
        originX,
        originY,
        Math.max(width, height) * 0.65
      );
      bgGrad.addColorStop(0, "rgba(24, 24, 27, 0.4)");
      bgGrad.addColorStop(1, "rgba(9, 9, 11, 0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Collect all 3D elements to sort by Z-depth for correct occlusion
      const renderElements = [];

      // 1. Spores
      for (const s of spores) {
        s.x += s.speedX;
        s.y += s.speedY;
        s.z += s.speedZ;

        if (s.x > 400) s.x = -400;
        if (s.x < -400) s.x = 400;
        if (s.y > 350) s.y = -350;
        if (s.y < -350) s.y = 350;
        if (s.z > 500) s.z = -100;
        if (s.z < -100) s.z = 500;

        // Apply mouse rotation to spores
        const cosY = Math.cos(mouseRotY * 0.5);
        const sinY = Math.sin(mouseRotY * 0.5);
        const cosX = Math.cos(mouseRotX * 0.5);
        const sinX = Math.sin(mouseRotX * 0.5);

        const rx1 = s.x * cosY + s.z * sinY;
        const rz1 = -s.x * sinY + s.z * cosY;
        const ry2 = s.y * cosX - rz1 * sinX;
        const rz2 = s.y * sinX + rz1 * cosX;

        const relZ = rz2 - cameraZ;
        if (relZ > 0) {
          const scale = fov / relZ;
          const projX = originX + rx1 * scale;
          const projY = originY + ry2 * scale;
          const radius = Math.max(0.4, s.radius * scale);

          renderElements.push({
            type: "spore",
            z: rz2,
            projX,
            projY,
            radius,
            alpha: s.alpha * Math.min(Math.max((relZ - 200) / 600, 0.2), 1),
          });
        }
      }

      // 2. DNA Strands and Crossbar Rungs
      for (let i = 0; i < nodePairs; i++) {
        const progress = i / (nodePairs - 1);
        const angle = progress * Math.PI * 2 * turns + time;
        const yOffset = (progress - 0.5) * helixHeight;

        // Dynamic organic liquid wobble on radius
        const liquidWobble = Math.sin(time * 2 + progress * 8) * 12;
        const currentRadius = helixRadius + liquidWobble;

        // Strand 1 (Gold / Bio-Luminescent Node)
        const x1 = Math.cos(angle) * currentRadius;
        const z1 = Math.sin(angle) * currentRadius;
        const y1 = yOffset + Math.sin(time * 3 + progress * 5) * 10;

        // Strand 2 (Counter Obsidian / Metallic Node)
        const x2 = Math.cos(angle + Math.PI) * currentRadius;
        const z2 = Math.sin(angle + Math.PI) * currentRadius;
        const y2 = yOffset - Math.sin(time * 3 + progress * 5) * 10;

        // Rotate in 3D based on continuous time + mouse tilt
        const rotY = time * 0.3 + mouseRotY;
        const rotX = mouseRotX + 0.15; // slight natural 3D tilt

        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);

        // Transform Node 1
        const rx1 = x1 * cosY + z1 * sinY;
        const rz1_temp = -x1 * sinY + z1 * cosY;
        const ry1 = y1 * cosX - rz1_temp * sinX;
        const rz1 = y1 * sinX + rz1_temp * cosX;

        // Transform Node 2
        const rx2 = x2 * cosY + z2 * sinY;
        const rz2_temp = -x2 * sinY + z2 * cosY;
        const ry2 = y2 * cosX - rz2_temp * sinX;
        const rz2 = y2 * sinX + rz2_temp * cosX;

        // Project Node 1
        const relZ1 = rz1 - cameraZ;
        const scale1 = fov / relZ1;
        const projX1 = originX + rx1 * scale1;
        const projY1 = originY + ry1 * scale1;

        // Project Node 2
        const relZ2 = rz2 - cameraZ;
        const scale2 = fov / relZ2;
        const projX2 = originX + rx2 * scale2;
        const projY2 = originY + ry2 * scale2;

        // Push Crossbar Rung
        const avgZ = (rz1 + rz2) / 2;
        renderElements.push({
          type: "rung",
          z: avgZ,
          x1: projX1,
          y1: projY1,
          x2: projX2,
          y2: projY2,
          scale: (scale1 + scale2) / 2,
          progress,
        });

        // Push Node 1 (Gold/Amber bio-node)
        renderElements.push({
          type: "node",
          nodeType: "strand1",
          z: rz1,
          projX: projX1,
          projY: projY1,
          scale: scale1,
          baseRadius: 12 + Math.sin(progress * Math.PI) * 4,
          progress,
        });

        // Push Node 2 (Obsidian counter-node)
        renderElements.push({
          type: "node",
          nodeType: "strand2",
          z: rz2,
          projX: projX2,
          projY: projY2,
          scale: scale2,
          baseRadius: 10 + Math.cos(progress * Math.PI) * 3,
          progress,
        });
      }

      // Sort elements by Z from back to front (Painter's Algorithm)
      renderElements.sort((a, b) => a.z - b.z);

      // Draw all elements in depth order
      for (const el of renderElements) {
        if (el.type === "spore") {
          ctx.beginPath();
          ctx.arc(el.projX, el.projY, el.radius, 0, Math.PI * 2);
          ctx.fillStyle = themeColors.spore;
          ctx.globalAlpha = Math.max(0, Math.min(el.alpha, 1));
          ctx.shadowColor = themeColors.spore;
          ctx.shadowBlur = el.radius * 3;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        } else if (el.type === "rung") {
          ctx.beginPath();
          ctx.moveTo(el.x1, el.y1);
          ctx.lineTo(el.x2, el.y2);
          ctx.lineWidth = Math.max(1, el.scale * 2.8);
          ctx.strokeStyle = themeColors.rung;
          ctx.shadowColor = themeColors.strand1Start;
          ctx.shadowBlur = 6;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Add mini liquid beaded connectors along the rung
          const midX = (el.x1 + el.x2) / 2;
          const midY = (el.y1 + el.y2) / 2;
          ctx.beginPath();
          ctx.arc(midX, midY, Math.max(1, el.scale * 2.2), 0, Math.PI * 2);
          ctx.fillStyle = themeColors.specular;
          ctx.globalAlpha = 0.7;
          ctx.fill();
          ctx.globalAlpha = 1;
        } else if (el.type === "node") {
          const radius = el.baseRadius * el.scale;
          if (radius <= 0.5) continue;

          // Depth of field blur & opacity calculation
          const depthFactor = (el.z + 200) / 400; // 0 = far, 1 = close
          const alpha = Math.min(Math.max(0.35 + depthFactor * 0.65, 0.2), 1);

          ctx.beginPath();
          ctx.arc(el.projX, el.projY, radius, 0, Math.PI * 2);

          if (el.nodeType === "strand1") {
            // Shiny Liquid Gold / Bio-Amber Gradient
            const grad = ctx.createRadialGradient(
              el.projX - radius * 0.35,
              el.projY - radius * 0.35,
              radius * 0.1,
              el.projX,
              el.projY,
              radius
            );
            grad.addColorStop(0, themeColors.specular);
            grad.addColorStop(0.25, themeColors.strand1Start);
            grad.addColorStop(0.75, themeColors.strand1End);
            grad.addColorStop(1, "rgba(69, 26, 3, 0.9)");

            ctx.fillStyle = grad;
            ctx.shadowColor = themeColors.strand1Start;
            ctx.shadowBlur = depthFactor > 0.5 ? 14 : 4;
          } else {
            // Obsidian / Glossy Carbon Sphere
            const grad = ctx.createRadialGradient(
              el.projX - radius * 0.3,
              el.projY - radius * 0.3,
              radius * 0.1,
              el.projX,
              el.projY,
              radius
            );
            grad.addColorStop(0, "rgba(212, 212, 216, 0.9)");
            grad.addColorStop(0.3, themeColors.strand2End);
            grad.addColorStop(0.9, themeColors.strand2Start);
            grad.addColorStop(1, "#09090b");

            ctx.fillStyle = grad;
            ctx.shadowColor = themeColors.strand2End;
            ctx.shadowBlur = depthFactor > 0.5 ? 8 : 2;
          }

          ctx.globalAlpha = alpha;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;

          // Specular Glint for 3D realism
          if (depthFactor > 0.4) {
            ctx.beginPath();
            ctx.arc(
              el.projX - radius * 0.32,
              el.projY - radius * 0.32,
              radius * 0.22,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
            ctx.fill();
          }
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
  }, [isPlaying, activePreset, primaryColor, secondaryColor, glowColor]);

  return (
    <div
      className={`relative w-full min-h-[620px] rounded-3xl overflow-hidden bg-slate-950 border border-white/10 shadow-2xl ${className}`}
    >
      {/* Interactive 3D Canvas Helix */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Top Controls Bar */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800">
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? "Pause Rotation" : "Play Rotation"}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>

        <div className="h-4 w-[1px] bg-slate-800" />

        {/* Color Presets */}
        <button
          type="button"
          onClick={() => setActivePreset("amber-gold")}
          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
            activePreset === "amber-gold"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Bio-Gold
        </button>
        <button
          type="button"
          onClick={() => setActivePreset("cyber-neon")}
          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
            activePreset === "cyber-neon"
              ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Cyber
        </button>
        <button
          type="button"
          onClick={() => setActivePreset("emerald-ats")}
          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
            activePreset === "emerald-ats"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          ATS Emerald
        </button>
      </div>

      {/* Optional Foreground Content Overlay (Matches 21st.dev Hero 5 Layout) */}
      {showOverlay && (
        <div className="relative z-10 flex flex-col justify-end p-8 sm:p-12 md:p-16 min-h-[620px] pointer-events-none">
          <div className="max-w-2xl pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md shadow-lg"
            >
              <Dna size={14} className="animate-spin text-amber-400" />
              <span>Candidate Career Genome Matrix</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]"
            >
              {title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-xl"
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
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <Zap size={16} />
                <span>Start DNA Screening</span>
                <ArrowRight size={16} />
              </Link>

              <button
                type="button"
                onClick={() => {
                  const presets = ["amber-gold", "cyber-neon", "emerald-ats"];
                  const nextIdx = (presets.indexOf(activePreset) + 1) % presets.length;
                  setActivePreset(presets[nextIdx]);
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-800 bg-slate-900/80 hover:bg-slate-850 text-slate-200 font-semibold text-sm backdrop-blur-md transition-colors"
              >
                <RefreshCw size={15} />
                <span>Cycle Shader Preset</span>
              </button>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}

