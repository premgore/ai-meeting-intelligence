import React from "react";
import { Outlet } from "react-router-dom";
import { Sparkles } from "lucide-react";

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute top-1/2 -right-40 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-cyan-600/20 blur-3xl" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 items-center justify-center text-white shadow-xl shadow-blue-500/20">
            <Sparkles size={26} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            AI Meeting Intelligence
          </h1>
          <p className="text-xs font-medium text-slate-400">
            Enterprise Automated Transcription & Sentiment Analytics
          </p>
        </div>

        {/* Auth Form Card Outlet */}
        <Outlet />
      </div>
    </div>
  );
};
