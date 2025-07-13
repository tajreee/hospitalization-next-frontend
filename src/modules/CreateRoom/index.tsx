"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { customFetch, customFetchBody } from "@/components/utils/customFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { Form, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { CreateRoomResponse } from "./interface";

export const CreateRoom = () => {
    const [loading, setLoading] = useState(false);

    const roomSchema = z.object({
        name: z.string().min(1, "Room name is required"),
        description: z.string().min(1, "Description is required"),
        max_capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
        price_per_day: z.coerce.number().min(0, "Price per day must be a positive number")
    })

    const form = useForm({
        resolver: zodResolver(roomSchema),
        defaultValues: {
            name: "",
            description: "",
            max_capacity: 1,
            price_per_day: 0
        }
    })

    const onSubmit = async (values: z.infer<typeof roomSchema>) => {
        try {
            setLoading(true);

            const response = await customFetch<CreateRoomResponse>('/rooms/create',
                {
                    method: 'POST',
                    isAuthorized: true,
                    body: customFetchBody(values)
                }
            );

            if (!response.success) {
                setLoading(false);
                toast.error("Failed to create room. Please try again.");
                return;
            }

            toast.success(`Room "${values.name}" created successfully!`);
            redirect("/rooms");

        } catch (error) {
            toast.error("Failed to create room. Please try again.");
            
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Create New Room</CardTitle>
                    <CardDescription>Fill in the details to create a new room.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Room Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter room name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter room description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="max_capacity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Max Capacity</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Enter max capacity" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price_per_day"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price per Day</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Enter price per day" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={loading}>
                                {loading ? "Creating..." : "Create Room"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}