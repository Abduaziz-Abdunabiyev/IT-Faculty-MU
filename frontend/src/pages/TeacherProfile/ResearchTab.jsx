import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";

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
        {researchList.map((research) => {
          const content = (
            <>
              {research.image_display ? (
                <img
                  src={research.image_display}
                  alt={research.project_title}
                  className="mb-3 h-40 w-full rounded object-cover"
                />
              ) : null}

              <div className="flex items-start justify-between gap-3">
                <h4 className="font-semibold text-[#317873]">
                  {research.project_title}
                </h4>
                {research.link ? (
                  <ExternalLink
                    size={18}
                    className="mt-1 shrink-0 text-[#317873]"
                  />
                ) : null}
              </div>

              <p className="text-gray-500">
                {research.start_year} — {research.end_year}
              </p>

              <p className="mt-2 text-gray-700">{research.description}</p>
            </>
          );

          return research.link ? (
            <a
              key={research.id}
              href={research.link}
              target="_blank"
              rel="noreferrer"
              className="block border p-4 rounded bg-gray-50 transition hover:border-[#317873] hover:shadow-md dark:bg-[#0B1120]"
            >
              {content}
            </a>
          ) : (
            <div
              key={research.id}
              className="border p-4 rounded bg-gray-50 dark:bg-[#0B1120]"
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ResearchTab;
