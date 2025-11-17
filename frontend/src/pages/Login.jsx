import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiLock, FiArrowRight } from "react-icons/fi";
import { API_URL } from "../config";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    const trimmedUsername = username.trim();

    if (!trimmedUsername || !password.trim()) {
      setStatus({ type: "error", text: "Enter both your username and password." });
      return;
    }

    setStatus({ type: "", text: "" });
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ username: trimmedUsername, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/");
        return;
      }

      setStatus({
        type: "error",
        text: data?.message || "Those credentials don’t match any account.",
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#1c1814] via-[#2a231e] to-[#3d332c] text-[#f4f3ee]">
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#f4f3ee]/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-[#d3c7be]/10 blur-3xl" />
        <div className="absolute inset-y-0 left-1/2 hidden w-px translate-x-[-50%] bg-gradient-to-b from-transparent via-[#6d635b]/40 to-transparent lg:block" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col justify-center px-6 py-16">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#6d635b]/40 bg-[#2f2722]/80 px-4 py-1 text-sm uppercase tracking-[0.25em] text-[#d3c7be]/70">
              Welcome back
            </span>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Sign back in and jump into the latest conversations.
            </h1>
            <p className="text-base text-[#d3c7be]/80 md:text-lg">
              Keep up with your communities, react to new posts, and pick up
              your chats right where you left off.
            </p>
          </div>

          <div className="rounded-3xl border border-[#5a514a]/60 bg-[#251f1b]/80 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-semibold">Login</h2>
              <p className="mt-2 text-sm text-[#d3c7be]/80">
                Enter your details to access your SocialSphere account.
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

            <form onSubmit={handleLogin} className="space-y-5">
              <label className="block text-left">
                <span className="text-sm font-medium tracking-wide text-[#d3c7be]/90">
                  Username
                </span>
                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[#5a514a]/70 bg-[#2f2722]/80 px-4 py-3 transition focus-within:border-[#d3c7be]/70 focus-within:ring-2 focus-within:ring-[#847970]/50">
                  <FiUser className="text-lg text-[#d3c7be]/70" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full bg-transparent text-base placeholder:text-[#b8b4af]/70 focus:outline-none"
                    autoComplete="username"
                  />
                </div>
              </label>

              <label className="block text-left">
                <span className="text-sm font-medium tracking-wide text-[#d3c7be]/90">
                  Password
                </span>
                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[#5a514a]/70 bg-[#2f2722]/80 px-4 py-3 transition focus-within:border-[#d3c7be]/70 focus-within:ring-2 focus-within:ring-[#847970]/50">
                  <FiLock className="text-lg text-[#d3c7be]/70" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-transparent text-base placeholder:text-[#b8b4af]/70 focus:outline-none"
                    autoComplete="current-password"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6d635b] to-[#847970] px-5 py-3 text-base font-semibold text-[#f4f3ee] transition hover:from-[#847970] hover:to-[#6d635b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Login"}
                <FiArrowRight className="text-lg transition group-hover:translate-x-1" />
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#d3c7be]/80">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-[#f4f3ee] underline-offset-4 transition hover:underline"
              >
                Register for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
