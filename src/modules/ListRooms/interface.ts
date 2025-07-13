import { CustomFetchBaseResponse } from "@/components/utils/customFetch/interface";

export interface ListRoomsResponse extends CustomFetchBaseResponse {
    data: {
        rooms: Room[]
    }
}

export interface Room {
    id: string;
    name: string;
    description: string;
    max_capacity: number;
    price_per_day: number;
}