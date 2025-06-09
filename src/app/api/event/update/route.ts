import { NextRequest, NextResponse } from "next/server";
import mongoDB_Connection from "@/app/model/db";
import Event from "@/app/model/event.model";

export async function PUT(req: NextRequest) {
    try {
        // Connect to MongoDB
        await mongoDB_Connection();

        // Parse request body
        let body;
        try {
            body = await req.json();
        } catch (parseError) {
            return NextResponse.json({
                success: false,
                message: "Invalid JSON in request body"
            }, { status: 400 });
        }

        const { eventId, updateData }: { eventId: string; updateData: any; } = body;

        // Validate required fields
        if (!eventId) {
            return NextResponse.json({
                success: false,
                message: "eventId is required"
            }, { status: 400 });
        }

        if (!updateData || typeof updateData !== 'object' || Object.keys(updateData).length === 0) {
            return NextResponse.json({
                success: false,
                message: "updateData object with at least one key-value pair is required"
            }, { status: 400 });
        }

        // Check if event exists
        const existingEvent = await Event.findOne({ eventId });
        if (!existingEvent) {
            return NextResponse.json({
                success: false,
                message: `Event with eventId '${eventId}' not found`
            }, { status: 404 });
        }

        // Prepare update object (exclude _id and eventId from updates for safety)
        const { _id, eventId: excludeEventId, ...safeUpdateData }: any = updateData;

        // Add updatedAt timestamp
        safeUpdateData.updatedAt = new Date();

        // Update the event or insert new key:value if not already present
        // Only update existing event, but allow adding new attributes to the document
        const updatedEvent = await Event.findOneAndUpdate(
            { eventId },
            { $set: safeUpdateData },
            {
                new: true, // Return the updated document
                runValidators: false, // Run mongoose schema validators
            }
        );

        if (!updatedEvent) {
            return NextResponse.json({
                success: false,
                message: "Failed to update event"
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Event updated successfully",
            data: updatedEvent,
            updatedFields: Object.keys(safeUpdateData)
        });

    } catch (error) {
        console.error("Event update error:", error);

        return NextResponse.json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error occurred"
        }, { status: 500 });
    }
}

// Optional: PATCH method for partial updates (same functionality)
export async function PATCH(req: NextRequest) {
    return PUT(req);
}