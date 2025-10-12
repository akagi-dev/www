# Universal Collections System

## Overview

The universal collections system provides a flexible, scalable way to fetch and display products from Shopify collections. This replaces the hardcoded `car` and `track` product types with a collection-based approach that can easily support new product categories.

## Key Improvements

### 1. Removed Unsupported `translations` Field

**Problem**: Shopify Storefront API does not support the `translations` field in GraphQL queries.

**Solution**: Use `@inContext(language: $language)` directive for localization instead.

**Before:**
```graphql
query getProducts($ids: [ID!]!) @inContext(language: $language) {
  nodes(ids: $ids) {
    # ...
    translations(locale: $locale) {  # ❌ Not supported
      key
      value
    }
  }
}
```

**After:**
```graphql
query getProducts($ids: [ID!]!, $language: LanguageCode!) @inContext(language: $language) {
  nodes(ids: $ids) {
    # ... ✅ Localized fields via @inContext
    title        # Already localized
    description  # Already localized
  }
}
```

### 2. Universal Collection Service

**New Function**: `fetchCollectionProducts(collectionHandle, locale, maxProducts)`

This universal function can fetch products from any Shopify collection by handle.

```typescript
// Fetch products from any collection
const carProducts = await fetchCollectionProducts('drift-cars', 'en');
const trackProducts = await fetchCollectionProducts('drift-tracks', 'en');
const equipmentProducts = await fetchCollectionProducts('drift-equipment', 'en');
```

### 3. Backward Compatibility

Existing functions continue to work but are deprecated:

```typescript
// ✅ Still works (uses collections internally)
const cars = await fetchCarProducts('en');
const tracks = await fetchTrackProducts('en');

// ✅ New recommended approach
const cars = await fetchCollectionProducts('drift-cars', 'en');
const tracks = await fetchCollectionProducts('drift-tracks', 'en');
```

## Configuration

### Collection Handles

Update `src/config/shopify.config.ts` to configure collection handles:

```typescript
export const SHOPIFY_CONFIG = {
  // ... other config
  
  // Collection handles for different product types
  collections: {
    cars: 'drift-cars',         // Collection handle for car products
    tracks: 'drift-tracks',     // Collection handle for track products
    equipment: 'drift-equipment' // Future: equipment collection
  },
  
  // Legacy product mapping (still supported)
  productMapping: {
    carClasses: { /* ... */ },
    tracks: { /* ... */ }
  }
};
```

### Creating Collections in Shopify

1. **Log in to Shopify Admin**
2. Go to **Products** > **Collections**
3. Click **Create collection**
4. Set collection details:
   - **Title**: "Drift Cars" (or "ドリフト車" for Japanese)
   - **Handle**: `drift-cars` (must match config)
   - **Type**: Manual or Automated
5. Add products to the collection
6. Repeat for other collections (tracks, equipment, etc.)

## Component Usage

### ProductGrid Component

The `ProductGrid` component now supports both legacy and collection-based modes:

#### Legacy Mode (Backward Compatible)

```astro
<ProductGrid 
  id="carClass" 
  label="Choose a Car Class"
  required={true}
  locale={locale}
  productType="car"  <!-- Legacy: mapped to 'drift-cars' -->
/>
```

#### Collection Mode (Recommended)

```astro
<ProductGrid 
  id="equipment" 
  label="Choose Equipment"
  required={false}
  locale={locale}
  collectionHandle="drift-equipment"  <!-- Direct collection handle -->
/>
```

### Props Reference

```typescript
interface ProductGridProps {
  id: string;                    // Grid container ID
  label: string;                 // Label text
  required?: boolean;            // Whether selection is required
  locale?: string;               // Current language (en/ja/ru)
  
  // Use ONE of the following:
  productType?: 'car' | 'track'; // ⚠️ Deprecated: Legacy mode
  collectionHandle?: string;     // ✅ Recommended: Collection handle
}
```

## API Reference

### `fetchCollectionProducts(collectionHandle, locale, maxProducts)`

Fetches products from a Shopify collection.

**Parameters:**
- `collectionHandle` (string): Shopify collection handle (e.g., 'drift-cars')
- `locale` (string, optional): Language locale ('en', 'ja', 'ru'). Default: 'en'
- `maxProducts` (number, optional): Maximum products to fetch. Default: 50

**Returns:** `Promise<ProductData[]>`

**Example:**
```typescript
import { fetchCollectionProducts } from '@services/shopify-products';

// Fetch car products in Japanese
const cars = await fetchCollectionProducts('drift-cars', 'ja');

// Fetch up to 20 track products in English
const tracks = await fetchCollectionProducts('drift-tracks', 'en', 20);
```

### `fetchCarProducts(locale)` ⚠️ Deprecated

**Replacement:**
```typescript
// Old way
const cars = await fetchCarProducts('en');

// New way
const cars = await fetchCollectionProducts('drift-cars', 'en');
```

### `fetchTrackProducts(locale)` ⚠️ Deprecated

**Replacement:**
```typescript
// Old way
const tracks = await fetchTrackProducts('en');

// New way
const tracks = await fetchCollectionProducts('drift-tracks', 'en');
```

## GraphQL Queries

### Products by Collection Query

```graphql
query getCollectionProducts($handle: String!, $language: LanguageCode!, $first: Int!) 
  @inContext(language: $language) {
  collection(handle: $handle) {
    id
    handle
    title
    products(first: $first) {
      edges {
        node {
          id
          handle
          title           # Localized via @inContext
          description     # Localized via @inContext
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
}
```

### Products by IDs Query (Legacy)

```graphql
query getProducts($ids: [ID!]!, $language: LanguageCode!) 
  @inContext(language: $language) {
  nodes(ids: $ids) {
    ... on Product {
      id
      handle
      title
      description
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 1) {
        edges {
          node {
            url
            altText
          }
        }
      }
    }
  }
}
```

## Mock Data

When Shopify is not configured, the system automatically falls back to mock data:

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
  // Add more collections as needed
};
```

The `fetchCollectionProducts` function automatically maps collection handles to mock data types:
- `drift-cars` or `cars` → `MOCK_PRODUCT_DATA.carClasses`
- `drift-tracks` or `tracks` → `MOCK_PRODUCT_DATA.tracks`

## Migration Guide

### Step 1: Update Configuration

Add collection handles to your config:

```typescript
// src/config/shopify.config.ts
export const SHOPIFY_CONFIG = {
  collections: {
    cars: 'drift-cars',
    tracks: 'drift-tracks',
    equipment: 'drift-equipment'  // New!
  }
};
```

### Step 2: Create Collections in Shopify

1. Create collections with matching handles
2. Add products to each collection
3. Verify products appear in the Shopify admin

### Step 3: Update Components (Optional)

For new features, use `collectionHandle` instead of `productType`:

```astro
<!-- Old approach (still works) -->
<ProductGrid productType="car" ... />

<!-- New approach (recommended) -->
<ProductGrid collectionHandle="drift-cars" ... />
```

### Step 4: Update Code (Optional)

Replace deprecated function calls:

```typescript
// Before
import { fetchCarProducts, fetchTrackProducts } from '@services/shopify-products';
const cars = await fetchCarProducts(locale);
const tracks = await fetchTrackProducts(locale);

// After
import { fetchCollectionProducts } from '@services/shopify-products';
const cars = await fetchCollectionProducts('drift-cars', locale);
const tracks = await fetchCollectionProducts('drift-tracks', locale);
```

## Benefits

### 1. **Flexibility**
- Easily add new product types without code changes
- Collections managed in Shopify admin

### 2. **Scalability**
- Support unlimited product categories
- No hardcoded product types

### 3. **Maintainability**
- Single universal function for all collections
- Consistent API across product types

### 4. **Performance**
- Same caching mechanism
- Efficient GraphQL queries
- Automatic fallback to mock data

### 5. **Compatibility**
- Fully backward compatible
- Gradual migration path
- No breaking changes

## Best Practices

1. **Use Collection Handles**: Prefer `collectionHandle` over `productType` for new features
2. **Consistent Naming**: Use clear, descriptive collection handles (e.g., `drift-equipment`, not `eq`)
3. **Cache Management**: Products are cached per collection for 1 hour
4. **Error Handling**: System automatically falls back to mock data on errors
5. **Localization**: Always use `@inContext(language)` for proper localization

## Troubleshooting

### Collection Not Found

**Error:** Collection returns empty or null

**Solutions:**
1. Verify collection handle matches Shopify exactly
2. Check collection is published and not hidden
3. Ensure collection has products
4. Verify Storefront API has access to collection

### Products Not Localized

**Issue:** Products display in wrong language

**Solutions:**
1. Ensure `@inContext(language: $language)` is in query
2. Verify language code is uppercase (EN, JA, RU)
3. Check product translations exist in Shopify
4. Confirm locale is passed correctly to function

### Mock Data Always Used

**Issue:** System always uses mock data even when configured

**Solutions:**
1. Check `storeDomain` is not default value
2. Verify `storefrontAccessToken` is valid
3. Ensure Shopify credentials are set correctly
4. Check network connectivity to Shopify API

## Future Enhancements

- [ ] Collection metadata (title, description) in UI
- [ ] Collection-level filtering and sorting
- [ ] Pagination for large collections
- [ ] Collection search functionality
- [ ] Admin UI for collection management
- [ ] Analytics per collection
- [ ] A/B testing different collection layouts

## Related Documentation

- [CARD_BASED_UI.md](./CARD_BASED_UI.md) - Card-based product selection UI
- [SHOPIFY_INTEGRATION.md](./SHOPIFY_INTEGRATION.md) - Shopify integration guide
- [CARD_IMPLEMENTATION_SUMMARY.md](./CARD_IMPLEMENTATION_SUMMARY.md) - Implementation summary
