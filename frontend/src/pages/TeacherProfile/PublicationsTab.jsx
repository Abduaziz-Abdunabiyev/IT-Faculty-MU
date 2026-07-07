import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_BASE } from "../../services/adminApi";

function PublicationsTab({ teacherId }) {
  const { t } = useTranslation();
  const BASE_URL = API_BASE;
  const navigate = useNavigate();

  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const isOwnProfile =
    currentUser?.teacher_id &&
    Number(currentUser.teacher_id) === Number(teacherId);

  useEffect(() => {
    fetch(`${BASE_URL}/api/publications/?teacher=${teacherId}`)
      .then((res) => res.json())
      .then((data) => {
        setPublications(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [teacherId]);

  // 🔥 LOADING
  if (loading) {
    return <p className="text-center p-6">{t("profile.publications.loading")}</p>;
  }

  return (
    <div>
      {/* 🔥 TOP ACTION */}
      {isOwnProfile && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => navigate("/add-publication")}
            className="rounded-xl bg-[#317873] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#255c57]"
          >
            {t("profile.publications.add")}
          </button>
        </div>
      )}

      {/* 🔥 EMPTY */}
      {publications.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            {t("profile.publications.empty")} 📄
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publications.map((pub) => (
            <div
              key={pub.id}
              className="bg-white p-4 rounded shadow hover:shadow-lg dark:bg-[#0B1120]"
            >
              <h3 className="font-semibold text-lg">
                {pub.year} — {pub.title}
              </h3>

              <p
                className="text-gray-500 cursor-pointer underline"
                onClick={() => navigate(`/publications/${pub.id}`)}
              >
                {t("profile.publications.viewDetails")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PublicationsTab;
