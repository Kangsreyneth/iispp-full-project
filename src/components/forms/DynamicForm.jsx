import { useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import RichTextEditor from "./RichTextEditor";
import { isEmail, isUrl, isPhone } from "@/utils/validators";
import { today } from "@/utils/format";

const inputCls = "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-200";

function initialValues(fields, initial) {
  const v = {};
  fields.filter((f) => f.type !== "heading").forEach((f) => {
    const def = f.default === "today" ? today() : f.default;
    let value = initial[f.name] ?? def ?? (f.type === "checkbox" ? false : "");
    if (f.type === "list" && Array.isArray(value)) value = value.join("\n");
    v[f.name] = f.localized
      ? (typeof value === "object" && value ? { en: value.en || "", km: value.km || "" } : { en: value, km: "" })
      : value;
  });
  return v;
}

function cleanValues(fields, values) {
  const out = {};
  fields.filter((f) => f.type !== "heading").forEach((f) => {
    let x = values[f.name];
    if (f.type === "number") x = x === "" || x == null ? null : Number(x);
    else if (f.type === "list") x = typeof x === "string" ? x.split("\n").map((item) => item.trim()).filter(Boolean) : x;
    else if (typeof x === "string") x = x.trim();
    if (x !== undefined) out[f.name] = x;
  });
  return out;
}

function validate(fields, values) {
  const errors = {};
  fields.filter((f) => f.type !== "heading").forEach((f) => {
    const x = f.localized ? values[f.name]?.en : values[f.name];
    const empty = x === "" || x == null;
    if (f.required && f.type !== "checkbox" && (empty || (typeof x === "string" && !x.trim()))) return (errors[f.name] = `${f.label} is required`);
    if (empty) return;
    if (f.max && String(x).length > f.max) errors[f.name] = `Maximum ${f.max} characters`;
    if (f.type === "email" && !isEmail(x)) errors[f.name] = "Enter a valid email address";
    if (f.type === "url" && !isUrl(x)) errors[f.name] = "Enter a full link starting with https://";
    if (f.type === "tel" && !isPhone(x)) errors[f.name] = "Enter a valid phone number";
    if (f.type === "number") {
      const n = Number(x);
      if (isNaN(n)) errors[f.name] = "Must be a number";
      else if (f.min !== undefined && n < f.min) errors[f.name] = `Must be at least ${f.min}`;
    }
  });
  return errors;
}

/** Renders any list of field definitions (see src/config/resources.js). */
export default function DynamicForm({ fields, initial = {}, onSubmit, onCancel, submitLabel = "Save" }) {
  const [values, setValues] = useState(() => initialValues(fields, initial));
  const [language, setLanguage] = useState("en");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(0);
  const set = (name, v) => setValues((s) => ({ ...s, [name]: v }));
  const localizedFields = fields.filter((field) => field.localized);
  const hasKhmerMissing = localizedFields.some((field) => !values[field.name]?.km?.trim());

  async function submit(e) {
    e.preventDefault();
    const errs = validate(fields, values);
    setErrors(errs);
    if (Object.keys(errs).length) return toast.error("Please fix the highlighted fields");
    setSaving(true);
    try { await onSubmit(cleanValues(fields, values)); }
    catch (err) { toast.error(err.code === "permission-denied" ? "You do not have permission to do this" : err.message || "Could not save"); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      {localizedFields.length > 0 && <div className="col-span-full flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div><p className="text-sm font-semibold text-slate-700">Content language</p><p className="text-xs text-slate-500">Enter English and Khmer content separately.</p></div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg bg-white p-1 ring-1 ring-slate-200" role="tablist" aria-label="Content language">
            {[['en', 'EN'], ['km', 'KH']].map(([code, label]) => <button key={code} type="button" role="tab" aria-selected={language === code} onClick={() => setLanguage(code)} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${language === code ? "bg-brand-700 text-white" : "text-slate-600 hover:bg-slate-100"}`}>{label}</button>)}
          </div>
          {hasKhmerMissing && <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">Khmer missing</span>}
        </div>
      </div>}
      {fields.map((f, i) => {
        if (f.type === "heading")
          return <h3 key={i} className="col-span-full mt-2 border-b pb-1 font-display text-lg font-bold text-brand-800">{f.label}</h3>;
        const err = errors[f.name];
        const span = f.half ? "" : "sm:col-span-2";
        return (
          <div key={f.name} className={span}>
            {f.type === "checkbox" ? (
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={!!values[f.name]} onChange={(e) => set(f.name, e.target.checked)} className="h-4 w-4 accent-brand-700" /> {f.label}
              </label>
            ) : (
              <label className="block text-sm font-medium text-slate-700">
                {f.label} {f.localized && <span className="ml-1 text-xs font-normal uppercase text-slate-400">{language}</span>} {f.required && <span className="text-red-600">*</span>}
                {f.localized && language === "en" && !values[f.name]?.km?.trim() && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">Khmer missing</span>}
                {f.localized ? (
                  f.type === "richtext" ? <RichTextEditor value={values[f.name]?.[language] || ""} onChange={(value) => set(f.name, { ...values[f.name], [language]: value })} rows={f.rows || 8} lang={language} /> :
                  f.type === "textarea" ? <textarea rows={f.rows || 4} value={values[f.name]?.[language] || ""} onChange={(e) => set(f.name, { ...values[f.name], [language]: e.target.value })} className={`${inputCls} ${language === "km" ? "[font-family:'Noto_Sans_Khmer',sans-serif] leading-relaxed" : ""}`} placeholder={f.placeholder} /> :
                  <input type={f.type || "text"} value={values[f.name]?.[language] || ""} onChange={(e) => set(f.name, { ...values[f.name], [language]: e.target.value })} className={`${inputCls} ${language === "km" ? "[font-family:'Noto_Sans_Khmer',sans-serif] leading-relaxed" : ""}`} placeholder={f.placeholder} />
                ) : f.type === "textarea" || f.type === "list" ? (
                  <textarea rows={f.rows || 4} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} className={inputCls} placeholder={f.placeholder} />
                ) : f.type === "richtext" ? (
                  <RichTextEditor value={values[f.name] || ""} onChange={(value) => set(f.name, value)} rows={f.rows || 8} />
                ) : f.type === "select" ? (
                  <select value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} className={inputCls}>
                    {!f.required && <option value="">—</option>}
                    {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : f.type === "image" ? (
                  <div className="mt-1 font-normal"><ImageUpload value={values[f.name]} onChange={(u) => set(f.name, u)} folder={f.folder} onBusy={(d) => setBusy((b) => b + d)} /></div>
                ) : (
                  <input type={f.type || "text"} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} className={inputCls} placeholder={f.placeholder} min={f.min} step={f.type === "number" ? "any" : undefined} />
                )}
              </label>
            )}
            {f.help && !err && <p className="mt-1 text-xs text-slate-500">{f.help}</p>}
            {err && <p className="mt-1 text-xs text-red-600" role="alert">{err}</p>}
          </div>
        );
      })}
      <div className="col-span-full mt-2 flex justify-end gap-2 border-t pt-4">
        {onCancel && <Button variant="ghost" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" loading={saving || busy > 0}>{busy > 0 ? "Uploading image…" : submitLabel}</Button>
      </div>
    </form>
  );
}
