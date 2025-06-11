"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import HomeSkeleton from "@/app/components/HomeSkeleton";
import Carousel from "@/app/components/Carousel";
import { format } from "date-fns";
import { useAuth } from "@/app/context/AuthContext";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { HeartIcon, HeartOff, Lock, ScanLine } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link"; // Use RouterLink for navigation

function Eventpage() {
  const params = useParams();
  const eventId = params.eventId;
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const [event, setEvent] = useState<any>({});
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { currentUser, signIn, signOut } = useAuth() as any;
  const { openSignIn } = useClerk();
  const [likeData, setLikeData] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // console.log("eventId:", eventId);

    const fetchData = async () => {
      setLoading(true);
      try {
        setLoading(true);

        const eventPromise = eventId
          ? axios.get(`/api/event/get/${eventId}`)
          : Promise.resolve(null);
        const userPromise = currentUser?.id
          ? axios.get(`/api/user/current/${currentUser?.id}`)
          : Promise.resolve(null);
        const likedPromise = currentUser?.id
          ? axios.get(`/api/user/get-liked-events/${currentUser?.id}`)
          : Promise.resolve(null);

        const [eventResponse, userResponse, likedResponse] = await Promise.all([
          eventPromise,
          userPromise,
          likedPromise,
        ]);

        setEvent(eventResponse?.data.data);
        // console.log("userResponse: ", userResponse?.data?.user);

        setLikeData(likedResponse?.data);
        // console.log("likedResponse: ", likedResponse?.data);

        if (userResponse) {
          setUser(userResponse?.data?.user);
          const mergedUser = { ...currentUser, ...userResponse?.data?.user };
          await signIn(mergedUser);
        } else {
          setUser({});
        }
      } catch (error) {
        console.error("Error fetching event or user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser?.id, eventId]);

  const handleSignIn = (eventId: string) => {
    openSignIn({
      afterSignInUrl: `/event/${eventId}`, // Redirect here after sign-in
      afterSignUpUrl: `/event/${eventId}`, // Redirect here after sign-up
    });
  };

  useEffect(() => {
    console.log("event: ", event);
    console.log("liked DAta: ", likeData);
  }, [event, likeData]);

  const handleLiked = async (eventId: string, userId: string) => {
    if (!userId) {
      toast.error("Please login to like this event");
      return;
    }
    if (!eventId) {
      toast.error("Event ID is required to like an event");
      return;
    }

    try {
      //toggle eventid from likedData.likedEvents
      setLikeData((prevData: any) => {
        const updatedLikedEvents = prevData?.likedEvents?.includes(eventId)
          ? prevData.likedEvents.filter((id: string) => id !== eventId)
          : [...(prevData.likedEvents || []), eventId];

        return {
          ...prevData,
          likedEvents: updatedLikedEvents,
        };
      });

      // Update the event likes count
      setEvent((prev: any) => {
        const updatedLikes =
          prev.likes + (likeData?.likedEvents?.includes(eventId) ? -1 : 1);
        return {
          ...prev,
          likes: Math.max(updatedLikes, 0), // Ensure likes don't go below 0
        };
      });

      const response = await axios.put(`/api/user/like-event`, {
        eventId,
        userId,
        likes:
          event.likes + (likeData?.likedEvents?.includes(eventId) ? -1 : 1),
      });

      if (response.status === 200) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        !likeData?.likedEvents?.includes(eventId)
          ? toast.success("Added to your liked events")
          : toast.success("Removed from your liked events");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to like event");
    }
  };

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <div>
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
                src:
                  event?.imageURL ||
                  "https://media.istockphoto.com/id/1137781079/photo/black-man-playing-acoustic-guitar-and-singing-on-stage.jpg?s=612x612&w=0&k=20&c=vJ54S7U7uEHO2Oa8N2QZENmOi6kcFCtaS8chva_MaWU=",
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
                  {event?.eventName || "Event Title"}{" "}
                  {/* <span className="text-gray-400 text-lg h-fit">
                    {event?._id}
                  </span> */}
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {event?.short_description || "Event description goes here..."}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-6">
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                    onClick={() => {
                      handleLiked(event?._id, user?._id);
                    }}
                  >
                    {likeData?.likedEvents?.includes(event._id) ? (
                      <HeartIcon fill="#cd3232" stroke="#cd3232" size={20} />
                    ) : (
                      <HeartIcon size={20} />
                    )}
                    <span>{event?.likes}</span>
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
                      <span className="text-green-600 dark:text-green-400">
                        📅
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        DATE AND TIME
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {event?.eventDate &&
                          format(new Date(event.eventDate), "EEEE, MMMM dd")}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        08:00 PM
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-400">
                        📍
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        PLACE
                      </h3>
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
                      <span className="text-gray-600 dark:text-gray-400">
                        ⏱
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        DURATION
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        5 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-400">
                        🎫
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        TICKET
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Email e-Ticket
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <p
                    className={`text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-300 ${
                      !isExpanded ? "line-clamp-3" : ""
                    }`}
                  >
                    {event?.description ||
                      "Detailed event description will be displayed here. This is an exciting event that brings together diverse groups of people for an unforgettable experience."}
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Doloremque tempore explicabo adipisci quos nemo voluptates
                    nam libero laboriosam praesentium doloribus. Ad
                    necessitatibus ex quidem blanditiis voluptas. Earum quis
                    temporibus beatae sapiente accusantium omnis commodi quia.
                    Eius nisi libero, dignissimos eaque, explicabo dolorem
                    doloribus nihil rem temporibus officiis incidunt molestias
                    repudiandae placeat, exercitationem labore? Dolor at soluta
                    nihil animi vel odio aperiam fuga iure deserunt sit neque
                    corporis atque cupiditate vitae, laboriosam vero optio
                    eligendi dicta. Autem obcaecati, accusantium delectus
                    officiis recusandae quasi culpa laboriosam cumque earum
                    exercitationem sed, ipsum ab, placeat beatae quam iusto
                    incidunt quis excepturi dolore atque eligendi. Recusandae
                    impedit laboriosam blanditiis reprehenderit deserunt debitis
                    fugiat, obcaecati iusto corporis quibusdam consequuntur
                    magni quaerat sed enim asperiores, sint animi vero, velit
                    illum voluptates nemo alias itaque harum? Sequi commodi ad
                    beatae molestiae dolorum, magni maxime voluptates vitae
                    nesciunt obcaecati sapiente totam saepe, aperiam assumenda
                    earum alias possimus tempore quae autem ipsam voluptatum
                    praesentium eligendi quibusdam aliquam? Accusamus, unde
                    beatae repellat doloribus ex saepe veniam, quasi maxime
                    voluptates neque provident, natus inventore consequuntur?
                    Praesentium culpa perferendis fuga delectus itaque earum
                    alias ipsam quia id aspernatur nesciunt, labore error
                    consequuntur natus voluptas ab unde accusamus? Iusto nobis
                    dolore dolor? Ex officiis dicta, tempore id eum recusandae,
                    beatae delectus nobis corporis harum magnam ut consequatur,
                    neque temporibus! Consequatur eaque maiores non pariatur
                    quidem explicabo reiciendis at. Culpa.
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
                      <svg
                        className="w-4 h-4 transform rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </>
                  ) : (
                    <>
                      Read more
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-30">
                {/* Event Image */}
                <div className="mb-6">
                  <img
                    src={
                      event?.imageURL || "https://avatar.iran.liara.run/public"
                    }
                    alt={event?.title}
                    className="w-full h-64 object-cover rounded-xl"
                    loading="lazy"
                  />
                </div>

                {/* Price and Booking */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg shadow-gray-200 dark:shadow-gray-900">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Price
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        ₹{event?.price || "Free"} / Ticket
                      </span>
                      {event?.price && (
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded text-sm">
                          12% Off
                        </span>
                      )}
                    </div>
                  </div>

                  {/* {!user?.bookedEvents?.includes(event?.eventId) ? ( */}
                  <div className=" App-link w-[18rem] mx-auto dark:bg-green-400 dark:hover:bg-green-50 p-2 rounded-sm text-black border-black border-[1.5px] bg-green-200 hover:bg-slate-200 hover:border-slate-500 transition-all duration-150 cursor-pointer">
                    {currentUser?.id ? (
                      <Link
                        href={`/checkout/${event?._id}`}
                        className="flex items-center justify-center gap-2 text-center cursor-pointer"
                      >
                        <ScanLine className="w-5 h-5" />
                        Buy Ticket
                      </Link>
                    ) : (
                      <button
                        className="flex items-center justify-center gap-2 mx-auto cursor-pointer px-0"
                        onClick={() => {
                          handleSignIn(event?._id);
                        }}
                      >
                        <Lock className="w-5 h-5" />
                        Login to Buy
                      </button>
                    )}
                  </div>
                  {/* ) : (
                                        <div className="space-y-3">
                                            <button className="w-full dark:bg-green-400 dark:hover:bg-green-500 p-2 rounded-sm text-black border-black border-[1.5px] bg-green-200 hover:bg-green-400 hover:border-slate-500 transition-all duration-150 cursor-pointer flex items-center justify-center gap-2">
                                                <Link size={'15'} />Go To Ticket
                                            </button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <button className="w-full dark:bg-red-400 dark:hover:bg-red-500 p-2 rounded-sm text-black border-black border-[1.5px] bg-red-200 hover:bg-red-400 hover:border-red-500 transition-all duration-150 cursor-pointer flex items-center justify-center gap-2">
                                                        <Ban size={'15'} />Cancel Ticket
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
                                    )} */}
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
