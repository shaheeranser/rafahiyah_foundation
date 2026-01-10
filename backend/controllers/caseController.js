import Case from '../models/caseModel.js';
import fs from 'fs';
import path from 'path';

// Get all cases
export const getCases = async (req, res) => {
    try {
        const cases = await Case.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: cases });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create a new case
export const createCase = async (req, res) => {
    try {
        const { caseNo, category, amountRequired, amountCollected, title, description } = req.body;
        let imagePath = '';

        if (req.file) {
            imagePath = req.file.path.replace(/\\/g, '/');
        }

        const newCase = new Case({
            caseNo,
            category,
            amountRequired,
            amountCollected,
            title,
            description,
            image: imagePath
        });

        await newCase.save();
        res.status(201).json({ success: true, data: newCase });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a case
export const updateCase = async (req, res) => {
    try {
        const { id } = req.params;
        const { caseNo, category, amountRequired, amountCollected, title, description } = req.body;

        const caseItem = await Case.findById(id);
        if (!caseItem) {
            return res.status(404).json({ success: false, message: 'Case not found' });
        }

        if (req.file) {
            // Delete old image if exists
            if (caseItem.image) {
                fs.unlink(caseItem.image, (err) => {
                    if (err) console.error("Failed to delete old image:", err);
                });
            }
            caseItem.image = req.file.path.replace(/\\/g, '/');
        }

        caseItem.caseNo = caseNo || caseItem.caseNo;
        caseItem.category = category || caseItem.category;
        caseItem.amountRequired = amountRequired || caseItem.amountRequired;
        caseItem.amountCollected = amountCollected || caseItem.amountCollected;
        caseItem.title = title || caseItem.title;
        caseItem.description = description || caseItem.description;

        await caseItem.save();
        res.status(200).json({ success: true, data: caseItem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a case
export const deleteCase = async (req, res) => {
    try {
        const { id } = req.params;
        const caseItem = await Case.findByIdAndDelete(id);

        if (!caseItem) {
            return res.status(404).json({ success: false, message: 'Case not found' });
        }

        if (caseItem.image) {
            fs.unlink(caseItem.image, (err) => {
                if (err) console.error("Failed to delete image:", err);
            });
        }

        res.status(200).json({ success: true, message: 'Case deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Case Status (Drop/Complete)
export const updateCaseStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, finalAmount } = req.body;

        const caseItem = await Case.findById(id);
        if (!caseItem) {
            return res.status(404).json({ success: false, message: 'Case not found' });
        }

        caseItem.status = status;
        if (finalAmount) {
            caseItem.amountCollected = finalAmount;
            caseItem.finalAmount = finalAmount;
        }

        await caseItem.save();
        res.status(200).json({ success: true, data: caseItem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
