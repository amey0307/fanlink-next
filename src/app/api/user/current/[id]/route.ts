import User from "@/app/model/user.model";
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        const user = await User.findOne({ clerkId: id });

        if (!user) {
            return Response.json({ message: "User not found" }, { status: 404 });
        }

        return Response.json({ user }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "Error fetching user: " + error }, { status: 500 });
    }
}