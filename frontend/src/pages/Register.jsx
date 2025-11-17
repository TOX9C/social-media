import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiLock, FiUserPlus } from "react-icons/fi";
import { API_URL } from "../config";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const redirectTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;
    const trimmedUsername = username.trim();

    if (!trimmedUsername || !password.trim()) {
      setStatus({ type: "error", text: "Choose a username and password to continue." });
      return;
    }

    setStatus({ type: "", text: "" });
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ username: trimmedUsername, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          text: "Account created! Redirecting you to sign in...",
        });
        redirectTimeoutRef.current = setTimeout(() => navigate("/login"), 1200);
        return;
      }

      setStatus({
        type: "error",
        text: data?.message || "We couldn’t create that account.",
      });
    } catch {
      setStatus({
        type: "error",
        text: "We couldn’t reach the server. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#1c1511] via-[#281f1a] to-[#3d2f28] text-[#f4f3ee]">
      <div className="absolute inset-0">
        <div className="absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#bcaea2]/10 blur-3xl" />
        <div className="absolute bottom-[-30%] right-[-10%] h-96 w-96 rounded-full bg-[#f4f3ee]/10 blur-3xl" />
        <div className="absolute inset-x-12 top-1/3 hidden h-px bg-gradient-to-r from-transparent via-[#bcaea2]/40 to-transparent md:block" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col justify-center px-6 py-16">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="order-2 space-y-6 text-center lg:order-1 lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#6d5f58]/40 bg-[#2a211c]/80 px-4 py-1 text-sm uppercase tracking-[0.25em] text-[#d3c7be]/70">
              Join the community
            </span>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Create your account and start sharing your story.
            </h1>
            <p className="text-base text-[#d3c7be]/80 md:text-lg">
              Build your profile, follow your friends, and discover the latest
              conversations happening across SocialSphere.
            </p>
          </div>

          <div className="order-1 rounded-3xl border border-[#5a514a]/60 bg-[#241c17]/85 p-8 shadow-2xl backdrop-blur-xl sm:p-10 lg:order-2">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-semibold">Register</h2>
              <p className="mt-2 text-sm text-[#d3c7be]/80">
                We’ll have you set up in less than a minute.
              </p>
            </div>

            {status.text && (
              <div
                className={`mb-6 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                  status.type === "error"
                    ? "border-red-400/60 bg-red-400/10 text-red-200"
                    : "border-emerald-400/50 bg-emerald-400/10 text-emerald-100"
                }`}
              >
                {status.text}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <label className="block text-left">
                <span className="text-sm font-medium tracking-wide text-[#d3c7be]/90">
                  Username
                </span>
                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[#5a514a]/70 bg-[#2a211c]/80 px-4 py-3 transition focus-within:border-[#d3c7be]/70 focus-within:ring-2 focus-within:ring-[#847970]/50">
                  <FiUser className="text-lg text-[#d3c7be]/70" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Pick a unique username"
                    className="w-full bg-transparent text-base placeholder:text-[#b8b4af]/70 focus:outline-none"
                    autoComplete="username"
                  />
                </div>
              </label>

              <label className="block text-left">
                <span className="text-sm font-medium tracking-wide text-[#d3c7be]/90">
                  Password
                </span>
                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[#5a514a]/70 bg-[#2a211c]/80 px-4 py-3 transition focus-within:border-[#d3c7be]/70 focus-within:ring-2 focus-within:ring-[#847970]/50">
                  <FiLock className="text-lg text-[#d3c7be]/70" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full bg-transparent text-base placeholder:text-[#b8b4af]/70 focus:outline-none"
                    autoComplete="new-password"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6d635b] to-[#847970] px-5 py-3 text-base font-semibold text-[#f4f3ee] transition hover:from-[#847970] hover:to-[#6d635b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}
                <FiUserPlus className="text-lg transition group-hover:translate-x-1" />
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#d3c7be]/80">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#f4f3ee] underline-offset-4 transition hover:underline"
              >
                Login instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
