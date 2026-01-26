import express from 'express';
import { getCases, createCase, updateCase, deleteCase, updateCaseStatus } from '../controllers/caseController.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp|pdf/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images and PDFs are allowed'));
    }
});

// Routes
router.get('/', getCases);
router.post('/', upload.single('image'), createCase);
router.put('/:id', upload.single('image'), updateCase);
router.delete('/:id', deleteCase);
router.patch('/:id/status', upload.fields([{ name: 'documents', maxCount: 1 }, { name: 'receipt', maxCount: 1 }]), updateCaseStatus);

export default router;
