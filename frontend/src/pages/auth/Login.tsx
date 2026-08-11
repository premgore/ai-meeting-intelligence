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


// ============================================================
// VALIDATION
// ============================================================

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


// ============================================================
// LOGIN PAGE
// ============================================================

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


  // ==========================================================
  // SUBMIT LOGIN
  // ==========================================================

  const onSubmit = async (data: LoginSchema) => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      // ------------------------------------------------------
      // Login API
      // ------------------------------------------------------

      const response = await authService.loginUser(
        data.email,
        data.password
      );

      // ------------------------------------------------------
      // Store token + load current user
      // ------------------------------------------------------

      await login(response.access_token);

      // ------------------------------------------------------
      // Success
      // ------------------------------------------------------

      toast.success(
        "Welcome back! Signed in successfully."
      );

      navigate("/dashboard", {
        replace: true,
      });

    } catch (error: any) {
      console.error("Login error:", error);

      const status = error?.response?.status;

      const detail =
        error?.response?.data?.detail;

      // ------------------------------------------------------
      // Specific error messages
      // ------------------------------------------------------

      if (status === 401) {
        toast.error(
          "Invalid email or password."
        );
      } else if (status === 403) {
        toast.error(
          detail ||
            "Your account is inactive. Please contact support."
        );
      } else if (status === 429) {
        toast.error(
          "Too many login attempts. Please try again later."
        );
      } else if (
        error?.code === "ECONNABORTED"
      ) {
        toast.error(
          "The server took too long to respond. Please try again."
        );
      } else if (!error?.response) {
        toast.error(
          "Unable to connect to the server. Please check your connection."
        );
      } else {
        toast.error(
          detail ||
            "Unable to sign in. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">

      <div className="w-full max-w-md">

        {/* ==================================================
            CARD
        ================================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="text-center mb-8">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-500/20">

              <Lock
                size={25}
                className="text-blue-400"
              />

            </div>

            <h1 className="text-2xl font-bold text-white">
              Sign In to Workspace
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Enter your credentials to access your
              AI meeting workspace.
            </p>

          </div>


          {/* =================================================
              LOGIN FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >

            {/* EMAIL */}

            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              icon={<Mail size={16} />}
              error={errors.email?.message}
              autoComplete="email"
              disabled={loading}
              {...register("email")}
            />


            {/* PASSWORD */}

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


            {/* SUBMIT */}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}

              {!loading && (
                <ArrowRight size={16} />
              )}

            </Button>

          </form>


          {/* =================================================
              REGISTER
          ================================================= */}

          <div className="mt-6 pt-5 border-t border-slate-800 text-center text-sm text-slate-400">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Create an Account
            </Link>

          </div>

        </div>


        {/* ==================================================
            FOOTER
        ================================================== */}

        <p className="mt-5 text-center text-xs text-slate-500">
          AI Meeting Intelligence
        </p>

      </div>

    </div>
  );
};


export default Login;
