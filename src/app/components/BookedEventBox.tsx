"use client";
import React from "react";
import Link from "next/link";
import { MapPinCheckInside, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import { EventData } from "@/app/type/util";
import Image from "next/image";

function BookedEventBox({ events }: { events: EventData }) {
  return (
    <div className="event-box border shadow-md rounded-lg p-4 w-[50vw] h-full md:w-[20vw] group bg-white dark:bg-[#020e0166] dark:border border-gray-500 backdrop:blur-3xl relative">
      <h3 className="font-bold text-lg mb-2">{events?.eventName}</h3>
      <div className="text-sm text-gray-500 mb-1 flex flex-col md:flex-row items-start gap-3 ml-[2px] mt-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-5 h-5 dark:invert hue-rotate-180" />
          <h3>{format(events?.eventDate, "MMMM dd, yyyy")}</h3>
        </div>
        <span className="hidden md:inline mx-2">|</span>
        <div className="flex gap-1">
          <Clock className="w-5 h-5 dark:invert hue-rotate-180" />
          {events?.eventTime}
        </div>
      </div>
      <div className="text-sm text-gray-500 mb-2 flex items-center gap-1 mt-3">
        <MapPinCheckInside className="w-6 h-6 dark:invert hue-rotate-180" />
        {events?.location}
      </div>
      <Link href={`/showTicket/${events?._id}`}>
        <button className="text-black dark:text-white bg-[#b2eebda9] dark:bg-[#081b0ba5] font-medium text-sm rounded-md px-2 group-hover:bg-slate-900 dark:group-hover:bg-slate-100 group-hover:text-white dark:group-hover:text-black transition-all duration-200 hover:scale-[1.02] h-8 cursor-pointer mt-4">
          Show Event
        </button>
      </Link>
      <div className="hidden md:inline image-container overflow-hidden absolute top-4 right-4 cursor-pointer">
        <Link href={`/showTicket/${events?._id}`}>
          <img
            src={events?.imageURL}
            alt={events?.eventName}
            className="w-10 h-10 object-cover rounded-md transform transition-transform duration-300 cursor-pointer"
          />
        </Link>
      </div>
    </div>
  );
}

export default BookedEventBox;
