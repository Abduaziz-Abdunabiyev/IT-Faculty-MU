import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../lib/api";

function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/accounts/password-reset/", {
        email: email.trim(),
      });

      setSuccess(res.data?.detail || t("forgotPassword.successDefault"));
      setEmail("");
    } catch (err) {
      const message =
        err.response?.data?.email?.[0] ||
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        t("forgotPassword.errorDefault");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#317873] via-[#255c57] to-[#173c38] px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
        <h2 className="mb-2 text-center text-3xl font-bold text-[#317873]">
          {t("forgotPassword.title")}
        </h2>
        <p className="mb-6 text-center text-sm text-slate-500">
          {t("forgotPassword.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {t("forgotPassword.emailLabel")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("forgotPassword.emailPlaceholder")}
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-[#317873] focus:ring-2 focus:ring-[#317873]/10"
              autoComplete="email"
            />
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
            {loading ? t("forgotPassword.sending") : t("forgotPassword.submit")}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-600">
          <Link to="/login" className="text-[#317873] hover:underline">
            {t("forgotPassword.backToLogin")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
