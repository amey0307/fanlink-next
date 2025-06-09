import Event from "@/app/model/event.model";
import { NextResponse } from "next/server";
import { currentUser } from '@clerk/nextjs/server'
import User from "@/app/model/user.model";
import mongoDB_Connection from "@/app/model/db";


export async function GET() {
    try {
        // Get the user from the request
        await mongoDB_Connection();
        const clerkUser = await currentUser();
        const userId = clerkUser?.id;

        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            return NextResponse.json({
                success: true,
                data: { eventData: [], totalEvents: 0 },
            });
        }

        const { bookedEvents } = user;
        const Events = await Event.find({ eventId: { $in: bookedEvents } });

        return NextResponse.json({
            success: true,
            data: { eventData: Events, totalEvents: Events.length },
        });
    } catch (e) {
        return NextResponse.json({
            success: false,
            message: `Error while fetching booked events: ${e instanceof Error ? e.message : 'Unknown error'}`,
        }, {
            status: 500
        });
    }
}