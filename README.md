# Akagi Engineering Dual-Portal Website

[![Deploy to GitHub Pages](https://github.com/akagi-dev/www/actions/workflows/deploy.yml/badge.svg)](https://github.com/akagi-dev/www/actions/workflows/deploy.yml)

Official website for Akagi Engineering featuring dual portals: corporate site and drift car rental service.

## 🚗 Dual-Portal Architecture

This monorepo hosts two integrated portals sharing common code, layouts, and i18n:

### **Corporate Portal** (`www.akagi.dev`)
- Company information and motorsport activities
- D1 Lights License and D1GP aspirations
- Professional services and competition updates
- **Pages**: About, Services, Competitions, Contact

### **Drift Rental Portal** (`drift.akagi.dev`)
- JDM drift car rental service
- Track information and booking system
- Pricing packages and FAQs
- **Pages**: Fleet, Tracks, Pricing, Booking, FAQ

Both portals feature:
- **Portal Switcher** - Easy navigation between corporate and drift sites
- **Multi-language Support** - EN, JA, RU across both portals
- **Shared Components** - Common layouts, header, footer
- **Consistent Branding** - Unified design system

## ✨ Key Features

### Dual-Portal Architecture
- **Single Codebase**: Both portals built from one monorepo
- **Shared i18n**: Unified translation system supporting both portals
- **Common Components**: Reusable layouts and UI elements
- **Portal-Aware Routing**: Smart navigation based on current portal
- **Cross-Portal Links**: Footer links to easily switch between portals

### Corporate Portal Features
- Company history and motorsport achievements
- D1 Lights and D1GP competition information
- Professional services showcase
- Contact information and location

### Drift Rental Portal Features
- **Car Fleet**: Detailed JDM drift car showcase (AE86, S13, S14)
- **Track Information**: Chiba, Gunma, Fuji Speedway details
- **Pricing Packages**: Half-day, full-day, weekend options
- **Booking System**: Online rental request form
- **Comprehensive FAQ**: Common questions and requirements

### Technical Features
- **SEO Optimized**: Separate meta tags for each portal
- **Mobile Responsive**: Touch-friendly navigation on all devices
- **Language Detection**: Auto-redirect based on browser settings
- **Fast Loading**: Astro static site generation
- **PR Previews**: Both portals previewed on every pull request

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

### Available Portals & Languages

**Corporate Portal:**
- English: `http://localhost:4321/www/www/en/`
- Japanese: `http://localhost:4321/www/www/ja/`
- Russian: `http://localhost:4321/www/www/ru/`

**Drift Rental Portal:**
- English: `http://localhost:4321/www/drift/en/`
- Japanese: `http://localhost:4321/www/drift/ja/`
- Russian: `http://localhost:4321/www/drift/ru/`

## 📁 Project Structure

```
/
├── public/                    # Static assets
│   └── favicon.svg
├── src/
│   ├── components/           # Reusable components
│   │   ├── common/          # Shared between portals
│   │   │   └── Layout.astro # Common layout with portal switcher
│   │   ├── www/             # Corporate-specific components
│   │   └── drift/           # Drift-specific components
│   ├── i18n/                # Internationalization
│   │   └── ui.ts            # Translation strings for both portals
│   ├── layouts/             # Legacy layouts (deprecated)
│   │   └── Layout.astro     
│   └── pages/               # Page components
│       ├── index.astro      # Root redirect to www portal
│       ├── www/             # Corporate portal
│       │   ├── en/          # English pages
│       │   │   ├── index.astro
│       │   │   ├── services.astro
│       │   │   ├── competitions.astro
│       │   │   └── contact.astro
│       │   ├── ja/          # Japanese pages
│       │   └── ru/          # Russian pages
│       └── drift/           # Drift rental portal
│           ├── en/          # English pages
│           │   ├── index.astro
│           │   ├── fleet.astro
│           │   ├── tracks.astro
│           │   ├── pricing.astro
│           │   ├── booking.astro
│           │   └── faq.astro
│           ├── ja/          # Japanese pages
│           └── ru/          # Russian pages
├── astro.config.mjs         # Astro configuration
├── tailwind.config.mjs      # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## 🎨 Design

**Common Design System:**
- **Color Scheme**: Professional navy, teal, red, and orange
- **Mobile-First**: Responsive design with hamburger menu
- **Accessibility**: Semantic HTML and ARIA labels
- **Performance**: Optimized static builds
- **Portal Switcher**: Seamless navigation between corporate and drift sites

**Portal-Specific Styling:**
- **Corporate Portal**: Professional, motorsport-focused
- **Drift Portal**: Action-oriented, booking-focused

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
