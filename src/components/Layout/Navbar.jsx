import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, LayoutDashboard, LogOut, ChevronDown, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, userProfile, isTeacher, isAdmin, logout } = useAuth();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinks = [
        { path: '/', label: 'Trang chủ' },
        { path: '/chat', label: 'Tư vấn' },
        { path: '/confession', label: 'Confession' },
        { path: '/appointment', label: 'Đặt lịch' },
        { path: '/guide', label: 'Hướng dẫn' }
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        navigate('/');
    };

    const handleProfileClick = () => {
        setIsDropdownOpen(false);
        // Navigate based on role
        if (isTeacher && isTeacher()) {
            navigate('/profile/teacher');
        } else {
            navigate('/profile/student');
        }
    };

    const handleDashboardClick = () => {
        setIsDropdownOpen(false);
        navigate('/dashboard');
    };

    const handleAdminClick = () => {
        setIsDropdownOpen(false);
        navigate('/admin');
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'
                }`}
            style={isScrolled ? {
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
            } : {}}
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3">
                        <img src="/icon.svg" alt="S-Net" className="w-10 h-10" />
                        <span
                            className="font-black text-2xl transition-colors duration-300"
                            style={{
                                color: isScrolled ? '#1a1a2e' : 'white',
                                textShadow: isScrolled ? 'none' : '0 3px 12px rgba(0, 0, 0, 0.4), 0 6px 20px rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            S-Net
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`font-bold text-base transition-all duration-300 ${isScrolled
                                    ? isActive(link.path)
                                        ? 'text-purple-600'
                                        : 'text-gray-700 hover:text-purple-600'
                                    : isActive(link.path)
                                        ? 'nav-link-active'
                                        : 'nav-link'
                                    }`}
                                style={!isScrolled ? {
                                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.4), 0 4px 15px rgba(0, 0, 0, 0.3)'
                                } : {}}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side */}
                    <div className="hidden md:flex items-center space-x-5">
                        <button
                            className={`p-2 transition-colors duration-300 ${isScrolled ? 'text-gray-700' : ''
                                }`}
                            style={!isScrolled ? {
                                color: 'white',
                                textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
                            } : {}}
                        >
                            <Search className="w-6 h-6" />
                        </button>

                        {isAuthenticated ? (
                            <div className="relative" ref={dropdownRef}>
                                {/* User Button with Dropdown Trigger */}
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-3 px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer hover:scale-105"
                                    style={{
                                        background: isScrolled
                                            ? 'rgba(102, 126, 234, 0.1)'
                                            : 'rgba(255, 255, 255, 0.3)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                >
                                    {userProfile?.avatar ? (
                                        <img
                                            src={userProfile.avatar}
                                            alt={userProfile?.displayName || 'User'}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-white/50"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold">
                                            {userProfile?.displayName?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                    <span
                                        className="font-bold text-base transition-colors duration-300"
                                        style={{
                                            color: isScrolled ? '#1a1a2e' : 'white',
                                            textShadow: isScrolled ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.3)'
                                        }}
                                    >
                                        {userProfile?.displayName || 'User'}
                                    </span>
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                        style={{ color: isScrolled ? '#1a1a2e' : 'white' }}
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 py-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 animate-fade-in z-50">
                                        {/* Profile Option */}
                                        <button
                                            onClick={handleProfileClick}
                                            className="w-full px-4 py-3 flex items-center gap-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                                        >
                                            <User className="w-5 h-5" />
                                            <span className="font-semibold">Hồ sơ</span>
                                        </button>

                                        {/* Dashboard Option - Only for Teachers */}
                                        {isTeacher && isTeacher() && (
                                            <button
                                                onClick={handleDashboardClick}
                                                className="w-full px-4 py-3 flex items-center gap-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                                            >
                                                <LayoutDashboard className="w-5 h-5" />
                                                <span className="font-semibold">Dashboard</span>
                                            </button>
                                        )}

                                        {/* Admin Panel - Only for Admins */}
                                        {isAdmin && isAdmin() && (
                                            <button
                                                onClick={handleAdminClick}
                                                className="w-full px-4 py-3 flex items-center gap-3 text-orange-600 hover:bg-orange-50 transition-colors"
                                            >
                                                <Shield className="w-5 h-5" />
                                                <span className="font-semibold">Admin Panel</span>
                                            </button>
                                        )}

                                        {/* Divider */}
                                        <div className="my-2 border-t border-gray-100" />

                                        {/* Logout Option */}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-3 flex items-center gap-3 text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            <span className="font-semibold">Đăng xuất</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className={`py-3 px-8 rounded-full font-bold text-base transition-all duration-300 ${isScrolled
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
                                    : 'btn-outline'
                                    }`}
                            >
                                Đăng nhập
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`md:hidden p-2 transition-colors duration-300 ${isScrolled ? 'text-gray-700' : ''
                            }`}
                        style={!isScrolled ? {
                            color: 'white',
                            textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
                        } : {}}
                    >
                        {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 p-5 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl animate-fade-in">
                        <div className="space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-5 py-4 rounded-xl font-bold text-lg transition-all ${isActive(link.path)
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                        : 'text-gray-800 hover:bg-gray-100'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <div className="mt-5 pt-5 border-t border-gray-200 space-y-2">
                            {isAuthenticated ? (
                                <>
                                    {/* Profile */}
                                    <button
                                        onClick={() => { handleProfileClick(); setIsMenuOpen(false); }}
                                        className="w-full px-5 py-4 rounded-xl text-gray-800 bg-gray-50 font-bold text-lg flex items-center gap-3"
                                    >
                                        <User className="w-5 h-5" />
                                        Hồ sơ
                                    </button>

                                    {/* Dashboard - Teachers Only */}
                                    {isTeacher && isTeacher() && (
                                        <button
                                            onClick={() => { handleDashboardClick(); setIsMenuOpen(false); }}
                                            className="w-full px-5 py-4 rounded-xl text-purple-600 bg-purple-50 font-bold text-lg flex items-center gap-3"
                                        >
                                            <LayoutDashboard className="w-5 h-5" />
                                            Dashboard
                                        </button>
                                    )}

                                    {/* Logout */}
                                    <button
                                        onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                        className="w-full px-5 py-4 rounded-xl text-red-600 bg-red-50 font-bold text-lg flex items-center gap-3"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Đăng xuất
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block w-full text-center px-5 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg"
                                >
                                    Đăng nhập
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
