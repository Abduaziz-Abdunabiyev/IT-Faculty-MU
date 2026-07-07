import { useTranslation } from "react-i18next";

import BreadcrumbSection from "../../components/BreadcrumbSection";
import TeachersGrid from "./TeachersGrid";

function Teachers() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Breadcrumb */}
      <BreadcrumbSection title={t("teachersPage.breadcrumbTitle")} />
      <TeachersGrid />
    </div>
  );
}

export default Teachers;
