import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MainLayout, GlassCard } from '../../components/Layout';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Đăng nhập thất bại. Vui lòng thử lại.');
        }

        setLoading(false);
    };

    // Demo login for testing without Firebase
    const handleDemoLogin = (role) => {
        if (role === 'student') {
            setEmail('student@demo.com');
            setPassword('demo123456');
        } else {
            setEmail('teacher@demo.com');
            setPassword('demo123456');
        }
    };

    return (
        <MainLayout>
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
                <GlassCard className="w-full max-w-md" hover={false}>
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg mb-4">
                            <span className="text-3xl">🧠</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Chào mừng trở lại!</h1>
                        <p className="text-gray-600">Đăng nhập để tiếp tục</p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-100/50 border border-red-200 flex items-center gap-3 text-red-700">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="glass-input pl-12 pr-12"
                                    placeholder="••••••••"
                                    required
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

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                                <span className="text-gray-600">Ghi nhớ đăng nhập</span>
                            </label>
                            <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                                Quên mật khẩu?
                            </a>
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
                                    <LogIn className="w-5 h-5" />
                                    Đăng nhập
                                </>
                            )}
                        </button>
                    </form>

                    {/* Demo Accounts */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500 text-center mb-3">Thử nghiệm nhanh:</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleDemoLogin('student')}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-all"
                            >
                                Demo Học sinh
                            </button>
                            <button
                                onClick={() => handleDemoLogin('teacher')}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-all"
                            >
                                Demo Giáo viên
                            </button>
                        </div>
                    </div>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 mb-3">Chưa có tài khoản?</p>
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white font-bold transition-all"
                        >
                            <UserPlus className="w-5 h-5" />
                            Đăng ký ngay
                        </Link>
                    </div>
                </GlassCard>
            </div>
        </MainLayout>
    );
};

export default LoginPage;
