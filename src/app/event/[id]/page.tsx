'use client';
import { use, useEffect, useRef, useState } from "react";
import axios from "axios";
import HomeSkeleton from "@/app/components/HomeSkeleton";
import { useTheme } from "@/app/context/ThemeProvider";
import Carousel from "@/app/components/Carousel";
import PaymentComponent from "@/app/components/PaymentComponent";
import { format } from "date-fns";
import { useAuth } from "@/app/context/AuthContext";
import { useParams } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner";

function Eventpage() {
    const params = useParams();
    const eventId = params.id;
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleReadMore = () => {
        setIsExpanded(!isExpanded);
    };

    const handleCancelTicket = async (eventId: string) => {
        if (!eventId) {
            console.error("Event ID is required to cancel the ticket.");
            return;
        }

        try {
            const response = await axios.delete('/api/user/delete-event', {
                data: { eventId, userId: currentUser?.id }
            });

            if (response.status === 200) {
                toast.success("Ticket cancelled successfully");
                new Promise((resolve) => {
                    setTimeout(() => {
                        window.location.reload();
                        resolve(true);
                    }, 1000);
                });
            } else if (response.status === 400) {
                toast.error("You have not booked this event or it has already been cancelled.");
                console.error("You have not booked this event or it has already been cancelled.");
            } else {
                toast.error("Failed to cancel ticket:", response.data);
            }
        } catch (error: any) {
            toast.error("Error cancelling ticket:", error.message);
        }
    }

    interface Theme {
        theme: string;
    }

    const [event, setEvent] = useState<any>({});
    const [user, setUser] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);
    const { theme } = useTheme() as Theme;
    const { currentUser, signIn } = useAuth() as any;

    useEffect(() => {
        window.scrollTo(0, 0);
        // console.log("eventId:", eventId);

        if (!eventId || !currentUser?.id) {
            console.log("Missing eventId or currentUser");
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const [eventResponse, userResponse] = await Promise.all([
                    axios.get(`/api/event/get/${eventId}`),
                    axios.get(`/api/user/current/${currentUser?.id}`)
                ]);

                setEvent(eventResponse.data.data);
                setUser(userResponse.data);
                // console.log("Event data:", eventResponse.data);
                // console.log("Event data:", eventResponse.data);

                const userData = { ...currentUser, ...userResponse.data };
                await signIn(userData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [eventId, currentUser?.id]);

    if (loading) {
        return <HomeSkeleton />;
    }

    return (
        <div className={`${theme}`}>
            {/* Remove min-h-screen and add proper container height */}
            <div className="bg-white dark:bg-gradient-to-br from-green-950 to-[#000000] font-lato">
                {/* Hero Section with Carousel */}
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 mx-auto text-center pt-8">
                    {"Event Details"}
                </h1>
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

                {/* Change pb-20 to pb-8 or remove it entirely */}
                <div className="max-w-6xl mx-auto px-6 pb-8">
                    {/* Main Content - Remove mb-12 and make it mb-0 or mb-8 */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Content */}
                        <div className="lg:col-span-2">
                            {/* Event Title and Basic Info */}
                            <div className="mb-8">
                                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                                    {event?.eventName || "Event Title"}
                                </h1>

                                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                                    {event?.short_description || "Event description goes here..."}
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

                            {/* About Event Section - Remove mb-8 and make it mb-0 since it's the last section */}
                            <div className="mb-0">
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

                                <div className="relative">
                                    <p className={`text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-300 ${!isExpanded ? 'line-clamp-3' : ''
                                        }`}>
                                        {event?.description || "Detailed event description will be displayed here. This is an exciting event that brings together diverse groups of people for an unforgettable experience."}
                                    </p>

                                    {/* Gradient overlay when collapsed */}
                                    {!isExpanded && (
                                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-black to-transparent"></div>
                                    )}
                                </div>

                                <button
                                    className="text-green-600 dark:text-green-400 hover:underline mt-2 transition-colors inline-flex items-center gap-1"
                                    onClick={toggleReadMore}
                                >
                                    {isExpanded ? (
                                        <>
                                            Read less
                                            <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </>
                                    ) : (
                                        <>
                                            Read more
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </>
                                    )}
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
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg shadow-gray-200 dark:shadow-gray-900">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Price</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">₹
                                                {event?.price || "Free"} / Ticket
                                            </span>
                                            {event?.price && (
                                                <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded text-sm">
                                                    12% Off
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {!user?.user?.bookedEvents?.includes(event?.eventId) ? (
                                        <div>
                                            <PaymentComponent eventData={event} />
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <button className="w-full bg-green-700 hover:bg-green-900 text-white py-3 rounded-lg font-semibold transition-colors">
                                                Go To Tickets
                                            </button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <button className="w-full bg-red-800 hover:bg-red-900 text-white py-3 rounded-lg font-semibold transition-colors">
                                                        Cancel Ticket
                                                    </button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Cancel Ticket</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to cancel your ticket for this event?
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleCancelTicket(event?.eventId)}>
                                                            Confirm
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
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