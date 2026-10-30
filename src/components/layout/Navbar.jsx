import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Globe2, Menu, Search, X } from "lucide-react";
import logo from "@/assets/logos/logo-full.png";
import SearchDialog from "./SearchDialog";
import { useLang } from "@/hooks/useLang";
import { useCollection } from "@/hooks/useCollection";
import departmentService from "@/services/departmentService";
import { BRAND } from "@/utils/constants";

const activeClass = "text-brand-700";
const idleClass = "text-slate-700 hover:text-brand-700";

function MenuGroup({ label, children, active, mobile = false, onNavigate }) {
  return (
    <details className={`group/menu relative ${mobile ? "border-b border-slate-200" : ""}`}>
      <summary className={`flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-3 text-sm font-semibold transition marker:hidden ${active ? activeClass : idleClass} ${mobile ? "w-full" : ""}`}>
        {label}<ChevronDown className="h-4 w-4 transition-transform group-open/menu:rotate-180" aria-hidden="true" />
      </summary>
      <div className={`${mobile ? "border-t border-slate-100 bg-[#f8f8f6] px-3 pb-2" : "absolute left-0 top-full z-50 min-w-64 border border-slate-200 bg-white px-2 py-2 shadow-lg"}`}>
        {children.map(([to, text]) => (
          <NavLink key={`${to}-${text}`} to={to} onClick={(event) => { onNavigate?.(); event.currentTarget.closest("details")?.removeAttribute("open"); }} className={({ isActive }) => `block border-b border-slate-100 px-3 py-3 text-sm last:border-b-0 ${isActive ? "font-semibold text-brand-700" : "text-slate-700 hover:bg-brand-50 hover:text-brand-700"}`}>
            {text}
          </NavLink>
        ))}
      </div>
    </details>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { lang, toggle, t } = useLang();
  const { data: departments } = useCollection(departmentService);
  const closeMenu = () => setMenuOpen(false);
  const isActive = (paths) => paths.some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`));

  const groups = [
    { key: "about", label: t("aboutIispp"), paths: ["/about"], children: [["/about", t("overview")]] },
    { key: "academics", label: t("academics"), paths: ["/faculty", "/academics", "/department", "/program"], children: [["/faculty", t("faculty")], ["/academics", t("programs")], ...departments.slice(0, 5).map((d) => [`/faculty/${d.id}`, d.name])] },
    { key: "research", label: t("research"), paths: ["/research", "/centers"], children: [["/research", t("research")], ["/centers", t("researchCenters")]] },
    { key: "newsEvents", label: t("newsEvents"), paths: ["/news", "/events"], children: [["/news", t("news")], ["/events", t("events")]] },
    { key: "students", label: t("students"), paths: ["/admissions"], children: [["/admissions", t("admissions")]] },
  ];
  const direct = [
    { to: "/", label: t("home") },
    { to: "/contact", label: t("contact") },
  ];

  const desktopLink = ({ isActive: current }) => `px-3 py-3 text-sm font-semibold transition-colors ${current ? activeClass : idleClass}`;
  return (
    <>
      <header className="relative z-40 bg-white">
        <div className="container-page flex min-h-[92px] items-center justify-between gap-4 py-3 sm:min-h-[104px]">
          <Link to="/" aria-label="IISPP home" onClick={closeMenu} className="flex min-w-0 items-center gap-3 sm:gap-4">
            <img src={logo} alt="IISPP" className="h-10 w-auto shrink-0 sm:h-[58px]" />
            <span className="min-w-0 max-w-[145px] border-l border-slate-200 pl-2 sm:max-w-[440px] sm:pl-4">
              <span className="block font-display text-[11px] font-semibold leading-4 text-brand-900 sm:text-lg sm:leading-6">{BRAND.name}</span>
              <span className="mt-1 block text-[10px] leading-3 text-slate-500 sm:text-sm sm:leading-5">{BRAND.parent}</span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button type="button" onClick={() => setSearchOpen(true)} aria-label={t("search")} className="grid h-9 w-9 place-items-center text-slate-700 transition hover:text-brand-700 sm:h-10 sm:w-10">
              <Search className="h-5 w-5" />
            </button>
            <button type="button" onClick={toggle} className="inline-flex h-9 items-center gap-1 px-1 text-xs font-semibold text-slate-700 transition hover:text-brand-700 sm:h-10 sm:gap-2 sm:px-2 sm:text-sm" aria-label={lang === "en" ? t("switchToKhmer") : t("switchToEnglish")}>
              <Globe2 className="h-4 w-4" /> <span className="sm:hidden">{lang === "en" ? "ខ្មែរ" : "EN"}</span><span className="hidden sm:inline">{lang === "en" ? "ខ្មែរ" : "English"}</span>
            </button>
            <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? t("closeMenu") : t("openMenu")} className="grid h-9 w-9 place-items-center text-slate-700 transition hover:text-brand-700 sm:h-10 sm:w-10 lg:hidden">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="border-y border-slate-200 bg-white">
          <nav className="container-page hidden items-center justify-between lg:flex" aria-label={t("mainNavigation")}>
            <div className="flex items-center">
              {direct.slice(0, 1).map((item) => <NavLink end key={item.to} to={item.to} className={desktopLink}>{item.label}</NavLink>)}
              {groups.map((group) => <MenuGroup key={group.key} label={group.label} active={isActive(group.paths)} children={group.children} />)}
              {direct.slice(1).map((item) => <NavLink key={item.to} to={item.to} className={desktopLink}>{item.label}</NavLink>)}
            </div>
            <span className="hidden border-l border-gold-400 pl-4 text-xs font-medium text-slate-500 xl:block">{t("phnomPenhCambodia")}</span>
          </nav>

          {menuOpen && (
            <nav id="mobile-navigation" className="max-h-[calc(100dvh-90px)] overflow-y-auto border-t border-slate-200 bg-white lg:hidden" aria-label={t("mainNavigation")}>
              <div className="container-page py-2">
                {direct.slice(0, 1).map((item) => <NavLink end key={item.to} to={item.to} onClick={closeMenu} className={({ isActive: current }) => `block border-b border-slate-200 px-3 py-3 text-sm font-semibold ${current ? activeClass : idleClass}`}>{item.label}</NavLink>)}
                {groups.map((group) => <MenuGroup key={group.key} mobile label={group.label} active={isActive(group.paths)} children={group.children} onNavigate={closeMenu} />)}
                {direct.slice(1).map((item) => <NavLink key={item.to} to={item.to} onClick={closeMenu} className={({ isActive: current }) => `block px-3 py-3 text-sm font-semibold ${current ? activeClass : idleClass}`}>{item.label}</NavLink>)}
              </div>
            </nav>
          )}
        </div>
      </header>
      {searchOpen && <SearchDialog onClose={() => setSearchOpen(false)} />}
    </>
  );
}
