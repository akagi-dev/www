import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Environment-aware configuration for PR previews
const isPRPreview = process.env.GITHUB_REF?.includes('preview/pr-');
const prNumber = isPRPreview ? process.env.GITHUB_REF?.match(/pr-(\d+)/)?.[1] : null;

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  site: 'https://akagi-dev.github.io',
  base: prNumber ? `/www/pr-${prNumber}` : '/www',
});
