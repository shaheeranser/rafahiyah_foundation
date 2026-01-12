import mongoose from "mongoose";

const programSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    venue: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    startingDate: {
        type: Date,
        required: true,
    },
    endingDate: {
        type: Date,
        required: true,
    },
    image: {
        type: String, // Filename/Path
    },
    linkedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],
    linkedCases: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Case" // Assuming 'Case' is the model name for cases
    }],
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }]
}, { timestamps: true });

const Program = mongoose.model("Program", programSchema);

export default Program;
