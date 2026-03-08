import { useEffect, useRef } from "react";
import "../styles/loader.css";

export default function SpaceBackground({ status }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Set canvas dimensions
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener("resize", resize);
    resize();

    // Mouse position tracking
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    
    const onMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    
    window.addEventListener("mousemove", onMouseMove);

    // Stars
    const stars = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5,
        z: Math.random() * 2 + 0.1, // depth for parallax
      });
    }

    // Planets
    const planets = [
      {
        angle: Math.random() * Math.PI * 2,
        distance: 150,
        speed: 0.005,
        radius: 25,
        color1: "#6366f1",
        color2: "#8b5cf6",
        shadow: "#8b5cf6",
      },
      {
        angle: Math.random() * Math.PI * 2,
        distance: 280,
        speed: -0.003,
        radius: 40,
        color1: "#22d3ee",
        color2: "#3b82f6",
        shadow: "#3b82f6",
      },
      {
        angle: Math.random() * Math.PI * 2,
        distance: 400,
        speed: 0.002,
        radius: 18,
        color1: "#f43f5e",
        color2: "#fb923c",
        shadow: "#f43f5e",
      }
    ];

    const drawPlanet = (x, y, radius, color1, color2, shadow) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      
      const gradient = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);
      
      ctx.fillStyle = gradient;
      ctx.shadowColor = shadow;
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.closePath();
      ctx.shadowBlur = 0; // reset
    };

    const drawCenterStar = (x, y) => {
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 60;
      ctx.fill();
      ctx.closePath();
      ctx.shadowBlur = 0;
    };

    // UFO object
    const ufo = {
      x: -150,
      y: height * 0.3,
      speedX: 1.2,
      width: 40,
      height: 12,
      hoverOffset: 0,
      lightAlpha: 0.5,
      lightDir: 1,
    };

    const drawUfo = (u) => {
      // Light Beam
      if (u.lightAlpha > 0) {
        ctx.beginPath();
        ctx.moveTo(u.x, u.y + 5 + u.hoverOffset);
        ctx.lineTo(u.x - 40, u.y + 120 + u.hoverOffset);
        ctx.lineTo(u.x + 40, u.y + 120 + u.hoverOffset);
        const grad = ctx.createLinearGradient(u.x, u.y + u.hoverOffset, u.x, u.y + 120 + u.hoverOffset);
        grad.addColorStop(0, `rgba(139, 92, 246, ${u.lightAlpha})`); // Purple light
        grad.addColorStop(1, "rgba(139, 92, 246, 0)");
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.closePath();
      }

      // Body (Saucer)
      ctx.beginPath();
      ctx.ellipse(u.x, u.y + u.hoverOffset, u.width, u.height, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#cbd5e1"; // slate-300
      ctx.shadowColor = "#cbd5e1";
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.closePath();
      ctx.shadowBlur = 0;

      // Dome
      ctx.beginPath();
      ctx.ellipse(u.x, u.y - 4 + u.hoverOffset, u.width * 0.45, u.height * 0.8, 0, Math.PI, 0);
      ctx.fillStyle = "rgba(56, 189, 248, 0.8)"; // cyan
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.closePath();
      ctx.shadowBlur = 0;
      
      // Bottom Center light
      ctx.beginPath();
      ctx.arc(u.x, u.y + 6 + u.hoverOffset, 4, 0, Math.PI*2);
      ctx.fillStyle = "#fb923c"; // Orange
      ctx.fill();
      ctx.closePath();
    };

    let shakeOffsetX = 0;
    let shakeOffsetY = 0;

    const render = () => {
      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Status animations
      if (status === "error") {
        shakeOffsetX = (Math.random() - 0.5) * 20;
        shakeOffsetY = (Math.random() - 0.5) * 20;
      } else {
        shakeOffsetX *= 0.8;
        shakeOffsetY *= 0.8;
      }

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2 + shakeOffsetX;
      const centerY = height / 2 + shakeOffsetY;

      // Draw Stars (parallax based on mouse)
      const mouseOffsetX = (mouse.x - width / 2) * 0.05;
      const mouseOffsetY = (mouse.y - height / 2) * 0.05;

      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      stars.forEach(star => {
        let x = star.x - mouseOffsetX * star.z;
        let y = star.y - mouseOffsetY * star.z;
        
        // Wrap around
        if (x < 0) x += width;
        if (x > width) x -= width;
        if (y < 0) y += height;
        if (y > height) y -= height;

        ctx.beginPath();
        ctx.arc(x, y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      });

      // Draw Center Star
      drawCenterStar(centerX, centerY);

      // Status Beam
      if (status === "success") {
        ctx.beginPath();
        const beamGradient = ctx.createLinearGradient(centerX - 150, centerY, centerX + 150, centerY);
        beamGradient.addColorStop(0, "rgba(56, 189, 248, 0)");
        beamGradient.addColorStop(0.5, "rgba(139, 92, 246, 1)");
        beamGradient.addColorStop(1, "rgba(56, 189, 248, 0)");
        
        ctx.fillStyle = beamGradient;
        ctx.fillRect(centerX - 150, centerY - 2, 300, 4);
        ctx.closePath();
      }

      // Update and Draw Planets
      planets.forEach(planet => {
        planet.angle += planet.speed;
        
        // Base orbit position
        let px = centerX + Math.cos(planet.angle) * planet.distance;
        let py = centerY + Math.sin(planet.angle) * planet.distance;

        // Mouse interaction (repel)
        const dx = mouse.x - px;
        const dy = mouse.y - py;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        
        const forceRadius = 150;
        if (distToMouse < forceRadius) {
          const force = (forceRadius - distToMouse) / forceRadius;
          px -= (dx / distToMouse) * force * 30; // Repel distance
          py -= (dy / distToMouse) * force * 30;
        }

        // Draw Orbit Path
        ctx.beginPath();
        ctx.arc(centerX, centerY, planet.distance, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();

        // Draw Planet
        drawPlanet(px, py, planet.radius, planet.color1, planet.color2, planet.shadow);
      });

      // Update and Draw UFO
      ufo.hoverOffset = Math.sin(Date.now() / 250) * 6;
      ufo.x += ufo.speedX;
      ufo.y += Math.sin(Date.now() / 1500) * 0.3; // gentle wave trajectory
      
      ufo.lightAlpha += 0.015 * ufo.lightDir;
      if (ufo.lightAlpha > 0.7) ufo.lightDir = -1;
      if (ufo.lightAlpha < 0.2) ufo.lightDir = 1;

      // Ensure UFO wraps around screen infinitely
      if (ufo.x > width + 150) {
        ufo.x = -150;
        ufo.y = Math.random() * height * 0.6 + height * 0.1;
      }

      drawUfo(ufo);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [status]);

  return (
    <div className="space-container">
      <canvas ref={canvasRef} />
    </div>
  );
}