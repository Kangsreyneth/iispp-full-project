import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FileText, Newspaper, CalendarDays, GraduationCap, Building2, Mail, Users, Image, BookOpen, Microscope,
  Settings, LogOut, Menu, X, ExternalLink, Search, Bell, ChevronDown, ChevronRight, Activity,
  PanelLeftClose, PanelLeftOpen, UserRound, Globe2, ListTree, PanelsTopLeft,
} from "lucide-react";
import logo from "@/assets/logos/logo-full.png";
import seal from "@/assets/logos/seal.png";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/hooks/useLang";
import { logout } from "@/services/authService";
import messageService from "@/services/messageService";
import userService from "@/services/userService";
import { initials } from "@/utils/format";

const NAV = [
  ["/admin/dashboard", "Dashboard", LayoutDashboard, true],
  ["/admin/pages", "Pages", FileText, false, "pages.view"],
  ["/admin/news", "News", Newspaper, false, "news.view"],
  ["/admin/events", "Events", CalendarDays, false, "events.view"],
  ["/admin/programs", "Programs", GraduationCap, false, "programs.view"],
  ["/admin/faculties", "Faculties", Building2, false, "departments.view"],
  ["/admin/research", "Research", Microscope, false, "research.view"],
  ["/admin/publications", "Publications", BookOpen, false, "publications.view"],
  ["/admin/home-content", "Homepage", PanelsTopLeft, false, "homepage.manage"],
  ["/admin/navigation", "Navigation", ListTree, false, "navigation.manage"],
  ["/admin/media", "Media library", Image, false, "media.view"],
  ["/admin/messages", "Messages", Mail, false, "messages.view"],
  ["/admin/activity", "Activity log", Activity, false, "audit.view"],
  ["/admin/users", "Users", Users, false, "users.view"],
  ["/admin/settings", "Settings", Settings, false, "settings.manage"],
];

function can(profile, permission) {
  return profile?.role === "super_admin" || (profile?.permissions || []).some((granted) =>
    granted === "*" || granted === permission || (granted.endsWith(".*") && permission.startsWith(granted.slice(0, -1)))
  );
}

function Sidebar({ profile, collapsed, onCollapse, onNavigate, onLogout }) {
  const links = NAV.filter(([, , , , permission]) => !permission || can(profile, permission));
  return (
    <aside className={`flex h-full flex-col bg-brand-950 text-white transition-[width] duration-200 ${collapsed ? "w-[76px]" : "w-64"}`}>
      <div className={`flex h-[76px] shrink-0 items-center border-b border-white/10 ${collapsed ? "justify-center px-2" : "gap-3 px-5"}`}>
        <Link to="/admin/dashboard" onClick={onNavigate} className="flex min-w-0 items-center gap-3" aria-label="IISPP admin dashboard">
          <img src={seal} alt="" className="h-10 w-10 shrink-0 rounded-full bg-white p-1" />
          {!collapsed && <span className="min-w-0"><span className="block font-display text-base font-bold leading-tight">IISPP</span><span className="mt-0.5 block text-xs text-white/60">Content management</span></span>}
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5" aria-label="Admin workspace">
        {!collapsed && <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">Workspace</p>}
        {links.map(([to, label, Icon, end]) => (
          <NavLink key={to} to={to} end={end} title={collapsed ? label : undefined} aria-label={collapsed ? label : undefined} onClick={onNavigate}
            className={({ isActive }) => `relative flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${collapsed ? "justify-center" : ""} ${isActive ? "bg-white/10 text-white before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r-full before:bg-gold-400" : "text-white/70 hover:bg-white/5 hover:text-white"}`}>
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-3">
        <Link to="/" title={collapsed ? "View website" : undefined} onClick={onNavigate} className={`mb-1 flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white ${collapsed ? "justify-center" : ""}`}>
          <ExternalLink className="h-4 w-4 shrink-0" />{!collapsed && "View website"}
        </Link>
        <button type="button" onClick={onLogout} title={collapsed ? "Sign out" : undefined} className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white/70 hover:bg-white/5 hover:text-white ${collapsed ? "justify-center" : ""}`}>
          <LogOut className="h-4 w-4 shrink-0" />{!collapsed && "Sign out"}
        </button>
        <button type="button" onClick={onCollapse} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} className={`mt-2 hidden min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-white/50 hover:bg-white/5 hover:text-white lg:flex ${collapsed ? "justify-center" : ""}`}>
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <><PanelLeftClose className="h-4 w-4" />Collapse sidebar</>}
        </button>
      </div>
    </aside>
  );
}

export default function DashboardLayout() {
  const { profile } = useAuth();
  const { lang, toggle } = useLang();
  const nav = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [counts, setCounts] = useState({ messages: 0, pending: 0 });
  const permissionKey = `${profile?.role || ""}:${(profile?.permissions || []).join(",")}`;
  const accessibleNav = useMemo(() => NAV.filter(([, , , , permission]) => !permission || can(profile, permission)), [permissionKey]);
  const searchResults = accessibleNav.filter(([, label]) => label.toLowerCase().includes(search.trim().toLowerCase()));
  const current = NAV.find(([to]) => to === location.pathname);
  const pageTitle = current?.[1] || "Dashboard";
  const notificationCount = counts.messages + counts.pending;

  useEffect(() => {
    let active = true;
    Promise.all([
      can(profile, "messages.view") ? messageService.count("new").catch(() => 0) : 0,
      can(profile, "users.view") ? userService.count("pending").catch(() => 0) : 0,
    ]).then(([messages, pending]) => {
      if (active) setCounts({ messages, pending });
    });
    return () => { active = false; };
  }, [permissionKey]);

  async function signOut() {
    await logout();
    nav("/admin", { replace: true });
  }

  function goTo(to) {
    nav(to);
    setSearch("");
    setSearchOpen(false);
    setMobileOpen(false);
  }

  const sidebar = (isMobile = false) => (
    <Sidebar
      profile={profile}
      collapsed={isMobile ? false : collapsed}
      onCollapse={() => setCollapsed((value) => !value)}
      onNavigate={() => isMobile && setMobileOpen(false)}
      onLogout={signOut}
    />
  );

  return (
    <div className="flex min-h-screen bg-[#F8F6F1]">
      <div className="sticky top-0 hidden h-screen shrink-0 lg:block">{sidebar()}</div>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Admin navigation">
          <div className="h-full shadow-2xl">{sidebar(true)}</div>
          <button type="button" className="flex-1 bg-slate-950/50" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-[76px] items-center justify-between gap-3 px-4 sm:px-7">
            <div className="flex min-w-0 items-center gap-3">
              <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open admin navigation" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"><Menu className="h-5 w-5" /></button>
              <button type="button" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} className="hidden h-10 w-10 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 lg:grid">{collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}</button>
              <div className="min-w-0">
                <p className="hidden text-xs font-medium text-slate-400 sm:block">Admin workspace</p>
                <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">{pageTitle}</h1>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <div className="relative hidden sm:block">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden="true" />
                <input value={search} onFocus={() => setSearchOpen(true)} onChange={(event) => { setSearch(event.target.value); setSearchOpen(true); }} onKeyDown={(event) => { if (event.key === "Escape") setSearchOpen(false); if (event.key === "Enter" && searchResults[0]) goTo(searchResults[0][0]); }} placeholder="Search admin pages" aria-label="Search admin pages" className="w-40 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100 sm:w-52 lg:w-60" />
                {searchOpen && search.trim() && (
                  <div className="absolute right-0 top-full z-40 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                    {searchResults.length ? searchResults.map(([to, label, Icon]) => <button type="button" key={to} onClick={() => goTo(to)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-800"><Icon className="h-4 w-4" />{label}<ChevronRight className="ml-auto h-4 w-4" /></button>) : <p className="px-3 py-3 text-sm text-slate-500">No matching admin pages.</p>}
                  </div>
                )}
              </div>

              <button type="button" onClick={toggle} aria-label={`Switch language, current ${lang === "en" ? "English" : "Khmer"}`} className="inline-flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"><Globe2 className="h-4 w-4" /><span>{lang === "en" ? "EN" : "KH"}</span></button>

              <div className="relative">
                <button type="button" onClick={() => setNotificationsOpen((value) => !value)} aria-label={`Notifications${notificationCount ? `, ${notificationCount} pending` : ""}`} aria-expanded={notificationsOpen} className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-600 hover:bg-slate-100"><Bell className="h-5 w-5" />{notificationCount > 0 && <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-gold-500" />}</button>
                {notificationsOpen && <div className="absolute right-0 top-full z-40 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  <p className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-400">Notifications</p>
                  {can(profile, "messages.view") && <button type="button" onClick={() => { setNotificationsOpen(false); goTo("/admin/messages"); }} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm hover:bg-slate-50"><span>Unread messages</span><span className="font-semibold text-brand-800">{counts.messages}</span></button>}
                  {can(profile, "users.view") && <button type="button" onClick={() => { setNotificationsOpen(false); goTo("/admin/users"); }} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm hover:bg-slate-50"><span>Pending users</span><span className="font-semibold text-brand-800">{counts.pending}</span></button>}
                  {!can(profile, "messages.view") && !can(profile, "users.view") && <p className="px-3 py-3 text-sm text-slate-500">No notifications available.</p>}
                </div>}
              </div>

              <div className="relative">
                <button type="button" onClick={() => setUserMenuOpen((value) => !value)} aria-expanded={userMenuOpen} className="flex h-10 items-center gap-2 rounded-full p-1 pr-2 hover:bg-slate-100">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-900">{initials(profile?.displayName || profile?.name)}</span>
                  <span className="hidden max-w-28 text-left sm:block"><span className="block truncate text-sm font-semibold text-slate-800">{profile?.displayName || profile?.name || "Admin"}</span><span className="block text-[11px] capitalize text-slate-500">{String(profile?.role || "staff").replaceAll("_", " ")}</span></span>
                  <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
                </button>
                {userMenuOpen && <div className="absolute right-0 top-full z-40 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                  <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"><UserRound className="h-4 w-4" />Profile</Link>
                  <button type="button" onClick={signOut} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-red-50 hover:text-red-700"><LogOut className="h-4 w-4" />Logout</button>
                </div>}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] p-4 sm:p-7 lg:p-9">
          <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-slate-500">
            <Link to="/admin/dashboard" className="hover:text-brand-800">Admin</Link><ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /><span aria-current="page" className="font-medium text-slate-700">{pageTitle}</span>
          </nav>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
