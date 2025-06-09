import Event from "@/app/model/event.model";
import User from "@/app/model/user.model";

export async function POST(req: Request) {
    try {
        const { eventId, userId } = await req.json();

        if (!eventId)
            return Response.json({ message: "Event ID is required" }, { status: 400 });

        const event = await Event.findOne({ eventId: eventId });

        if (!event) return Response.json({ message: "Event not found" }, { status: 404 });

        const user = await User.findOne({ clerkId: userId });

        if (!user) return Response.json({ message: "User not found" }, { status: 404 });

        //check if user already booked event
        if (user.bookedEvents.includes(eventId))
            return Response.json({ message: "User already booked event" }, { status: 400 });

        user.bookedEvents.push(eventId);
        event.seats--;

        await user.save();
        await event.save();

        return Response.json({ message: "Event booked successfully" }, { status: 200 });
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
        return Response.json({ message: errorMessage }, { status: 500 });
    }
}