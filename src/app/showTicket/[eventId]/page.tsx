'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useTheme } from '@/app/context/ThemeProvider';
import { format } from 'date-fns';
import {
    Calendar,
    Clock,
    MapPin,
    ArrowLeft,
    QrCode,
    Download,
    RefreshCw,
    MoreVertical,
    Ticket,
    Mail,
    Phone,
    User,
    Eye,
    ChevronLeft,
    ChevronRight,
    Share2,
    Heart,
    ExternalLink,
    BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';
import axios from 'axios';

interface EventData {
    _id: string;
    eventId: string;
    eventName: string;
    eventDate: string;
    eventTime: string;
    location: string;
    price: number;
    imageURL: string;
    description: string;
    seats: number;
}

interface TicketData {
    ticketId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    code: string;
    status: 'active' | 'cancelled' | 'used';
}

interface BookingData {

    _id: string,
    ticketId: string,
    eventId: string,
    userId: string,
    seatNumber: string,
    price: number,
    name: string,
    email: string,
    phone: string,
    status: 'booked' | 'cancelled' | 'used',
    createdAt: string,
    updatedAt: string,
    paymentId: string,
    length: number
}

// Loading Skeleton
const ShowTicketSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br from-green-950 to-[#000000]">
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="flex items-center gap-4 mb-6">
                    <Skeleton className="h-6 w-6 rounded" />
                    <div>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-8 w-64" />
                    </div>
                </div>

                <div className="space-y-6">
                    <Skeleton className="h-64 w-full rounded-lg" />
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-64 w-full rounded-lg" />
                </div>
            </div>
        </div>
    );
};

// Main content component
function ShowTicketContent() {
    const { currentUser } = useAuth() as any;
    const params = useParams();
    const router = useRouter();
    const eventId = params.eventId as string;

    const [event, setEvent] = useState<EventData | null>(null);
    const [booking, setBooking] = useState<BookingData[] | null>([]);
    const [loading, setLoading] = useState(true);
    const [processingReturn, setProcessingReturn] = useState(false);
    const [currentRecommendation, setCurrentRecommendation] = useState(0);

    // Generate ticket code
    const generateTicketCode = () => {
        return `MRCE-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    };

    const recommendedEvents = [
        {
            id: 1,
            name: "Fuel Your Passion for Rock Music",
            date: "Tuesday, August 18",
            time: "06:00 PM",
            location: "New York, NY",
            price: "From ₹100",
            discount: "20% OFF",
            image: "/api/placeholder/300/200"
        },
        {
            id: 2,
            name: "Musical Fusion Festival",
            date: "Monday, June 06",
            time: "06:00 PM",
            location: "New York, NY",
            price: "From ₹90",
            discount: "30% OFF",
            image: "/api/placeholder/300/200"
        }
    ];

    //Get event details and booking info
    useEffect(() => {
        const fetchEventDetails = async () => {
            if (eventId) {
                try {
                    const response = await axios.get(`/api/event/get/${eventId}`);
                    const bookingData: any = await axios.get(`/api/ticket/getBooked?userId=${currentUser?.id}&eventId=${eventId}`);
                    setEvent(response.data.data);
                    setBooking(bookingData.data.data);
                } catch (error) {
                    console.error('Error fetching event details:', error);
                    toast.error('Failed to load event details');
                }
            }
            setLoading(false);
        };

        fetchEventDetails();
    }, [eventId, currentUser]);

    // Handle ticket return
    const handleReturnTicket = async () => {
        setProcessingReturn(true);
        try {
            // Use the existing delete-event API
            const response = await axios.delete('/api/user/delete-event', {
                data: { eventId: event?.eventId, userId: currentUser?.id }
            });

            if (response.status === 200) {
                toast.success('Ticket return request submitted successfully');
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
            }
        } catch (error) {
            toast.error('Failed to process return request');
        } finally {
            setProcessingReturn(false);
        }
    };

    const handleDownloadTicket = () => {
        // Create a simple ticket download functionality
        const ticketData = {
            event: event?.eventName,
            date: event?.eventDate,
            time: event?.eventTime,
            location: event?.location,
            tickets: booking?.length,
            total: booking?.price
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ticketData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `ticket-${eventId}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();

        toast.success('Ticket download started');
    };

    const handleViewEventDetails = () => {
        router.push(`/event/${eventId}`);
    };

    const nextRecommendation = () => {
        setCurrentRecommendation((prev) =>
            prev === recommendedEvents.length - 1 ? 0 : prev + 1
        );
    };

    const prevRecommendation = () => {
        setCurrentRecommendation((prev) =>
            prev === 0 ? recommendedEvents.length - 1 : prev - 1
        );
    };

    if (loading) {
        return <ShowTicketSkeleton />;
    }

    if (!event || !booking) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br from-green-950 to-[#000000] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Event Not Found</h1>
                    <Link href="/dashboard" className="text-green-600 dark:text-green-400 hover:underline">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br from-green-950 to-[#000000]">
            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Header matching reference design */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            {event.eventDate ? format(new Date(event.eventDate), "MMMM dd | HH:mm") : "Date TBA"} PM
                        </p>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {event.eventName}
                        </h1>
                    </div>
                </div>

                {/* Event Image and Details */}
                <div className="bg-white dark:bg-[#09150caf] border-2 rounded-lg p-6 mb-6 shadow-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Event Image */}
                        <div className="lg:col-span-1">
                            <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                                {event.imageURL ? (
                                    <img
                                        src={event.imageURL}
                                        alt={event.eventName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Event Info Grid */}
                        <div className="lg:col-span-2">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">DATE AND TIME</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {event.eventDate ? format(new Date(event.eventDate), "EEEE, MMMM dd") : "Date TBA"}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{event.eventTime || "08:00 PM"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">DURATION</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">5 hours</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">PLACE</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{event.location}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Ticket className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">{booking.quantity} TICKETS</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">Email e-ticket</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleViewEventDetails}
                                className="mt-4 text-green-600 dark:text-green-400 hover:underline text-sm flex items-center gap-2"
                            >
                                <ExternalLink className="w-4 h-4" />
                                View event details
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tickets Section */}
                <div className="bg-white dark:bg-[#09150caf] border-2 rounded-lg p-6 mb-6 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Ticket ({booking.length}) total: ₹{booking.reduce((total, ticket) => total + ticket.price, 0)}
                        </h2>
                        <button
                            onClick={handleReturnTicket}
                            disabled={processingReturn}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {processingReturn ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                'Return ticket'
                            )}
                        </button>
                    </div>

                    <div className="space-y-4">
                        {booking?.map((ticket: any, index: number) => (
                            <div key={ticket.ticketId} className="border dark:border-gray-700 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Ticket className="w-4 h-4 text-gray-500" />
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                Ticket {index + 1}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400 mb-1">Seat</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{ticket.seatNumber}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400 mb-1">Price</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">₹{ticket.price}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400 mb-1">Status</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{ticket.status}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400 mb-1">Phone number</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{ticket.phone}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400 mb-1">Code</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{ticket.ticketId}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* QR Code */}
                                    <div className="ml-4 flex flex-col items-center gap-2">
                                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                                            <QrCode className="w-8 h-8 text-gray-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={handleDownloadTicket}
                            className="bg-gray-700 dark:bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-800 dark:hover:bg-gray-500 transition-colors flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Download Tickets
                        </button>
                        <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                    </div>
                </div>

                {/* Recommended Events */}
                <div className="bg-white dark:bg-[#09150caf] border-2 rounded-lg p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recommended for you</h3>
                        <button className="text-green-600 dark:text-green-400 hover:underline text-sm">
                            View more
                        </button>
                    </div>

                    <div className="relative">
                        {/* Navigation buttons */}
                        <button
                            onClick={prevRecommendation}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>

                        <button
                            onClick={nextRecommendation}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>

                        {/* Event cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-12">
                            {recommendedEvents.slice(currentRecommendation, currentRecommendation + 2).map((event, index) => (
                                <div key={event.id} className="border dark:border-gray-700 rounded-lg p-4 relative">
                                    {event.discount && (
                                        <div className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded text-xs">
                                            {event.discount}
                                        </div>
                                    )}

                                    <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 flex items-center justify-center">
                                        <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                        </svg>
                                    </div>

                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">{event.name}</h4>
                                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                            <Heart className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{event.date} | {event.time}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        <MapPin className="w-4 h-4" />
                                        <span>{event.location}</span>
                                    </div>

                                    <p className="text-right font-semibold text-gray-900 dark:text-white">{event.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Main page component with Suspense boundary
function ShowTicketPage() {
    return (
        <Suspense fallback={<ShowTicketSkeleton />}>
            <ShowTicketContent />
        </Suspense>
    );
}

export default ShowTicketPage;