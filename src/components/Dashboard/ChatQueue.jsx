// Chat Queue Component - Left panel in Teacher Dashboard
// Shows list of students waiting/chatting, sorted by priority
import React from 'react';
import { Clock, MessageCircle, CheckCircle, Bot } from 'lucide-react';

// Priority badge colors
const priorityConfig = {
    critical: { color: 'bg-red-500', label: 'Khẩn cấp', icon: '🟥' },
    high: { color: 'bg-orange-500', label: 'Cao', icon: '🟧' },
    medium: { color: 'bg-yellow-500', label: 'Trung bình', icon: '🟨' },
    low: { color: 'bg-green-500', label: 'Thấp', icon: '🟩' }
};

// Status config
const statusConfig = {
    waiting: { label: 'Đang chờ', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    ai_active: { label: 'AI hỗ trợ', color: 'text-purple-600', bg: 'bg-purple-100' },
    teacher_active: { label: 'Đang chat', color: 'text-green-600', bg: 'bg-green-100' },
    resolved: { label: 'Đã tư vấn', color: 'text-gray-500', bg: 'bg-gray-100' }
};

const ChatQueue = ({ chats = [], selectedChatId, onSelectChat }) => {
    // Group chats by status
    const activeChats = chats.filter(c => c.status !== 'resolved');
    const resolvedChats = chats.filter(c => c.status === 'resolved');

    return (
        <div className="h-full flex flex-col bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
                <h2 className="font-bold text-lg text-gray-800">Danh sách học sinh</h2>
                <p className="text-sm text-gray-500 mt-1">
                    {activeChats.length} đang chờ • {resolvedChats.length} đã tư vấn
                </p>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
                {/* Active Chats */}
                {activeChats.length > 0 && (
                    <div className="p-2">
                        {activeChats.map((chat) => (
                            <ChatQueueItem
                                key={chat.id}
                                chat={chat}
                                isSelected={selectedChatId === chat.id}
                                onClick={() => onSelectChat(chat)}
                            />
                        ))}
                    </div>
                )}

                {/* Divider */}
                {resolvedChats.length > 0 && activeChats.length > 0 && (
                    <div className="px-4 py-2">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span>Đã tư vấn</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>
                    </div>
                )}

                {/* Resolved Chats */}
                {resolvedChats.length > 0 && (
                    <div className="p-2 opacity-60">
                        {resolvedChats.slice(0, 5).map((chat) => (
                            <ChatQueueItem
                                key={chat.id}
                                chat={chat}
                                isSelected={selectedChatId === chat.id}
                                onClick={() => onSelectChat(chat)}
                            />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {chats.length === 0 && (
                    <div className="p-8 text-center text-gray-400">
                        <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Chưa có học sinh nào</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Individual Chat Queue Item
const ChatQueueItem = ({ chat, isSelected, onClick }) => {
    const {
        studentName = 'Học sinh ẩn danh',
        studentAvatar,
        status = 'waiting',
        priority = 'medium',
        lastMessageAt,
        createdAt
    } = chat;

    const priorityInfo = priorityConfig[priority] || priorityConfig.medium;
    const statusInfo = statusConfig[status] || statusConfig.waiting;

    // Calculate time ago
    const getTimeAgo = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
        if (minutes < 1) return 'Vừa xong';
        if (minutes < 60) return `${minutes} phút`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} giờ`;
        return `${Math.floor(hours / 24)} ngày`;
    };

    return (
        <div
            onClick={onClick}
            className={`
                p-3 rounded-xl cursor-pointer transition-all duration-200 mb-2
                ${isSelected
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-50 hover:bg-gray-100'
                }
            `}
        >
            <div className="flex items-center gap-3">
                {/* Avatar with Priority Badge */}
                <div className="relative">
                    <img
                        src={studentAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${chat.id}`}
                        alt={studentName}
                        className="w-12 h-12 rounded-full border-2 border-white shadow"
                    />
                    {/* Priority Indicator */}
                    <span className={`absolute -top-1 -right-1 w-5 h-5 ${priorityInfo.color} rounded-full 
                                    flex items-center justify-center text-[10px] text-white font-bold shadow`}>
                        {priority === 'critical' ? '!' : priority === 'high' ? '↑' : ''}
                    </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className={`font-semibold truncate ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                            {studentName}
                        </span>
                        {status === 'ai_active' && (
                            <Bot className={`w-4 h-4 ${isSelected ? 'text-white/80' : 'text-purple-500'}`} />
                        )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                        {/* Status Badge */}
                        <span className={`
                            text-[10px] px-2 py-0.5 rounded-full font-medium
                            ${isSelected ? 'bg-white/20 text-white' : `${statusInfo.bg} ${statusInfo.color}`}
                        `}>
                            {statusInfo.label}
                        </span>

                        {/* Time */}
                        <span className={`text-xs flex items-center gap-1 ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                            <Clock className="w-3 h-3" />
                            {getTimeAgo(createdAt)}
                        </span>
                    </div>
                </div>

                {/* Priority Label */}
                <div className={`
                    text-[10px] font-bold px-2 py-1 rounded
                    ${isSelected ? 'bg-white/20 text-white' : `${priorityInfo.color} text-white`}
                `}>
                    {priorityInfo.icon}
                </div>
            </div>
        </div>
    );
};

export default ChatQueue;
