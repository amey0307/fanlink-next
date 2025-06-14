import Event from "@/app/model/event.model";
import User from "@/app/model/user.model";

export async function DELETE(req: Request) {
    const { eventId, userId } = await req.json();
    try {
        if (!eventId || !userId) {
            return Response.json({ message: "Event ID and User ID are required" }, { status: 400 });
        }

        const user: any = await User.findOne({ clerkId: userId });
        if (!user) {
            return Response.json({ message: "User not found" }, { status: 404 });
        }

        // Check if the user has booked the event
        if (!user.bookedEvents.includes(eventId)) {
            return Response.json({ message: "User has not booked this event" }, { status: 400 });
        }

        // Remove the event from user's booked events
        user.bookedEvents = user.bookedEvents.filter((id: string | any) => id !== eventId);

        // Find the event and increase the available seats
        const event = await Event.findOne({ eventId: eventId });
        if (event) {
            event.seats++;
            await event.save();
        }

        await user.save();

        return Response.json({ message: "Event deleted successfully" }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "Error deleting event: " + error }, { status: 500 });
    }
}