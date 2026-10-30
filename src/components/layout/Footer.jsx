import { Link } from "react-router-dom";
import { Facebook } from "@/components/ui/BrandIcons";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import logo from "@/assets/logos/logo-full.png";
import { useLang } from "@/hooks/useLang";
import { useSettings } from "@/hooks/useSettings";
import { BRAND } from "@/utils/constants";

export default function Footer() {
  const { t } = useLang();
  const { settings } = useSettings();
  const groups = [
    { title: t("aboutIispp"), links: [["/about", t("overview")], ["/faculty", t("faculty")], ["/contact", t("contact")]] },
    { title: t("academics"), links: [["/academics", t("programs")], ["/admissions", t("admissions")], ["/research", t("research")], ["/centers", t("researchCenters")]] },
    { title: t("newsEvents"), links: [["/news", t("news")], ["/events", t("events")]] },
  ];

  return (
    <footer className="mt-16 bg-brand-700 text-white">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_0.85fr_1.2fr] lg:gap-10 lg:py-16">
        <div>
          <Link to="/" aria-label="IISPP home" className="inline-flex bg-white p-2"><img src={logo} alt={BRAND.name} className="h-12 w-auto" /></Link>
          <h2 className="mt-5 max-w-sm font-display text-lg font-semibold leading-7">{BRAND.name}</h2>
          <p className="mt-2 text-sm text-white/75">{BRAND.parent}</p>
          <div className="mt-5 flex gap-3">
            {settings.facebook && <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center border border-white/35 text-white transition hover:bg-white hover:text-brand-800"><Facebook className="h-4 w-4" /></a>}
            {settings.telegram && <a href={settings.telegram} target="_blank" rel="noreferrer" aria-label="Telegram" className="grid h-10 w-10 place-items-center border border-white/35 text-white transition hover:bg-white hover:text-brand-800"><Send className="h-4 w-4" /></a>}
          </div>
        </div>

        {groups.map((group) => (
          <div key={group.title}>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">{group.title}</h2>
            <ul className="space-y-3 text-sm text-white/80">
              {group.links.map(([to, label]) => <li key={to}><Link to={to} className="transition hover:text-white">{label}</Link></li>)}
            </ul>
          </div>
        ))}

        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">{t("contact")}</h2>
          <ul className="space-y-3 text-sm text-white/80">
            {settings.address && <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" /><span>{settings.address}</span></li>}
            {settings.phone && <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" /><a href={`tel:${settings.phone}`} className="hover:text-white">{settings.phone}</a></li>}
            {settings.email && <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" /><a href={`mailto:${settings.email}`} className="break-all hover:text-white">{settings.email}</a></li>}
            <li><Link to="/contact" className="inline-flex items-center gap-2 font-semibold text-white underline decoration-gold-400 underline-offset-4">{t("contactUs")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/20 bg-brand-800">
        <div className="container-page flex flex-col gap-2 py-4 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {BRAND.short} · {BRAND.parent}</span>
          <span>{t("allRightsReserved")}</span>
        </div>
      </div>
    </footer>
  );
}
