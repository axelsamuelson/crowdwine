'use client'

import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Package, Users } from 'lucide-react'
import { useState, useEffect } from 'react'

interface PalletData {
  id: string
  wine_id: string
  target_bottles: number
  current_bottles: number
  status: string
  estimated_shipping_date?: string
}

interface WinePalletStatusProps {
  wineId: string
  showDetails?: boolean
}

export function WinePalletStatus({ wineId, showDetails = false }: WinePalletStatusProps) {
  const [palletData, setPalletData] = useState<PalletData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPalletData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/pallets')
        if (!response.ok) {
          throw new Error('Failed to fetch pallet data')
        }
        
        const data = await response.json()
        if (data.success && data.pallets) {
          // Hitta pall för detta vin
          const pallet = data.pallets.find((p: PalletData) => p.wine_id === wineId)
          setPalletData(pallet || null)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPalletData()
  }, [wineId])

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Pallet Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !palletData) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Pallet Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {error || 'No pallet data available'}
          </p>
        </CardContent>
      </Card>
    )
  }

  const progressPercentage = (palletData.current_bottles / palletData.target_bottles) * 100
  const remainingBottles = palletData.target_bottles - palletData.current_bottles

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Pallet Status</CardTitle>
        <CardDescription>
          Crowdsourcing progress for this wine
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{palletData.current_bottles} bottles filled</span>
            <span>{remainingBottles} bottles needed</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span>Target: {palletData.target_bottles}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Current: {palletData.current_bottles}</span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <Badge variant={palletData.status === 'filling' ? 'secondary' : 'default'}>
            {palletData.status === 'filling' ? 'Filling Pallet' : palletData.status}
          </Badge>
          <p className="text-xs text-muted-foreground mt-2">
            This wine will ship when the pallet is completely filled
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Kompakt version för produktkort
export function WinePalletStatusCompact({ wineId }: { wineId: string }) {
  // För produktkort, visa pall-status baserat på wineId
  // Vi använder statisk data baserat på våra kända viner för att undvika client-side Supabase-anrop
  
  let palletData = null
  
  // Matcha wineId med våra kända pallar
  if (wineId === '1d35f005-2a6b-4748-89a4-a04ebb1bd0e2') {
    // Champagne Prestige Cuvée
    palletData = {
      target_bottles: 48,
      current_bottles: 12,
      status: 'filling'
    }
  } else if (wineId === '48321b15-c8ff-4da1-84f3-ba395c7c178e') {
    // Bordeaux Grande Réserve 2020
    palletData = {
      target_bottles: 56,
      current_bottles: 8,
      status: 'filling'
    }
  }

  if (!palletData) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-amber-700">
          <span>Pallet Progress</span>
          <span>0%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-amber-500 h-2 rounded-full" style={{ width: '0%' }}></div>
        </div>
        <p className="text-xs text-amber-600 text-center">
          No pallet data
        </p>
      </div>
    )
  }

  const progress = Math.round((palletData.current_bottles / palletData.target_bottles) * 100)
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-amber-700">
        <span>Pallet Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-amber-500 h-2 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-xs text-amber-600 text-center">
        {palletData.current_bottles}/{palletData.target_bottles} bottles • Ships when pallet is full
      </p>
    </div>
  )
}
