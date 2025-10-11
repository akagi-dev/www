# Akagi Engineering Portal

[![Deploy to GitHub Pages](https://github.com/akagi-dev/www/actions/workflows/deploy.yml/badge.svg)](https://github.com/akagi-dev/www/actions/workflows/deploy.yml)

Official website for Akagi Engineering - Japanese car service specializing in JDM drift cars and D1GP motorsport.

## 🏎️ About

Akagi Engineering is a premier Japanese car service center specializing in JDM (Japanese Domestic Market) vehicles and motorsport. We provide exceptional service and expertise for drift car enthusiasts.

- **D1 Lights License** - Currently competing in D1 Lights series
- **D1GP Aspirations** - Working towards D1 Grand Prix series
- **Track Services** - Drift car rental at Chiba, Gunma, and Fuji Speedway

## 🌐 Languages

The site is available in three languages:
- 🇬🇧 English (default)
- 🇯🇵 Japanese (日本語)
- 🇷🇺 Russian (Русский)

## 🛠️ Tech Stack

- **[Astro](https://astro.build)** - Static Site Generator
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **Custom i18n** - Multi-language support

## 🚀 Development

### Prerequisites

- Node.js 20 or higher
- npm

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The site will be available at `http://localhost:4321/www`

### Available Languages

- English: `http://localhost:4321/www/en/`
- Japanese: `http://localhost:4321/www/ja/`
- Russian: `http://localhost:4321/www/ru/`

## 📁 Project Structure

```
/
├── public/              # Static assets
│   └── favicon.svg
├── src/
│   ├── i18n/           # Internationalization
│   │   └── ui.ts       # Translation strings
│   ├── layouts/        # Page layouts
│   │   └── Layout.astro
│   └── pages/          # Page components
│       ├── en/         # English pages
│       ├── ja/         # Japanese pages
│       └── ru/         # Russian pages
├── astro.config.mjs    # Astro configuration
├── tailwind.config.mjs # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## 🎨 Design

- **Color Scheme**: Professional black, red, and gray
- **Mobile-First**: Responsive design with hamburger menu
- **Accessibility**: Semantic HTML and ARIA labels
- **Performance**: Optimized static builds

## 🚢 Deployment

The site is automatically deployed to GitHub Pages on every push to `main`:

- **Production URL**: https://akagi-dev.github.io/www
- **PR Previews**: Live preview deployments via GitHub Pages for each PR

### PR Preview Workflow

When you open or update a pull request:
1. ✅ GitHub Actions automatically builds the site with PR-specific configuration
2. 🌐 Deploys to a dedicated orphan branch `preview/pr-{number}`
3. 📱 Creates live preview URLs accessible via GitHub Pages
4. 💬 Posts/updates a comment on the PR with:
   - Direct preview links for all languages (English, Japanese, Russian)
   - Easy mobile testing with shareable URLs
   - Build metadata (commit SHA, timestamp, branch)
   - Quick access links for different pages

The preview workflow includes:
- **Live Previews** - Test changes directly in browser without downloading
- **Multi-language Support** - Preview all language versions
- **Mobile-Friendly** - Share preview links for mobile device testing
- **Automated Comments** - Clear preview links updated on each commit
- **Smart Updates** - Comments are updated on new commits (no spam)
- **Auto Cleanup** - Preview branches automatically deleted when PR closes
- **Error Handling** - Graceful failure with detailed logs

#### Preview URL Format:
- Base: `https://akagi-dev.github.io/www/pr-{number}/`
- English: `https://akagi-dev.github.io/www/pr-{number}/en/`
- Japanese: `https://akagi-dev.github.io/www/pr-{number}/ja/`
- Russian: `https://akagi-dev.github.io/www/pr-{number}/ru/`

For more details, see [`.github/workflows/README.md`](.github/workflows/README.md)

## 📝 License

© 2025 Akagi Engineering. All rights reserved.
