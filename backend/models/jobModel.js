import mongoose from 'mongoose';

const jobSchema = mongoose.Schema({
    position: {
        type: String,
        required: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    companyEmail: {
        type: String,
        required: true,
    },
    jobLink: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    workMode: {
        type: String,
        enum: ['onsite', 'remote', 'hybrid'],
        required: true,
    },
    postedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
