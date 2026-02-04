import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Clock } from 'lucide-react';
import { GlassCard } from '../../components/Layout';

const NotesPanel = ({ chatId, studentId, onClose }) => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Load notes from localStorage (simulating database)
    useEffect(() => {
        const savedNotes = localStorage.getItem(`notes_${studentId}`);
        if (savedNotes) {
            setNotes(JSON.parse(savedNotes));
        } else {
            // Demo notes
            setNotes([
                {
                    id: 1,
                    content: 'Học sinh có dấu hiệu stress do áp lực học tập',
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                    teacherName: 'Thầy Nguyễn Văn Minh'
                },
                {
                    id: 2,
                    content: 'Đã tư vấn về phương pháp quản lý thời gian',
                    createdAt: new Date(Date.now() - 43200000).toISOString(),
                    teacherName: 'Cô Trần Thị Lan'
                }
            ]);
        }
    }, [studentId]);

    const handleAddNote = () => {
        if (!newNote.trim()) return;

        setIsSaving(true);

        const note = {
            id: Date.now(),
            content: newNote,
            createdAt: new Date().toISOString(),
            teacherName: 'Giáo viên hiện tại'
        };

        const updatedNotes = [...notes, note];
        setNotes(updatedNotes);
        localStorage.setItem(`notes_${studentId}`, JSON.stringify(updatedNotes));
        setNewNote('');

        setTimeout(() => setIsSaving(false), 500);
    };

    const handleDeleteNote = (noteId) => {
        const updatedNotes = notes.filter(n => n.id !== noteId);
        setNotes(updatedNotes);
        localStorage.setItem(`notes_${studentId}`, JSON.stringify(updatedNotes));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <GlassCard className="w-80 flex flex-col h-full rounded-l-none" hover={false} padding="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
                <h3 className="font-bold text-gray-800">📝 Ghi chú</h3>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-white/20 transition-all"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {notes.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        <p className="text-sm">Chưa có ghi chú nào</p>
                    </div>
                ) : (
                    notes.map((note) => (
                        <div
                            key={note.id}
                            className="p-3 rounded-xl bg-white/10 border border-white/20 group"
                        >
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(note.createdAt)}
                                </span>
                                <button
                                    onClick={() => handleDeleteNote(note.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 text-red-500 transition-all"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{note.content}</p>
                            <span className="text-xs text-purple-600 font-medium">{note.teacherName}</span>
                        </div>
                    ))
                )}
            </div>

            {/* Add Note */}
            <div className="p-4 border-t border-white/20">
                <div className="space-y-3">
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Thêm ghi chú mới..."
                        className="glass-input resize-none text-sm"
                        rows={3}
                    />
                    <button
                        onClick={handleAddNote}
                        disabled={!newNote.trim() || isSaving}
                        className="btn-primary w-full py-2 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                Thêm ghi chú
                            </>
                        )}
                    </button>
                </div>

                <p className="text-xs text-gray-500 mt-3 text-center">
                    Ghi chú được lưu và chia sẻ với các giáo viên khác
                </p>
            </div>
        </GlassCard>
    );
};

export default NotesPanel;
