"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const FALLBACK_IMAGES = [
  "https://img.pokemondb.net/artwork/large/charizard.jpg",
  "https://img.pokemondb.net/artwork/large/pikachu.jpg",
  "https://img.pokemondb.net/artwork/large/bulbasaur.jpg",
  "https://img.pokemondb.net/artwork/large/squirtle.jpg",
  "https://img.pokemondb.net/artwork/large/eevee.jpg",
  "https://img.pokemondb.net/artwork/large/mewtwo.jpg",
  "https://img.pokemondb.net/artwork/large/gengar.jpg",
  "https://img.pokemondb.net/artwork/large/dragonite.jpg",
];

export default function SpinImage({
  images = [],
  imageWidth = 120,
  imageHeight = 120,
  direction = "anticlockwise",
  path = "curved",
  xCurve = -90,
  yCurve = -90,
  speed = 3,
  rounded = 3,
  orbitUnit = "%",
  orbitWidthPx = 600,
  orbitWidthPct = 60,
}) {
  const items = useMemo(() => {
    const extractUrl = (it) => {
      if (!it) return null;
      if (typeof it === "string") return it.trim() || null;
      const url = it.src || it.url || (typeof it.srcSet === "string" ? it.srcSet.split(" ")[0] : null);
      return typeof url === "string" ? url.trim() || null : null;
    };
    const userUrls = Array.isArray(images) ? images.map(extractUrl).filter(Boolean) : [];
    const urls = userUrls.length > 0 ? userUrls : FALLBACK_IMAGES;
    return urls.slice(0, 30);
  }, [images]);

  const n = items.length;
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ W: 0, H: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (!r) return;
      const W = Math.round(r.width), H = Math.round(r.height);
      if (!W || !H) return;
      setDims({ W, H });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { W, H } = dims;
  const imgW = Math.max(1, imageWidth);
  const imgH = Math.max(1, imageHeight);
  const r = Math.max(0, Math.min(20, rounded));
  const radius = (r / 20) * (Math.min(imgW, imgH) / 2);

  const totalW = orbitUnit === "px" ? Math.max(0, orbitWidthPx) : (Math.max(0, Math.min(100, orbitWidthPct)) / 100) * W;
  const a = totalW / 2;
  const b = a * 0.35;
  const theta0 = Math.atan2(H, W);
  const dir = direction === "anticlockwise" ? -1 : 1;

  const [orbitPhi, setOrbitPhi] = useState(0);
  const rafRef = useRef(null);
  const revsPerSec = Math.max(0, Math.min(20, speed)) * 0.05;

  useEffect(() => {
    if (!W || !H || revsPerSec <= 0) return;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = (now - start) / 1000;
      setOrbitPhi(dir * 2 * Math.PI * revsPerSec * elapsed);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [W, H, revsPerSec, dir]);

  const cx = W / 2, cy = H / 2;
  const cosT = Math.cos(theta0), sinT = Math.sin(theta0);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", perspective: 1200 }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${xCurve ?? 0}deg) rotateX(${-(yCurve ?? 0)}deg)` }}>
        {n > 0 && items.map((src, i) => {
          const phi = (i / n) * Math.PI * 2 + orbitPhi;
          const ex = a * Math.cos(phi), ey = b * Math.sin(phi);
          const x = ex * cosT - ey * sinT;
          const y = ex * sinT + ey * cosT;
          const left = cx + x - imgW / 2;
          const top = cy + y - imgH / 2;
          const depth = (Math.cos(phi) + 1) / 2;
          const sf = path === "curved" ? 0.6 + 0.8 * depth : 1;
          return (
            <div key={i} style={{
              position: "absolute", left, top, width: imgW, height: imgH,
              transform: `rotateX(${yCurve ?? 0}deg) rotateY(${-(xCurve ?? 0)}deg) scale(${sf})`,
              zIndex: Math.round(y), borderRadius: radius, overflow: "hidden",
              backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center",
              backgroundRepeat: "no-repeat", boxShadow: "0 8px 24px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.15)",
              willChange: "left, top, transform", pointerEvents: "none",
            }} />
          );
        })}
      </div>
    </div>
  );
}
