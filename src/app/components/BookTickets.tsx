import BookedEventBox from "./BookedEventBox";
import arrow from "@/assets/icons/arrow.svg";
import { useState } from "react";
import { EventData } from "@/app/type/util";

function BookTickets({ eventsData }: { eventsData: EventData[] }) {
    const [scroll, setScroll] = useState(false);

    return (
        <div className="events-container my-10 dark:text-white w-[86vw] relative right-[10vw]">
            <div className="flex items-center mb-4 justify-start">
                <h1 className="text-2xl font-bold relative left-16">Booked Events</h1>
            </div>
            <div className="flex relative left-[1.5vw]">
                <div className="flex gap-6 overflow-y-scroll scrollbar-hidden">
                    {eventsData?.map((event) => (
                        <div key={event?.eventId}>
                            <BookedEventBox events={event} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="blur-left"></div>
            <div className="blur-right"></div>
        </div>
    );
}

export default BookTickets;
