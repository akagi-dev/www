/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'akagi-red': '#DC2626',
        'akagi-black': '#0A0A0A',
        'akagi-gray': '#1F2937',
      },
    },
  },
  plugins: [],
}
