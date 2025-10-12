/**
 * Shopify Storefront API Configuration
 * 
 * This file contains the configuration for integrating with Shopify's Storefront API
 * for the drift car booking system.
 * 
 * Setup Instructions:
 * 1. Create a custom app in your Shopify admin panel
 * 2. Enable Storefront API access
 * 3. Generate a Storefront API access token
 * 4. Create products for each car class and time slot combination
 * 5. Update the configuration below with your actual values
 * 
 * Environment Variables (recommended for production):
 * - SHOPIFY_STORE_DOMAIN: Your Shopify store domain (e.g., 'your-store.myshopify.com')
 * - SHOPIFY_STOREFRONT_ACCESS_TOKEN: Your Storefront API access token
 */

export const SHOPIFY_CONFIG = {
  // Shopify store configuration
  storeDomain: import.meta.env.SHOPIFY_STORE_DOMAIN || 'your-store.myshopify.com',
  storefrontAccessToken: import.meta.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'your-storefront-access-token',
  apiVersion: '2024-01',
  
  // API endpoints
  graphqlEndpoint: (domain: string) => `https://${domain}/api/2024-01/graphql.json`,
  
  // Product mapping for car classes (to be updated with actual Shopify product IDs)
  productMapping: {
    carClasses: {
      'na-classics': {
        id: 'gid://shopify/Product/PRODUCT_ID_1',
        variantIds: {
          '3h': 'gid://shopify/ProductVariant/VARIANT_ID_1',
          'fullday': 'gid://shopify/ProductVariant/VARIANT_ID_2'
        }
      },
      'v6-power': {
        id: 'gid://shopify/Product/PRODUCT_ID_2',
        variantIds: {
          '3h': 'gid://shopify/ProductVariant/VARIANT_ID_3',
          'fullday': 'gid://shopify/ProductVariant/VARIANT_ID_4'
        }
      },
      'turbo-legends': {
        id: 'gid://shopify/Product/PRODUCT_ID_3',
        variantIds: {
          '3h': 'gid://shopify/ProductVariant/VARIANT_ID_5',
          'fullday': 'gid://shopify/ProductVariant/VARIANT_ID_6'
        }
      }
    },
    tracks: {
      'chiba': 'gid://shopify/Product/PRODUCT_ID_CHIBA',
      'gunma': 'gid://shopify/Product/PRODUCT_ID_GUNMA',
      'fuji': 'gid://shopify/Product/PRODUCT_ID_FUJI'
    }
  }
};

/**
 * Booking data structure for API calls
 */
export interface BookingData {
  carClass: 'na-classics' | 'v6-power' | 'turbo-legends';
  track: 'chiba' | 'gunma' | 'fuji';
  timeSlot: 'morning' | 'afternoon' | 'fullday';
  selectedDate: string; // ISO date format (YYYY-MM-DD)
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    license: string;
  };
  addOns?: {
    instruction?: boolean;
    photoVideo?: boolean;
    tires?: boolean;
  };
  experience?: 'beginner' | 'intermediate' | 'advanced';
  comments?: string;
}

/**
 * Creates a Shopify checkout with the booking data
 * 
 * @param bookingData - The booking information
 * @returns Checkout URL to redirect the user to
 */
export async function createShopifyCheckout(bookingData: BookingData): Promise<string> {
  const { storeDomain, storefrontAccessToken, graphqlEndpoint } = SHOPIFY_CONFIG;
  
  // Build line items for the checkout
  const lineItems = [];
  
  // Add car class product
  const carClassVariant = SHOPIFY_CONFIG.productMapping.carClasses[bookingData.carClass].variantIds[
    bookingData.timeSlot === 'fullday' ? 'fullday' : '3h'
  ];
  
  lineItems.push({
    variantId: carClassVariant,
    quantity: 1,
    customAttributes: [
      { key: 'Date', value: bookingData.selectedDate },
      { key: 'Time Slot', value: bookingData.timeSlot },
      { key: 'Track', value: bookingData.track },
      { key: 'Name', value: bookingData.personalInfo.name },
      { key: 'Email', value: bookingData.personalInfo.email },
      { key: 'Phone', value: bookingData.personalInfo.phone },
      { key: 'License', value: bookingData.personalInfo.license }
    ]
  });
  
  // GraphQL mutation to create checkout
  const mutation = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `;
  
  const variables = {
    input: {
      lineItems: lineItems
    }
  };
  
  try {
    const response = await fetch(graphqlEndpoint(storeDomain), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken
      },
      body: JSON.stringify({ query: mutation, variables })
    });
    
    const data = await response.json();
    
    if (data.data?.checkoutCreate?.checkout?.webUrl) {
      return data.data.checkoutCreate.checkout.webUrl;
    } else {
      throw new Error('Failed to create checkout: ' + JSON.stringify(data.data?.checkoutCreate?.checkoutUserErrors));
    }
  } catch (error) {
    console.error('Shopify checkout error:', error);
    throw error;
  }
}

/**
 * Fetches availability data from an external API
 * In production, this would connect to your booking management system
 * 
 * @param carClass - Selected car class
 * @param track - Selected track
 * @param month - Month to check (0-11)
 * @param year - Year to check
 * @returns Array of available day numbers
 */
export async function fetchAvailability(
  carClass: string,
  track: string,
  month: number,
  year: number
): Promise<number[]> {
  // TODO: Implement actual API call to availability service
  // For now, return mock data
  
  // Mock availability data
  const mockData: Record<string, Record<string, number[]>> = {
    'na-classics': { 
      chiba: [1, 5, 8, 12, 15, 19, 22, 26, 29], 
      gunma: [2, 6, 9, 13, 16, 20, 23, 27, 30], 
      fuji: [3, 7, 10, 14, 17, 21, 24, 28] 
    },
    'v6-power': { 
      chiba: [2, 6, 9, 13, 16, 20, 23, 27, 30], 
      gunma: [1, 5, 8, 12, 15, 19, 22, 26, 29], 
      fuji: [4, 8, 11, 15, 18, 22, 25, 29] 
    },
    'turbo-legends': { 
      chiba: [3, 7, 10, 14, 17, 21, 24, 28], 
      gunma: [4, 8, 11, 15, 18, 22, 25, 29], 
      fuji: [1, 5, 8, 12, 15, 19, 22, 26, 29] 
    }
  };
  
  return mockData[carClass]?.[track] || [];
}
