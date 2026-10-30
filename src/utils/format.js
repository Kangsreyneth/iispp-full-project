export const toDate = (v) => (v?.toDate ? v.toDate() : v ? new Date(v) : null);

export function formatDate(v, opts = { day: "numeric", month: "short", year: "numeric" }) {
  const d = toDate(v);
  return d && !isNaN(d) ? d.toLocaleDateString("en-GB", opts) : "";
}
export const dayOf = (v) => formatDate(v, { day: "2-digit" });
export const monthOf = (v) => formatDate(v, { month: "short" });

export const today = () => new Date().toISOString().slice(0, 10);
export const byDateDesc = (a, b) => String(b.date || "").localeCompare(String(a.date || ""));
export const byDateAsc = (a, b) => String(a.date || "").localeCompare(String(b.date || ""));
export const byOrder = (a, b) =>
  (a.order ?? 999) - (b.order ?? 999) || String(a.name || a.title || "").localeCompare(String(b.name || b.title || ""));

export const truncate = (s = "", n = 120) => (s.length > n ? s.slice(0, n).trimEnd() + "…" : s);
export const initials = (name = "") => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
