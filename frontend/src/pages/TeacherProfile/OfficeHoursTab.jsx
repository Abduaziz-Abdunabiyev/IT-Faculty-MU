import { useState } from "react";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { API_BASE } from "../../services/adminApi";

function OfficeHoursTab({ officeHours = [], isOwner = false }) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    day: "monday",
    start_time: "",
    end_time: "",
  });
  const [editingItem, setEditingItem] = useState(null);
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("access");

      const url = editingItem
        ? `${API_BASE}/api/office-hours/${editingItem.id}/`
        : `${API_BASE}/api/office-hours/`;

      const method = editingItem ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data);

        Swal.fire({
          icon: "error",
          title: t("profile.officeHours.alerts.errorTitle"),
          text: t("profile.officeHours.alerts.saveFailed"),
        });

        return;
      }

      Swal.fire({
        icon: "success",
        title: editingItem
          ? t("profile.officeHours.alerts.updated")
          : t("profile.officeHours.alerts.added"),
        timer: 1200,
        showConfirmButton: false,
      });

      setEditingItem(null);
      setShowModal(false);

      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: t("profile.officeHours.alerts.deleteConfirmTitle"),
      text: t("profile.officeHours.alerts.deleteConfirmText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: t("profile.officeHours.delete"),
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("access");

      const response = await fetch(`${API_BASE}/api/office-hours/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error();
      }

      Swal.fire({
        icon: "success",
        title: t("profile.officeHours.alerts.deleted"),
        timer: 1200,
        showConfirmButton: false,
      });

      window.location.reload();
    } catch {
      Swal.fire({
        icon: "error",
        title: t("profile.officeHours.alerts.deleteFailed"),
      });
    }
  };
  return (
    <>
      <section className="bg-white dark:bg-[#111827] rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="text-xl font-bold mb-6 dark:text-white">
              {editingItem
                ? t("profile.officeHours.editTitle")
                : t("profile.officeHours.addTitle")}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {t("profile.officeHours.subtitle")}
            </p>
          </div>

          {isOwner && (
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 rounded-xl bg-[#317873] hover:bg-[#285f5b] text-white font-medium transition-all"
            >
              {t("profile.officeHours.add")}
            </button>
          )}
        </div>

        <div className="p-6">
          {officeHours.length > 0 ? (
            <div className="grid gap-4">
              {officeHours.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-5 transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold capitalize text-slate-900 dark:text-white">
                        {item.day}
                      </h4>

                      <p className="mt-1 text-slate-500 dark:text-slate-400">
                        🕒 {item.start_time?.slice(0, 5)} -{" "}
                        {item.end_time?.slice(0, 5)}
                      </p>
                    </div>

                    {isOwner && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingItem(item);

                            setFormData({
                              day: item.day,
                              start_time: item.start_time.slice(0, 5),
                              end_time: item.end_time.slice(0, 5),
                            });

                            setShowModal(true);
                          }}
                        >
                          {t("profile.officeHours.edit")}
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-4 py-2 rounded-xl border border-red-300 text-red-600"
                        >
                          {t("profile.officeHours.delete")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 py-16 text-center">
              <div className="text-5xl mb-3">🕒</div>

              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t("profile.officeHours.emptyTitle")}
              </h4>

              <p className="text-slate-500 mt-2">
                {t("profile.officeHours.emptySubtitle")}
              </p>
            </div>
          )}
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-6 dark:text-white">
              {t("profile.officeHours.addTitle")}
            </h3>

            <div className="space-y-4">
              <select
                value={formData.day}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    day: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3"
              >
                <option value="monday">
                  {t("profile.officeHours.days.monday")}
                </option>
                <option value="tuesday">
                  {t("profile.officeHours.days.tuesday")}
                </option>
                <option value="wednesday">
                  {t("profile.officeHours.days.wednesday")}
                </option>
                <option value="thursday">
                  {t("profile.officeHours.days.thursday")}
                </option>
                <option value="friday">
                  {t("profile.officeHours.days.friday")}
                </option>
                <option value="saturday">
                  {t("profile.officeHours.days.saturday")}
                </option>
              </select>

              <input
                type="time"
                value={formData.start_time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    start_time: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3"
              />

              <input
                type="time"
                value={formData.end_time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    end_time: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl border"
              >
                {t("profile.officeHours.cancel")}
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-[#317873] hover:bg-[#285f5b] text-white"
              >
                {t("profile.officeHours.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OfficeHoursTab;
