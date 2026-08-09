import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { User, Mail } from "lucide-react";
import toast from "react-hot-toast";

export const Profile: React.FC = () => {
  const { user } = useAuth();

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile details updated!");
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          User Account Profile
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal credentials, corporate email, and security role.
        </p>
      </div>

      {/* User Avatar Card */}
      <Card glass className="p-6 flex items-center gap-5">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{user?.name || "Corporate User"}</h2>
          <p className="text-xs text-slate-500">{user?.email || "user@enterprise.ai"}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="success">Active Account</Badge>
            <Badge variant="info">Enterprise Plan</Badge>
          </div>
        </div>
      </Card>

      {/* Profile Form */}
      <Card glass className="p-6">
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input
            label="Full Name"
            defaultValue={user?.name || "Prem Gore"}
            icon={<User size={16} />}
          />
          <Input
            label="Corporate Email"
            type="email"
            defaultValue={user?.email || "prem@gmail.com"}
            icon={<Mail size={16} />}
          />

          <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="submit" variant="primary">
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
