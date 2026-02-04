// Teacher Profile Card Component
// Displays teacher info for selection modal and profile viewing
import React from 'react';
import { Star, Clock, MessageCircle, Award } from 'lucide-react';

// Specialty tag colors
const specialtyColors = {
    'Tình cảm': 'bg-pink-100 text-pink-700',
    'Gia đình': 'bg-orange-100 text-orange-700',
    'Học tập': 'bg-blue-100 text-blue-700',
    'Tâm lý': 'bg-purple-100 text-purple-700',
    'Lối sống': 'bg-green-100 text-green-700',
    'Định hướng': 'bg-cyan-100 text-cyan-700'
};

const TeacherProfileCard = ({
    teacher,
    onSelect,
    onViewProfile,
    isSelected = false,
    compact = false
}) => {
    const {
        displayName = 'Giáo viên',
        avatar,
        bio = 'Giáo viên tư vấn tâm lý học đường',
        specialties = [],
        experience = 0,
        totalConsultations = 0,
        isOnline = false
    } = teacher || {};

    // Default avatar if not set
    const avatarUrl = avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher?.id || 'teacher'}`;

    if (compact) {
        return (
            <div
                onClick={() => onSelect?.(teacher)}
                className={`
                    p-4 rounded-2xl cursor-pointer transition-all duration-300
                    ${isSelected
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-[1.02]'
                        : 'bg-white/60 hover:bg-white/80 hover:shadow-md'
                    }
                `}
            >
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                        <img
                            src={avatarUrl}
                            alt={displayName}
                            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                        />
                        {isOnline && (
                            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-lg truncate ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                            {displayName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            {specialties.slice(0, 2).map((specialty, idx) => (
                                <span
                                    key={idx}
                                    className={`
                                        text-xs px-2 py-0.5 rounded-full font-medium
                                        ${isSelected ? 'bg-white/20 text-white' : specialtyColors[specialty] || 'bg-gray-100 text-gray-600'}
                                    `}
                                >
                                    {specialty}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* View Profile Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewProfile?.(teacher);
                        }}
                        className={`
                            px-3 py-1.5 text-sm rounded-lg font-medium transition-all
                            ${isSelected
                                ? 'bg-white/20 text-white hover:bg-white/30'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }
                        `}
                    >
                        Xem
                    </button>
                </div>
            </div>
        );
    }

    // Full card view
    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                    <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-lg"
                    />
                    {isOnline && (
                        <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
                    )}
                </div>

                <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-800">{displayName}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <Award className="w-4 h-4" />
                        <span>{experience} năm kinh nghiệm</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <MessageCircle className="w-4 h-4" />
                        <span>{totalConsultations} lượt tư vấn</span>
                    </div>
                </div>
            </div>

            {/* Bio */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{bio}</p>

            {/* Specialties */}
            <div className="flex flex-wrap gap-2 mb-4">
                {specialties.map((specialty, idx) => (
                    <span
                        key={idx}
                        className={`
                            text-xs px-3 py-1 rounded-full font-medium
                            ${specialtyColors[specialty] || 'bg-gray-100 text-gray-600'}
                        `}
                    >
                        {specialty}
                    </span>
                ))}
            </div>

            {/* Action Button */}
            <button
                onClick={() => onSelect?.(teacher)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold 
                         hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
                Chọn giáo viên này
            </button>
        </div>
    );
};

export default TeacherProfileCard;
