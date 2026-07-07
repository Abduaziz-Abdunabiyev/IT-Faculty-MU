import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  clearAuthTokens,
  setAccessToken,
  setRefreshToken,
} from "../services/adminApi";
import { API_BASE } from "../services/adminApi";

const BASE_URL = API_BASE;

function Login() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      clearAuthTokens();

      const tokenRes = await fetch(`${BASE_URL}/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const tokenData = await tokenRes.json().catch(() => ({}));

      if (!tokenRes.ok) {
        const message =
          tokenData.detail ||
          tokenData.message ||
          tokenData.non_field_errors?.[0] ||
          t("login.loginFailed");
        throw new Error(message);
      }

      const access = tokenData?.access;
      const refresh = tokenData?.refresh;

      if (!access || !refresh) {
        throw new Error(t("login.tokenError"));
      }

      const userRes = await fetch(`${BASE_URL}/api/accounts/me/`, {
        headers: {
          Authorization: `Bearer ${access}`,
          Accept: "application/json",
        },
      });

      const userData = await userRes.json().catch(() => ({}));

      if (!userRes.ok) {
        const message =
          userData.detail ||
          userData.message ||
          t("login.userDataError");
        throw new Error(message);
      }

      setAccessToken(access);
      setRefreshToken(refresh);
      localStorage.setItem("token", access);
      localStorage.setItem("user", JSON.stringify(userData));

      login(userData, { access, refresh });

      if (userData.must_change_password) {
        navigate("/change-password");
        return;
      }

      if (userData.is_staff || userData.role === "admin") {
        navigate("/admin-dashboard");
      } else if (userData.teacher_id || userData.role === "teacher") {
        navigate(`/teachers/${userData.teacher_id}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      clearAuthTokens();
      setError(err.message || t("login.serverError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-[#317873] via-[#255c57] to-[#173c38] px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 text-center text-3xl font-bold text-[#317873]">
          {t("login.title")}
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {t("login.username")}
            </label>
            <input
              type="text"
              placeholder={t("login.username")}
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-[#317873] focus:ring-2 focus:ring-[#317873]/10"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {t("login.password")}
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t("login.password")}
                className="w-full rounded-lg border border-slate-300 p-3 pr-12 outline-none focus:border-[#317873] focus:ring-2 focus:ring-[#317873]/10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                aria-label={
                  showPassword
                    ? t("login.hidePassword")
                    : t("login.showPassword")
                }
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Link
              to="/forgot-password"
              className="mt-2 inline-block text-sm text-[#317873] hover:underline"
            >
              {t("login.forgotPassword")}
            </Link>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-[#317873] py-3 font-medium text-white transition hover:bg-[#255c57] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? t("login.loading") : t("login.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
