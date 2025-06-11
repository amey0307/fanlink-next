// In /api/user/book-event/route.ts
import Event from "@/app/model/event.model";
import User from "@/app/model/user.model";

export async function POST(req: Request) {
    try {
        const { 
            eventId, 
            userId, 
            quantity = 1, 
            contactInfo, 
            ticketHolders, 
            paymentDetails 
        } = await req.json();

        if (!eventId || !userId) {
            return Response.json({ message: "Event ID and User ID are required" }, { status: 400 });
        }

        const event = await Event.findOne({ eventId: eventId });
        if (!event) {
            return Response.json({ message: "Event not found" }, { status: 404 });
        }

        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return Response.json({ message: "User not found" }, { status: 404 });
        }

        // Check if enough seats are available
        if (event.seats < quantity) {
            return Response.json({ 
                message: `Only ${event.seats} seats available for this event` 
            }, { status: 400 });
        }

        // Add multiple tickets to user's booked events
        for (let i = 0; i < quantity; i++) {
            user.bookedEvents.push(eventId);
        }

        // Decrease the number of available seats
        event.seats -= quantity;

        await user.save();
        await event.save();

        return Response.json({ 
            message: "Event booked successfully",
            ticketsBooked: quantity,
            paymentDetails 
        }, { status: 200 });
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
        return Response.json({ message: errorMessage }, { status: 500 });
    }
}