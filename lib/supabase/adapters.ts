import { supabase } from './config'
import type { 
  Product, 
  Collection, 
  ProductVariant, 
  ProductOption, 
  Money, 
  Image,
  SEO 
} from '@/lib/shopify/types'

// Adapter för att konvertera Supabase-vin till Shopify Product format
export function adaptWineToProduct(wine: any, variants: any[], images: any[], producer: any): Product {
  const firstImage = images?.[0] || null
  const description = wine.description || ''

  return {
    id: wine.id,
    title: wine.title,
    handle: wine.handle,
    categoryId: wine.category_id,
    description,
    descriptionHtml: wine.description_html || description,
    featuredImage: firstImage ? {
      url: firstImage.url,
      altText: firstImage.alt_text || wine.title,
      height: firstImage.height || 600,
      width: firstImage.width || 600,
      selectedOptions: []
    } : { url: '', altText: '', height: 0, width: 0 },
    currencyCode: wine.currency_code || 'SEK',
    priceRange: {
      minVariantPrice: {
        amount: wine.price_range_min?.toString() || '0',
        currencyCode: wine.currency_code || 'SEK'
      },
      maxVariantPrice: {
        amount: wine.price_range_max?.toString() || '0',
        currencyCode: wine.currency_code || 'SEK'
      }
    },
    seo: {
      title: wine.title,
      description: wine.description || ''
    },
    options: [
      {
        id: 'wine-type',
        name: 'Wine Type',
        values: wine.wine_type ? [{ id: wine.wine_type.toLowerCase(), name: wine.wine_type }] : []
      },
      {
        id: 'vintage',
        name: 'Vintage',
        values: wine.vintage ? [{ id: wine.vintage.toString(), name: wine.vintage.toString() }] : []
      },
      {
        id: 'region',
        name: 'Region',
        values: wine.region ? [{ id: wine.region.toLowerCase(), name: wine.region }] : []
      }
    ],
    tags: [
      wine.wine_type,
      wine.vintage?.toString(),
      wine.region,
      producer?.name,
      ...(wine.grape_varieties || [])
    ].filter(Boolean),
    variants: variants.map(variant => ({
      id: variant.id,
      title: variant.title,
      availableForSale: variant.available_for_sale,
      selectedOptions: [
        { name: 'Size', value: variant.bottle_size },
        { name: 'Price', value: variant.price.toString() }
      ],
      price: {
        amount: variant.price.toString(),
        currencyCode: wine.currency_code || 'SEK'
      }
    })),
    images: images.map((image, index) => ({
      url: image.url,
      altText: image.alt_text || wine.title,
      height: image.height || 600,
      width: image.width || 600,
      selectedOptions: []
    })),
    availableForSale: wine.available_for_sale
  }
}

// Adapter för att konvertera Supabase-collection till Shopify Collection format
export function adaptCollectionToShopify(collection: any): Collection {
  return {
    handle: collection.handle,
    title: collection.title,
    description: collection.description || '',
    seo: {
      title: collection.seo_title || collection.title,
      description: collection.seo_description || collection.description || ''
    },
    parentCategoryTree: [],
    updatedAt: collection.updated_at || new Date().toISOString(),
    path: `/shop/${collection.handle}`
  }
}

// Hämta alla viner med relaterad data
export async function getWines(params: {
  limit?: number
  sortKey?: string
  reverse?: boolean
  query?: string
  collection?: string
} = {}): Promise<Product[]> {
  try {
    let query = supabase
      .from('wines')
      .select(`
        *,
        producer:producers(*),
        variants:wine_variants(*),
        images:wine_images(*)
      `)
      .eq('is_active', true)
      .eq('available_for_sale', true)

    // Filtrera efter collection om specificerat
    if (params.collection) {
      query = query.eq('category_id', params.collection)
    }

    // Sökning
    if (params.query) {
      query = query.or(`title.ilike.%${params.query}%,description.ilike.%${params.query}%`)
    }

    // Sortering
    if (params.sortKey) {
      switch (params.sortKey) {
        case 'PRICE':
          query = params.reverse ? query.order('price_range_min', { ascending: false }) : query.order('price_range_min', { ascending: true })
          break
        case 'TITLE':
          query = params.reverse ? query.order('title', { ascending: false }) : query.order('title', { ascending: true })
          break
        case 'CREATED_AT':
          query = params.reverse ? query.order('created_at', { ascending: false }) : query.order('created_at', { ascending: true })
          break
        default:
          query = query.order('created_at', { ascending: false })
      }
    } else {
      query = query.order('created_at', { ascending: false })
    }

    // Begränsa antal
    if (params.limit) {
      query = query.limit(params.limit)
    }

    const { data: wines, error } = await query

    if (error) {
      console.error('Error fetching wines:', error)
      return []
    }

    // Konvertera till Shopify-format
    return wines.map(wine => adaptWineToProduct(
      wine, 
      wine.variants || [], 
      wine.images || [], 
      wine.producer
    ))
  } catch (error) {
    console.error('Error in getWines:', error)
    return []
  }
}

// Hämta specifikt vin
export async function getWine(handle: string): Promise<Product | null> {
  try {
    const { data: wines, error } = await supabase
      .from('wines')
      .select(`
        *,
        producer:producers(*),
        variants:wine_variants(*),
        images:wine_images(*)
      `)
      .eq('handle', handle)
      .eq('is_active', true)
      .single()

    if (error || !wines) {
      console.error('Error fetching wine:', error)
      return null
    }

    return adaptWineToProduct(
      wines, 
      wines.variants || [], 
      wines.images || [], 
      wines.producer
    )
  } catch (error) {
    console.error('Error in getWine:', error)
    return null
  }
}

// Hämta alla collections
export async function getCollections(): Promise<Collection[]> {
  try {
    const { data: collections, error } = await supabase
      .from('collections')
      .select('*')
      .eq('is_active', true)
      .order('title', { ascending: true })

    if (error) {
      console.error('Error fetching collections:', error)
      return []
    }

    return collections.map(adaptCollectionToShopify)
  } catch (error) {
    console.error('Error in getCollections:', error)
    return []
  }
}

// Hämta specifik collection
export async function getCollection(handle: string): Promise<Collection | null> {
  try {
    const { data: collection, error } = await supabase
      .from('collections')
      .select('*')
      .eq('handle', handle)
      .eq('is_active', true)
      .single()

    if (error || !collection) {
      console.error('Error fetching collection:', error)
      return null
    }

    return adaptCollectionToShopify(collection)
  } catch (error) {
    console.error('Error in getCollection:', error)
    return null
  }
}

// Hämta viner för specifik collection
export async function getCollectionWines(collectionHandle: string, params: {
  limit?: number
  sortKey?: string
  reverse?: boolean
  query?: string
} = {}): Promise<Product[]> {
  try {
    // Hämta collection ID först
    const collection = await getCollection(collectionHandle)
    if (!collection) return []

    // Hämta viner för denna collection
    return await getWines({
      ...params,
      collection: collection.handle
    })
  } catch (error) {
    console.error('Error in getCollectionWines:', error)
    return []
  }
}

// Hämta pall-status för vin (crowdsourcing-funktionalitet)
export async function getWinePalletStatus(wineId: string) {
  try {
    const { data: pallets, error } = await supabase
      .from('pallets')
      .select('*')
      .eq('wine_id', wineId)
      .eq('status', 'filling')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching pallet status:', error)
      return null
    }

    if (pallets && pallets.length > 0) {
      const pallet = pallets[0]
      const fillPercentage = (pallet.current_bottles / pallet.target_bottles) * 100
      
      return {
        palletId: pallet.id,
        currentBottles: pallet.current_bottles,
        targetBottles: pallet.target_bottles,
        fillPercentage: Math.round(fillPercentage),
        status: pallet.status,
        estimatedShipping: pallet.estimated_shipping_date
      }
    }

    return null
  } catch (error) {
    console.error('Error in getWinePalletStatus:', error)
    return null
  }
}
