import React from 'react';
import { Link } from 'react-router-dom';
import {
    MessageCircle,
    Heart,
    Calendar,
    BookOpen,
    Users,
    Shield,
    Sparkles,
    ArrowRight,
    ChevronDown
} from 'lucide-react';
import { MainLayout, GlassCard } from '../components/Layout';

const HomePage = () => {
    const features = [
        {
            icon: MessageCircle,
            title: 'Chat Tư vấn',
            description: 'Kết nối trực tiếp với giáo viên tư vấn, ẩn danh và bảo mật 100%',
            color: 'from-purple-500 to-pink-500',
            link: '/chat'
        },
        {
            icon: Heart,
            title: 'Confession',
            description: 'Chia sẻ câu chuyện ẩn danh, nhận sự đồng cảm từ cộng đồng',
            color: 'from-pink-500 to-rose-500',
            link: '/confession'
        },
        {
            icon: Calendar,
            title: 'Đặt lịch hẹn',
            description: 'Đặt lịch tư vấn trực tiếp với giáo viên theo khung giờ phù hợp',
            color: 'from-cyan-500 to-blue-500',
            link: '/appointment'
        },
        {
            icon: BookOpen,
            title: 'Hướng dẫn',
            description: 'Tìm hiểu cách sử dụng nền tảng S-Net hiệu quả nhất',
            color: 'from-emerald-500 to-teal-500',
            link: '/guide'
        }
    ];

    return (
        <MainLayout>
            {/* Hero Section - Full Screen */}
            <section className="min-h-screen flex items-center justify-center px-4 -mt-20">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Main Heading */}
                    <h1 className="text-hero text-5xl md:text-7xl mb-8 animate-fade-in">
                        BẠN KHÔNG
                        <br />
                        ĐƠN ĐỘC
                    </h1>

                    {/* Subtitle */}
                    <p className="text-hero-sub text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in animate-delay-100">
                        Kết nối với giáo viên tư vấn, chia sẻ câu chuyện ẩn danh,
                        và tìm được sự hỗ trợ bạn cần — hoàn toàn miễn phí và bảo mật.
                    </p>

                    {/* CTA Button */}
                    <div className="animate-fade-in animate-delay-200">
                        <Link
                            to="/chat"
                            className="btn-outline inline-flex items-center gap-3 text-lg"
                        >
                            Bắt đầu tư vấn
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="mt-20 animate-bounce">
                        <ChevronDown
                            className="w-8 h-8 mx-auto"
                            style={{
                                color: 'rgba(255,255,255,0.7)',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-section-title text-3xl md:text-5xl mb-6">
                            Mọi thứ bạn cần
                        </h2>
                        <p className="text-section-sub text-lg max-w-xl mx-auto">
                            Chúng tôi cung cấp đầy đủ công cụ để bạn được hỗ trợ tâm lý một cách toàn diện
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <Link
                                    key={index}
                                    to={feature.link}
                                    className="group"
                                >
                                    <GlassCard className="h-full text-center">
                                        <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                                    </GlassCard>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-24 px-4">
                <div className="max-w-5xl mx-auto">
                    <GlassCard className="p-10 md:p-16" hover={false}>
                        <div className="grid md:grid-cols-3 gap-10 text-center">
                            <div>
                                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-5 shadow-lg">
                                    <Shield className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">100% Ẩn danh</h3>
                                <p className="text-gray-600">Danh tính của bạn được bảo vệ tuyệt đối. Không ai biết bạn là ai.</p>
                            </div>

                            <div>
                                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center mb-5 shadow-lg">
                                    <Users className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">Giáo viên chuyên môn</h3>
                                <p className="text-gray-600">Đội ngũ giáo viên tư vấn được đào tạo bài bản, giàu kinh nghiệm.</p>
                            </div>

                            <div>
                                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-5 shadow-lg">
                                    <Sparkles className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">AI Hỗ trợ 24/7</h3>
                                <p className="text-gray-600">Trí tuệ nhân tạo hỗ trợ phân loại và ưu tiên các trường hợp khẩn cấp.</p>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <GlassCard hover={false} className="py-16 px-8">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
                            Sẵn sàng được lắng nghe?
                        </h2>
                        <p className="text-gray-600 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
                            Đừng giữ mọi thứ trong lòng. Hãy để chúng tôi đồng hành cùng bạn
                            trên hành trình vượt qua mọi khó khăn.
                        </p>
                        <Link
                            to="/chat"
                            className="btn-primary inline-flex items-center gap-3 text-lg"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Bắt đầu ngay
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </GlassCard>
                </div>
            </section>
        </MainLayout>
    );
};

export default HomePage;
