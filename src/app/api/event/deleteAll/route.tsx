import User from "@/app/model/user.model";

export async function DELETE(req: Request) {
    const { clerkId } = await req.json();
    try {
        await User.findOneAndUpdate({ clerkId: clerkId }, {
            $set: { bookedEvents: [] }
        }, {
            new: true
        });
    } catch (error) {
        console.error("Error deleting user events:", error);
        return Response.json({ message: "Error deleting user events", error: error instanceof Error ? error.message : error }, { status: 500 });
    }

    return Response.json({ message: "All events deleted successfully" }, { status: 200 });
}
