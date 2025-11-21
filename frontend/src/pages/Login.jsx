import { Mail, Lock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import GradientMesh from "../components/GradientMesh";

export default function Login() {
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
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Welcome Back
            </h2>
            <p className="text-zinc-400 text-sm">
              Enter your credentials to access your library
            </p>
          </div>

          <div className="space-y-5">
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
                  type="email"
                  placeholder="you@example.com"
                  className="bg-transparent outline-none ml-3 w-full text-sm placeholder:text-zinc-600"
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
                  type="password"
                  placeholder="••••••••"
                  className="bg-transparent outline-none ml-3 w-full text-sm placeholder:text-zinc-600"
                />
              </div>
            </div>

            <button className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 mt-2">
              Sign In
            </button>
          </div>

          <p className="text-center text-zinc-500 mt-6 text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
