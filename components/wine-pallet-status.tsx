'use client'

import { useWinePalletStatus } from '@/hooks/use-wines'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Package, Users } from 'lucide-react'

interface WinePalletStatusProps {
  wineId: string
  showDetails?: boolean
}

export function WinePalletStatus({ wineId, showDetails = false }: WinePalletStatusProps) {
  const { palletStatus, loading, error } = useWinePalletStatus(wineId)

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  if (error || !palletStatus) {
    return null
  }

  const { currentBottles, targetBottles, fillPercentage, status, estimatedShipping } = palletStatus

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-amber-800 text-lg flex items-center gap-2">
          <Package className="h-5 w-5" />
          Crowdsourcing Status
        </CardTitle>
        <CardDescription className="text-amber-700">
          This wine will ship when the pallet is full
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-amber-800">
            <span>Pallet Progress</span>
            <span>{fillPercentage}% Complete</span>
          </div>
          <Progress value={fillPercentage} className="h-3" />
          <div className="text-center text-sm text-amber-700">
            {currentBottles} / {targetBottles} bottles
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center">
          <Badge 
            variant={status === 'filling' ? 'secondary' : 'default'}
            className="bg-amber-100 text-amber-800 border-amber-300"
          >
            {status === 'filling' ? 'Filling Pallet' : status}
          </Badge>
        </div>

        {/* Detailed Info */}
        {showDetails && (
          <div className="space-y-3 pt-2 border-t border-amber-200">
            <div className="flex items-center gap-2 text-sm text-amber-700">
              <Users className="h-4 w-4" />
              <span>
                {targetBottles - currentBottles} bottles needed to complete pallet
              </span>
            </div>
            
            {estimatedShipping && (
              <div className="flex items-center gap-2 text-sm text-amber-700">
                <Calendar className="h-4 w-4" />
                <span>
                  Estimated shipping: {new Date(estimatedShipping).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-sm text-amber-800 font-medium">
            Order now to help fill this pallet!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Kompakt version för produktkort
export function WinePalletStatusCompact({ wineId }: { wineId: string }) {
  const { palletStatus, loading } = useWinePalletStatus(wineId)

  if (loading || !palletStatus) return null

  const { fillPercentage } = palletStatus

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-amber-700">
        <span>Pallet Progress</span>
        <span>{fillPercentage}%</span>
      </div>
      <Progress value={fillPercentage} className="h-2" />
      <p className="text-xs text-amber-600 text-center">
        Ships when pallet is full
      </p>
    </div>
  )
}
