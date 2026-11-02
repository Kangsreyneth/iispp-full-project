import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Newspaper, CalendarDays, GraduationCap, Building2, BookOpen, Users, Mail, UserCheck,
  Plus, ExternalLink, Upload, Activity, Sparkles, ArrowUpRight,
} from "lucide-react";
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
import researchService from "@/services/researchService";
import { makeService } from "@/services/contentService";
import { apiFetch } from "@/services/api/apiService";
import { seedSample } from "@/utils/seed";
import { formatDate } from "@/utils/format";
import Card from "@/admin/components/Card";
import Skeleton from "@/admin/components/Skeleton";
import Tabs from "@/admin/components/Tabs";

const publicationService = makeService("publications");
const safe = async (load, fallback) => {
  try { return await load(); } catch { return fallback; }
};

function can(profile, permission) {
  return profile?.role === "super_admin" || (profile?.permissions || []).some((granted) =>
    granted === "*" || granted === permission || (granted.endsWith(".*") && permission.startsWith(granted.slice(0, -1)))
  );
}

function dateValue(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  if (typeof value === "object" && value.seconds) return new Date(value.seconds * 1000);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function monthSeries(records) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => new Date(now.getFullYear(), now.getMonth() - 5 + index, 1));
  const values = months.map((date) => ({ key: `${date.getFullYear()}-${date.getMonth()}`, label: date.toLocaleDateString(undefined, { month: "short" }), count: 0 }));
  records.forEach((item) => {
    const date = dateValue(item.createdAt || item.updatedAt || item.publishedAt || item.date || item.startAt);
    if (!date) return;
    const row = values.find((month) => month.key === `${date.getFullYear()}-${date.getMonth()}`);
    if (row) row.count += 1;
  });
  return values;
}

function BarChart({ rows, color = "bg-brand-700", label }) {
  const max = Math.max(1, ...rows.map((row) => row.count));
  return (
    <div className="flex h-48 items-end gap-3 border-b border-l border-slate-200 px-3 pb-1 pt-5" role="img" aria-label={label}>
      {rows.map((row) => (
        <div key={row.key || row.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
          <span className="text-xs font-semibold text-slate-500">{row.count}</span>
          <div className={`w-full max-w-10 rounded-t-md ${color}`} style={{ height: `${Math.max(4, (row.count / max) * 75)}%` }} title={`${row.label}: ${row.count}`} />
          <span className="text-[11px] text-slate-500">{row.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { profile } = useAuth();
  const [data, setData] = useState(null);
  const [activeChart, setActiveChart] = useState("monthly");
  const [seeding, setSeeding] = useState(false);
  const permissionKey = `${profile?.role || ""}:${(profile?.permissions || []).join(",")}`;

  useEffect(() => {
    let active = true;
    const load = async () => {
      const view = (permission, loader, fallback = null) => can(profile, permission) ? safe(loader, fallback) : Promise.resolve(null);
      const [newsCount, eventsCount, programsCount, facultiesCount, researchCount, publicationsCount, messagesCount, users, news, events, messages, audit] = await Promise.all([
        view("news.view", () => newsService.count(), 0),
        view("events.view", () => eventService.count(), 0),
        view("programs.view", () => programService.count(), 0),
        view("departments.view", () => departmentService.count(), 0),
        view("research.view", () => researchService.count(), 0),
        view("publications.view", () => publicationService.count(), 0),
        view("messages.view", () => messageService.count("new"), 0),
        view("users.view", () => userService.listAll(1000), []),
        view("news.view", () => newsService.listAll(200), []),
        view("events.view", () => eventService.listAll(200), []),
        view("messages.view", () => messageService.listAll(5), []),
        view("audit.view", async () => (await apiFetch("/admin/activity-logs?limit=8"))?.data || [], []),
      ]);
      if (!active) return;
      const pendingUsers = users?.filter((user) => user.status === "pending") || [];
      setData({
        stats: [
          { label: "Posts", value: newsCount, icon: Newspaper, to: "/admin/news", permission: "news.view" },
          { label: "Events", value: eventsCount, icon: CalendarDays, to: "/admin/events", permission: "events.view" },
          { label: "Programs", value: programsCount, icon: GraduationCap, to: "/admin/programs", permission: "programs.view" },
          { label: "Faculty", value: facultiesCount, icon: Building2, to: "/admin/faculties", permission: "departments.view" },
          { label: "Students", value: null, icon: Users, to: null, note: "Not supported by the current CMS API" },
          { label: "Publications", value: publicationsCount, icon: BookOpen, to: "/admin/publications", permission: "publications.view" },
          { label: "Unread messages", value: messagesCount, icon: Mail, to: "/admin/messages", permission: "messages.view" },
          { label: "Pending users", value: pendingUsers.length, icon: UserCheck, to: "/admin/users", permission: "users.view" },
        ],
        pendingUsers: pendingUsers.slice(0, 5),
        recentNews: (news || []).slice(0, 5),
        recentMessages: messages || [],
        activity: audit || [],
        monthly: monthSeries([...(news || []), ...(events || [])]),
        categories: Object.entries((news || []).reduce((acc, item) => { const key = item.category || "Other"; acc[key] = (acc[key] || 0) + 1; return acc; }, {})).map(([label, count]) => ({ label, count })),
      });
    };
    load();
    return () => { active = false; };
  }, [permissionKey]);

  const chartRows = useMemo(() => {
    if (activeChart === "monthly") return data?.monthly || [];
    return data?.categories?.length ? data.categories : [{ label: "No posts", count: 0 }];
  }, [activeChart, data]);

  async function seed() {
    setSeeding(true);
    try { await seedSample(); toast.success("Sample content added"); window.location.reload(); }
    catch { toast.error("Could not add sample content"); }
    finally { setSeeding(false); }
  }

  const empty = data && data.stats.slice(0, 4).every((stat) => stat.value === 0 || stat.value === null);
  const stats = data?.stats.filter((stat) => !stat.permission || can(profile, stat.permission));

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-700">Overview</p>
          <h2 className="mt-1 font-display text-3xl font-bold text-brand-900">Welcome back{(profile?.displayName || profile?.name) ? `, ${(profile.displayName || profile.name).split(" ")[0]}` : ""}</h2>
          <p className="mt-1 text-sm text-slate-500">Manage IISPP content and review recent activity.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button as={Link} to="/admin/news" icon={Plus}>New post</Button>
          <Button as={Link} to="/admin/events" variant="outline" icon={CalendarDays}>New event</Button>
          <Button as={Link} to="/admin/media" variant="outline" icon={Upload}>Upload media</Button>
          <Button as={Link} to="/" target="_blank" variant="ghost" icon={ExternalLink} className="hidden sm:inline-flex">View website</Button>
        </div>
      </div>

      {empty && profile?.permissions?.includes("news.publish") && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold-400/60 bg-[#FFF9E9] p-5">
          <div><p className="font-semibold text-brand-900">Your website is empty</p><p className="text-sm text-slate-600">Add your own content or load clearly-labelled sample items to preview the site.</p></div>
          <Button variant="outline" icon={Sparkles} loading={seeding} onClick={seed}>Load sample content</Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(stats || Array.from({ length: 8 })).map((stat, index) => {
          if (!stat) return <Skeleton key={index} className="h-28" rounded="rounded-2xl" />;
          const Icon = stat.icon;
          const content = <><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-800"><Icon className="h-5 w-5" /></span><span className="min-w-0"><span className="block text-2xl font-bold text-slate-900">{stat.value == null ? "—" : stat.value}</span><span className="block text-sm text-slate-500">{stat.label}</span>{stat.note && <span className="mt-1 block text-[11px] leading-tight text-slate-400">{stat.note}</span>}</span>{stat.to && <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-slate-300" />}</>;
          return stat.to ? <Link key={stat.label} to={stat.to} className="flex min-h-28 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md">{content}</Link> : <div key={stat.label} className="flex min-h-28 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">{content}</div>;
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <Card title="Content overview" description="Recent content created across the website" action={<Tabs value={activeChart} onChange={setActiveChart} items={[{ value: "monthly", label: "By month" }, { value: "categories", label: "By category" }]} />}>
          {!data ? <Skeleton className="h-48 w-full" /> : <BarChart rows={chartRows} color={activeChart === "monthly" ? "bg-brand-700" : "bg-gold-500"} label={activeChart === "monthly" ? "Content created per month" : "Posts by category"} />}
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500"><Activity className="h-4 w-4 text-gold-500" />Counts are based on records available to your role.</div>
        </Card>

        <Card title="Recent activity" description="Latest updates made in the CMS" action={<Link to="/admin/activity" className="text-sm font-semibold text-brand-700 hover:underline">View log</Link>}>
          {!data ? <div className="space-y-4">{[0, 1, 2, 3].map((item) => <Skeleton key={item} className="h-9 w-full" />)}</div> : data.activity.length ? (
            <ul className="space-y-4">{data.activity.slice(0, 6).map((entry, index) => <li key={entry.id || index} className="flex gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold-500" /><div className="min-w-0 flex-1"><p className="text-sm text-slate-700"><span className="font-semibold">{entry.actorName || entry.actorUid || "Staff"}</span> {String(entry.action || "updated").replaceAll("_", " ")} <span className="font-medium">{entry.resourceType || entry.module || "content"}</span></p><p className="mt-0.5 text-xs text-slate-400">{formatDate(entry.timestamp || entry.createdAt)}</p></div></li>)}</ul>
          ) : <p className="py-6 text-sm text-slate-500">Activity records are unavailable for this role or no activity has been recorded.</p>}
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card title="Pending approvals" description="Accounts waiting for access" action={<Link to="/admin/users" className="text-sm font-semibold text-brand-700 hover:underline">Manage</Link>}>
          {!data ? <Skeleton className="h-24 w-full" /> : data.pendingUsers.length ? <ul className="space-y-3">{data.pendingUsers.map((user) => <li key={user.id} className="flex items-center justify-between gap-3"><span className="min-w-0"><span className="block truncate text-sm font-semibold text-slate-800">{user.name || user.email}</span><span className="block truncate text-xs text-slate-500">{user.email}</span></span><Badge value="pending" /></li>)}</ul> : <p className="py-4 text-sm text-slate-500">No pending approvals.</p>}
        </Card>

        <Card title="Latest posts" description="Recently edited website content" action={<Link to="/admin/news" className="text-sm font-semibold text-brand-700 hover:underline">All posts</Link>}>
          {!data ? <Skeleton className="h-24 w-full" /> : data.recentNews.length ? <ul className="space-y-3">{data.recentNews.map((item) => <li key={item.id} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0"><span className="min-w-0"><span className="block truncate text-sm font-medium text-slate-800">{item.title}</span><span className="mt-0.5 block text-xs text-slate-500">{formatDate(item.updatedAt || item.date || item.createdAt)}</span></span><Badge value={item.status} /></li>)}</ul> : <p className="py-4 text-sm text-slate-500">No posts available.</p>}
        </Card>

        <Card title="Latest messages" description="Recent contact form submissions" action={<Link to="/admin/messages" className="text-sm font-semibold text-brand-700 hover:underline">Open inbox</Link>}>
          {!data ? <Skeleton className="h-24 w-full" /> : data.recentMessages.length ? <ul className="space-y-3">{data.recentMessages.slice(0, 4).map((message) => <li key={message.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0"><p className="truncate text-sm font-semibold text-slate-800">{message.name} <span className="font-normal text-slate-500">· {message.subject || "No subject"}</span></p><p className="mt-0.5 truncate text-xs text-slate-500">{message.message}</p><p className="mt-1 text-[11px] text-slate-400">{formatDate(message.createdAt)}</p></li>)}</ul> : <p className="py-4 text-sm text-slate-500">No messages yet.</p>}
        </Card>
      </div>
    </div>
  );
}
