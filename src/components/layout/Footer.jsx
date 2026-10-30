import { Link } from "react-router-dom";
import { Facebook } from "@/components/ui/BrandIcons";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import logo from "@/assets/logos/logo-full.png";
import { useLang } from "@/hooks/useLang";
import { useSettings } from "@/hooks/useSettings";
import { BRAND } from "@/utils/constants";

const links = [
  ["/about", "about"], ["/academics", "academics"], ["/faculty", "faculty"],
  ["/admissions", "admissions"], ["/news", "news"], ["/events", "events"],
];

export default function Footer() {
  const { t } = useLang();
  const { settings } = useSettings();

  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:py-14">
        <div>
          <Link to="/" aria-label="IISPP home"><img src={logo} alt={BRAND.name} className="h-12 w-auto" /></Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">{BRAND.name} at the {BRAND.parent}. Explore our academic programs, research, and campus community.</p>
          <div className="mt-5 flex gap-2">
            {settings.facebook && <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-brand-200 hover:text-brand-800"><Facebook className="h-4 w-4" /></a>}
            {settings.telegram && <a href={settings.telegram} target="_blank" rel="noreferrer" aria-label="Telegram" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-brand-200 hover:text-brand-800"><Send className="h-4 w-4" /></a>}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900">Explore IISPP</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-slate-600">
            {links.map(([to, key]) => <li key={to}><Link to={to} className="transition hover:text-brand-800">{t(key)}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900">Contact</h2>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" /><span>{settings.address || "Royal University of Phnom Penh, Cambodia"}</span></li>
            {settings.phone && <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" /><a href={`tel:${settings.phone}`} className="hover:text-brand-800">{settings.phone}</a></li>}
            {settings.email && <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" /><a href={`mailto:${settings.email}`} className="break-all hover:text-brand-800">{settings.email}</a></li>}
            <li><Link to="/contact" className="font-semibold text-brand-800 hover:underline">{t("contactUs")} →</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 bg-white">
        <div className="container-page flex flex-col gap-2 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {BRAND.short} · {BRAND.parent}</span>
          <span>Institute for International Studies and Public Policy</span>
        </div>
      </div>
    </footer>
  );
}
