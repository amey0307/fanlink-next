import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
    artistId: { type: String, required: true, unique: true }, // Clerk user ID
    artistName: { type: String, unique: true, default: null },
    artistEmail: { type: String, unique: true, default: null },
    genre: { type: [String], default: [] },
    events: { type: [String], default: [] },
    organizerId: { type: String, required: true },
}, { timestamps: true })

const Artist = mongoose.model('Artist', artistSchema);
export default Artist;
