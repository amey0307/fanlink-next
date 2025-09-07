
import mongoDB_Connection from "@/app/model/db";
import Event from "@/app/model/event.model";
import Ticket from "@/app/model/ticket.model";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    await mongoDB_Connection();
    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get("userId");
        const eventId = url.searchParams.get("eventId");

        //Check if userId is provided
        if (!userId) {
            return Response.json({ error: "User ID is required" }, {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
            return Response.json({ error: "Invalid eventId" }, { status: 400 });
        }


        const user_eventId = await Event.findById(new mongoose.Types.ObjectId(eventId)).select('eventId');
        console.log("user_eventId: ", user_eventId.eventId)

        const tickets = await Ticket.find({ userId: userId, eventId: user_eventId.eventId }).populate({ path: "eventId", select: "name date location" });

        if (!tickets) {
            return Response.json({ error: "No booked events found" }, { status: 404 });
        }
        return Response.json({
            data: tickets,
            length: tickets.length
        }, {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.log("Error fetching booked tickets: ", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}