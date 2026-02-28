"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileSearch, GitMerge, BarChart2, ArrowRight } from "lucide-react";

// ── Procurement Intelligence — 3-Step Process Explainer ──────────────────────
// Layout mirrors the Sprinto pattern:
//   [thin rail + step icon]  [large visual card LEFT]  [step text RIGHT]
// All three steps share the same column order — NO alternating.
// Insert immediately after the "Select Your Portal" section in page.tsx.

const STEPS = [
  {
    number: "01",
    label: "STEP 1",
    title: "Requirement Capture",
    body: "AI parses procurement requests from natural language, clinical specs, or uploaded documents — eliminating manual entry and ambiguity at the source.",
    Icon: FileSearch,
    visual: {
      headline: "Parsing requirement...",
      rows: [
        { label: "Product Type", value: "Surgical Gloves (Sterile)" },
        { label: "Volume", value: "12,000 units / quarter" },
        { label: "Compliance", value: "ISO 13485 · FDA 510(k)" },
        { label: "Urgency", value: "Standard — 14-day window" },
      ],
      badge: "Requirement Locked",
      badgeClass: "bg-[#dbeeff] text-[#1f3a61]",
    },
  },
  {
    number: "02",
    label: "STEP 2",
    title: "Intelligent Matching",
    body: "The platform cross-references your requirements against a live network of verified suppliers, scoring each on compliance, capacity, price history, and delivery reliability.",
    Icon: GitMerge,
    visual: {
      headline: "Matching suppliers...",
      rows: [
        { label: "Network Size", value: "340+ verified partners" },
        { label: "Match Score", value: "97 / 100 — Tier-1" },
        { label: "Avg. Lead Time", value: "9 days (network avg)" },
        { label: "Price Variance", value: "±3.2% from benchmark" },
      ],
      badge: "3 Suppliers Shortlisted",
      badgeClass: "bg-[#d6f0e8] text-[#2a6652]",
    },
  },
  {
    number: "03",
    label: "STEP 3",
    title: "Decision & Audit Trail",
    body: "Structured bid comparisons, one-click approvals, and an immutable audit log give procurement teams full visibility — and give compliance officers the documentation they need.",
    Icon: BarChart2,
    visual: {
      headline: "Bid comparison ready",
      rows: [
        { label: "Lowest Bid", value: "$0.38 / unit (Supplier A)" },
        { label: "Compliance Score", value: "100% — All audited" },
        { label: "Approval Status", value: "CFO sign-off pending" },
        { label: "Audit Log", value: "16 events recorded" },
      ],
      badge: "Ready for Approval",
      badgeClass: "bg-[#ffeee6] text-[#c4622a]",
    },
  },
];

// ── Visual card — rendered in the LEFT column of each step ───────────────────
function StepVisualCard({ visual }: { visual: (typeof STEPS)[0]["visual"] }) {
  return (
    // Outer tinted container (analogous to Sprinto's warm-pink outer card)
    <div
      className="w-full bg-[#edf1f8] border border-[#d4dce8] p-5 sm:p-7"
      style={{ borderRadius: "2px" }}
    >
      {/* Inner white panel */}
      <div
        className="bg-white border border-[#e2e8f0] shadow-[0_2px_12px_rgba(31,58,97,0.06)] p-5 sm:p-6"
        style={{ borderRadius: "2px" }}
      >
        {/* Card header */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#edf1f8]">
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#7999b9]">
            {visual.headline}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
            <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-[#7999b9]">
              Live
            </span>
          </span>
        </div>

        {/* Data rows */}
        <div className="space-y-0">
          {visual.rows.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-6 py-2.5 border-b border-[#f4f7fb] last:border-0"
            >
              <span className="text-[11px] sm:text-xs text-[#7999b9] font-medium shrink-0">
                {label}
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-[#1f3a61] text-right">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Badge footer */}
        <div className="mt-4 pt-4 border-t border-[#edf1f8]">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase ${visual.badgeClass}`}
            style={{ borderRadius: "1px" }}
          >
            <span className="inline-block w-1 h-1 rounded-full bg-current opacity-60" />
            {visual.badge}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Single step row ───────────────────────────────────────────────────────────
function StepRow({
  step,
  index,
  isLast,
}: {
  step: (typeof STEPS)[0];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.14 }}
      // Outer row: [rail column] + [content grid]
      className="flex gap-6 sm:gap-8"
    >
      {/* ── FAR-LEFT RAIL ── icon node + vertical connector line ── */}
      <div className="flex flex-col items-center shrink-0">
        {/* Square icon node — matches Sprinto's rounded-square step icon */}
        <div
          className="relative z-10 w-11 h-11 sm:w-13 sm:h-13 bg-white border border-[#d4dce8] shadow-[0_2px_8px_rgba(31,58,97,0.07)] flex items-center justify-center"
          style={{
            borderRadius: "2px",
            minWidth: "2.75rem",
            minHeight: "2.75rem",
          }}
        >
          <step.Icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#496c83]" />
        </div>

        {/* Connector line — hidden after last step */}
        {!isLast && <div className="flex-1 w-px bg-[#d4dce8] mt-2 mb-0" />}
      </div>

      {/* ── CONTENT GRID: visual LEFT — text RIGHT ── */}
      <div
        className={`flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center ${
          isLast ? "pb-0" : "pb-14 sm:pb-16 lg:pb-20"
        }`}
      >
        {/* Visual card — always left column on desktop */}
        <StepVisualCard visual={step.visual} />

        {/* Text — always right column on desktop */}
        <div className="lg:pl-2">
          {/* Step label pill — matches Sprinto "STEP 1" tag exactly */}
          <span
            className="inline-block mb-3 px-2.5 py-1 text-[10px] font-bold tracking-[0.22em] uppercase text-[#496c83] bg-[#edf1f8] border border-[#d4dce8]"
            style={{ borderRadius: "1px" }}
          >
            {step.label}
          </span>

          {/* Bold title */}
          <h3 className="text-2xl sm:text-3xl font-bold text-[#1f3a61] mb-3 tracking-tight leading-tight">
            {step.title}
          </h3>

          {/* Supporting body */}
          <p className="text-sm sm:text-base leading-relaxed text-[#496c83]">
            {step.body}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Section export ────────────────────────────────────────────────────────────
export default function ProcurementStepsSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section
      id="platform"
      className="py-16 sm:py-24 lg:py-32 bg-[#f4f7fb] border-t border-[#d4dce8] relative z-20"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* ── Section header ──────────────────────────────────────── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-14 sm:mb-20"
        >
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#7999b9] mb-4">
            How it Works
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#1f3a61]">
            Procurement{" "}
            <span className="text-[#496c83] font-light">in 3 Clear Steps</span>
          </h2>
          <p className="text-base sm:text-lg max-w-xl mx-auto text-[#496c83]">
            From requests — a structured, auditable process that replaces
            fragmented workflows with a single intelligent layer.
          </p>
        </motion.div>

        {/* ── Steps list ──────────────────────────────────────────── */}
        <div>
          {STEPS.map((step, i) => (
            <StepRow
              key={step.number}
              step={step}
              index={i}
              isLast={i === STEPS.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
