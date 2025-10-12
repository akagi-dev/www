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
        handle: 'na-classics',
        variantIds: {
          '3h': 'gid://shopify/ProductVariant/VARIANT_ID_1',
          'fullday': 'gid://shopify/ProductVariant/VARIANT_ID_2'
        }
      },
      'v6-power': {
        id: 'gid://shopify/Product/PRODUCT_ID_2',
        handle: 'v6-power',
        variantIds: {
          '3h': 'gid://shopify/ProductVariant/VARIANT_ID_3',
          'fullday': 'gid://shopify/ProductVariant/VARIANT_ID_4'
        }
      },
      'turbo-legends': {
        id: 'gid://shopify/Product/PRODUCT_ID_3',
        handle: 'turbo-legends',
        variantIds: {
          '3h': 'gid://shopify/ProductVariant/VARIANT_ID_5',
          'fullday': 'gid://shopify/ProductVariant/VARIANT_ID_6'
        }
      }
    },
    tracks: {
      'chiba': {
        id: 'gid://shopify/Product/PRODUCT_ID_CHIBA',
        handle: 'chiba'
      },
      'gunma': {
        id: 'gid://shopify/Product/PRODUCT_ID_GUNMA',
        handle: 'gunma'
      },
      'fuji': {
        id: 'gid://shopify/Product/PRODUCT_ID_FUJI',
        handle: 'fuji'
      }
    }
  }
};

/**
 * Mock product data for fallback (when Shopify API is not configured)
 */
export const MOCK_PRODUCT_DATA = {
  carClasses: {
    'en': [
      {
        id: 'gid://shopify/Product/PRODUCT_ID_1',
        handle: 'na-classics',
        title: 'Naturally Aspirated Classics',
        description: 'S14 or 180SX',
        price: '45000',
        currencyCode: 'JPY',
        imageUrl: '/placeholder-car.svg'
      },
      {
        id: 'gid://shopify/Product/PRODUCT_ID_2',
        handle: 'v6-power',
        title: 'Powerful V6',
        description: '350Z',
        price: '60000',
        currencyCode: 'JPY',
        imageUrl: '/placeholder-car.svg'
      },
      {
        id: 'gid://shopify/Product/PRODUCT_ID_3',
        handle: 'turbo-legends',
        title: 'Turbo Legends',
        description: 'Turbo S14',
        price: '75000',
        currencyCode: 'JPY',
        imageUrl: '/placeholder-car.svg'
      }
    ],
    'ja': [
      {
        id: 'gid://shopify/Product/PRODUCT_ID_1',
        handle: 'na-classics',
        title: '自然吸気クラシック',
        description: 'S14または180SX',
        price: '45000',
        currencyCode: 'JPY',
        imageUrl: '/placeholder-car.svg'
      },
      {
        id: 'gid://shopify/Product/PRODUCT_ID_2',
        handle: 'v6-power',
        title: 'パワフルV6',
        description: '350Z',
        price: '60000',
        currencyCode: 'JPY',
        imageUrl: '/placeholder-car.svg'
      },
      {
        id: 'gid://shopify/Product/PRODUCT_ID_3',
        handle: 'turbo-legends',
        title: 'ターボレジェンド',
        description: 'ターボS14',
        price: '75000',
        currencyCode: 'JPY',
        imageUrl: '/placeholder-car.svg'
      }
    ],
    'ru': [
      {
        id: 'gid://shopify/Product/PRODUCT_ID_1',
        handle: 'na-classics',
        title: 'Атмосферная классика',
        description: 'S14 или 180SX',
        price: '45000',
        currencyCode: 'JPY',
        imageUrl: '/placeholder-car.svg'
      },
      {
        id: 'gid://shopify/Product/PRODUCT_ID_2',
        handle: 'v6-power',
        title: 'Мощный V6',
        description: '350Z',
        price: '60000',
        currencyCode: 'JPY',
        imageUrl: '/placeholder-car.svg'
      },
      {
        id: 'gid://shopify/Product/PRODUCT_ID_3',
        handle: 'turbo-legends',
        title: 'Турбо легенды',
        description: 'Турбо S14',
        price: '75000',
        currencyCode: 'JPY',
        imageUrl: '/placeholder-car.svg'
      }
    ]
  },
  tracks: {
    'en': [
      {
        id: 'gid://shopify/Product/PRODUCT_ID_CHIBA',
        handle: 'chiba',
        title: 'Chiba Speedway',
        description: 'Technical layout perfect for skill development',
        price: '24000',
        currencyCode: 'JPY',
        imageUrl: '/placeholder-track.svg'
      },
      {
        id: 'gid://shopify/Product/PRODUCT_ID_GUNMA',
        handle: 'gunma',
        title: 'Gunma Cycle Sports',
        description: 'Challenging course with elevation changes',
        price: '30000',
        currencyCode: 'JPY',
        imageUrl: '/placeholder-track.svg'
      },
      {
        id: 'gid://shopify/Product/PRODUCT_ID_FUJI',
        handle: 'fuji',
        title: 'Fuji Speedway',
        description: 'Iconic professional racing venue',
        price: '45000',
        currencyCode: 'JPY',
        imageUrl: '/placeholder-track.svg'
      }
    ],
    'ja': [
      {
        id: 'gid://shopify/Product/PRODUCT_ID_CHIBA',
        handle: 'chiba',
        title: '千葉スピードウェイ',
        description: 'スキル向上に最適なテクニカルレイアウト',
        price: '24000',
        currencyCode: 'JPY',
        imageUrl: '/placeholder-track.svg'
      },
      {
        id: 'gid://shopify/Product/PRODUCT_ID_GUNMA',
        handle: 'gunma',
        title: '群馬サイクルスポーツ',
        description: '高低差のある挑戦的なコース',
        price: '30000',
        currencyCode: 'JPY',
        imageUrl: '/placeholder-track.svg'
      },
      {
        id: 'gid://shopify/Product/PRODUCT_ID_FUJI',
        handle: 'fuji',
        title: '富士スピードウェイ',
        description: '伝説的なプロレーシング会場',
        price: '45000',
        currencyCode: 'JPY',
        imageUrl: '/placeholder-track.svg'
      }
    ],
    'ru': [
      {
        id: 'gid://shopify/Product/PRODUCT_ID_CHIBA',
        handle: 'chiba',
        title: 'Чиба Спидвей',
        description: 'Технический трек для развития навыков',
        price: '24000',
        currencyCode: 'JPY',
        imageUrl: '/placeholder-track.svg'
      },
      {
        id: 'gid://shopify/Product/PRODUCT_ID_GUNMA',
        handle: 'gunma',
        title: 'Гунма Сайкл Спортс',
        description: 'Сложная трасса с перепадом высот',
        price: '30000',
        currencyCode: 'JPY',
        imageUrl: '/placeholder-track.svg'
      },
      {
        id: 'gid://shopify/Product/PRODUCT_ID_FUJI',
        handle: 'fuji',
        title: 'Фудзи Спидвей',
        description: 'Легендарная профессиональная трасса',
        price: '45000',
        currencyCode: 'JPY',
        imageUrl: '/placeholder-track.svg'
      }
    ]
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
