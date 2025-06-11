import Event from "@/app/model/event.model";
import User from "@/app/model/user.model";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  const { eventId, userId, likes }: { eventId: string; userId: string, likes : number } =
    await req.json();
  
  // console.log("Received eventId:", eventId);
  // console.log("Received userId:", userId);

  if (!eventId || !userId) {
    return Response.json(
      { message: "Event ID and User ID are required" },
      { status: 400 },
    );
  }

  try {
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    if (!event) {
      return Response.json({
        message: "Event not found (server error)",
      }, {status : 400})
    }
    if (!user) {  
      return Response.json({
        message: "User not found from (server error)",
      }, {status : 400})
    }

    const likedEvents: string[] = user.likedEvents || [];
    const eventIndex = likedEvents.indexOf(eventId);

    let update;
    let message;

    if (eventIndex === -1) {
      // Add eventId to likedEvents
      update = { $addToSet: { likedEvents: eventId } };
      message = "Event liked successfully";
    } else {
      // Remove eventId from likedEvents
      update = { $pull: { likedEvents: eventId } };
      message = "Event unliked successfully";
    }

    await User.updateOne({ _id: userId }, update);
    await Event.findByIdAndUpdate(eventId, {
      likes: likes,
    });

    return Response.json({
      likedEvents,
      message,
      totalLikes: likedEvents.length + (eventIndex === -1 ? 1 : -1),
    });
  } catch (error) {
    console.error("Error toggling event like:", error);
    return new Response(
      JSON.stringify({ error: "Failed to toggle event like" }),
      {
        status: 500,
      },
    );
  }
}
