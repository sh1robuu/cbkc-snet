/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Pastel color palette
                pastel: {
                    blue: '#A8D5E5',
                    'blue-dark': '#7BC4D9',
                    green: '#A8E6CF',
                    'green-dark': '#7DD3B0',
                    lavender: '#D4A5FF',
                    'lavender-dark': '#B87FE8',
                    pink: '#FFD1DC',
                    'pink-dark': '#FFB3C1',
                    yellow: '#FFF3B0',
                    peach: '#FFCBA4',
                },
                // Glass colors
                glass: {
                    white: 'rgba(255, 255, 255, 0.15)',
                    'white-strong': 'rgba(255, 255, 255, 0.25)',
                    border: 'rgba(255, 255, 255, 0.3)',
                    dark: 'rgba(0, 0, 0, 0.1)',
                }
            },
            backgroundImage: {
                'gradient-main': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'gradient-calm': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                'gradient-ocean': 'linear-gradient(135deg, #667eea 0%, #66d3e4 100%)',
                'gradient-sunset': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'gradient-forest': 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                'gradient-night': 'linear-gradient(135deg, #0c0c1e 0%, #1a1a3e 50%, #2d1b4e 100%)',
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'gradient': 'gradient 8s ease infinite',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-down': 'slideDown 0.5s ease-out',
                'fade-in': 'fadeIn 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'bounce-soft': 'bounceSoft 2s infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                bounceSoft: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                'glass-lg': '0 12px 40px 0 rgba(31, 38, 135, 0.2)',
                'glass-inset': 'inset 0 0 20px rgba(255, 255, 255, 0.1)',
                'neon-blue': '0 0 20px rgba(102, 126, 234, 0.5)',
                'neon-purple': '0 0 20px rgba(118, 75, 162, 0.5)',
            },
        },
    },
    plugins: [],
}
