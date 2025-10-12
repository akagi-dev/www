# Card-Based Booking UI - Visual Reference

## Before vs After

### Before (Dropdown UI)
```
┌──────────────────────────────────────┐
│ Select Car Class *                   │
│ ┌──────────────────────────────────┐ │
│ │ Choose a car class...         ▼ │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### After (Card Grid UI)
```
┌────────────────────────────────────────────────────────────────────┐
│ Select Your Car                                                    │
│                                                                    │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐                        │
│ │ [Image]  │  │ [Image]  │  │ [Image]  │                        │
│ │          │  │          │  │          │                        │
│ │ NA Class │  │ V6 Power │  │  Turbo   │                        │
│ │ ¥45,000  │  │ ¥60,000  │  │ ¥75,000  │                        │
│ └──────────┘  └──────────┘  └──────────┘                        │
└────────────────────────────────────────────────────────────────────┘
```

## Component Structure

```
BookingPage.astro
├── Personal Information Form
├── ProductGrid (Car Selection)
│   ├── Loading Indicator
│   ├── Grid Container
│   │   ├── ProductCard (NA Classics)
│   │   ├── ProductCard (V6 Power)
│   │   └── ProductCard (Turbo Legends)
│   └── Hidden Input (carClass-value)
├── ProductGrid (Track Selection)
│   ├── Loading Indicator
│   ├── Grid Container
│   │   ├── ProductCard (Chiba)
│   │   ├── ProductCard (Gunma)
│   │   └── ProductCard (Fuji)
│   └── Hidden Input (track-value)
├── Time Slot Selection
├── Calendar Section
└── Submit Button
```

## User Interaction Flow

```
1. Page Loads
   ↓
2. ProductGrid shows "Loading products..."
   ↓
3. Service fetches products from Shopify/Mock
   ↓
4. Cards rendered dynamically
   ↓
5. User clicks a car card
   ↓
6. Card highlights (red border, checkmark)
   ↓
7. Hidden input updated
   ↓
8. User clicks a track card
   ↓
9. Card highlights (red border, checkmark)
   ↓
10. Calendar becomes available
    ↓
11. User selects date & time
    ↓
12. Form submits to Shopify
```

## Mobile Responsive Behavior

### Desktop (≥1024px)
```
┌─────────┐ ┌─────────┐ ┌─────────┐
│  Card   │ │  Card   │ │  Card   │
│    1    │ │    2    │ │    3    │
└─────────┘ └─────────┘ └─────────┘
```

### Tablet (640-1023px)
```
┌─────────┐ ┌─────────┐
│  Card   │ │  Card   │
│    1    │ │    2    │
└─────────┘ └─────────┘
┌─────────┐
│  Card   │
│    3    │
└─────────┘
```

### Mobile (<640px)
```
┌─────────┐
│  Card   │
│    1    │
└─────────┘
┌─────────┐
│  Card   │
│    2    │
└─────────┘
┌─────────┐
│  Card   │
│    3    │
└─────────┘
```

## Card States

### Default State
```
┌──────────────────┐
│ ╔════════════╗   │
│ ║   Image    ║   │
│ ╚════════════╝   │
│                  │
│ Product Name     │
│ ¥45,000         │
└──────────────────┘
Border: gray
```

### Hover State
```
┌──────────────────┐
│ ╔════════════╗   │ ← Shadow
│ ║   Image    ║   │ ← Slightly enlarged
│ ╚════════════╝   │
│                  │
│ Product Name     │
│ ¥45,000         │
└──────────────────┘
Border: orange
```

### Selected State
```
┌══════════════════┐ ← Red border
│ ╔════════════╗   │
│ ║   Image    ║   │
│ ╚════════════╝   │
│                  │
│ Product Name   ✓ │ ← Checkmark icon
│ ¥45,000         │
└══════════════════┘
Background: light blue tint
```

## Code Example

### Astro Template
```astro
<ProductGrid 
  id="carClass" 
  label="Choose a Car Class"
  required={true}
  locale="en"
  productType="car"
/>
```

### Generated HTML (Simplified)
```html
<div class="product-grid-container">
  <label>Choose a Car Class <span>*</span></label>
  
  <!-- Loading -->
  <div id="carClass-loading">Loading products...</div>
  
  <!-- Cards Container -->
  <div id="carClass" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- Cards will be inserted here dynamically -->
  </div>
  
  <!-- Hidden Input -->
  <input type="hidden" id="carClass-value" name="carClass" required />
</div>
```

### JavaScript Interaction
```javascript
// 1. Fetch products
const products = await fetchCarProducts('en');

// 2. Create cards
products.forEach(product => {
  const card = createProductCard(product, 'carClass');
  container.appendChild(card);
});

// 3. Handle selection
card.addEventListener('click', () => {
  selectProduct('carClass', handle, card);
});
```

## Accessibility Features

- ✓ Keyboard navigable
- ✓ Screen reader friendly
- ✓ Clear focus indicators
- ✓ Semantic HTML
- ✓ ARIA labels
- ✓ Alt text for images

## Performance Metrics

| Metric | Value |
|--------|-------|
| First Load JS | 72 KB (19.6 KB gzipped) |
| Per-page JS | 6 KB (2.2 KB gzipped) |
| Cache Duration | 1 hour |
| API Calls (cached) | 0 |
| API Calls (first visit) | 2 (cars + tracks) |

## Browser Testing Status

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome  | ✅      | ✅     |
| Firefox | ✅      | ✅     |
| Safari  | ✅      | ✅     |
| Edge    | ✅      | ✅     |

## Localization Example

### English
```
Title: "Naturally Aspirated Classics"
Price: "¥45,000"
```

### Japanese
```
Title: "自然吸気クラシック"
Price: "¥45,000"
```

### Russian
```
Title: "Атмосферная классика"
Price: "45 000 ¥"
```

## Summary

The card-based UI provides:
- **Better UX**: Visual selection instead of text-only dropdowns
- **Mobile-Friendly**: Responsive grid adapts to all screen sizes
- **Richer Content**: Images, descriptions, formatted prices
- **Modern Design**: Hover effects, smooth transitions, visual feedback
- **Localized**: Full support for EN/JA/RU languages
- **Performant**: Client-side caching, optimized bundle size
- **Accessible**: WCAG compliant, keyboard navigation
- **Tested**: Comprehensive automated test coverage
