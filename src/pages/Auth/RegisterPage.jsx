import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, UserPlus, AlertCircle, GraduationCap, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MainLayout, GlassCard } from '../../components/Layout';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setLoading(true);

        const result = await register(
            formData.email,
            formData.password,
            formData.displayName,
            formData.role
        );

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Đăng ký thất bại. Vui lòng thử lại.');
        }

        setLoading(false);
    };

    return (
        <MainLayout>
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
                <GlassCard className="w-full max-w-md" hover={false}>
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg mb-4">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Tạo tài khoản mới</h1>
                        <p className="text-gray-600">Bắt đầu hành trình được lắng nghe</p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-100/50 border border-red-200 flex items-center gap-3 text-red-700">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {/* Role Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Bạn là ai?
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'student' })}
                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.role === 'student'
                                    ? 'border-purple-500 bg-purple-100/50'
                                    : 'border-white/30 bg-white/10 hover:bg-white/20'
                                    }`}
                            >
                                <GraduationCap className={`w-8 h-8 ${formData.role === 'student' ? 'text-purple-600' : 'text-gray-500'}`} />
                                <span className={`font-medium ${formData.role === 'student' ? 'text-purple-700' : 'text-gray-600'}`}>
                                    Học sinh
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'teacher' })}
                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.role === 'teacher'
                                    ? 'border-blue-500 bg-blue-100/50'
                                    : 'border-white/30 bg-white/10 hover:bg-white/20'
                                    }`}
                            >
                                <BookOpen className={`w-8 h-8 ${formData.role === 'teacher' ? 'text-blue-600' : 'text-gray-500'}`} />
                                <span className={`font-medium ${formData.role === 'teacher' ? 'text-blue-700' : 'text-gray-600'}`}>
                                    Giáo viên
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên hiển thị {formData.role === 'student' && <span className="text-gray-400">(có thể giấu khi chat)</span>}
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="displayName"
                                    value={formData.displayName}
                                    onChange={handleChange}
                                    className="glass-input pl-12"
                                    placeholder={formData.role === 'student' ? 'Nickname hoặc tên thật' : 'Họ tên đầy đủ'}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="glass-input pl-12"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="glass-input pl-12 pr-12"
                                    placeholder="Ít nhất 6 ký tự"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Xác nhận mật khẩu
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="glass-input pl-12"
                                    placeholder="Nhập lại mật khẩu"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <input type="checkbox" required className="w-4 h-4 mt-1 rounded border-gray-300" />
                            <span className="text-sm text-gray-600">
                                Tôi đồng ý với{' '}
                                <a href="#" className="text-purple-600 hover:underline">Điều khoản sử dụng</a> và{' '}
                                <a href="#" className="text-purple-600 hover:underline">Chính sách bảo mật</a>
                            </span>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Đăng ký
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="mt-6 text-center text-gray-600">
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
                            Đăng nhập
                        </Link>
                    </p>
                </GlassCard>
            </div>
        </MainLayout>
    );
};

export default RegisterPage;
