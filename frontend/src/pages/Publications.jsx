import { useTranslation } from "react-i18next";

function Publications() {
  const { t } = useTranslation();

  return <div className="py-20">{t("publicationsPage.stub")}</div>;
}

export default Publications;
