import React, { useState } from 'react';
import {
    Send,
    Shield,
    Eye,
    EyeOff,
    AlertCircle,
    Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { moderateContent } from '../../services/aiService';

const CreateConfession = ({ onSubmit, onCancel }) => {
    const [content, setContent] = useState('');
    const [anonymityLevel, setAnonymityLevel] = useState('full');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [moderationResult, setModerationResult] = useState(null);

    const { isAuthenticated, userProfile } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        return (
            <div className="text-center py-8">
                <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Đăng nhập để đăng confession
                </h3>
                <p className="text-gray-500 mb-6">
                    Bạn cần đăng nhập để chia sẻ câu chuyện của mình
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="btn-primary"
                >
                    Đăng nhập
                </button>
            </div>
        );
    }

    const handleSubmit = async () => {
        if (!content.trim()) {
            setError('Vui lòng nhập nội dung confession');
            return;
        }

        if (content.length < 20) {
            setError('Nội dung confession phải có ít nhất 20 ký tự');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Run AI moderation
            const moderation = await moderateContent(content);
            setModerationResult(moderation);

            if (moderation.status === 'rejected') {
                setError('Nội dung không phù hợp: ' + moderation.reason);
                setIsSubmitting(false);
                return;
            }

            // Submit confession
            onSubmit({
                content,
                authorId: userProfile?.uid || 'anonymous',
                anonymityLevel,
                topic: moderation.suggestedCategory === 'ngoài lề' ? 'offtopic' : 'psychology'
            });
        } catch (err) {
            setError('Có lỗi xảy ra. Vui lòng thử lại.');
        }

        setIsSubmitting(false);
    };

    const anonymityOptions = [
        {
            value: 'full',
            label: 'Hoàn toàn ẩn danh',
            description: 'Không ai biết bạn là ai',
            icon: EyeOff
        },
        {
            value: 'partial',
            label: 'Ẩn danh một phần',
            description: 'Chỉ giáo viên có thể xem danh tính',
            icon: Eye
        }
    ];

    return (
        <div className="space-y-6">
            {/* Notice */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-100/50 to-pink-100/50 border border-purple-200/30">
                <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-gray-700">
                            Confession của bạn sẽ được AI kiểm duyệt tự động.
                            Nếu cần xem xét thêm, giáo viên sẽ duyệt thủ công trước khi đăng.
                        </p>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 rounded-xl bg-red-100/50 border border-red-200 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Content Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung confession
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Chia sẻ câu chuyện của bạn... (tối thiểu 20 ký tự)"
                    className="glass-input min-h-[150px] resize-none"
                    maxLength={2000}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Tối thiểu 20 ký tự</span>
                    <span>{content.length}/2000</span>
                </div>
            </div>

            {/* Anonymity Level */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Mức độ ẩn danh
                </label>
                <div className="space-y-3">
                    {anonymityOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                            <label
                                key={option.value}
                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${anonymityLevel === option.value
                                        ? 'border-purple-500 bg-purple-50/50'
                                        : 'border-white/30 bg-white/10 hover:bg-white/20'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="anonymity"
                                    value={option.value}
                                    checked={anonymityLevel === option.value}
                                    onChange={(e) => setAnonymityLevel(e.target.value)}
                                    className="w-4 h-4 text-purple-600"
                                />
                                <Icon className={`w-5 h-5 ${anonymityLevel === option.value ? 'text-purple-600' : 'text-gray-400'}`} />
                                <div>
                                    <span className={`font-medium ${anonymityLevel === option.value ? 'text-purple-700' : 'text-gray-700'}`}>
                                        {option.label}
                                    </span>
                                    <p className="text-sm text-gray-500">{option.description}</p>
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Privacy Notice */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-green-100/30 border border-green-200/50">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                    Thông tin cá nhân của bạn được bảo mật tuyệt đối.
                    Confession chỉ hiển thị nội dung và không tiết lộ bất kỳ thông tin nhận dạng nào.
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
                <button
                    onClick={onCancel}
                    className="flex-1 glass-button"
                >
                    Hủy
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !content.trim()}
                    className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            Đăng confession
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default CreateConfession;
