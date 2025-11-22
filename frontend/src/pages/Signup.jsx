import { useState } from "react";
import { User, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import GradientMesh from "../components/GradientMesh";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      //Redirect to login on success
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <GradientMesh />

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        <Link
          to="/"
          className="inline-flex items-center text-zinc-400 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Home
        </Link>

        <div className="glass p-8 md:p-10 rounded-3xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-2 text-white">
              Create Account
            </h2>
            <p className="text-zinc-400 text-sm">
              Join the community and start listening
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="group">
              <label className="block text-zinc-400 text-xs font-medium mb-1.5 ml-1">
                FULL NAME
              </label>
              <div className="flex items-center bg-black/20 px-4 py-3 rounded-xl border border-white/10 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
                <User
                  className="text-zinc-500 group-focus-within:text-indigo-400 transition-colors"
                  size={18}
                />
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-transparent outline-none ml-3 w-full text-sm placeholder:text-zinc-600 text-white"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-zinc-400 text-xs font-medium mb-1.5 ml-1">
                EMAIL
              </label>
              <div className="flex items-center bg-black/20 px-4 py-3 rounded-xl border border-white/10 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
                <Mail
                  className="text-zinc-500 group-focus-within:text-indigo-400 transition-colors"
                  size={18}
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-transparent outline-none ml-3 w-full text-sm placeholder:text-zinc-600 text-white"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-zinc-400 text-xs font-medium mb-1.5 ml-1">
                PASSWORD
              </label>
              <div className="flex items-center bg-black/20 px-4 py-3 rounded-xl border border-white/10 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
                <Lock
                  className="text-zinc-500 group-focus-within:text-indigo-400 transition-colors"
                  size={18}
                />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-transparent outline-none ml-3 w-full text-sm placeholder:text-zinc-600 text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 mt-4 disabled:opacity-50 flex justify-center items-center"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-zinc-500 mt-6 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
