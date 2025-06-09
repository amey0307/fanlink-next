import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    profileImageUrl: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;