import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import TextField from "@/components/forms/TextField";
import Button from "@/components/ui/Button";
import { resetPassword, authError } from "@/services/authService";
import { isEmail } from "@/utils/validators";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!isEmail(email)) return setError("Enter a valid email address.");
    setBusy(true);
    try { await resetPassword(email); setSent(true); }
    catch (err) { setError(authError(err)); }
    finally { setBusy(false); }
  }

  return (
    <AuthLayout title="Reset password" subtitle="We will email you a reset link." footer={<Link to="/admin" className="font-semibold text-brand-700 hover:underline">Back to sign in</Link>}>
      {sent ? (
        <div className="text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" /><p className="mt-3 text-slate-600">If an account exists for {email}, a reset link is on its way.</p></div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4">
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
          <TextField label="Email" icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" size="lg" loading={busy} className="w-full">Send reset link</Button>
        </form>
      )}
    </AuthLayout>
  );
}
