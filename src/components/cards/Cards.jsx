import { Link } from "react-router-dom";
import { ArrowRight, Calendar, MapPin, Clock, GraduationCap, User } from "lucide-react";
import CoverImage from "@/components/ui/CoverImage";
import { dayOf, monthOf, formatDate, truncate } from "@/utils/format";

const lift = "group block overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-xl";

export function NewsCard({ item }) {
  return (
    <Link to={`/news/${item.id}`} className={lift}>
      <CoverImage src={item.image} alt={item.title}>
        {item.category && <span className="absolute left-3 top-3 rounded bg-brand-700 px-2.5 py-1 text-xs font-semibold text-white">{item.category}</span>}
      </CoverImage>
      <div className="p-5">
        <p className="flex items-center gap-1.5 text-xs text-slate-500"><Calendar className="h-3.5 w-3.5" /> {formatDate(item.date)}</p>
        <h3 className="mt-2 font-display text-xl font-bold leading-snug text-brand-900 transition group-hover:text-brand-600">{item.title}</h3>
        <p className="mt-2 text-sm text-slate-600">{truncate(item.excerpt || item.content, 110)}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 transition-all group-hover:gap-2">Read more <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  );
}

export function EventCard({ item }) {
  return (
    <Link to={`/events/${item.id}`} className={lift}>
      <CoverImage src={item.image} alt={item.title} ratio="aspect-[16/9]">
        <div className="absolute left-3 top-3 rounded-lg bg-white px-3 py-1.5 text-center leading-none shadow">
          <span className="block font-display text-2xl font-bold text-brand-700">{dayOf(item.date)}</span>
          <span className="text-xs font-semibold uppercase text-slate-500">{monthOf(item.date)}</span>
        </div>
      </CoverImage>
      <div className="p-5">
        <h3 className="font-display text-xl font-bold text-brand-900 transition group-hover:text-brand-600">{item.title}</h3>
        <div className="mt-2 space-y-1 text-sm text-slate-600">
          {item.time && <p className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-brand-600" /> {item.time}</p>}
          {item.location && <p className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-brand-600" /> {item.location}</p>}
        </div>
      </div>
    </Link>
  );
}

export function ProgramCard({ item }) {
  return (
    <Link to={`/academics/${item.id}`} className={lift}>
      <CoverImage src={item.image} alt={item.name} ratio="aspect-[16/9]">
        {item.level && <span className="absolute left-3 top-3 rounded bg-gold-400 px-2.5 py-1 text-xs font-semibold text-brand-900">{item.level}</span>}
      </CoverImage>
      <div className="p-5">
        <h3 className="font-display text-xl font-bold text-brand-900 transition group-hover:text-brand-600">{item.name}</h3>
        <p className="mt-2 text-sm text-slate-600">{truncate(item.description, 100)}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
          {item.duration && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {item.duration}</span>}
          {item.faculty && <span className="flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" /> {item.faculty}</span>}
        </div>
      </div>
    </Link>
  );
}

export function FacultyCard({ item }) {
  return (
    <Link to={`/faculty/${item.id}`} className={lift}>
      <CoverImage src={item.image} alt={item.name} ratio="aspect-[4/3]" />
      <div className="p-5">
        <h3 className="font-display text-xl font-bold text-brand-900 transition group-hover:text-brand-600">{item.name}</h3>
        {item.head && <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><User className="h-4 w-4" /> {item.head}</p>}
        <p className="mt-2 text-sm text-slate-600">{truncate(item.description, 100)}</p>
      </div>
    </Link>
  );
}
