import Event from "@/app/model/event.model";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    try {
        const event = await Event.findOne({ _id: id });
        return Response.json({
            success: true,
            data: event
        });
    } catch (error: Error | any) {
        return Response.json({
            success: false,
            message: `Error while fetching: ${error.message}`
        });
    }
}