import { CustomFetchBaseResponse } from "@/components/utils/customFetch/interface";
import { Facility } from "../ListFaclities/interface";

export interface CreateFacilityResponse extends CustomFetchBaseResponse {
    data: Facility;
}