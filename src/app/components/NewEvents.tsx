import React from "react";
import EventBox from "./EventBox";

// interface Event {
//     _id: string;
//     eventName: string;
//     eventDate: Date;
//     eventTime: string;
//     location: string;
//     price: number;
//     imageURL: string;
//     viewMoreLink: string;
// }

function NewEvents({ eventsData }: { eventsData: any }) {
    if (eventsData?.length == 0) {
        return <h1 className="text-2xl font-bold mb-4">No new events found</h1>;
    }

    return (
        <div className="events-container mx-auto mt-10 dark:text-white">
            {/* {console.log("events: ", eventsData)} */}
            <div className="flex items-center justify-between px-4 mb-4">
                <h1 className="text-2xl font-bold"> New Events </h1>
                <button className="view-more text-center">
                    <a
                        href={eventsData.viewMoreLink}
                        className="text-blue-500 hover:text-blue-700 font-semibold"
                    >
                        View more
                    </a>
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                {/* <div className="flex flex-wrap justify-start gap-10 mx-10"> */}
                {eventsData?.map((event : any, index : number) => (
                    <div key={index}>
                        <EventBox events={event} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NewEvents;
