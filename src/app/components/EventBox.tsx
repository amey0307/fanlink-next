import React from "react";
import time_icon from "@/assets/icons/clock.svg";
import { MapPinCheckInside, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { EventData } from "@/app/type/util";

function EventBox({ events } : { events: EventData }) {

    return (
        <div className="event-box border shadow-md rounded-lg p-4 w-[18vw] h-[38vh] group bg-white dark:bg-[#020e0166] dark:border border-gray-500 backdrop:blur-3xl relative">
            <Link href={`/event/${events?._id}`}>
                <img
                    src={events?.imageURL}
                    alt={events?.eventName}
                    className="w-full h-[20vh] object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform duration-200"
                />
            </Link>
            <div className="flex">
                <div>
                    <h3 className="font-bold text-lg mb-2">{events?.eventName}</h3>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2 ml-[2px]">
                        <Calendar className="w-5 h-5 dark:invert hue-rotate-180" />
                        {format(events?.eventDate, "MMMM dd, yyyy")}
                        <span className="mx-2">|</span>
                        <Clock className="w-5 h-5 dark:invert hue-rotate-180" />
                        {events?.eventTime}
                    </p>
                    <p className="text-sm text-gray-500 mb-2 flex items-center gap-1 ml-[2px] mt-2">
                        <MapPinCheckInside className="w-5 h-5 dark:invert hue-rotate-180" />
                        {events?.location}
                    </p>
                </div>
                <Link href={`/event/${events?._id}`}>
                    <button
                        className="text-white bg-teal-600 font-medium text-sm mt-2 rounded-md px-0 group-hover:bg-red-500 transition-all duration-200 hover:scale-105 w-20 h-10 absolute right-4 bottom-4"
                    >
                        $ {events?.price}
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default EventBox;
