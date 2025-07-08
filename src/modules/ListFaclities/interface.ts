import { CustomFetchBaseResponse } from "@/components/utils/customFetch/interface";

export interface Facility {
    id: string;
    name: string;
    fee: number;
}

export interface ListFacilitiesResponse extends CustomFetchBaseResponse {
    data: Facility[];
}