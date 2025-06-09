import mongoDB_Connection from "@/app/model/db";
import User from "@/app/model/user.model";

export async function GET() {
    try {
        await mongoDB_Connection();
        // const users = await clerkClient.users.getUserList();
        const user = await User.find();
        // console.log(user);
        return Response.json(user);
    } catch (e) {
        console.log(e);
        return Response.error();
    }
}