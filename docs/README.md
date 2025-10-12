# Akagi Drift Booking System - Documentation

Welcome to the documentation for the Akagi Drift Booking System. This folder contains comprehensive guides for developers and administrators.

## 📚 Documentation Index

### Core Features

- **[COLLECTIONS_SYSTEM.md](./COLLECTIONS_SYSTEM.md)** - 🆕 Universal collections system for flexible product management
  - GraphQL query updates (removed unsupported `translations` field)
  - Collection-based product fetching
  - Migration guide from legacy approach
  - API reference and best practices

- **[CARD_BASED_UI.md](./CARD_BASED_UI.md)** - Card-based product selection interface
  - ProductCard and ProductGrid components
  - Responsive design and styling
  - Client-side interaction
  - Mock data structure

- **[SHOPIFY_INTEGRATION.md](./SHOPIFY_INTEGRATION.md)** - Shopify Storefront API integration
  - Setup instructions
  - Product configuration
  - Checkout flow
  - API credentials
  - Troubleshooting

### Implementation Details

- **[CARD_IMPLEMENTATION_SUMMARY.md](./CARD_IMPLEMENTATION_SUMMARY.md)** - Implementation summary
  - Problem statement addressed
  - Technical architecture
  - Performance metrics
  - Testing coverage

- **[CARD_VISUALIZATION.md](./CARD_VISUALIZATION.md)** - Visual design guide
  - UI mockups and wireframes
  - Component hierarchy
  - User flow diagrams

### Development

- **[PR_PREVIEW.md](./PR_PREVIEW.md)** - Pull request preview system
  - Automated deployments
  - Preview environments

## 🚀 Quick Start Guides

### For Developers

1. **Setting up the booking system**: Start with [SHOPIFY_INTEGRATION.md](./SHOPIFY_INTEGRATION.md)
2. **Understanding the UI components**: Read [CARD_BASED_UI.md](./CARD_BASED_UI.md)
3. **Using the collections system**: See [COLLECTIONS_SYSTEM.md](./COLLECTIONS_SYSTEM.md)

### For Product Managers

1. **Adding new product types**: [COLLECTIONS_SYSTEM.md](./COLLECTIONS_SYSTEM.md) - Migration Guide
2. **Configuring products**: [SHOPIFY_INTEGRATION.md](./SHOPIFY_INTEGRATION.md) - Product Setup
3. **Understanding the user experience**: [CARD_VISUALIZATION.md](./CARD_VISUALIZATION.md)

## 🆕 Recent Updates

### Universal Collections System (Latest)

The booking system now uses a universal collections approach:

- ✅ **Removed unsupported GraphQL fields**: No more `translations` field errors
- ✅ **Flexible product management**: Add new product types via Shopify collections
- ✅ **Backward compatible**: Existing code continues to work
- ✅ **Better localization**: Using `@inContext(language)` directive

See [COLLECTIONS_SYSTEM.md](./COLLECTIONS_SYSTEM.md) for complete details.

## 📖 Common Topics

### Product Management

- **Adding car classes**: Use `fetchCollectionProducts('drift-cars', locale)`
- **Adding tracks**: Use `fetchCollectionProducts('drift-tracks', locale)`
- **Adding equipment**: Create collection and use `fetchCollectionProducts('drift-equipment', locale)`

### Localization

All documentation covers EN/JA/RU language support:
- GraphQL queries use `@inContext(language)` for automatic localization
- Mock data available for all languages
- Currency formatting based on locale

### Testing

- Test files located in `/tests` directory
- Run all tests: `npm run build && node tests/run-all-tests.mjs`
- Booking components validation included

## 🔗 Related Resources

- [Shopify Storefront API Documentation](https://shopify.dev/api/storefront)
- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🛠️ Technical Stack

- **Frontend Framework**: Astro 5.x
- **Styling**: Tailwind CSS 3.x
- **API**: Shopify Storefront API 2024-01
- **Languages**: TypeScript, Astro components
- **Testing**: Custom test suite

## 📝 Contributing

When updating documentation:
1. Keep examples up-to-date with actual code
2. Include TypeScript type definitions where relevant
3. Add both legacy and new approaches where applicable
4. Update this README if adding new documentation files

## ⚠️ Important Notes

- Always use environment variables for Shopify credentials
- Never commit API tokens to the repository
- Test thoroughly in all three languages (EN/JA/RU)
- Ensure mobile responsiveness for all changes

## 🤝 Support

For questions or issues:
1. Check the relevant documentation first
2. Search existing issues in the repository
3. Open a new issue with detailed information
4. Include error messages and steps to reproduce

---

**Last Updated**: October 2025  
**Version**: 2.0 (Universal Collections System)
