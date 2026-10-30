import { useState } from "react";
import { MapPin, Phone, Mail, Clock, CheckCircle2, User, MessageSquare } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import MapEmbed from "@/components/ui/MapEmbed";
import Button from "@/components/ui/Button";
import TextField from "@/components/forms/TextField";
import { useLang } from "@/hooks/useLang";
import { useSettings } from "@/hooks/useSettings";
import messageService from "@/services/messageService";
import { isEmail } from "@/utils/validators";

export default function Contact() {
  const { t } = useLang();
  const { settings: s } = useSettings();
  const [f, setF] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle"); // idle | sending | sent | failed
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    const err = {};
    if (f.name.trim().length < 2) err.name = t("pleaseEnterName");
    if (!isEmail(f.email)) err.email = t("validEmail");
    if (f.message.trim().length < 10) err.message = t("messageMin");
    setErrors(err);
    if (Object.keys(err).length) return;
    setState("sending");
    try {
      await messageService.create({ name: f.name.trim(), email: f.email.trim(), subject: f.subject.trim(), message: f.message.trim(), status: "new" });
      setState("sent");
    } catch { setState("failed"); }
  }

  const info = [[MapPin, t("address"), s.address], [Phone, t("phone"), s.phone], [Mail, t("email"), s.email], [Clock, t("officeHours"), s.hours]].filter((i) => i[2]);
  return (
    <>
      <PageHeader title={t("contact")} subtitle={t("contactIntro")} crumbs={[[t("contact")]]} />
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          {info.map(([Icon, label, value]) => (
            <div key={label} className="flex gap-4 rounded-xl border bg-white p-5 transition hover:border-brand-300 hover:shadow-md">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-700 text-white"><Icon className="h-5 w-5" /></span>
              <div><p className="text-xs uppercase tracking-wide text-slate-500">{label}</p><p className="font-medium text-slate-800">{value}</p></div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-5 font-display text-2xl font-bold text-brand-800">{t("sendMessage")}</h2>
          {state === "sent" ? (
            <div className="py-10 text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" /><p className="mt-3 text-lg font-semibold">{t("thankYou")}</p><p className="text-slate-500">{t("replySoon")}</p></div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
              <TextField label={t("name")} icon={User} value={f.name} onChange={set("name")} error={errors.name} />
              <TextField label={t("email")} icon={Mail} type="email" value={f.email} onChange={set("email")} error={errors.email} />
              <div className="sm:col-span-2"><TextField label={t("subject")} icon={MessageSquare} value={f.subject} onChange={set("subject")} /></div>
              <label className="block text-sm font-medium text-slate-700 sm:col-span-2">{t("message")}
                <textarea rows={5} value={f.message} onChange={set("message")} className={`mt-1 w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${errors.message ? "border-red-400 focus:ring-red-200" : "border-slate-300 focus:border-brand-600 focus:ring-brand-200"}`} />
                {errors.message && <span className="text-xs text-red-600" role="alert">{errors.message}</span>}
              </label>
              {state === "failed" && <p className="text-sm text-red-600 sm:col-span-2" role="alert">{t("messageFailed")}</p>}
              <div className="sm:col-span-2"><Button type="submit" size="lg" loading={state === "sending"}>{t("send")}</Button></div>
            </form>
          )}
        </div>
      </div>
      <div className="container-page"><MapEmbed lat={s.lat} lng={s.lng} height="h-96" label={t("directions")} /></div>
    </>
  );
}
