import React, { useState } from 'react';
import {
    Heart,
    MessageCircle,
    Share2,
    MoreHorizontal,
    Clock,
    Send,
    Brain,
    Coffee
} from 'lucide-react';
import { GlassCard } from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const ConfessionCard = ({ confession, onLike }) => {
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [localComments, setLocalComments] = useState(confession.comments || []);

    const { isAuthenticated, userProfile } = useAuth();

    const handleLike = () => {
        if (!isAuthenticated) return;
        if (!isLiked) {
            setIsLiked(true);
            onLike();
        }
    };

    const handleComment = () => {
        if (!newComment.trim() || !isAuthenticated) return;

        const comment = {
            id: `cmt-${Date.now()}`,
            content: newComment,
            authorId: 'anonymous',
            createdAt: new Date().toISOString()
        };

        setLocalComments([...localComments, comment]);
        setNewComment('');
    };

    const formatTime = (dateString) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: vi });
        } catch {
            return 'vừa xong';
        }
    };

    const getTopicBadge = () => {
        if (confession.topic === 'psychology') {
            return (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-100/50 text-indigo-700 text-xs font-medium">
                    <Brain className="w-3 h-3" />
                    Tâm lý
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100/50 text-amber-700 text-xs font-medium">
                <Coffee className="w-3 h-3" />
                Ngoài lề
            </span>
        );
    };

    return (
        <GlassCard className="animate-fade-in" hover={false}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                        <span className="text-white text-lg">🎭</span>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-800">Ẩn danh</span>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatTime(confession.createdAt)}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {getTopicBadge()}
                    <button className="p-2 rounded-xl hover:bg-white/20 transition-all">
                        <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="mb-4">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {confession.content}
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 pt-4 border-t border-white/20">
                <button
                    onClick={handleLike}
                    disabled={!isAuthenticated}
                    className={`flex items-center gap-2 transition-all ${isLiked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'
                        } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="font-medium">{confession.likes + (isLiked ? 1 : 0)}</span>
                </button>

                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-all"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">{localComments.length}</span>
                </button>

                <button
                    disabled={!isAuthenticated}
                    className={`flex items-center gap-2 text-gray-500 hover:text-green-500 transition-all ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    <Share2 className="w-5 h-5" />
                    <span className="font-medium">Chia sẻ</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-4 pt-4 border-t border-white/20 space-y-4">
                    {/* Comments List */}
                    {localComments.length > 0 && (
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {localComments.map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-sm">👤</span>
                                    </div>
                                    <div className="flex-1 glass rounded-xl p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-gray-800 text-sm">Ẩn danh</span>
                                            <span className="text-xs text-gray-400">{formatTime(comment.createdAt)}</span>
                                        </div>
                                        <p className="text-gray-700 text-sm">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add Comment */}
                    {isAuthenticated ? (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-sm">👤</span>
                            </div>
                            <div className="flex-1 flex gap-2">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                                    placeholder="Viết bình luận ẩn danh..."
                                    className="glass-input py-2 text-sm flex-1"
                                />
                                <button
                                    onClick={handleComment}
                                    disabled={!newComment.trim()}
                                    className="btn-primary p-2 disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 text-sm py-2">
                            <a href="/login" className="text-purple-600 font-semibold">Đăng nhập</a> để bình luận
                        </p>
                    )}
                </div>
            )}
        </GlassCard>
    );
};

export default ConfessionCard;
