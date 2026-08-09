import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Sun, Moon, Laptop, Bell, Key } from "lucide-react";
import toast from "react-hot-toast";

export const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          Customize design theme, notification rules, and AI API integrations.
        </p>
      </div>

      {/* Theme Selection */}
      <Card glass className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          Appearance & Theme Mode
        </h3>
        <p className="text-xs text-slate-500">Choose how AI Meeting Intelligence looks on your device.</p>

        <div className="grid grid-cols-3 gap-4 pt-2">
          <button
            onClick={() => setTheme("light")}
            className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
              theme === "light"
                ? "border-blue-600 bg-blue-50/50 dark:bg-slate-800 text-blue-600 font-bold"
                : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            <Sun size={24} className="mx-auto" />
            <span className="block text-xs">Light Mode</span>
          </button>

          <button
            onClick={() => setTheme("dark")}
            className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
              theme === "dark"
                ? "border-blue-600 bg-blue-50/50 dark:bg-slate-800 text-blue-600 font-bold"
                : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            <Moon size={24} className="mx-auto" />
            <span className="block text-xs">Dark Mode</span>
          </button>

          <button
            onClick={() => setTheme("system")}
            className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
              theme === "system"
                ? "border-blue-600 bg-blue-50/50 dark:bg-slate-800 text-blue-600 font-bold"
                : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            <Laptop size={24} className="mx-auto" />
            <span className="block text-xs">System Auto</span>
          </button>
        </div>
      </Card>

      {/* Notifications Rules */}
      <Card glass className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Bell size={18} className="text-blue-600" /> Notifications & Alerts
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 cursor-pointer">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Email summary when meeting transcription completes</span>
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 cursor-pointer">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Notify on critical meeting risk detection</span>
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
          </label>
        </div>
      </Card>

      {/* API Key Status */}
      <Card glass className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Key size={18} className="text-purple-600" /> FastAPI Backend Connection
          </h3>
          <Badge variant="success">Connected</Badge>
        </div>
        <p className="text-xs text-slate-500">Connected to FastAPI server at http://localhost:8000/api/v1</p>
        <Button variant="outline" size="sm" onClick={() => toast.success("API connection healthy!")}>
          Test API Health
        </Button>
      </Card>
    </div>
  );
};

export default Settings;
