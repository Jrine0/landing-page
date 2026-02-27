"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";

// --- Configuration ---
const FRAME_COUNT = 181;
const IMAGE_FOLDER = "/allrounderv4";
const BG_COLOR = "#f4f7fb";

function getFrameSrc(index: number): string {
  const frameNum = (index + 12).toString().padStart(3, "0");
  return `${IMAGE_FOLDER}/ezgif-frame-${frameNum}.jpg`;
}

// --- Loading Spinner ---
function LoadingSpinner({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-[#f4f7fb]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-16 w-16">
          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="#d4dce8"
              strokeWidth="2"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="#1f3a61"
              strokeWidth="2"
              strokeLinecap="square"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
              className="transition-all duration-200"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-[#1f3a61] tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <p className="text-[10px] font-bold text-[#7999b9] uppercase tracking-[0.25em]">
            Initializing Network
          </p>
          <div className="flex gap-1 mt-1">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="h-[2px] w-4 bg-[#1f3a61]"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Grain Overlay ---
function GrainOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-30 opacity-[0.025]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
      }}
    />
  );
}

// --- Main Component ---
export default function LogisticsScroll({
  onRequestAccess,
  isLoggedIn = false,
  onDashboard,
}: {
  onRequestAccess: () => void;
  isLoggedIn?: boolean;
  onDashboard?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const lastFrameRef = useRef(-1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Canvas position animation
  const canvasLeft = useTransform(scrollYProgress, [0, 0.24], ["50%", "0%"]);
  const canvasWidth = useTransform(scrollYProgress, [0, 0.24], ["50%", "100%"]);
  const canvasHeight = useTransform(
    scrollYProgress,
    [0, 0.24],
    ["70%", "100%"],
  );

  // Hero fade (direct DOM)
  const heroRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (!heroRef.current) return;
      const opacity = Math.max(0, 1 - latest / 0.24);
      const yOffset = -(latest / 0.24) * 60;
      heroRef.current.style.opacity = String(opacity);
      heroRef.current.style.transform = `translateY(${yOffset}px)`;
      heroRef.current.style.visibility = opacity <= 0 ? "hidden" : "visible";
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Scroll-linked overlays
  const opacity2 = useTransform(
    scrollYProgress,
    [0.28, 0.34, 0.5, 0.57],
    [0, 1, 1, 0],
  );
  const y2 = useTransform(scrollYProgress, [0.28, 0.34], [30, 0]);

  const opacity3 = useTransform(
    scrollYProgress,
    [0.57, 0.63, 0.75, 0.82],
    [0, 1, 1, 0],
  );
  const y3 = useTransform(scrollYProgress, [0.57, 0.63], [30, 0]);

  const opacity4 = useTransform(scrollYProgress, [0.85, 0.91, 1], [0, 1, 1]);
  const y4 = useTransform(scrollYProgress, [0.85, 0.91], [30, 0]);

  // Preload images
  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    const promises = Array.from(
      { length: FRAME_COUNT },
      (_, i) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.src = getFrameSrc(i);
          img.onload = () => {
            loadedCount++;
            if (!cancelled) setLoadProgress((loadedCount / FRAME_COUNT) * 100);
            resolve(img);
          };
          img.onerror = () => reject(new Error(`Failed to load frame ${i}`));
        }),
    );
    Promise.all(promises)
      .then((imgs) => {
        if (!cancelled) {
          imagesRef.current = imgs;
          setIsLoading(false);
        }
      })
      .catch((err) => console.error("Frame loading error:", err));
    return () => {
      cancelled = true;
    };
  }, []);

  // Canvas render
  const render = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[index];
    if (!img) return;

    const dpr = window.devicePixelRatio || 1;
    const targetW = canvas.clientWidth * dpr;
    const targetH = canvas.clientHeight * dpr;
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cropH = img.height * 0.95;
    const scale = Math.max(canvas.width / img.width, canvas.height / cropH);
    const drawW = img.width * scale;
    const drawH = cropH * scale;
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      cropH,
      (canvas.width - drawW) / 2,
      (canvas.height - drawH) / 2,
      drawW,
      drawH,
    );
  }, []);

  // Scroll-linked render loop
  useEffect(() => {
    if (isLoading) return;
    render(0);
    const handleResize = () =>
      render(lastFrameRef.current >= 0 ? lastFrameRef.current : 0);
    window.addEventListener("resize", handleResize);

    const SNAP_POINTS = [0, 0.48, 0.99];
    let snapTimeout: ReturnType<typeof setTimeout> | null = null;
    const isSnapping = { current: false };

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const MID_FRAME = 105;
      const PHASE2_START = 0.48;
      const DWELL_START = 0.99;
      let frameIndex: number;
      if (latest <= PHASE2_START) {
        frameIndex = Math.floor((latest / PHASE2_START) * MID_FRAME);
      } else if (latest <= DWELL_START) {
        const remaining =
          (latest - PHASE2_START) / (DWELL_START - PHASE2_START);
        frameIndex =
          MID_FRAME + Math.floor(remaining * (FRAME_COUNT - 1 - MID_FRAME));
      } else {
        frameIndex = FRAME_COUNT - 1;
      }
      frameIndex = Math.min(FRAME_COUNT - 1, Math.max(0, frameIndex));
      if (frameIndex !== lastFrameRef.current) {
        lastFrameRef.current = frameIndex;
        requestAnimationFrame(() => render(frameIndex));
      }

      if (isSnapping.current) return;
      if (snapTimeout) clearTimeout(snapTimeout);
      snapTimeout = setTimeout(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const scrollableH =
          containerRef.current.scrollHeight - window.innerHeight;
        const containerTop = window.scrollY + rect.top;

        let nearestSnap = SNAP_POINTS[0];
        let minDist = Infinity;
        for (const sp of SNAP_POINTS) {
          const dist = Math.abs(latest - sp);
          if (dist < minDist) {
            minDist = dist;
            nearestSnap = sp;
          }
        }

        if (minDist > 0.01) {
          isSnapping.current = true;
          const targetScroll = containerTop + nearestSnap * scrollableH;
          window.scrollTo({ top: targetScroll, behavior: "smooth" });
          setTimeout(() => {
            isSnapping.current = false;
          }, 800);
        }
      }, 300);
    });

    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
      if (snapTimeout) clearTimeout(snapTimeout);
    };
  }, [isLoading, scrollYProgress, render]);

  return (
    <div
      ref={containerRef}
      className="relative h-[400vh]"
      style={{ clipPath: "inset(0)" }}
    >
      {/* Fixed Canvas */}
      <motion.div
        className="fixed overflow-hidden bg-[#f4f7fb]"
        style={{
          left: canvasLeft,
          width: canvasWidth,
          height: canvasHeight,
          top: "50%",
          y: "-50%",
        }}
      >
        {isLoading && <LoadingSpinner progress={loadProgress} />}
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ display: isLoading ? "none" : "block" }}
        />
        <GrainOverlay />

        {/* ── 30–55% Instant Global Sourcing — LEFT ── */}
        <motion.div
          style={{ opacity: opacity2, y: y2 }}
          className="absolute top-0 left-0 w-full h-full flex items-center pl-8 md:pl-16 lg:pl-24 pointer-events-none z-10"
        >
          <div
            className="max-w-md bg-white/90 backdrop-blur-xl p-8 border border-[#d4dce8]/80 shadow-[0_8px_32px_rgba(31,58,97,0.10)]"
            style={{ borderRadius: "2px" }}
          >
            {/* Status line */}
            <div className="flex items-center gap-2 mb-6">
              <div className="h-[2px] w-8 bg-[#496c83]" />
              <span className="text-[10px] font-bold text-[#496c83] uppercase tracking-[0.22em]">
                Network Active
              </span>
              <div className="h-1.5 w-1.5 rounded-full bg-[#496c83] animate-pulse ml-1" />
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-[#1f3a61] mb-4 tracking-tight leading-[0.95] uppercase">
              Instant Global
              <br />
              Sourcing.
            </h2>
            <p className="text-sm md:text-base text-[#496c83] leading-relaxed">
              Your request is broadcast to our verified network across Europe.
              AI matches SKUs to available inventory in{" "}
              <span className="font-bold text-[#1f3a61]">milliseconds</span>.
            </p>
            <div className="mt-6 pt-5 border-t border-[#e8edf5] flex flex-wrap gap-5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#496c83] uppercase tracking-wide">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#496c83]" /> Stock
                Found
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#496c83] uppercase tracking-wide">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#496c83]" />{" "}
                Compliance Verified
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 60–80% Automated Compliance — RIGHT ── */}
        <motion.div
          style={{ opacity: opacity3, y: y3 }}
          className="absolute top-0 left-0 w-full h-full flex items-center justify-end pr-8 md:pr-16 lg:pr-24 pointer-events-none z-10"
        >
          <div
            className="max-w-md text-right bg-white/90 backdrop-blur-xl p-8 border border-[#d4dce8]/80 shadow-[0_8px_32px_rgba(31,58,97,0.10)]"
            style={{ borderRadius: "2px" }}
          >
            <div className="flex items-center justify-end gap-2 mb-6">
              <div className="h-1.5 w-1.5 rounded-full bg-[#1f3a61] animate-pulse" />
              <span className="text-[10px] font-bold text-[#1f3a61] uppercase tracking-[0.22em]">
                In Transit
              </span>
              <div className="h-[2px] w-8 bg-[#1f3a61]" />
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-[#1f3a61] mb-4 tracking-tight leading-[0.95] uppercase">
              Automated Compliance
              <br />& Logistics.
            </h2>
            <p className="text-sm md:text-base text-[#496c83] leading-relaxed">
              Waybills generated. Cargo space booked. Real-time tracking from
              the warehouse floor to the hospital door.
            </p>
          </div>
        </motion.div>

        {/* ── 85–100% Zero Friction Delivery — CENTERED CTA ── */}
        <motion.div
          style={{ opacity: opacity4, y: y4 }}
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-auto z-20"
        >
          <div
            className="max-w-2xl text-center bg-white/95 backdrop-blur-xl p-10 md:p-14 shadow-2xl shadow-[#1f3a61]/[.08] border border-[#d4dce8]/90"
            style={{ borderRadius: "2px" }}
          >
            {/* Top accent bar */}
            <div className="w-12 h-[3px] bg-[#1f3a61] mx-auto mb-8" />

            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#7999b9] mb-4">
              Healthcare Supply Infrastructure
            </p>

            <h2 className="text-4xl md:text-5xl font-black text-[#1f3a61] mb-4 tracking-tight leading-[0.92] uppercase">
              Zero Friction
              <br />
              <span className="text-[#496c83]">Delivery.</span>
            </h2>
            <p className="text-base text-[#7999b9] mb-8 max-w-md mx-auto leading-relaxed">
              This entire process happens without a single email or phone call.
              This is what a modern procurement for a progressive infrastructure
              looks like.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                className="h-12 px-8 bg-[#1f3a61] hover:bg-[#2e5080] text-white text-[11px] font-bold tracking-[0.18em] uppercase transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                style={{ borderRadius: "1px" }}
                onClick={isLoggedIn ? onDashboard : onRequestAccess}
              >
                {isLoggedIn ? "Go to Dashboard" : "Get Network Access"}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Hero — LEFT SIDE, outside canvas */}
      <div
        ref={heroRef}
        className="fixed top-0 left-0 w-1/2 h-screen flex items-center pointer-events-none z-10"
      >
        <div className="max-w-2xl pl-8 md:pl-16 lg:pl-24">
          {/* Category label — micro-brand statement */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[2px] w-8 bg-[#1f3a61] opacity-40" />
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#7999b9]">
              Healthcare Supply Infrastructure — AI-Native
            </span>
          </div>

          {/* Headline — declarative, category-defining */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.03em] text-[#1f3a61] leading-[0.90] mb-6 uppercase">
            The Network
            <br />
            That Moves
            <br />
            <span className="text-[#496c83]">Medical Supply.</span>
          </h1>

          <p className="text-sm md:text-base text-[#7999b9] font-normal max-w-sm leading-relaxed mb-8">
            AI-native procurement for health systems and supplier networks. From
            requirement to delivery — without the friction.
          </p>

          <div className="flex flex-wrap gap-3 pointer-events-auto">
            {isLoggedIn ? (
              <button
                className="h-11 px-8 bg-[#1f3a61] hover:bg-[#2e5080] text-white text-[11px] font-bold tracking-[0.18em] uppercase transition-all hover:-translate-y-0.5 flex items-center gap-2"
                style={{ borderRadius: "1px" }}
                onClick={onDashboard}
              >
                Go to Dashboard <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <>
                <button
                  className="h-11 px-8 bg-[#1f3a61] hover:bg-[#2e5080] text-white text-[11px] font-bold tracking-[0.18em] uppercase transition-all hover:-translate-y-0.5 flex items-center gap-2"
                  style={{ borderRadius: "1px" }}
                  onClick={onRequestAccess}
                >
                  Get Network Access <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>

          {/* Trust signal strip */}
          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[#d4dce8]/60">
            {["ISO Certified", "GDPR Compliant", "SOC 2 Audited"].map(
              (item, i) => (
                <div key={item} className="flex items-center gap-1.5">
                  <div className="h-1 w-1 bg-[#496c83] rounded-full" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#7999b9]">
                    {item}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
