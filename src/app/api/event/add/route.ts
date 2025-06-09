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

        const { eventIds, updateDataArray }: { 
            eventIds: string[]; 
            updateDataArray: any[]; 
        } = body;

        // Validate required fields
        if (!eventIds || !Array.isArray(eventIds) || eventIds.length === 0) {
            return NextResponse.json({
                success: false,
                message: "eventIds array is required and must not be empty"
            }, { status: 400 });
        }

        if (!updateDataArray || !Array.isArray(updateDataArray) || updateDataArray.length === 0) {
            return NextResponse.json({
                success: false,
                message: "updateDataArray is required and must not be empty"
            }, { status: 400 });
        }

        // Check if arrays have the same length
        if (eventIds.length !== updateDataArray.length) {
            return NextResponse.json({
                success: false,
                message: "eventIds and updateDataArray must have the same length"
            }, { status: 400 });
        }

        // Validate each updateData object
        for (let i = 0; i < updateDataArray.length; i++) {
            const updateData = updateDataArray[i];
            if (!updateData || typeof updateData !== 'object' || Object.keys(updateData).length === 0) {
                return NextResponse.json({
                    success: false,
                    message: `updateDataArray[${i}] must be a non-empty object`
                }, { status: 400 });
            }
        }

        // Check if all events exist
        const existingEvents = await Event.find({ eventId: { $in: eventIds } });
        const existingEventIds = existingEvents.map(event => event.eventId);
        const missingEventIds = eventIds.filter(id => !existingEventIds.includes(id));

        if (missingEventIds.length > 0) {
            return NextResponse.json({
                success: false,
                message: `Events not found for eventIds: ${missingEventIds.join(', ')}`
            }, { status: 404 });
        }

        // Prepare bulk operations
        const bulkOperations = eventIds.map((eventId, index) => {
            const updateData = { ...updateDataArray[index] };
            
            // Remove protected fields
            delete updateData._id;
            delete updateData.eventId;
            delete updateData.__v;
            
            // Add updatedAt timestamp
            updateData.updatedAt = new Date();

            return {
                updateOne: {
                    filter: { eventId },
                    update: { $set: updateData },
                    upsert: false
                }
            };
        });

        console.log(`Performing bulk update for ${bulkOperations.length} events`);

        // Execute bulk write operation
        const result = await Event.bulkWrite(bulkOperations, {
            ordered: false // Continue even if some operations fail
        });

        // Get updated events to return
        const updatedEvents = await Event.find({ eventId: { $in: eventIds } });

        return NextResponse.json({
            success: true,
            message: "Bulk update completed",
            data: {
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount,
                events: updatedEvents
            },
            summary: {
                totalRequested: eventIds.length,
                successful: result.modifiedCount,
                failed: eventIds.length - result.modifiedCount
            }
        });

    } catch (error) {
        console.error("Bulk event update error:", error);
        
        return NextResponse.json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error occurred"
        }, { status: 500 });
    }
}

// Alternative: PATCH method for partial updates (same functionality)
export async function PATCH(req: NextRequest) {
    return PUT(req);
}