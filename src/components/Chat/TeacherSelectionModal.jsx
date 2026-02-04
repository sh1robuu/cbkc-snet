// Teacher Selection Modal Component
// Modal for students to choose a teacher before starting chat
import React, { useState, useEffect } from 'react';
import { X, Search, User, Loader, UserX } from 'lucide-react';
import TeacherProfileCard from './TeacherProfileCard';
import { getActiveTeachers } from '../../services/userService';

const TeacherSelectionModal = ({
    isOpen,
    onClose,
    onSelectTeacher
}) => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [viewingProfile, setViewingProfile] = useState(null);

    // Fetch teachers on mount
    useEffect(() => {
        if (isOpen) {
            fetchTeachers();
        }
    }, [isOpen]);

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const result = await getActiveTeachers();
            setTeachers(result);
        } catch (error) {
            console.error('Error fetching teachers:', error);
            setTeachers([]);
        }
        setLoading(false);
    };

    // Filter teachers by search
    const filteredTeachers = teachers.filter(teacher =>
        teacher.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.specialties?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleSelect = (teacher) => {
        setSelectedTeacher(teacher);
    };

    const handleConfirm = () => {
        if (selectedTeacher) {
            onSelectTeacher(selectedTeacher);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl max-h-[85vh] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                            <User className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Chọn giáo viên tư vấn</h2>
                            <p className="text-white/80 text-sm mt-1">
                                Hãy chọn thầy/cô mà bạn muốn trò chuyện
                            </p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative mt-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm theo tên hoặc chuyên môn..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 
                                     border border-white/30 focus:outline-none focus:border-white/50"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader className="w-10 h-10 text-purple-500 animate-spin mb-4" />
                            <p className="text-gray-500">Đang tải danh sách giáo viên...</p>
                        </div>
                    ) : viewingProfile ? (
                        // Full Profile View
                        <div className="animate-fade-in">
                            <button
                                onClick={() => setViewingProfile(null)}
                                className="mb-4 text-purple-600 font-medium hover:underline"
                            >
                                ← Quay lại danh sách
                            </button>
                            <TeacherProfileCard
                                teacher={viewingProfile}
                                onSelect={handleSelect}
                                compact={false}
                            />
                        </div>
                    ) : filteredTeachers.length === 0 ? (
                        // Empty State
                        <div className="text-center py-12">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                <UserX className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                Chưa có giáo viên tư vấn
                            </h3>
                            <p className="text-gray-500 max-w-sm mx-auto">
                                {teachers.length === 0
                                    ? 'Hiện tại chưa có giáo viên nào được đăng ký trong hệ thống. Vui lòng liên hệ Admin để thêm giáo viên.'
                                    : 'Không tìm thấy giáo viên phù hợp với từ khóa tìm kiếm.'
                                }
                            </p>
                        </div>
                    ) : (
                        // Teacher List
                        <div className="space-y-3">
                            {filteredTeachers.map((teacher) => (
                                <TeacherProfileCard
                                    key={teacher.id || teacher.uid}
                                    teacher={teacher}
                                    onSelect={handleSelect}
                                    onViewProfile={setViewingProfile}
                                    isSelected={selectedTeacher?.id === teacher.id || selectedTeacher?.uid === teacher.uid}
                                    compact={true}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!viewingProfile && filteredTeachers.length > 0 && (
                    <div className="sticky bottom-0 p-4 bg-white/90 backdrop-blur border-t border-gray-100">
                        <button
                            onClick={handleConfirm}
                            disabled={!selectedTeacher}
                            className={`
                                w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300
                                ${selectedTeacher
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.01]'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }
                            `}
                        >
                            {selectedTeacher
                                ? `Bắt đầu chat với ${selectedTeacher.displayName}`
                                : 'Vui lòng chọn giáo viên'
                            }
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherSelectionModal;
