/** Center names supplied for the public directory. No detail content is configured yet. */
export const CENTERS = [
  { slug: "center-of-southeast-asian-studies", name: "Center of Southeast Asian Studies" },
  { slug: "cambodia-21st-century-maritime-silk-road-research-center", name: "Cambodia 21st Century Maritime Silk Road Research Center" },
  { slug: "center-for-cambodia-studies", name: "Center for Cambodia Studies" },
];

export const centerBySlug = (slug) => CENTERS.find((center) => center.slug === slug);
