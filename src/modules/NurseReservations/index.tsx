"use client"

import React from "react";
import { Reservation } from "./interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, UserCheck, Home, Clock, Plus, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export const NurseReservations = (
    { reservations }: { reservations: Reservation[] }
) => {
    const router = useRouter();

    // Helper function to format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Helper function to calculate duration
    const calculateDuration = (dateIn: string, dateOut: string) => {
        const checkIn = new Date(dateIn);
        const checkOut = new Date(dateOut);
        const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Helper function to get status based on dates
    const getReservationStatus = (dateIn: string, dateOut: string) => {
        const today = new Date();
        const checkIn = new Date(dateIn);
        const checkOut = new Date(dateOut);
        
        today.setHours(0, 0, 0, 0);
        checkIn.setHours(0, 0, 0, 0);
        checkOut.setHours(0, 0, 0, 0);

        if (today < checkIn) {
            return { status: 'upcoming', color: 'bg-blue-100 text-blue-800' };
        } else if (today >= checkIn && today <= checkOut) {
            return { status: 'active', color: 'bg-green-100 text-green-800' };
        } else {
            return { status: 'completed', color: 'bg-gray-100 text-gray-800' };
        }
    };

    // Navigation handlers
    const handleCreateReservation = () => {
        router.push('/reservations/create');
    };

    const handleViewDetail = (reservationId: string) => {
        router.push(`/reservations/${reservationId}`);
    };

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reservations</h1>
                            <p className="text-gray-600">Manage and view all patient reservations</p>
                        </div>
                        <Button 
                            onClick={handleCreateReservation}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Create Reservation</span>
                        </Button>
                    </div>
                </div>

                {reservations.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reservations Found</h3>
                        <p className="text-gray-600 mb-4">There are no reservations to display at this time.</p>
                        <Button 
                            onClick={handleCreateReservation}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors duration-200 flex items-center space-x-2 mx-auto"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Create First Reservation</span>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {reservations.map((reservation) => {
                            const { status, color } = getReservationStatus(reservation.dateIn, reservation.dateOut);
                            const duration = calculateDuration(reservation.dateIn, reservation.dateOut);

                            return (
                                <Card key={reservation.id} className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                                                Reservation #{reservation.id}
                                            </CardTitle>
                                            <Badge className={`${color} border-0`}>
                                                {status === 'upcoming' && 'Upcoming'}
                                                {status === 'active' && 'Active'}
                                                {status === 'completed' && 'Completed'}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    
                                    <CardContent className="space-y-4">
                                        {/* Patient Information */}
                                        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Patient</p>
                                                <p className="font-semibold text-gray-900">{reservation.patientName}</p>
                                            </div>
                                        </div>

                                        {/* Nurse Information */}
                                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                <UserCheck className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Assigned Nurse</p>
                                                <p className="font-semibold text-gray-900">{reservation.nurseName}</p>
                                            </div>
                                        </div>

                                        {/* Room Information */}
                                        <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                                <Home className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Room</p>
                                                <p className="font-semibold text-gray-900">{reservation.roomName}</p>
                                            </div>
                                        </div>

                                        {/* Date Information */}
                                        <div className="space-y-3 p-3 bg-amber-50 rounded-lg">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-4 h-4 text-amber-600" />
                                                <p className="text-sm font-medium text-amber-800">Check-in & Check-out</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <p className="text-gray-600">Check-in</p>
                                                    <p className="font-semibold text-gray-900">
                                                        {formatDate(reservation.dateIn)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Check-out</p>
                                                    <p className="font-semibold text-gray-900">
                                                        {formatDate(reservation.dateOut)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Duration */}
                                            <div className="flex items-center space-x-2 pt-2 border-t border-amber-200">
                                                <Clock className="w-4 h-4 text-amber-600" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Duration</p>
                                                    <p className="font-semibold text-gray-900">
                                                        {duration} {duration === 1 ? 'day' : 'days'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="pt-2">
                                            <Button 
                                                onClick={() => handleViewDetail(reservation.id)}
                                                variant="outline" 
                                                className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-colors duration-200 flex items-center justify-center space-x-2"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>View Details</span>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NurseReservations;