"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { customFetch, customFetchBody } from "@/components/utils/customFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { CreateReservationResponse, Facility, GetAllFacilitiesResponse, GetAllNursesResponse, GetAllRoomsResponse, GetPatientByNIKResponse, Nurse, Patient } from "./interface";
import { Room } from "../ListRooms/interface";

export const CreateReservation = (
    { nurseId }: { nurseId?: string } = {}
) => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    
    // Data untuk setiap step
    const [patient, setPatient] = useState<Patient>();
    const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
    const [availableFacilities, setAvailableFacilities] = useState<Facility[]>([]);
    
    // Data yang akan disimpan
    const [reservationData, setReservationData] = useState({
        dateIn: null as Date | null,
        dateOut: null as Date | null,
        roomId: "",
        facilityIds: [] as string[],
        nurseId: nurseId,
        patientId: ""
    });

    // Schema untuk Step 1 - Patient Selection
    const patientSchema = z.object({
        nik: z.string().min(1, "NIK is required"),
    })

    // Schema untuk Step 2 - Date Selection
    const dateSchema = z.object({
        dateIn: z.date().refine(
            (date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), 
            { message: "Date must be today or in the future" }
        ),
        dateOut: z.date(),
    }).refine(
        (data) => data.dateOut > data.dateIn,
        {
            message: "Date out must be after date in",
            path: ["dateOut"],
        }
    );

    // Schema untuk Step 4 - Room Selection
    const roomSchema = z.object({
        roomId: z.string().min(1, "Please select a room"),
    });

    // Schema untuk Step 4 - Facility Selection
    const facilitySchema = z.object({
        facilityIds: z.array(z.string()).min(1, "Please select at least one facility"),
    });

    // Form untuk step saat ini

    const patientForm = useForm({
        resolver: zodResolver(patientSchema),
        defaultValues: {
            nik: "",
        }
    });

    const dateForm = useForm({
        resolver: zodResolver(dateSchema),
        defaultValues: {
            dateIn: new Date(),
            dateOut: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        }
    });

    const roomForm = useForm({
        resolver: zodResolver(roomSchema),
        defaultValues: {
            roomId: "",
        }
    });

    const facilityForm = useForm({
        resolver: zodResolver(facilitySchema),
        defaultValues: {
            facilityIds: [],
        }
    });

    // Fetch facilities on component mount
    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const response = await customFetch<GetAllFacilitiesResponse>('/facilities', {
                    isAuthorized: true,
                });
                if (response.success) {
                    setAvailableFacilities(response.data.facilities);
                }
            } catch (error) {
                console.error("Error fetching facilities:", error);
            }
        };
        fetchFacilities();
    }, []);

    const onSubmitPatient = async (values: z.infer<typeof patientSchema>) => {
        try {
            setLoading(true);
            const response = await customFetch<GetPatientByNIKResponse>(`/patients/${values.nik}`, {
                method: 'GET',
                isAuthorized: true,
            });

            if (!response.success) {
                toast.error("Patient not found");
                setPatient(undefined);
                return;
            }

            setPatient(response.data.patient);
            setReservationData(prev => ({
                ...prev,
                patientId: response.data.patient.id,
                nurseId: nurseId || prev.nurseId
            }));
            toast.success("Patient found! Please select dates.");
            
        } catch (error) {
            toast.error("Failed to fetch patient data");
            console.error("Error fetching patient data:", error);
 
        } finally {
            setLoading(false);
        }
    }

    // Step 2: Submit dates and fetch available rooms
    const onSubmitDates = async (values: z.infer<typeof dateSchema>) => {
        try {
            setLoading(true);
            
            // Save dates
            setReservationData(prev => ({
                ...prev,
                dateIn: values.dateIn,
                dateOut: values.dateOut
            }));

            // Fetch available rooms
            const response = await customFetch<GetAllRoomsResponse>(`/rooms-available?dateIn=${values.dateIn.toISOString()}&dateOut=${values.dateOut.toISOString()}`, 
            {
                method: 'GET',
                isAuthorized: true,
            });

            if (!response.success) {
                toast.error("Failed to fetch available rooms");
                return;
            }

            setAvailableRooms(response.data.rooms);
            setCurrentStep(3);
            toast.success("Dates saved! Please select a room.");
            
        } catch (error) {
            toast.error("Error checking room availability");
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Submit room selection
    const onSubmitRoom = (values: z.infer<typeof roomSchema>) => {
        setReservationData(prev => ({
            ...prev,
            roomId: values.roomId
        }));
        setCurrentStep(4);
        toast.success("Room selected! Please choose facilities and nurse.");
    };

    // Step 4: Submit final reservation
    const onSubmitFinal = async (values: z.infer<typeof facilitySchema>) => {
        try {
            setLoading(true);

            const finalData = {
                patient_id: reservationData.patientId,
                room_id: reservationData.roomId,
                nurse_id: reservationData.nurseId,
                facilities: values.facilityIds,
                date_in: reservationData.dateIn?.toISOString(),
                date_out: reservationData.dateOut?.toISOString()
            };

            const response = await customFetch<CreateReservationResponse>('/reservations/create', {
                method: 'POST',
                isAuthorized: true,
                body: customFetchBody(finalData)
            });

            if (!response.success) {
                toast.error("Failed to create reservation");
                console.error("Error creating reservation:", response.errors);
                return;
            }

            toast.success("Reservation created successfully!");
            router.push("/reservations");
            
        } catch (error) {
            toast.error("Failed to create reservation");
        } finally {
            setLoading(false);
        }
    };

    // Back button handler
    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-2xl p-6 bg-white shadow-lg rounded-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Create New Reservation - Step {currentStep} of 4
                    </CardTitle>
                    <CardDescription className="text-center text-gray-600">
                        {currentStep === 1 && "Enter patient NIK to start"}
                        {currentStep === 2 && "Select your check-in and check-out dates"}
                        {currentStep === 3 && "Choose an available room"}
                        {currentStep === 4 && "Select facilities"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Step 1: Patient Selection */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <Form {...patientForm}>
                                <form onSubmit={patientForm.handleSubmit(onSubmitPatient)} className="space-y-4">
                                    <FormField
                                        control={patientForm.control}
                                        name="nik"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>NIK</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter patient NIK" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? "Searching..." : "Search Patient"}
                                    </Button>
                                </form>
                            </Form>

                            {/* Patient Information Card */}
                            {patient && (
                                <Card className="border-green-200 bg-green-50">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center text-green-800">
                                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            Patient Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="space-y-2">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">Full Name</p>
                                                    <p className="text-lg font-semibold text-gray-900">{patient.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">NIK</p>
                                                    <p className="text-gray-900 font-mono">{patient.nik}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">Email</p>
                                                    <p className="text-gray-900">{patient.email}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">Date of Birth</p>
                                                    <p className="text-gray-900">
                                                        {patient.birth_date ? new Date(patient.birth_date).toLocaleDateString('id-ID') : 'Not provided'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">Gender</p>
                                                    <p className="text-gray-900 capitalize">{patient.gender || 'Not provided'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex space-x-3">
                                            <Button 
                                                onClick={() => setCurrentStep(2)} 
                                                className="flex-1"
                                                size="lg"
                                            >
                                                Continue with this Patient
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                onClick={() => {
                                                    setPatient(undefined);
                                                    // patientForm.reset();
                                                }}
                                                className="flex-1"
                                                size="lg"
                                            >
                                                Search Another Patient
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}

                    {/* Step 2: Date Selection */}
                    {currentStep === 2 && (
                        <Form {...dateForm}>
                            <form onSubmit={dateForm.handleSubmit(onSubmitDates)} className="space-y-4">
                                <FormField
                                    control={dateForm.control}
                                    name="dateIn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Check-in Date</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                    value={field.value ? field.value.toISOString().split('T')[0] : ''}
                                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={dateForm.control}
                                    name="dateOut"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Check-out Date</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                    value={field.value ? field.value.toISOString().split('T')[0] : ''}
                                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Checking Availability..." : "Check Room Availability"}
                                </Button>
                            </form>
                        </Form>
                    )}

                    {/* Step 3: Room Selection */}
                    {currentStep === 3 && (
                        <Form {...roomForm}>
                            <form onSubmit={roomForm.handleSubmit(onSubmitRoom)} className="space-y-4">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Available Rooms</h3>
                                    {availableRooms.length === 0 ? (
                                        <p className="text-gray-500">No rooms available for selected dates</p>
                                    ) : (
                                        <FormField
                                            control={roomForm.control}
                                            name="roomId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="grid gap-4">
                                                        {availableRooms.map((room) => (
                                                            <div
                                                                key={room.id}
                                                                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                                                    field.value === room.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                                                }`}
                                                                onClick={() => field.onChange(room.id)}
                                                            >
                                                                <div className="flex justify-between items-center">
                                                                    <div>
                                                                        <h4 className="font-semibold">{room.name}</h4>
                                                                        <p className="text-gray-600">{room.description.substring(0, 10)}...</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="font-bold">Rp{room.price_per_day}/night</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </div>
                                <div className="flex space-x-4">
                                    <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                                        Back
                                    </Button>
                                    <Button type="submit" className="flex-1" disabled={availableRooms.length === 0}>
                                        Continue
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}

                    {/* Step 4: Facility and Nurse Selection */}
                    {currentStep === 4 && (
                        <Form {...facilityForm}>
                            <form onSubmit={facilityForm.handleSubmit(onSubmitFinal)} className="space-y-6">
                                {/* Facility Selection */}
                                <FormField
                                    control={facilityForm.control}
                                    name="facilityIds"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select Facilities</FormLabel>
                                            <div className="grid gap-2">
                                                {availableFacilities.map((facility) => (
                                                    <div key={facility.id} className="flex items-center space-x-2 border rounded-lg p-3">
                                                        <Checkbox
                                                            checked={field.value.includes(facility.id)}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    field.onChange([...field.value, facility.id]);
                                                                } else {
                                                                    field.onChange(field.value.filter(id => id !== facility.id));
                                                                }
                                                            }}
                                                        />
                                                        <div className="flex-1 flex justify-between">
                                                            <span>{facility.name}</span>
                                                            <span className="font-semibold">Rp{facility.fee}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex space-x-4">
                                    <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                                        Back
                                    </Button>
                                    <Button type="submit" className="flex-1" disabled={loading}>
                                        {loading ? "Creating Reservation..." : "Create Reservation"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateReservation;