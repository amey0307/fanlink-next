import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true }, // Clerk user ID
    username: { type: String, unique: true, default: null },
    email: { type: String, unique: true, default: null },
    genre: { type: [String], default: [] },
    likedOrg: { type: [String], default: [] },
    ArtistFollowed: { type: [String], default: [] },
    bookedEvents: { type: [String], default: [] },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;