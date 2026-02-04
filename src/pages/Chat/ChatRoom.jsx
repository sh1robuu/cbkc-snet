import React, { useState, useEffect, useRef } from 'react';
import {
    ArrowLeft,
    Send,
    MoreVertical,
    Phone,
    Video,
    Paperclip,
    Smile,
    Shield,
    Clock,
    CheckCheck,
    AlertTriangle,
    FileText,
    X
} from 'lucide-react';
import { GlassCard } from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { analyzeUrgency, generateSupportiveResponse } from '../../services/aiService';
import NotesPanel from './NotesPanel';

const ChatRoom = ({ teacher, student, onBack, isTeacherView = false, chatId }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [showNotes, setShowNotes] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [urgencyLevel, setUrgencyLevel] = useState(null);
    const [isConsulted, setIsConsulted] = useState(false);
    const messagesEndRef = useRef(null);

    const { userProfile } = useAuth();

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initial greeting messages
    useEffect(() => {
        const greetings = [
            {
                id: 1,
                content: `Xin chào! Mình là ${teacher?.displayName || 'giáo viên tư vấn'}. Rất vui được kết nối với bạn! 💚`,
                sender: 'teacher',
                isSystem: false,
                timestamp: new Date()
            },
            {
                id: 2,
                content: 'Bạn có chuyện gì muốn kể cho mình nghe không?',
                sender: 'teacher',
                isSystem: false,
                timestamp: new Date()
            },
            {
                id: 3,
                content: '💡 Theo thang điểm 10, bạn đang cảm thấy buồn/stress bao nhiêu? (1 = ổn, 10 = rất khó khăn)',
                sender: 'system',
                isSystem: true,
                timestamp: new Date()
            }
        ];

        if (!isTeacherView) {
            const timer = setTimeout(() => {
                setMessages(greetings);
            }, 500);
            return () => clearTimeout(timer);
        } else {
            // Load existing messages for teacher view
            setMessages([
                {
                    id: 1,
                    content: 'Em chào thầy/cô ạ...',
                    sender: 'student',
                    timestamp: new Date(Date.now() - 3600000)
                },
                {
                    id: 2,
                    content: 'Em đang gặp vấn đề về việc học tập và áp lực thi cử',
                    sender: 'student',
                    timestamp: new Date(Date.now() - 3500000)
                }
            ]);
        }
    }, [teacher, isTeacherView]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const newMessage = {
            id: Date.now(),
            content: inputValue,
            sender: isTeacherView ? 'teacher' : 'student',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        const messageContent = inputValue;
        setInputValue('');

        // If student sends message, analyze urgency and possibly get AI response
        if (!isTeacherView) {
            setIsTyping(true);

            try {
                // Analyze urgency
                const analysis = await analyzeUrgency(messageContent);
                setUrgencyLevel(analysis);

                // If urgency is high, show alert
                if (analysis.needsImmediate) {
                    const alertMessage = {
                        id: Date.now() + 1,
                        content: '⚠️ Chúng tôi nhận thấy bạn đang gặp khó khăn. Giáo viên sẽ ưu tiên phản hồi bạn ngay. Nếu bạn đang trong tình huống khẩn cấp, hãy gọi hotline: 1800 599 920',
                        sender: 'system',
                        isSystem: true,
                        isUrgent: true,
                        timestamp: new Date()
                    };
                    setMessages(prev => [...prev, alertMessage]);
                }

                // Generate supportive AI response while waiting
                const aiResponse = await generateSupportiveResponse(messageContent);

                setTimeout(() => {
                    const supportMessage = {
                        id: Date.now() + 2,
                        content: aiResponse.response,
                        sender: 'ai',
                        isAI: true,
                        timestamp: new Date()
                    };
                    setMessages(prev => [...prev, supportMessage]);
                    setIsTyping(false);
                }, 1000);
            } catch (error) {
                console.error('AI error:', error);
                setIsTyping(false);
            }
        } else {
            // Teacher sent message - reset consulted status if it was marked
            if (isConsulted) {
                setIsConsulted(false);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleMarkConsulted = () => {
        setIsConsulted(!isConsulted);
    };

    const currentPerson = isTeacherView ? student : teacher;

    return (
        <div className="flex h-full gap-4">
            {/* Main Chat Area */}
            <GlassCard className={`flex-1 flex flex-col h-full ${showNotes ? 'rounded-r-none' : ''}`} hover={false} padding="p-0">
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/20">
                    <div className="flex items-center gap-3">
                        {onBack && (
                            <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/20 transition-all">
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                        )}

                        <div className="relative">
                            <img
                                src={currentPerson?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                                alt="Avatar"
                                className="w-10 h-10 rounded-full border-2 border-white/50"
                            />
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-800">
                                {isTeacherView ? (student?.displayName || 'Học sinh ẩn danh') : currentPerson?.displayName}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Shield className="w-3 h-3 text-green-500" />
                                <span>Cuộc trò chuyện được mã hóa</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Urgency Badge */}
                        {urgencyLevel && urgencyLevel.urgencyLevel >= 7 && (
                            <span className="urgency-high flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Ưu tiên
                            </span>
                        )}

                        {/* Teacher Actions */}
                        {isTeacherView && (
                            <>
                                <button
                                    onClick={handleMarkConsulted}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isConsulted
                                            ? 'bg-green-500 text-white'
                                            : 'glass hover:bg-white/30'
                                        }`}
                                >
                                    {isConsulted ? '✓ Đã tư vấn' : 'Đánh dấu đã tư vấn'}
                                </button>

                                <button
                                    onClick={() => setShowNotes(!showNotes)}
                                    className={`p-2 rounded-xl transition-all ${showNotes ? 'bg-purple-500 text-white' : 'hover:bg-white/20'}`}
                                    title="Ghi chú"
                                >
                                    <FileText className="w-5 h-5" />
                                </button>
                            </>
                        )}

                        <button className="p-2 rounded-xl hover:bg-white/20 transition-all">
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'student' ? (isTeacherView ? 'justify-start' : 'justify-end') :
                                    message.sender === 'teacher' ? (isTeacherView ? 'justify-end' : 'justify-start') :
                                        'justify-center'
                                }`}
                        >
                            <div
                                className={`message-bubble ${message.isSystem ? 'message-system max-w-md' :
                                        message.isAI ? 'glass border-2 border-cyan-300/50 max-w-[80%]' :
                                            (message.sender === 'student' && !isTeacherView) || (message.sender === 'teacher' && isTeacherView)
                                                ? 'message-sent'
                                                : 'message-received'
                                    } ${message.isUrgent ? 'border-2 border-red-400' : ''}`}
                            >
                                {message.isAI && (
                                    <div className="flex items-center gap-1 text-xs text-cyan-600 mb-1">
                                        <span className="w-4 h-4 rounded-full bg-cyan-500 flex items-center justify-center text-white text-[10px]">AI</span>
                                        Trợ lý AI
                                    </div>
                                )}
                                <p className="whitespace-pre-wrap">{message.content}</p>
                                <div className="flex items-center justify-end gap-1 mt-1">
                                    <span className="text-xs opacity-60">
                                        {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                    {((message.sender === 'student' && !isTeacherView) || (message.sender === 'teacher' && isTeacherView)) && (
                                        <CheckCheck className="w-4 h-4 opacity-60" />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="glass px-4 py-3 rounded-2xl rounded-bl-sm">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/20">
                    <div className="flex items-end gap-3">
                        <button className="p-2 rounded-xl hover:bg-white/20 transition-all text-gray-500">
                            <Paperclip className="w-5 h-5" />
                        </button>

                        <div className="flex-1 relative">
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Nhập tin nhắn..."
                                className="glass-input resize-none py-3 pr-12 min-h-[48px] max-h-32"
                                rows={1}
                            />
                            <button className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600">
                                <Smile className="w-5 h-5" />
                            </button>
                        </div>

                        <button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim()}
                            className="btn-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </GlassCard>

            {/* Notes Panel (Teacher Only) */}
            {isTeacherView && showNotes && (
                <NotesPanel
                    chatId={chatId}
                    studentId={student?.id}
                    onClose={() => setShowNotes(false)}
                />
            )}
        </div>
    );
};

export default ChatRoom;
