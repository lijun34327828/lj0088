/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        serif: ['"ZCOOL XiaoWei"', '"Noto Serif SC"', 'Georgia', 'serif'],
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'pulse-violation': {
          '0%,100%': { boxShadow: '0 0 0 3px rgba(194,59,34,0.25)' },
          '50%': { boxShadow: '0 0 0 6px rgba(194,59,34,0.55)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '70%': { opacity: '1', transform: 'scale(1.04)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'star-pop': {
          '0%': { opacity: '0', transform: 'scale(0.2) rotate(-30deg)' },
          '60%': { opacity: '1', transform: 'scale(1.2) rotate(10deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
        'confetti-fall': {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: '0' },
        },
        'bounce-in': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '60%': { transform: 'translateY(-6px)', opacity: '1' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'pulse-violation': 'pulse-violation 1.1s ease-in-out infinite',
        'fade-in': 'fade-in 0.35s ease-out',
        'pop-in': 'pop-in 0.45s cubic-bezier(.2,.8,.2,1)',
        'star-pop': 'star-pop 0.7s cubic-bezier(.2,.8,.2,1) both',
        'bounce-in': 'bounce-in 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};
