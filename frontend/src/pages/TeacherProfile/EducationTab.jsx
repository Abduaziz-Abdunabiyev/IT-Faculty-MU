import { useTranslation } from "react-i18next";

function EducationTab({ educations }) {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        {t("profile.education.title")}
      </h2>

      {educations.length === 0 && (
        <p className="text-gray-500">{t("profile.education.empty")}</p>
      )}

      <div className="space-y-6">
        {educations.map((edu) => (
          <div
            key={edu.id}
            className="p-4 rounded-lg border bg-gray-50 dark:bg-[#0B1120]"
          >
            <h3 className="font-semibold text-[#317873]">
              {edu.degree_display} — {edu.field_of_study}
            </h3>

            <p className="text-gray-700 dark:text-white">{edu.institution}</p>

            <p className="text-sm text-gray-500 dark:text-white">
              {edu.start_year} — {edu.end_year || t("profile.education.present")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EducationTab;
