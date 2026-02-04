import React, { useState, useEffect } from 'react';
import {
    Users,
    UserPlus,
    Shield,
    GraduationCap,
    Trash2,
    Edit,
    ToggleLeft,
    ToggleRight,
    Save,
    X,
    Search,
    AlertCircle,
    CheckCircle,
    UserCog
} from 'lucide-react';
import { MainLayout, GlassCard, GlassModal } from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleTeacherCounseling
} from '../../services/userService';
import { specialtyTags } from '../../data/mockTeachers';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('teachers');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState(null);

    const { isAdmin, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if not admin
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (isAdmin && !isAdmin()) {
            navigate('/');
            return;
        }
    }, [isAuthenticated, isAdmin, navigate]);

    // Load users
    useEffect(() => {
        loadUsers();
    }, [activeTab]);

    const loadUsers = async () => {
        setLoading(true);
        const role = activeTab === 'all' ? null : activeTab === 'teachers' ? 'teacher' : 'student';
        const data = await getAllUsers(role);
        setUsers(data);
        setLoading(false);
    };

    const handleCreateUser = async (userData) => {
        const result = await createUser(userData);
        if (result.success) {
            setMessage({ type: 'success', text: 'Tạo tài khoản thành công!' });
            setShowCreateModal(false);
            loadUsers();
        } else {
            setMessage({ type: 'error', text: result.error || 'Có lỗi xảy ra' });
        }
        setTimeout(() => setMessage(null), 3000);
    };

    const handleToggleCounseling = async (userId, currentStatus) => {
        await toggleTeacherCounseling(userId, !currentStatus);
        loadUsers();
        setMessage({
            type: 'success',
            text: currentStatus ? 'Đã tắt tư vấn cho giáo viên' : 'Đã bật tư vấn cho giáo viên'
        });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
            await deleteUser(userId);
            loadUsers();
            setMessage({ type: 'success', text: 'Đã xóa người dùng' });
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const filteredUsers = users.filter(user =>
        user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const tabs = [
        { id: 'teachers', label: 'Giáo viên', icon: GraduationCap },
        { id: 'students', label: 'Học sinh', icon: Users },
        { id: 'all', label: 'Tất cả', icon: UserCog }
    ];

    if (!isAdmin || !isAdmin()) {
        return null;
    }

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                                <p className="text-gray-500 text-sm">Quản lý tài khoản và giáo viên tư vấn</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <UserPlus className="w-5 h-5" />
                        Thêm tài khoản
                    </button>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                        ? 'bg-green-100/50 border border-green-200 text-green-700'
                        : 'bg-red-100/50 border border-red-200 text-red-700'
                        }`}>
                        {message.type === 'success' ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <AlertCircle className="w-5 h-5" />
                        )}
                        <p>{message.text}</p>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                    : 'glass hover:bg-white/30'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm theo tên hoặc email..."
                        className="glass-input pl-12"
                    />
                </div>

                {/* Users List */}
                <GlassCard hover={false} padding="p-0">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-gray-500">Đang tải...</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="p-12 text-center">
                            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                Chưa có người dùng nào
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Thêm tài khoản mới để bắt đầu
                            </p>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="btn-primary"
                            >
                                Thêm tài khoản
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50/50 font-semibold text-gray-600 text-sm">
                                <div className="col-span-4">Người dùng</div>
                                <div className="col-span-2">Vai trò</div>
                                <div className="col-span-3">
                                    {activeTab === 'teachers' ? 'Trạng thái tư vấn' : 'Ngày tạo'}
                                </div>
                                <div className="col-span-3 text-right">Thao tác</div>
                            </div>

                            {/* Table Body */}
                            {filteredUsers.map(user => (
                                <div key={user.uid} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50/50 transition-colors">
                                    {/* User Info */}
                                    <div className="col-span-4 flex items-center gap-3">
                                        <img
                                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                                            alt={user.displayName}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-800">{user.displayName}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>

                                    {/* Role */}
                                    <div className="col-span-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'admin'
                                            ? 'bg-red-100 text-red-700'
                                            : user.role === 'teacher'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {user.role === 'admin' ? 'Admin' : user.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}
                                        </span>
                                    </div>

                                    {/* Status / Date */}
                                    <div className="col-span-3">
                                        {user.role === 'teacher' ? (
                                            <button
                                                onClick={() => handleToggleCounseling(user.uid, user.isActiveForCounseling)}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${user.isActiveForCounseling
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {user.isActiveForCounseling ? (
                                                    <>
                                                        <ToggleRight className="w-4 h-4" />
                                                        Đang tư vấn
                                                    </>
                                                ) : (
                                                    <>
                                                        <ToggleLeft className="w-4 h-4" />
                                                        Tắt tư vấn
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <span className="text-sm text-gray-500">
                                                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-3 flex items-center justify-end gap-2">
                                        {user.role === 'teacher' && (
                                            <button
                                                onClick={() => setEditingUser(user)}
                                                className="p-2 rounded-lg text-purple-500 hover:bg-purple-50 transition-colors"
                                                title="Chỉnh sửa hồ sơ"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        )}
                                        {user.role !== 'admin' && (
                                            <button
                                                onClick={() => handleDeleteUser(user.uid)}
                                                className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                                title="Xóa"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </GlassCard>
            </div>

            {/* Create User Modal - Custom for better scroll control */}
            {showCreateModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
                    onClick={() => setShowCreateModal(false)}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg"
                        style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
                            <h2 className="text-xl font-bold text-gray-800">Thêm tài khoản mới</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        {/* Scrollable Content */}
                        <div className="p-6 overflow-y-auto" style={{ flex: 1 }}>
                            <CreateUserForm
                                onSubmit={handleCreateUser}
                                onCancel={() => setShowCreateModal(false)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Teacher Profile Modal */}
            <GlassModal
                isOpen={!!editingUser}
                onClose={() => setEditingUser(null)}
                title="Chỉnh sửa hồ sơ giáo viên"
                maxWidth="max-w-2xl"
            >
                {editingUser && (
                    <TeacherProfileEditForm
                        teacher={editingUser}
                        onSubmit={async (updates) => {
                            const result = await updateUser(editingUser.uid, updates);
                            if (result.success) {
                                setMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' });
                                loadUsers();
                                setEditingUser(null);
                            } else {
                                setMessage({ type: 'error', text: 'Có lỗi xảy ra!' });
                            }
                        }}
                        onCancel={() => setEditingUser(null)}
                    />
                )}
            </GlassModal>
        </MainLayout>
    );
};

// Create User Form Component
const CreateUserForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        displayName: '',
        role: 'student',
        specialties: [],
        bio: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleSpecialty = (specialty) => {
        setFormData(prev => ({
            ...prev,
            specialties: prev.specialties.includes(specialty)
                ? prev.specialties.filter(s => s !== specialty)
                : [...prev.specialties, specialty]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await onSubmit(formData);
        setIsSubmitting(false);
    };

    const availableSpecialties = Object.keys(specialtyTags);

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="glass-input"
                    placeholder="email@example.com"
                    required
                />
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="glass-input"
                    placeholder="Ít nhất 6 ký tự"
                    minLength={6}
                    required
                />
            </div>

            {/* Display Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên hiển thị</label>
                <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="glass-input"
                    placeholder="Nguyễn Văn A"
                    required
                />
            </div>

            {/* Role */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
                <div className="flex gap-3">
                    {['student', 'teacher', 'admin'].map(role => (
                        <label
                            key={role}
                            className={`flex-1 p-3 rounded-xl border-2 cursor-pointer text-center transition-all ${formData.role === role
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <input
                                type="radio"
                                name="role"
                                value={role}
                                checked={formData.role === role}
                                onChange={handleChange}
                                className="sr-only"
                            />
                            <span className={`font-medium ${formData.role === role ? 'text-purple-700' : 'text-gray-600'
                                }`}>
                                {role === 'student' ? 'Học sinh' : role === 'teacher' ? 'Giáo viên' : 'Admin'}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Teacher-specific fields */}
            {formData.role === 'teacher' && (
                <>
                    {/* Specialties */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên môn</label>
                        <div className="flex flex-wrap gap-2">
                            {availableSpecialties.map(specialty => (
                                <button
                                    key={specialty}
                                    type="button"
                                    onClick={() => toggleSpecialty(specialty)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${formData.specialties.includes(specialty)
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {specialtyTags[specialty].icon} {specialty}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Giới thiệu</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className="glass-input min-h-[80px] resize-none"
                            placeholder="Giới thiệu ngắn về giáo viên..."
                        />
                    </div>
                </>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 glass-button"
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Tạo tài khoản
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

// Teacher Profile Edit Form Component
const TeacherProfileEditForm = ({ teacher, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        avatar: teacher.avatar || '',
        displayName: teacher.displayName || '',
        specialties: teacher.specialties || [],
        bio: teacher.bio || '',
        experience: teacher.experience || 0
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewAvatar, setPreviewAvatar] = useState(teacher.avatar || '');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleSpecialty = (specialty) => {
        setFormData(prev => ({
            ...prev,
            specialties: prev.specialties.includes(specialty)
                ? prev.specialties.filter(s => s !== specialty)
                : [...prev.specialties, specialty]
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewAvatar(reader.result);
                setFormData(prev => ({ ...prev, avatar: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await onSubmit(formData);
        setIsSubmitting(false);
    };

    const availableSpecialties = Object.keys(specialtyTags);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    {previewAvatar ? (
                        <img
                            src={previewAvatar}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full object-cover border-4 border-purple-200"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                            {teacher.displayName?.charAt(0) || 'T'}
                        </div>
                    )}
                    <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-colors shadow-lg">
                        <Edit className="w-4 h-4" />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                    </label>
                </div>
                <p className="text-sm text-gray-500">Nhấn vào biểu tượng để đổi ảnh đại diện</p>
            </div>

            {/* Display Name */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tên hiển thị</label>
                <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    required
                />
            </div>

            {/* Experience */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Số năm kinh nghiệm</label>
                <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    min="0"
                    max="50"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
            </div>

            {/* Specialties */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Chuyên môn tư vấn</label>
                <div className="flex flex-wrap gap-2">
                    {availableSpecialties.map(specialty => (
                        <button
                            key={specialty}
                            type="button"
                            onClick={() => toggleSpecialty(specialty)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.specialties.includes(specialty)
                                ? 'bg-purple-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {specialtyTags[specialty]?.icon} {specialty}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bio */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Giới thiệu bản thân</label>
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 resize-none"
                    placeholder="Mô tả ngắn về bản thân, kinh nghiệm tư vấn, phong cách làm việc..."
                />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Lưu thay đổi
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default AdminDashboard;
