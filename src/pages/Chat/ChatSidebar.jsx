import React, { useState } from 'react';
import {
    Search,
    Filter,
    AlertTriangle,
    CheckCircle,
    Clock,
    MessageCircle
} from 'lucide-react';
import { GlassCard } from '../../components/Layout';

// Mock chat data for teacher's student list
const mockChats = [
    {
        id: 'chat-1',
        student: {
            id: 'student-1',
            displayName: 'Học sinh ẩn danh #1247',
            avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=1247',
        },
        lastMessage: 'Em cảm thấy rất áp lực với kỳ thi sắp tới...',
        lastMessageTime: new Date(Date.now() - 300000),
        urgencyLevel: 8,
        unreadCount: 3,
        isConsulted: false,
        category: 'học tập'
    },
    {
        id: 'chat-2',
        student: {
            id: 'student-2',
            displayName: 'Học sinh ẩn danh #2891',
            avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=2891',
        },
        lastMessage: 'Em muốn nói chuyện về vấn đề gia đình...',
        lastMessageTime: new Date(Date.now() - 1800000),
        urgencyLevel: 6,
        unreadCount: 1,
        isConsulted: false,
        category: 'gia đình'
    },
    {
        id: 'chat-3',
        student: {
            id: 'student-3',
            displayName: 'Học sinh ẩn danh #5623',
            avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=5623',
        },
        lastMessage: 'Cảm ơn thầy/cô đã lắng nghe em ạ!',
        lastMessageTime: new Date(Date.now() - 86400000),
        urgencyLevel: 2,
        unreadCount: 0,
        isConsulted: true,
        category: 'tình yêu'
    },
    {
        id: 'chat-4',
        student: {
            id: 'student-4',
            displayName: 'Học sinh ẩn danh #7734',
            avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=7734',
        },
        lastMessage: 'Em không biết phải làm sao nữa... Em rất mệt mỏi',
        lastMessageTime: new Date(Date.now() - 600000),
        urgencyLevel: 9,
        unreadCount: 5,
        isConsulted: false,
        category: 'tâm sinh lý'
    }
];

const ChatSidebar = ({ onSelectChat, activeChat }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all'); // all, urgent, consulted

    // Sort chats: urgent first, then by time, consulted at bottom
    const sortedChats = [...mockChats].sort((a, b) => {
        // Consulted chats go to bottom
        if (a.isConsulted && !b.isConsulted) return 1;
        if (!a.isConsulted && b.isConsulted) return -1;

        // Sort by urgency (higher first)
        if (a.urgencyLevel !== b.urgencyLevel) {
            return b.urgencyLevel - a.urgencyLevel;
        }

        // Then by time (newer first)
        return b.lastMessageTime - a.lastMessageTime;
    });

    // Filter chats
    const filteredChats = sortedChats.filter(chat => {
        const matchesSearch = chat.student.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

        if (filter === 'urgent') return matchesSearch && chat.urgencyLevel >= 7;
        if (filter === 'consulted') return matchesSearch && chat.isConsulted;
        return matchesSearch;
    });

    const getUrgencyBadge = (level) => {
        if (level >= 8) return <span className="urgency-high">Khẩn cấp</span>;
        if (level >= 5) return <span className="urgency-medium">Trung bình</span>;
        return <span className="urgency-low">Bình thường</span>;
    };

    const formatTime = (date) => {
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Vừa xong';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} phút`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ`;
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <GlassCard className="h-full flex flex-col" hover={false} padding="p-0">
            {/* Header */}
            <div className="p-4 border-b border-white/20">
                <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-purple-500" />
                    Danh sách học sinh
                </h2>

                {/* Search */}
                <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm..."
                        className="glass-input pl-9 py-2 text-sm"
                    />
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2">
                    {[
                        { key: 'all', label: 'Tất cả' },
                        { key: 'urgent', label: '🔴 Khẩn cấp' },
                        { key: 'consulted', label: '✓ Đã tư vấn' }
                    ].map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f.key
                                    ? 'bg-purple-500 text-white'
                                    : 'glass hover:bg-white/30'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
                {filteredChats.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Không có cuộc trò chuyện nào</p>
                    </div>
                ) : (
                    filteredChats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => onSelectChat(chat)}
                            className={`p-4 border-b border-white/10 cursor-pointer transition-all hover:bg-white/20 ${activeChat?.id === chat.id ? 'bg-white/30' : ''
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="relative flex-shrink-0">
                                    <img
                                        src={chat.student.avatar}
                                        alt="Student"
                                        className="w-12 h-12 rounded-full border-2 border-white/50"
                                    />
                                    {chat.unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                            {chat.unreadCount}
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold text-gray-800 text-sm truncate">
                                            {chat.student.displayName}
                                        </h4>
                                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                                            {formatTime(chat.lastMessageTime)}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 truncate mb-2">
                                        {chat.lastMessage}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        {getUrgencyBadge(chat.urgencyLevel)}

                                        {chat.isConsulted && (
                                            <span className="flex items-center gap-1 text-xs text-green-600">
                                                <CheckCircle className="w-3 h-3" />
                                                Đã tư vấn
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Stats Footer */}
            <div className="p-4 border-t border-white/20">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                        {mockChats.filter(c => !c.isConsulted).length} đang chờ
                    </span>
                    <span className="flex items-center gap-1 text-red-500">
                        <AlertTriangle className="w-4 h-4" />
                        {mockChats.filter(c => c.urgencyLevel >= 7).length} khẩn cấp
                    </span>
                </div>
            </div>
        </GlassCard>
    );
};

export default ChatSidebar;
