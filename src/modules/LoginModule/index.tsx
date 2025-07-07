"use client";

import { useAuthContext } from "@/components/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const LoginModule = () => {
    const { login } = useAuthContext();

    const [loading, setLoading] = useState(false);

    const loginSchema = z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
    })

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        console.log("Form submitted with values:", values);
        try {
            setLoading(true);
            console.log("Attempting to login with values:", values);

            const response = await login({
                email: values.email,
                password: values.password,
            })

            console.log("Response from login:", response);

            
            if (!response.success) {
                setLoading(false);
                form.setError("email", { type: "manual", message: response.message });
                return;
            }
            
            setLoading(false);
            toast.success("Login successful!");
            redirect("")
            
        } catch (error) {
            setLoading(false);
            console.error("Error during login:", error);
            toast.error("An error occurred while logging in. Please try again.");
        }
    }


    return (
        <div className="min-h-screen flex justify-center items-center min-w-full bg-gray-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your email below to login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField 
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="email"
                                                placeholder="Input your email"
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField 
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="password"
                                                placeholder="Input your password"
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default LoginModule;