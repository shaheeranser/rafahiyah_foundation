import Setting from "../models/settingModel.js";

// Get Settings (or create default if not exists)
export const getSettings = async (req, res) => {
    try {
        let settings = await Setting.findOne({ key: "site_settings" });

        if (!settings) {
            // Create default settings if they don't exist
            settings = await Setting.create({
                key: "site_settings",
                value: {
                    phoneNumber: "+92 335 9424716", // Default as per current footer
                    email: "rafahiyahfoundation@gmail.com",
                    address: "Pakistan",
                },
            });
        }

        res.status(200).json({ success: true, data: settings.value });
    } catch (error) {
        console.error("Error fetching settings:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Update Settings
export const updateSettings = async (req, res) => {
    try {
        const { phoneNumber, email, address, copyrightText } = req.body;

        const settings = await Setting.findOneAndUpdate(
            { key: "site_settings" },
            {
                $set: {
                    "value.phoneNumber": phoneNumber,
                    "value.email": email,
                    "value.address": address,
                    "value.copyrightText": copyrightText,
                    updatedAt: Date.now()
                }
            },
            { new: true, upsert: true } // Create if doesn't exist (upsert)
        );

        res.status(200).json({ success: true, message: "Settings updated successfully", data: settings.value });
    } catch (error) {
        console.error("Error updating settings:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
