import User from "@/app/model/user.model";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.pathname.split("/").pop();

  if (!userId) {
    return Response.json({ message: "User ID is required" }, { status: 400 });
  }

  const userLikedEvents = await User.findOne({ clerkId: userId }).select(
    "likedEvents",
  );
  if (!userLikedEvents) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }
  return Response.json(
    { likedEvents: userLikedEvents.likedEvents,
      totalLikedEvents: userLikedEvents.likedEvents.length
    },
    { status: 200 },
  );
}
