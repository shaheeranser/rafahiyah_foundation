import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true, // e.g., 'site_settings'
    },
    value: {
        type: mongoose.Schema.Types.Mixed, // flexible structure
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Setting", settingSchema);
