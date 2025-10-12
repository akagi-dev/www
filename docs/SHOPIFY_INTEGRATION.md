# Shopify Integration Guide

This guide explains how to integrate the booking system with Shopify's Storefront API for payment processing.

## Overview

The booking system now supports Shopify integration for secure checkout and payment processing. The integration allows customers to:

1. Select a car class, track, time slot, and date
2. Fill in personal information
3. Be redirected to Shopify checkout for secure payment
4. Receive booking confirmation

## Setup Instructions

### 1. Create a Shopify Store

If you don't have a Shopify store yet:

1. Go to [Shopify](https://www.shopify.com)
2. Create a new store
3. Complete the initial setup

### 2. Create a Custom App

1. In your Shopify admin, go to **Settings** > **Apps and sales channels**
2. Click **Develop apps**
3. Click **Create an app**
4. Name it "Drift Booking Integration"
5. Click **Create app**

### 3. Configure API Scopes

1. Click **Configure Storefront API scopes**
2. Enable the following scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
3. Click **Save**

### 4. Get Your API Credentials

1. Click **Install app**
2. Copy the **Storefront API access token** - you'll need this
3. Your store domain is in the format: `your-store.myshopify.com`

### 5. Create Products in Shopify

You need to create products for each car class and track combination:

#### Car Class Products

Create three main products:

1. **Naturally Aspirated Classics**
   - Price: ¥45,000 for 3h session
   - Create a variant for "Full Day" at ¥90,000
   - Add product images
   - Set inventory policy

2. **Powerful V6 (350Z)**
   - Price: ¥60,000 for 3h session
   - Create a variant for "Full Day" at ¥120,000
   - Add product images
   - Set inventory policy

3. **Turbo Legends (Turbo S14)**
   - Price: ¥75,000 for 3h session
   - Create a variant for "Full Day" at ¥150,000
   - Add product images
   - Set inventory policy

#### Track Fee Products (Optional)

If you want to charge track fees separately:

1. **Chiba Speedway** - ¥24,000/3h
2. **Gunma Cycle Sports** - ¥30,000/3h
3. **Fuji Speedway** - ¥45,000/3h

### 6. Update Configuration File

Edit `/src/config/shopify.config.ts`:

```typescript
export const SHOPIFY_CONFIG = {
  storeDomain: 'your-actual-store.myshopify.com', // Update this
  storefrontAccessToken: 'your-actual-token-here', // Update this
  apiVersion: '2024-01',
  
  productMapping: {
    carClasses: {
      'na-classics': {
        id: 'gid://shopify/Product/YOUR_PRODUCT_ID',
        variantIds: {
          '3h': 'gid://shopify/ProductVariant/YOUR_VARIANT_ID',
          'fullday': 'gid://shopify/ProductVariant/YOUR_FULLDAY_VARIANT_ID'
        }
      },
      // ... update other car classes
    }
  }
};
```

To find your product and variant IDs:

1. Go to your Shopify admin
2. Navigate to Products
3. Click on a product
4. Look at the URL - the number at the end is your product ID
5. Click on a variant to get its ID

Alternatively, use the Shopify GraphQL Admin API to query:

```graphql
{
  products(first: 10) {
    edges {
      node {
        id
        title
        variants(first: 10) {
          edges {
            node {
              id
              title
              price
            }
          }
        }
      }
    }
  }
}
```

### 7. Environment Variables (Recommended for Production)

Instead of hardcoding credentials, use environment variables:

Create a `.env` file:

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token-here
```

The config file already supports this via `import.meta.env`.

### 8. Test the Integration

1. Build the site: `npm run build`
2. Start the preview server: `npm run preview`
3. Navigate to the booking page
4. Select a car class and track
5. Select a date from the calendar
6. Fill in personal information
7. Click "Proceed to Checkout"

In development, you'll see a mock alert. In production with valid credentials, users will be redirected to Shopify checkout.

## Availability Management

Currently, the calendar uses mock availability data. For production, you should:

1. Create an availability management system/database
2. Update the `fetchAvailability` function in `/src/config/shopify.config.ts`
3. Connect to your booking calendar or management system
4. Consider using:
   - A headless CMS (Contentful, Sanity)
   - A custom API
   - Shopify metafields
   - A third-party booking system

Example API integration:

```typescript
export async function fetchAvailability(
  carClass: string,
  track: string,
  month: number,
  year: number
): Promise<number[]> {
  const response = await fetch(`https://your-api.com/availability`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ carClass, track, month, year })
  });
  
  const data = await response.json();
  return data.availableDays;
}
```

## Webhooks (Optional)

Set up Shopify webhooks to handle order confirmations:

1. In Shopify admin, go to **Settings** > **Notifications**
2. Scroll to **Webhooks**
3. Create webhooks for:
   - `orders/create` - Send booking confirmation email
   - `orders/cancelled` - Handle cancellations
   - `orders/paid` - Confirm payment received

## Custom Attributes

The booking data is passed to Shopify as custom attributes:

- `Date` - Selected booking date
- `Time Slot` - Morning/Afternoon/Full Day
- `Track` - Selected track
- `Name` - Customer name
- `Email` - Customer email
- `Phone` - Customer phone
- `License` - Driver's license number

These appear in the Shopify order details and can be used for fulfillment.

## Security Considerations

1. **Never commit API tokens** - Use environment variables
2. **Enable HTTPS** - Required for Shopify checkout
3. **Validate data** - Sanitize all user inputs
4. **Rate limiting** - Implement if using custom availability API
5. **CORS** - Configure properly for API calls

## Testing Checklist

- [ ] Car class selection works
- [ ] Track selection works
- [ ] Time slot selection works
- [ ] Calendar displays correctly
- [ ] Calendar shows different availability for different car/track combos
- [ ] Date selection works
- [ ] Form validation works
- [ ] Shopify checkout redirect works
- [ ] Order appears in Shopify admin
- [ ] Custom attributes are populated
- [ ] Confirmation email is sent (if configured)
- [ ] Mobile responsive design works
- [ ] All three languages work (EN/JA/RU)

## Troubleshooting

### Calendar not showing
- Check browser console for JavaScript errors
- Verify car class and track are both selected
- Check that `updateCalendar()` function is being called

### Shopify redirect not working
- Verify API credentials are correct
- Check that products and variants exist in Shopify
- Ensure product IDs in config match your Shopify products
- Check browser console for API errors
- Verify CORS settings if getting network errors

### Form submission errors
- Check that all required fields are filled
- Verify date is selected from calendar
- Check browser console for validation errors

## Support

For issues with:
- **Shopify setup**: [Shopify Help Center](https://help.shopify.com)
- **API integration**: [Shopify Storefront API docs](https://shopify.dev/api/storefront)
- **This codebase**: Open an issue in the repository

## Next Steps

1. Complete Shopify store setup
2. Create all products
3. Update configuration with real IDs
4. Set up availability management
5. Configure webhooks
6. Test thoroughly
7. Deploy to production
8. Monitor orders and bookings
