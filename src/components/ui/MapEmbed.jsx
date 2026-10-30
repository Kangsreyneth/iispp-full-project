import { ExternalLink } from "lucide-react";

/** OpenStreetMap embed with a Google Maps link. Coordinates come from Dashboard → Settings. */
export default function MapEmbed({ lat, lng, height = "h-80", label = "Get directions" }) {
  const la = Number(lat), lo = Number(lng), d = 0.008;
  if (!la || !lo) return null;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lo - d}%2C${la - d}%2C${lo + d}%2C${la + d}&layer=mapnik&marker=${la}%2C${lo}`;
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
      <iframe title="Map" src={src} loading="lazy" className={`w-full ${height}`} />
      <a href={`https://www.google.com/maps/dir/?api=1&destination=${la},${lo}`} target="_blank" rel="noreferrer"
         className="flex items-center justify-center gap-2 bg-white py-3 text-sm font-medium text-brand-700 hover:bg-brand-50">
        {label} <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
}
