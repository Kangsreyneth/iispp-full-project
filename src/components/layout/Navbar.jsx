import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Globe2, Menu, Search, X } from "lucide-react";
import logo from "@/assets/logos/logo-full.png";
import SearchDialog from "./SearchDialog";
import { useLang } from "@/hooks/useLang";
import { useCollection } from "@/hooks/useCollection";
import departmentService from "@/services/departmentService";
import { CENTERS, centerAnchor } from "@/config/centers";

const LINKS = [
  ["/about", "About"],
  ["/admissions", "Admissions"],
  ["/research", "Research"],
  ["/news", "News"],
  ["/events", "Events"],
  ["/contact", "Contact"],
];

const navClass = "block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-brand-800";

function DepartmentGroups({ departments, onNavigate }) {
  return (
    <div className="space-y-5">
      <section aria-label="Departments">
        <h2 className="border-b border-slate-200 pb-2 text-sm font-bold text-slate-900">Departments</h2>
        <div className="mt-2 space-y-2">
          {departments.length ? departments.map((department) => (
            <Link key={department.id} to={`/faculty/${department.id}`} onClick={onNavigate} className={navClass + " bg-slate-100 px-4 py-3 text-slate-900 hover:bg-slate-200"}>
              {department.name}
            </Link>
          )) : (
            <Link to="/department" onClick={onNavigate} className={navClass + " bg-slate-100 px-4 py-3 text-slate-900 hover:bg-slate-200"}>
              View departments
            </Link>
          )}
        </div>
      </section>
      <section aria-label="Centers">
        <h2 className="border-b border-slate-200 pb-2 text-sm font-bold text-slate-900">Centers</h2>
        <div className="mt-2 space-y-2">
          {CENTERS.map((center) => (
            <Link key={center} to={`/centers#${centerAnchor(center)}`} onClick={onNavigate} className={navClass + " bg-slate-100 px-4 py-3 text-slate-900 hover:bg-slate-200"}>
              {center}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [departmentsOpen, setDepartmentsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { lang, toggle } = useLang();
  const { data: departments } = useCollection(departmentService);

  const closeMenu = () => { setMenuOpen(false); setDepartmentsOpen(false); };
  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-brand-50 text-brand-800" : "text-slate-600 hover:bg-slate-50 hover:text-brand-800"}`;

  return (
    <>
      <div className="hidden bg-brand-900 text-white sm:block">
        <div className="container-page flex h-9 items-center justify-between text-xs text-white/80">
          <span>Institute for International Studies and Public Policy</span>
          <span>Royal University of Phnom Penh · Cambodia</span>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm shadow-slate-900/[0.03] backdrop-blur">
        <div className="container-page flex h-[72px] items-center justify-between gap-4">
          <Link to="/" aria-label="IISPP home" onClick={closeMenu} className="shrink-0">
            <img src={logo} alt="IISPP" className="h-10 w-auto sm:h-12" />
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main navigation">
            {LINKS.map(([to, label]) => (
              <NavLink key={to} to={to} className={linkClass}>{label}</NavLink>
            ))}
            <div className="group relative">
              <button type="button" aria-haspopup="true" className={linkClass({ isActive: location.pathname.startsWith("/faculty") || location.pathname === "/centers" })}>
                Departments <ChevronDown className="ml-1 inline h-4 w-4" />
              </button>
              <div className="invisible absolute right-0 top-full z-50 w-[320px] translate-y-2 rounded-xl border border-slate-200 bg-white p-4 opacity-0 shadow-xl transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="max-h-[70vh] overflow-y-auto pr-1">
                  <DepartmentGroups departments={departments} />
                </div>
              </div>
            </div>
          </nav>

          <div className="flex shrink-0 items-center gap-1.5">
            <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search the website" className="grid h-10 w-10 place-items-center rounded-lg text-slate-600 transition hover:bg-brand-50 hover:text-brand-800">
              <Search className="h-[18px] w-[18px]" />
            </button>
            <button type="button" onClick={toggle} className="inline-flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50" aria-label="Change language">
              <Globe2 className="h-4 w-4" />{lang === "en" ? "ខ្មែរ" : "EN"}
            </button>
            <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"} className="grid h-10 w-10 place-items-center rounded-lg text-slate-700 transition hover:bg-slate-100 xl:hidden">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-slate-100 bg-white px-4 py-3 shadow-lg xl:hidden" aria-label="Mobile navigation">
            <div className="container-page grid grid-cols-2 gap-1 sm:grid-cols-3">
              {LINKS.map(([to, label]) => (
                <NavLink key={to} to={to} onClick={closeMenu} className={linkClass}>{label}</NavLink>
              ))}
              <div className="col-span-2 sm:col-span-3">
                <button type="button" onClick={() => setDepartmentsOpen((open) => !open)} aria-expanded={departmentsOpen} className={linkClass({ isActive: departmentsOpen }) + " flex w-full items-center justify-between"}>
                  Departments <ChevronDown className={`h-4 w-4 transition-transform ${departmentsOpen ? "rotate-180" : ""}`} />
                </button>
                {departmentsOpen && <div className="mt-2 rounded-xl border border-slate-200 bg-white p-3"><DepartmentGroups departments={departments} onNavigate={closeMenu} /></div>}
              </div>
            </div>
          </nav>
        )}
      </header>
      {searchOpen && <SearchDialog onClose={() => setSearchOpen(false)} />}
    </>
  );
}
