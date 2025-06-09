import BookedEventBox from "./BookedEventBox";
import arrow from "@/assets/icons/arrow.svg";
import { useState } from "react";

function BookTickets({ eventsData } : { eventsData: any[] }) {
    const [scroll, setScroll] = useState(false);

    return (
        <div className="events-container my-10 dark:text-white w-[86vw] relative right-[10vw]">
            <div className="flex items-center mb-4 justify-start">
                <h1 className="text-2xl font-bold relative left-16">Booked Events</h1>
            </div>
            <div className="flex relative right-10">
                <div className="w-20 mr-10">
                    <img
                        src={arrow}
                        alt="arrow"
                        className="dark:invert h-10 w-10 hover:scale-110 cursor-pointer transition-all ease-in-out duration-300"
                        onClick={() => {
                            //move BookedEventBox boxes to
                            if (
                                document.querySelector(".scrollbar-hidden")?.scrollLeft === 0
                            ) {
                                setScroll(false);
                            }
                            document.querySelector(".scrollbar-hidden")?.scrollTo({
                                left:
                                    (document.querySelector(".scrollbar-hidden")?.scrollLeft ?? 0) - 400,
                                behavior: "smooth",
                            });
                        }}
                        hidden={!scroll}
                    />
                </div>

                <div className="flex gap-6 overflow-y-scroll scrollbar-hidden">
                    {eventsData?.map((event) => (
                        <div key={event?.eventId}>
                            <BookedEventBox events={event} />
                        </div>
                    ))}
                </div>

                <div className="w-20 ml-10">
                    <img
                        src={arrow}
                        alt="arrow"
                        className="dark:invert h-10 w-10 rotate-180 hover:scale-110 cursor-pointer transition-all ease-in-out duration-300"
                        onClick={() => {
                            //move BookedEventBox boxes to right
                            setScroll(true);
                            document.querySelector(".scrollbar-hidden")?.scrollTo({
                                left:
                                    (document.querySelector(".scrollbar-hidden")?.scrollLeft ?? 0) + 400,
                                behavior: "smooth",
                            });
                        }}
                        hidden={
                            //if the scroll is at the end of the scrollable area
                            document.querySelector(".scrollbar-hidden")?.scrollLeft === 0
                        }
                    />
                </div>
            </div>
            <div className="blur-left"></div>
            <div className="blur-right"></div>
        </div>
    );
}

export default BookTickets;
