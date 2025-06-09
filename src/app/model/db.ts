import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isConnected = false;

const mongoDB_Connection = async () => {
    if (isConnected) {
        console.log("MongoDB already connected");
        return;
    }

    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI environment variable is not defined");
        }

        await mongoose.connect(uri);
        isConnected = true;
        console.log("MongoDB Connection Successful");
    } catch (error) {
        console.log("MongoDB Connection Failed : ", error);
        isConnected = false;
    }
};

export default mongoDB_Connection;