"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import Cookies from "js-cookie";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/user";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // const [error, setError] = useState("")
  const login = useAuthStore((state) => state.login);
  const isLoginIn = useAuthStore((state) => state.isLoginIn);
  const isLoading = useAuthStore((state) => state.isLoading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userDetails = { username, password };
    const success = await login(userDetails);

    if (success) {
      router.push("/");
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm'>
        <CardHeader className='text-center'>
          <div className='flex justify-center mb-4'>
            <div className='p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full'>
              <MessageCircle className='h-8 w-8 text-white' />
            </div>
          </div>
          <CardTitle className='text-2xl font-bold text-white'>
            Welcome Back
          </CardTitle>
          <CardDescription className='text-slate-400'>
            Sign in to your chat account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email' className='text-slate-200'>
                Username
              </Label>
              <Input
                id='email'
                type='text'
                placeholder='John Doe'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password' className='text-slate-200'>
                Password
              </Label>
              <Input
                id='password'
                type='password'
                placeholder='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400'
                required
              />
            </div>
            {/* {error && <p className="text-red-400 text-sm">{error}</p>} */}
            <Button
              type='submit'
              className='w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
