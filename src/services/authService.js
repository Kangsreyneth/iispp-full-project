import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,
  sendPasswordResetEmail, updateProfile,
} from "firebase/auth";
import { auth } from "./firebase";
import { apiFetch, getMyProfile } from "./api/apiService";

export const login = (email, password) => signInWithEmailAndPassword(auth, email.trim(), password);
export const logout = () => signOut(auth);
export const resetPassword = (email) => sendPasswordResetEmail(auth, email.trim());

/** New accounts are "pending" until an existing admin approves them. */
export async function signup(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await updateProfile(cred.user, { displayName: name });
  await apiFetch("/auth/profile", {
    method: "POST",
    body: JSON.stringify({ displayName: name }),
  });
  return cred.user;
}

export async function fetchProfile() {
  try {
    const response = await getMyProfile();
    if (response?.data) return response.data;
  } catch (error) {
    if (error.code !== "no_cms_access") throw error;
  }

  const created = await apiFetch("/auth/profile", {
    method: "POST",
    body: JSON.stringify({ displayName: auth.currentUser?.displayName || "" }),
  });
  return created?.data || null;
}

const MESSAGES = {
  "auth/invalid-credential": "Invalid email or password.",
  "auth/wrong-password": "Invalid email or password.",
  "auth/user-not-found": "Invalid email or password.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/network-request-failed": "Network error. Check your connection.",
  "auth/invalid-api-key": "Firebase is not configured yet. Fill in the .env file.",
};
export const authError = (e) => MESSAGES[e?.code] || e?.message || "Something went wrong.";
