"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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

// --- Utility Helper ---
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// --- Components ---
const RequestAccessModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [role, setRole] = useState<"hospital" | "vendor">("hospital");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    reason: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation of API call
    setTimeout(() => {
      toast.success("Request received! Check your email.");
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
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-420px bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>

            <h1 className="text-xl font-bold font-heading text-slate-900 mb-1">
              Request Enterprise Access
            </h1>

            <p className="text-sm text-slate-500 mb-4">
              Streamline your supply chain.
            </p>

            <div className="flex gap-2 mb-4 bg-slate-50 p-1 rounded-lg">
              {["hospital", "vendor"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r as any)}
                  className={cn(
                    "flex-1 py-1.5 rounded-md text-xs font-medium transition-all capitalize",
                    role === r
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 font-sans"
            >
              <input
                placeholder="Organization Name"
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
                required
              />

              <input
                placeholder="Work Email"
                type="email"
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
                required
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-lg"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Submit Request"
                )}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Mobile Menu Component
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
          className="fixed inset-0 z-90 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 bottom-0 w-280px bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <img
                    src="/logo.png"
                    alt="EaseMed"
                    className="h-8 w-8 object-contain"
                  />
                  <span className="text-base font-bold tracking-tight text-slate-900 font-heading">
                    EaseMed
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-4 mb-8">
                <Link
                  href="#features"
                  className="text-slate-600 hover:text-slate-900 transition-colors py-2"
                  onClick={onClose}
                >
                  Platform
                </Link>
                <Link
                  href="#network"
                  className="text-slate-600 hover:text-slate-900 transition-colors py-2"
                  onClick={onClose}
                >
                  Network
                </Link>
                <Link
                  href="#team"
                  className="text-slate-600 hover:text-slate-900 transition-colors py-2"
                  onClick={onClose}
                >
                  Leadership
                </Link>
              </nav>

              <div className="flex flex-col gap-3">
                {user ? (
                  <Button
                    onClick={() => {
                      onDashboard();
                      onClose();
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 rounded-lg h-10"
                  >
                    Dashboard
                  </Button>
                ) : (
                  <>
                    {/*<Link href="/login" onClick={onClose}>
                      <Button
                        variant="outline"
                        className="w-full rounded-lg h-10"
                      >
                        Log In
                      </Button>
                    </Link>*/}
                    <Button
                      onClick={() => {
                        onRequestAccess();
                        onClose();
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 rounded-lg h-10"
                    >
                      Request Access
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function HomePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-sky-100 selection:text-sky-900 relative overflow-x-hidden">
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

      {/* --- NAVBAR --- */}
      <header className="fixed top-2 sm:top-4 left-0 right-0 z-50 flex justify-center px-2 sm:px-4">
        <div className="w-full max-w-7xl bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {" "}
            {/* Increased gap from 2 to 3 */}
            <img
              src="/logo.png"
              alt="EaseMed"
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
            />
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 font-heading">
              EaseMed
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-8 xl:gap-10 text-sm font-medium text-slate-500">
            <Link
              href="#features"
              className="hover:text-slate-900 transition-colors"
            >
              Platform
            </Link>
            <Link
              href="#network"
              className="hover:text-slate-900 transition-colors"
            >
              Network
            </Link>
            <Link
              href="#team"
              className="hover:text-slate-900 transition-colors"
            >
              Leadership
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <Button
                onClick={handleDashboardClick}
                disabled={redirecting}
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 rounded-lg h-8 sm:h-10 px-3 sm:px-6 text-xs sm:text-sm"
              >
                {redirecting ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Dashboard"
                )}
              </Button>
            ) : (
              <>
                {/*<Link
                  href="/login"
                  className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                  Log In
                </Link>*/}
                <Button
                  onClick={() => setIsRequestModalOpen(true)}
                  size="sm"
                  className="hidden sm:flex bg-slate-900 hover:bg-slate-800 rounded-lg h-10 px-6 text-sm shadow-lg shadow-slate-900/20"
                >
                  Request Access
                </Button>
              </>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-slate-600 hover:text-slate-900"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* --- SCROLLYTELLING HERO SECTION --- */}
      <div className="relative">
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

        {/* Mobile Info Cards - Visible only on mobile at pause points */}
        <div className="lg:hidden">
          {/* First Pause Card - After initial hero */}
          <div className="absolute top-[100vh] left-0 right-0 px-4 z-30 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200 max-w-md mx-auto pointer-events-auto"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center shrink-0">
                  <Zap className="h-6 w-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    Lightning Fast
                  </h3>
                  <p className="text-sm text-slate-600">
                    Reduce procurement cycles from days to minutes with AI
                    automation
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Second Pause Card - Middle section */}
          <div className="absolute top-[200vh] left-0 right-0 px-4 z-30 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200 max-w-md mx-auto pointer-events-auto"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    Verified Network
                  </h3>
                  <p className="text-sm text-slate-600">
                    Every supplier is rigorously vetted for quality and
                    compliance
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Third Pause Card - End section */}
          <div className="absolute top-[300vh] left-0 right-0 px-4 z-30 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200 max-w-md mx-auto pointer-events-auto"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center shrink-0">
                  <TrendingUp className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    Cost Savings
                  </h3>
                  <p className="text-sm text-slate-600">
                    Transparent bidding ensures optimal pricing and eliminates
                    hidden costs
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Desktop Card - Only on 2nd pause, visible only on desktop */}
        <div className="hidden lg:block">
          <div className="absolute top-[200vh] left-8 z-30 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-slate-200 max-w-md pointer-events-auto"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                    <Shield className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Verified Supplier Network
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Every supplier undergoes rigorous verification.
                      Multi-layer compliance checks ensure quality, reliability,
                      and regulatory adherence across all transactions.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium text-slate-700">
                    ISO Certified Partners
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium text-slate-700">
                    Real-time Compliance Monitoring
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium text-slate-700">
                    Automated Quality Assurance
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* --- CHOOSE YOUR PATH (Logged-out only) --- */}
      {!user && (
        <section className="py-16 sm:py-24 lg:py-32 bg-white relative z-20 border-t border-slate-200">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-slate-900 tracking-tight mb-3 sm:mb-4 px-4">
                Choose Your Path
              </h2>
              <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto px-4">
                Select the portal that best describes your organization
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {/* Hospital Card */}
              <div className="group relative bg-linear-to-br from-sky-50 to-white border border-sky-100 rounded-2xl sm:rounded-3xl p-6 sm:p-10 hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-500 hover:-translate-y-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-sky-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                  <Hospital className="h-6 w-6 sm:h-7 sm:w-7 text-sky-600" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mb-2 sm:mb-3">
                  For Hospitals
                </h3>

                <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8 leading-relaxed">
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
                      className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-500 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full h-10 sm:h-12 bg-sky-600 hover:bg-sky-700 rounded-lg sm:rounded-xl text-sm sm:text-base shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
                  onClick={() => setIsRequestModalOpen(true)}
                >
                  Sign Up as Hospital{" "}
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-2" />
                </Button>
              </div>

              {/* Vendor Card */}
              <div className="group relative bg-linear-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl sm:rounded-3xl p-6 sm:p-10 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                  <Store className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-600" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mb-2 sm:mb-3">
                  For Vendors
                </h3>

                <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8 leading-relaxed">
                  Access opportunities, submit bids, and grow your business with
                  intelligent demand forecasting.
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
                      className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full h-10 sm:h-12 bg-emerald-600 hover:bg-emerald-700 rounded-lg sm:rounded-xl text-sm sm:text-base shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  onClick={() => setIsRequestModalOpen(true)}
                >
                  Sign Up as Vendor{" "}
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- THE PROCUREMENT PARADOX --- */}
      <section className="py-16 sm:py-24 lg:py-32 bg-slate-50 relative z-20 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-block mb-3 sm:mb-4">
              <span className="py-1 sm:py-1.5 px-4 sm:px-5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase bg-white text-slate-500 border border-slate-200 shadow-sm">
                Features
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-slate-900 tracking-tight mb-3 sm:mb-4 px-4">
              Unbiased Procurement
            </h2>

            <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto px-4">
              The broken loop between demand and supply — manual hunting on one
              side, unclear demand on the other. AI fixes both.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Hospital Side */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                The Hospital Struggle
              </h3>

              {[
                {
                  icon: Search,
                  title: "Manual Hunting",
                  desc: "Hospitals waste hours searching for suppliers across fragmented channels.",
                },
                {
                  icon: Clock,
                  title: "Slow Purchase Cycles",
                  desc: "Traditional procurement stretches days into weeks with endless back-and-forth.",
                },
                {
                  icon: Brain,
                  title: "The EaseMed Solution: Intelligent Capture",
                  desc: "AI captures requirements, auto-matches to verified suppliers, and generates quotations instantly.",
                  highlight: true,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={cn(
                    "p-4 sm:p-6 rounded-xl sm:rounded-2xl border transition-all",
                    item.highlight
                      ? "bg-sky-50 border-sky-200 shadow-lg shadow-sky-500/5"
                      : "bg-white border-slate-200",
                  )}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div
                      className={cn(
                        "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0",
                        item.highlight ? "bg-sky-100" : "bg-slate-100",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4 sm:h-5 sm:w-5",
                          item.highlight ? "text-sky-600" : "text-slate-500",
                        )}
                      />
                    </div>

                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Vendor Side */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                The Vendor Struggle
              </h3>

              {[
                {
                  icon: Target,
                  title: "Unclear Demand",
                  desc: "Vendors struggle to identify real demand signals across fragmented hospital networks.",
                },
                {
                  icon: BarChart3,
                  title: "Time-Consuming Quotations",
                  desc: "Manual quoting processes drain resources and lead to missed opportunities.",
                },
                {
                  icon: Zap,
                  title: "The EaseMed Solution: Smart Matching",
                  desc: "AI-powered demand signals, automated bid preparation, and real-time opportunity alerts.",
                  highlight: true,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={cn(
                    "p-4 sm:p-6 rounded-xl sm:rounded-2xl border transition-all",
                    item.highlight
                      ? "bg-emerald-50 border-emerald-200 shadow-lg shadow-emerald-500/5"
                      : "bg-white border-slate-200",
                  )}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div
                      className={cn(
                        "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0",
                        item.highlight ? "bg-emerald-100" : "bg-slate-100",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4 sm:h-5 sm:w-5",
                          item.highlight
                            ? "text-emerald-600"
                            : "text-slate-500",
                        )}
                      />
                    </div>

                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- PLATFORM SHOWCASE SCROLL STACK --- */}
      <section className="py-16 sm:py-24 lg:py-32 bg-white relative z-20 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-block mb-3 sm:mb-4">
              <span className="py-1 sm:py-1.5 px-4 sm:px-5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase bg-slate-100 text-slate-600 border border-slate-200 shadow-sm">
                Platform
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-slate-900 tracking-tight mb-3 sm:mb-4 px-4">
              Experience the Platform
            </h2>
            <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto px-4">
              See how EaseMed transforms procurement workflows with intelligent
              automation
            </p>
          </div>

          <div className="h-[150vh] relative">
            <ScrollStack
              itemDistance={200}
              itemStackDistance={40}
              stackPosition="10%"
              baseScale={0.92}
              blurAmount={1}
            >
              <ScrollStackItem itemClassName="bg-gradient-to-br from-sky-50 to-white border-2 border-sky-100">
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center h-full">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-3 py-1.5 rounded-full text-xs font-bold">
                      <Target className="h-3.5 w-3.5" />
                      Smart Matching
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
                      AI-Powered Supplier Discovery
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      Our intelligent matching engine analyzes your requirements
                      and instantly connects you with verified suppliers that
                      meet your exact specifications.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                        Real-time Matching
                      </span>
                      <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                        Quality Score
                      </span>
                      <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                        Compliance Check
                      </span>
                    </div>
                  </div>
                  <div className="relative h-48 sm:h-64 lg:h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                    <img
                      src="/dashboard(1).png"
                      alt="Dashboard Overview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </ScrollStackItem>

              <ScrollStackItem itemClassName="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-100">
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center h-full">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold">
                      <Zap className="h-3.5 w-3.5" />
                      Instant Quotes
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
                      Automated Bid Generation
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      Generate and compare competitive bids in seconds. Our AI
                      analyzes market data to ensure you get the best possible
                      pricing.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                        Price Intelligence
                      </span>
                      <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                        Multi-Vendor
                      </span>
                      <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                        Auto-Compare
                      </span>
                    </div>
                  </div>
                  <div className="relative h-48 sm:h-64 lg:h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                    <img
                      src="/dashboard(2).png"
                      alt="Bid Management"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </ScrollStackItem>

              <ScrollStackItem itemClassName="bg-gradient-to-br from-violet-50 to-white border-2 border-violet-100">
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center h-full">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-3 py-1.5 rounded-full text-xs font-bold">
                      <BarChart3 className="h-3.5 w-3.5" />
                      Analytics
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
                      Advanced Analytics Dashboard
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      Track procurement performance with real-time insights.
                      Make data-driven decisions to optimize your supply chain.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                        Live Metrics
                      </span>
                      <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                        Cost Savings
                      </span>
                      <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                        Performance
                      </span>
                    </div>
                  </div>
                  <div className="relative h-48 sm:h-64 lg:h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                    <img
                      src="/dashboard(3).png"
                      alt="Analytics Dashboard"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </ScrollStackItem>

              <ScrollStackItem itemClassName="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-100">
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center h-full">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-xs font-bold">
                      <Shield className="h-3.5 w-3.5" />
                      Compliance
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
                      Automated Compliance Tracking
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      Stay compliant with automated tracking and verification.
                      Our system ensures all suppliers meet regulatory
                      requirements.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                        Auto-Verify
                      </span>
                      <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                        Audit Trail
                      </span>
                      <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                        Certifications
                      </span>
                    </div>
                  </div>
                  <div className="relative h-48 sm:h-64 lg:h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                    <img
                      src="/dashboard(4).png"
                      alt="Compliance Dashboard"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </ScrollStackItem>
            </ScrollStack>
          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section
        id="about"
        className="py-16 sm:py-24 lg:py-32 bg-slate-50 relative z-20 border-t border-slate-200"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-slate-900 tracking-tight mb-3 sm:mb-4 px-4">
              About EaseMed
            </h2>
            <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto px-4">
              A next-generation Procurement-as-a-Service platform leveraging AI
              to reduce manual work and ensure critical medical supplies reach
              hospitals faster.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Zap,
                title: "Efficiency First",
                desc: "Reducing procurement cycles from days to minutes with AI-powered automation.",
                color: "sky",
              },
              {
                icon: Shield,
                title: "Verified Trust",
                desc: "Rigorous vetting for all vendors ensures quality and regulatory compliance.",
                color: "emerald",
              },
              {
                icon: TrendingUp,
                title: "Cost Optimization",
                desc: "Transparent bidding ensures fair market prices and eliminates hidden costs.",
                color: "indigo",
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
              >
                <div
                  className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5",
                    pillar.color === "sky"
                      ? "bg-sky-100"
                      : pillar.color === "emerald"
                        ? "bg-emerald-100"
                        : "bg-indigo-100",
                  )}
                >
                  <pillar.icon
                    className={cn(
                      "h-5 w-5 sm:h-6 sm:w-6",
                      pillar.color === "sky"
                        ? "text-sky-600"
                        : pillar.color === "emerald"
                          ? "text-emerald-600"
                          : "text-indigo-600",
                    )}
                  />
                </div>

                <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900 mb-2 sm:mb-3">
                  {pillar.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- LEADERSHIP SECTION (Restored Editorial) --- */}
      <section
        id="team"
        className="py-16 sm:py-24 lg:py-32 bg-slate-50 border-t border-slate-200 z-20 relative"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
            {/* Left Column: Image (Grounded) */}
            <div className="relative order-2 lg:order-1">
              <div className="relative rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200 bg-white p-1.5 sm:p-2">
                <img
                  src="/Nikita.jpeg"
                  alt="Nikita Akolikar"
                  className="w-full h-auto object-cover rounded-xl sm:rounded-[2rem]"
                />
              </div>

              {/* Decorative Element */}
              <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 h-20 w-20 sm:h-24 sm:w-24 bg-white rounded-full flex items-center justify-center shadow-xl border border-slate-100 z-20">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
                    4
                  </div>
                  <div className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                    Continents
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Content (Editorial Style) */}
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="h-px w-6 sm:w-8 bg-slate-300"></div>
                <span className="text-[10px] sm:text-xs font-bold tracking-widest text-slate-400 uppercase">
                  Leadership
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-slate-900 mb-2 tracking-tight">
                Nikita Akolikar
              </h2>

              <p className="text-base sm:text-lg text-slate-500 font-medium mb-6 sm:mb-8">
                Founder & CEO
              </p>

              <div className="mb-8 sm:mb-10 relative">
                <span className="absolute -left-4 sm:-left-6 -top-3 sm:-top-4 text-4xl sm:text-6xl text-slate-200 font-serif opacity-50"></span>
                <p className="text-lg sm:text-xl md:text-2xl font-light text-slate-700 leading-relaxed font-heading">
                  I see opportunities others miss. We are building EaseMed to
                  democratize global healthcare access through intelligent
                  logistics.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10 border-t border-slate-200 pt-6 sm:pt-8">
                <div>
                  <h4 className="flex items-center gap-2 font-bold text-slate-900 text-xs sm:text-sm mb-2">
                    <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                    Track Record
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    5+ years sourcing for 30+ clients. Multi-million dollar deal
                    architect for pharma & devices.
                  </p>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 font-bold text-slate-900 text-xs sm:text-sm mb-2">
                    <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-600" />
                    Expertise
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    B.Tech (IT) + Diploma in Geopolitics. The perfect blend for
                    cross-border tech.
                  </p>
                </div>
              </div>

              <a
                href="https://www.linkedin.com/in/nikita-akolikar"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="h-10 sm:h-12 px-6 sm:px-8 bg-slate-900 hover:bg-blue-700 text-white rounded-full shadow-xl shadow-slate-900/10 transition-all hover:-translate-y-1 text-sm sm:text-base">
                  <Linkedin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                  Connect on LinkedIn
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative bg-white pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 overflow-hidden border-t border-slate-200 z-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 mb-12 sm:mb-16 lg:mb-20">
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-center gap-4">
                {" "}
                {/* Increased gap slightly for balance */}
                <img
                  src="/logo.png"
                  alt="EaseMed"
                  className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
                />
                <span className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-slate-900">
                  EaseMed
                </span>
              </div>

              <div className="max-w-md">
                <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900 mb-2">
                  Ready to modernize your supply chain?
                </h3>
                <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-4 sm:mb-6">
                  Join hundreds of hospitals and vendors already using EaseMed
                  to reduce procurement friction.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {user && profile ? (
                    <Link href={getDashboardUrl()}>
                      <Button
                        size="sm"
                        className="w-full sm:w-auto rounded-lg sm:rounded-xl px-5 sm:px-6 h-9 sm:h-10 font-semibold bg-slate-900 hover:bg-slate-800 text-sm sm:text-base"
                      >
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setIsRequestModalOpen(true)}
                      className="w-full sm:w-auto rounded-lg sm:rounded-xl px-5 sm:px-6 h-9 sm:h-10 font-semibold bg-slate-900 hover:bg-slate-800 text-sm sm:text-base"
                    >
                      Join Waitlist
                    </Button>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs sm:text-sm text-slate-400">
                  Copyright © 2026 EaseMed. <br />
                  All rights reserved.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-bold text-slate-900 text-[10px] sm:text-xs uppercase tracking-widest">
                  Company
                </h4>
                <nav className="flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500 font-medium">
                  <Link
                    href="#hero"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="#about"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Blog
                  </Link>
                  <Link
                    href="#network"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Contact
                  </Link>
                </nav>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-bold text-slate-900 text-[10px] sm:text-xs uppercase tracking-widest">
                  Legal
                </h4>
                <nav className="flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500 font-medium">
                  <Link
                    href="#"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="#"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </nav>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-bold text-slate-900 text-[10px] sm:text-xs uppercase tracking-widest">
                  Social
                </h4>
                <nav className="flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500 font-medium">
                  <Link
                    href="#"
                    className="hover:text-sky-500 transition-colors"
                  >
                    Twitter
                  </Link>
                  <Link
                    href="#"
                    className="hover:text-blue-700 transition-colors"
                  >
                    LinkedIn
                  </Link>
                  <Link
                    href="#"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Instagram
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[-5%] left-0 w-full text-center pointer-events-none select-none overflow-hidden opacity-100">
          <h1 className="text-[14vw] sm:text-[12vw] md:text-[10vw] font-bold font-heading text-slate-100 uppercase tracking-tighter leading-none">
            EASEMED
          </h1>
        </div>
      </footer>
    </div>
  );
}
