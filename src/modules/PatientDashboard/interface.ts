import { CustomFetchBaseResponse } from "@/components/utils/customFetch/interface";

export interface PatientDashboardProps extends CustomFetchBaseResponse {
    data: {
        total_reservations: number;
    }
}