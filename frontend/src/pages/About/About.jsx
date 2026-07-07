import { useTranslation } from "react-i18next";
import BreadcrumbSection from "../../components/BreadcrumbSection";
import HistorySection from "./HistorySection";
import DepartmentHeadSection from "./DepartmentHeadSection";
import MissionSection from "./MissionSection";
import AcademicSection from "./AcademicSection";
function About() {
  const { t } = useTranslation();
  return (
    <div>
      <BreadcrumbSection title={t("about.breadcrumbTitle")} />
      <HistorySection />
      <DepartmentHeadSection />
      <MissionSection />
      <AcademicSection />
    </div>
  );
}

export default About;
