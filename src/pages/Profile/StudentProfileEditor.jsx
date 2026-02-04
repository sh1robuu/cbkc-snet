// Student Profile Editor - Anonymous profile with preset avatars
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowLeft, User, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MainLayout, GlassCard } from '../../components/Layout';

// Preset avatars for students (anonymous, cute characters)
const PRESET_AVATARS = [
    { id: 'cat', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=cat&backgroundColor=b6e3f4', name: 'Mèo con' },
    { id: 'dog', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=dog&backgroundColor=c0aede', name: 'Cún cưng' },
    { id: 'bear', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=bear&backgroundColor=ffd5dc', name: 'Gấu bông' },
    { id: 'bunny', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=bunny&backgroundColor=d1d4f9', name: 'Thỏ trắng' },
    { id: 'panda', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=panda&backgroundColor=c1f4d1', name: 'Gấu trúc' },
    { id: 'fox', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=fox&backgroundColor=ffe8cc', name: 'Cáo nhỏ' },
    { id: 'owl', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=owl&backgroundColor=e8d5f9', name: 'Cú mèo' },
    { id: 'star', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=star&backgroundColor=ffeaa7', name: 'Ngôi sao' },
    { id: 'cloud', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=cloud&backgroundColor=dfe6e9', name: 'Mây trắng' },
    { id: 'moon', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=moon&backgroundColor=a29bfe', name: 'Mặt trăng' },
    { id: 'sun', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=sun&backgroundColor=ffeab6', name: 'Mặt trời' },
    { id: 'flower', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=flower&backgroundColor=fab1a0', name: 'Hoa hồng' }
];

// Random nicknames suggestions
const NICKNAME_SUGGESTIONS = [
    'Bạn Mây', 'Gió Nhẹ', 'Ánh Sao', 'Lá Thu', 'Giọt Sương',
    'Cầu Vồng', 'Đóa Hoa', 'Làn Nước', 'Tia Nắng', 'Bông Tuyết'
];

const StudentProfileEditor = () => {
    const navigate = useNavigate();
    const { userProfile, updateUserProfile } = useAuth();

    const [selectedAvatar, setSelectedAvatar] = useState(
        userProfile?.avatarPreset || PRESET_AVATARS[0].id
    );
    const [nickname, setNickname] = useState(userProfile?.displayName || '');
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const selectedAvatarData = PRESET_AVATARS.find(a => a.id === selectedAvatar) || PRESET_AVATARS[0];

    const handleRandomNickname = () => {
        const random = NICKNAME_SUGGESTIONS[Math.floor(Math.random() * NICKNAME_SUGGESTIONS.length)];
        setNickname(random);
    };

    const handleSave = async () => {
        if (!nickname.trim()) return;

        setIsSaving(true);

        await updateUserProfile({
            displayName: nickname.trim(),
            avatarPreset: selectedAvatar,
            avatar: selectedAvatarData.url
        });

        setIsSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-xl bg-white/50 hover:bg-white/80 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Hồ sơ của bạn</h1>
                        <p className="text-gray-500">Chỉnh sửa avatar và nickname ẩn danh</p>
                    </div>
                </div>

                <GlassCard className="p-6" hover={false}>
                    {/* Current Preview */}
                    <div className="text-center mb-8">
                        <div className="relative inline-block">
                            <img
                                src={selectedAvatarData.url}
                                alt={selectedAvatarData.name}
                                className="w-32 h-32 rounded-full border-4 border-white shadow-xl mx-auto"
                            />
                            <span className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full" />
                        </div>
                        <h2 className="mt-4 text-xl font-bold text-gray-800">
                            {nickname || 'Tên ẩn danh của bạn'}
                        </h2>
                        <p className="text-gray-500 text-sm">Học sinh • @anonymous</p>
                    </div>

                    {/* Avatar Selection */}
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-4">
                            <User className="w-4 h-4 inline mr-2" />
                            Chọn avatar ẩn danh
                        </label>
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                            {PRESET_AVATARS.map((avatar) => (
                                <button
                                    key={avatar.id}
                                    onClick={() => setSelectedAvatar(avatar.id)}
                                    className={`
                                        relative p-2 rounded-2xl transition-all duration-200
                                        ${selectedAvatar === avatar.id
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-110 shadow-lg'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                        }
                                    `}
                                >
                                    <img
                                        src={avatar.url}
                                        alt={avatar.name}
                                        className="w-full aspect-square rounded-xl"
                                    />
                                    {selectedAvatar === avatar.id && (
                                        <span className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
                                            <Check className="w-4 h-4 text-purple-600" />
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Nickname Input */}
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            ✨ Nickname ẩn danh
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="Nhập tên bạn muốn hiển thị"
                                maxLength={20}
                                className="flex-1 px-4 py-3 rounded-xl bg-gray-100 border-none 
                                         focus:outline-none focus:ring-2 focus:ring-purple-300
                                         placeholder-gray-400"
                            />
                            <button
                                onClick={handleRandomNickname}
                                className="px-4 py-3 rounded-xl bg-purple-100 text-purple-600 font-semibold
                                         hover:bg-purple-200 transition-colors flex items-center gap-2"
                            >
                                <Sparkles className="w-4 h-4" />
                                Ngẫu nhiên
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            * Tên này sẽ hiển thị khi bạn chat với giáo viên. Thông tin thật của bạn được bảo mật.
                        </p>
                    </div>

                    {/* Privacy Notice */}
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 mb-6">
                        <p className="text-sm text-green-700">
                            <strong>🔒 Quyền riêng tư:</strong> Email và thông tin cá nhân của bạn được bảo mật hoàn toàn.
                            Giáo viên chỉ thấy avatar và nickname bạn chọn.
                        </p>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={!nickname.trim() || isSaving}
                        className={`
                            w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300
                            flex items-center justify-center gap-2
                            ${nickname.trim() && !isSaving
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.01]'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }
                        `}
                    >
                        {isSaving ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Đang lưu...
                            </>
                        ) : saved ? (
                            <>
                                <Check className="w-5 h-5" />
                                Đã lưu!
                            </>
                        ) : (
                            'Lưu thay đổi'
                        )}
                    </button>
                </GlassCard>
            </div>
        </MainLayout>
    );
};

export default StudentProfileEditor;
