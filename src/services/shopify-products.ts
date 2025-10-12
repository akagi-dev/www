/**
 * Shopify Products Service
 * Handles fetching and caching of product data from Shopify Storefront API
 */

import { SHOPIFY_CONFIG, MOCK_PRODUCT_DATA } from '@config/shopify.config';

export interface ProductPrice {
  amount: string;
  currencyCode: string;
}

export interface ProductImage {
  url: string;
  altText?: string;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  priceRange: {
    minVariantPrice: ProductPrice;
  };
  images: {
    edges: Array<{
      node: ProductImage;
    }>;
  };
  translations?: Array<{
    key: string;
    value: string;
    locale: string;
  }>;
}

export interface ProductData {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: string;
  currencyCode: string;
  imageUrl: string;
  imageAlt: string;
}

const CACHE_KEY_PREFIX = 'shopify_products_';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

/**
 * GraphQL query for fetching products
 */
const PRODUCTS_QUERY = `
  query getProducts($ids: [ID!]!) @inContext(language: $language) {
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
        translations(locale: $locale) {
          key
          value
        }
      }
    }
  }
`;

/**
 * Cache management
 */
class ProductCache {
  private getItem(key: string): any | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > CACHE_DURATION) {
        localStorage.removeItem(key);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Cache read error:', error);
      return null;
    }
  }

  private setItem(key: string, data: any): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Cache write error:', error);
    }
  }

  get(productIds: string[], locale: string): ProductData[] | null {
    const key = `${CACHE_KEY_PREFIX}${locale}_${productIds.sort().join('_')}`;
    return this.getItem(key);
  }

  set(productIds: string[], locale: string, data: ProductData[]): void {
    const key = `${CACHE_KEY_PREFIX}${locale}_${productIds.sort().join('_')}`;
    this.setItem(key, data);
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(CACHE_KEY_PREFIX))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
}

const cache = new ProductCache();

/**
 * Formats price based on locale
 */
export function formatPrice(amount: string, currencyCode: string, locale: string): string {
  const numAmount = parseFloat(amount);
  
  const localeMap: Record<string, string> = {
    'en': 'en-US',
    'ja': 'ja-JP',
    'ru': 'ru-RU'
  };
  
  const browserLocale = localeMap[locale] || 'en-US';
  
  try {
    return new Intl.NumberFormat(browserLocale, {
      style: 'currency',
      currency: currencyCode
    }).format(numAmount);
  } catch (error) {
    return `${currencyCode} ${numAmount.toLocaleString(browserLocale)}`;
  }
}

/**
 * Converts raw product data to ProductData format
 */
function transformProduct(product: Product, locale: string): ProductData {
  const imageNode = product.images?.edges?.[0]?.node;
  const price = product.priceRange?.minVariantPrice;
  
  return {
    id: product.id,
    handle: product.handle,
    title: product.title || 'Untitled Product',
    description: product.description || '',
    price: formatPrice(price?.amount || '0', price?.currencyCode || 'JPY', locale),
    currencyCode: price?.currencyCode || 'JPY',
    imageUrl: imageNode?.url || '/placeholder-product.jpg',
    imageAlt: imageNode?.altText || product.title || 'Product image'
  };
}

/**
 * Fetches products from Shopify Storefront API
 */
export async function fetchProducts(productIds: string[], locale: string = 'en'): Promise<ProductData[]> {
  const cached = cache.get(productIds, locale);
  if (cached) {
    console.log('Returning cached products');
    return cached;
  }

  const { storeDomain, storefrontAccessToken, graphqlEndpoint } = SHOPIFY_CONFIG;
  
  // Check if Shopify is configured, otherwise use mock data
  if (storeDomain === 'your-store.myshopify.com' || storefrontAccessToken === 'your-storefront-access-token') {
    console.warn('Shopify not configured, using mock data');
    return getMockProducts(productIds, locale);
  }
  
  const languageMap: Record<string, string> = {
    'en': 'EN',
    'ja': 'JA',
    'ru': 'RU'
  };
  
  const language = languageMap[locale] || 'EN';
  
  try {
    const response = await fetch(graphqlEndpoint(storeDomain), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken
      },
      body: JSON.stringify({
        query: PRODUCTS_QUERY,
        variables: {
          ids: productIds,
          language,
          locale: locale.toUpperCase()
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    const products: Product[] = result.data?.nodes || [];
    const transformedProducts = products
      .filter(p => p && p.id)
      .map(p => transformProduct(p, locale));
    
    cache.set(productIds, locale, transformedProducts);
    
    return transformedProducts;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return getMockProducts(productIds, locale);
  }
}

/**
 * Gets mock product data based on product IDs
 */
function getMockProducts(productIds: string[], locale: string): ProductData[] {
  const carProducts = MOCK_PRODUCT_DATA.carClasses[locale as keyof typeof MOCK_PRODUCT_DATA.carClasses] || MOCK_PRODUCT_DATA.carClasses.en;
  const trackProducts = MOCK_PRODUCT_DATA.tracks[locale as keyof typeof MOCK_PRODUCT_DATA.tracks] || MOCK_PRODUCT_DATA.tracks.en;
  
  const allMockProducts = [...carProducts, ...trackProducts];
  
  return productIds
    .map(id => {
      const product = allMockProducts.find(p => p.id === id);
      if (product) {
        return {
          ...product,
          price: formatPrice(product.price, product.currencyCode, locale),
          imageAlt: product.title
        };
      }
      return null;
    })
    .filter((p): p is ProductData => p !== null);
}

/**
 * Fetches car class products
 */
export async function fetchCarProducts(locale: string = 'en'): Promise<ProductData[]> {
  const productIds = Object.values(SHOPIFY_CONFIG.productMapping.carClasses)
    .map(car => car.id);
  
  return fetchProducts(productIds, locale);
}

/**
 * Fetches track products
 */
export async function fetchTrackProducts(locale: string = 'en'): Promise<ProductData[]> {
  const productIds = Object.values(SHOPIFY_CONFIG.productMapping.tracks).map(track => track.id);
  
  return fetchProducts(productIds, locale);
}

/**
 * Clears all cached product data
 */
export function clearProductCache(): void {
  cache.clear();
}
