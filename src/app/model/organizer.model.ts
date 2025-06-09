import mongoose from "mongoose";

const organizerSchema = new mongoose.Schema({
    organizerId: { type: String, required: true, unique: true }, // Make organizerId unique
    organizerEmail: {
        type: String,
        unique: true,
        default: null,
        validate: {
            validator: function (email: string) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Basic email regex
            },
            message: (props: { value: string }) => `${props.value} is not a valid email!`
        }
    },
    contact: {
        type: String,
        default: null,
        validate: {
            validator: function (phone: string) {
                return /^[0-9-]+$/.test(phone); // Basic phone number regex
            },
            message: (props: { value: string }) => `${props.value} is not a valid phone number!`
        }
    },
    organizerName: { type: String, default: null },
    eventId: { type: [String], default: [] },
    location: { type: String, default: null },
    seats: { type: Number, default: 0 },
    imageURL: { type: String, default: null },
}, {
    timestamps: true
});

const Organizer = mongoose.model('Organizer', organizerSchema);
export default Organizer;