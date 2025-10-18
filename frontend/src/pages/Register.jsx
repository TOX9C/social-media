import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registration successful");
        navigate("/login");
      } else {
        console.log(data.message || "Registration failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="border-2 border-[#544c46] rounded-3xl p-8 w-full max-w-sm shadow-lg text-[#f4f3ee]">
        <h1 className="text-2xl font-semibold text-center mb-6">Register</h1>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#3b342f] border border-[#544c46] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#847970] placeholder-[#b8b4af]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#3b342f] border border-[#544c46] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#847970] placeholder-[#b8b4af]"
          />
          <button
            type="submit"
            className="bg-[#6d635b] hover:bg-[#847970] transition-all duration-200 rounded-xl py-2 font-medium"
          >
            Register
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-[#b8b4af]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#f4f3ee] hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
