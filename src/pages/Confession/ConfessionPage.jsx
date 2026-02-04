import React, { useState, useEffect } from 'react';
import {
    Heart,
    MessageCircle,
    Share2,
    Plus,
    Filter,
    Search,
    Sparkles,
    Brain,
    Coffee,
    AlertCircle,
    Clock,
    CheckCircle,
    XCircle,
    LogIn
} from 'lucide-react';
import { MainLayout, GlassCard, GlassModal } from '../../components/Layout';
import { mockConfessions } from '../../data/mockConfessions';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CreateConfession from './CreateConfession';
import ConfessionCard from './ConfessionCard';
import { moderateContent } from '../../services/aiService';

const ConfessionPage = () => {
    const [confessions, setConfessions] = useState([]);
    const [pendingConfessions, setPendingConfessions] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const { isAuthenticated, isTeacher } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Load confessions
        setConfessions(mockConfessions);

        // Load pending confessions from localStorage for teacher review
        const pending = JSON.parse(localStorage.getItem('pendingConfessions') || '[]');
        setPendingConfessions(pending);
    }, []);

    // Filter confessions
    const filteredConfessions = confessions.filter(conf => {
        const matchesSearch = conf.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTopic = selectedTopic === 'all' || conf.topic === selectedTopic;
        return matchesSearch && matchesTopic && conf.status === 'approved';
    });

    const handleNewConfession = async (newConfession) => {
        // Run AI moderation
        const moderation = await moderateContent(newConfession.content);

        const confession = {
            ...newConfession,
            id: `conf-${Date.now()}`,
            likes: 0,
            comments: [],
            createdAt: new Date().toISOString(),
            moderationResult: moderation
        };

        // AI confident to approve (>= 80%)
        if (moderation.status === 'approved' && moderation.confidence >= 80) {
            confession.status = 'approved';
            setConfessions([confession, ...confessions]);
        }
        // AI not confident or needs review -> send to teacher
        else if (moderation.status === 'review' || moderation.confidence < 80) {
            confession.status = 'pending_review';
            const updatedPending = [confession, ...pendingConfessions];
            setPendingConfessions(updatedPending);
            localStorage.setItem('pendingConfessions', JSON.stringify(updatedPending));
        }
        // Rejected by AI
        else {
            confession.status = 'rejected';
        }

        setShowCreateModal(false);
    };

    const handleApproveConfession = (confessionId) => {
        const confession = pendingConfessions.find(c => c.id === confessionId);
        if (confession) {
            confession.status = 'approved';
            setConfessions([confession, ...confessions]);

            const updatedPending = pendingConfessions.filter(c => c.id !== confessionId);
            setPendingConfessions(updatedPending);
            localStorage.setItem('pendingConfessions', JSON.stringify(updatedPending));
        }
    };

    const handleRejectConfession = (confessionId) => {
        const updatedPending = pendingConfessions.filter(c => c.id !== confessionId);
        setPendingConfessions(updatedPending);
        localStorage.setItem('pendingConfessions', JSON.stringify(updatedPending));
    };

    const handleLike = (confessionId) => {
        if (!isAuthenticated) return;

        setConfessions(confessions.map(conf =>
            conf.id === confessionId
                ? { ...conf, likes: conf.likes + 1 }
                : conf
        ));
    };

    // If not authenticated, show login prompt
    if (!isAuthenticated) {
        return (
            <MainLayout>
                <div className="max-w-lg mx-auto px-4 py-20">
                    <GlassCard className="text-center" hover={false}>
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                            <Heart className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">
                            Đăng nhập để xem Confession
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Bạn cần đăng nhập để xem, thích, bình luận và chia sẻ confession của mình.
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

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
                        <Heart className="w-5 h-5 text-pink-500" />
                        <span className="text-sm font-medium text-gray-700">Chia sẻ ẩn danh</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                        Confession
                    </h1>
                    <p className="text-gray-600 max-w-lg mx-auto">
                        Nơi bạn có thể chia sẻ câu chuyện của mình một cách ẩn danh và nhận được sự đồng cảm từ cộng đồng.
                    </p>
                </div>

                {/* Teacher Review Queue */}
                {isTeacher && isTeacher() && pendingConfessions.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-orange-500" />
                            <h2 className="font-bold text-gray-800">Chờ duyệt ({pendingConfessions.length})</h2>
                        </div>
                        <div className="space-y-4">
                            {pendingConfessions.map((confession) => (
                                <GlassCard key={confession.id} hover={false} className="border-2 border-orange-200">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 text-xs font-bold rounded-full bg-orange-100 text-orange-700">
                                                AI không tự tin - cần review
                                            </span>
                                            {confession.moderationResult && (
                                                <span className="text-xs text-gray-500">
                                                    Độ tin cậy: {confession.moderationResult.confidence}%
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-gray-700 mb-4">{confession.content}</p>

                                    {confession.moderationResult?.reason && (
                                        <p className="text-sm text-gray-500 mb-4 italic">
                                            Lý do review: {confession.moderationResult.reason}
                                        </p>
                                    )}

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleApproveConfession(confession.id)}
                                            className="flex-1 py-2 rounded-xl bg-green-500 text-white font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Duyệt
                                        </button>
                                        <button
                                            onClick={() => handleRejectConfession(confession.id)}
                                            className="flex-1 py-2 rounded-xl bg-red-500 text-white font-semibold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Từ chối
                                        </button>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm confession..."
                            className="glass-input pl-12"
                        />
                    </div>

                    {/* Topic Filter */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSelectedTopic('all')}
                            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${selectedTopic === 'all'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                : 'glass hover:bg-white/30'
                                }`}
                        >
                            <Sparkles className="w-4 h-4" />
                            Tất cả
                        </button>
                        <button
                            onClick={() => setSelectedTopic('psychology')}
                            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${selectedTopic === 'psychology'
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                                : 'glass hover:bg-white/30'
                                }`}
                        >
                            <Brain className="w-4 h-4" />
                            Tâm lý
                        </button>
                        <button
                            onClick={() => setSelectedTopic('offtopic')}
                            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${selectedTopic === 'offtopic'
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                : 'glass hover:bg-white/30'
                                }`}
                        >
                            <Coffee className="w-4 h-4" />
                            Ngoài lề
                        </button>
                    </div>

                    {/* Create Button */}
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Đăng confession
                    </button>
                </div>

                {/* Confessions List */}
                <div className="space-y-6">
                    {filteredConfessions.length === 0 ? (
                        <GlassCard className="text-center py-12" hover={false}>
                            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                Chưa có confession nào
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Hãy là người đầu tiên chia sẻ câu chuyện của bạn!
                            </p>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="btn-primary"
                            >
                                Đăng confession đầu tiên
                            </button>
                        </GlassCard>
                    ) : (
                        filteredConfessions.map((confession) => (
                            <ConfessionCard
                                key={confession.id}
                                confession={confession}
                                onLike={() => handleLike(confession.id)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Create Confession Modal */}
            <GlassModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Đăng Confession"
            >
                <CreateConfession
                    onSubmit={handleNewConfession}
                    onCancel={() => setShowCreateModal(false)}
                />
            </GlassModal>
        </MainLayout>
    );
};

export default ConfessionPage;
