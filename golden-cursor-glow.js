// ✨ Golden Cursor Glow — Drop this into your portfolio
// Usage: <script src="golden-cursor-glow.js"></script>

(function () {
  // ── Inject styles ──────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    /* Hide default cursor site-wide */
    *, *::before, *::after { cursor: none !important; }

    /* ── Outer aura ── */
    #gc-aura {
      position: fixed;
      pointer-events: none;
      z-index: 999998;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: radial-gradient(
        circle,
        rgba(255, 200, 50, 0.18) 0%,
        rgba(255, 160, 20, 0.10) 45%,
        transparent 70%
      );
      box-shadow:
        0 0 18px 6px rgba(255, 185, 30, 0.22),
        0 0 40px 14px rgba(255, 140, 0, 0.10);
      transform: translate(-50%, -50%);
      transition: width 0.35s ease, height 0.35s ease, opacity 0.3s ease;
      mix-blend-mode: screen;
    }

    /* ── Inner dot ── */
    #gc-dot {
      position: fixed;
      pointer-events: none;
      z-index: 999999;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: radial-gradient(circle, #ffe87c 0%, #f5a623 80%);
      box-shadow:
        0 0 6px 2px rgba(255, 220, 60, 0.9),
        0 0 14px 4px rgba(245, 166, 35, 0.55);
      transform: translate(-50%, -50%);
      transition: width 0.18s ease, height 0.18s ease, opacity 0.25s ease;
    }

    /* ── Trail particles ── */
    .gc-trail {
      position: fixed;
      pointer-events: none;
      z-index: 999997;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,215,60,0.6) 0%, transparent 70%);
      transform: translate(-50%, -50%) scale(1);
      animation: gc-fade 0.6s ease forwards;
    }
    @keyframes gc-fade {
      0%   { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
      100% { opacity: 0;   transform: translate(-50%, -50%) scale(0.1); }
    }

    /* Hover state — expand aura */
    #gc-aura.gc-hover {
      width: 80px;
      height: 80px;
      background: radial-gradient(
        circle,
        rgba(255, 215, 50, 0.22) 0%,
        rgba(255, 165, 0, 0.12) 50%,
        transparent 70%
      );
      box-shadow:
        0 0 28px 10px rgba(255, 200, 30, 0.28),
        0 0 60px 22px rgba(255, 130, 0, 0.12);
    }
    #gc-dot.gc-hover {
      width: 12px;
      height: 12px;
    }

    /* Click burst */
    #gc-aura.gc-click {
      width: 110px;
      height: 110px;
      opacity: 0.55;
      transition: width 0.12s ease, height 0.12s ease, opacity 0.12s ease;
    }
  `;
  document.head.appendChild(style);

  // ── DOM elements ────────────────────────────────────────────────
  const aura = document.createElement("div");
  aura.id = "gc-aura";
  document.body.appendChild(aura);

  const dot = document.createElement("div");
  dot.id = "gc-dot";
  document.body.appendChild(dot);

  // ── State ────────────────────────────────────────────────────────
  let mouseX = -200, mouseY = -200;
  let auraX  = -200, auraY  = -200;
  let rafId;

  // ── Smooth aura follow (lerp) ────────────────────────────────────
  const LERP = 0.12;
  function lerp(a, b, t) { return a + (b - a) * t; }

  function animate() {
    auraX = lerp(auraX, mouseX, LERP);
    auraY = lerp(auraY, mouseY, LERP);

    dot.style.left  = mouseX + "px";
    dot.style.top   = mouseY + "px";
    aura.style.left = auraX  + "px";
    aura.style.top  = auraY  + "px";

    rafId = requestAnimationFrame(animate);
  }
  animate();

  // ── Mouse move ───────────────────────────────────────────────────
  let lastTrailTime = 0;
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Trail particles (throttled)
    const now = Date.now();
    if (now - lastTrailTime > 40) {
      lastTrailTime = now;
      spawnTrail(e.clientX, e.clientY);
    }
  });

  // ── Hover on interactive elements ───────────────────────────────
  const interactiveSelectors = "a, button, [role='button'], input, textarea, select, label, [tabindex]";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(interactiveSelectors)) {
      aura.classList.add("gc-hover");
      dot.classList.add("gc-hover");
    }
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(interactiveSelectors)) {
      aura.classList.remove("gc-hover");
      dot.classList.remove("gc-hover");
    }
  });

  // ── Click burst ──────────────────────────────────────────────────
  document.addEventListener("mousedown", () => {
    aura.classList.add("gc-click");
    setTimeout(() => aura.classList.remove("gc-click"), 160);
    spawnBurst(mouseX, mouseY);
  });

  // ── Trail particle factory ───────────────────────────────────────
  function spawnTrail(x, y) {
    const size = 6 + Math.random() * 8;
    const p = document.createElement("div");
    p.className = "gc-trail";
    p.style.cssText = `left:${x}px; top:${y}px; width:${size}px; height:${size}px;`;
    document.body.appendChild(p);
    p.addEventListener("animationend", () => p.remove());
  }

  // ── Click burst factory ──────────────────────────────────────────
  function spawnBurst(x, y) {
    const count = 8;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dist  = 18 + Math.random() * 18;
      const bx    = x + Math.cos(angle) * dist;
      const by    = y + Math.sin(angle) * dist;
      const size  = 4 + Math.random() * 6;
      const p = document.createElement("div");
      p.className = "gc-trail";
      p.style.cssText = `left:${bx}px; top:${by}px; width:${size}px; height:${size}px;`;
      document.body.appendChild(p);
      p.addEventListener("animationend", () => p.remove());
    }
  }

  // ── Hide when leaving window ─────────────────────────────────────
  document.addEventListener("mouseleave", () => {
    aura.style.opacity = "0";
    dot.style.opacity  = "0";
  });
  document.addEventListener("mouseenter", () => {
    aura.style.opacity = "1";
    dot.style.opacity  = "1";
  });
})();
