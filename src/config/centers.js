/** Center names already listed in the public navigation. */
export const CENTERS = [
  "Information Technology Center",
  "Library Service",
  "Quality Assurance Center",
  "English Language Support Unit",
  "University-Industry Cooperation Center",
  "Cambodia-Japan Cooperation Center",
  "Cambodia-Korea Cooperation Center",
  "National Incubation Center of Cambodia",
];

export const centerAnchor = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
