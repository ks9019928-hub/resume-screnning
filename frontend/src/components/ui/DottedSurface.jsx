import { useEffect, useRef } from "react";

export default function DottedSurface({
  className = "",
  dotColor = "rgba(165, 180, 252, 0.4)",
  glowColor = "rgba(99, 102, 241, 0.8)",
  speed = 0.0018,
}) {
  const canvasRef = useRef(null);

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

    // 3D Grid Parameters
    const cols = 45;
    const rows = 30;
    const spacingX = 40;
    const spacingZ = 35;
    const cameraY = -280;
    const cameraZ = -300;
    const fov = 340;

    let time = 0;

    const render = () => {
      time += speed * 16;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const mouseInfluenceX = (mouseX - width / 2) * 0.0005;
      const mouseInfluenceY = (mouseY - height / 2) * 0.0005;

      const originX = width / 2;
      const originY = height * 0.65;

      // Draw perspective wave dots
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = (c - cols / 2) * spacingX;
          const z = r * spacingZ;

          // Harmonic double sine wave elevation
          const distFromCenter = Math.sqrt(x * x + z * z);
          const wave1 = Math.sin(c * 0.22 + time * 2.2 + distFromCenter * 0.005 + mouseInfluenceY * 5) * 38;
          const wave2 = Math.cos(r * 0.18 - time * 1.6 + mouseInfluenceX * 10) * 22;
          const mouseDist = Math.sqrt(
            Math.pow(x - (mouseX - originX), 2) + Math.pow(z - (mouseY - originY), 2)
          );
          const mouseWave = Math.sin(mouseDist * 0.03 - time * 3) * Math.max(0, 25 - mouseDist * 0.04);

          const y = wave1 + wave2 + mouseWave + r * 3;

          // 3D to 2D projection
          const relZ = z - cameraZ;
          if (relZ <= 0) continue;

          const scale = fov / relZ;
          const projX = originX + x * scale;
          const projY = originY + (y - cameraY) * scale;

          if (projX < -50 || projX > width + 50 || projY < -50 || projY > height + 50) continue;

          // Depth-based size and opacity
          const depthAlpha = Math.min(Math.max((relZ - 50) / 900, 0.1), 0.95);
          const alpha = (1 - depthAlpha) * (0.3 + (wave1 + 38) / 90);
          const radius = Math.max(0.6, scale * 1.8);

          // Render glowing dot
          ctx.beginPath();
          ctx.arc(projX, projY, radius, 0, Math.PI * 2);

          if (r % 6 === 0 && c % 6 === 0 && alpha > 0.4) {
            // Accent highlight dot
            ctx.fillStyle = glowColor;
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 8;
          } else {
            ctx.fillStyle = dotColor;
            ctx.shadowBlur = 0;
          }

          ctx.globalAlpha = Math.max(0, Math.min(alpha, 1));
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [dotColor, glowColor, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
