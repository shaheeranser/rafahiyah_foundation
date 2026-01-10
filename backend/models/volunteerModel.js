import mongoose from 'mongoose';

const volunteerSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    age: {
        type: String,
    },
    city: {
        type: String,
    },
    occupation: {
        type: String,
    },
    team: {
        type: String,
    },
    eventName: {
        type: String,
    },
}, {
    timestamps: true,
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

export default Volunteer;
