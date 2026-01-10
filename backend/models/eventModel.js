import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    image: {
        type: String, // Clean filename/path
    },
    requiredAmount: {
        type: Number,
        default: 0
    },
    collectedAmount: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    status: {
        type: String,
        enum: ['Incomplete', 'Completed'],
        default: 'Incomplete'
    }
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);

export default Event;
