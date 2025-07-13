import { CustomFetchBaseResponse } from "@/components/utils/customFetch/interface";
import { Room } from "../ListRooms/interface";

export interface CreateRoomResponse extends CustomFetchBaseResponse{
    data: {
        room: Room
    }
}