import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  // Use environment-specific site URL for PR previews
  site: process.env.PREVIEW_URL || 'https://akagi-dev.github.io',
  // Use root path for PR previews, /www for production
  base: process.env.PREVIEW_URL ? '/' : '/www',
});
