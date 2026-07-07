import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Calendar, User, BookOpen, ArrowUpRight } from "lucide-react";
import { API_BASE } from "../services/adminApi";

const API_URL = API_BASE;

const TAB_OPTIONS = [
  { key: "video", label: "publicationsPage.tabs.video" },
  { key: "photo", label: "publicationsPage.tabs.photo" },
  { key: "media", label: "publicationsPage.tabs.media" },
  { key: "publications", label: "publicationsPage.tabs.publications" },
];

function extractYouTubeEmbed(url) {
  if (!url) return null;

  const ytMatch =
    url.match(/youtu\.be\/([A-Za-z0-9_-]+)/) ||
    url.match(/watch\?v=([A-Za-z0-9_-]+)/) ||
    url.match(/embed\/([A-Za-z0-9_-]+)/);

  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  return url;
}

function PublicationCard({ item, isAdmin, toggleHidden }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const pub = item;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="relative w-full"
    >
      <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white/70 dark:bg-[#112240]/80 dark:border-slate-700 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#317873] hover:shadow-[0_20px_50px_rgba(49,120,115,0.18)]">
        <div className="relative">
          {/* Timeline Dot */}
          <div className="absolute left-0 top-8 flex items-center">
            <div className="w-4 h-4 rounded-full bg-[#317873] shadow-[0_0_20px_rgba(49,120,115,0.8)]" />
          </div>

          <div className="pl-8 p-6 md:p-7">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#317873]/10 px-3 py-1 text-sm font-medium text-[#317873]">
                <Calendar size={14} />
                {pub.year}
              </div>
            </div>

            <h3
              onClick={() => navigate(`/publications/${pub.id}`)}
              className="mt-5 cursor-pointer text-xl md:text-2xl font-bold text-[#091728] dark:text-white transition group-hover:text-[#317873]"
            >
              {pub.title}
            </h3>

            <div className="mt-5 flex flex-wrap gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/teachers/${pub.teacher_id ?? pub.teacher}`);
                }}
                className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-[#317873] transition"
              >
                <User size={16} />
                {pub.teacher_name}
              </button>

              <div className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <BookOpen size={16} />
                {pub.journal}
              </div>
            </div>

            {isAdmin && (
              <div className="mt-5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleHidden(pub);
                  }}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium transition ${
                    pub.is_hidden
                      ? "border-green-500 text-green-500 hover:bg-green-500/10"
                      : "border-red-500 text-red-500 hover:bg-red-500/10"
                  }`}
                >
                  {pub.is_hidden
                    ? t("publicationsPage.unhide")
                    : t("publicationsPage.hide")}
                </button>
              </div>
            )}

            <div
              onClick={() => navigate(`/publications/${pub.id}`)}
              className="mt-6 flex cursor-pointer items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-5"
            >
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {t("publicationsPage.viewDetails")}
              </span>

              <ArrowUpRight size={18} className="text-[#317873]" />
            </div>
          </div>
        </div>
      </article>
    </motion.div>
  );
}

function GalleryCard({ item }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const mediaUrl = item.video_embed_url || item.video_url || null;
  const isVideo = item.section === "video" && mediaUrl;

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[#1A2644]">
      {isVideo ? (
        <iframe
          className="h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] w-full"
          src={extractYouTubeEmbed(mediaUrl)}
          title={item.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : item.image_display ? (
        <div className="relative overflow-hidden">
          <img
            src={item.image_display}
            alt={item.title}
            className="h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      ) : (
        <div className="flex h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] w-full items-center justify-center bg-slate-100 text-sm text-slate-500 dark:bg-white/5 dark:text-slate-400">
          {t("publicationsPage.noMedia")}
        </div>
      )}

      <div className="p-5 sm:p-6">
        <p className="text-base sm:text-lg md:text-xl font-semibold leading-snug text-[#091728] dark:text-white text-center">
          {item.year ? `${item.year} – ` : ""}
          {item.title}
        </p>

        {item.caption && (
          <p className="mt-3 text-sm sm:text-base leading-7 text-slate-600 dark:text-slate-300 text-center whitespace-pre-line">
            {item.caption}
          </p>
        )}

        {item.teacher_name && item.teacher_id ? (
          <p
            onClick={() => navigate(`/teachers/${item.teacher_id}`)}
            className="mt-4 cursor-pointer text-center text-sm sm:text-base text-[#317873] dark:text-[#AAF0D1] underline decoration-[#317873]/30 underline-offset-4 transition hover:opacity-90"
          >
            {t("publicationsPage.by")} {item.teacher_name}
          </p>
        ) : (
          <p className="mt-4 text-center text-sm sm:text-base text-[#317873]/80 dark:text-[#AAF0D1]/80 underline decoration-[#317873]/20 underline-offset-4">
            {t("publicationsPage.by")} {item.teacher_name}
          </p>
        )}
      </div>
    </article>
  );
}

export default function PublicationsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("video");
  const [filter, setFilter] = useState("all");
  const [galleryItems, setGalleryItems] = useState([]);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.is_staff;

  const toggleHidden = async (pub) => {
    try {
      const token = localStorage.getItem("access");

      const res = await fetch(`${API_URL}/api/publications/${pub.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_hidden: !pub.is_hidden,
        }),
      });

      if (!res.ok) {
        alert(t("publicationsPage.updateFailed"));
        return;
      }

      setPublications((prev) =>
        prev.map((item) =>
          item.id === pub.id ? { ...item, is_hidden: !item.is_hidden } : item,
        ),
      );
    } catch (err) {
      console.error(err);
      alert(t("publicationsPage.updateFailed"));
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access");

        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [galleryRes, publicationRes] = await Promise.all([
          fetch(`${API_URL}/api/gallery-items/`, { headers }),
          fetch(`${API_URL}/api/publications/`, { headers }),
        ]);

        const galleryData = await galleryRes.json();
        const publicationData = await publicationRes.json();

        setGalleryItems(
          Array.isArray(galleryData) ? galleryData : galleryData.results || [],
        );

        setPublications(
          Array.isArray(publicationData)
            ? publicationData
            : publicationData.results || [],
        );
      } catch (error) {
        console.error("Data yuklanmadi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilter("all");
  }, [activeTab]);

  const activeFilters = useMemo(() => {
    const source =
      activeTab === "publications"
        ? publications
        : galleryItems.filter((item) => item.section === activeTab);

    const years = [
      ...new Set(source.map((item) => item.year).filter(Boolean)),
    ].sort((a, b) => b - a);

    const monthOrder = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];

    const months = [
      ...new Set(source.map((item) => item.month).filter(Boolean)),
    ].sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
    return {
      years,
      months,
    };
  }, [activeTab, publications, galleryItems]);

  const filteredGalleryItems = useMemo(() => {
    let items = galleryItems.filter((item) => item.section === activeTab);

    if (filter.startsWith("year-")) {
      const year = Number(filter.replace("year-", ""));
      items = items.filter((item) => item.year === year);
    }

    if (filter.startsWith("month-")) {
      const month = filter.replace("month-", "");

      items = items.filter((item) => item.month === month);
    }

    return items;
  }, [galleryItems, activeTab, filter]);

  const filteredPublications = useMemo(() => {
    let items = [...publications];

    if (filter.startsWith("year-")) {
      const year = Number(filter.replace("year-", ""));
      items = items.filter((item) => item.year === year);
    }

    if (filter.startsWith("month-")) {
      const month = filter.replace("month-", "");
      items = items.filter((item) => item.month === month);
    }

    return items;
  }, [publications, filter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-[#EEF5F5] px-6 py-20 dark:from-[#081120] dark:via-[#0C1730] dark:to-[#091728]">
        <div className="mx-auto max-w-7xl">
          <div className="h-10 w-56 rounded-full bg-slate-200/80 dark:bg-white/10 animate-pulse" />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-[420px] rounded-3xl bg-slate-200/80 dark:bg-white/10 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-[#EEF5F5] dark:from-[#081120] dark:via-[#0C1730] dark:to-[#091728]">
      <section className="px-6 lg:px-16 pt-8">
        <div className="custom-container relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#081120] via-[#10213D] to-[#16335B] px-6 py-10 text-white shadow-[0_25px_80px_rgba(15,23,42,0.18)] lg:px-16 lg:py-14">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#AAF0D1]/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#317873]/10 blur-3xl" />
          </div>

          <nav className="relative mb-5">
            <ol className="flex flex-wrap items-center text-sm sm:text-base font-medium">
              <li>
                <Link
                  to="/"
                  className="text-[#AAF0D1] transition-all duration-200 hover:text-white"
                >
                  {t("publicationsPage.home")}
                </Link>
              </li>
              <li>
                <span className="mx-2 text-slate-400">›</span>
              </li>
              <li className="text-slate-300">{t("publicationsPage.title")}</li>
            </ol>
          </nav>

          <div className="relative">
            <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
              {t("publicationsPage.title")}
            </h1>

            <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#AAF0D1] via-[#317873] to-transparent" />
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-16 py-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-white/5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3">
            {TAB_OPTIONS.map((tab) => (
              <button
                key={tab.key}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.key
                    ? "bg-[#091728] text-white shadow-md dark:bg-[#AAF0D1] dark:text-[#081120]"
                    : "bg-slate-100 text-slate-700 hover:bg-[#317873]/10 hover:text-[#317873] dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15 dark:hover:text-white"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {t(tab.label)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label
              htmlFor="filter"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              {t("publicationsPage.filterBy")}
            </label>
            <select
              id="filter"
              className="min-w-[180px] rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#317873] focus:ring-2 focus:ring-[#317873]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">{t("publicationsPage.all")}</option>

              {activeFilters.years.map((year) => (
                <option key={`year-${year}`} value={`year-${year}`}>
                  {t("publicationsPage.yearOption", { year })}
                </option>
              ))}

              {activeFilters.months.map((month) => (
                <option key={`month-${month}`} value={`month-${month}`}>
                  {t("publicationsPage.monthOption", {
                    month: t(`publicationsPage.months.${month}`),
                  })}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="content px-6 lg:px-16 pb-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8">
          {activeTab === "video" &&
            filteredGalleryItems.map((item) => (
              <div key={item.id} className="w-full max-w-5xl">
                <GalleryCard item={item} />
              </div>
            ))}

          {activeTab === "photo" &&
            filteredGalleryItems.map((item) => (
              <div key={item.id} className="w-full max-w-5xl">
                <GalleryCard item={item} />
              </div>
            ))}

          {activeTab === "media" &&
            filteredGalleryItems.map((item) => (
              <div key={item.id} className="w-full max-w-5xl">
                <GalleryCard item={item} />
              </div>
            ))}

          {activeTab === "publications" &&
            filteredPublications.map((item) => (
              <div key={item.id} className="w-full max-w-5xl">
                <PublicationCard
                  item={item}
                  isAdmin={isAdmin}
                  toggleHidden={toggleHidden}
                />
              </div>
            ))}

          {activeTab === "video" && filteredGalleryItems.length === 0 && (
            <p className="text-slate-500 dark:text-slate-300">
              {t("publicationsPage.noVideo")}
            </p>
          )}
          {activeTab === "photo" && filteredGalleryItems.length === 0 && (
            <p className="text-slate-500 dark:text-slate-300">
              {t("publicationsPage.noPhoto")}
            </p>
          )}
          {activeTab === "media" && filteredGalleryItems.length === 0 && (
            <p className="text-slate-500 dark:text-slate-300">
              {t("publicationsPage.noMediaItems")}
            </p>
          )}
          {activeTab === "publications" &&
            filteredPublications.length === 0 && (
              <p className="text-slate-500 dark:text-slate-300">
                {t("publicationsPage.noPublications")}
              </p>
            )}
        </div>
      </div>
    </div>
  );
}
