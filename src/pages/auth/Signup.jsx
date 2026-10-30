import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import TextField from "@/components/forms/TextField";
import Button from "@/components/ui/Button";
import { signup, logout, authError } from "@/services/authService";
import { isEmail } from "@/utils/validators";

export default function Signup() {
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    const err = {};
    if (f.name.trim().length < 2) err.name = "Please enter your full name";
    if (!isEmail(f.email)) err.email = "Enter a valid email address";
    if (f.password.length < 8) err.password = "At least 8 characters";
    if (f.confirm !== f.password) err.confirm = "Passwords do not match";
    setErrors(err);
    if (Object.keys(err).length) return;
    setBusy(true);
    try { await signup(f.name.trim(), f.email, f.password); await logout(); setDone(true); }
    catch (e2) { setError(authError(e2)); }
    finally { setBusy(false); }
  }

  if (done)
    return (
      <AuthLayout title="Request sent">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
          <p className="mt-4 text-slate-600">Your account was created. An administrator must approve it before you can sign in to the dashboard.</p>
          <Link to="/login" className="mt-6 inline-block font-semibold text-brand-700 hover:underline">Go to sign in</Link>
        </div>
      </AuthLayout>
    );

  return (
    <AuthLayout title="Request access" subtitle="Create an account. An admin will approve it." footer={<>Already approved? <Link to="/login" className="font-semibold text-brand-700 hover:underline">Sign in</Link></>}>
      <form onSubmit={submit} noValidate className="space-y-4">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
        <TextField label="Full name" icon={User} autoComplete="name" value={f.name} onChange={set("name")} error={errors.name} />
        <TextField label="Email" icon={Mail} type="email" autoComplete="email" value={f.email} onChange={set("email")} error={errors.email} />
        <TextField label="Password" icon={Lock} type="password" autoComplete="new-password" value={f.password} onChange={set("password")} error={errors.password} />
        <TextField label="Confirm password" icon={Lock} type="password" autoComplete="new-password" value={f.confirm} onChange={set("confirm")} error={errors.confirm} />
        <Button type="submit" size="lg" loading={busy} className="w-full">Create account</Button>
      </form>
    </AuthLayout>
  );
}
