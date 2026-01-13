import mongoose from 'mongoose';

const donationSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    email: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    cause: {
        type: String,
        required: true,
    },
    purpose: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
    },
    paymentProof: {
        type: String, // Path to uploaded file
    },
    status: {
        type: String,
        default: 'Pending', // Pending, Verified, Rejected
    }
}, {
    timestamps: true,
});

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;
