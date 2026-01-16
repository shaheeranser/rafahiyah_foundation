import React, { useState } from 'react';
import axios from 'axios';
import { User, Key, Lock, Save, AlertCircle } from 'lucide-react';
import { AuthToken } from "../../Api/Api";
import AdminLayout from "../../layouts/AdminLayout";

const Settings = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setLoading(true);

        const token = AuthToken();

        try {
            const response = await axios.put(
                "http://localhost:8000/api/users/admin/update",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage({ type: 'success', text: response.data.msg });
            setFormData({ username: '', password: '', confirmPassword: '' });

            // Optional: Update local storage if username changed
            if (response.data.user) {
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                userData.username = response.data.user.username;
                localStorage.setItem('userData', JSON.stringify(userData));
            }

        } catch (error) {
            const errorMsg = error.response?.data?.msg || 'Failed to update credentials';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="min-h-screen font-sans text-gray-900">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Settings</h1>
                    <p className="text-gray-500 mt-1 text-lg">Manage your account settings and preferences.</p>
                </div>

                <div className="max-w-2xl bg-white rounded-xl border border-gray-200/60 shadow-sm overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                            <div className="p-3 bg-indigo-50 rounded-lg">
                                <Key className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Security Settings</h2>
                                <p className="text-gray-500 text-sm">Update your admin credentials</p>
                            </div>
                        </div>

                        {message.text && (
                            <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}>
                                <AlertCircle size={20} />
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Username
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Enter new username (optional)"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Leave blank to keep current username</p>
                            </div>

                            {/* Password Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="New password"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm new password"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`
                                        flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 
                                        bg-[#0A1229] hover:bg-[#1a2540] text-white rounded-lg font-medium 
                                        transition-all shadow-lg shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed
                                    `}
                                >
                                    {loading ? (
                                        'Updating...'
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Settings;
