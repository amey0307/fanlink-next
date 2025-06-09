'use client';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import HomeSkeleton from "@/app/components/HomeSkeleton";
import { useTheme } from "@/app/context/ThemeProvider";
import Carousel from "@/app/components/Carousel";
import PaymentComponent from "@/app/components/PaymentComponent";
import { useAuth } from "@/app/context/AuthContext";
import { format } from "date-fns";

function Eventpage() {
    const { eventId } = useParams();
    type EventType = {
        eventId?: string;
        eventName?: string;
        description?: string;
        imageURL?: string;
        eventDate?: string;
        location?: string;
        price?: number;
        originalPrice?: number;
        // Add other properties as needed
    };

    interface Theme {
        theme: string;
    }

    const [event, setEvent] = useState<any>({});
    const [user, setUser] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);
    const { theme } = useTheme() as Theme;
    const { currentUser } = useAuth() as any;

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchData = async () => {
            setLoading(true);
            const fetchEvent = async () => {
                try {
                    const response = await axios.get(`/api/event/get/${eventId}`);
                    const currUser = await axios.get(`/api/user/current/${currentUser?.id}`);
                    setUser(currUser);
                    const data = response.data;
                    console.log(data)
                    setEvent(data.data);
                } catch (error) {
                    console.log(error);
                }
            };

            await Promise.all([fetchEvent()]);
            setLoading(false);
        };

        fetchData();
    }, [eventId, currentUser]);

    if (loading) {
        return <HomeSkeleton />;
    }

    return (
        <div className={`${theme}`}>
            <div className="min-h-screen bg-white dark:bg-gradient-to-br from-green-950 to-[#000000] font-lato">
                {/* Hero Section with Carousel */}
                <div className="relative h-80 mb-8">
                    <Carousel
                        items={[
                            {
                                type: "image",
                                src: event?.imageURL || "https://media.istockphoto.com/id/1137781079/photo/black-man-playing-acoustic-guitar-and-singing-on-stage.jpg?s=612x612&w=0&k=20&c=vJ54S7U7uEHO2Oa8N2QZENmOi6kcFCtaS8chva_MaWU=",
                            },
                            {
                                type: "image",
                                src: "https://assets.unileversolutions.com/v1/985812.jpg",
                            },
                            {
                                type: "image",
                                src: "https://media.istockphoto.com/id/1461816749/photo/a-crowd-of-people-with-raised-arms-during-a-music-concert-with-an-amazing-light-show-black.jpg?s=612x612&w=0&k=20&c=-hdWCLDP5AI9A3mjq3JPMPKhXxJ2P1iItPDFktQHxX8=",
                            },
                        ]}
                    />

                    {/* Event Date Badge */}
                    <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-md shadow-lg">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                            {event?.eventDate && format(new Date(event.eventDate), "MMMM dd")}
                        </span>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-6">
                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        {/* Left Content */}
                        <div className="lg:col-span-2">
                            {/* Event Title and Basic Info */}
                            <div className="mb-8">
                                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                                    {event?.eventName || "Event Title"}
                                </h1>

                                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                                    {event?.description || "Event description goes here..."}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mb-6">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                        <span>♡</span>
                                        <span>345</span>
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                        <span>↗</span>
                                        <span>124</span>
                                    </button>
                                </div>
                            </div>

                            {/* Timing and Location Section */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-8">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                    Timing and location
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Date and Time */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                            <span className="text-green-600 dark:text-green-400">📅</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">DATE AND TIME</h3>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {event?.eventDate && format(new Date(event.eventDate), "EEEE, MMMM dd")}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-300">08:00 PM</p>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                            <span className="text-green-600 dark:text-green-400">📍</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">PLACE</h3>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {event?.location || "Event Location"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* About Event Section */}
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                    About event
                                </h2>

                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                            <span className="text-gray-600 dark:text-gray-400">⏱</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">DURATION</h4>
                                            <p className="text-gray-600 dark:text-gray-300">5 hours</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                            <span className="text-gray-600 dark:text-gray-400">🎫</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">TICKET</h4>
                                            <p className="text-gray-600 dark:text-gray-300">Email e-Ticket</p>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {event?.description || "Detailed event description will be displayed here. This is an exciting event that brings together diverse groups of people for an unforgettable experience."}
                                </p>

                                <button className="text-green-600 dark:text-green-400 hover:underline mt-2">
                                    Read more
                                </button>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6">
                                {/* Event Image */}
                                <div className="mb-6">
                                    <img
                                        src={event?.imageURL || "https://avatar.iran.liara.run/public"}
                                        alt={event?.title}
                                        className="w-full h-64 object-cover rounded-xl"
                                        loading="lazy"
                                    />
                                </div>

                                {/* Price and Booking */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Price</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                ${event?.price || "90"} / Ticket
                                            </span>
                                            {event?.originalPrice && (
                                                <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded text-sm">
                                                    12% Off
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {!user?.data?.user?.bookedEvents?.includes(event?.eventId) ? (
                                        <div>
                                            <PaymentComponent eventData={event} />
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <button className="w-full bg-green-600 hover:bg-green-900 text-white py-3 rounded-lg font-semibold transition-colors">
                                                Go To Tickets
                                            </button>
                                            <button className="w-full bg-red-700 hover:bg-red-900 text-white py-3 rounded-lg font-semibold transition-colors">
                                                Cancel Ticket
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Eventpage;