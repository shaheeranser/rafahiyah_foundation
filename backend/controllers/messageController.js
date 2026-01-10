import Message from '../models/messageModel.js';

// @desc    Create a new message
// @route   POST /api/messages
// @access  Public
const createMessage = async (req, res) => {
    try {
        const { fullName, email, contactNumber, subject, message } = req.body;

        if (!fullName || !email || !contactNumber || !subject || !message) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const newMessage = await Message.create({
            fullName,
            email,
            contactNumber,
            subject,
            message,
        });

        if (newMessage) {
            res.status(201).json({
                _id: newMessage._id,
                fullName: newMessage.fullName,
                email: newMessage.email,
                contactNumber: newMessage.contactNumber,
                subject: newMessage.subject,
                message: newMessage.message,
            });
        } else {
            res.status(400).json({ message: 'Invalid message data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export { createMessage };
