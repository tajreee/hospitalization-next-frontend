import { CustomFetchBaseResponse } from "@/components/utils/customFetch/interface";
import { Room } from "../ListRooms/interface";

export interface CreateReservationResponse extends CustomFetchBaseResponse {
    errors?: string[];
    data: {
        reservation: Reservation;
    }
}

export interface GetAllNursesResponse extends CustomFetchBaseResponse {
    data: {
        nurses: Nurse[];
    }
}

export interface GetAllRoomsResponse extends CustomFetchBaseResponse {
    data: {
        rooms: Room[];
    }
}

export interface GetAllFacilitiesResponse extends CustomFetchBaseResponse {
    data: {
        facilities: Facility[];
    }
}

export interface Reservation {
    id: string;
    dateIn: string;
    dateOut: string;
    totalFee: number;
    patientId: string;
    nurseId: string;
    roomId: string;
    facilities: Facility[];

}

export interface Facility {
    id: string;
    name: string;
    fee: number;
}

export interface Nurse {
    id: string;
    name: string;
    email: string;
}