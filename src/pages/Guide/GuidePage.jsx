import React, { useState } from 'react';
import {
    HelpCircle,
    Home,
    MessageCircle,
    Heart,
    Calendar,
    User,
    Play,
    ChevronRight
} from 'lucide-react';
import { MainLayout, GlassCard } from '../../components/Layout';

const guideItems = [
    {
        id: 'intro',
        title: 'Giới thiệu trang chủ',
        icon: Home,
        content: `
**Chào mừng đến với S-Net!**

Đây là nền tảng tư vấn tâm lý trực tuyến dành riêng cho học sinh. Chúng tôi kết nối bạn với các giáo viên tư vấn chuyên nghiệp một cách ẩn danh và an toàn.

**Các tính năng chính:**
- 💬 Chat tư vấn trực tiếp với giáo viên
- 💕 Confession - Chia sẻ câu chuyện ẩn danh
- 📅 Đặt lịch hẹn tư vấn
- 📚 Blog kiến thức tâm lý

**Cam kết của chúng tôi:**
- Bảo mật thông tin 100%
- Không phán xét
- Luôn sẵn sàng lắng nghe
    `,
        videoPlaceholder: 'Video giới thiệu tổng quan'
    },
    {
        id: 'chat',
        title: 'Hướng dẫn chat tư vấn',
        icon: MessageCircle,
        content: `
**Cách sử dụng Chat tư vấn:**

**Bước 1:** Nhấn vào mục "Tư vấn" trên thanh menu

**Bước 2:** Chọn giáo viên tư vấn phù hợp
- Xem thông tin chuyên môn
- Xem đánh giá từ học sinh khác
- Chọn theo lĩnh vực bạn cần (tình yêu, học tập, gia đình...)

**Bước 3:** Bắt đầu cuộc trò chuyện
- Tin nhắn hoàn toàn ẩn danh
- Chỉ giáo viên bạn chọn mới đọc được
- AI sẽ hỗ trợ khi giáo viên chưa online

**Lưu ý:**
- Hãy chia sẻ thật lòng
- Không cần vội, giáo viên sẽ phản hồi sớm nhất
- Nếu khẩn cấp, tin nhắn của bạn sẽ được ưu tiên
    `,
        videoPlaceholder: 'Video hướng dẫn chat'
    },
    {
        id: 'confession',
        title: 'Hướng dẫn Confession',
        icon: Heart,
        content: `
**Cách đăng Confession:**

**Bước 1:** Vào mục "Confession"

**Bước 2:** Nhấn "Đăng confession"

**Bước 3:** Viết nội dung chia sẻ
- Tối thiểu 20 ký tự
- Có thể chọn mức độ ẩn danh

**Mức độ ẩn danh:**
- **Hoàn toàn ẩn danh:** Không ai biết bạn là ai
- **Ẩn danh một phần:** Chỉ giáo viên có thể xem (nếu cần hỗ trợ)

**Quy định:**
- Nội dung sẽ được AI kiểm duyệt tự động
- Không đăng nội dung tiêu cực, bạo lực
- Không tiết lộ thông tin cá nhân người khác
    `,
        videoPlaceholder: 'Video hướng dẫn confession'
    },
    {
        id: 'appointment',
        title: 'Hướng dẫn đặt lịch',
        icon: Calendar,
        content: `
**Cách đặt lịch hẹn tư vấn:**

**Bước 1:** Vào mục "Đặt lịch"

**Bước 2:** Điền thông tin:
- Họ tên
- Email (để nhận thông báo)
- Lớp
- Phòng ký túc xá (nếu có)

**Bước 3:** Chọn khung giờ phù hợp

**Bước 4:** Mô tả ngắn vấn đề cần tư vấn

**Sau khi đặt:**
- Giáo viên sẽ xem xét yêu cầu
- Bạn sẽ nhận email xác nhận
- Có thể được mời vào phòng chat riêng
    `,
        videoPlaceholder: 'Video hướng dẫn đặt lịch'
    },
    {
        id: 'profile',
        title: 'Hướng dẫn chỉnh sửa profile',
        icon: User,
        content: `
**Cách chỉnh sửa thông tin cá nhân:**

**Bước 1:** Nhấn vào avatar của bạn góc trên phải

**Bước 2:** Chọn "Hồ sơ cá nhân"

**Bước 3:** Chỉnh sửa:
- Tên hiển thị
- Avatar
- Thông tin liên hệ

**Dành cho Giáo viên:**
- Cập nhật bio/giới thiệu
- Thêm chuyên môn
- Đặt khung giờ làm việc

**Lưu ý:**
- Học sinh có thể giữ ẩn danh hoàn toàn
- Email chỉ dùng để đăng nhập, không hiển thị công khai
    `,
        videoPlaceholder: 'Video hướng dẫn profile'
    }
];

const GuidePage = () => {
    const [activeGuide, setActiveGuide] = useState(guideItems[0]);

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
                        <HelpCircle className="w-5 h-5 text-amber-500" />
                        <span className="text-sm font-medium text-gray-700">Hướng dẫn sử dụng</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                        Hướng dẫn sử dụng
                    </h1>
                    <p className="text-gray-600 max-w-lg mx-auto">
                        Tìm hiểu cách sử dụng các tính năng của S-Net
                    </p>
                </div>

                {/* 2-Column Layout */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left: Navigation */}
                    <div className="lg:col-span-1">
                        <GlassCard hover={false} padding="p-2">
                            <nav className="space-y-1">
                                {guideItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveGuide(item)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${activeGuide.id === item.id
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                                : 'hover:bg-white/20 text-gray-700'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5 flex-shrink-0" />
                                            <span className="font-medium">{item.title}</span>
                                            <ChevronRight className="w-4 h-4 ml-auto" />
                                        </button>
                                    );
                                })}
                            </nav>
                        </GlassCard>
                    </div>

                    {/* Right: Content + Video */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Text Content */}
                        <GlassCard hover={false}>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                {React.createElement(activeGuide.icon, { className: 'w-6 h-6 text-purple-500' })}
                                {activeGuide.title}
                            </h2>
                            <div className="prose prose-lg max-w-none text-gray-700">
                                {activeGuide.content.split('\n').map((line, i) => {
                                    if (line.startsWith('**') && line.endsWith('**')) {
                                        return <h3 key={i} className="font-bold text-gray-800 mt-4 mb-2">{line.replace(/\*\*/g, '')}</h3>;
                                    }
                                    if (line.startsWith('- ')) {
                                        return <p key={i} className="ml-4">• {line.substring(2)}</p>;
                                    }
                                    return <p key={i}>{line}</p>;
                                })}
                            </div>
                        </GlassCard>

                        {/* Video Placeholder */}
                        <GlassCard hover={false}>
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Play className="w-5 h-5 text-red-500" />
                                Video hướng dẫn
                            </h3>
                            <div className="aspect-video rounded-xl bg-gray-800/20 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                                        <Play className="w-8 h-8 text-white" />
                                    </div>
                                    <p className="text-gray-500">{activeGuide.videoPlaceholder}</p>
                                    <p className="text-sm text-gray-400 mt-1">(Video sẽ được thêm sau)</p>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default GuidePage;
