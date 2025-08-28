'use client'

import type { Product, Collection } from '@/lib/shopify/types'
import { ProductListContent } from './product-list-content'
import { mapSortKeys } from '@/lib/shopify/utils'
import { useState, useEffect } from 'react'

interface PalletData {
  id: string
  wine_id: string
  target_bottles: number
  current_bottles: number
  status: string
}

interface ProductListProps {
  collection: string
  searchParams?: { [key: string]: string | string[] | undefined }
  initialWines?: Product[]
  initialCollections?: Collection[]
  initialPallets?: PalletData[]
}

export default function ProductList({ 
  collection, 
  searchParams, 
  initialWines = [], 
  initialCollections = [],
  initialPallets = []
}: ProductListProps) {
  const query = typeof searchParams?.q === 'string' ? searchParams.q : undefined
  const sort = typeof searchParams?.sort === 'string' ? searchParams.sort : undefined
  const isRootCollection = collection === 'joyco-root'

  // Filter wines based on collection and search
  const filteredWines = initialWines.filter(wine => {
    if (query) {
      const searchLower = query.toLowerCase()
      return (
        wine.title.toLowerCase().includes(searchLower) ||
        wine.description.toLowerCase().includes(searchLower) ||
        wine.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }
    return true
  })

  // Sort wines if needed
  const sortedWines = sort ? mapSortKeys(sort, 'product') : { sortKey: undefined, reverse: false }

  return (
    <ProductListContent
      products={filteredWines}
      collections={initialCollections}
    />
  )
}
