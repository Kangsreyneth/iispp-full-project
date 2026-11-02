import { useRef } from "react";
import { Bold, Heading2, Italic, Link2, List, ListOrdered, Table2, Image } from "lucide-react";

const tools = [
  ["Heading", Heading2, (value) => `<h2>${value || "Heading"}</h2>`],
  ["Bold", Bold, (value) => `<strong>${value || "text"}</strong>`],
  ["Italic", Italic, (value) => `<em>${value || "text"}</em>`],
  ["Bulleted list", List, (value) => `<ul><li>${value || "List item"}</li></ul>`],
  ["Numbered list", ListOrdered, (value) => `<ol><li>${value || "List item"}</li></ol>`],
  ["Table", Table2, () => "<table><tbody><tr><th>Heading</th><th>Heading</th></tr><tr><td>Cell</td><td>Cell</td></tr></tbody></table>"],
];

export default function RichTextEditor({ value = "", onChange, rows = 9, lang = "en" }) {
  const textarea = useRef(null);

  function insert(transform) {
    const field = textarea.current;
    if (!field) return;
    const start = field.selectionStart;
    const end = field.selectionEnd;
    const selected = field.value.slice(start, end);
    const replacement = transform(selected);
    const next = `${field.value.slice(0, start)}${replacement}${field.value.slice(end)}`;
    onChange(next);
    requestAnimationFrame(() => {
      field.focus();
      field.setSelectionRange(start + replacement.length, start + replacement.length);
    });
  }

  function insertLink() {
    const url = window.prompt("Enter the link URL", "https://");
    if (!url) return;
    insert((text) => `<a href="${url}">${text || "Link text"}</a>`);
  }

  function insertImage() {
    const url = window.prompt("Enter the image URL", "https://");
    if (!url) return;
    const alt = window.prompt("Describe the image", "") || "";
    insert(() => `<img src="${url}" alt="${alt}" />`);
  }

  return (
    <div className="mt-1 overflow-hidden rounded-lg border border-slate-300 bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
      <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-2" role="toolbar" aria-label="Rich text formatting">
        {tools.map(([label, Icon, transform]) => <button key={label} type="button" title={label} aria-label={label} onClick={() => insert(transform)} className="grid h-8 w-8 place-items-center rounded-md text-slate-600 hover:bg-white hover:text-brand-800"><Icon className="h-4 w-4" /></button>)}
        <button type="button" title="Insert link" aria-label="Insert link" onClick={insertLink} className="grid h-8 w-8 place-items-center rounded-md text-slate-600 hover:bg-white hover:text-brand-800"><Link2 className="h-4 w-4" /></button>
        <button type="button" title="Insert image" aria-label="Insert image" onClick={insertImage} className="grid h-8 w-8 place-items-center rounded-md text-slate-600 hover:bg-white hover:text-brand-800"><Image className="h-4 w-4" /></button>
      </div>
      <textarea ref={textarea} rows={rows} lang={lang} value={value} onChange={(event) => onChange(event.target.value)} className={`w-full resize-y border-0 px-3 py-3 text-sm leading-6 outline-none ${lang === "km" ? "[font-family:'Noto_Sans_Khmer',sans-serif] leading-relaxed" : ""}`} placeholder="Write formatted HTML content. Use the toolbar to insert common formatting." />
    </div>
  );
}
