import mongoDB_Connection from "@/app/model/db";
import Ticket from "@/app/model/ticket.model";
import { NextRequest } from "next/server";

export async function GET(req: Response) {
    await mongoDB_Connection();
    //get eventId and userId from query params
    const url = new URL(req.url);
    const eventId = url.searchParams.get("eventId");
    const userId = url.searchParams.get("userId");
    
    if (!userId) {
        return Response.json({ error: "Event ID and User ID are required" }, {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    try {
        let ticket;
        if (eventId) {
            ticket = await Ticket.find({
                eventId: eventId,
                userId: userId,
            }).populate({ path: "eventId", select: "name date" }).populate({ path: "userId", select: "name email" });
        }
        else {
            ticket = await Ticket.find({
                userId: userId,
            }).populate({ path: "eventId", select: "name date" }).populate({ path: "userId", select: "name email" });
        }

        if (!ticket) {
            return Response.json({ error: "Ticket not found" }, { status: 401 });
        }

        return Response.json({
            data: ticket
        }, {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
    catch (error) {
        console.error("Error fetching ticket data:", error);
        return Response.json({ error: "Failed to fetch ticket data" }, {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}