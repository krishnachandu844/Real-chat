"use client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export const Signin = () => {
  const router = useRouter();

  const formSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    password: z
      .string()
      .min(3, { message: "Password must be at least 6 characters." }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { username, password } = values;
    const response = await fetch("http://localhost:5050/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      Cookies.set("token", data.token);
      router.push("/");
    }
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <main className='flex-1 flex items-center justify-center p-6 bg-gray-50'>
        <div className='w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-4'>
          <div className='space-y-2 text-center'>
            <h1 className='text-3xl font-bold text-primary'>Welcome Back</h1>
            <p className='text-primary/50 italic font-semibold'>
              Enter your credentials to sign in
            </p>
          </div>
          {/* Form component from the UI library, using react-hook-form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              {/* Username input field */}
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder='John Doe' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Password input field */}
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='*****' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Submit button */}
              <Button type='submit' className='w-full cursor-pointer'>
                Login
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default Signin;
