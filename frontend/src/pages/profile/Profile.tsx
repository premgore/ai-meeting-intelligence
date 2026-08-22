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
    toast.success("Profile details updated successfully!");
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-[#E8E1D8] shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#211F1D]">
          User Account Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#6F6A65] mt-1">
          Manage your personal credentials, corporate email, and security role.
        </p>
      </div>

      {/* User Avatar Card */}
      <Card className="p-6 flex items-center gap-5 bg-white border-[#E8E1D8]">
        <div className="h-16 w-16 rounded-2xl bg-[#7A171C] text-white flex items-center justify-center font-bold text-xl border border-[#C9953E]/30 shadow-xs">
          {user?.name?.[0]?.toUpperCase() || "N"}
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#211F1D]">{user?.name || "Executive User"}</h2>
          <p className="text-xs text-[#6F6A65]">{user?.email || "user@nirnaya.ai"}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="gold">Active Account</Badge>
            <Badge variant="outline">Executive Tier</Badge>
          </div>
        </div>
      </Card>

      {/* Profile Form */}
      <Card className="p-6 bg-white border-[#E8E1D8]">
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

          <div className="flex justify-end pt-3 border-t border-[#E8E1D8]">
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
