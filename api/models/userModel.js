import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: { type: String, required: true },
});

export default mongoose.model("User", userSchema);
