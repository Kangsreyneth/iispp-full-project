import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Globe2, Menu, X } from "lucide-react";
import emblem from "@/assets/logos/iispp-emblem.png";
import { useLang } from "@/hooks/useLang";
import { useCollection } from "@/hooks/useCollection";
import { useSettings } from "@/hooks/useSettings";
import departmentService from "@/services/departmentService";
import programService from "@/services/programService";
import { CENTERS } from "@/config/centers";
import { byOrder } from "@/utils/format";
import { publicApiFetch } from "@/services/api/apiService";

const navLabel = (item, lang) => typeof item.label === "string" ? item.label : item.label?.[lang] || item.label?.en || item.label?.km || "";
const navHref = (item) => item.url || (item.slug ? `/${String(item.slug).replace(/^\/+/, "")}` : "/");

function MenuLink({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `block rounded-md px-3 py-2.5 text-sm leading-6 transition-colors ${isActive ? "font-semibold text-[#7B1038]" : "text-slate-700 hover:bg-[#7B1038]/5 hover:text-[#7B1038]"}`}
    >
      {children}
    </NavLink>
  );
}

function Dropdown({ id, label, active, open, onToggle, onOpen, onClose, children, lang, focusWithinEnabled = true }) {
  const triggerId = `nav-${id}-trigger`;
  const panelId = `nav-${id}-panel`;
  const focusWithinClasses = focusWithinEnabled ? "group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-focus-within:delay-0" : "";
  return (
    <li
      className="group flex h-full items-center"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onClose();
      }}
    >
      <button
        id={triggerId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="true"
        onClick={onToggle}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) onOpen();
        }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown") return;
          event.preventDefault();
          onOpen();
          window.requestAnimationFrame(() => document.getElementById(panelId)?.querySelector("a")?.focus());
        }}
        className={`relative flex items-center gap-1 whitespace-nowrap px-1 py-3 text-[15px] font-medium uppercase tracking-wide text-white transition-colors after:absolute after:inset-x-1 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[#C9A24B] after:transition-transform after:duration-200 after:content-[''] hover:after:scale-x-100 focus-visible:after:scale-x-100 ${active || open ? "after:scale-x-100" : ""}`}
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!open}
        className={`mega-menu-scroll absolute inset-x-0 top-full z-[60] max-h-[75vh] overflow-y-auto border-t border-[#C9A24B]/35 bg-[#3A0A1E] shadow-2xl ${open ? "pointer-events-auto visible translate-y-0 opacity-100 delay-0" : "pointer-events-none invisible -translate-y-2 opacity-0 delay-100"} transition-all duration-200 ease-out group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-0 ${focusWithinClasses}`}
      >
          <div className={`mx-auto max-w-[1680px] px-4 py-8 lg:px-6 ${lang === "km" ? "font-khmer leading-relaxed" : ""}`}>
            <h2 className={`text-4xl font-bold uppercase text-white lg:text-5xl ${lang === "km" ? "font-khmer leading-relaxed" : "font-serif"}`}>{label}</h2>
            <div className="mb-8 mt-4 h-0.5 w-16 bg-[#C9A24B]" aria-hidden="true" />
            {children}
          </div>
      </div>
    </li>
  );
}

function MegaColumn({ title, children, footer }) {
  return (
    <section className="min-w-0 border-l border-white/20 pl-6 pr-8" aria-label={title}>
      <h3 className="mb-4 text-xl font-semibold text-[#E6C77A]">{title}</h3>
      {children}
      {footer}
    </section>
  );
}

function MegaLink({ to, children, lang, onClick }) {
  return (
    <Link to={to} onClick={onClick} className={`flex items-start text-[15px] leading-relaxed text-white/85 transition duration-150 hover:translate-x-1 hover:text-white hover:underline hover:decoration-[#C9A24B] hover:underline-offset-4 ${lang === "km" ? "font-khmer" : ""}`}>
      <span className="mt-[0.65em] mr-3 h-1.5 w-1.5 shrink-0 bg-[#C9A24B]" aria-hidden="true" />
      <span>{children}</span>
    </Link>
  );
}

function MenuFooter({ to, children, onClick }) {
  return <Link to={to} onClick={onClick} className="mt-4 inline-block font-semibold text-[#E6C77A] transition-colors hover:text-white">{children} →</Link>;
}

function InformationComingSoon({ lang }) {
  return <p className={`text-sm italic text-white/50 ${lang === "km" ? "font-khmer leading-relaxed" : ""}`}>{lang === "km" ? "ព័ត៌មាននឹងមានក្នុងពេលឆាប់ៗនេះ" : "Information coming soon"}</p>;
}

function MegaMenu({ departments, programs, departmentLoading, programLoading, departmentError, programError, t, onNavigate, lang }) {
  return (
    <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-3">
      <MegaColumn title={t("departments")} footer={<MenuFooter to="/faculty" onClick={onNavigate}>{t("viewDepartments")}</MenuFooter>}>
        {departmentLoading ? <p className="text-sm italic text-white/50">{t("loading")}</p> : departmentError || !departments.length ? <InformationComingSoon lang={lang} /> : (
          <ul className="space-y-3">{departments.map((department) => <li key={department.id}><MegaLink lang={lang} to={`/faculty/${department.id}`} onClick={onNavigate}>{department.name}</MegaLink></li>)}</ul>
        )}
      </MegaColumn>
      <MegaColumn title={t("academicPrograms")} footer={<MenuFooter to="/academics" onClick={onNavigate}>{t("allPrograms")}</MenuFooter>}>
        {programLoading ? <p className="text-sm italic text-white/50">{t("loading")}</p> : programError || !programs.length ? <InformationComingSoon lang={lang} /> : (
          <ul className="space-y-3">{programs.slice(0, 6).map((program) => <li key={program.id}><MegaLink lang={lang} to={`/academics/${program.id}`} onClick={onNavigate}>{program.name}</MegaLink></li>)}</ul>
        )}
      </MegaColumn>
      <MegaColumn title={t("academicCalendar")}>
        <InformationComingSoon lang={lang} />
      </MegaColumn>
    </div>
  );
}

function CentersMenu({ t, onNavigate, lang }) {
  return (
    <div className="grid gap-0 md:grid-cols-2">
      <MegaColumn title={t("researchCenters")} footer={<MenuFooter to="/centers" onClick={onNavigate}>{t("viewCenters")}</MenuFooter>}>
        {CENTERS.length ? <ul className="space-y-3">{CENTERS.map((center) => <li key={center.slug}><MegaLink lang={lang} to={`/centers/${center.slug}`} onClick={onNavigate}>{center.name}</MegaLink></li>)}</ul> : <InformationComingSoon lang={lang} />}
      </MegaColumn>
      <MegaColumn title={t("aboutOurCenters")} footer={<MenuFooter to="/centers" onClick={onNavigate}>{t("viewCenters")}</MenuFooter>}>
        <p className={`text-sm leading-relaxed text-white/60 ${lang === "km" ? "font-khmer" : ""}`}>{t("centersIntro")}</p>
      </MegaColumn>
    </div>
  );
}

function AboutMenu({ links, t, onNavigate, lang }) {
  return (
    <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-3">
      <MegaColumn title={t("aboutIispp")} footer={<MenuFooter to="/about" onClick={onNavigate}>{t("aboutIispp")}</MenuFooter>}>
        {links.length ? <ul className="space-y-3">{links.map(([to, label]) => <li key={to}><MegaLink lang={lang} to={to} onClick={onNavigate}>{label}</MegaLink></li>)}</ul> : <InformationComingSoon lang={lang} />}
      </MegaColumn>
    </div>
  );
}

function MobileMenuGroup({ id, label, open, onToggle, children }) {
  return (
    <section className="border-b border-white/20">
      <button type="button" aria-expanded={open} aria-controls={`mobile-${id}-panel`} onClick={onToggle} className="flex min-h-11 w-full items-center justify-between px-3 py-3 text-left text-sm font-semibold uppercase tracking-wide text-white">
        {label}
        <ChevronDown className={`h-4 w-4 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open && <div id={`mobile-${id}-panel`} className="mobile-nav-panel border-t border-white/20 px-2 py-1">{children}</div>}
    </section>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 10);
  const [openMenu, setOpenMenu] = useState(null);
  const [escapeDismissed, setEscapeDismissed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState(null);
  const [cmsNavigation, setCmsNavigation] = useState(null);
  const navRef = useRef(null);
  const closeTimer = useRef(null);
  const openedByClick = useRef(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { lang, toggle, t } = useLang();
  const { settings } = useSettings();
  const { data: departments, loading: departmentLoading, error: departmentError } = useCollection(departmentService, { sort: byOrder });
  const { data: programs, loading: programLoading, error: programError } = useCollection(programService, { sort: byOrder });

  useEffect(() => {
    let active = true;
    publicApiFetch(`/public/navigation?lang=${lang}`, { cache: "no-store" })
      .then((response) => { if (active && Array.isArray(response?.data) && response.data.length) setCmsNavigation(response.data); })
      .catch(() => { if (active) setCmsNavigation(null); });
    return () => { active = false; };
  }, [lang]);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    const closeOnPointer = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        openedByClick.current = false;
        setOpenMenu(null);
        setMobileOpen(false);
        setMobileGroup(null);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      if (openMenu) {
        openedByClick.current = false;
        document.getElementById(`nav-${openMenu}-trigger`)?.focus();
        setOpenMenu(null);
        setEscapeDismissed(true);
      } else if (mobileOpen) {
        document.getElementById("mobile-nav-toggle")?.focus();
        setMobileOpen(false);
        setMobileGroup(null);
      }
    };
    document.addEventListener("pointerdown", closeOnPointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnPointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openMenu, mobileOpen]);

  useEffect(() => {
    openedByClick.current = false;
    setOpenMenu(null);
    setMobileOpen(false);
    setMobileGroup(null);
  }, [location.pathname, location.hash, location.search]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const isActive = (paths) => paths.some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`));
  const open = (id) => {
    window.clearTimeout(closeTimer.current);
    openedByClick.current = false;
    setEscapeDismissed(false);
    setOpenMenu(id);
  };
  const close = () => {
    if (openedByClick.current) return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 100);
  };
  const toggleMenu = (id) => {
    window.clearTimeout(closeTimer.current);
    setOpenMenu((current) => {
      if (current === id && openedByClick.current) {
        openedByClick.current = false;
        return null;
      }
      openedByClick.current = true;
      return id;
    });
  };
  const dismiss = () => {
    openedByClick.current = false;
    window.clearTimeout(closeTimer.current);
    setOpenMenu(null);
  };
  const closeMobile = () => { setMobileOpen(false); setMobileGroup(null); };
  const itemClass = ({ isActive: current }) => `relative whitespace-nowrap px-1 py-3 text-[15px] font-medium uppercase tracking-wide text-white transition-colors after:absolute after:inset-x-1 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[#C9A24B] after:transition-transform after:duration-200 after:content-[''] hover:after:scale-x-100 focus-visible:after:scale-x-100 ${current ? "after:scale-x-100" : ""}`;
  const aboutLinks = [
    ["/about", t("overview")],
    settings.background ? ["/about#background", t("background")] : null,
    settings.vision ? ["/about#vision", t("vision")] : null,
    settings.mission ? ["/about#mission", t("mission")] : null,
    settings.goals ? ["/about#goals", t("goals")] : null,
  ].filter(Boolean);
  const newsLinks = [["/news", t("latestNews")], ["/news?category=Announcement", t("newsCategoryAnnouncement")], ["/events", t("events")]];

  return (
    <>
      <style>{`@keyframes mobile-nav-in { from { opacity: 0; transform: translateY(-0.35rem); } to { opacity: 1; transform: translateY(0); } } .mobile-nav-enter { animation: mobile-nav-in 180ms ease-out both; } .mega-menu-scroll { scrollbar-width: thin; scrollbar-color: #C9A24B transparent; } .mega-menu-scroll::-webkit-scrollbar { width: 6px; } .mega-menu-scroll::-webkit-scrollbar-thumb { border-radius: 9999px; background: #C9A24B; } .font-khmer { font-family: "Noto Sans Khmer", "Battambang", sans-serif; } .mobile-nav-panel a { color: white; } .mobile-nav-panel a:hover { background: rgba(255,255,255,.1); color: white; } @media (prefers-reduced-motion: reduce) { .mobile-nav-enter { animation: none; } }`}</style>
      <header ref={navRef} className={`fixed inset-x-0 top-0 z-50 text-white transition-all duration-300 ${isScrolled ? "h-16 bg-[#7B1038] shadow-md" : "h-20 bg-gradient-to-b from-[#3a0710]/90 via-[#5a0c1b]/60 to-transparent md:h-24"}`}>
        <nav className="mx-auto flex h-full w-full max-w-[1680px] items-center justify-between gap-2 px-4 lg:gap-3 lg:px-6 xl:gap-10" aria-label={t("mainNavigation")}>
          <Link to="/" aria-label={t("iisppHome")} className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-90 md:gap-4">
            <img src={emblem} alt="" loading="eager" decoding="async" className="h-12 w-auto object-contain md:h-14" />
            <span aria-hidden="true" className="h-10 w-px shrink-0 bg-white/50" />
            <span className="flex min-w-0 flex-col justify-center text-white">
              <span className={`font-display font-bold tracking-wide ${lang === "km" ? "text-base leading-relaxed md:text-lg" : "text-2xl leading-none md:text-3xl"}`}>{lang === "km" ? t("heroKhmer") : "IISPP"}</span>
              <span className="mt-1 hidden text-[10px] uppercase leading-tight tracking-wide text-white/90 sm:block md:text-xs lg:hidden xl:block">Institute for International<br />Studies and Public Policy</span>
            </span>
          </Link>

          <ul className="hidden h-full min-w-0 flex-1 items-center justify-end gap-2 whitespace-nowrap lg:flex xl:gap-5">
            {cmsNavigation ? cmsNavigation.map((item) => {
              const label = navLabel(item, lang);
              const href = navHref(item);
              const active = isActive([href]);
              if (!item.children?.length) return <li key={item.id}><NavLink to={href} className={itemClass}>{label}</NavLink></li>;
              return <Dropdown key={item.id} id={`cms-${item.id}`} label={label} active={active} open={openMenu === `cms-${item.id}`} onToggle={() => toggleMenu(`cms-${item.id}`)} onOpen={() => open(`cms-${item.id}`)} onClose={close} lang={lang} focusWithinEnabled={!escapeDismissed}>
                <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-3">{item.children.map((child) => <MegaColumn key={child.id} title={navLabel(child, lang)}>
                  {child.children?.length ? <ul className="space-y-3">{child.children.map((leaf) => <li key={leaf.id}><MegaLink lang={lang} to={navHref(leaf)} onClick={dismiss}>{navLabel(leaf, lang)}</MegaLink></li>)}</ul> : <ul><li><MegaLink lang={lang} to={navHref(child)} onClick={dismiss}>{navLabel(child, lang)}</MegaLink></li></ul>}
                </MegaColumn>)}</div>
              </Dropdown>;
            }) : <>
            <li><NavLink end to="/" className={itemClass}>{t("home")}</NavLink></li>
            <Dropdown id="about" label={t("aboutIispp")} active={isActive(["/about"])} open={openMenu === "about"} onToggle={() => toggleMenu("about")} onOpen={() => open("about")} onClose={close} lang={lang} focusWithinEnabled={!escapeDismissed}>
              <AboutMenu links={aboutLinks} t={t} lang={lang} onNavigate={dismiss} />
            </Dropdown>
            <Dropdown id="academics" label={t("academics")} active={isActive(["/academics", "/faculty", "/department", "/program"])} open={openMenu === "academics"} onToggle={() => toggleMenu("academics")} onOpen={() => open("academics")} onClose={close} lang={lang} focusWithinEnabled={!escapeDismissed}>
              <MegaMenu departments={departments} programs={programs} departmentLoading={departmentLoading} programLoading={programLoading} departmentError={departmentError} programError={programError} t={t} onNavigate={dismiss} lang={lang} />
            </Dropdown>
            <li><NavLink to="/research" className={itemClass}>{t("research")}</NavLink></li>
            <Dropdown id="centers" label={t("centers")} active={isActive(["/centers"])} open={openMenu === "centers"} onToggle={() => toggleMenu("centers")} onOpen={() => open("centers")} onClose={close} lang={lang} focusWithinEnabled={!escapeDismissed}>
              <CentersMenu t={t} onNavigate={dismiss} lang={lang} />
            </Dropdown>
            <Dropdown id="posts" label={t("posts")} active={false} open={openMenu === "posts"} onToggle={() => toggleMenu("posts")} onOpen={() => open("posts")} onClose={close} lang={lang} focusWithinEnabled={!escapeDismissed}>
              <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-3">
                <MegaColumn title={t("posts")}><InformationComingSoon lang={lang} /><p className="mt-3 text-sm leading-relaxed text-white/60">{t("postsUnavailable")}</p></MegaColumn>
              </div>
            </Dropdown>
            <Dropdown id="news" label={t("newsEvents")} active={isActive(["/news", "/events"])} open={openMenu === "news"} onToggle={() => toggleMenu("news")} onOpen={() => open("news")} onClose={close} lang={lang} focusWithinEnabled={!escapeDismissed}>
              <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-3">
                <MegaColumn title={t("newsEvents")} footer={<MenuFooter to="/news" onClick={dismiss}>{t("latestNews")}</MenuFooter>}>
                  <ul className="space-y-3">{newsLinks.map(([to, label]) => <li key={to}><MegaLink lang={lang} to={to} onClick={dismiss}>{label}</MegaLink></li>)}</ul>
                </MegaColumn>
              </div>
            </Dropdown>
            <li><NavLink to="/contact" className={itemClass}>{t("contact")}</NavLink></li>
            </>}
          </ul>

          <div className="ml-auto flex shrink-0 items-center gap-3 lg:ml-0">
            <button type="button" onClick={toggle} className="hidden min-h-11 items-center gap-2 whitespace-nowrap text-sm font-medium tracking-wide text-white transition-opacity hover:opacity-80 lg:inline-flex" aria-label={lang === "en" ? t("switchToKhmer") : t("switchToEnglish")}>
              <Globe2 className="h-4 w-4" /><span>KH/EN</span>
            </button>
            <button id="mobile-nav-toggle" type="button" onClick={() => { setMobileOpen((value) => !value); setMobileGroup(null); }} aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label={mobileOpen ? t("closeMenu") : t("openMenu")} className="grid h-11 w-11 place-items-center text-white transition-opacity hover:opacity-80 lg:hidden">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {openMenu && <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[49] bg-black/30" />}

        {mobileOpen && (
          <div id="mobile-navigation" className="mobile-nav-enter absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-white/20 bg-[#5E0C2B] shadow-xl lg:hidden">
            <div className="mx-auto max-w-[1400px] px-4 py-2 lg:px-8">
              {cmsNavigation ? <>
                {cmsNavigation.map((item) => item.children?.length ? <MobileMenuGroup key={item.id} id={`cms-${item.id}`} label={navLabel(item, lang)} open={mobileGroup === `cms-${item.id}`} onToggle={() => setMobileGroup((value) => value === `cms-${item.id}` ? null : `cms-${item.id}`)}>
                  {item.children.map((child) => <div key={child.id}>
                    <MenuLink to={navHref(child)} onClick={closeMobile}>{navLabel(child, lang)}</MenuLink>
                    {child.children?.map((leaf) => <div key={leaf.id} className="pl-4"><MenuLink to={navHref(leaf)} onClick={closeMobile}>{navLabel(leaf, lang)}</MenuLink></div>)}
                  </div>)}
                </MobileMenuGroup> : <NavLink key={item.id} to={navHref(item)} onClick={closeMobile} className="block min-h-11 border-b border-white/20 px-3 py-3 text-sm font-medium uppercase tracking-wide text-white">{navLabel(item, lang)}</NavLink>)}
              </> : <>
              <NavLink end to="/" onClick={closeMobile} className={({ isActive: current }) => `block min-h-11 border-b border-white/20 px-3 py-3 text-sm font-medium uppercase tracking-wide text-white ${current ? "underline decoration-[#C8902A] decoration-2 underline-offset-4" : ""}`}>{t("home")}</NavLink>
              <MobileMenuGroup id="about" label={t("aboutIispp")} open={mobileGroup === "about"} onToggle={() => setMobileGroup((value) => value === "about" ? null : "about")}>
                {aboutLinks.map(([to, label]) => <MenuLink key={to} to={to} onClick={closeMobile}>{label}</MenuLink>)}
              </MobileMenuGroup>
              <MobileMenuGroup id="academics" label={t("academics")} open={mobileGroup === "academics"} onToggle={() => setMobileGroup((value) => value === "academics" ? null : "academics")}>
                <p className="px-3 pb-1 pt-3 text-xs font-bold uppercase tracking-wide text-white/70">{t("departments")}</p>
                {departmentLoading ? <p className="px-3 py-2 text-sm text-white/80">{t("loading")}</p> : departmentError ? <p className="px-3 py-2 text-sm text-white/80">{t("dataUnavailable")}</p> : departments.length ? departments.map((department) => <MenuLink key={department.id} to={`/faculty/${department.id}`} onClick={closeMobile}>{department.name}</MenuLink>) : <p className="px-3 py-2 text-sm text-white/80">{t("noDepartments")}</p>}
                <MenuLink to="/faculty" onClick={closeMobile}>{t("viewDepartments")}</MenuLink>
                <p className="px-3 pb-1 pt-3 text-xs font-bold uppercase tracking-wide text-white/70">{t("academicPrograms")}</p>
                <MenuLink to="/academics" onClick={closeMobile}>{t("allPrograms")}</MenuLink>
                {programLoading ? <p className="px-3 py-2 text-sm text-white/80">{t("loading")}</p> : programError ? <p className="px-3 py-2 text-sm text-white/80">{t("dataUnavailable")}</p> : programs.slice(0, 6).map((program) => <MenuLink key={program.id} to={`/academics/${program.id}`} onClick={closeMobile}>{program.name}</MenuLink>)}
                <p className="px-3 pb-1 pt-3 text-xs font-bold uppercase tracking-wide text-white/70">{t("academicCalendar")}</p>
                <p className="px-3 pb-3 text-sm text-white/80">{t("calendarUnavailable")}</p>
              </MobileMenuGroup>
              <NavLink to="/research" onClick={closeMobile} className="block min-h-11 border-b border-white/20 px-3 py-3 text-sm font-medium uppercase tracking-wide text-white">{t("research")}</NavLink>
              <MobileMenuGroup id="centers" label={t("centers")} open={mobileGroup === "centers"} onToggle={() => setMobileGroup((value) => value === "centers" ? null : "centers")}>
                {CENTERS.map((center) => <MenuLink key={center.slug} to={`/centers/${center.slug}`} onClick={closeMobile}>{center.name}</MenuLink>)}
                <MenuLink to="/centers" onClick={closeMobile}>{t("viewCenters")}</MenuLink>
              </MobileMenuGroup>
              <MobileMenuGroup id="posts" label={t("posts")} open={mobileGroup === "posts"} onToggle={() => setMobileGroup((value) => value === "posts" ? null : "posts")}>
                <p className="px-3 py-3 text-sm leading-6 text-white/80">{t("postsUnavailable")}</p>
              </MobileMenuGroup>
              <MobileMenuGroup id="news" label={t("newsEvents")} open={mobileGroup === "news"} onToggle={() => setMobileGroup((value) => value === "news" ? null : "news")}>
                {newsLinks.map(([to, label]) => <MenuLink key={to} to={to} onClick={closeMobile}>{label}</MenuLink>)}
              </MobileMenuGroup>
              <NavLink to="/contact" onClick={closeMobile} className="block min-h-11 px-3 py-3 text-sm font-medium uppercase tracking-wide text-white">{t("contact")}</NavLink>
              </>}
              <div className="border-t border-white/20 px-3 py-2">
                <button type="button" onClick={() => { toggle(); closeMobile(); }} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium tracking-wide text-white" aria-label={lang === "en" ? t("switchToKhmer") : t("switchToEnglish")}><Globe2 className="h-4 w-4" />KH/EN</button>
              </div>
            </div>
          </div>
        )}
      </header>
      {!isHome && <div aria-hidden="true" className="h-20 shrink-0 md:h-24" />}
    </>
  );
}

