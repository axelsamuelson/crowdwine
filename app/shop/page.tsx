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

  return (
    <div className="space-y-6">
      <ProductList 
        collection="joyco-root" 
        searchParams={searchParams}
        initialWines={wines}
        initialCollections={collections}
      />
    </div>
  )
}
