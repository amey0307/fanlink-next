'use client';
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeProvider";
import Carousel from "../components/Carousel";
import NewEvents from "../components/NewEvents";
import Search from "../components/Search";
import HomeSkeleton from "../components/HomeSkeleton";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Booktickets from "../components/BookTickets";
import { toast } from "sonner";

function Dashboard() {
    const { currentUser } = useAuth() as any;
    const { theme } = useTheme();
    const [location, setLocation] = useState({
        latitude: 0,
        longitude: 0,
        country: "India",
        city: "Delhi",
    });
    const [search, setSearch] = useState("");
    const [events, setEvents] = useState({});
    const [bookedTicket, setBookedTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalTickets, setTotalTickets] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const getEvents = async () => {
                const data = await axios.get(`/api/event/get-all`);
                // console.log(data);
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
    }, []);

    useEffect(() => {
        //api for events in specific location
        // console.log("home location: ", location);
    }, [location]);

    const handleClickSearch = () => {
        const searchQuery = {
            search: search,
            location: location,
        };

        toast.success(JSON.stringify(searchQuery));
    };

    if (loading) {
        return (
            <div>
                <HomeSkeleton />
            </div>
        );
    }

    return (
        <div className={`${theme} transition-all duration-500`}>
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

                    <Search
                        search={search}
                        setSearch={setSearch}
                        location={location}
                        setLocation={setLocation}
                        handleClickSearch={handleClickSearch}
                    />

                    <div
                        className="border-2 w-full bg-gradient-to-br dark:from-[#051802dd] dark:to-[#0a0a0a9a] from-[#31303000] to-[#28292828] rounded-t-2xl mt-10 px-[19vw] backdrop-blur-2xl h-[30vh]"
                        hidden={totalTickets === 0}
                    >
                        {<Booktickets eventsData={bookedTicket ?? []} />}
                    </div>

                    <div className="mb-10">
                        <NewEvents eventsData={events} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
