"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProcurementStepsSection from "@/components/ui/ProcurementStepsSection";
import {
  Loader2,
  X,
  Shield,
  TrendingUp,
  GraduationCap,
  Linkedin,
  Hospital,
  Store,
  Zap,
  Clock,
  Brain,
  Search,
  BarChart3,
  Target,
  ArrowRight,
  CheckCircle2,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import LogisticsScroll from "@/components/ui/LogisticsScroll";
import ScrollStack, { ScrollStackItem } from "@/components/ui/ScrollStack";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// --- Request Access Modal ---
const RequestAccessModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [role, setRole] = useState<"hospital" | "vendor">("hospital");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Request received. You will hear from us shortly.");
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[rgba(13,31,60,0.60)] backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.97, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-[400px] bg-white p-8 shadow-2xl relative"
            style={{ borderRadius: "2px" }}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#1f3a61]" />

            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-[#7999b9] hover:text-[#1f3a61] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-6">
              <p className="text-[10px] font-bold tracking-wide text-[#7999b9] mb-2">
                Enterprise access
              </p>
              <h1 className="text-xl font-bold text-[#1f3a61] leading-tight">
                Apply for network access
              </h1>
            </div>

            <div className="flex gap-0 mb-6 border border-[#d4dce8]">
              {["hospital", "vendor"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r as "hospital" | "vendor")}
                  className={cn(
                    "flex-1 py-2 text-[11px] font-bold tracking-wide transition-all capitalize",
                    role === r
                      ? "bg-[#1f3a61] text-white"
                      : "bg-white text-[#7999b9] hover:text-[#496c83]",
                  )}
                >
                  {r === "hospital" ? "Health system" : "Supplier"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                placeholder="Organization name"
                className="w-full h-10 px-3 text-sm text-[#1f3a61] border border-[#d4dce8] focus:outline-none focus:border-[#1f3a61] transition-colors bg-[#f8fafc] placeholder:text-[#a0b3c6]"
                style={{ borderRadius: "1px" }}
                required
              />
              <input
                placeholder="Work email"
                type="email"
                className="w-full h-10 px-3 text-sm text-[#1f3a61] border border-[#d4dce8] focus:outline-none focus:border-[#1f3a61] transition-colors bg-[#f8fafc] placeholder:text-[#a0b3c6]"
                style={{ borderRadius: "1px" }}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 text-white bg-[#1f3a61] hover:bg-[#2e5080] transition-colors text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
                style={{ borderRadius: "1px" }}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Apply for access <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>

            <p className="text-[10px] text-[#7999b9] mt-4 leading-relaxed">
              Applications are reviewed within 2 business days. Enterprise
              compliance documentation will be required.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Mobile Menu ---
const MobileMenu = ({
  isOpen,
  onClose,
  user,
  onRequestAccess,
  onDashboard,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onRequestAccess: () => void;
  onDashboard: () => void;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-[rgba(13,31,60,0.55)] backdrop-blur-sm md:hidden"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="absolute right-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl border-l border-[#e2e8f0]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-[3px] bg-[#1f3a61] w-full" />

            <div className="p-8">
              <div className="flex items-center justify-between mb-10">
                <span className="text-base font-black tracking-[-0.04em] text-[#1f3a61]">
                  easemed
                </span>
                <button
                  onClick={onClose}
                  className="text-[#7999b9] hover:text-[#1f3a61] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-1 mb-10">
                {[
                  { href: "#platform", label: "Platform" },
                  { href: "#intelligence", label: "Intelligence" },
                  { href: "#aboutus", label: "About us" },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-sm font-medium text-[#7999b9] hover:text-[#1f3a61] transition-colors py-3 border-b border-[#f0f4fa]"
                    onClick={onClose}
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-col gap-3">
                {user ? (
                  <button
                    onClick={() => {
                      onDashboard();
                      onClose();
                    }}
                    className="w-full h-10 bg-[#1f3a61] text-white text-sm font-semibold hover:bg-[#2e5080] transition-colors"
                    style={{ borderRadius: "1px" }}
                  >
                    Dashboard
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onRequestAccess();
                      onClose();
                    }}
                    className="w-full h-10 bg-[#1f3a61] text-white text-sm font-semibold hover:bg-[#2e5080] transition-colors flex items-center justify-center gap-2"
                    style={{ borderRadius: "1px" }}
                  >
                    Get network access <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- MAIN PAGE ---
export default function HomePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getDashboardUrl = () => {
    if (!profile?.role) return "/dashboard";
    const hospitalRoles = ["hospital", "cpo", "cfo", "admin"];
    return hospitalRoles.includes(profile.role)
      ? "/dashboard/hospital"
      : "/dashboard/vendor";
  };

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (redirecting) return;
    setRedirecting(true);
    router.push(getDashboardUrl());
    setTimeout(() => setRedirecting(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#1f3a61] font-heading relative overflow-x-hidden">
      <RequestAccessModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        onRequestAccess={() => setIsRequestModalOpen(true)}
        onDashboard={() => {
          if (!redirecting) {
            setRedirecting(true);
            router.push(getDashboardUrl());
            setTimeout(() => setRedirecting(false), 2000);
          }
        }}
      />

      {/* ── NAVBAR ─── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300"
        style={{
          borderBottom: scrolled
            ? "1px solid rgba(31,58,97,0.12)"
            : "1px solid rgba(31,58,97,0.07)",
          boxShadow: scrolled ? "0 1px 12px rgba(31,58,97,0.06)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo2.png"
              alt=""
              className="h-10 w-10 object-contain opacity-80"
            />
            <span
              className="text-[18px] font-black text-[#1f3a61] select-none"
              style={{ letterSpacing: "-0.03em" }}
            >
              easemed
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {[
              { href: "#platform", label: "Platform" },
              { href: "#intelligence", label: "Intelligence" },
              { href: "#aboutus", label: "About us" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-[#7999b9] hover:text-[#1f3a61] transition-colors duration-150"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <button
                onClick={handleDashboardClick}
                disabled={redirecting}
                className="hidden sm:flex h-9 px-5 items-center gap-2 bg-[#1f3a61] hover:bg-[#2e5080] text-white text-sm font-semibold transition-colors disabled:opacity-60"
                style={{ borderRadius: "1px" }}
              >
                {redirecting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  "Dashboard"
                )}
              </button>
            ) : (
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="hidden sm:flex h-9 px-5 items-center gap-1.5 bg-[#1f3a61] hover:bg-[#2e5080] text-white text-sm font-semibold transition-colors"
                style={{ borderRadius: "1px" }}
              >
                Get network access
                <ArrowRight className="h-3 w-3" />
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-[#496c83] hover:text-[#1f3a61] transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ─── */}
      <div className="relative pt-16">
        <LogisticsScroll
          onRequestAccess={() => setIsRequestModalOpen(true)}
          isLoggedIn={!!user}
          onDashboard={() => {
            if (!redirecting) {
              setRedirecting(true);
              router.push(getDashboardUrl());
              setTimeout(() => setRedirecting(false), 2000);
            }
          }}
        />

        {/* Mobile info cards */}
        <div className="lg:hidden">
          {[
            {
              top: "top-[100vh]",
              Icon: Zap,
              iconBg: "bg-[#dbeeff]",
              iconColor: "text-[#1f3a61]",
              title: "Lightning fast",
              body: "Accelerate procurement workflows with structured automation",
            },
            {
              top: "top-[200vh]",
              Icon: Shield,
              iconBg: "bg-[#d6eae0]",
              iconColor: "text-[#496c83]",
              title: "Verified network",
              body: "Suppliers undergo standardized verification processes",
            },
            {
              top: "top-[300vh]",
              Icon: TrendingUp,
              iconBg: "bg-[#ffe5d8]",
              iconColor: "text-[#c4622a]",
              title: "Cost savings",
              body: "Structured proposal comparison supports transparent pricing evaluation",
            },
          ].map(({ top, Icon, iconBg, iconColor, title, body }) => (
            <div
              key={title}
              className={`absolute ${top} left-0 right-0 px-4 z-30 pointer-events-none`}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="bg-white/95 backdrop-blur-sm p-6 shadow-xl border border-[#d4dce8] max-w-md mx-auto pointer-events-auto"
                style={{ borderRadius: "2px" }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-10 h-10 flex items-center justify-center shrink-0",
                      iconBg,
                    )}
                    style={{ borderRadius: "1px" }}
                  >
                    <Icon className={cn("h-5 w-5", iconColor)} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 text-[#1f3a61] text-sm">
                      {title}
                    </h3>
                    <p className="text-sm text-[#496c83]">{body}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Desktop verification card */}
        <div className="hidden lg:block">
          <div className="absolute top-[200vh] left-8 z-30 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-white/95 backdrop-blur-md p-8 shadow-2xl border border-[#d4dce8] max-w-md pointer-events-auto"
              style={{ borderRadius: "2px" }}
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 flex items-center justify-center shrink-0 bg-[#1f3a61]"
                    style={{ borderRadius: "1px" }}
                  >
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#7999b9] mb-1">
                      Verified supplier network
                    </p>
                    <p className="text-sm leading-relaxed text-[#496c83]">
                      Every supplier undergoes multi-layer compliance checks
                      ensuring quality, reliability, and regulatory adherence.
                    </p>
                  </div>
                </div>
                {[
                  "ISO certified partners",
                  "Real-time compliance monitoring",
                  "Automated quality assurance",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 pt-1 border-t border-[#f0f4fa]"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#496c83]" />
                    <span className="text-xs font-medium text-[#1f3a61]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── CHOOSE YOUR PATH ─── */}
      {!user && (
        <section
          id="access"
          className="py-16 sm:py-24 lg:py-32 bg-[#fef8f5] border-t border-[#f0d5c8] relative z-20"
        >
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-10 sm:mb-16">
              <p className="text-xs font-semibold text-[#7999b9] mb-4">
                Join us
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading tracking-tight mb-3 sm:mb-4 px-4 text-[#1f3a61]">
                Select your portal
              </h2>
              <p className="text-base sm:text-lg max-w-xl mx-auto px-4 text-[#496c83]">
                Enterprise access is role-specific. Choose the portal that
                corresponds to your organization type.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {/* Health System */}
              <div
                className="group relative bg-gradient-to-br from-[#ffa07a]/[.12] to-[#fffaf8] border border-[#ffa07a]/[.30] p-6 sm:p-10 hover:shadow-[0_12px_40px_rgba(255,160,122,0.16)] shadow-[0_2px_8px_rgba(255,160,122,0.06)] transition-all duration-500 hover:-translate-y-1"
                style={{ borderRadius: "2px" }}
              >
                <div
                  className="w-12 h-12 bg-[#ffa07a]/[.15] flex items-center justify-center mb-6"
                  style={{ borderRadius: "1px" }}
                >
                  <Hospital className="h-6 w-6 text-[#c4622a]" />
                </div>
                <p className="text-xs font-semibold text-[#c4622a] mb-2">
                  Health systems
                </p>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 text-[#1f3a61]">
                  Hospital procurement portal
                </h3>
                <p className="text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed text-[#496c83]">
                  Optimize procurement, reduce costs, and ensure compliance
                  across your entire supply chain.
                </p>
                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {[
                    "AI-driven supplier matching",
                    "Smarter & faster decisions",
                    "Cost optimization",
                    "Intelligent compliance",
                  ].map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#496c83]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-[#ffa07a]" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="w-full h-10 sm:h-11 bg-[#ffa07a] hover:bg-[#e8855e] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  style={{ borderRadius: "1px" }}
                  onClick={() => setIsRequestModalOpen(true)}
                >
                  Apply as a health system{" "}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Supplier */}
              <div
                className="group relative bg-gradient-to-br from-[#ffa07a]/[.18] to-[#fffcfa] border border-[#ffa07a]/[.38] p-6 sm:p-10 hover:shadow-[0_12px_40px_rgba(255,160,122,0.18)] shadow-[0_2px_8px_rgba(255,160,122,0.06)] transition-all duration-500 hover:-translate-y-1"
                style={{ borderRadius: "2px" }}
              >
                <div
                  className="w-12 h-12 bg-[#ffa07a]/[.18] flex items-center justify-center mb-6"
                  style={{ borderRadius: "1px" }}
                >
                  <Store className="h-6 w-6 text-[#c4622a]" />
                </div>
                <p className="text-xs font-semibold text-[#c4622a] mb-2">
                  Suppliers
                </p>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 text-[#1f3a61]">
                  Supplier partner portal
                </h3>
                <p className="text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed text-[#496c83]">
                  Access verified demand signals, structured proposals, and grow
                  your business with intelligent forecasting.
                </p>
                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {[
                    "AI-enabled revenue growth",
                    "Supply-demand forecasting",
                    "Performance insights",
                    "Smart allocation",
                  ].map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#496c83]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-[#ffa07a]" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="w-full h-10 sm:h-11 bg-[#ffa07a] hover:bg-[#e8855e] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  style={{ borderRadius: "1px" }}
                  onClick={() => setIsRequestModalOpen(true)}
                >
                  Apply as a supplier partner{" "}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Democratic PROCUREMENT ─── */}
      <section
        id="intelligence"
        className="py-16 sm:py-24 lg:py-32 bg-[#edf1f8] border-t border-[#d4dce8] relative z-20"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading tracking-tight mb-3 sm:mb-4 px-4 text-[#1f3a61]">
              Democratic procurement
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto px-4 text-[#496c83]">
              The gap between demand and supply — manual discovery and unclear
              signals. Our platform introduces structured matching and
              measurable alignment.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Hospital Side */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-xs font-semibold text-[#7999b9] mb-2">
                The hospital struggle
              </h3>

              <div
                className="p-4 sm:p-6 border transition-all bg-[#f0f4fa] border-[#d8e0ec]"
                style={{ borderRadius: "2px" }}
              >
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 bg-[#e2e8f4]"
                    style={{ borderRadius: "1px" }}
                  >
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 text-[#496c83]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base mb-1 text-[#1f3a61]">
                      Manual hunting
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#496c83]">
                      Hospitals waste hours searching for suppliers across
                      fragmented channels.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 bg-[#e2e8f4]"
                    style={{ borderRadius: "1px" }}
                  >
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-[#496c83]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base mb-1 text-[#1f3a61]">
                      Slow purchase cycles
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#496c83]">
                      Traditional procurement stretches days into weeks with
                      endless back-and-forth.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="p-4 sm:p-6 border transition-all bg-[#1f3a61] border-[#2e5080] shadow-[0_4px_20px_rgba(31,58,97,0.20)]"
                style={{ borderRadius: "2px" }}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 bg-[#b2d6e0]/20"
                    style={{ borderRadius: "1px" }}
                  >
                    <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-[#b2d6e0]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base mb-1 text-white">
                      Intelligent capture
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#b2d6e0]">
                      AI assists with requirement capture, supporting supplier
                      alignment and comparative proposal preparation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vendor Side */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-xs font-semibold text-[#7999b9] mb-2">
                The supplier struggle
              </h3>

              <div
                className="p-4 sm:p-6 border transition-all bg-[#f0f4fa] border-[#d8e0ec]"
                style={{ borderRadius: "2px" }}
              >
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 bg-[#e2e8f4]"
                    style={{ borderRadius: "1px" }}
                  >
                    <Target className="h-4 w-4 sm:h-5 sm:w-5 text-[#496c83]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base mb-1 text-[#1f3a61]">
                      Unclear demand
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#496c83]">
                      Suppliers struggle to identify real demand signals across
                      fragmented hospital networks.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 bg-[#e2e8f4]"
                    style={{ borderRadius: "1px" }}
                  >
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-[#496c83]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base mb-1 text-[#1f3a61]">
                      Time-consuming quotations
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#496c83]">
                      Manual quoting processes drain resources and lead to
                      missed opportunities.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="p-4 sm:p-6 border transition-all bg-[#1f3a61] border-[#5a7d96] shadow-[0_4px_20px_rgba(73,108,131,0.22)]"
                style={{ borderRadius: "2px" }}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 bg-[#b2d6e0]/20"
                    style={{ borderRadius: "1px" }}
                  >
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-[#b2d6e0]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base mb-1 text-white">
                      Smart matching
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#cfe4ec]">
                      AI-driven demand insights, structured proposal preparation
                      support, and timely opportunity notifications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ProcurementStepsSection />

      {/* ── LEADERSHIP ─── */}
      <section
        id="aboutus"
        className="py-16 sm:py-24 lg:py-32 bg-[#e8edf5] border-t border-[#d4dce8] z-20 relative"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div
                className="relative overflow-hidden shadow-[0_20px_60px_rgba(31,58,97,0.12)] border border-[#d4dce8] bg-white p-1.5 sm:p-2"
                style={{ borderRadius: "2px" }}
              >
                <img
                  src="/Nikita.jpeg"
                  alt="Nikita Akolikar"
                  className="w-full h-auto object-cover"
                  style={{ borderRadius: "1px" }}
                />
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 sm:-bottom-7 z-10">
                <a
                  href="https://www.linkedin.com/in/nikita-akolikar"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    className="h-10 sm:h-12 px-6 sm:px-8 bg-[#1f3a61] hover:bg-[#2e5080] text-white text-sm font-semibold transition-all hover:-translate-y-1 flex items-center gap-2 shadow-xl"
                    style={{ borderRadius: "1px" }}
                  >
                    <Linkedin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Connect on LinkedIn
                  </button>
                </a>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="h-px w-6 sm:w-8 bg-[#7999b9]"></div>
                <span className="text-xs font-semibold text-[#7999b9]">
                  About us
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading mb-2 tracking-tight text-[#1f3a61]">
                Nikita Akolikar
              </h2>
              <p className="text-base sm:text-lg font-medium mb-6 sm:mb-8 text-[#496c83]">
                Founder & CEO
              </p>
              <div className="mb-8 sm:mb-10">
                <p className="text-lg sm:text-xl md:text-2xl font-bold leading-relaxed font-heading text-[#2d4f7a]">
                  "I see opportunities others miss"
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-light leading-relaxed font-heading text-[#2d4f7a]">
                  Leading businesses across 4 continents. We are building
                  easemed to democratize global healthcare access through
                  intelligent digital procurement systems.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10 border-t border-[#d4dce8] pt-6 sm:pt-8">
                <div>
                  <h4 className="flex items-center gap-2 font-bold text-[#1f3a61] text-xs sm:text-sm mb-2">
                    <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#496c83]" />
                    Track record
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#496c83]">
                    5+ years sourcing for 30+ clients. Multi-million dollar deal
                    architect for pharma & devices.
                  </p>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 font-bold text-[#1f3a61] text-xs sm:text-sm mb-2">
                    <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#496c83]" />
                    Expertise
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#496c83]">
                    B.Tech (IT) + Diploma in Geopolitics. The perfect blend for
                    cross-border technology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─── */}
      <footer className="relative bg-white pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 overflow-hidden border-t border-[#d4dce8] z-20">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#1f3a61]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 mb-12 sm:mb-16 lg:mb-20">
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-center gap-3">
                <img
                  src="/logo2.png"
                  alt="easemed"
                  className="h-12 w-12 object-contain opacity-80"
                />
                <span className="text-2xl sm:text-3xl font-black tracking-[-0.04em] text-[#1f3a61]">
                  easemed
                </span>
              </div>
              <div className="max-w-md">
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-[#1f3a61]">
                  The operating layer for healthcare procurement.
                </h3>
                <p className="text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 text-[#496c83]">
                  Join health systems and supplier partners already using
                  EaseMed to improve procurement efficiency
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {user && profile ? (
                    <Link href={getDashboardUrl()}>
                      <button
                        className="w-full sm:w-auto px-6 h-10 text-sm font-semibold text-white bg-[#1f3a61] hover:bg-[#2e5080] transition-colors flex items-center gap-2"
                        style={{ borderRadius: "1px" }}
                      >
                        Dashboard <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  ) : (
                    <button
                      onClick={() => setIsRequestModalOpen(true)}
                      className="w-full sm:w-auto px-6 h-10 text-sm font-semibold text-white bg-[#1f3a61] hover:bg-[#2e5080] transition-colors flex items-center gap-2"
                      style={{ borderRadius: "1px" }}
                    >
                      Get network access <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="pt-4 border-t border-[#e8edf5]">
                <p className="text-xs sm:text-sm text-[#7999b9]">
                  Copyright © 2026 easemed. All rights reserved.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  title: "Company",
                  links: [
                    { href: "#hero", label: "Pricing" },
                    { href: "#aboutus", label: "Blog" },
                    { href: "#platform", label: "Network" },
                  ],
                },
                {
                  title: "Legal",
                  links: [
                    { href: "#", label: "Privacy policy" },
                    { href: "#", label: "Terms of service" },
                  ],
                },
                {
                  title: "Social",
                  links: [
                    { href: "#", label: "Twitter" },
                    { href: "#", label: "LinkedIn" },
                    { href: "#", label: "Instagram" },
                  ],
                },
              ].map(({ title, links }) => (
                <div key={title} className="space-y-3 sm:space-y-4">
                  <h4 className="font-bold text-[#1f3a61] text-xs">{title}</h4>
                  <nav className="flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm font-medium">
                    {links.map(({ href, label }) => (
                      <Link
                        key={label}
                        href={href}
                        className="text-[#7999b9] hover:text-[#1f3a61] transition-colors"
                      >
                        {label}
                      </Link>
                    ))}
                  </nav>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-[-5%] left-0 w-full text-center pointer-events-none select-none overflow-hidden">
          <h1 className="text-[14vw] sm:text-[12vw] md:text-[10vw] font-black text-[#edf1f8] tracking-tighter leading-none">
            easemed
          </h1>
        </div>
      </footer>
    </div>
  );
}
