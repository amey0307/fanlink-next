import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true }, // Make ticketId unique
    eventId: { type: String, required: true },
    userId: { type: String, required: true },
    seatNumber: { type: String, default: null },
    price: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ["booked", "cancelled", "completed"],
      default: "booked", // Default status is 'booked'  
    },
  },
  {
    timestamps: true,
    strict: false, // Allow additional fields not defined in the schema
  },
);

const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);
export default Ticket;
