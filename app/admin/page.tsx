'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

interface Producer {
  id: string
  name: string
  description: string
  country: string
  region: string
  website: string
}

interface Wine {
  id: string
  name: string
  producer_id: string
  vintage: number
  wine_type: string
  grape_varieties: string[]
  description: string
  price_per_bottle: number
  bottles_per_pallet: number
  is_active: boolean
}

export default function AdminPage() {
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [setupResult, setSetupResult] = useState<any>(null)
  const [producers, setProducers] = useState<Producer[]>([])
  const [wines, setWines] = useState<Wine[]>([])
  const [newProducer, setNewProducer] = useState({
    name: '',
    description: '',
    country: '',
    region: '',
    website: ''
  })
  const [newWine, setNewWine] = useState({
    name: '',
    producer_id: '',
    vintage: new Date().getFullYear(),
    wine_type: '',
    grape_varieties: '',
    description: '',
    price_per_bottle: 0,
    bottles_per_pallet: 56
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
        setNewProducer({ name: '', description: '', country: '', region: '', website: '' })
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
        price_per_bottle: parseFloat(newWine.price_per_bottle.toString())
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
          name: '',
          producer_id: '',
          vintage: new Date().getFullYear(),
          wine_type: '',
          grape_varieties: '',
          description: '',
          price_per_bottle: 0,
          bottles_per_pallet: 56
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Producer */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Producer</CardTitle>
            <CardDescription>Add a new wine producer to the system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Label htmlFor="producer-description">Description</Label>
              <Textarea
                id="producer-description"
                value={newProducer.description}
                onChange={(e) => setNewProducer({...newProducer, description: e.target.value})}
                placeholder="Legendary Bordeaux producer..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
            <Button onClick={addProducer} className="w-full">
              Add Producer
            </Button>
          </CardContent>
        </Card>

        {/* Add Wine */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Wine</CardTitle>
            <CardDescription>Add a new wine to the system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="wine-name">Wine Name</Label>
              <Input
                id="wine-name"
                value={newWine.name}
                onChange={(e) => setNewWine({...newWine, name: e.target.value})}
                placeholder="Château Margaux 2018"
              />
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
            <div className="grid grid-cols-2 gap-4">
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
            </div>
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
              <Label htmlFor="wine-description">Description</Label>
              <Textarea
                id="wine-description"
                value={newWine.description}
                onChange={(e) => setNewWine({...newWine, description: e.target.value})}
                placeholder="A magnificent vintage with exceptional complexity..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wine-price">Price per Bottle</Label>
                <Input
                  id="wine-price"
                  type="number"
                  step="0.01"
                  value={newWine.price_per_bottle}
                  onChange={(e) => setNewWine({...newWine, price_per_bottle: parseFloat(e.target.value)})}
                  placeholder="899.00"
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
            <Button onClick={addWine} className="w-full">
              Add Wine
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Producers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{producers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Wines</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{wines.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Pallets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
