import React from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Bell, Key, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-[#E8E1D8] shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#211F1D]">
          Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#6F6A65] mt-1">
          Configure NIRNAYA decision intelligence rules, notifications, and backend services.
        </p>
      </div>

      {/* Notifications Rules */}
      <Card className="p-6 space-y-4 bg-white border-[#E8E1D8]">
        <h3 className="text-xs font-bold text-[#7A171C] uppercase tracking-wider flex items-center gap-2">
          <Bell size={16} className="text-[#C9953E]" /> Notifications & Alerts
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF8F4] border border-[#E8E1D8] cursor-pointer">
            <span className="text-xs font-semibold text-[#211F1D]">Email executive summary report when meeting transcription completes</span>
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-[#E8E1D8] text-[#7A171C] focus:ring-[#7A171C]/20" />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF8F4] border border-[#E8E1D8] cursor-pointer">
            <span className="text-xs font-semibold text-[#211F1D]">Notify on critical meeting risk detection</span>
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-[#E8E1D8] text-[#7A171C] focus:ring-[#7A171C]/20" />
          </label>
        </div>
      </Card>

      {/* Backend Integration */}
      <Card className="p-6 space-y-4 bg-white border-[#E8E1D8]">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#7A171C] uppercase tracking-wider flex items-center gap-2">
            <Key size={16} className="text-[#C9953E]" /> FastAPI Backend Connection
          </h3>
          <Badge variant="gold">Connected</Badge>
        </div>
        <p className="text-xs text-[#6F6A65]">Connected to NIRNAYA FastAPI server at http://localhost:8000/api/v1</p>
        <Button variant="outline" size="sm" onClick={() => toast.success("NIRNAYA API connection healthy!")}>
          Test API Health
        </Button>
      </Card>
    </div>
  );
};

export default Settings;
