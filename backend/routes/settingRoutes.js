import express from 'express';
const router = express.Router();
import { getSettings, updateSettings } from "../controllers/settingController.js";
// import { protect } from "../controllers/authController.js"; // Use if needed later

// Public route to get settings
router.get("/", getSettings);

// Protected route to update settings (only admin should access this in real app)
router.put("/update", updateSettings);

export default router;
