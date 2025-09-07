import User from "@/app/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import Event from "@/app/model/event.model";
import mongoDB_Connection from "@/app/model/db";

export async function POST(req: NextRequest, res: NextResponse) {
  //Connect to the mongoDB
  await mongoDB_Connection();

  //Get the user favorite genre from the db
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  //Find the user favorite genre from the db
  const userFavoriteGenre = await User.findOne({ clerkId: userId }).select('genre');

  //match the genre with the events in the db and find the events with similar genre with the help of gemini api (RAG)
  const events = await Event.find({ genre: { $in: userFavoriteGenre.genre } });

  const prompt = `
    Given the user's favorite genres and the following events, rank the events and return the top 5 as a JSON array with this format:
    [
      { "_id": "string",
        "eventId": "string",
        "name": "string",
        "genre": "string",
        "score": number,
        "eventDate": "string",
        "location": "string",
        "price": number,
        "imageURL": "string",
        "description": "string",
        "seats": number,
        "description": "string",
        "short_description": "string",
        "status": "string",
        "eventURL": "string",
        "eventTime": "string"
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

  // console.log("\n\nRESPONSE: ", await JSON.parse(response.text?.slice(7, -3)));

  //return the events to the user
  const result = response.text ? await JSON.parse(response.text?.slice(7, -3)) : [];
  if (result.length === 0) {
    return NextResponse.json({ code: "NRF", message: "No recommendations found", data: [] }, { status: 200 });
  }
  return NextResponse.json({ code: "RF", message: "Recommendations fetched successfully", data: result }, { status: 200 });
}