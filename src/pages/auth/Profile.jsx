
import { useCallback, useEffect, useState } from "react";
import { auth } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { linkGoogleAccount } from "@/services/googleAuthService";
import { getMyProfile } from "@/services/api/apiService";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const loadProfile = useCallback(async () => {
    setError("");
    setProfileLoading(true);

    try {
      const response = await getMyProfile();

      // Support API responses with or without a data wrapper.
      const data = response?.data ?? response;

      setProfile(data?.user ?? data);
    } catch (err) {
      setProfile(null);
      setError(err?.message || "Could not load your profile.");
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        await loadProfile();
      } else {
        setProfile(null);
        setProfileLoading(false);
        setError("Please sign in to view your profile.");
      }
    });

    return unsubscribe;
  }, [loadProfile]);

  async function handleConnectGoogle() {
    if (!currentUser) {
      setError("Please sign in before connecting Google.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await linkGoogleAccount();

      setMessage(
        result?.alreadyLinked
          ? "Google is already connected."
          : "Google account connected successfully."
      );

      // Refresh the Firebase user and trusted CMS profile.
      await auth.currentUser?.reload();
      setCurrentUser(auth.currentUser);
      await loadProfile();
    } catch (err) {
      setError(err?.message || "Could not connect Google.");
    } finally {
      setLoading(false);
    }
  }

  const googleConnected =
    currentUser?.providerData?.some(
      (provider) => provider.providerId === "google.com"
    ) ?? false;

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">
        Account Settings
      </h1>

      <section className="rounded-xl border p-5">
        <h2 className="text-lg font-semibold">
          Google Account
        </h2>

        <p className="my-3 text-sm text-gray-600">
          {googleConnected
            ? "Google is connected to your Firebase account."
            : "Connect Google to your existing account."}
        </p>

        <button
          type="button"
          onClick={handleConnectGoogle}
          disabled={loading || googleConnected || !currentUser}
          className="rounded-lg bg-red-700 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading
            ? "Connecting..."
            : googleConnected
              ? "Google Connected"
              : "Connect Google Account"}
        </button>

        {message && (
          <p role="status" className="mt-3 text-green-700">
            {message}
          </p>
        )}

        {error && (
          <p role="alert" className="mt-3 text-red-700">
            {error}
          </p>
        )}
      </section>

      <section className="mt-5 rounded-xl border p-5">
        <h2 className="mb-3 text-lg font-semibold">
          CMS Profile
        </h2>

        {profileLoading ? (
          <p className="text-sm text-gray-600">
            Loading profile...
          </p>
        ) : profile ? (
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">UID:</span>{" "}
              {profile.uid ?? currentUser?.uid ?? "Not provided"}
            </p>

            <p>
              <span className="font-medium">Email:</span>{" "}
              {profile.email ?? "Not provided"}
            </p>

            <p>
              <span className="font-medium">Name:</span>{" "}
              {profile.displayName ??
                profile.name ??
                currentUser?.displayName ??
                "Not provided"}
            </p>

            <p>
              <span className="font-medium">Role:</span>{" "}
              {profile.role ?? "Not assigned"}
            </p>

            <p>
              <span className="font-medium">Permissions:</span>{" "}
              {Array.isArray(profile.permissions)
                ? profile.permissions.join(", ") || "None"
                : "None"}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            Profile information is unavailable.
          </p>
        )}
      </section>
    </main>
  );
}
