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
      
      const loginRes = await authService.loginUser(data.email, data.password);
      await login(loginRes.access_token);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Registration failed. Email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white border border-[#E8E1D8] rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-xl font-bold text-[#211F1D]">Create Enterprise Account</h2>
          <p className="text-xs text-[#6F6A65]">
            Get started with NIRNAYA decision intelligence platform.
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
            label="Corporate Email"
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
            Create NIRNAYA Account
            <ArrowRight size={16} />
          </Button>
        </form>

        <div className="pt-4 border-t border-[#E8E1D8] text-center text-xs text-[#6F6A65]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-[#7A171C] hover:text-[#C9953E] transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
