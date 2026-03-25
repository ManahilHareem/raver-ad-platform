"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { setToken } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.name,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Save the JWT token in a cookie so middleware can see it
        if (result.data?.token) {
          setToken(result.data.token);
          router.push("/home");
        } else {
          throw new Error("No token received from server");
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create account");
      }
    } catch (err: any) {
      console.error("Signup Error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="RAVER is an AI-powered creative studio that helps teams generate images, videos, campaigns, and marketing content using intelligent AI agents — all in one platform."
      imageSrc="/assets/3f9bf65624dc8b568c8aab11b438b7ab2a658e56.png"
    >
      <div className="text-center flex flex-col gap-[6px]">
        <h1 className="text-[32px] font-bold text-[#02022C]">Create Your Account</h1>
        <p className="text-[#121212]">Start building with AI in minutes.</p>
      </div>

      <div className="flex flex-col gap-[32px]">
        <Button variant="social" className="w-full h-[44px]">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94L5.84 14.1z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Sign up with Google
        </Button>

        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#0000001A]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-[8px] text-[#4F4F4F] font-medium">Or Sign up with</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[32px]">
          <div className="flex flex-col gap-[16px]">
          <Input 
            label="Full Name" 
            placeholder="Enter your Name" 
            type="text" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <Input 
            label="Email Address" 
            placeholder="Enter your email address" 
            type="email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <Input 
            label="Password" 
            placeholder="Create a password" 
            type="password" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <Input 
            label="Confirm Password" 
            placeholder="Create your password" 
            type="password" 
            value={formData.confirm}
            onChange={(e) => setFormData({...formData, confirm: e.target.value})}
            required
          />
</div>
{error && <p className="text-red-500 text-sm text-center">{error}</p>}
<div className="flex flex-col gap-[12px]">
        <Button type="submit" disabled={isLoading} className="bg-indigo-900 hover:bg-indigo-950">
          {isLoading ? "Signing up..." : "Sign up"}
        </Button>
        <p className="text-center text-[14px] leading-[20px] tracking-[-0.15px] text-[#4F4F4F]">
          Already have an account?{" "}
          <Link href="/" className="text-[16px] leading-[24px] tracking-[-0.31px] text-[#02022C] font-semibold hover:text-indigo-500">
            Sign In
          </Link>
        </p>
</div>
        </form>

  
      </div>
    </AuthLayout>
  );
}
