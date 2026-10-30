/**
 * Everything the admin CRUD pages need, per collection.
 * To add a field: add one line to `fields` (and a column if you want it in the table).
 * Field types: text, textarea, select, date, number, email, tel, url, checkbox, image, heading.
 */
import newsService from "@/services/newsService";
import eventService from "@/services/eventService";
import programService from "@/services/programService";
import departmentService from "@/services/departmentService";
import pageService from "@/services/pageService";
import { LEVELS, NEWS_CATEGORIES } from "@/utils/constants";

const STATUS = { name: "status", label: "Status", type: "select", options: ["published", "draft"], default: "published", required: true, half: true };

export const RESOURCES = {
  pages: {
    title: "Pages", singular: "page", path: "", service: pageService, searchKeys: ["title", "slug"],
    columns: [
      { key: "title", label: "Title" }, { key: "slug", label: "Slug" },
      { key: "status", label: "Status", type: "badge" },
    ],
    fields: [
      { name: "title", label: "Page title", required: true, max: 200 },
      { name: "slug", label: "URL slug", help: "Leave blank to generate from the title." },
      { name: "excerpt", label: "Summary", type: "textarea", rows: 3 },
      { name: "content", label: "Page content", type: "textarea", rows: 10, required: true },
      { name: "image", label: "Featured image", type: "image", folder: "pages" },
      { name: "parentId", label: "Parent page ID", help: "Optional. Use the parent page ID." },
      { name: "showInNavigation", label: "Show in navigation", type: "checkbox" },
      { name: "navigationOrder", label: "Navigation order", type: "number", half: true },
      STATUS,
    ],
  },
  news: {
    title: "News", singular: "news story", path: "/news", service: newsService, searchKeys: ["title", "category"],
    columns: [
      { key: "image", label: "", type: "thumb" }, { key: "title", label: "Title" }, { key: "category", label: "Category" },
      { key: "date", label: "Date", type: "date" }, { key: "status", label: "Status", type: "badge" },
    ],
    fields: [
      { name: "title", label: "Title", required: true, max: 140 },
      { name: "category", label: "Category", type: "select", options: NEWS_CATEGORIES, default: "News", required: true, half: true },
      { name: "date", label: "Date", type: "date", default: "today", required: true, half: true },
      { name: "excerpt", label: "Short summary", type: "textarea", rows: 2, max: 240, help: "Shown on cards. Optional." },
      { name: "content", label: "Full story", type: "textarea", rows: 9, required: true },
      { name: "image", label: "Cover image", type: "image", folder: "news" },
      { name: "featured", label: "Show as the featured story on the home page", type: "checkbox" },
      STATUS,
    ],
  },
  events: {
    title: "Events", singular: "event", path: "/events", service: eventService, searchKeys: ["title", "location"],
    columns: [
      { key: "image", label: "", type: "thumb" }, { key: "title", label: "Title" }, { key: "date", label: "Date", type: "date" },
      { key: "location", label: "Location" }, { key: "status", label: "Status", type: "badge" },
    ],
    fields: [
      { name: "title", label: "Title", required: true, max: 140 },
      { name: "date", label: "Date", type: "date", default: "today", required: true, half: true },
      { name: "time", label: "Time", placeholder: "e.g. 09:00 – 12:00", half: true },
      { name: "location", label: "Location" },
      { name: "description", label: "Description", type: "textarea", rows: 7, required: true },
      { name: "image", label: "Event image", type: "image", folder: "events" },
      STATUS,
    ],
  },
  programs: {
    title: "Programs", singular: "program", path: "/academics", service: programService, searchKeys: ["name", "level", "faculty"],
    columns: [
      { key: "image", label: "", type: "thumb" }, { key: "name", label: "Name" }, { key: "level", label: "Level" },
      { key: "duration", label: "Duration" }, { key: "status", label: "Status", type: "badge" },
    ],
    fields: [
      { name: "name", label: "Program name", required: true, max: 140 },
      { name: "level", label: "Level", type: "select", options: LEVELS, default: LEVELS[0], required: true, half: true },
      { name: "faculty", label: "Faculty / department", half: true, help: "Type the same name as in Faculties to link them." },
      { name: "duration", label: "Duration", placeholder: "e.g. 4 years", half: true },
      { name: "language", label: "Language", placeholder: "e.g. English", half: true },
      { name: "tuition", label: "Tuition", placeholder: "e.g. $600 / year", half: true },
      { name: "order", label: "Sort order", type: "number", half: true, help: "Smaller numbers appear first." },
      { name: "description", label: "Description", type: "textarea", rows: 6, required: true },
      { name: "requirements", label: "Admission requirements", type: "textarea", rows: 4 },
      { name: "image", label: "Program image", type: "image", folder: "programs" },
      STATUS,
    ],
  },
  faculties: {
    title: "Faculties", singular: "faculty", path: "/faculty", service: departmentService, searchKeys: ["name", "head"],
    columns: [
      { key: "image", label: "", type: "thumb" }, { key: "name", label: "Name" }, { key: "head", label: "Head" },
      { key: "email", label: "Email" }, { key: "status", label: "Status", type: "badge" },
    ],
    fields: [
      { name: "name", label: "Faculty / department name", required: true, max: 140 },
      { name: "head", label: "Head / dean", half: true },
      { name: "order", label: "Sort order", type: "number", half: true },
      { name: "email", label: "Email", type: "email", half: true },
      { name: "phone", label: "Phone", type: "tel", half: true },
      { name: "description", label: "Description", type: "textarea", rows: 6, required: true },
      { name: "staff", label: "Faculty members", type: "textarea", rows: 4, help: "One per line, e.g. Dr. Name — Role" },
      { name: "image", label: "Image", type: "image", folder: "faculties" },
      STATUS,
    ],
  },
};

/** Dashboard → Settings form. */
export const SETTINGS_FIELDS = [
  { type: "heading", label: "Home page hero" },
  { name: "heroTitle", label: "Headline", max: 120 },
  { name: "heroSubtitle", label: "Sub-headline", type: "textarea", rows: 2, max: 260 },
  { name: "heroImage", label: "Background photo (optional)", type: "image", folder: "site" },
  { type: "heading", label: "About the institute" },
  { name: "aboutTitle", label: "Title", max: 80 },
  { name: "aboutText", label: "Introduction", type: "textarea", rows: 6 },
  { name: "aboutImage", label: "Photo", type: "image", folder: "site" },
  { name: "mission", label: "Mission", type: "textarea", rows: 3 },
  { name: "vision", label: "Vision", type: "textarea", rows: 3 },
  { type: "heading", label: "Numbers (leave blank to hide)" },
  { name: "stat1Value", label: "Number 1", half: true }, { name: "stat1Label", label: "Label 1", half: true },
  { name: "stat2Value", label: "Number 2", half: true }, { name: "stat2Label", label: "Label 2", half: true },
  { name: "stat3Value", label: "Number 3", half: true }, { name: "stat3Label", label: "Label 3", half: true },
  { type: "heading", label: "Admissions page" },
  { name: "admissionsDeadline", label: "Application deadline", placeholder: "e.g. 30 June 2027" },
  { name: "admissionsText", label: "Admissions information", type: "textarea", rows: 5 },
  { type: "heading", label: "Contact & map" },
  { name: "address", label: "Address" },
  { name: "phone", label: "Phone", type: "tel", half: true }, { name: "email", label: "Email", type: "email", half: true },
  { name: "hours", label: "Office hours" },
  { name: "mapEnabled", label: "Show the map on the contact page", type: "checkbox" },
  { name: "lat", label: "Map latitude", half: true, help: "Right-click your place in Google Maps to copy it." }, { name: "lng", label: "Map longitude", half: true },
  { name: "facebook", label: "Facebook page link", type: "url", half: true }, { name: "telegram", label: "Telegram link", type: "url", half: true },
];
