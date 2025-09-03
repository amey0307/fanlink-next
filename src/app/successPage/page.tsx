"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  QrCode,
  Download,
  ArrowLeft,
  TicketCheck,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { EventData } from "@/app/type/util";

// Skeleton Card Component
const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-[#050d06] rounded-lg p-6 shadow-lg">
      <Skeleton className="h-32 w-full mb-4" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-2" />
      <Skeleton className="h-3 w-2/3 mb-3" />
      <Skeleton className="h-4 w-1/3 ml-auto" />
    </div>
  );
};

// Loading component for Suspense
const SuccessPageSkeleton = () => {
  return (
    <div className="min-h-screen dark:bg-gradient-to-br from-green-950 to-[#000000] bg-gray-50 pt-10">
      <div className="max-w-4xl mx-auto px-6">
        <Skeleton className="h-[10vh] w-[60vw] mx-auto mt-10 rounded-lg" />
        <div className="mx-auto">
          <Skeleton className="h-16 w-[40vw] mt-10 mx-auto rounded-lg" />
        </div>
        <div className="w-[60vw] mx-auto mt-10">
          <div className="flex items-center justify-center gap-20 mt-10">
            <div className="space-y-2">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
        <div className="w-[60vw] mx-auto mt-10">
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
        <div className="w-[60vw] mx-auto mt-10">
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
        <div className="w-[60vw] mx-auto mt-10">
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
        <div className="w-[60vw] mx-auto mt-10">
          <div className="flex gap-4">
            <Skeleton className="h-12 w-40 rounded" />
            <Skeleton className="h-12 w-40 rounded" />
          </div>
        </div>
        <div className="w-[60vw] mx-auto mt-10 mb-10">
          <Skeleton className="h-8 w-48 mb-6 rounded" />
          <div className="flex items-center justify-center gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main content component that uses useSearchParams
function SuccessPaymentContent() {
  const { currentUser } = useAuth() as any;
  const searchParams = useSearchParams();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ticketInfo, setTicketInfo] = useState<any>(null);

  // Get payment details from URL params or state
  const eventId = searchParams.get("eventId");
  const transactionId = searchParams.get("transactionId") || `TXN${Date.now()}`;
  const amount = searchParams.get("amount") || "0";
  const coupon = searchParams.get("coupon");
  const discount = searchParams.get("discount") || "0";
  const quantity = searchParams.get("quantity") || "1";
  const dbEventId = searchParams.get("dbEventId");

  //fetch event details based on eventId
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch event details and ticket info in parallel
        const [eventRes, ticketRes] = await Promise.all([
          axios.get(`/api/event/get/${eventId}`),
          axios.get(`/api/ticket/get?eventId=${dbEventId}&userId=${currentUser?.id}`)
        ]);
        if (eventRes.data.data) setEvent(eventRes.data.data);
        if (ticketRes.data.data) setTicketInfo(ticketRes.data.data);
      } catch (error) {
        console.error("Error fetching event or ticket info:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId && dbEventId && currentUser?.id) {
      fetchData();
    }
  }, [eventId, dbEventId, currentUser?.id]);

  //get the ticket information
  useEffect(() => {
    setLoading(true);
    const fetchTicketInfo = async () => {
      try {
        // Assuming you have an API endpoint to get ticket info
        const response = await axios.get(`/api/ticket/get?eventId=${dbEventId}&userId=${currentUser?.id}`);
        // Handle the ticket info if needed
        console.log("Ticket Info:", response.data.data);
        setTicketInfo(response.data.data);
      } catch (error) {
        console.error("Error fetching ticket info:", error);
      }
      finally {
        setLoading(false);
      }
    };

    // fetchTicketInfo();
  }, [currentUser?.id, dbEventId]);

  // Function to generate a random ticket code
  const generateTicketCode = () => {
    return `FNLK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  };

  if (loading) {
    return <SuccessPageSkeleton />;
  }

  return (
    <div
      className={`dark:bg-gradient-to-br from-green-950 to-[#000000] min-h-screen`}
    >
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Success Message */}
        <div className="bg-white dark:bg-[#050d06] border-2 rounded-lg p-6 mb-8 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <TicketCheck className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Payment Successful!
            </h2>
          </div>
          {coupon && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mt-3">
              <p className="text-green-800 dark:text-green-200 text-sm">
                Coupon "{coupon}" applied - You saved ₹{discount}!
              </p>
            </div>
          )}
        </div>

        {/* Event Information */}
        <div className="bg-white dark:bg-[#050a05aa] border-2 rounded-lg p-6 mb-8 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {event?.eventName || "Event Name"}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  DATE AND TIME
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {event?.eventDate
                    ? format(new Date(event.eventDate), "EEEE, MMMM dd")
                    : "Date TBA"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {event?.eventTime || "Time TBA"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  DURATION
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  5 hours
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  PLACE
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {event?.location || "Location TBA"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {ticketInfo?.length} TICKET{ticketInfo?.length > 1 ? "S" : ""}
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Email e-ticket
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Information */}
        <div className="bg-white dark:bg-[#050d06] border-2 rounded-lg p-6 mb-8 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Purchase information
            </h3>
            <button className="text-green-600 dark:text-green-400 hover:underline text-sm">
              Billing
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Code</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {transactionId}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Date</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {format(new Date(), "MMM dd, yyyy")}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Total</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                ₹{ticketInfo.reduce((sum: number, ticket: any) => sum + (ticket.price || 0), 0)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">
                Payment method
              </p>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <p className="font-semibold text-gray-900 dark:text-white">
                  Razorpay
                </p>
              </div>
            </div>
          </div>

          {/* Show coupon information if applied */}
          {coupon && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Coupon Applied:
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {coupon}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-600 dark:text-gray-400">
                  Discount:
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  -₹{discount}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-white dark:bg-[#050a05aa] border-2 rounded-lg p-6 mb-8 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Contact information
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">
                First name
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {ticketInfo?.name?.split(" ")[0] || currentUser?.firstName || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Last name</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {ticketInfo?.name?.split(" ")[1] || currentUser?.lastName || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Email</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {ticketInfo?.email || currentUser?.primaryEmailAddress?.emailAddress || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">
                Phone number
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {ticketInfo?.phone || currentUser?.contactNumber || "(+91) 000-0000"}
              </p>
            </div>
          </div>
        </div>

        {/* Ticket Information */}
        <div className="bg-white dark:bg-[#050d06] border-2 rounded-lg p-6 mb-8 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Ticket Booked : ({ticketInfo?.length})
            </h3>
            <Link href={`/showTicket/${event?._id}`}>
              <button className="text-green-600 dark:text-green-400 hover:underline text-sm">
                View ticket{parseInt(quantity) > 1 ? "s" : ""}
              </button>
            </Link>
          </div>

          {/* Generate multiple tickets based on quantity */}
          {Array.isArray(ticketInfo) && ticketInfo.length > 0 ? (
            <div className="border dark:border-gray-700 rounded-lg p-4 mb-4">
              <div className="flex flex-col items-start justify-center mb-2">
                <h4 className="flex flex-col font-semibold text-gray-900 dark:text-white">
                  Ticket Codes:{" "}
                  <span className="text-green-400">{ticketInfo.map((ticket: any) => ticket?.ticketId).join(",   ")}</span>
                </h4>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {event?.eventDate
                    ? format(new Date(event.eventDate), "MMM dd, yyyy")
                    : "Date TBA"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <Calendar className="w-4 h-4" />
                <span>{event?.eventTime || "Time TBA"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <MapPin className="w-4 h-4" />
                <span>{event?.location || "Location TBA"}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                {ticketInfo.map((ticket: any, idx: number) => (
                  <div key={ticket._id || idx} className="flex items-center gap-2">
                    <span>Seat Number:</span>
                    <span className="font-semibold">{ticket.seatNumber || "N/A"}</span>
                    <span>| Price: </span>
                    <span className="font-semibold">₹{ticket.price}</span>
                  </div>
                ))}
              </div>
              <p className="text-right font-semibold text-gray-900 dark:text-white">
                Total: ₹{ticketInfo.reduce((sum: number, ticket: any) => sum + (ticket.price || 0), 0)}
              </p>
            </div>
          ) : ticketInfo ? (
            <div
              key={ticketInfo._id}
              className="border dark:border-gray-700 rounded-lg p-4 mb-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Ticket Code: {ticketInfo.ticketId || generateTicketCode()}
                </h4>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {event?.eventDate
                    ? format(new Date(event.eventDate), "MMM dd, yyyy")
                    : "Date TBA"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <Calendar className="w-4 h-4" />
                <span>{event?.eventTime || "Time TBA"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <MapPin className="w-4 h-4" />
                <span>{event?.location || "Location TBA"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <span>Seat Number:</span>
                <span className="font-semibold">{ticketInfo.seatNumber || "N/A"}</span>
              </div>
              <p className="text-right font-semibold text-gray-900 dark:text-white">
                ₹{ticketInfo.price}
              </p>
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">
              No ticket information available.
            </div>
          )}
        </div>
        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">

          <button className="bg-gray-700 dark:bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-800 dark:hover:bg-gray-500 transition-colors flex items-center gap-2"
            onClick={() =>
              window.open(`/api/ticket/download?eventId=${dbEventId}&userId=${currentUser?.id}`, "_blank")
            }>
            <Download className="w-4 h-4" />
            Download Ticket{parseInt(ticketInfo?.length) > 1 ? "s" : ""}
          </button>
          <Link
            href="/"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </div>

        {/* Other Events Section */}
        <div className="bg-white dark:bg-[#050d06] border-2 rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Other events you may like
            </h3>
            <button className="text-green-600 dark:text-green-400 hover:underline text-sm">
              View more
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border dark:border-gray-700 rounded-lg p-4">
              <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Musical Fusion Festival
                </h4>
                <span className="text-green-600 dark:text-green-400 text-sm">
                  30% Off
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <Calendar className="w-4 h-4" />
                <span>Monday, June 06 | 06:00 PM</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <MapPin className="w-4 h-4" />
                <span>New York, NY</span>
              </div>
              <p className="text-right font-semibold text-gray-900 dark:text-white">
                From ₹90
              </p>
            </div>

            <div className="border dark:border-gray-700 rounded-lg p-4">
              <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Metropolis Marathon
                </h4>
                <span className="text-blue-600 dark:text-blue-400 text-sm">
                  Buy 2 get 1 free
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <Calendar className="w-4 h-4" />
                <span>Tuesday, June 7 | 06:00 AM</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <MapPin className="w-4 h-4" />
                <span>Atlanta</span>
              </div>
              <p className="text-right font-semibold text-gray-900 dark:text-white">
                From ₹10
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
function SuccessPaymentPage() {
  return (
    <Suspense fallback={<SuccessPageSkeleton />}>
      <SuccessPaymentContent />
    </Suspense>
  );
}

export default SuccessPaymentPage;
