import User from "@/app/model/user.model";
import { requireAuth } from "@clerk/express";
export async function GET(req: Request) {
    try {
        // requireAuth();
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        const user = await User.findOne({ clerkId: id });

        if (!user) {
            return Response.json({ message: "User not found" }, { status: 404 });
        }

        return Response.json({ user }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "Error fetching user" }, { status: 500 });
    }
}