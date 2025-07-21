import { CustomFetchBaseResponse } from "@/components/utils/customFetch/interface";

export interface GetAllReservationsResponse extends CustomFetchBaseResponse {
    data: {
        reservations: Reservation[];
    }
}

export interface Reservation {
    id: string;
    patientName: string;
    nurseName: string;
    roomName: string;
    dateIn: string; // ISO date string
    dateOut: string; // ISO date string
}