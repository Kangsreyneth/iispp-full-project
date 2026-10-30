import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Newspaper, CalendarDays, GraduationCap, Building2, Mail, UserCheck, Plus, Sparkles, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import newsService from "@/services/newsService";
import eventService from "@/services/eventService";
import programService from "@/services/programService";
import departmentService from "@/services/departmentService";
import messageService from "@/services/messageService";
import userService from "@/services/userService";
import { seedSample } from "@/utils/seed";
import { formatDate } from "@/utils/format";

const safe = (p, fallback) => p.catch(() => fallback);

export default function Dashboard() {
  const { profile } = useAuth();
  const [d, setD] = useState(null);
  const [seeding, setSeeding] = useState(false);

  const load = async () => {
    const [news, events, programs, faculties, newMsgs, pending, recentNews, recentMsgs] = await Promise.all([
      safe(newsService.count(), 0), safe(eventService.count(), 0), safe(programService.count(), 0), safe(departmentService.count(), 0),
      safe(messageService.count("new"), 0), safe(userService.count("pending"), 0),
      safe(newsService.listAll(5), []), safe(messageService.listAll(5), []),
    ]);
    setD({ news, events, programs, faculties, newMsgs, pending, recentNews, recentMsgs });
  };
  useEffect(() => { load(); }, []);

  async function seed() {
    setSeeding(true);
    try { await seedSample(); toast.success("Sample content added"); await load(); }
    catch { toast.error("Could not add sample content"); }
    finally { setSeeding(false); }
  }

  const cards = d && [
    ["News stories", d.news, Newspaper, "/admin/news"], ["Events", d.events, CalendarDays, "/admin/events"],
    ["Programs", d.programs, GraduationCap, "/admin/programs"], ["Faculties", d.faculties, Building2, "/admin/faculties"],
    ["New messages", d.newMsgs, Mail, "/admin/messages"], ["Pending accounts", d.pending, UserCheck, "/admin/users"],
  ];
  const empty = d && d.news + d.events + d.programs + d.faculties === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-800">Welcome back{(profile?.displayName || profile?.name) ? `, ${(profile.displayName || profile.name).split(" ")[0]}` : ""}</h1>
          <p className="text-sm text-slate-500">Manage the IISPP website from here.</p>
        </div>
        <div className="flex gap-2">
          <Button as={Link} to="/admin/news" icon={Plus}>Add news</Button>
          <Button as={Link} to="/" target="_blank" variant="outline" icon={ExternalLink}>View website</Button>
        </div>
      </div>

      {empty && profile?.permissions?.includes("news.publish") && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold-400 bg-brand-50 p-5">
          <div><p className="font-semibold text-brand-800">Your website is empty</p><p className="text-sm text-slate-600">Load a few clearly-labelled sample items to see how it looks, or add your own.</p></div>
          <Button variant="outline" icon={Sparkles} loading={seeding} onClick={seed}>Load sample content</Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {(cards || Array.from({ length: 6 })).map((c, i) => {
          if (!c) return <div key={i} className="h-24 animate-pulse rounded-xl bg-white" />;
          const [label, count, Icon, to] = c;
          return (
            <Link key={label} to={to} className="group flex items-center gap-4 rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-700 text-white transition group-hover:bg-brand-600"><Icon className="h-6 w-6" /></span>
              <div><p className="font-display text-3xl font-bold text-brand-800">{count}</p><p className="text-sm text-slate-500">{label}</p></div>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-display text-xl font-bold text-brand-800">Recent news</h2><Link to="/admin/news" className="text-sm text-brand-700 hover:underline">Manage</Link></div>
          {d?.recentNews.length ? d.recentNews.map((n) => (
            <div key={n.id} className="flex items-center justify-between gap-3 border-t py-3 first:border-0"><div className="min-w-0"><p className="truncate font-medium">{n.title}</p><p className="text-xs text-slate-500">{formatDate(n.date)}</p></div><Badge value={n.status} /></div>
          )) : <p className="py-6 text-center text-sm text-slate-500">No news yet.</p>}
        </section>
        <section className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-display text-xl font-bold text-brand-800">Recent messages</h2><Link to="/admin/messages" className="text-sm text-brand-700 hover:underline">Open inbox</Link></div>
          {d?.recentMsgs.length ? d.recentMsgs.map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-3 border-t py-3 first:border-0"><div className="min-w-0"><p className="truncate font-medium">{m.name} <span className="font-normal text-slate-500">· {m.subject || "No subject"}</span></p><p className="truncate text-xs text-slate-500">{m.message}</p></div><Badge value={m.status} /></div>
          )) : <p className="py-6 text-center text-sm text-slate-500">No messages yet.</p>}
        </section>
      </div>
    </div>
  );
}
