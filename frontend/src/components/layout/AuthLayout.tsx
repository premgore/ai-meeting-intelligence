import React from "react";
import { Outlet } from "react-router-dom";
import NirnayaLogo from "../ui/NirnayaLogo";

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#FAF8F4] text-[#211F1D] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Subtle warm background accent circles */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#7A171C]/5 blur-3xl" />
      <div className="absolute top-1/2 -right-40 h-96 w-96 rounded-full bg-[#C9953E]/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Brand Header with NIRNAYA Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white border border-[#E8E1D8] shadow-sm mb-2">
            <NirnayaLogo variant="full" size="lg" showTagline />
          </div>
          <p className="text-xs font-medium text-[#6F6A65] tracking-wide">
            Intelligence that turns conversations into decisions
          </p>
        </div>

        {/* Auth Form Card Outlet */}
        <Outlet />

        <p className="text-center text-[11px] text-[#6F6A65]">
          © {new Date().getFullYear()} NIRNAYA Decision Intelligence. All rights reserved.
        </p>
      </div>
    </div>
  );
};
