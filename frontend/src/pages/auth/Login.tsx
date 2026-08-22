import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowRight } from "lucide-react";

import { authService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import NirnayaLogo from "../../components/ui/NirnayaLogo";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    if (loading) return;

    try {
      setLoading(true);

      const response = await authService.loginUser(
        data.email,
        data.password
      );

      await login(response.access_token);

      toast.success("Welcome back! Signed in successfully.");
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      console.error("Login error:", error);
      const status = error?.response?.status;
      const detail = error?.response?.data?.detail;

      if (status === 401) {
        toast.error("Invalid email or password.");
      } else if (status === 403) {
        toast.error(detail || "Your account is inactive. Please contact support.");
      } else {
        toast.error(detail || "Unable to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white border border-[#E8E1D8] rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-xl font-bold text-[#211F1D]">Sign In to NIRNAYA</h2>
          <p className="text-xs text-[#6F6A65]">
            Enter your credentials to access your executive workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Corporate Email"
            type="email"
            placeholder="name@enterprise.com"
            icon={<Mail size={16} />}
            error={errors.email?.message}
            autoComplete="email"
            disabled={loading}
            {...register("email")}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock size={16} />}
            error={errors.password?.message}
            autoComplete="current-password"
            disabled={loading}
            {...register("password")}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={loading}
          >
            {loading ? "Signing in..." : "Sign In to Workspace"}
            {!loading && <ArrowRight size={16} />}
          </Button>
        </form>

        <div className="pt-4 border-t border-[#E8E1D8] text-center text-xs text-[#6F6A65]">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-[#7A171C] hover:text-[#C9953E] transition-colors"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
