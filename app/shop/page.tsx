import { Metadata } from 'next'
import ProductList from './components/product-list'
import { getWines, getCollections } from '@/lib/supabase/adapters'

export const metadata: Metadata = {
  title: 'Wine Store | Shop',
  description: 'Discover exceptional wines from renowned producers around the world.',
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  // Hämta data på servern
  const [wines, collections] = await Promise.all([
    getWines(),
    getCollections()
  ])

  // Hämta pall-data från vår egen API
  let pallets = []
  try {
    const palletsResponse = await fetch('/api/pallets', {
      cache: 'no-store'
    })
    if (palletsResponse.ok) {
      const palletsData = await palletsResponse.json()
      pallets = palletsData.pallets || []
    }
  } catch (error) {
    console.error('Failed to fetch pallets:', error)
  }

  return (
    <div className="space-y-6">
      <ProductList
        collection="joyco-root"
        searchParams={searchParams}
        initialWines={wines}
        initialCollections={collections}
        initialPallets={pallets}
      />
    </div>
  )
}
