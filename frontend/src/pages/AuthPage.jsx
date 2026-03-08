import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SpaceBackground from "../components/SpaceBackground";
import api from "../services/api";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [status, setStatus] = useState("idle");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";

      const res = await api.post(endpoint, {
        email,
        password,
        name: isLogin ? undefined : "User",
      });

      localStorage.setItem("token", res.data.token);

      setStatus("success");

      setTimeout(() => {
        navigate("/home");
      }, 1500);

    } catch {
      setStatus("error");

      setTimeout(() => {
        setStatus("idle");
      }, 1500);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <SpaceBackground status={status} />

      <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-2xl shadow-2xl w-[400px] text-white">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition duration-300 p-3 rounded-lg"
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p className="text-sm mt-6 text-center">
          {isLogin ? "New here?" : "Already have an account?"}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-indigo-400 cursor-pointer"
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}