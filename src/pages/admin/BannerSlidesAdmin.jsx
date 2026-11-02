import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Card from "@/admin/components/Card";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import ImageUpload from "@/components/ui/ImageUpload";
import { homepageAdminService } from "@/services/adminSiteService";

const emptySlide = { content: { heading: { en: "", km: "" }, subheading: { en: "", km: "" } }, settings: { backgroundImage: null, buttons: [{ label: { en: "Discover research", km: "" }, url: "/research", variant: "primary" }], overlay: "maroon", align: "left" }, isEnabled: true };
const localized = (value) => typeof value === "string" ? { en: value, km: "" } : { en: value?.en || "", km: value?.km || "" };
const sourceOf = (value) => typeof value === "string" ? value : value?.url || value?.downloadUrl || "";

export default function BannerSlidesAdmin() {
  const [sections, setSections] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [language, setLanguage] = useState("en");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try { setSections((await homepageAdminService.list()).sort((a, b) => (a.order || 0) - (b.order || 0))); }
    catch (error) { toast.error(error.message || "Could not load homepage sections"); setSections([]); }
  }, []);
  useEffect(() => { load(); }, [load]);
  const slides = sections?.filter((section) => section.type === "hero") || [];

  function startEdit(section = null) {
    const source = section || { ...emptySlide, order: (sections?.length || 0) * 10 + 10 };
    setEditing({
      ...source,
      content: { ...source.content, heading: localized(source.content?.heading), subheading: localized(source.content?.subheading) },
      settings: { ...source.settings, backgroundImage: source.settings?.backgroundImage ? { url: source.settings.backgroundImage.url, mediaId: source.settings.backgroundImage.mediaId } : null, buttons: source.settings?.buttons?.length ? source.settings.buttons.map((button) => ({ ...button, label: localized(button.label) })) : emptySlide.settings.buttons },
      isEnabled: source.isEnabled ?? true,
    });
  }

  async function save(event) {
    event.preventDefault();
    if (!editing.settings.backgroundImage?.mediaId) return toast.error("Choose a banner image from the media library or upload one.");
    if (!editing.settings.buttons?.[0]?.url) return toast.error("The banner button needs a destination URL.");
    setSaving(true);
    const payload = { type: "hero", order: Number(editing.order) || 10, isEnabled: !!editing.isEnabled, content: editing.content, settings: { ...editing.settings, backgroundImage: { mediaId: editing.settings.backgroundImage.mediaId } } };
    try {
      if (editing.id) await homepageAdminService.update(editing.id, payload);
      else await homepageAdminService.create(payload);
      toast.success(editing.id ? "Banner slide updated" : "Banner slide added");
      setEditing(null);
      await load();
    } catch (error) { toast.error(error.message || "Could not save banner slide"); }
    finally { setSaving(false); }
  }

  async function toggleEnabled(section) {
    try { await homepageAdminService.update(section.id, { isEnabled: !section.isEnabled }); toast.success(section.isEnabled ? "Slide disabled" : "Slide enabled"); await load(); }
    catch (error) { toast.error(error.message || "Could not update slide"); }
  }

  async function move(section, direction) {
    const all = [...sections].sort((a, b) => (a.order || 0) - (b.order || 0));
    const heroIndices = all.map((item, index) => item.type === "hero" ? index : -1).filter((index) => index >= 0);
    const index = heroIndices.findIndex((position) => all[position].id === section.id);
    const target = heroIndices[index + direction];
    if (target == null) return;
    const current = heroIndices[index];
    [all[current], all[target]] = [all[target], all[current]];
    try { await homepageAdminService.reorder(all.map((item) => item.id)); await load(); }
    catch (error) { toast.error(error.message || "Could not reorder homepage sections"); }
  }

  async function remove() {
    try { await homepageAdminService.remove(deleting.id); toast.success("Banner slide deleted"); setDeleting(null); await load(); }
    catch (error) { toast.error(error.message || "Could not delete banner slide"); }
  }

  const setLocalized = (field, value) => setEditing((item) => ({ ...item, content: { ...item.content, [field]: { ...item.content[field], [language]: value } } }));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-700">Homepage content</p><h2 className="mt-1 font-display text-3xl font-bold text-brand-900">Banner slides</h2><p className="text-sm text-slate-500">Edit the bilingual homepage hero slides and their order.</p></div><Button icon={Plus} onClick={() => startEdit()}>Add slide</Button></div>
      <Card title="Hero carousel" description="Disabled slides stay saved but do not appear on the public homepage.">
        {sections === null ? <Spinner /> : slides.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {slides.map((slide, index) => <article key={slide.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="relative aspect-[16/8] bg-slate-100"><img src={sourceOf(slide.settings?.backgroundImage)} alt={localized(slide.content?.heading).en} className="h-full w-full object-cover" /><span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${slide.isEnabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>{slide.isEnabled ? "Active" : "Hidden"}</span></div>
            <div className="p-4"><p className="font-display text-lg font-bold text-brand-900">{localized(slide.content?.heading).en || "Untitled banner"}</p><p className="mt-1 line-clamp-2 text-sm text-slate-500">{localized(slide.content?.subheading).en}</p><div className="mt-4 flex items-center justify-between gap-2 border-t pt-3"><span className="text-xs text-slate-400">Order {slide.order ?? index + 1}</span><div className="flex gap-1"><button type="button" onClick={() => move(slide, -1)} title="Move up" aria-label="Move slide up" className="rounded p-2 text-slate-500 hover:bg-slate-100"><ArrowUp className="h-4 w-4" /></button><button type="button" onClick={() => move(slide, 1)} title="Move down" aria-label="Move slide down" className="rounded p-2 text-slate-500 hover:bg-slate-100"><ArrowDown className="h-4 w-4" /></button><button type="button" onClick={() => toggleEnabled(slide)} className="rounded px-2 text-xs font-semibold text-brand-700 hover:bg-brand-50">{slide.isEnabled ? "Hide" : "Show"}</button><button type="button" onClick={() => startEdit(slide)} aria-label="Edit slide" className="rounded p-2 text-slate-500 hover:bg-slate-100 hover:text-brand-700"><Pencil className="h-4 w-4" /></button><button type="button" onClick={() => setDeleting(slide)} aria-label="Delete slide" className="rounded p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div></div></div>
          </article>)}
        </div> : <EmptyState title="No banner slides yet" text="Add an enabled hero section to replace the safe default slides on the public homepage." />}
      </Card>

      {editing && <Modal title={editing.id ? "Edit banner slide" : "Add banner slide"} onClose={() => setEditing(null)} size="max-w-3xl">
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          <div className="col-span-full flex items-center justify-between gap-3"><p className="text-sm font-semibold text-slate-700">Slide copy</p><div className="inline-flex rounded-lg bg-slate-100 p-1" role="tablist" aria-label="Slide language">{[["en", "English"], ["km", "Khmer"]].map(([code, label]) => <button key={code} type="button" role="tab" aria-selected={language === code} onClick={() => setLanguage(code)} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${language === code ? "bg-white text-brand-800 shadow-sm" : "text-slate-600"}`}>{label}</button>)}</div></div>
          <label className="block text-sm font-medium text-slate-700">Title ({language.toUpperCase()})<input required={language === "en"} lang={language} value={editing.content.heading[language]} onChange={(event) => setLocalized("heading", event.target.value)} className={`mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 ${language === "km" ? "[font-family:'Noto_Sans_Khmer',sans-serif] leading-relaxed" : ""}`} /></label>
          <label className="block text-sm font-medium text-slate-700">Subtitle ({language.toUpperCase()})<textarea rows={2} lang={language} value={editing.content.subheading[language]} onChange={(event) => setLocalized("subheading", event.target.value)} className={`mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 ${language === "km" ? "[font-family:'Noto_Sans_Khmer',sans-serif] leading-relaxed" : ""}`} /></label>
          <div className="col-span-full"><p className="mb-1 text-sm font-medium text-slate-700">Banner image</p><ImageUpload value={editing.settings.backgroundImage} folder="site" onChange={(image) => setEditing((item) => ({ ...item, settings: { ...item.settings, backgroundImage: image } }))} /></div>
          <label className="block text-sm font-medium text-slate-700">Button text (English)<input required value={editing.settings.buttons[0]?.label?.en || ""} onChange={(event) => setEditing((item) => ({ ...item, settings: { ...item.settings, buttons: [{ ...item.settings.buttons[0], label: { ...item.settings.buttons[0].label, en: event.target.value } }] } }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" /></label>
          <label className="block text-sm font-medium text-slate-700">Button text (Khmer)<input lang="km" value={editing.settings.buttons[0]?.label?.km || ""} onChange={(event) => setEditing((item) => ({ ...item, settings: { ...item.settings, buttons: [{ ...item.settings.buttons[0], label: { ...item.settings.buttons[0].label, km: event.target.value } }] } }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 [font-family:'Noto_Sans_Khmer',sans-serif] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" /></label>
          <label className="block text-sm font-medium text-slate-700">Button destination<input required value={editing.settings.buttons[0]?.url || ""} onChange={(event) => setEditing((item) => ({ ...item, settings: { ...item.settings, buttons: [{ ...item.settings.buttons[0], url: event.target.value }] } }))} placeholder="/research" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" /></label>
          <label className="block text-sm font-medium text-slate-700">Order<input type="number" min="0" value={editing.order || 0} onChange={(event) => setEditing((item) => ({ ...item, order: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" /></label>
          <label className="col-span-full flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={!!editing.isEnabled} onChange={(event) => setEditing((item) => ({ ...item, isEnabled: event.target.checked }))} className="h-4 w-4 accent-brand-700" />Show on public homepage</label>
          <div className="col-span-full flex justify-end gap-2 border-t pt-4"><Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit" loading={saving} icon={ImagePlus}>Save slide</Button></div>
        </form>
      </Modal>}
      {deleting && <ConfirmDialog title="Delete this banner slide?" text="This will remove the slide from the homepage carousel." onConfirm={remove} onClose={() => setDeleting(null)} />}
    </div>
  );
}
