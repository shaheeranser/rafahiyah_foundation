import Donation from '../models/donationModel.js';
import User from '../models/userModel.js';

// @desc    Create a new donation (Public or Authenticated)
// @route   POST /api/donations
// @access  Public
export const createDonation = async (req, res) => {
  try {
    const { fullName, email, contactNumber, cause, purpose, paymentMethod, amount, userId } = req.body;
    const paymentProof = req.file ? req.file.path : null;

    // Basic validation for public form
    if (!fullName || !email || !contactNumber || !cause || !purpose || !paymentMethod) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const donationData = {
      fullName,
      email,
      contactNumber,
      cause,
      purpose,
      paymentMethod,
      amount,
      paymentProof,
      user: userId || undefined // Link user if provided
    };

    const newDonation = await Donation.create(donationData);

    // If user is linked, update their donation history
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.donations.push(newDonation._id);
        await user.save();
      }
    }

    res.status(201).json({
      success: true,
      data: newDonation,
      message: "Donation submitted successfully"
    });

  } catch (error) {
    console.error("Create Donation Error:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all donations (Admin)
// @route   GET /api/donations/all
// @access  Private/Admin
export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// @desc    Get user donations
// @route   GET /api/donations/user
// @access  Private
export const getUserDonations = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, msg: "User ID is required" });
    }
    const donations = await Donation.find({ user: userId });
    res.status(200).json({ success: true, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
};

export const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate('user', 'name');
    if (!donation) return res.status(404).json({ msg: 'Donation not found' });
    res.json(donation);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const approveDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(req.params.id, {
      status: 'Verified',
      // approved: true // Keeping backward compatibility if needed, but switching to 'status' as per new model
    }, { new: true });

    if (!donation) return res.status(404).json({ msg: 'Donation not found' });
    res.json({ msg: 'Donation approved', donation });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUnapprovedDonations = async (req, res) => {
  try {
    const unapprovedDonations = await Donation.find({ status: 'Pending' }).populate('user', 'name email');
    res.status(200).json(unapprovedDonations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch unapproved donations', error });
  }
};

export const rejectDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    donation.status = 'Rejected';
    await donation.save();
    res.status(200).json({ message: 'Donation rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject donation', error });
  }
};
