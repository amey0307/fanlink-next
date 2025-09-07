import User from "@/app/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import Event from "@/app/model/event.model";

export async function POST(req: NextRequest, res: NextResponse) {
    //Get the user favorite genre from the db
    const { userId } = await req.json();
    const userFavoriteGenre = await User.findById(userId).select('genre');
    console.log("userFavoriteGenre", userFavoriteGenre);

    //match the genre with the events in the db and find the events with similar
    // genre with the help of gemini api (RAG)
    const events = await Event.find({ genre: { $in: userFavoriteGenre.genre } });

    const prompt = `
    Given the user's favorite genres and the following events, rank the events and return the top 5 as a JSON array with this format:
    [
      {
        "eventId": "string",
        "name": "string",
        "genre": "string",
        "score": number
      }
    ]
    User's favorite genres: ${JSON.stringify(userFavoriteGenre.genre)}
    Events: ${JSON.stringify(events)}
    Respond only with the JSON array.
    `;

    // The client gets the API key from the environment variable `GEMINI_API_KEY`.
    const ai = new GoogleGenAI({});

    const response: any = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    console.log("\n\nRESPONSE: ", await JSON.parse(response.text?.slice(7, -3)));

    //return the events to the user
    return NextResponse.json({ message: "Recommendations fetched successfully", data: await JSON.parse(response.text?.slice(7, -3)) }, { status: 200 });
}