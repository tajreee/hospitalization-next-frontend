import { CustomFetchBaseResponse } from "@/components/utils/customFetch/interface";

export interface NurseDashboardResponse extends CustomFetchBaseResponse {
    data: NurseDashboardProps;
}

export interface NurseDashboardProps {
    total_reservations: number;
    total_patients: number;
    total_rooms: number;
}