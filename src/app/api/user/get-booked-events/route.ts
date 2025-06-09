import Event from "@/app/model/event.model";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from '@clerk/nextjs/server'
import User from "@/app/model/user.model";
import mongoDB_Connection from "@/app/model/db";


export async function GET(req: NextRequest, res: NextResponse) {
    try {
        // Get the user from the request
        await mongoDB_Connection();
        const clerkUser = await currentUser();
        // console.log("lodaaaaaaa: ", clerkUser)
        if (!clerkUser) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const userId = clerkUser?.id;
        // console.log(userId);

        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            return Response.json({ error: 'User not found in MongoDB' });
        }

        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const { bookedEvents } = user;
        const Events = await Event.find({ eventId: { $in: bookedEvents } });

        return NextResponse.json({
            success: true,
            data: { eventData: Events, totalEvents: Events.length },
        });
    } catch (e) {
        return NextResponse.error();
    }
}