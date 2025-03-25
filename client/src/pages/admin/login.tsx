import { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { LoginFormData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { getAuthToken, setAuthToken } from "@/lib/utils";

// Form schema with validation
const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});

export default function AdminLogin() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const token = getAuthToken();
    if (token) {
      navigate("/admin");
    }
  }, [navigate]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
      setIsRedirecting(true);
      
      toast({
        title: "Login Successful",
        description: "Redirecting to dashboard...",
      });
      
      // Redirect with slight delay for the toast to be visible
      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | Total Enclosures</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-[#002357] font-poppins">Admin Login</h2>
            <p className="text-gray-600 mt-2">Sign in to access the admin dashboard</p>
          </div>
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                {...form.register("username")}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f47920]"
                placeholder="Enter your username"
                disabled={isRedirecting}
              />
              {form.formState.errors.username && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.username.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...form.register("password")}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f47920]"
                placeholder="Enter your password"
                disabled={isRedirecting}
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loginMutation.isPending || isRedirecting}
                className="w-full bg-[#002357] text-white py-3 rounded-md hover:bg-[#003a8c] transition-colors disabled:opacity-50"
              >
                {loginMutation.isPending ? (
                  <span><i className="fas fa-spinner fa-spin mr-2"></i> Signing in...</span>
                ) : isRedirecting ? (
                  <span><i className="fas fa-circle-notch fa-spin mr-2"></i> Redirecting...</span>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <a href="/" className="text-[#002357] hover:text-[#f47920]">
              <i className="fas fa-arrow-left mr-2"></i> Back to Website
            </a>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>Credentials for demo: admin / admin123</p>
          </div>
        </div>
      </div>
    </>
  );
}
