import React from 'react';

const GlassCard = ({
    children,
    className = '',
    hover = true,
    padding = 'p-6',
    as: Component = 'div',
    ...props
}) => {
    return (
        <Component
            className={`
        glass rounded-2xl ${padding}
        ${hover ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-lg' : ''}
        ${className}
      `}
            {...props}
        >
            {children}
        </Component>
    );
};

export const GlassCardStrong = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`glass-strong rounded-2xl p-6 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export const GlassModal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div
            className="modal-backdrop"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="modal-content max-h-[90vh] overflow-y-auto">
                {title && (
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/20">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl hover:bg-white/20 transition-all"
                        >
                            ✕
                        </button>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
};

export default GlassCard;
