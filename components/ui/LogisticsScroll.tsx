"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- Configuration ---
const FRAME_COUNT = 181; // frames 012-192
const IMAGE_FOLDER = "/allrounderv4";
const BG_COLOR = "#F8FAFC"; // Slate-50

// Build the actual file paths (starting from frame 012)
function getFrameSrc(index: number): string {
  const frameNum = (index + 12).toString().padStart(3, "0");
  return `${IMAGE_FOLDER}/ezgif-frame-${frameNum}.jpg`;
}

// --- Loading Spinner ---
function LoadingSpinner({ progress }: { progress: number }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: BG_COLOR }}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-16 w-16">
          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="3"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="#0EA5E9"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
              className="transition-all duration-200"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-slate-600 tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Loading Experience
          </p>
          <div className="flex gap-1 mt-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-1 w-1 rounded-full bg-sky-500"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
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
      className="absolute inset-0 pointer-events-none z-30"
      style={{
        opacity: 0.03,
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

  // --- Canvas width/height animation ---
  // Start as right-half (left:50%, width:50%, height:70%), expand to full-screen by frame 070
  const canvasLeft = useTransform(scrollYProgress, [0, 0.24], ["50%", "0%"]);
  const canvasWidth = useTransform(scrollYProgress, [0, 0.24], ["50%", "100%"]);
  const canvasHeight = useTransform(
    scrollYProgress,
    [0, 0.24],
    ["70%", "100%"],
  );

  // --- Text overlay opacities ---
  // Hero fades gradually using direct DOM manipulation for reliability
  const heroRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (!heroRef.current) return;
      // Fade from 1→0 over progress 0→0.24
      const opacity = Math.max(0, 1 - latest / 0.24);
      const yOffset = -(latest / 0.24) * 60;
      heroRef.current.style.opacity = String(opacity);
      heroRef.current.style.transform = `translateY(${yOffset}px)`;
      // Fully hide when done to avoid any ghost rendering
      heroRef.current.style.visibility = opacity <= 0 ? "hidden" : "visible";
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // 30%–55%: "Instant Global Sourcing" (LEFT side)
  const opacity2 = useTransform(
    scrollYProgress,
    [0.28, 0.34, 0.5, 0.57],
    [0, 1, 1, 0],
  );
  const y2 = useTransform(scrollYProgress, [0.28, 0.34], [30, 0]);

  // 60%–80%: "Automated Compliance & Logistics" (RIGHT side)
  const opacity3 = useTransform(
    scrollYProgress,
    [0.57, 0.63, 0.75, 0.82],
    [0, 1, 1, 0],
  );
  const y3 = useTransform(scrollYProgress, [0.57, 0.63], [30, 0]);

  // 85%–100%: "Zero Friction Delivery" (CENTERED CTA)
  const opacity4 = useTransform(scrollYProgress, [0.85, 0.91, 1], [0, 1, 1]);
  const y4 = useTransform(scrollYProgress, [0.85, 0.91], [30, 0]);

  // --- 1. Preload images ---
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

  // --- 2. Canvas render ---
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

    // object-fit: cover, crop 5% from bottom of source image
    const cropH = img.height * 0.95; // use top 95% of image
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

  // --- 3. Scroll-linked render loop ---
  useEffect(() => {
    if (isLoading) return;
    render(0);
    const handleResize = () =>
      render(lastFrameRef.current >= 0 ? lastFrameRef.current : 0);
    window.addEventListener("resize", handleResize);

    // Snap points as scroll progress values
    const SNAP_POINTS = [0, 0.48, 0.99];
    let snapTimeout: ReturnType<typeof setTimeout> | null = null;
    const isSnapping = { current: false };

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // --- Frame rendering (non-linear mapping) ---
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

      // --- Snap-to-point on scroll stop ---
      if (isSnapping.current) return;
      if (snapTimeout) clearTimeout(snapTimeout);
      snapTimeout = setTimeout(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const scrollableH =
          containerRef.current.scrollHeight - window.innerHeight;
        const containerTop = window.scrollY + rect.top;

        // Find nearest snap point
        let nearestSnap = SNAP_POINTS[0];
        let minDist = Infinity;
        for (const sp of SNAP_POINTS) {
          const dist = Math.abs(latest - sp);
          if (dist < minDist) {
            minDist = dist;
            nearestSnap = sp;
          }
        }

        // Only snap if we're not already very close
        if (minDist > 0.01) {
          isSnapping.current = true;
          const targetScroll = containerTop + nearestSnap * scrollableH;
          window.scrollTo({ top: targetScroll, behavior: "smooth" });
          // Reset snapping flag after animation
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
      {/* --- Fixed Canvas Layer --- */}
      <motion.div
        className="fixed overflow-hidden"
        style={{
          left: canvasLeft,
          width: canvasWidth,
          height: canvasHeight,
          top: "50%",
          y: "-50%",
          backgroundColor: BG_COLOR,
        }}
      >
        {isLoading && <LoadingSpinner progress={loadProgress} />}
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ display: isLoading ? "none" : "block" }}
        />
        <GrainOverlay />

        {/* --- Text overlays (inside canvas, only visible when canvas is full-screen) --- */}

        {/* 30%–55%: Instant Global Sourcing — LEFT */}
        <motion.div
          style={{ opacity: opacity2, y: y2 }}
          className="absolute top-0 left-0 w-full h-full flex items-center pl-8 md:pl-16 lg:pl-24 pointer-events-none z-10"
        >
          <div className="max-w-md bg-white/70 backdrop-blur-xl p-8 rounded-2xl border border-slate-200/60 shadow-lg">
            <div className="inline-flex items-center gap-2 mb-4 py-1 px-3 rounded-full bg-sky-50 border border-sky-100">
              <div className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
              <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">
                Network Active
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4 tracking-tight">
              Instant Global
              <br />
              Sourcing.
            </h2>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              Your request is instantly broadcasted to our verified network
              across Europe. AI matches SKUs to available inventory in{" "}
              <span className="font-bold text-sky-600">milliseconds</span>.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Stock
                Found
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Compliance
                Verified
              </div>
            </div>
          </div>
        </motion.div>

        {/* 60%–80%: Automated Compliance — RIGHT */}
        <motion.div
          style={{ opacity: opacity3, y: y3 }}
          className="absolute top-0 left-0 w-full h-full flex items-center justify-end pr-8 md:pr-16 lg:pr-24 pointer-events-none z-10"
        >
          <div className="max-w-md text-right bg-white/70 backdrop-blur-xl p-8 rounded-2xl border border-slate-200/60 shadow-lg">
            <div className="inline-flex items-center gap-2 mb-4 py-1 px-3 rounded-full bg-emerald-50 border border-emerald-100">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                In Transit
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 mb-4 tracking-tight">
              Automated Compliance
              <br />& Logistics.
            </h2>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              Waybills generated. Cargo space booked. Real-time tracking from
              the warehouse floor to the hospital door.
            </p>
          </div>
        </motion.div>

        {/* 85%–100%: Delivery CTA — CENTERED */}
        <motion.div
          style={{ opacity: opacity4, y: y4 }}
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-auto z-20"
        >
          <div className="max-w-2xl text-center bg-white/90 backdrop-blur-xl p-10 md:p-14 rounded-[2rem] shadow-2xl shadow-slate-900/5 border border-slate-100/80">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 mb-4 tracking-tight">
              Zero Friction
              <br />
              <span className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
                Delivery.
              </span>
            </h2>
            <p className="text-lg text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
              This entire process happened without a single email or phone call.
              Ready to modernize your supply chain?
            </p>
            <Button
              size="lg"
              className="h-14 px-12 text-lg bg-slate-900 hover:bg-slate-800 rounded-full shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-0.5 cursor-pointer"
              onClick={isLoggedIn ? onDashboard : onRequestAccess}
            >
              {isLoggedIn ? "Go to Dashboard" : "Join Waiting List"}
            </Button>
          </div>
        </motion.div>
      </motion.div>

      {/* --- Hero text — OUTSIDE canvas, unaffected by scale, fixed on LEFT --- */}
      <div
        ref={heroRef}
        className="fixed top-0 left-0 w-1/2 h-screen flex items-center pointer-events-none z-10"
      >
        <div className="max-w-2xl pl-8 md:pl-16 lg:pl-24">
          <div className="inline-block mb-5">
            <span className="py-1.5 px-5 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase bg-white/80 backdrop-blur-md text-slate-500 border border-slate-200/60 shadow-sm">
              AI-Powered Platform
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-heading tracking-tighter text-slate-900 leading-[0.92] mb-6">
            AI-Powered
            <br />
            Procurement for
            <br />
            <span className="bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">
              Healthcare.
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 font-light max-w-lg leading-relaxed mb-8">
            Streamline your medical procurement process with AI-powered
            requirements, real-time quotations, and compliance verification.
          </p>
          <div className="flex flex-wrap gap-4 pointer-events-auto">
            {isLoggedIn ? (
              <Button
                size="lg"
                className="h-14 px-10 text-lg bg-slate-900 hover:bg-slate-800 rounded-full shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-0.5 cursor-pointer"
                onClick={onDashboard}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  className="h-14 px-10 text-lg bg-slate-900 hover:bg-slate-800 rounded-full shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-0.5 cursor-pointer"
                  onClick={onRequestAccess}
                >
                  Join Waiting List
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-10 text-lg rounded-full border-slate-300 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                  onClick={onRequestAccess}
                >
                  Watch the Demo
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
