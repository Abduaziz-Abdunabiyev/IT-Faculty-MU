import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer
      className="
        w-full
        bg-[#1A2644]
        dark:bg-gray-950
        text-white
        font-jost
        pt-16
        pb-6
        px-4
        md:px-10
        transition-colors
        duration-300
      "
    >
      <div className="max-w-screen-xl mx-auto">
        {/* 🔥 GRID ishlatyapmiz */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Left */}
          <div>
            <h2 className="text-3xl text-button font-bold font-playfair mb-3">
              IT Department
            </h2>

            <p className="text-[18px] mb-3">{t("footer.university")}</p>

            <p className="text-[17px] mb-3">📞 +998 90 123 45 67</p>

            <p className="text-[17px] mb-3">✉️ info@itfaculty.uz</p>

            <p className="text-[17px] mb-4">📍 {t("footer.address")}</p>

            {/* Social icons */}
            <div className="flex gap-4 mt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <img
                  src="/images/facebook.png"
                  alt="Facebook"
                  className="w-6 h-6 hover:opacity-80 cursor-pointer"
                />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
              >
                <img
                  src="/images/twitter.png"
                  alt="Twitter"
                  className="w-6 h-6 hover:opacity-80 cursor-pointer"
                />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <img
                  src="/images/instagram.png"
                  alt="Instagram"
                  className="w-6 h-6 hover:opacity-80 cursor-pointer"
                />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <img
                  src="/images/linkedin.png"
                  alt="LinkedIn"
                  className="w-6 h-6 hover:opacity-80 cursor-pointer"
                />
              </a>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-[24px] font-semibold mb-4">
              {t("footer.aboutTitle")}
            </h3>

            <ul className="space-y-3 text-[16px]">
              <li>
                <Link to="/about" className="hover:underline">
                  {t("footer.aboutFaculty")}
                </Link>
              </li>

              <li>
                <Link to="/about" className="hover:underline">
                  {t("footer.ourVision")}
                </Link>
              </li>

              <li>
                <Link to="/about" className="hover:underline">
                  {t("footer.accreditation")}
                </Link>
              </li>

              <li>
                <Link to="/about" className="hover:underline">
                  {t("footer.privacy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-[24px] font-semibold mb-4">
              {t("footer.coursesTitle")}
            </h3>

            <ul className="space-y-3 text-[16px]">
              <li>
                <Link
                  to="/category/web-development"
                  className="hover:underline"
                >
                  {t("footer.frontend")}
                </Link>
              </li>

              <li>
                <Link to="/category/data-science" className="hover:underline">
                  {t("footer.dataScience")}
                </Link>
              </li>

              <li>
                <Link
                  to="/category/artificial-intelligence"
                  className="hover:underline"
                >
                  {t("footer.aiml")}
                </Link>
              </li>

              <li>
                <Link to="/category/cyber-security" className="hover:underline">
                  {t("footer.cyber")}
                </Link>
              </li>
            </ul>
          </div>

          {/* 🔥 Support endi yonida chiqadi */}
          <div>
            <h3 className="text-[24px] font-semibold mb-4">
              {t("footer.supportTitle")}
            </h3>

            <ul className="space-y-3 text-[16px]">
              <li>
                <Link to="/about" className="hover:underline">
                  {t("footer.faqs")}
                </Link>
              </li>

              <li>
                <Link to="/about" className="hover:underline">
                  {t("footer.admission")}
                </Link>
              </li>

              <li>
                <Link to="/about" className="hover:underline">
                  {t("footer.internships")}
                </Link>
              </li>

              <li>
                <Link to="/about" className="hover:underline">
                  {t("footer.contactUs")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-10 pt-8">
          <p className="text-center text-sm text-white/70">
            © 2026 IT Department — {t("footer.university")}. {t("footer.rights")}
          </p>

          <div className="mt-5 flex justify-center">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-[0.35em] text-white/25">
                {t("footer.designedBy")}
              </div>

              <div
                className="
          mt-2
          text-[15px]
          md:text-[16px]
          font-light
          text-[#D8C5A8]
          tracking-wide
        "
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Shahodat Abdunabiyeva
                <span className="mx-3 text-white/20">•</span>
                Gulmira Ilyasova
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
