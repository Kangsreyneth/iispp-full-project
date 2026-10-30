import { useState } from "react";
import { NavLink, Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Newspaper, CalendarDays, GraduationCap, Building2, Mail, Users, Settings, LogOut, Menu, X, ExternalLink } from "lucide-react";
import logo from "@/assets/logos/logo-full.png";
import seal from "@/assets/logos/seal.png";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/services/authService";
import { initials } from "@/utils/format";

const NAV = [
  ["/admin/dashboard", "Dashboard", LayoutDashboard, true],
  ["/admin/pages", "Pages", FileText, false, "pages.view"],
  ["/admin/news", "News", Newspaper, false, "news.view"],
  ["/admin/events", "Events", CalendarDays, false, "events.view"],
  ["/admin/programs", "Programs", GraduationCap, false, "programs.view"],
  ["/admin/faculties", "Faculties", Building2, false, "departments.view"],
  ["/admin/messages", "Messages", Mail, false, "messages.view"],
  ["/admin/users", "Users", Users, false, "users.view"],
  ["/admin/settings", "Settings", Settings, false, "settings.manage"],
];

function can(profile, permission) {
  return profile?.role === "super_admin" || (profile?.permissions || []).some((granted) =>
    granted === "*" || granted === permission || (granted.endsWith(".*") && permission.startsWith(granted.slice(0, -1)))
  );
}

export default function DashboardLayout() {
  const { profile } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const pageTitle = NAV.find(([to]) => to === location.pathname)?.[1] || "Dashboard";

  const sidebar = (
    <aside className="flex h-full w-[260px] flex-col border-r border-slate-200 bg-white text-slate-700">
      <div className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-5">
        <img src={seal} alt="" className="h-10 w-10 rounded-full bg-brand-50 p-1" />
        <div><p className="font-display text-base font-bold leading-tight text-brand-900">IISPP</p><p className="mt-0.5 text-xs text-slate-500">Content management</p></div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Dashboard">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
        {NAV.filter(([, , , , permission]) => !permission || can(profile, permission)).map(([to, label, Icon, end]) => (
          <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-brand-50 text-brand-900 ring-1 ring-brand-100" : "text-slate-600 hover:bg-slate-50 hover:text-brand-800"}`}>
            <Icon className="h-4 w-4" /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-100 p-3">
        <Link to="/" className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-800"><ExternalLink className="h-4 w-4" /> View website</Link>
        <button onClick={async () => { await logout(); nav("/admin", { replace: true }); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-red-50 hover:text-red-700"><LogOut className="h-4 w-4" /> Sign out</button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      <div className="sticky top-0 hidden h-screen lg:block">{sidebar}</div>
      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="h-full">{sidebar}</div>
          <button className="flex-1 bg-slate-950/40 backdrop-blur-[2px]" aria-label="Close menu" onClick={() => setOpen(false)} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen((value) => !value)} aria-label={open ? "Close menu" : "Open menu"} className="grid h-10 w-10 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
            <img src={logo} alt="IISPP" className="h-8 w-auto lg:hidden" />
            <div className="hidden lg:block"><p className="text-xs font-medium text-slate-400">Admin workspace</p><h1 className="text-lg font-semibold text-slate-900">{pageTitle}</h1></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block"><p className="text-sm font-semibold text-slate-800">{profile?.displayName || profile?.name}</p><p className="text-xs capitalize text-slate-500">{String(profile?.role || "staff").replaceAll("_", " ")}</p></div>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand-900 ring-1 ring-brand-100">{initials(profile?.displayName || profile?.name)}</span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1440px] p-4 sm:p-7 lg:p-9"><Outlet /></main>
      </div>
    </div>
  );
}
