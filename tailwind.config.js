/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-expo)', 'ExpoArabic', 'sans-serif'],
      },
      colors: {
        // الألوان الأساسية - CleanLife Brand
        primary: {
          DEFAULT: '#09b9b5',
          light: '#effefa',
          hover: '#08a5a1',
        },
        // الألوان الثانوية
        secondary: '#f9fafb',
        gray: {
          text: '#4d647c',
          light: '#617c96',
        },
        // ألوان الحالات
        success: {
          DEFAULT: '#00a287',
          light: '#effefa',
        },
        warning: {
          DEFAULT: '#f57c00',
          light: '#fff3e0',
        },
        error: {
          DEFAULT: '#d32f2f',
          light: '#ffebee',
          dark: '#c63c3c',
        },
        info: {
          DEFAULT: '#1976d2',
          light: '#e3f2fd',
          blue: '#0084df',
        },
        purple: {
          DEFAULT: '#7b1fa2',
          light: '#f3e5f5',
        },
      },
      screens: {
        'xs': '480px',
      },
      borderRadius: {
        'md': '0.375rem',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
      },
    },
  },
  plugins: [],
};
