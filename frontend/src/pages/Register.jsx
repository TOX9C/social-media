import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiLock } from "react-icons/fi";
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
    <div className="min-h-screen flex items-center justify-center px-6 text-[#f4f3ee]">
      <div className="w-full max-w-md border-2 border-[#544c46] rounded-3xl p-6">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold">Register</h2>
        </div>

        {status.text && (
          <div
            className={`mb-4 rounded-2xl border-2 px-4 py-2 text-sm font-medium ${
              status.type === "error"
                ? "border-red-500 text-red-200"
                : "border-emerald-500 text-emerald-100"
            }`}
          >
            {status.text}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <label className="block text-left">
            <span className="text-sm text-[#d6d2c0]">Username</span>
            <div className="mt-2 flex items-center gap-2 border-2 border-[#544c46] rounded-3xl px-4 py-2">
              <FiUser className="text-lg text-[#d6d2c0]" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Pick a unique username"
                className="w-full bg-transparent placeholder-[#d6d2c0] focus:outline-none"
                autoComplete="username"
              />
            </div>
          </label>

          <label className="block text-left">
            <span className="text-sm text-[#d6d2c0]">Password</span>
            <div className="mt-2 flex items-center gap-2 border-2 border-[#544c46] rounded-3xl px-4 py-2">
              <FiLock className="text-lg text-[#d6d2c0]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
                className="w-full bg-transparent placeholder-[#d6d2c0] focus:outline-none"
                autoComplete="new-password"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full border-2 border-[#544c46] rounded-3xl px-5 py-2 font-semibold hover:bg-[#8a817c] hover:text-[#463f3a] transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[#d6d2c0]">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold hover:underline">
            Login instead
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
