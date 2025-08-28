'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Collection {
  id: string
  title: string
  handle: string
  description: string
  is_active: boolean
}

interface Producer {
  id: string
  name: string
  handle: string
  description: string
  country: string
  region: string
  website: string
  is_active: boolean
}

interface Wine {
  id: string
  title: string
  handle: string
  description: string
  product_type: string
  category_id: string
  producer_id: string
  vintage: number
  wine_type: string
  grape_varieties: string[]
  price_range_min: number
  price_range_max: number
  bottles_per_pallet: number
  available_for_sale: boolean
  is_active: boolean
}

interface WineVariant {
  id: string
  wine_id: string
  title: string
  price: number
  bottle_size: string
  available_for_sale: boolean
}

export default function AdminPage() {
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [setupResult, setSetupResult] = useState<any>(null)
  const [collections, setCollections] = useState<Collection[]>([])
  const [producers, setProducers] = useState<Producer[]>([])
  const [wines, setWines] = useState<Wine[]>([])
  const [variants, setVariants] = useState<WineVariant[]>([])
  
  // Form states
  const [newCollection, setNewCollection] = useState({
    title: '',
    handle: '',
    description: '',
    seo_title: '',
    seo_description: ''
  })
  
  const [newProducer, setNewProducer] = useState({
    name: '',
    handle: '',
    description: '',
    country: '',
    region: '',
    website: ''
  })
  
  const [newWine, setNewWine] = useState({
    title: '',
    handle: '',
    description: '',
    product_type: 'Wine',
    category_id: '',
    producer_id: '',
    vintage: new Date().getFullYear(),
    wine_type: '',
    grape_varieties: '',
    alcohol_content: 13.5,
    region: '',
    country: '',
    price_range_min: 0,
    price_range_max: 0,
    bottles_per_pallet: 56,
    min_pallet_orders: 1,
    max_pallet_orders: 10
  })
  
  const [newVariant, setNewVariant] = useState({
    wine_id: '',
    title: '750ml',
    price: 0,
    bottle_size: '750ml',
    available_for_sale: true
  })
  
  const { toast } = useToast()

  const setupDatabase = async () => {
    setIsSettingUp(true)
    try {
      const response = await fetch('/api/setup-database', {
        method: 'POST'
      })
      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Success!",
          description: "Database setup completed successfully!",
        })
        setSetupResult(result)
      } else {
        toast({
          title: "Error",
          description: result.error || "Setup failed",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to setup database",
        variant: "destructive"
      })
    } finally {
      setIsSettingUp(false)
    }
  }

  const addCollection = async () => {
    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCollection)
      })
      
      if (response.ok) {
        toast({
          title: "Success!",
          description: "Collection added successfully!",
        })
        setNewCollection({ title: '', handle: '', description: '', seo_title: '', seo_description: '' })
        // Här skulle vi uppdatera collections-listan
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add collection",
        variant: "destructive"
      })
    }
  }

  const addProducer = async () => {
    try {
      const response = await fetch('/api/producers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProducer)
      })
      
      if (response.ok) {
        toast({
          title: "Success!",
          description: "Producer added successfully!",
        })
        setNewProducer({ name: '', handle: '', description: '', country: '', region: '', website: '' })
        // Här skulle vi uppdatera producers-listan
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add producer",
        variant: "destructive"
      })
    }
  }

  const addWine = async () => {
    try {
      const wineData = {
        ...newWine,
        grape_varieties: newWine.grape_varieties.split(',').map(g => g.trim()),
        price_range_min: parseFloat(newWine.price_range_min.toString()),
        price_range_max: parseFloat(newWine.price_range_max.toString())
      }
      
      const response = await fetch('/api/wines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wineData)
      })
      
      if (response.ok) {
        toast({
          title: "Success!",
          description: "Wine added successfully!",
        })
        setNewWine({
          title: '',
          handle: '',
          description: '',
          product_type: 'Wine',
          category_id: '',
          producer_id: '',
          vintage: new Date().getFullYear(),
          wine_type: '',
          grape_varieties: '',
          alcohol_content: 13.5,
          region: '',
          country: '',
          price_range_min: 0,
          price_range_max: 0,
          bottles_per_pallet: 56,
          min_pallet_orders: 1,
          max_pallet_orders: 10
        })
        // Här skulle vi uppdatera wines-listan
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add wine",
        variant: "destructive"
      })
    }
  }

  const addVariant = async () => {
    try {
      const variantData = {
        ...newVariant,
        price: parseFloat(newVariant.price.toString())
      }
      
      const response = await fetch('/api/wine-variants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(variantData)
      })
      
      if (response.ok) {
        toast({
          title: "Success!",
          description: "Wine variant added successfully!",
        })
        setNewVariant({
          wine_id: '',
          title: '750ml',
          price: 0,
          bottle_size: '750ml',
          available_for_sale: true
        })
        // Här skulle vi uppdatera variants-listan
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add wine variant",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Wine Admin Dashboard</h1>
        <Button 
          onClick={setupDatabase} 
          disabled={isSettingUp}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSettingUp ? 'Setting up...' : 'Setup Database'}
        </Button>
      </div>

      {setupResult && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">Database Setup Complete</CardTitle>
            <CardDescription>
              {setupResult.message}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-sm text-green-700 bg-white p-3 rounded">
              {JSON.stringify(setupResult, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="collections" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="producers">Producers</TabsTrigger>
          <TabsTrigger value="wines">Wines</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
        </TabsList>

        {/* Collections Tab */}
        <TabsContent value="collections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Collection</CardTitle>
              <CardDescription>Add a new wine collection/category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="collection-title">Title</Label>
                  <Input
                    id="collection-title"
                    value={newCollection.title}
                    onChange={(e) => setNewCollection({...newCollection, title: e.target.value})}
                    placeholder="Bordeaux Wines"
                  />
                </div>
                <div>
                  <Label htmlFor="collection-handle">Handle (URL)</Label>
                  <Input
                    id="collection-handle"
                    value={newCollection.handle}
                    onChange={(e) => setNewCollection({...newCollection, handle: e.target.value})}
                    placeholder="bordeaux-wines"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="collection-description">Description</Label>
                <Textarea
                  id="collection-description"
                  value={newCollection.description}
                  onChange={(e) => setNewCollection({...newCollection, description: e.target.value})}
                  placeholder="Exceptional wines from the legendary Bordeaux region..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="collection-seo-title">SEO Title</Label>
                  <Input
                    id="collection-seo-title"
                    value={newCollection.seo_title}
                    onChange={(e) => setNewCollection({...newCollection, seo_title: e.target.value})}
                    placeholder="Bordeaux Wines - Premium French Wines"
                  />
                </div>
                <div>
                  <Label htmlFor="collection-seo-description">SEO Description</Label>
                  <Input
                    id="collection-seo-description"
                    value={newCollection.seo_description}
                    onChange={(e) => setNewCollection({...newCollection, seo_description: e.target.value})}
                    placeholder="Discover the finest Bordeaux wines..."
                  />
                </div>
              </div>
              <Button onClick={addCollection} className="w-full">
                Add Collection
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Producers Tab */}
        <TabsContent value="producers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Producer</CardTitle>
              <CardDescription>Add a new wine producer to the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="producer-name">Name</Label>
                  <Input
                    id="producer-name"
                    value={newProducer.name}
                    onChange={(e) => setNewProducer({...newProducer, name: e.target.value})}
                    placeholder="Château Margaux"
                  />
                </div>
                <div>
                  <Label htmlFor="producer-handle">Handle (URL)</Label>
                  <Input
                    id="producer-handle"
                    value={newProducer.handle}
                    onChange={(e) => setNewProducer({...newProducer, handle: e.target.value})}
                    placeholder="chateau-margaux"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="producer-description">Description</Label>
                <Textarea
                  id="producer-description"
                  value={newProducer.description}
                  onChange={(e) => setNewProducer({...newProducer, description: e.target.value})}
                  placeholder="Legendary Bordeaux producer known for exceptional wines..."
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="producer-country">Country</Label>
                  <Input
                    id="producer-country"
                    value={newProducer.country}
                    onChange={(e) => setNewProducer({...newProducer, country: e.target.value})}
                    placeholder="France"
                  />
                </div>
                <div>
                  <Label htmlFor="producer-region">Region</Label>
                  <Input
                    id="producer-region"
                    value={newProducer.region}
                    onChange={(e) => setNewProducer({...newProducer, region: e.target.value})}
                    placeholder="Bordeaux"
                  />
                </div>
                <div>
                  <Label htmlFor="producer-website">Website</Label>
                  <Input
                    id="producer-website"
                    value={newProducer.website}
                    onChange={(e) => setNewProducer({...newProducer, website: e.target.value})}
                    placeholder="https://www.chateau-margaux.com"
                  />
                </div>
              </div>
              <Button onClick={addProducer} className="w-full">
                Add Producer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wines Tab */}
        <TabsContent value="wines" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Wine</CardTitle>
              <CardDescription>Add a new wine to the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="wine-title">Wine Title</Label>
                  <Input
                    id="wine-title"
                    value={newWine.title}
                    onChange={(e) => setNewWine({...newWine, title: e.target.value})}
                    placeholder="Château Margaux 2018"
                  />
                </div>
                <div>
                  <Label htmlFor="wine-handle">Handle (URL)</Label>
                  <Input
                    id="wine-handle"
                    value={newWine.handle}
                    onChange={(e) => setNewWine({...newWine, handle: e.target.value})}
                    placeholder="chateau-margaux-2018"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="wine-collection">Collection</Label>
                  <Select value={newWine.category_id} onValueChange={(value) => setNewWine({...newWine, category_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select collection" />
                    </SelectTrigger>
                    <SelectContent>
                      {collections.map(collection => (
                        <SelectItem key={collection.id} value={collection.id}>
                          {collection.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="wine-producer">Producer</Label>
                  <Select value={newWine.producer_id} onValueChange={(value) => setNewWine({...newWine, producer_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select producer" />
                    </SelectTrigger>
                    <SelectContent>
                      {producers.map(producer => (
                        <SelectItem key={producer.id} value={producer.id}>
                          {producer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="wine-vintage">Vintage</Label>
                  <Input
                    id="wine-vintage"
                    type="number"
                    value={newWine.vintage}
                    onChange={(e) => setNewWine({...newWine, vintage: parseInt(e.target.value)})}
                    placeholder="2018"
                  />
                </div>
                <div>
                  <Label htmlFor="wine-type">Wine Type</Label>
                  <Select value={newWine.wine_type} onValueChange={(value) => setNewWine({...newWine, wine_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Red">Red</SelectItem>
                      <SelectItem value="White">White</SelectItem>
                      <SelectItem value="Rosé">Rosé</SelectItem>
                      <SelectItem value="Sparkling">Sparkling</SelectItem>
                      <SelectItem value="Dessert">Dessert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="wine-alcohol">Alcohol %</Label>
                  <Input
                    id="wine-alcohol"
                    type="number"
                    step="0.1"
                    value={newWine.alcohol_content}
                    onChange={(e) => setNewWine({...newWine, alcohol_content: parseFloat(e.target.value)})}
                    placeholder="13.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="wine-grapes">Grape Varieties (comma-separated)</Label>
                  <Input
                    id="wine-grapes"
                    value={newWine.grape_varieties}
                    onChange={(e) => setNewWine({...newWine, grape_varieties: e.target.value})}
                    placeholder="Cabernet Sauvignon, Merlot, Cabernet Franc"
                  />
                </div>
                <div>
                  <Label htmlFor="wine-pallet">Bottles per Pallet</Label>
                  <Input
                    id="wine-pallet"
                    type="number"
                    value={newWine.bottles_per_pallet}
                    onChange={(e) => setNewWine({...newWine, bottles_per_pallet: parseInt(e.target.value)})}
                    placeholder="56"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="wine-price-min">Min Price</Label>
                  <Input
                    id="wine-price-min"
                    type="number"
                    step="0.01"
                    value={newWine.price_range_min}
                    onChange={(e) => setNewWine({...newWine, price_range_min: parseFloat(e.target.value)})}
                    placeholder="899.00"
                  />
                </div>
                <div>
                  <Label htmlFor="wine-price-max">Max Price</Label>
                  <Input
                    id="wine-price-max"
                    type="number"
                    step="0.01"
                    value={newWine.price_range_max}
                    onChange={(e) => setNewWine({...newWine, price_range_max: parseFloat(e.target.value)})}
                    placeholder="899.00"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="wine-description">Description</Label>
                <Textarea
                  id="wine-description"
                  value={newWine.description}
                  onChange={(e) => setNewWine({...newWine, description: e.target.value})}
                  placeholder="A magnificent vintage with exceptional complexity and aging potential..."
                />
              </div>

              <Button onClick={addWine} className="w-full">
                Add Wine
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Variants Tab */}
        <TabsContent value="variants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Wine Variant</CardTitle>
              <CardDescription>Add variants like bottle sizes for existing wines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="variant-wine">Wine</Label>
                <Select value={newVariant.wine_id} onValueChange={(value) => setNewVariant({...newVariant, wine_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select wine" />
                  </SelectTrigger>
                  <SelectContent>
                    {wines.map(wine => (
                      <SelectItem key={wine.id} value={wine.id}>
                        {wine.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="variant-title">Variant Title</Label>
                  <Input
                    id="variant-title"
                    value={newVariant.title}
                    onChange={(e) => setNewVariant({...newVariant, title: e.target.value})}
                    placeholder="750ml"
                  />
                </div>
                <div>
                  <Label htmlFor="variant-size">Bottle Size</Label>
                  <Input
                    id="variant-size"
                    value={newVariant.bottle_size}
                    onChange={(e) => setNewVariant({...newVariant, bottle_size: e.target.value})}
                    placeholder="750ml"
                  />
                </div>
                <div>
                  <Label htmlFor="variant-price">Price</Label>
                  <Input
                    id="variant-price"
                    type="number"
                    step="0.01"
                    value={newVariant.price}
                    onChange={(e) => setNewVariant({...newVariant, price: parseFloat(e.target.value)})}
                    placeholder="899.00"
                  />
                </div>
              </div>

              <Button onClick={addVariant} className="w-full">
                Add Variant
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{collections.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Producers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{producers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Wines</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{wines.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{variants.length}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
