import { apiFetch, publicApiFetch } from "./api/apiService";

const RESOURCE = {
  news: "news",
  events: "events",
  programs: "programs",
  departments: "departments",
  faculties: "departments",
  pages: "pages",
};

const text = (value, lang = "en") => typeof value === "string"
  ? value
  : value?.[lang] || value?.en || value?.km || "";
const dateOnly = (value) => value ? String(value).slice(0, 10) : "";
function localizedValue(value, existing, creating) {
  if (typeof value !== "string") return value;
  if (!creating && existing && typeof existing === "object") return { ...existing, en: value };
  return { en: value, km: "" };
}
const mediaUrl = (value) => typeof value === "string" ? value : value?.url || value?.downloadUrl || "";
const mediaId = (value) => typeof value === "object" && value ? value.mediaId || value.id || "" : "";

function mapItem(resource, item, isPublic = false, lang = "en") {
  if (!item) return null;
  const image = resource === "pages" ? item.featuredImage : item.image;
  const id = isPublic && ["news", "programs", "pages"].includes(resource) ? item.slug || item.id : item.id;
  const common = { ...item, id, image: isPublic ? mediaUrl(image) : { url: mediaUrl(image), mediaId: mediaId(image) }, status: item.status || "published" };

  if (resource === "pages") return {
    ...common,
    title: text(item.title, lang),
    excerpt: text(item.excerpt, lang),
    content: text(item.content, lang),
  };

  if (resource === "news") return {
    ...common,
    title: text(item.title, lang),
    excerpt: text(item.summary, lang),
    content: text(item.content, lang),
    category: text(item.category, lang),
    date: dateOnly(item.date || item.publishedAt || item.createdAt),
  };
  if (resource === "events") return {
    ...common,
    title: text(item.title, lang),
    description: text(item.description, lang),
    date: dateOnly(item.startAt || item.date),
    time: item.time || "",
    location: text(item.location, lang),
  };
  if (resource === "programs") return {
    ...common,
    name: text(item.title, lang),
    title: text(item.title, lang),
    description: text(item.description, lang),
  };
  if (resource === "departments") return {
    ...common,
    name: text(item.name || item.title, lang),
    description: text(item.description, lang),
  };
  if (resource === "research") return {
    ...common,
    title: text(item.title, lang),
    abstract: text(item.abstract, lang),
    publicationDate: dateOnly(item.publicationDate),
  };
  return { ...common, title: text(item.title, lang) };
}

function payload(resource, values, creating = false, original = {}) {
  const data = { ...values };
  const image = data.image;
  delete data.id;
  delete data.createdAt;
  delete data.updatedAt;

  if (resource === "pages") {
    data.title = localizedValue(data.title, original.title, creating);
    data.excerpt = localizedValue(data.excerpt, original.excerpt, creating);
    data.content = localizedValue(data.content, original.content, creating);
    if (image === "") data.featuredImage = null;
    else if (mediaId(image)) data.featuredImage = { mediaId: mediaId(image) };
    else delete data.featuredImage;
    delete data.image;
  } else if (resource === "news") {
    data.title = localizedValue(data.title, original.title, creating);
    data.summary = localizedValue(data.excerpt, original.summary, creating);
    data.content = localizedValue(data.content, original.content, creating);
    delete data.excerpt;
    if (image === "") data.image = null;
    else if (mediaId(image)) data.image = { mediaId: mediaId(image) };
    else delete data.image;
  } else if (resource === "events") {
    data.title = localizedValue(data.title, original.title, creating);
    data.description = localizedValue(data.description, original.description, creating);
    data.location = localizedValue(data.location, original.location, creating);
    const day = dateOnly(data.date);
    if (day) {
      const time = String(data.time || "").match(/\b([01]?\d|2[0-3]):[0-5]\d\b/)?.[0] || "00:00";
      data.startAt = `${day}T${time}:00`;
    }
    delete data.date;
    if (image === "") data.image = null;
    else if (mediaId(image)) data.image = { mediaId: mediaId(image) };
    else delete data.image;
  } else if (resource === "programs") {
    data.title = localizedValue(data.name || data.title, original.title, creating);
    data.description = localizedValue(data.description, original.description, creating);
    delete data.name;
    if (image === "") data.image = null;
    else if (mediaId(image)) data.image = { mediaId: mediaId(image) };
    else delete data.image;
  } else if (resource === "departments") {
    data.name = localizedValue(data.name, original.name, creating);
    data.description = localizedValue(data.description, original.description, creating);
    if (image === "") data.image = null;
    else if (mediaId(image)) data.image = { mediaId: mediaId(image) };
    else delete data.image;
  }

  return data;
}

async function list(resource, endpoint, max, isPublic, lang = "en") {
  const rows = [];
  let cursor = "";
  do {
    const query = new URLSearchParams({ limit: String(Math.min(50, max - rows.length)) });
    if (cursor) query.set("cursor", cursor);
    const response = isPublic
      ? await publicApiFetch(`/public/${endpoint}?${query}`)
      : await apiFetch(`/admin/${endpoint}?${query}`);
    rows.push(...(response?.data || []).map((item) => mapItem(resource, item, isPublic, lang)));
    cursor = response?.meta?.nextCursor || "";
  } while (cursor && rows.length < max);
  return rows.slice(0, max);
}

/** Laravel-backed content operations. Public methods never send Firebase user credentials. */
export function makeService(collection) {
  const resource = RESOURCE[collection] || collection;
  return {
    col: collection,
    listPublished: (max = 100, lang = "en") => list(resource, resource, max, true, lang),
    listAll: (max = 300) => list(resource, resource, max, false),
    get: async (key, lang = "en") => {
      const response = await publicApiFetch(`/public/${resource}/${encodeURIComponent(key)}`);
      return mapItem(resource, response?.data, true, lang);
    },
    create: (values) => apiFetch(`/admin/${resource}`, { method: "POST", body: JSON.stringify(payload(resource, values, true)) }),
    update: (id, values) => {
      if (Object.keys(values).length === 1 && values.status) {
        return apiFetch(`/admin/${resource}/${encodeURIComponent(id)}`).then(async (current) => {
          const record = current?.data || {};
          const localized = resource === "departments" ? record.name : record.title;
          if (typeof localized === "string") {
            const normalized = payload(resource, mapItem(resource, record, false), false, record);
            await apiFetch(`/admin/${resource}/${encodeURIComponent(id)}`, {
              method: "PUT", body: JSON.stringify(normalized),
            });
          }
          return apiFetch(`/admin/${resource}/${encodeURIComponent(id)}/status`, {
            method: "POST", body: JSON.stringify({ status: values.status }),
          });
        });
      }
      return apiFetch(`/admin/${resource}/${encodeURIComponent(id)}`).then((current) => apiFetch(`/admin/${resource}/${encodeURIComponent(id)}`, {
        method: "PUT", body: JSON.stringify(payload(resource, values, false, current?.data || {})),
      }));
    },
    remove: (id) => apiFetch(`/admin/${resource}/${encodeURIComponent(id)}`, { method: "DELETE" }),
    count: async (status) => (await list(resource, resource, 1000, false)).filter((item) => !status || item.status === status).length,
  };
}
