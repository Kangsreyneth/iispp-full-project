import { apiFetch, publicApiFetch } from "./api/apiService";

let siteRecord = {};
let locationRecord = {};

const localized = (value, lang = "en") => typeof value === "string" ? value : value?.[lang] || value?.en || value?.km || "";
const imageUrl = (value) => typeof value === "string" ? value : value?.url || "";

function toFormSettings(site = {}, location = {}, publicView = false, lang = "en") {
  const contact = site.contact || {};
  const social = site.socialLinks || {};
  const shownLocation = location.mapEnabled ? location : {};
  return {
    ...site,
    heroTitle: localized(site.heroTitle, lang),
    heroSubtitle: localized(site.heroSubtitle, lang),
    heroImage: imageUrl(site.heroImage),
    aboutTitle: localized(site.aboutTitle, lang),
    aboutText: localized(site.aboutText, lang),
    aboutImage: imageUrl(site.aboutImage),
    background: localized(site.background, lang),
    mission: localized(site.mission, lang),
    vision: localized(site.vision, lang),
    goals: localized(site.goals, lang),
    admissionsText: localized(site.admissionsText, lang),
    admissionsDeadline: localized(site.admissionsDeadline, lang),
    address: localized(contact.address, lang) || localized(location.address, lang) || site.address || "",
    phone: contact.phone || site.phone || "",
    email: contact.email || site.email || "",
    facebook: social.facebook || site.facebook || "",
    telegram: social.telegram || site.telegram || "",
    hours: site.hours || "",
    lat: publicView && !location.mapEnabled ? "" : shownLocation.latitude == null ? (site.lat || "") : String(shownLocation.latitude),
    lng: publicView && !location.mapEnabled ? "" : shownLocation.longitude == null ? (site.lng || "") : String(shownLocation.longitude),
    mapEnabled: Boolean(location.mapEnabled),
  };
}

async function loadAdmin() {
  const [siteResponse, locationResponse] = await Promise.all([
    apiFetch("/admin/settings/site"),
    apiFetch("/admin/settings/location"),
  ]);
  siteRecord = siteResponse?.data || {};
  locationRecord = locationResponse?.data || {};
  return toFormSettings(siteRecord, locationRecord);
}

export const settingsService = {
  get: async (lang = "en") => {
    const response = await publicApiFetch("/public/settings");
    const value = response?.data || {};
    return toFormSettings(value.site, value.location, true, lang);
  },

  getAdmin: loadAdmin,

  save: async (values) => {
    if (!siteRecord.siteName) await loadAdmin();
    const { lat, lng, mapEnabled, address, phone, email, facebook, telegram, heroImage, aboutImage, ...siteFields } = values;
    const site = {
      ...siteRecord,
      ...siteFields,
      heroImage: imageUrl(heroImage),
      aboutImage: imageUrl(aboutImage),
      siteName: { en: siteRecord.siteName?.en || "IISPP", km: siteRecord.siteName?.km || "" },
      defaultLanguage: siteRecord.defaultLanguage || "en",
      availableLanguages: siteRecord.availableLanguages || ["en", "km"],
      contact: { ...(siteRecord.contact || {}), email, phone, address: { en: address || "", km: "" } },
      socialLinks: { ...(siteRecord.socialLinks || {}), facebook: facebook || "", telegram: telegram || "" },
    };
    const location = {
      mapEnabled: Boolean(mapEnabled),
      latitude: lat === "" || lat == null ? null : Number(lat),
      longitude: lng === "" || lng == null ? null : Number(lng),
      googleMapsPlaceId: locationRecord.googleMapsPlaceId || null,
      directionsUrl: locationRecord.directionsUrl || null,
      address: { en: address || "", km: "" },
      label: locationRecord.label || { en: "Our location", km: "" },
    };
    const [siteResponse, locationResponse] = await Promise.all([
      apiFetch("/admin/settings/site", { method: "PUT", body: JSON.stringify(site) }),
      apiFetch("/admin/settings/location", { method: "PUT", body: JSON.stringify(location) }),
    ]);
    siteRecord = siteResponse?.data || site;
    locationRecord = locationResponse?.data || location;
    return toFormSettings(siteRecord, locationRecord);
  },
};

export default settingsService;
