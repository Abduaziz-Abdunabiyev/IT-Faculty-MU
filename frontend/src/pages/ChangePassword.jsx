import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import api from "../lib/api";

function ChangePassword() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const currentUser = useMemo(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }, []);

  const isFirstLogin = !!currentUser?.must_change_password;

  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    old_password: false,
    new_password: false,
    confirm_password: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = isFirstLogin
        ? {
            new_password: formData.new_password,
            confirm_password: formData.confirm_password,
          }
        : formData;

      const res = await api.post("/accounts/change-password/", payload);
      const data = res.data;

      setSuccess(data.detail || t("changePassword.successDefault"));

      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          must_change_password: false,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setTimeout(() => {
        if (currentUser?.role === "admin" || currentUser?.is_staff) {
          navigate("/admin-dashboard");
        } else if (
          currentUser?.role === "teacher" ||
          currentUser?.teacher_id
        ) {
          // The teacher's dashboard is their own profile page. There is no
          // "/teacher-dashboard" route, so send them to /teachers/:id.
          navigate(
            currentUser?.teacher_id
              ? `/teachers/${currentUser.teacher_id}`
              : "/teachers",
          );
        } else {
          navigate("/");
        }
      }, 800);
    } catch (err) {
      console.log("CHANGE PASSWORD ERROR:", err.response?.data);

      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.response?.data?.old_password?.[0] ||
        err.response?.data?.new_password?.[0] ||
        err.response?.data?.confirm_password?.[0] ||
        t("changePassword.errorDefault");

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 p-3 pr-12 outline-none focus:border-[#317873] focus:ring-2 focus:ring-[#317873]/10";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-[#317873] via-[#255c57] to-[#173c38] px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
        <h2 className="mb-2 text-center text-3xl font-bold text-[#317873]">
          {isFirstLogin
            ? t("changePassword.setTitle")
            : t("changePassword.changeTitle")}
        </h2>

        <p className="mb-6 text-center text-sm text-slate-500">
          {isFirstLogin
            ? t("changePassword.firstLoginSubtitle")
            : t("changePassword.changeSubtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isFirstLogin && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {t("changePassword.oldPassword")}
              </label>
              <div className="relative">
                <input
                  type={showPasswords.old_password ? "text" : "password"}
                  name="old_password"
                  value={formData.old_password}
                  onChange={handleChange}
                  placeholder={t("changePassword.oldPassword")}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => togglePassword("old_password")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  aria-label={
                    showPasswords.old_password
                      ? t("changePassword.hideOldPassword")
                      : t("changePassword.showOldPassword")
                  }
                >
                  {showPasswords.old_password ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {t("changePassword.newPassword")}
            </label>
            <div className="relative">
              <input
                type={showPasswords.new_password ? "text" : "password"}
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                placeholder={t("changePassword.newPassword")}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => togglePassword("new_password")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                aria-label={
                  showPasswords.new_password
                    ? t("changePassword.hideNewPassword")
                    : t("changePassword.showNewPassword")
                }
              >
                {showPasswords.new_password ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {t("changePassword.confirmPassword")}
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm_password ? "text" : "password"}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder={t("changePassword.confirmPassword")}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => togglePassword("confirm_password")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                aria-label={
                  showPasswords.confirm_password
                    ? t("changePassword.hideConfirmPassword")
                    : t("changePassword.showConfirmPassword")
                }
              >
                {showPasswords.confirm_password ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#317873] py-3 font-medium text-white transition hover:bg-[#255c57] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? t("changePassword.saving") : t("changePassword.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
