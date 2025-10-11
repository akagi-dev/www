/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Akagi Engineering Brand Palette
        'akagi-navy': '#1a2332',        // Primary Dark Navy - header, navigation, primary buttons
        'akagi-charcoal': '#2d2d2d',    // Charcoal Black - text, secondary elements
        'akagi-teal': '#1e5f74',        // Deep Teal - accent elements, links
        'akagi-light-blue': '#7fb3d3',  // Light Blue - secondary buttons, highlights
        'akagi-red': '#d73027',         // Red Orange - call-to-action buttons, important alerts
        'akagi-orange': '#ff6600',      // Bright Orange - hover states, active elements
        // Legacy colors (kept for backwards compatibility during transition)
        'akagi-black': '#0A0A0A',
        'akagi-gray': '#1F2937',
      },
    },
  },
  plugins: [],
}
