import React from 'react';
import { X } from 'lucide-react';

// Glass Card Component
export const GlassCard = ({ children, className = '', hover = true, padding = 'p-6' }) => {
    return (
        <div
            className={`glass-card ${padding} ${hover ? 'cursor-pointer' : ''} ${className}`}
        >
            {children}
        </div>
    );
};

// Glass Modal Component
export const GlassModal = ({ isOpen, onClose, children, title, maxWidth = 'max-w-lg' }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className={`modal-content ${maxWidth} max-h-[90vh] flex flex-col`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                {title && (
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
                        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                )}

                {/* Modal Content - Scrollable */}
                <div className="p-6 overflow-y-auto flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
};

export { default as MainLayout } from './MainLayout';
export { default as Navbar } from './Navbar';
