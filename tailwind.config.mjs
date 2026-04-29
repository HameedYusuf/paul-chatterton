/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg:        '#0d0d0d',
        surface:   '#1a1a1a',
        accent:    '#22c55e',
        'accent-dk': '#15803d',
        muted:     '#a3a3a3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1100px',
      },
    },
  },
  plugins: [],
};
