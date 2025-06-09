import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    eventId: { type: String, required: true, unique: true },
    eventName: { type: String, required: true },
    organizerId: { type: String, required: true },
    genre: { type: [String], default: [] },
    eventDate: { type: Date, required: true },
    eventTime: { type: String, required: true },
    location: { type: String, required: true },
    seats: { type: Number, required: true },
    price: { type: Number, required: true },
    imageURL: { type: String, default: null },
    description: { type: String, default: null },
    status: { type: String, default: 'active' },
    eventURL: { type: String, default: null },
}, { timestamps: true });

// Prevent OverwriteModelError
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
export default Event;