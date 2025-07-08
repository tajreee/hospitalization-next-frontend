"use client"
import React, { useState } from "react";
import { Facility } from "./interface";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { customFetch } from "@/components/utils/customFetch";
import { toast } from "sonner";

const ListFacilities = ({
    facilities
}: {
    facilities: Facility[]
}) => {
    console.log("Facilities facilities asdada:", facilities);
    
    const [loading, setLoading] = useState<string | null>(null);
    const [localFacilities, setLocalFacilities] = useState<Facility[]>(facilities);

    const handleDeleteFacility = async (facilityId: string, facilityName: string) => {
        try {
            setLoading(facilityId);
            
            const response = await customFetch(`/facilities/${facilityId}/delete`, {
                method: 'DELETE',
                isAuthorized: true,
            });

            if (!response.success) {
                toast.error(`Failed to delete facility: ${response.message}`);
                return;
            }

            // Update local state to remove deleted facility
            setLocalFacilities(prev => prev.filter(facility => facility.id !== facilityId));
            toast.success(`Facility "${facilityName}" deleted successfully`);
            
        } catch (error) {
            console.error("Error deleting facility:", error);
            toast.error("An error occurred while deleting the facility");
        } finally {
            setLoading(null);
        }
    };
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h2 className="text-3xl font-bold text-fuchsia-700 mb-1">List of Facilities</h2>
            <p className="text-lg text-gray-600 mb-4">Here are the available facilities:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 w-full max-w-6xl mx-auto justify-items-center">
                {localFacilities.map((facility) => (
                    <div key={facility.id} className="bg-white border-fuchsia-700 border-2 shadow-md rounded-lg p-6 w-full max-w-sm">
                        <h3 className="text-2xl font-bold text-fuchsia-700 mb-2 text-center">{facility.name}</h3>
                        <p className="text-center mb-4">Rp{facility.fee}</p>
                        <div className="flex justify-center">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button 
                                        className="text-white transition-colors"
                                        disabled={loading === facility.id}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        {loading === facility.id ? "Deleting..." : "Delete Facility"} 
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the facility 
                                            <span className="font-semibold"> "{facility.name}"</span> and remove all associated data.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                            onClick={() => handleDeleteFacility(facility.id, facility.name)}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                ))}
            </div>
            {localFacilities.length === 0 && (
                <div className="text-center mt-8">
                    <p className="text-lg text-gray-600">No facilities available</p>
                </div>
            )}
        </div>
    )
}

export default ListFacilities;