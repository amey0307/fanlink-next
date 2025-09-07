"use client";
import { useAuth } from "../context/AuthContext";
import Carousel from "../components/Carousel";
import NewEvents from "../components/NewEvents";
import Search from "../components/Search";
import HomeSkeleton from "../components/HomeSkeleton";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Booktickets from "../components/BookTickets";
import { toast } from "sonner";
import { EventData } from "../type/util";
import HomeSkeletonMobile from "../components/HomeSkeletonMobile";
import RecommendEvents from "../components/RecommendEvents";
import { resolve } from "path";

function Dashboard() {
  const { currentUser } = useAuth() as any;
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    country: "India",
    city: "Delhi",
  });
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState<EventData[]>([]);
  const [bookedTicket, setBookedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalTickets, setTotalTickets] = useState(0);
  const [recommendedEvents, setRecommendedEvents] = useState<EventData[]>([]);

  // Fetch all events from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const getEvents = async () => {
        // Fetch events from the API
        const data = await axios.get(`/api/event/get-all`);
        setEvents(data.data.data);
      };

      const getBookedTickets = async () => {
        const res = await axios.get(`/api/user/get-booked-events`);
        setBookedTicket(res.data.data?.eventData);
        setTotalTickets(res.data.data?.totalEvents);
      };

      await Promise.all([getEvents(), getBookedTickets()]);
      setLoading(false);
    };
    fetchData();
  }, [currentUser?.id]);

  //Fetch recommended events based on user genre (cache in redis for 1 hour)
  useEffect(() => {
    const fetchRecommendedEvents = async () => {
      try {

        //Check if user is logged in
        if (!currentUser?.id) {
          toast.error("Login to get personalized recommendations");
          return;
        }

        //check if the recommended events are cached in redis
        const cachedValue: any = await axios.get(`/api/cache?key=recommendedEvents-${currentUser?.id}`);

        console.log("Cached recommended events: ", cachedValue.data.data);
        if (cachedValue.data.data) {
          setRecommendedEvents(cachedValue.data.data);
          toast.success("Loaded recommended events from cache");
          return;
        }

        //If not cached, fetch from the API
        toast.success("Fetching recommended events from API");
        const response = await axios.post(`/api/event/recommend`, {
          userId: currentUser?.id
        });

        // If no recommendations found
        if (response.data.code === "NRF") {
          toast.error("No recommendations found. Please update your favorite genres in profile.");
          return;
        }

        //cache the recommended events in redis for 1 hour
        console.log("Caching recommended events in redis : ", response.data.data);
        await axios.post(`/api/cache`, {
          data: response.data.data,
          userId: currentUser?.id
        });

        //set the recommended events
        setRecommendedEvents(response.data.data);
      } catch (error) {
        console.error("Error fetching recommended events:", error);
        toast.error("Error fetching recommended events");
      }
    };

    fetchRecommendedEvents();
  }, [currentUser?.id]);

  useEffect(() => {
    console.log("recommendedEvents: ", recommendedEvents);
  }, [recommendedEvents])

  // Function to handle search button click
  const handleClickSearch = () => {
    const searchQuery = {
      search: search,
      location: location,
    };

    toast.success(JSON.stringify(searchQuery));
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="dark:bg-gradient-to-br from-green-950 to-[#000000] min-h-screen">
        {typeof window !== "undefined" && window.innerWidth > 768 ? (
          <HomeSkeleton />
        ) : (
          <div className="flex justify-center items-center min-h-screen">
            <HomeSkeletonMobile />
          </div>
        )}
      </div>
    );
  }

  // Main dashboard content
  return (
    <div className={`transition-all duration-500`}>
      <div className="dark:bg-gradient-to-br from-green-950 to-[#000000] min-h-screen">
        <div>
          {/* Add your dashboard content here */}
          <p className="text-pretty font-semibold text-5xl text-center pt-10 dark:text-teal-600">
            Welcome{" "}
            <span className="dark:text-teal-50 text-teal-800j px-2 rounded-lg">
              {currentUser?.firstName}
            </span>
          </p>
        </div>
        <div className="flex flex-col items-center font-lato pt-10 min-h-screen">
          <Carousel
            items={[
              {
                type: "image",
                src: "https://media.istockphoto.com/id/1137781079/photo/black-man-playing-acoustic-guitar-and-singing-on-stage.jpg?s=612x612&w=0&k=20&c=vJ54S7U7uEHO2Oa8N2QZENmOi6kcFCtaS8chva_MaWU=",
              },
              {
                type: "image",
                src: "https://assets.unileversolutions.com/v1/985812.jpg",
              },
              {
                type: "image",
                src: "https://media.istockphoto.com/id/1461816749/photo/a-crowd-of-people-with-raised-arms-during-a-music-concert-with-an-amazing-light-show-black.jpg?s=612x612&w=0&k=20&c=-hdWCLDP5AI9A3mjq3JPMPKhXxJ2P1iItPDFktQHxX8=",
              },
              {
                type: "image",
                src: "https://media.istockphoto.com/id/1388162040/photo/a-crowded-concert-hall-with-scene-stage-in-red-lights-rock-show-performance-with-people.jpg?s=612x612&w=0&k=20&c=targHe_OLdtslvDsyC4nYBxDzyIRF71C66CqiMmcwvE=",
              },
            ]}
          />

          {typeof window !== "undefined" && window?.innerWidth > 768 && (
            <Search
              setLocation={setLocation}
              search={search}
              setSearch={setSearch}
              handleClickSearch={handleClickSearch}
            />
          )}

          {/* Booked Tickets */}
          <div
            className="border-2 w-full bg-gradient-to-br dark:from-[#051802dd] dark:to-[#0a0a0a9a] from-[#31303000] to-[#28292828] rounded-t-2xl mt-10 px-[19vw] backdrop-blur-2xl h-[30vh]"
            hidden={totalTickets === 0}
          >
            {<Booktickets eventsData={bookedTicket ?? []} />}
          </div>

          {/* New Events */}
          <div className="mb-10">
            <NewEvents eventsData={events} />
          </div>

          {/* Recommended Events */}
          <div className="mb-10">
            <RecommendEvents eventsData={recommendedEvents} />
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
