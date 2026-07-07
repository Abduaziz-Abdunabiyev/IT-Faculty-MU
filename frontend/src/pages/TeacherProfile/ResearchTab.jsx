import { useTranslation } from "react-i18next";

function ResearchTab({ researchList }) {
  const { t } = useTranslation();

  if (!researchList || researchList.length === 0) {
    return <p className="text-gray-500">{t("profile.research.empty")}</p>;
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6">
        {t("profile.research.title")}
      </h3>

      <div className="space-y-6">
        {researchList.map((research) => (
          <div
            key={research.id}
            className="border p-4 rounded bg-gray-50 dark:bg-[#0B1120]"
          >
            <h4 className="font-semibold text-[#317873]">
              {research.project_title}
            </h4>

            <p className="text-gray-500">
              {research.start_year} — {research.end_year}
            </p>

            <p className="mt-2 text-gray-700">{research.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResearchTab;
