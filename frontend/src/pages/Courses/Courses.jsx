import { useTranslation } from "react-i18next";
import BreadcrumbSection from "../../components/BreadcrumbSection";
import CoursesGrid from "./CoursesGrid";

function Courses() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Breadcrumb */}
      <BreadcrumbSection title={t("coursesPage.breadcrumbTitle")} />
      <CoursesGrid />
    </div>
  );
}

export default Courses;
