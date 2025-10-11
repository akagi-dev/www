import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Environment-aware configuration for PR previews and custom domain
const isPRPreview = process.env.GITHUB_REF?.includes('preview/pr-');
const prNumber = isPRPreview ? process.env.GITHUB_REF?.match(/pr-(\d+)/)?.[1] : null;

// Use custom domain for production, GitHub Pages for PR previews
const site = isPRPreview ? 'https://akagi-dev.github.io' : 'https://www.akagi.dev';
const base = isPRPreview ? `/www/pr-${prNumber}` : '/';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  site: site,
  base: base,
});
