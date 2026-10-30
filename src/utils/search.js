
import { truncate } from "./format";

const clean = (value) => {
  if (value == null) return "";

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(clean).filter(Boolean).join(" ");
  }

  return "";
};

const normalize = (value) =>
  clean(value)
    .normalize("NFC")
    .toLocaleLowerCase()
    .trim();

const makeText = (...values) =>
  values.map(clean).filter(Boolean).join(" ");

const getId = (item) => item?.id ?? item?._id ?? item?.slug ?? "";

const getImage = (item) =>
  item?.image ?? item?.imageUrl ?? item?.coverImage ?? "";

const getKeywords = (item) =>
  makeText(item?.keywords, item?.tags, item?.category);

function makeEntry(item, type, title, to, description, extra = {}) {
  const safeTitle = clean(title);
  const safeDescription = clean(description);

  return {
    id: clean(getId(item)) || `${type}-${safeTitle}`,
    type,
    title: safeTitle,
    text: safeDescription,
    snippet: truncate(safeDescription, 110),
    to,
    image: getImage(item),
    keywords: getKeywords(item),
    ...extra,
  };
}

/**
 * Build one searchable index from IISPP public collections.
 */
export function buildIndex({
  news = [],
  events = [],
  programs = [],
  faculties = [],
}) {
  const entries = [
    ...news.map((item) =>
      makeEntry(
        item,
        "News",
        item.title ?? item.name,
        `/news/${getId(item)}`,
        makeText(
          item.titleKm,
          item.nameKm,
          item.excerpt,
          item.description,
          item.content,
          item.category,
          item.author,
          getKeywords(item)
        ),
        { date: item.date ?? item.publishedAt }
      )
    ),

    ...events.map((item) =>
      makeEntry(
        item,
        "Event",
        item.title ?? item.name,
        `/events/${getId(item)}`,
        makeText(
          item.titleKm,
          item.nameKm,
          item.description,
          item.content,
          item.location,
          item.category,
          getKeywords(item)
        ),
        { date: item.date ?? item.startDate }
      )
    ),

    ...programs.map((item) =>
      makeEntry(
        item,
        "Program",
        item.name ?? item.title,
        `/academics/${getId(item)}`,
        makeText(
          item.titleKm,
          item.nameKm,
          item.description,
          item.level,
          item.degree,
          item.faculty,
          item.department,
          item.category,
          getKeywords(item)
        )
      )
    ),

    ...faculties.map((item) =>
      makeEntry(
        item,
        "Faculty / Department",
        item.name ?? item.title,
        item.to ?? `/faculty/${getId(item)}`,
        makeText(
          item.titleKm,
          item.nameKm,
          item.description,
          item.head,
          item.dean,
          item.department,
          item.category,
          getKeywords(item)
        )
      )
    ),
  ];

  return entries.filter((item) => item.title && item.to);
}

/**
 * Search by title, description, keywords, and metadata.
 * Supports short queries, including a single character.
 */
export function searchIndex(index = [], query = "") {
  const q = normalize(query);

  if (!q || !Array.isArray(index)) return [];

  const words = q.split(/\s+/).filter(Boolean);

  return index
    .map((item) => {
      const title = normalize(item.title);
      const text = normalize(item.text);
      const keywords = normalize(item.keywords);
      const type = normalize(item.type);

      const searchableText = `${title} ${text} ${keywords} ${type}`;

      if (!words.every((word) => searchableText.includes(word))) {
        return null;
      }

      let score = 0;

      if (title === q) score += 100;
      else if (title.startsWith(q)) score += 60;
      else if (title.includes(q)) score += 40;

      if (keywords.includes(q)) score += 25;
      if (text.includes(q)) score += 10;

      return {
        ...item,
        snippet: item.text
          ? truncate(item.text, 110)
          : item.title,
        score,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
}
