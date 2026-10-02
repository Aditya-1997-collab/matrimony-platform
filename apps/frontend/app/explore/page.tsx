"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Search, Filter, ChevronLeft, ChevronRight, User, Calendar, MapPin, Briefcase, GraduationCap, Loader2, AlertCircle, X } from "lucide-react";
import { Modal } from "@/components/Modal";

interface Profile {
  id: number;
  user_id: number;
  full_name: string;
  gender: string;
  date_of_birth: string;
  email: string;
  caste?: string;
  sub_caste?: string;
  education?: string;
  career?: string;
  income?: string;
  marital_status?: string;
  living_in?: string;
  bio?: string;
  profile_status: string;
  created_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function ExplorePage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    gender: "",
    minAge: "",
    maxAge: "",
    caste: "",
    marital_status: "",
    location: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info" as "success" | "error" | "info" | "warning",
  });

  const fetchProfiles = async (page = 1) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value !== "")
        ),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/profile/explore?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.code === "PROFILE_INCOMPLETE") {
          setModalState({
            isOpen: true,
            title: "Profile Incomplete",
            message: data.error,
            type: "warning",
          });
          // Redirect to onboarding after a delay
          setTimeout(() => router.push("/onboarding"), 2000);
          return;
        }
        throw new Error(data.error || "Failed to fetch profiles");
      }

      setProfiles(data.profiles);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    fetchProfiles(1);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({
      gender: "",
      minAge: "",
      maxAge: "",
      caste: "",
      marital_status: "",
      location: "",
    });
    fetchProfiles(1);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  if (loading && profiles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50/60 via-white to-pink-50/40 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-rose-500 animate-spin" />
          <p className="text-slate-600">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/60 via-white to-pink-50/40">
      {/* Header */}
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
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link>
            <Link href="#features" className="hover:text-rose-600 transition-colors">Features</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/onboarding"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all duration-200"
            >
              <User className="h-4 w-4 mr-2" />
              My Profile
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                router.push("/");
              }}
              className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-xl shadow-lg shadow-rose-600/25 transition-all duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Explore <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent"> Profiles</span>
          </h1>
          <p className="mt-2 text-slate-600">
            Discover compatible matches tailored to your preferences
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${
                  hasActiveFilters
                    ? "bg-rose-600 text-white"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-rose-50 hover:border-rose-200"
                }`}
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="px-2 py-0.5 text-xs bg-white/20 rounded-full">
                    {Object.values(filters).filter((v) => v !== "").length}
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  Clear all
                </button>
              )}
            </div>

            <div className="text-sm text-slate-500">
              Showing {profiles.length} of {pagination.total} profiles
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-6 bg-white rounded-2xl border border-rose-100 shadow-sm animate-slide-down">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Gender
                  </label>
                  <select
                    value={filters.gender}
                    onChange={(e) => handleFilterChange("gender", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                  >
                    <option value="">All</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Min Age
                  </label>
                  <input
                    type="number"
                    value={filters.minAge}
                    onChange={(e) => handleFilterChange("minAge", e.target.value)}
                    placeholder="18"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Max Age
                  </label>
                  <input
                    type="number"
                    value={filters.maxAge}
                    onChange={(e) => handleFilterChange("maxAge", e.target.value)}
                    placeholder="60"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Caste
                  </label>
                  <input
                    type="text"
                    value={filters.caste}
                    onChange={(e) => handleFilterChange("caste", e.target.value)}
                    placeholder="e.g., Brahmin"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Marital Status
                  </label>
                  <select
                    value={filters.marital_status}
                    onChange={(e) => handleFilterChange("marital_status", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                  >
                    <option value="">All</option>
                    <option value="never_married">Never Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => handleFilterChange("location", e.target.value)}
                    placeholder="e.g., Mumbai"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-xl shadow-lg shadow-rose-600/25 transition-all duration-200"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Profiles Grid */}
        {profiles.length === 0 && !loading ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No profiles found</h3>
            <p className="text-slate-600 mb-6">
              {hasActiveFilters
                ? "Try adjusting your filters to find more matches"
                : "No profiles available at the moment. Check back later!"}
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="bg-white rounded-2xl border border-rose-100 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  {/* Profile Image Placeholder */}
                  <div className="relative h-56 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl">
                      {profile.full_name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-semibold text-slate-700 rounded-full capitalize">
                        {profile.gender}
                      </span>
                      <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-semibold text-slate-700 rounded-full">
                        {calculateAge(profile.date_of_birth)} yrs
                      </span>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900 truncate">
                        {profile.full_name}
                      </h3>
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                        Verified
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 text-rose-500 flex-shrink-0" />
                      <span className="truncate">{profile.living_in || "Location not specified"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Briefcase className="h-4 w-4 text-rose-500 flex-shrink-0" />
                      <span className="truncate">{profile.career || "Not specified"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <GraduationCap className="h-4 w-4 text-rose-500 flex-shrink-0" />
                      <span className="truncate">{profile.education || "Not specified"}</span>
                    </div>

                    {profile.caste && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <User className="h-4 w-4 text-rose-500 flex-shrink-0" />
                        <span className="truncate">{profile.caste}</span>
                      </div>
                    )}

                    {profile.bio && (
                      <p className="text-sm text-slate-500 line-clamp-2 italic">
                        "{profile.bio}"
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Joined {new Date(profile.created_at).toLocaleDateString()}
                      </span>
                      <Link
                        href={`/profile/${profile.user_id}`}
                        className="text-sm font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                      >
                        View Profile
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => fetchProfiles(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => fetchProfiles(pageNum)}
                        className={`w-10 h-10 rounded-xl font-semibold transition-colors ${
                          pageNum === pagination.page
                            ? "bg-rose-600 text-white"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => fetchProfiles(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal for profile incomplete warning */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />
    </div>
  );
}