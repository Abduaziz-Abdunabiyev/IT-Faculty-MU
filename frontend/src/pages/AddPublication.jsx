import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../services/adminApi";

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

function AddPublication() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    journal: "",
    year: new Date().getFullYear(),
    month: "",
    description: "",
  });

  const [image, setImage] = useState(null); // cover image (optional)
  const [file, setFile] = useState(null); // PDF (optional)
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const token = localStorage.getItem("access");

    const form = new FormData();
    form.append("title", formData.title);
    form.append("journal", formData.journal);
    form.append("year", formData.year);
    if (formData.month) form.append("month", formData.month);
    form.append("description", formData.description);
    if (image) form.append("image", image);
    if (file) form.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/api/publications/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        // Flatten DRF field errors into a readable message.
        const msg =
          data && typeof data === "object"
            ? Object.entries(data)
                .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
                .join(" | ")
            : "Failed to save publication";
        setError(msg);
        return;
      }

      // Saved — go back to the home page.
      navigate("/");
    } catch (err) {
      setError(err?.message || "Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "border border-slate-300 rounded-lg p-2 w-full outline-none focus:border-[#317873]";

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add Publication</h2>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-600 mb-1">Title *</label>
          <input
            className={inputClass}
            placeholder="Artificial Intelligence in Modern Education Systems"
            required
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">Journal *</label>
          <input
            className={inputClass}
            placeholder="International Journal of Artificial Intelligence"
            required
            value={formData.journal}
            onChange={(e) => handleChange("journal", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Year *</label>
            <input
              type="number"
              className={inputClass}
              placeholder="2026"
              required
              value={formData.year}
              onChange={(e) => handleChange("year", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">Month</label>
            <select
              className={inputClass}
              value={formData.month}
              onChange={(e) => handleChange("month", e.target.value)}
            >
              <option value="">Select...</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">
            Description
          </label>
          <textarea
            className={inputClass}
            rows={6}
            placeholder="Publication haqida qisqacha annotatsiya yoki tavsif yozing..."
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">
            Cover image (JPG, PNG, WEBP — optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1">
            Publication file (PDF only, optional)
          </label>
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-[#317873] text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save Publication"}
        </button>
      </form>
    </div>
  );
}

export default AddPublication;
