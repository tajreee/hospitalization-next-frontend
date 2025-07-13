import { customFetch, customFetchBody } from "@/components/utils/customFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export const CreateReservation = () => {
    const [loading, setLoading] = useState(false);

    const reservationSchema = z.object({
        nurseId: z.string().min(1, "Nurse ID is required"),
        dateIn: z.date().refine(
            (date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), 
            { message: "Date must be today or in the future" }
        ),
        dateOut: z.date(),
        roomId: z.string().min(1, "Room ID is required"),
        facilityIds: z.array(z.string().min(1, "Facility ID is required")).min(1, "At least one facility must be selected"),
    }).refine(
        (data) => data.dateOut > data.dateIn,
        {
            message: "Date out must be after date in",
            path: ["dateOut"], // Error akan muncul di field dateOut
        }
    );

    const form = useForm({
        resolver: zodResolver(reservationSchema),
        defaultValues: {
            nurseId: "",
            dateIn: new Date(),
            dateOut: new Date(),
            roomId: "",
            facilityIds: []
        }
    })

    const onSubmit = async (values: z.infer<typeof reservationSchema>) => {
        try {
            setLoading(true);

            const response = await customFetch('/reservations/create', 
                {
                    method: 'POST',
                    isAuthorized: true,
                    body: customFetchBody(values)
                }
            )

            if (!response.success) {
                setLoading(false);
                toast.error("Failed to create reservation. Please try again.");
                return;
            }

            toast.success("Reservation created successfully!");
            redirect("/reservations");
            
        } catch (error) {
            toast.error("Failed to create reservation. Please try again.");
            
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>

        </div>
    )
}