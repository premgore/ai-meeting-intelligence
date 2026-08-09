import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { User as UserIcon, Mail, Lock, ArrowRight } from "lucide-react";
import { authService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterSchema = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      setLoading(true);
      await authService.registerUser(data.name, data.email, data.password);
      toast.success("Account created successfully! Signing in...");
      
      // Auto login after registration
      const loginRes = await authService.loginUser(data.email, data.password);
      login(loginRes.access_token);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Registration failed. Email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white">Create Enterprise Account</h2>
        <p className="text-xs text-slate-400">
          Get started with AI-driven meeting intelligence.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="Prem Gore"
          icon={<UserIcon size={16} />}
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          icon={<Mail size={16} />}
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={<Lock size={16} />}
          error={errors.password?.message}
          {...register("password")}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={loading}
        >
          Create Account
          <ArrowRight size={16} />
        </Button>
      </form>

      <div className="pt-2 border-t border-slate-800 text-center text-xs text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
