import React, { useState } from 'react';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Special setup page to create the first admin account
const AdminSetup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        displayName: '',
        secretKey: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    const { register } = useAuth();
    const navigate = useNavigate();

    // Secret key to create admin (change this in production!)
    const ADMIN_SECRET_KEY = 'snet-admin-2026';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.secretKey !== ADMIN_SECRET_KEY) {
            setMessage({ type: 'error', text: 'Mã bí mật không đúng!' });
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await register(
                formData.email,
                formData.password,
                formData.displayName,
                'admin'  // Register as admin
            );

            if (result.success) {
                setMessage({ type: 'success', text: 'Tạo tài khoản Admin thành công! Đang chuyển hướng...' });
                setTimeout(() => navigate('/admin'), 2000);
            } else {
                setMessage({ type: 'error', text: result.error || 'Có lỗi xảy ra' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Có lỗi xảy ra: ' + error.message });
        }

        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Solid white card - no transparency */}
                <div className="bg-white rounded-3xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                            <Shield className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Setup</h1>
                        <p className="text-gray-500 text-sm">Tạo tài khoản Admin đầu tiên cho S-Net</p>
                    </div>

                    {/* Message */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                                ? 'bg-green-50 border border-green-200 text-green-700'
                                : 'bg-red-50 border border-red-200 text-red-700'
                            }`}>
                            {message.type === 'success' ? (
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            ) : (
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            )}
                            <p className="text-sm">{message.text}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                placeholder="admin@school.edu.vn"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                placeholder="Ít nhất 6 ký tự"
                                minLength={6}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Tên hiển thị</label>
                            <input
                                type="text"
                                name="displayName"
                                value={formData.displayName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                placeholder="Administrator"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Mã bí mật</label>
                            <input
                                type="password"
                                name="secretKey"
                                value={formData.secretKey}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                                placeholder="Nhập mã bí mật để tạo Admin"
                                required
                            />
                            <p className="mt-2 text-xs text-gray-500">
                                💡 Mã mặc định: <code className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold">snet-admin-2026</code>
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Đang tạo...
                                </span>
                            ) : (
                                'Tạo tài khoản Admin'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminSetup;
