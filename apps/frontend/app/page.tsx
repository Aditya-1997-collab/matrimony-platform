"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Heart, ShieldCheck, Sparkles, Users, Search, ArrowRight, CheckCircle2, User, LogOut, Menu, X, ChevronDown } from "lucide-react";

export default function Home() {
  const [profileFor, setProfileFor] = useState("Self");
  const [lookingFor, setLookingFor] = useState("Groom");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; full_name?: string } | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const registrationUrl = `/signup?profileFor=${encodeURIComponent(profileFor)}&lookingFor=${encodeURIComponent(lookingFor)}`;

  // Check auth status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);
        
        // Check if user has completed profile
        fetch("http://localhost:5000/profile/status", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setHasProfile(data.isCompleted || false);
          })
          .catch(() => {
            setHasProfile(false);
          });
      } catch {
        setIsLoggedIn(false);
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setHasProfile(false);
    setShowProfileMenu(false);
  };

  const getProfileDisplayName = () => {
    if (user?.full_name) return user.full_name;
    if (user?.email) return user.email.split("@")[0];
    return "My Profile";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/60 via-white to-pink-50/40 text-slate-800 font-sans">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-rose-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <Heart className="h-6 w-6 fill-current" />
            </div>
            <div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                SoulMate
              </span>
              <span className="block text-[10px] tracking-widest text-rose-400 font-semibold uppercase">
                Matrimony Platform
              </span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-rose-600 transition-colors">Features</a>
            <a href="#success-stories" className="hover:text-rose-600 transition-colors">Success Stories</a>
            <a href="#how-it-works" className="hover:text-rose-600 transition-colors">How It Works</a>
            {isLoggedIn && hasProfile && (
              <Link
                href="/explore"
                className="hover:text-rose-600 transition-colors font-semibold text-rose-600"
              >
                Explore Profiles
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              // Profile Dropdown
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 transition-colors"
                  aria-label="Profile menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                    {getProfileDisplayName().charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-700">
                    {getProfileDisplayName()}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowProfileMenu(false)}
                      aria-hidden="true"
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-rose-100 py-2 z-50 animate-fade-in">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900">{getProfileDisplayName()}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                      
                      <Link
                        href="/onboarding"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="h-5 w-5" />
                        {hasProfile ? "Edit Profile" : "Complete Profile"}
                      </Link>
                      
                      {hasProfile && (
                        <Link
                          href="/explore"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Search className="h-5 w-5" />
                          Explore Profiles
                        </Link>
                      )}
                      
                      <div className="border-t border-slate-100 my-2" />
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-xl shadow-lg shadow-rose-600/25 transition-all duration-200 hover:scale-[1.02]"
                >
                  Register Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-rose-100 animate-slide-down">
          <div className="px-4 py-4 space-y-4">
            <a href="#features" className="block text-sm font-medium text-slate-600 hover:text-rose-600" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#success-stories" className="block text-sm font-medium text-slate-600 hover:text-rose-600" onClick={() => setMobileMenuOpen(false)}>Success Stories</a>
            <a href="#how-it-works" className="block text-sm font-medium text-slate-600 hover:text-rose-600" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            {isLoggedIn && hasProfile && (
              <Link
                href="/explore"
                className="block text-sm font-semibold text-rose-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore Profiles
              </Link>
            )}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/onboarding"
                    className="px-4 py-3 text-sm font-medium text-slate-700 bg-rose-50 rounded-xl text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {hasProfile ? "Edit Profile" : "Complete Profile"}
                  </Link>
                  {hasProfile && (
                    <Link
                      href="/explore"
                      className="px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-pink-600 rounded-xl text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Explore Profiles
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 text-sm font-medium text-rose-600 bg-white border border-rose-200 rounded-xl text-center"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-3 text-sm font-medium text-rose-600 bg-rose-50 rounded-xl text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-pink-600 rounded-xl text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden z-0">
          <div className="absolute top-12 left-1/4 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 text-rose-700 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="h-3.5 w-3.5 text-rose-500" />
                Trusted by Millions of Happy Couples
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
                Find Your Perfect <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Life Partner
                </span> Today
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Join the most trusted matrimony platform where genuine connections blossom into lifelong marriages. Verified profiles, advanced AI matching, and complete privacy.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  href={registrationUrl}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-2xl shadow-xl shadow-rose-600/30 transition-all duration-200 hover:scale-105"
                >
                  Get Started - Register Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/onboarding"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-all duration-200"
                >
                  Explore Profiles
                </Link>
              </div>

              <div className="pt-8 grid grid-cols-3 gap-6 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">100%</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Verified Profiles</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">50K+</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Success Stories</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">4.9/5</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">User Rating</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-white rounded-3xl p-6 shadow-2xl border border-rose-100 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-lg">
                        💍
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">Start Your Journey</h3>
                        <p className="text-xs text-slate-500">Takes less than 2 minutes</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Secure
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Creating Profile For</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Self", "Son / Daughter"].map((option) => (
                          <button
                            key={option}
                            onClick={() => setProfileFor(option)}
                            className={`p-3 rounded-xl border-2 transition-all text-sm font-semibold ${
                              profileFor === option
                                ? "border-rose-500 bg-rose-50/50 text-rose-700"
                                : "border-slate-200 hover:border-slate-300 text-slate-600"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Looking For</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Bride", "Groom"].map((option) => (
                          <button
                            key={option}
                            onClick={() => setLookingFor(option)}
                            className={`p-3 rounded-xl border-2 transition-all text-sm font-semibold ${
                              lookingFor === option
                                ? "border-rose-500 bg-rose-50/50 text-rose-700"
                                : "border-slate-200 hover:border-slate-300 text-slate-600"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Link
                      href={registrationUrl}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg shadow-rose-600/20 transition-all duration-200"
                    >
                      Continue Registration
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/60 border-t border-rose-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-rose-600">Why Choose SoulMate</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Designed to Help You Find Your Soulmate Safely & Easily
            </p>
            <p className="text-slate-600">
              We combine cutting-edge technology with traditional values to deliver an exceptional matchmaking experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-gradient-to-b from-rose-50/50 to-white border border-rose-100/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-rose-500 text-white flex items-center justify-center mb-6 shadow-md shadow-rose-500/20">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">100% Screened Profiles</h3>
              <p className="text-slate-600 leading-relaxed">
                Every profile undergoes rigorous phone and government ID verification so you interact only with genuine members.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-b from-rose-50/50 to-white border border-rose-100/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-pink-500 text-white flex items-center justify-center mb-6 shadow-md shadow-pink-500/20">
                <Search className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Smart AI Matching</h3>
              <p className="text-slate-600 leading-relaxed">
                Our proprietary compatibility algorithm suggests matches based on your lifestyle, values, background, and aspirations.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-b from-rose-50/50 to-white border border-rose-100/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center mb-6 shadow-md shadow-rose-600/20">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Complete Privacy Control</h3>
              <p className="text-slate-600 leading-relaxed">
                You decide who views your contact details and photos. Connect securely with absolute peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-white to-rose-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-rose-600">Simple 3-Step Process</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Your Journey to Happily Ever After
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-100 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 font-black text-lg flex items-center justify-center mx-auto">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900">Create Your Profile</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Register for free, add your details, preferences, and upload your best photos in minutes.
              </p>
            </div>

            <div className="relative p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-100 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 font-black text-lg flex items-center justify-center mx-auto">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900">Discover Matches</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Browse through verified compatible profiles handpicked specially for you by our smart system.
              </p>
            </div>

            <div className="relative p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-100 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 font-black text-lg flex items-center justify-center mx-auto">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900">Connect & Meet</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Send interests, chat securely, and take the first step towards your wonderful wedding.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href={registrationUrl}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-2xl shadow-xl shadow-rose-600/30 transition-all duration-200 hover:scale-105"
            >
              Register Now & Start Exploring
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white">
              <Heart className="h-4 w-4 fill-current" />
            </div>
            <span className="text-xl font-bold text-white">SoulMate Matrimony</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} SoulMate Technologies Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
