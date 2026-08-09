"use client";

import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 110;
const FRAME_PATH = (i: number) => `/frames/canby_ambulance_frame_${String(i + 1).padStart(3, "0")}.jpg`;

export default function CanbyAmbulanceHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    const imgs: HTMLImageElement[] = [];
    let loadedCount = 0;
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = () => {
        loadedCount += 1;
        if (mounted && loadedCount === TOTAL_FRAMES) {
          setImages(imgs);
          setLoaded(true);
        }
      };
      imgs.push(img);
    }
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!loaded || !images.length) return;
    let raf = 0;
    const draw = (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const img = images[index];
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = "100%";
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cr = w / h;
      const ir = img.width / img.height;
      let dw = w, dh = h, dx = 0, dy = 0;
      if (ir > cr) { dh = h; dw = img.width * (dh / img.height); dx = (w - dw) / 2; }
      else { dw = w; dh = img.height * (dw / img.width); dy = (h - dh) / 2; }
      ctx.drawImage(img, dx, dy, dw, dh);
    };
    const update = () => {
      const progress = Math.max(0, Math.min(1, window.scrollY / window.innerHeight));
      const frame = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * (TOTAL_FRAMES - 1)));
      draw(frame);
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [loaded, images]);

  return (
    <section style={{ position: "relative", height: "220vh", background: "#010d18" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <canvas ref={canvasRef} />
        {!loaded && <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "white" }}>Loading ambulance sequence…</div>}
      </div>
    </section>
  );
}
