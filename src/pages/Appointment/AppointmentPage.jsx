import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar,
    Clock,
    Send,
    User,
    Mail,
    BookOpen,
    Home,
    CheckCircle,
    AlertCircle,
    LogIn
} from 'lucide-react';
import { MainLayout, GlassCard } from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { analyzeUrgency } from '../../services/aiService';
import { createChatRoom } from '../../services/chatService';

const timeSlots = [
    '08:00 - 08:45',
    '09:00 - 09:45',
    '10:00 - 10:45',
    '14:00 - 14:45',
    '15:00 - 15:45',
    '16:00 - 16:45'
];

const AppointmentPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        className: '',
        dormRoom: '',
        timeSlot: '',
        content: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const { isAuthenticated, userProfile, isTeacher } = useAuth();
    const navigate = useNavigate();

    // If teacher, show appointment management view
    if (isTeacher && isTeacher()) {
        return <TeacherAppointmentView />;
    }

    // If not authenticated, show login prompt
    if (!isAuthenticated) {
        return (
            <MainLayout>
                <div className="max-w-lg mx-auto px-4 py-20">
                    <GlassCard className="text-center" hover={false}>
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                            <Calendar className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">
                            Đăng nhập để đặt lịch
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Bạn cần đăng nhập để đặt lịch hẹn tư vấn với giáo viên.
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="btn-primary flex items-center gap-2 mx-auto"
                        >
                            <LogIn className="w-5 h-5" />
                            Đăng nhập ngay
                        </button>
                    </GlassCard>
                </div>
            </MainLayout>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            // Analyze urgency of the content
            const analysis = await analyzeUrgency(formData.content);

            // Save appointment (mock - in real app, save to Firebase)
            const appointment = {
                ...formData,
                id: `apt-${Date.now()}`,
                urgencyLevel: analysis.urgencyLevel,
                category: analysis.category,
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            // Save to localStorage for demo
            const existing = JSON.parse(localStorage.getItem('appointments') || '[]');
            localStorage.setItem('appointments', JSON.stringify([appointment, ...existing]));

            setIsSubmitted(true);
        } catch (err) {
            setError('Có lỗi xảy ra. Vui lòng thử lại.');
        }

        setIsSubmitting(false);
    };

    if (isSubmitted) {
        return (
            <MainLayout>
                <div className="max-w-lg mx-auto px-4 py-20">
                    <GlassCard className="text-center" hover={false}>
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">
                            Đặt lịch thành công!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Yêu cầu của bạn đã được gửi đến giáo viên tư vấn.
                            Bạn sẽ nhận được thông báo khi được xác nhận.
                        </p>
                        <div className="glass rounded-xl p-4 text-left mb-6">
                            <h4 className="font-semibold text-gray-700 mb-2">Thông tin đặt lịch:</h4>
                            <p className="text-sm text-gray-600">📅 Khung giờ: {formData.timeSlot}</p>
                            <p className="text-sm text-gray-600">📧 Email: {formData.email}</p>
                        </div>
                        <button
                            onClick={() => {
                                setIsSubmitted(false);
                                setFormData({
                                    fullName: '',
                                    email: '',
                                    className: '',
                                    dormRoom: '',
                                    timeSlot: '',
                                    content: ''
                                });
                            }}
                            className="btn-primary"
                        >
                            Đặt lịch khác
                        </button>
                    </GlassCard>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700">Đặt lịch tư vấn</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                        Đặt lịch hẹn tư vấn
                    </h1>
                    <p className="text-gray-600 max-w-lg mx-auto">
                        Đặt lịch gặp trực tiếp với giáo viên tư vấn theo khung giờ phù hợp
                    </p>
                </div>

                {/* Form */}
                <GlassCard hover={false}>
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-100/50 border border-red-200 flex items-center gap-3 text-red-700">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name & Email Row */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Họ và tên
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="glass-input pl-12"
                                        placeholder="Nguyễn Văn A"
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
                                        placeholder="email@example.com"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Class & Dorm Row */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Lớp
                                </label>
                                <div className="relative">
                                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="className"
                                        value={formData.className}
                                        onChange={handleChange}
                                        className="glass-input pl-12"
                                        placeholder="12A1"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phòng ký túc xá (nếu có)
                                </label>
                                <div className="relative">
                                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="dormRoom"
                                        value={formData.dormRoom}
                                        onChange={handleChange}
                                        className="glass-input pl-12"
                                        placeholder="A201"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Time Slot */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Chọn khung giờ
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {timeSlots.map((slot) => (
                                    <label
                                        key={slot}
                                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.timeSlot === slot
                                            ? 'border-blue-500 bg-blue-50/50 text-blue-700'
                                            : 'border-white/30 bg-white/10 hover:bg-white/20'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="timeSlot"
                                            value={slot}
                                            checked={formData.timeSlot === slot}
                                            onChange={handleChange}
                                            className="sr-only"
                                            required
                                        />
                                        <Clock className="w-4 h-4" />
                                        <span className="font-medium text-sm">{slot}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nội dung khó khăn cần tư vấn
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                className="glass-input min-h-[120px] resize-none"
                                placeholder="Mô tả ngắn gọn vấn đề bạn đang gặp phải..."
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Thông tin này sẽ giúp giáo viên chuẩn bị tốt hơn cho buổi tư vấn
                            </p>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-secondary w-full flex items-center justify-center gap-2 py-4"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Gửi yêu cầu đặt lịch
                                </>
                            )}
                        </button>
                    </form>
                </GlassCard>
            </div>
        </MainLayout>
    );
};

// Teacher's Appointment Management View
const TeacherAppointmentView = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    React.useEffect(() => {
        // Load appointments from localStorage
        const saved = JSON.parse(localStorage.getItem('appointments') || '[]');
        // Add mock data if empty
        if (saved.length === 0) {
            const mockAppointments = [
                {
                    id: 'apt-1',
                    fullName: 'Nguyễn Văn A',
                    email: 'student1@school.edu.vn',
                    className: '12A1',
                    dormRoom: 'A201',
                    timeSlot: '09:00 - 09:45',
                    content: 'Em đang gặp khó khăn trong việc cân bằng học tập và các hoạt động ngoại khóa',
                    urgencyLevel: 5,
                    category: 'học tập',
                    status: 'pending',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'apt-2',
                    fullName: 'Trần Thị B',
                    email: 'student2@school.edu.vn',
                    className: '11B2',
                    dormRoom: '',
                    timeSlot: '14:00 - 14:45',
                    content: 'Em cần nói chuyện về vấn đề gia đình đang ảnh hưởng đến việc học',
                    urgencyLevel: 7,
                    category: 'gia đình',
                    status: 'pending',
                    createdAt: new Date(Date.now() - 3600000).toISOString()
                }
            ];
            setAppointments(mockAppointments);
        } else {
            setAppointments(saved);
        }
    }, []);

    const getUrgencyBadge = (level) => {
        if (level >= 7) return <span className="urgency-high">Khẩn cấp</span>;
        if (level >= 4) return <span className="urgency-medium">Trung bình</span>;
        return <span className="urgency-low">Bình thường</span>;
    };

    const sortedAppointments = [...appointments].sort((a, b) => {
        // Sort by urgency first
        if (b.urgencyLevel !== a.urgencyLevel) {
            return b.urgencyLevel - a.urgencyLevel;
        }
        // Then by time
        return new Date(a.createdAt) - new Date(b.createdAt);
    });

    const navigate = useNavigate();
    const { user, userProfile } = useAuth();
    const [processingId, setProcessingId] = useState(null);

    // Handle Accept Appointment - Create chat and navigate
    const handleAcceptAppointment = async (apt) => {
        setProcessingId(apt.id);
        try {
            // Create a new chat for this appointment
            const chatResult = await createChatRoom(
                apt.studentId || apt.email, // studentId
                user?.uid, // teacherId
                { displayName: apt.fullName, email: apt.email } // studentProfile
            );

            if (!chatResult.success) {
                throw new Error(chatResult.error || 'Failed to create chat');
            }

            // Update appointment status
            const updatedAppointments = appointments.map(a =>
                a.id === apt.id ? { ...a, status: 'accepted', chatId: chatResult?.chatId } : a
            );
            setAppointments(updatedAppointments);
            localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

            // Show success and navigate to dashboard
            alert(`Đã chấp nhận lịch hẹn với ${apt.fullName}. Chuyển đến Dashboard...`);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error accepting appointment:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại.');
        }
        setProcessingId(null);
    };

    // Handle Reject Appointment
    const handleRejectAppointment = (apt) => {
        if (!window.confirm(`Bạn có chắc muốn từ chối lịch hẹn của ${apt.fullName}?`)) {
            return;
        }

        const updatedAppointments = appointments.map(a =>
            a.id === apt.id ? { ...a, status: 'rejected' } : a
        );
        setAppointments(updatedAppointments.filter(a => a.status !== 'rejected'));
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments.filter(a => a.status !== 'rejected')));
        alert(`Đã từ chối lịch hẹn của ${apt.fullName}.`);
    };

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý lịch hẹn</h1>
                        <p className="text-gray-600">Xem và xử lý các yêu cầu đặt lịch từ học sinh</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">Tổng:</span>
                        <span className="font-bold text-purple-600">{appointments.length} yêu cầu</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Appointments List */}
                    <div className="lg:col-span-2 space-y-4">
                        {sortedAppointments.length === 0 ? (
                            <GlassCard className="text-center py-12" hover={false}>
                                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600">
                                    Chưa có yêu cầu đặt lịch
                                </h3>
                            </GlassCard>
                        ) : (
                            sortedAppointments.map((apt) => (
                                <GlassCard key={apt.id} hover={false}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-bold text-gray-800">{apt.fullName}</h3>
                                            <p className="text-sm text-gray-500">
                                                {apt.className} {apt.dormRoom && `• Phòng ${apt.dormRoom}`}
                                            </p>
                                        </div>
                                        {getUrgencyBadge(apt.urgencyLevel)}
                                    </div>

                                    <div className="flex items-center gap-4 mb-4 text-sm">
                                        <span className="flex items-center gap-1 text-blue-600">
                                            <Clock className="w-4 h-4" />
                                            {apt.timeSlot}
                                        </span>
                                        <span className="flex items-center gap-1 text-gray-500">
                                            <Mail className="w-4 h-4" />
                                            {apt.email}
                                        </span>
                                    </div>

                                    <p className="text-gray-700 mb-4">{apt.content}</p>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAcceptAppointment(apt)}
                                            disabled={processingId === apt.id}
                                            className="btn-primary py-2 px-4 text-sm disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {processingId === apt.id ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Đang xử lý...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-4 h-4" />
                                                    Chấp nhận & Tạo chat
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleRejectAppointment(apt)}
                                            disabled={processingId === apt.id}
                                            className="glass-button text-sm disabled:opacity-50"
                                        >
                                            Từ chối
                                        </button>
                                    </div>
                                </GlassCard>
                            ))
                        )}
                    </div>

                    {/* Calendar Preview */}
                    <div>
                        <GlassCard hover={false}>
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-500" />
                                Lịch hôm nay
                            </h3>
                            <div className="space-y-2">
                                {timeSlots.map((slot) => {
                                    const hasAppointment = sortedAppointments.some(a => a.timeSlot === slot);
                                    return (
                                        <div
                                            key={slot}
                                            className={`p-3 rounded-xl text-sm ${hasAppointment
                                                ? 'bg-blue-100/50 border border-blue-200 text-blue-700'
                                                : 'bg-white/10 text-gray-500'
                                                }`}
                                        >
                                            <span className="font-medium">{slot}</span>
                                            {hasAppointment && <span className="ml-2">• Có lịch hẹn</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default AppointmentPage;
