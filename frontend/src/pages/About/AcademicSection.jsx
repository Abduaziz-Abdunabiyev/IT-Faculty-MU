import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { API_BASE } from "../../services/adminApi";

function AcademicSection() {
  const { t } = useTranslation();
  const [lecturers, setLecturers] = useState(0);
  const [instructors, setInstructors] = useState(0);
  const [phdCount, setPhdCount] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE}/api/teachers/`)
      .then((res) => res.json())
      .then((data) => {
        const teachers = data.results.filter((t) => t.is_active);

        const lecturerCount = teachers.filter(
          (t) => t.position && t.position.toLowerCase().includes("lecturer"),
        ).length;

        const instructorCount = teachers.filter(
          (t) => t.position && t.position.toLowerCase().includes("instructor"),
        ).length;

        const phdCounter = teachers.filter(
          (t) =>
            t.position &&
            (t.position.toLowerCase().includes("phd") ||
              t.position.toLowerCase().includes("dsc")),
        ).length;

        setLecturers(lecturerCount);
        setInstructors(instructorCount);
        setPhdCount(phdCounter);
        setTotalTeachers(teachers.length);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="relative py-20 font-poppins">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-slate-50 to-[#EEF5F5] dark:from-[#081120] dark:via-[#0C1730] dark:to-[#091728]" />

      <div className="container-custom px-4">
        <div
          className="
          relative
          overflow-hidden
          rounded-[32px]
          border
          border-slate-200/70
          bg-white/80
          p-8
          sm:p-10
          md:p-14
          shadow-[0_20px_60px_rgba(15,23,42,0.06)]
          backdrop-blur
          dark:border-white/10
          dark:bg-white/5
        "
        >
          {/* Decorative */}
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#317873]/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-[#AAF0D1]/10 blur-3xl" />

          {/* Badge */}
          <div className="relative z-10 inline-flex items-center rounded-full border border-[#B69B83]/25 bg-[#F7F8FA] px-4 py-2 text-xs sm:text-sm font-medium text-[#7A644F] shadow-sm dark:bg-white/5 dark:text-[#AAF0D1]">
            {t("about.academic.badge")}
          </div>

          {/* Title */}
          <h2
            className="
            relative
            z-10
            mt-6
            text-3xl
            sm:text-4xl
            md:text-5xl
            font-semibold
            tracking-tight
            text-[#091728]
            dark:text-[#AAF0D1]
            leading-tight
            animate-slide-left
          "
          >
            {t("about.academic.title")}
          </h2>

          <div className="relative z-10 mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#317873] via-[#AAF0D1] to-transparent" />

          {/* Content */}
          <div
            className="
            relative
            z-10
            mt-8
            space-y-6
            animate-fade-up
          "
          >
            {/* Paragraph 1 */}
            <p
              className="
              text-sm
              sm:text-base
              md:text-[17px]
              text-slate-600
              dark:text-slate-300
              leading-7
              sm:leading-8
              font-noto
            "
            >
              {t("about.academic.p1.lead")}
              <span className="font-semibold text-[#317873] dark:text-[#AAF0D1]">
                {" "}
                {t("about.academic.p1.educators", { value: totalTeachers })}
              </span>
              {t("about.academic.p1.including")}
              <span className="font-semibold text-[#317873] dark:text-[#AAF0D1]">
                {" "}
                {t("about.academic.p1.phd", { value: phdCount })}
              </span>
              {t("about.academic.p1.tail")}
            </p>

            {/* Paragraph 2 */}
            <p
              className="
              text-sm
              sm:text-base
              md:text-[17px]
              text-slate-600
              dark:text-slate-300
              leading-7
              sm:leading-8
              font-noto
            "
            >
              {t("about.academic.p2.among")}
              <span className="font-semibold text-[#317873] dark:text-[#AAF0D1]">
                {" "}
                {t("about.academic.p2.lecturers", { value: lecturers })}
              </span>
              {t("about.academic.p2.focus")}
              <em>{t("about.academic.p2.latin")}</em>
              {t("about.academic.p2.while")}
              <span className="font-semibold text-[#317873] dark:text-[#AAF0D1]">
                {" "}
                {t("about.academic.p2.instructors", { value: instructors })}
              </span>
              {t("about.academic.p2.specialize")}
              <em>{t("about.academic.p2.english")}</em>
              {t("about.academic.p2.strengthen")}
            </p>

            {/* Paragraph 3 */}
            <p
              className="
              text-sm
              sm:text-base
              md:text-[17px]
              text-slate-600
              dark:text-slate-300
              leading-7
              sm:leading-8
              font-noto
            "
            >
              {t("about.academic.p3")}
            </p>

            {/* Paragraph 4 */}
            <p
              className="
              text-sm
              sm:text-base
              md:text-[17px]
              text-slate-600
              dark:text-slate-300
              leading-7
              sm:leading-8
              font-noto
            "
            >
              {t("about.academic.p4")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AcademicSection;
