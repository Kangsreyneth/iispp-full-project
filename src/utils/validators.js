export const isEmail = (v) => /^\S+@\S+\.\S+$/.test(String(v || "").trim());
export const isUrl = (v) => /^https?:\/\/\S+$/i.test(String(v || "").trim());
export const isPhone = (v) => /^[+\d\s()-]{7,24}$/.test(String(v || "").trim());
