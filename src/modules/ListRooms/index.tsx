import React from "react";
import { Room } from "./interface";

const ListRooms = ({
    rooms
}:{
    rooms: Room[];
}) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold text-fuchsia-700 mb-1">List of Rooms</h1>
            <p className="text-lg text-gray-600 mb-4">Here are the registered rooms:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 w-full max-w-6xl mx-auto justify-items-center">
                {rooms.map((room) => (
                    <div key={room.id} className="bg-white border-fuchsia-700 border-2 shadow-md rounded-lg p-6 w-full max-w-sm">
                        <h2 className="text-xl font-semibold text-fuchsia-700 mb-2">{room.name}</h2>
                        <p className="text-gray-600 mb-4">{room.description}</p>
                        <p className="text-gray-800 mb-2">Max Capacity: {room.max_capacity}</p>
                        <p className="text-gray-800">Price per Day: ${room.price_per_day.toFixed(2)}</p>
                    </div>
                ))}
            </div>
            {rooms.length === 0 && (
                <div className="text-center mt-8">
                    <p className="text-lg text-gray-600">No rooms available</p>
                </div>
            )}
        </div>
    )
}

export default ListRooms;