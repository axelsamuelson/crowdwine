'use client'

import { useWines, useCollections } from '@/hooks/use-wines'
import type { Product, Collection } from '@/lib/shopify/types'
import { ProductListContent } from './product-list-content'
import { mapSortKeys } from '@/lib/shopify/utils'
import { useEffect, useState } from 'react'

interface ProductListProps {
  collection: string
  searchParams?: { [key: string]: string | string[] | undefined }
  initialWines?: Product[]
  initialCollections?: Collection[]
}

export default function ProductList({ 
  collection, 
  searchParams, 
  initialWines = [], 
  initialCollections = [] 
}: ProductListProps) {
  const query = typeof searchParams?.q === 'string' ? searchParams.q : undefined
  const sort = typeof searchParams?.sort === 'string' ? searchParams.sort : undefined
  const isRootCollection = collection === 'joyco-root' || !collection

  const { sortKey, reverse } = isRootCollection ? mapSortKeys(sort, 'product') : mapSortKeys(sort, 'collection')

  // Använd initial data om tillgängligt, annars använd hooks
  const [products, setProducts] = useState<Product[]>(initialWines)
  const [collections, setCollections] = useState<Collection[]>(initialCollections)
  const [loading, setLoading] = useState(initialWines.length === 0)
  const [error, setError] = useState<string | null>(null)

  // Om vi inte har initial data, använd hooks
  const { wines: hookWines, loading: winesLoading, error: winesError } = useWines({
    query,
    sortKey,
    reverse,
    collection: isRootCollection ? undefined : collection
  })

  const { collections: hookCollections, loading: collectionsLoading, error: collectionsError } = useCollections()

  useEffect(() => {
    // Uppdatera state när hooks returnerar data
    if (hookWines.length > 0) {
      setProducts(hookWines)
    }
    if (hookCollections.length > 0) {
      setCollections(hookCollections)
    }
    setLoading(winesLoading || collectionsLoading)
    setError(winesError || collectionsError)
  }, [hookWines, hookCollections, winesLoading, collectionsLoading, winesError, collectionsError])

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to load data
        </h3>
        <p className="text-gray-600">
          {error}
        </p>
      </div>
    )
  }

  return <ProductListContent products={products} collections={collections} />
}
