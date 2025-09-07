import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/app/lib/redis";

export async function POST(req: NextRequest, res: NextResponse) {
    const { data, userId } = await req.json();
    // console.log("Data to cache: ", JSON.stringify(data));
    if (!userId) {
        return NextResponse.json({ error: "User ID is required to cache data" }, { status: 400 });
    }

    await redis.set(`recommendedEvents-${userId}`, JSON.stringify(data), "EX", 3600);
    return NextResponse.json({
        success: true,
        message: "Data cached successfully"
    }, { status: 200 });
}

export async function GET(req: NextRequest, res: NextResponse) {
    const url = new URL(req.url);
    const key = url.searchParams.get("key") || "recommendedEvents";

    const cachedValue: any = await redis.get(key);
    return NextResponse.json({
        success: true,
        data: JSON.parse(cachedValue)
    });
}


