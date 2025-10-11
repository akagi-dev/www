# Akagi Engineering Portal

[![Deploy to GitHub Pages](https://github.com/akagi-dev/www/actions/workflows/deploy.yml/badge.svg)](https://github.com/akagi-dev/www/actions/workflows/deploy.yml)
[![PR Preview](https://github.com/akagi-dev/www/actions/workflows/pr-preview.yml/badge.svg)](https://github.com/akagi-dev/www/actions/workflows/pr-preview.yml)

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

### Production

The site is automatically deployed to GitHub Pages on every push to `main`:

- **Production URL**: https://akagi-dev.github.io/www

### PR Previews

Every pull request automatically gets a live preview deployment for easy testing:

- **Preview URL**: `https://pr-{number}-akagi-www.surge.sh`
- **Auto Deployment**: Triggered on PR open, update, or reopen
- **Auto Cleanup**: Removed when PR is closed or merged
- **Multi-Language Support**: All language variants available in preview
- **Mobile Testing**: QR codes provided for easy mobile device testing

Preview deployments include:
- 🇬🇧 English: `/en/`
- 🇯🇵 Japanese: `/ja/`
- 🇷🇺 Russian: `/ru/`

Each PR receives an automated comment with:
- Direct links to all language variants
- QR codes for mobile testing
- Links to all available pages
- Build artifact download option (backup)

### Environment Configuration

The build system automatically adjusts for different environments:
- **Production**: Uses `/www` base path for GitHub Pages
- **PR Preview**: Uses `/` root path for Surge.sh deployments

## 📝 License

© 2025 Akagi Engineering. All rights reserved.
