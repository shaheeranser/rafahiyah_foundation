import Volunteer from '../models/volunteerModel.js';

// @desc    Create a new volunteer request
// @route   POST /api/volunteers
// @access  Public
const createVolunteer = async (req, res) => {
    try {
        const { fullName, contactNumber, age, city, occupation, team, eventName } = req.body;

        if (!fullName || !contactNumber) {
            return res.status(400).json({ message: 'Please provide at least Name and Contact Number' });
        }

        const newVolunteer = await Volunteer.create({
            fullName,
            contactNumber,
            age,
            city,
            occupation,
            team,
            eventName,
        });

        if (newVolunteer) {
            res.status(201).json({
                success: true,
                data: newVolunteer,
                message: "Volunteer request submitted successfully"
            });
        } else {
            res.status(400).json({ message: 'Invalid volunteer data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getAllVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: volunteers.length, data: volunteers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const deleteVolunteer = async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);

        if (!volunteer) {
            return res.status(404).json({ success: false, message: 'Volunteer not found' });
        }

        await volunteer.deleteOne();
        res.status(200).json({ success: true, message: 'Volunteer removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

export { createVolunteer, getAllVolunteers, deleteVolunteer };
