// Teacher Profile Editor - Public profile with photo upload
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Check, Plus, X, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MainLayout, GlassCard } from '../../components/Layout';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';

// Available specialties
const AVAILABLE_SPECIALTIES = [
    'Tình cảm', 'Gia đình', 'Học tập', 'Tâm lý',
    'Lối sống', 'Định hướng', 'Bạo lực học đường', 'Trầm cảm'
];

const TeacherProfileEditor = () => {
    const navigate = useNavigate();
    const { user, userProfile, updateUserProfile } = useAuth();
    const fileInputRef = useRef(null);

    // Form state
    const [formData, setFormData] = useState({
        displayName: userProfile?.displayName || '',
        bio: userProfile?.bio || '',
        experience: userProfile?.experience || 0,
        specialties: userProfile?.specialties || [],
        availableHours: userProfile?.availableHours || ''
    });

    const [avatarPreview, setAvatarPreview] = useState(userProfile?.avatar || null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file ảnh');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Ảnh không được quá 5MB');
            return;
        }

        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    // Toggle specialty
    const toggleSpecialty = (specialty) => {
        setFormData(prev => ({
            ...prev,
            specialties: prev.specialties.includes(specialty)
                ? prev.specialties.filter(s => s !== specialty)
                : [...prev.specialties, specialty]
        }));
    };

    // Handle save
    const handleSave = async () => {
        if (!formData.displayName.trim()) {
            alert('Vui lòng nhập họ tên');
            return;
        }

        setIsSaving(true);

        try {
            let avatarUrl = userProfile?.avatar;

            // Upload avatar if changed
            if (avatarFile && user?.uid) {
                try {
                    const avatarRef = ref(storage, `avatars/${user.uid}`);
                    await uploadBytes(avatarRef, avatarFile);
                    avatarUrl = await getDownloadURL(avatarRef);
                } catch (uploadError) {
                    console.error('Avatar upload failed:', uploadError);
                    // Continue with existing avatar
                }
            }

            await updateUserProfile({
                ...formData,
                avatar: avatarUrl
            });

            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error('Save failed:', error);
            alert('Lưu thất bại. Vui lòng thử lại.');
        }

        setIsSaving(false);
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
                        <h1 className="text-2xl font-bold text-gray-800">Hồ sơ giáo viên</h1>
                        <p className="text-gray-500">Thông tin này sẽ hiển thị cho học sinh</p>
                    </div>
                </div>

                <GlassCard className="p-6" hover={false}>
                    {/* Avatar Upload */}
                    <div className="text-center mb-8">
                        <div className="relative inline-block">
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="Avatar"
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                                    <span className="text-4xl text-white font-bold">
                                        {formData.displayName?.charAt(0) || 'GV'}
                                    </span>
                                </div>
                            )}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 
                                         rounded-full flex items-center justify-center text-white shadow-lg
                                         hover:scale-110 transition-transform"
                            >
                                <Camera className="w-5 h-5" />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-3">
                            Click để tải ảnh đại diện (tối đa 5MB)
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                        {/* Display Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.displayName}
                                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                placeholder="VD: Nguyễn Thị Hương"
                                className="w-full px-4 py-3 rounded-xl bg-gray-100 border-none 
                                         focus:outline-none focus:ring-2 focus:ring-purple-300"
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Giới thiệu bản thân
                            </label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Mô tả ngắn về bạn, phong cách tư vấn, thông điệp gửi học sinh..."
                                rows={4}
                                maxLength={500}
                                className="w-full px-4 py-3 rounded-xl bg-gray-100 border-none resize-none
                                         focus:outline-none focus:ring-2 focus:ring-purple-300"
                            />
                            <p className="text-xs text-gray-400 text-right mt-1">
                                {formData.bio.length}/500
                            </p>
                        </div>

                        {/* Experience */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Số năm kinh nghiệm
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="50"
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-3 rounded-xl bg-gray-100 border-none 
                                         focus:outline-none focus:ring-2 focus:ring-purple-300"
                            />
                        </div>

                        {/* Specialties */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Chuyên môn tư vấn
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {AVAILABLE_SPECIALTIES.map((specialty) => {
                                    const isSelected = formData.specialties.includes(specialty);
                                    return (
                                        <button
                                            key={specialty}
                                            onClick={() => toggleSpecialty(specialty)}
                                            className={`
                                                px-4 py-2 rounded-full text-sm font-medium transition-all
                                                ${isSelected
                                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }
                                            `}
                                        >
                                            {isSelected && <Check className="w-4 h-4 inline mr-1" />}
                                            {specialty}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Available Hours */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Thời gian hoạt động
                            </label>
                            <input
                                type="text"
                                value={formData.availableHours}
                                onChange={(e) => setFormData({ ...formData, availableHours: e.target.value })}
                                placeholder="VD: Thứ 2-6, 8:00 - 17:00"
                                className="w-full px-4 py-3 rounded-xl bg-gray-100 border-none 
                                         focus:outline-none focus:ring-2 focus:ring-purple-300"
                            />
                        </div>
                    </div>

                    {/* Public Notice */}
                    <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
                        <p className="text-sm text-blue-700">
                            <strong>ℹ️ Lưu ý:</strong> Thông tin này sẽ hiển thị công khai cho học sinh khi họ chọn giáo viên tư vấn.
                        </p>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={!formData.displayName.trim() || isSaving}
                        className={`
                            w-full mt-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300
                            flex items-center justify-center gap-2
                            ${formData.displayName.trim() && !isSaving
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
                            <>
                                <Save className="w-5 h-5" />
                                Lưu hồ sơ
                            </>
                        )}
                    </button>
                </GlassCard>
            </div>
        </MainLayout>
    );
};

export default TeacherProfileEditor;
