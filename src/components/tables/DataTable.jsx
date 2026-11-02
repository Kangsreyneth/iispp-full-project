import { useEffect, useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate, truncate } from "@/utils/format";

function Cell({ col, row }) {
  if (col.render) return col.render(row);
  const v = row[col.key];
  const readable = Array.isArray(v) ? v.join(", ") : typeof v === "object" && v ? v.en || v.km || v.url || v.downloadUrl || "" : v;
  if (col.type === "thumb") {
    const src = typeof v === "string" ? v : v?.url || v?.downloadUrl;
    return src ? <img src={src} alt="" className="h-10 w-14 rounded object-cover" /> : <span className="grid h-10 w-14 place-items-center rounded bg-slate-100 text-slate-400"><ImageOff className="h-4 w-4" /></span>;
  }
  if (col.type === "badge") return v ? <Badge value={v} /> : null;
  if (col.type === "date") return formatDate(v);
  return <span className="line-clamp-2">{truncate(String(readable ?? ""), 90)}</span>;
}

/** Searchable, paginated table. Pass actions={(row) => <buttons/>}. */
export default function DataTable({ columns, rows, searchKeys = [], pageSize = 8, actions, emptyTitle, emptyText, selectedIds = [], onSelectionChange, bulkAction }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  useEffect(() => setPage(0), [q]);

  const filtered = useMemo(
    () => (q ? rows.filter((r) => searchKeys.some((k) => {
      const value = r[k];
      const readable = Array.isArray(value) ? value.join(" ") : typeof value === "object" && value ? Object.values(value).join(" ") : value;
      return String(readable ?? "").toLowerCase().includes(q.toLowerCase());
    })) : rows),
    [rows, q, searchKeys]
  );
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const shown = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const selected = new Set(selectedIds);
  const shownSelected = shown.length > 0 && shown.every((row) => selected.has(row.id));

  function toggleRow(id) {
    onSelectionChange?.(selected.has(id) ? selectedIds.filter((value) => value !== id) : [...selectedIds, id]);
  }

  function toggleShown() {
    const shownIds = shown.map((row) => row.id);
    onSelectionChange?.(shownSelected ? selectedIds.filter((id) => !shownIds.includes(id)) : [...new Set([...selectedIds, ...shownIds])]);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {selectedIds.length > 0 && <div className="flex items-center justify-between gap-3 border-b bg-brand-50 px-4 py-3 text-sm"><span className="font-medium text-brand-900">{selectedIds.length} selected</span><div className="flex items-center gap-2"><button type="button" onClick={() => onSelectionChange?.([])} className="rounded px-2 py-1 text-slate-600 hover:bg-white">Clear</button>{bulkAction && <button type="button" onClick={() => bulkAction.onClick(selectedIds)} className="rounded-md bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-700">{bulkAction.label}</button>}</div></div>}
      {searchKeys.length > 0 && (
        <div className="border-b p-3">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" aria-label="Search table" className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-brand-600 focus:outline-none" />
          </div>
        </div>
      )}
      {shown.length === 0 ? (
        <div className="p-6"><EmptyState title={emptyTitle || (q ? "No matches" : "No records yet")} text={emptyText} /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {onSelectionChange && <th className="w-10 px-3 py-3"><input type="checkbox" aria-label="Select current page" checked={shownSelected} onChange={toggleShown} className="h-4 w-4 accent-brand-700" /></th>}
                {columns.map((c) => <th key={c.key} className="px-4 py-3 font-semibold">{c.label}</th>)}
                {actions && <th className="px-4 py-3" />}
              </tr>
            </thead>
            <tbody>
              {shown.map((row) => (
                <tr key={row.id} className="border-t hover:bg-slate-50/60">
                  {onSelectionChange && <td className="px-3 py-3"><input type="checkbox" aria-label={`Select row ${row.title || row.name || row.id}`} checked={selected.has(row.id)} onChange={() => toggleRow(row.id)} className="h-4 w-4 accent-brand-700" /></td>}
                  {columns.map((c) => <td key={c.key} className="px-4 py-3 align-middle"><Cell col={c} row={row} /></td>)}
                  {actions && <td className="whitespace-nowrap px-4 py-3 text-right">{actions(row)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-slate-500">
        <span>{filtered.length} record{filtered.length === 1 ? "" : "s"}</span>
        <div className="flex items-center gap-2">
          <button disabled={page === 0} onClick={() => setPage(page - 1)} aria-label="Previous page" className="rounded border p-1 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
          <span>Page {page + 1} of {pages}</span>
          <button disabled={page >= pages - 1} onClick={() => setPage(page + 1)} aria-label="Next page" className="rounded border p-1 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
}
