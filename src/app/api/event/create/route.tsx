import Event from "@/app/model/event.model";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await Event.insertMany(await req.json());
        return Response.json({
            success: true,
            message: `Events created successfully`
        }, { status: 201 });
    } catch (error: any) {
        return Response.json({
            success: false,
            message: `Error while saving: ${error.message}`
        }, { status: 409 });
    }
}