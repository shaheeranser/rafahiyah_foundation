import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema({
    caseNo: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Financial Help', 'Fee Assistance', 'Medical Assistance', 'Other'],
        default: 'Financial Help'
    },
    amountRequired: {
        type: Number,
        required: true
    },
    amountCollected: {
        type: Number,
        default: 0
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'dropped'],
        default: 'active'
    },
    finalAmount: {
        type: Number
    }
}, { timestamps: true });

const Case = mongoose.model('Case', caseSchema);
export default Case;
