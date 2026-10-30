import { auth, authReady } from "./firebase";
import { API_BASE_URL } from "./api/apiService";

const MAX_MB = 5;

/** Upload an image through Laravel; Laravel validates it and stores its media record. */
export function uploadImage(file, folder = "misc", onProgress) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) return reject(new Error("Please choose an image file (JPG, PNG or WebP)."));
    if (file.size > MAX_MB * 1024 * 1024) return reject(new Error(`Image is larger than ${MAX_MB} MB.`));
    void (async () => {
      try {
        await authReady;
        if (!API_BASE_URL) throw new Error("The API URL is not configured.");
        if (!auth.currentUser) throw new Error("Please sign in first.");
        const token = await auth.currentUser.getIdToken();
        const body = new FormData();
        body.append("file", file);
        body.append("altText[en]", file.name);
        body.append("folder", folder);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API_BASE_URL}/admin/media`);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
        };
        xhr.onerror = () => reject(new Error("Upload failed. Check your connection."));
        xhr.onload = () => {
          let result = {};
          try { result = JSON.parse(xhr.responseText || "{}"); } catch { /* handled below */ }
          if (xhr.status < 200 || xhr.status >= 300) {
            reject(new Error(result.message || result.error?.message || `Upload failed (${xhr.status}).`));
            return;
          }
          const media = result.data;
          resolve({ url: media?.downloadUrl || "", mediaId: media?.id || "" });
        };
        xhr.send(body);
      } catch (error) {
        reject(error);
      }
    })();
  });
}
