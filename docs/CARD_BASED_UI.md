# Card-Based Product Selection UI

This document describes the card-based product selection interface implemented for the booking pages.

## Overview

The booking pages now feature a modern, visual card-based UI for selecting cars and tracks instead of traditional dropdown menus. This provides a better user experience, especially on mobile devices, and allows for richer product information display.

## Features

### 1. Visual Product Cards
- **Product Images**: Each car and track is displayed with an image
- **Product Names**: Localized product names for EN/JA/RU
- **Pricing**: Live pricing data fetched from Shopify Storefront API
- **Selection Highlighting**: Visual feedback when a card is selected

### 2. Responsive Grid Layout
- **Desktop**: 3 columns for optimal viewing
- **Tablet**: 2 columns for medium screens
- **Mobile**: 1 column for small screens
- **Hover Effects**: Cards scale and show shadow on hover

### 3. Shopify Integration
- **Dynamic Data Loading**: Product information loaded from Shopify Storefront API
- **Client-Side Caching**: Cached for 1 hour to improve performance
- **Fallback Data**: Mock data used when Shopify is not configured
- **Localization**: Automatic language detection and currency formatting

## Components

### ProductCard.astro
A reusable component that renders a single product card.

**Props:**
- `id`: Product ID
- `title`: Product name
- `price`: Formatted price string
- `imageUrl`: URL to product image
- `imageAlt`: Alt text for image
- `selected`: Boolean for selection state
- `dataHandle`: Product handle for selection

**Usage:**
```astro
<ProductCard
  id="product-123"
  title="Nissan S14"
  price="¥45,000"
  imageUrl="/images/s14.jpg"
  imageAlt="Nissan S14 drift car"
  selected={false}
  dataHandle="na-classics"
/>
```

### ProductGrid.astro
A container component that displays a grid of product cards.

**Props:**
- `id`: Grid container ID
- `label`: Label text
- `required`: Whether selection is required
- `locale`: Current language (en/ja/ru)
- `collectionHandle`: Shopify collection handle (e.g., 'drift-cars', 'drift-tracks')

**Usage:**
```astro
<ProductGrid 
  id="carClass" 
  label="Choose a Car Class"
  required={true}
  locale="en"
  collectionHandle="drift-cars"
/>
```

```astro
<ProductGrid 
  id="track" 
  label="Choose Track"
  required={true}
  locale="en"
  collectionHandle="drift-tracks"
/>
```

> **Note**: For more information about the universal collections system, see [COLLECTIONS_SYSTEM.md](./COLLECTIONS_SYSTEM.md)

## Service Layer

### shopify-products.ts
Service for fetching and caching product data from Shopify Storefront API.

**Key Functions:**
- `fetchCollectionProducts(collectionHandle, locale, maxProducts)` - Universal collection fetcher

**Key Functions:**

#### `fetchProducts(productIds: string[], locale: string): Promise<ProductData[]>`
Fetches products by ID with caching.

#### `fetchCarProducts(locale: string): Promise<ProductData[]>`
Fetches all car class products.

#### `fetchTrackProducts(locale: string): Promise<ProductData[]>`
Fetches all track products.

#### `formatPrice(amount: string, currencyCode: string, locale: string): string`
Formats price based on locale and currency.

#### `clearProductCache(): void`
Clears all cached product data.

**Caching:**
- Duration: 1 hour
- Storage: localStorage
- Key format: `shopify_products_{locale}_{productIds}`

## Mock Data

When Shopify is not configured, the system uses mock product data from `MOCK_PRODUCT_DATA` in `shopify.config.ts`.

**Structure:**
```typescript
export const MOCK_PRODUCT_DATA = {
  carClasses: {
    'en': [...],
    'ja': [...],
    'ru': [...]
  },
  tracks: {
    'en': [...],
    'ja': [...],
    'ru': [...]
  }
};
```

Each product includes:
- `id`: Shopify product ID
- `handle`: URL-safe identifier
- `title`: Localized product name
- `description`: Product description
- `price`: Base price (unformatted)
- `currencyCode`: Currency code (JPY)
- `imageUrl`: Path to product image

## Localization

### Supported Languages
- **English (en)**: Default language
- **Japanese (ja)**: Full translation support
- **Russian (ru)**: Full translation support

### Price Formatting
Prices are automatically formatted based on locale:
- **EN**: Uses en-US locale formatting
- **JA**: Uses ja-JP locale formatting  
- **RU**: Uses ru-RU locale formatting

Example:
```javascript
formatPrice('45000', 'JPY', 'en') // ¥45,000
formatPrice('45000', 'JPY', 'ja') // ¥45,000
formatPrice('45000', 'JPY', 'ru') // 45 000 ¥
```

## User Interaction Flow

1. **Page Load**
   - Product grids show loading indicators
   - Service fetches product data from Shopify or cache
   - Cards are dynamically created and displayed

2. **Product Selection**
   - User clicks on a product card
   - Card visual state updates (border color, background, checkmark icon)
   - Other cards in the same grid are deselected
   - Hidden input is updated with product handle
   - Calendar updates to show availability

3. **Form Submission**
   - Form validates that car and track are selected
   - Selected product handles are included in booking data
   - Data is sent to Shopify checkout

## Styling

### Tailwind Classes Used
- **Container**: `product-grid-container`
- **Grid**: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`
- **Card**: `cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200`
- **Selected State**: `border-akagi-red bg-akagi-light-blue bg-opacity-10 shadow-md`
- **Hover State**: `hover:shadow-lg hover:scale-105 hover:border-akagi-orange`

### Custom Styles
```css
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

## Placeholder Images

Default placeholder images are provided:
- `/placeholder-car.svg`: Generic car illustration
- `/placeholder-track.svg`: Generic track illustration
- `/placeholder-product.jpg`: Generic product placeholder

These are used when:
- Shopify product has no image
- Product data fails to load
- Using mock data without configured images

## Testing

### Component Tests
The booking components are tested with `validate-booking-components.mjs`.

**Tests Include:**
- ProductGrid container rendering
- Car class grid element presence
- Track grid element presence
- Hidden input fields for both selections
- Loading indicators
- JavaScript bundle inclusion
- Form structure validation
- Dropdown replacement verification

**Run Tests:**
```bash
npm run build
node tests/run-all-tests.mjs
```

## Configuration

### Shopify Configuration
Update `src/config/shopify.config.ts` with your Shopify credentials:

```typescript
export const SHOPIFY_CONFIG = {
  storeDomain: 'your-store.myshopify.com',
  storefrontAccessToken: 'your-access-token',
  apiVersion: '2024-01',
  // ...
};
```

### Product Mapping
Map your Shopify product IDs in the config:

```typescript
productMapping: {
  carClasses: {
    'na-classics': {
      id: 'gid://shopify/Product/YOUR_PRODUCT_ID',
      handle: 'na-classics',
      variantIds: { /* ... */ }
    },
    // ...
  },
  tracks: {
    'chiba': {
      id: 'gid://shopify/Product/YOUR_TRACK_ID',
      handle: 'chiba'
    },
    // ...
  }
}
```

## Performance Considerations

### Caching Strategy
- Products cached client-side for 1 hour
- Reduces API calls to Shopify
- Improves page load time for returning users

### Image Loading
- Lazy loading enabled with `loading="lazy"`
- Placeholder images optimized as SVG
- Aspect ratio maintained to prevent layout shift

### Bundle Size
- Service code bundled with Vite
- Total booking page JavaScript: ~78KB (21KB gzipped)
- Minimal overhead for card functionality

## Accessibility

- **Keyboard Navigation**: Cards are focusable and clickable
- **Screen Readers**: Proper alt text for images
- **Visual Feedback**: Clear selection states
- **Labels**: Descriptive labels for all form inputs
- **Required Fields**: Clearly marked with asterisk

## Browser Compatibility

The card-based UI works on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

**Required Features:**
- ES6 JavaScript
- CSS Grid
- LocalStorage
- Fetch API

## Migration from Dropdowns

The old dropdown-based selection has been completely replaced. If you need to revert:

1. Restore the old booking page files from git history
2. Remove ProductGrid components
3. Update form submission logic

However, the new card-based UI provides a significantly better user experience and should be retained.

## Future Enhancements

Potential improvements:
- Add product variant selection (time slots on cards)
- Implement filtering and sorting
- Add product comparison feature
- Show real-time availability on cards
- Add product reviews/ratings
- Implement image galleries for products
- Add "favorite" functionality
- Support for promotional pricing

## Troubleshooting

### Products Not Loading
1. Check browser console for errors
2. Verify Shopify configuration
3. Check network tab for API requests
4. Ensure Storefront API access token is valid

### Cards Not Displaying
1. Verify build completed successfully
2. Check that JavaScript bundle is loaded
3. Inspect HTML for ProductGrid containers
4. Check for CSS conflicts

### Selection Not Working
1. Verify hidden inputs exist with correct IDs
2. Check event listeners are attached
3. Look for JavaScript errors in console
4. Ensure product handles match config

## Support

For issues related to:
- **Shopify API**: See SHOPIFY_INTEGRATION.md
- **Localization**: Check src/i18n/ui.ts
- **Testing**: Run validation tests
- **Styling**: Review Tailwind configuration

## Credits

Built with:
- Astro
- TypeScript
- Tailwind CSS
- Shopify Storefront API
