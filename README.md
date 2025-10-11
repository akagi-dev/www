# Akagi Engineering Portal

[![Deploy to GitHub Pages](https://github.com/akagi-dev/www/actions/workflows/deploy.yml/badge.svg)](https://github.com/akagi-dev/www/actions/workflows/deploy.yml)

Official website for Akagi Engineering - Japanese car service specializing in JDM drift cars and D1GP motorsport.

## 🏎️ About

Akagi Engineering is a premier Japanese car service center specializing in JDM (Japanese Domestic Market) vehicles and motorsport. We provide exceptional service and expertise for drift car enthusiasts.

- **D1 Lights License** - Currently competing in D1 Lights series
- **D1GP Aspirations** - Working towards D1 Grand Prix series
- **Drift Car Rental** - Professional JDM drift cars at Chiba, Gunma, and Fuji Speedway

## 🌐 Dual Portal Architecture

The site features two integrated portals:

### Corporate Portal (`/en/`, `/ja/`, `/ru/`)
- Company information and history
- Motorsport achievements (D1 Lights, D1GP)
- Service offerings overview
- Contact information

### Drift Rental Portal (`/drift/en/`, `/drift/ja/`, `/drift/ru/`)
- JDM drift car fleet (AE86, S13, S14)
- Track details (Chiba, Gunma, Fuji Speedway)
- Transparent pricing
- Online booking system
- FAQ and driver requirements

## 🌐 Languages

Both portals are available in three languages:
- 🇬🇧 English (default)
- 🇯🇵 Japanese (日本語)
- 🇷🇺 Russian (Русский)

## 🛠️ Tech Stack

- **[Astro](https://astro.build)** - Static Site Generator
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **Custom i18n** - Multi-language support with portal detection

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

### Local Development URLs

In development (with base path `/www`):
- Corporate Portal:
  - English: `http://localhost:4321/www/en/`
  - Japanese: `http://localhost:4321/www/ja/`
  - Russian: `http://localhost:4321/www/ru/`

- Drift Rental Portal:
  - English: `http://localhost:4321/www/drift/en/`
  - Japanese: `http://localhost:4321/www/drift/ja/`
  - Russian: `http://localhost:4321/www/drift/ru/`

## 📁 Project Structure

```
/
├── public/                 # Static assets
│   └── favicon.svg
├── src/
│   ├── components/        # Reusable components
│   │   ├── common/        # Shared components (Layout, Header, Footer)
│   │   ├── corporate/     # Corporate portal specific components
│   │   └── drift/         # Drift portal specific components
│   ├── i18n/              # Internationalization
│   │   └── ui.ts          # Translation strings for both portals
│   ├── layouts/           # Page layouts (exports common Layout)
│   │   └── Layout.astro
│   └── pages/             # Page components
│       ├── en/            # Corporate portal - English
│       ├── ja/            # Corporate portal - Japanese
│       ├── ru/            # Corporate portal - Russian
│       └── drift/         # Drift rental portal
│           ├── en/        # Drift portal - English
│           ├── ja/        # Drift portal - Japanese
│           └── ru/        # Drift portal - Russian
├── astro.config.mjs       # Astro configuration with custom domain support
├── tailwind.config.mjs    # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 🎨 Design

- **Color Scheme**: Professional black, red, and gray
- **Mobile-First**: Responsive design with hamburger menu
- **Portal Switching**: Easy navigation between corporate and drift portals
- **Accessibility**: Semantic HTML and ARIA labels
- **Performance**: Optimized static builds

## 🚢 Deployment

The site is automatically deployed on every push to `main`:

- **Production URL**: https://www.akagi.dev (custom domain)
- **GitHub Pages Fallback**: https://akagi-dev.github.io/www
- **PR Previews**: Live preview deployments via GitHub Pages for each PR

### Production Deployment

The main branch deploys to:
- Corporate Portal: `https://www.akagi.dev/en/`, `/ja/`, `/ru/`
- Drift Portal: `https://www.akagi.dev/drift/en/`, `/drift/ja/`, `/drift/ru/`

### PR Preview Workflow

When you open or update a pull request:
1. ✅ GitHub Actions automatically builds the site with PR-specific configuration
2. 🌐 Deploys to a dedicated orphan branch `preview/pr-{number}`
3. 📱 Creates live preview URLs accessible via GitHub Pages
4. 💬 Posts/updates a comment on the PR with:
   - Direct preview links for both portals and all languages
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
- Corporate Portal:
  - English: `https://akagi-dev.github.io/www/pr-{number}/en/`
  - Japanese: `https://akagi-dev.github.io/www/pr-{number}/ja/`
  - Russian: `https://akagi-dev.github.io/www/pr-{number}/ru/`
- Drift Rental Portal:
  - English: `https://akagi-dev.github.io/www/pr-{number}/drift/en/`
  - Japanese: `https://akagi-dev.github.io/www/pr-{number}/drift/ja/`
  - Russian: `https://akagi-dev.github.io/www/pr-{number}/drift/ru/`

For more details, see [`.github/workflows/README.md`](.github/workflows/README.md)

## 📝 License

© 2025 Akagi Engineering. All rights reserved.
