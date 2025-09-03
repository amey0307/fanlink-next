// In /api/user/book-event/route.ts
import Event from "@/app/model/event.model";
import User from "@/app/model/user.model";
import Ticket from "@/app/model/ticket.model";

export async function POST(req: Request) {
    try {
        const {
            eventId,
            userId,
            quantity,
            contactInfo,
            ticketHolders,
            amount,
            paymentId
        } = await req.json();

        console.log("Received data:", {
            eventId,
            userId,
            quantity,
            contactInfo,
            ticketHolders,
            amount,
            paymentId
        })

        // Gather User and Event data
        const event = await Event.findOne({ eventId: eventId });
        const user = await User.findOne({ clerkId: userId });

        // Validate the request parameters
        const validateChecks = async () => {
            if (!eventId || !userId) {
                return Response.json({ message: "Event ID and User ID are required" }, { status: 400 });
            }

            if (!event) {
                return Response.json({ message: "Event not found" }, { status: 404 });
            }

            if (!user) {
                return Response.json({ message: "User not found" }, { status: 404 });
            }

            // Validate quantity  
            if (!quantity || quantity <= 0) {
                return Response.json({ message: "Invalid quantity" }, { status: 400 });
            }

            // Check if enough seats are available
            if (event.seats < quantity) {
                return Response.json({
                    message: `Only ${event.seats} seats available for this event`
                }, { status: 400 });
            }
        }
        await validateChecks();

        // Add multiple tickets to user's booked events
        if (!user.bookedEvents.includes(eventId)) {
            user.bookedEvents.push(eventId);
        }

        ticketHolders.forEach((holder: any) => {
            user.tickets.push(holder.ticketCode || `FNLK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`); // Generate a unique ticket code if not provided
        });

        // Decrease the number of available seats
        event.seats -= quantity;


        // Create tickets for each ticket holder
        const tickets = ticketHolders.map((holder: any, index: number) => (
            {
                ticketId: holder?.ticketCode || `FNLK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, // Generate a unique ticket code if not provided
                eventId: eventId,
                userId: userId,
                name: contactInfo?.firstName + " " + contactInfo?.lastName || "Unknown",
                email: contactInfo?.email || "unknown@example.com",
                phone: contactInfo?.phone || "000-000-0000", // Assuming phone is provided in the holder object
                seatNumber: holder?.seatNumber || Math.floor(Math.random() * 100) + 1, // Generate a random seat number
                price: amount * quantity, // Assuming the price is evenly distributed
                status: "booked",
                paymentId: paymentId || "", // This will be filled after payment
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ));

        // Save tickets to the database
        await Ticket.insertMany(tickets);

        // Update user's booked events and event's available seats
        user.bookedEvents = Array.from(new Set(user.bookedEvents)); // Ensure no duplicates
        event.seats = Math.max(event.seats, 0); // Ensure seats don't go negative

        // Save the user and event data 
        await user.save();
        await event.save();

        return Response.json({
            message: "Event booked successfully",
            ticketsBooked: quantity,
        }, { status: 200 });
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
        return Response.json({ message: errorMessage }, { status: 500 });
    }
}