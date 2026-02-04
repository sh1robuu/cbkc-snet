import React from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

const MainLayout = ({ children, showFooter = true }) => {
    return (
        <div className="min-h-screen gradient-mesh-bg">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="relative z-10 pt-20 min-h-screen">
                {children}
            </main>

            {/* Footer */}
            {showFooter && (
                <footer
                    className="relative z-10 mt-20"
                    style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        borderTop: '1px solid rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <div className="max-w-7xl mx-auto px-6 py-12">
                        <div className="grid md:grid-cols-4 gap-8">
                            {/* Brand */}
                            <div className="md:col-span-2">
                                <div className="flex items-center space-x-3 mb-4">
                                    <img src="/icon.svg" alt="S-Net" className="w-10 h-10" />
                                    <span className="font-black text-2xl text-gray-800">
                                        S-Net
                                    </span>
                                </div>
                                <p className="text-gray-600 font-medium max-w-sm leading-relaxed">
                                    Nền tảng tư vấn tâm lý trực tuyến dành cho học sinh.
                                    Kết nối, chia sẻ, đồng hành cùng bạn vượt qua mọi khó khăn.
                                </p>
                                <p className="text-gray-500 text-sm mt-3 font-medium">
                                    Powered by CBKC
                                </p>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h4 className="font-bold text-gray-800 text-lg mb-4">Truy cập nhanh</h4>
                                <div className="space-y-3">
                                    <Link to="/chat" className="block text-gray-600 font-medium hover:text-purple-600 transition-colors">Tư vấn</Link>
                                    <Link to="/confession" className="block text-gray-600 font-medium hover:text-purple-600 transition-colors">Confession</Link>
                                    <Link to="/appointment" className="block text-gray-600 font-medium hover:text-purple-600 transition-colors">Đặt lịch</Link>
                                </div>
                            </div>

                            {/* Support */}
                            <div>
                                <h4 className="font-bold text-gray-800 text-lg mb-4">Hỗ trợ</h4>
                                <div className="space-y-3">
                                    <Link to="/guide" className="block text-gray-600 font-medium hover:text-purple-600 transition-colors">Hướng dẫn</Link>
                                    <a href="#" className="block text-gray-600 font-medium hover:text-purple-600 transition-colors">Điều khoản</a>
                                    <a href="#" className="block text-gray-600 font-medium hover:text-purple-600 transition-colors">Bảo mật</a>
                                    <a href="#" className="block text-gray-600 font-medium hover:text-purple-600 transition-colors">Liên hệ</a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-gray-200 text-center text-gray-500 font-medium">
                            © 2026 S-Net by CBKC. Made with 💚 for students.
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

export default MainLayout;
