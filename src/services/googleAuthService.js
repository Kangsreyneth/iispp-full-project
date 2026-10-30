
import {
  GoogleAuthProvider,
  linkWithPopup,
  reload,
} from "firebase/auth";

import { auth, authReady } from "./firebase.js";

export async function linkGoogleAccount() {
  await authReady;

  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in before connecting Google.");
  }

  if (user.providerData.some(
    (provider) => provider.providerId === "google.com"
  )) {
    return {
      uid: user.uid,
      email: user.email,
      alreadyLinked: true,
    };
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    const result = await linkWithPopup(user, provider);

    await reload(result.user);

    return {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      providers: result.user.providerData.map(
        (item) => item.providerId
      ),
      alreadyLinked: false,
    };
  } catch (error) {
    if (error.code === "auth/credential-already-in-use") {
      throw new Error(
        "This Google account is linked to another Firebase account."
      );
    }

    if (error.code === "auth/provider-already-linked") {
      throw new Error("Google is already connected.");
    }

    if (error.code === "auth/popup-closed-by-user") {
      throw new Error("Google connection was cancelled.");
    }

    if (error.code === "auth/requires-recent-login") {
      throw new Error("Please sign in again before connecting Google.");
    }

    throw error;
  }
}
