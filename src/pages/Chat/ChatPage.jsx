// Chat Page - Complete rewrite with teacher selection and AI waiting mode
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User, Clock, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MainLayout, GlassCard } from '../../components/Layout';
import TeacherSelectionModal from '../../components/Chat/TeacherSelectionModal';
import {
    createChatRoom,
    addMessage,
    updateChatStatus,
    updateAISummary,
    subscribeToMessages,
    getChatById
} from '../../services/chatService';
import { generateConsultationResponse, generateAISummary } from '../../services/aiService';

const WAITING_TIMEOUT = 30000; // 30 seconds

const ChatPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, userProfile } = useAuth();

    // UI States
    const [showTeacherModal, setShowTeacherModal] = useState(true);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    // Chat States
    const [chatId, setChatId] = useState(null);
    const [chatStatus, setChatStatus] = useState('waiting'); // waiting | ai_active | teacher_active
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [aiQuestionIndex, setAiQuestionIndex] = useState(0);

    // Timer for AI activation
    const waitingTimerRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Subscribe to messages when chat is created
    useEffect(() => {
        if (!chatId) return;

        const unsubscribe = subscribeToMessages(chatId, (newMessages) => {
            setMessages(newMessages.filter(m => m.isVisible !== false));
        });

        return () => unsubscribe();
    }, [chatId]);

    // Handle teacher selection
    const handleSelectTeacher = async (teacher) => {
        setSelectedTeacher(teacher);
        setShowTeacherModal(false);

        // Create chat room in Firebase
        const result = await createChatRoom(
            user?.uid || 'anonymous-student',
            teacher.id,
            userProfile
        );

        if (result.success) {
            setChatId(result.chatId);
            setChatStatus('waiting');
        } else {
            // Fallback to local state if Firebase fails
            setMessages([{
                id: 'welcome',
                senderType: 'system',
                content: 'Chào em, S-Net đang kết nối em đến với các thầy cô. Em vui lòng chờ trong giây lát nhé 💙',
                timestamp: new Date()
            }]);
        }
    };

    // Start waiting timer after first student message
    const startWaitingTimer = () => {
        if (waitingTimerRef.current) return;

        waitingTimerRef.current = setTimeout(async () => {
            // Check if teacher has responded
            if (chatStatus === 'waiting') {
                // Activate AI mode
                setChatStatus('ai_active');

                // Send AI greeting
                const aiGreeting = {
                    id: `ai-greeting-${Date.now()}`,
                    senderType: 'ai',
                    content: `Chào bạn, hiện tại giáo viên đang bận.\nMình là trợ lý S-Net và sẽ đồng hành cùng bạn trong thời gian chờ đợi thầy cô.\nHãy cùng nhau chia sẻ nhé 🌱`,
                    timestamp: new Date(),
                    isVisible: true
                };

                if (chatId) {
                    await addMessage(chatId, aiGreeting);
                    await updateChatStatus(chatId, 'ai_active');
                } else {
                    setMessages(prev => [...prev, aiGreeting]);
                }
            }
        }, WAITING_TIMEOUT);
    };

    // Handle send message
    const handleSendMessage = async () => {
        if (!input.trim() || isTyping) return;

        const messageContent = input.trim();
        setInput('');

        // Create student message
        const studentMessage = {
            id: `student-${Date.now()}`,
            senderId: user?.uid || 'anonymous',
            senderType: 'student',
            content: messageContent,
            timestamp: new Date(),
            isVisible: true
        };

        // Add to local state immediately
        setMessages(prev => [...prev, studentMessage]);

        // Add to Firebase if chatId exists
        if (chatId) {
            await addMessage(chatId, studentMessage);
        }

        // Start waiting timer on first message
        if (chatStatus === 'waiting' && messages.filter(m => m.senderType === 'student').length === 0) {
            startWaitingTimer();
        }

        // If AI is active, generate response
        if (chatStatus === 'ai_active') {
            setIsTyping(true);

            // Generate AI response
            const conversationHistory = [...messages, studentMessage];
            const aiResponse = await generateConsultationResponse(
                messageContent,
                conversationHistory,
                aiQuestionIndex
            );

            // Add AI response
            const aiMessage = {
                id: `ai-${Date.now()}`,
                senderType: 'ai',
                content: aiResponse.response,
                timestamp: new Date(),
                isVisible: true
            };

            if (chatId) {
                await addMessage(chatId, aiMessage);
            } else {
                setMessages(prev => [...prev, aiMessage]);
            }

            setAiQuestionIndex(prev => prev + 1);
            setIsTyping(false);

            // Generate AI summary after a few exchanges
            if (aiQuestionIndex >= 2 && chatId) {
                const allMessages = [...conversationHistory, aiMessage];
                const summary = await generateAISummary(allMessages);
                await updateAISummary(chatId, summary);
            }
        }
    };

    // Handle key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // If not authenticated, show login prompt
    if (!isAuthenticated) {
        return (
            <MainLayout showFooter={false}>
                <div className="h-[calc(100vh-100px)] flex items-center justify-center">
                    <GlassCard className="text-center p-8 max-w-md">
                        <AlertCircle className="w-16 h-16 mx-auto text-purple-500 mb-4" />
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Đăng nhập để tiếp tục</h2>
                        <p className="text-gray-600 mb-6">Bạn cần đăng nhập để sử dụng tính năng tư vấn</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="btn-primary w-full"
                        >
                            Đăng nhập ngay
                        </button>
                    </GlassCard>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout showFooter={false}>
            {/* Teacher Selection Modal */}
            <TeacherSelectionModal
                isOpen={showTeacherModal}
                onClose={() => navigate('/')}
                onSelectTeacher={handleSelectTeacher}
            />

            {/* Chat Interface */}
            {!showTeacherModal && (
                <div className="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-100px)]">
                    <GlassCard className="h-full flex flex-col p-0 overflow-hidden" hover={false}>
                        {/* Chat Header */}
                        <div className="px-6 py-4 border-b border-gray-100 bg-white/50">
                            <div className="flex items-center gap-4">
                                {/* Teacher Avatar */}
                                <div className="relative">
                                    <img
                                        src={selectedTeacher?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher'}
                                        alt={selectedTeacher?.displayName}
                                        className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                                    />
                                    {chatStatus === 'ai_active' && (
                                        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold bg-purple-500 text-white rounded-full">
                                            AI
                                        </span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800">
                                        {selectedTeacher?.displayName || 'Giáo viên'}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm">
                                        {chatStatus === 'waiting' && (
                                            <>
                                                <Clock className="w-4 h-4 text-yellow-500" />
                                                <span className="text-yellow-600">Đang chờ phản hồi...</span>
                                            </>
                                        )}
                                        {chatStatus === 'ai_active' && (
                                            <>
                                                <Bot className="w-4 h-4 text-purple-500" />
                                                <span className="text-purple-600">AI đang hỗ trợ</span>
                                            </>
                                        )}
                                        {chatStatus === 'teacher_active' && (
                                            <>
                                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                                <span className="text-green-600">Đang trực tuyến</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* AI Active Banner */}
                            {chatStatus === 'ai_active' && (
                                <div className="mt-3 p-3 rounded-xl bg-purple-100/50 border border-purple-200">
                                    <p className="text-sm text-purple-700">
                                        <Bot className="w-4 h-4 inline mr-1" />
                                        <strong>AI đang đồng hành cùng bạn</strong> trong lúc chờ giáo viên.
                                        Khi giáo viên tham gia, họ sẽ xem được toàn bộ cuộc trò chuyện.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white/30 to-white/10">
                            {messages.map((message) => (
                                <MessageBubble key={message.id} message={message} />
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="flex items-center gap-2 text-gray-500">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                    <span className="text-sm">AI đang trả lời...</span>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-gray-100 bg-white/80">
                            <div className="flex items-end gap-3">
                                <div className="flex-1 relative">
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Nhập tin nhắn..."
                                        rows={1}
                                        className="w-full px-4 py-3 rounded-2xl bg-gray-100 border-none resize-none 
                                                 focus:outline-none focus:ring-2 focus:ring-purple-300 
                                                 placeholder-gray-400 text-gray-800"
                                        style={{ maxHeight: '120px', minHeight: '48px' }}
                                    />
                                </div>
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!input.trim() || isTyping}
                                    className={`
                                        p-3 rounded-2xl transition-all duration-300
                                        ${input.trim() && !isTyping
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-105'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            )}
        </MainLayout>
    );
};

// Message Bubble Component
const MessageBubble = ({ message }) => {
    const { senderType, content, timestamp } = message;

    const isStudent = senderType === 'student';
    const isAI = senderType === 'ai';
    const isSystem = senderType === 'system';
    const isTeacher = senderType === 'teacher';

    if (isSystem) {
        return (
            <div className="flex justify-center">
                <div className="px-4 py-2 rounded-xl bg-gray-100/80 text-gray-600 text-sm text-center max-w-md">
                    {content}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex ${isStudent ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-end gap-2 max-w-[80%] ${isStudent ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                {!isStudent && (
                    <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                        ${isAI ? 'bg-gradient-to-br from-purple-400 to-pink-400' : 'bg-gradient-to-br from-blue-400 to-cyan-400'}
                    `}>
                        {isAI ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                    </div>
                )}

                {/* Bubble */}
                <div>
                    {/* Sender Label */}
                    {!isStudent && (
                        <span className={`text-xs font-medium ml-1 mb-1 block ${isAI ? 'text-purple-600' : 'text-blue-600'}`}>
                            {isAI ? 'Trợ lý AI' : 'Giáo viên'}
                        </span>
                    )}

                    <div className={`
                        px-4 py-3 rounded-2xl whitespace-pre-wrap
                        ${isStudent
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-md'
                            : isAI
                                ? 'bg-purple-100 text-purple-900 rounded-bl-md border border-purple-200'
                                : 'bg-blue-100 text-blue-900 rounded-bl-md border border-blue-200'
                        }
                    `}>
                        {content}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
