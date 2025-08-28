'use client'

import { useState, useEffect } from 'react'
import { getWines, getWine, getCollections, getCollection, getWinePalletStatus } from '@/lib/supabase/adapters'
import type { Product, Collection } from '@/lib/shopify/types'

export interface PalletStatus {
  palletId: string
  currentBottles: number
  targetBottles: number
  fillPercentage: number
  status: string
  estimatedShipping: string | null
}

export function useWines(params: {
  limit?: number
  sortKey?: string
  reverse?: boolean
  query?: string
  collection?: string
} = {}) {
  const [wines, setWines] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWines() {
      try {
        setLoading(true)
        setError(null)
        const data = await getWines(params)
        setWines(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch wines')
      } finally {
        setLoading(false)
      }
    }

    fetchWines()
  }, [params.limit, params.sortKey, params.reverse, params.query, params.collection])

  return { wines, loading, error }
}

export function useWine(handle: string) {
  const [wine, setWine] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWine() {
      if (!handle) return
      
      try {
        setLoading(true)
        setError(null)
        const data = await getWine(handle)
        setWine(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch wine')
      } finally {
        setLoading(false)
      }
    }

    fetchWine()
  }, [handle])

  return { wine, loading, error }
}

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCollections() {
      try {
        setLoading(true)
        setError(null)
        const data = await getCollections()
        setCollections(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch collections')
      } finally {
        setLoading(false)
      }
    }

    fetchCollections()
  }, [])

  return { collections, loading, error }
}

export function useCollection(handle: string) {
  const [collection, setCollection] = useState<Collection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCollection() {
      if (!handle) return
      
      try {
        setLoading(true)
        setError(null)
        const data = await getCollection(handle)
        setCollection(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch collection')
      } finally {
        setLoading(false)
      }
    }

    fetchCollection()
  }, [handle])

  return { collection, loading, error }
}

export function useWinePalletStatus(wineId: string) {
  const [palletStatus, setPalletStatus] = useState<PalletStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPalletStatus() {
      if (!wineId) return
      
      try {
        setLoading(true)
        setError(null)
        const data = await getWinePalletStatus(wineId)
        setPalletStatus(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch pallet status')
      } finally {
        setLoading(false)
      }
    }

    fetchPalletStatus()
  }, [wineId])

  return { palletStatus, loading, error }
}

// Hook för att hämta viner för en specifik collection
export function useCollectionWines(collectionHandle: string, params: {
  limit?: number
  sortKey?: string
  reverse?: boolean
  query?: string
} = {}) {
  const [wines, setWines] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCollectionWines() {
      if (!collectionHandle) return
      
      try {
        setLoading(true)
        setError(null)
        const data = await getWines({ ...params, collection: collectionHandle })
        setWines(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch collection wines')
      } finally {
        setLoading(false)
      }
    }

    fetchCollectionWines()
  }, [collectionHandle, params.limit, params.sortKey, params.reverse, params.query])

  return { wines, loading, error }
}
