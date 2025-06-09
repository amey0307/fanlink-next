import mongoDB_Connection from "@/app/model/db";
import Event from "@/app/model/event.model";

export async function GET() {
    try {
        await mongoDB_Connection();
        const events = await Event.find();

        return Response.json({
            success: true,
            data: events
        });

    } catch (error) {
        return Response.json({
            success: false,
            message: `Error while fetching: ${error instanceof Error ? error.message : 'Unknown error'}`
        }, { status: 500 });
    }
}