'use client'

import { useWines, useCollections } from '@/hooks/use-wines'
import type { Product, Collection } from '@/lib/shopify/types'
import { ProductListContent } from './product-list-content'
import { mapSortKeys } from '@/lib/shopify/utils'
import { useEffect, useState } from 'react'

interface ProductListProps {
  collection: string
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default function ProductList({ collection, searchParams }: ProductListProps) {
  const query = typeof searchParams?.q === 'string' ? searchParams.q : undefined
  const sort = typeof searchParams?.sort === 'string' ? searchParams.sort : undefined
  const isRootCollection = collection === 'joyco-root' || !collection

  const { sortKey, reverse } = isRootCollection ? mapSortKeys(sort, 'product') : mapSortKeys(sort, 'collection')

  // Hämta viner från Supabase
  const { wines: products, loading: winesLoading, error: winesError } = useWines({
    query,
    sortKey,
    reverse,
    collection: isRootCollection ? undefined : collection
  })

  // Hämta collections från Supabase
  const { collections, loading: collectionsLoading, error: collectionsError } = useCollections()

  // Loading state
  if (winesLoading || collectionsLoading) {
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
  if (winesError || collectionsError) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {winesError ? 'Failed to load wines' : 'Failed to load collections'}
        </h3>
        <p className="text-gray-600">
          {winesError || collectionsError}
        </p>
      </div>
    )
  }

  return <ProductListContent products={products} collections={collections} />
}
