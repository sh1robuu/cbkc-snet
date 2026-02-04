// AI Summary Panel Component - Right panel in Teacher Dashboard
// Shows AI-generated summary and teacher notes
import React, { useState, useEffect } from 'react';
import { Bot, FileText, AlertTriangle, Tag, Save, Loader, Brain, Target } from 'lucide-react';

// Category labels
const categoryLabels = {
    relationship: { label: 'Tình cảm', color: 'bg-pink-100 text-pink-700', icon: '💕' },
    family: { label: 'Gia đình', color: 'bg-orange-100 text-orange-700', icon: '👨‍👩‍👧' },
    academic: { label: 'Học tập', color: 'bg-blue-100 text-blue-700', icon: '📚' },
    mental_health: { label: 'Tâm lý', color: 'bg-purple-100 text-purple-700', icon: '🧠' },
    lifestyle: { label: 'Lối sống', color: 'bg-green-100 text-green-700', icon: '🌱' },
    other: { label: 'Khác', color: 'bg-gray-100 text-gray-700', icon: '💬' }
};

// Severity badges
const severityConfig = {
    critical: { label: 'Khẩn cấp', color: 'bg-red-500 text-white', icon: AlertTriangle },
    high: { label: 'Cao', color: 'bg-orange-500 text-white', icon: AlertTriangle },
    medium: { label: 'Trung bình', color: 'bg-yellow-500 text-white', icon: null },
    low: { label: 'Thấp', color: 'bg-green-500 text-white', icon: null }
};

const AISummaryPanel = ({
    chat,
    onSaveNotes,
    isSaving = false
}) => {
    const [notes, setNotes] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

    // Load notes when chat changes
    useEffect(() => {
        if (chat?.teacherNotes) {
            setNotes(chat.teacherNotes);
        } else {
            setNotes('');
        }
        setHasChanges(false);
    }, [chat?.id]);

    const handleNotesChange = (value) => {
        setNotes(value);
        setHasChanges(value !== (chat?.teacherNotes || ''));
    };

    const handleSave = () => {
        if (hasChanges && onSaveNotes) {
            onSaveNotes(notes);
            setHasChanges(false);
        }
    };

    if (!chat) {
        return (
            <div className="h-full flex flex-col bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden">
                <div className="flex-1 flex items-center justify-center p-8 text-gray-400">
                    <div className="text-center">
                        <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Chọn một học sinh để xem thông tin</p>
                    </div>
                </div>
            </div>
        );
    }

    const { aiSummary } = chat;
    const categoryInfo = categoryLabels[aiSummary?.category] || categoryLabels.other;
    const severityInfo = severityConfig[aiSummary?.severity] || severityConfig.medium;
    const SeverityIcon = severityInfo.icon;

    return (
        <div className="h-full flex flex-col bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-500 to-pink-500">
                <div className="flex items-center gap-3 text-white">
                    <Bot className="w-6 h-6" />
                    <div>
                        <h2 className="font-bold">Phân tích AI</h2>
                        <p className="text-white/80 text-xs">Thông tin nội bộ - học sinh không thấy</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* AI Summary Section */}
                {aiSummary ? (
                    <>
                        {/* Severity & Category */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${severityInfo.color}`}>
                                {SeverityIcon && <SeverityIcon className="w-4 h-4" />}
                                {severityInfo.label}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryInfo.color}`}>
                                {categoryInfo.icon} {categoryInfo.label}
                            </span>
                        </div>

                        {/* Main Issue */}
                        <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                            <div className="flex items-center gap-2 text-purple-700 font-semibold mb-2">
                                <Target className="w-4 h-4" />
                                Vấn đề chính
                            </div>
                            <p className="text-gray-700">{aiSummary.mainIssue}</p>
                        </div>

                        {/* Urgent Signs */}
                        {aiSummary.urgentSigns && aiSummary.urgentSigns.length > 0 && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                                <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Dấu hiệu cần chú ý
                                </div>
                                <ul className="space-y-1">
                                    {aiSummary.urgentSigns.map((sign, idx) => (
                                        <li key={idx} className="text-red-600 text-sm flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                            {sign}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Key Points */}
                        {aiSummary.keyPoints && aiSummary.keyPoints.length > 0 && (
                            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                                <div className="flex items-center gap-2 text-blue-700 font-semibold mb-2">
                                    <Tag className="w-4 h-4" />
                                    Điểm quan trọng
                                </div>
                                <ul className="space-y-1">
                                    {aiSummary.keyPoints.map((point, idx) => (
                                        <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Suggested Approach */}
                        {aiSummary.suggestedApproach && (
                            <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                                <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                                    💡 Gợi ý tiếp cận
                                </div>
                                <p className="text-gray-700 text-sm">{aiSummary.suggestedApproach}</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                        <Bot className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500 text-sm">
                            AI đang phân tích cuộc trò chuyện...
                        </p>
                    </div>
                )}

                {/* Divider */}
                <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                        <FileText className="w-5 h-5" />
                        Ghi chú của bạn
                    </div>

                    {/* Notes Textarea */}
                    <textarea
                        value={notes}
                        onChange={(e) => handleNotesChange(e.target.value)}
                        placeholder="Ghi chú riêng về học sinh này (chỉ bạn thấy)..."
                        rows={5}
                        className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 resize-none
                                 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent
                                 placeholder-gray-400 text-gray-700"
                    />

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                        className={`
                            w-full mt-3 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
                            ${hasChanges
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }
                        `}
                    >
                        {isSaving ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                {hasChanges ? 'Lưu ghi chú' : 'Đã lưu'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AISummaryPanel;
