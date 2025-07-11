"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { customFetch, customFetchBody } from "@/components/utils/customFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { CreateFacilityResponse } from "./interface";
import { toast } from "sonner";

const CreateFacility = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const createFacilitySchema = z.object({
        name: z.string().min(1, "Name is required"),
        fee: z.coerce.number().min(0, "Fee must be a positive number")
    })

    const form = useForm({
        resolver: zodResolver(createFacilitySchema),
        defaultValues: {
            name: "",
            fee: 0
        }
    })

    const onSubmit = async (values: z.infer<typeof createFacilitySchema>) => {
        try {
            setLoading(true);

            const response = await customFetch<CreateFacilityResponse>('/facilities/create', {
                method: 'POST',
                isAuthorized: true,
                body: customFetchBody(values)
            })

            if (!response.success) {
                setLoading(false);
                return;
            }
            
            setLoading(false);
            toast.success(`Facility "${values.name}" created successfully!`);
            router.push("/facilities");
            
        } catch (error) {
            setLoading(false);
            console.error("Error creating facility:", error);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Create New Facility</CardTitle>
                    <CardDescription className="text-center text-gray-600 mb-4">
                        Fill in the details below to create a new facility.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Facility Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter facility name"
                                                className="w-full"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fee"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Facility Fee</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder="Enter facility fee"
                                                className="w-full"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Creating..." : "Create Facility"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )

}
export default CreateFacility;