"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import EventBox from "@/app/components/EventBox";
import HomeSkeleton from "@/app/components/HomeSkeleton";

export default function LikedEvents() {
  const { currentUser } = useAuth() as any;
  const [likeData, setLikeData] = useState<any>(null);
  const [events, setEvents] = useState<any>([]);
  const [likedEvents, setlikedEvents] = useState<any>([]);

  useEffect(() => {
    const fetchLiked = async () => {
      const response = await axios.get(
        `/api/user/get-liked-events/${currentUser.id}`,
      );
      if (response.status === 200) {
        // console.log(response.data);
        setLikeData(response.data);
      } else {
        console.error("Failed to fetch liked events");
      }
    };
    fetchLiked();
    
    const getEvents = async () => {
      // Fetch events from the API
      const data = await axios.get(`/api/event/get-all`);

      setEvents(data.data.data);
    };
    getEvents();
  }, [currentUser?.id]);

  useEffect(() => {
    setlikedEvents(
       Array.isArray(events) && likeData?.likedEvents
         ? events.filter(ev => likeData.likedEvents.includes(ev._id))
         : []
     );
  }, [events, likeData]);
  
  if (!likeData) {
    return <HomeSkeleton/>
  }

  return (
    <div className="events-container mx-auto mt-10 dark:text-white min-h-[60vh] px-10">
        {/* {console.log("events: ", eventsData)} */}
        <div className="flex items-center justify-between px-4 mb-4">
            <h1 className="text-2xl font-bold"> New Events </h1>
            <button className="view-more text-center">
                <a
                    href='#'
                    className="text-blue-500 hover:text-blue-700 font-semibold"
                >
                    View more
                </a>
            </button>
        </div>
        {
            likedEvents.length > 0 ? (
                <div className="flex wrap-anywhere justify-start gap-10 mx-10">
                    {likedEvents.map((event: any, index: number) => (
                        <div key={index}>
                            <EventBox events={event} />
                        </div>
                    ))}
                </div>
            ) : (
                <h1 className="text-2xl font-bold mb-4">No liked events found</h1>
            )
        }
    </div>
  );
}
