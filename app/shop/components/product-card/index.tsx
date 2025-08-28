import React, { Suspense } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/shopify/types';
import { AddToCart, AddToCartButton } from '@/components/cart/add-to-cart';
import { formatPrice } from '@/lib/utils';
import { VariantSelector } from '../variant-selector';
import { ProductImage } from './product-image';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, Wine, Calendar } from 'lucide-react';
import { WinePalletStatusCompact } from '@/components/wine-pallet-status';

export const ProductCard = ({ product }: { product: Product }) => {
  const hasNoOptions = product.options.length === 0;
  const hasOneOptionWithOneValue = product.options.length === 1 && product.options[0].values.length === 1;
  const justHasColorOption = product.options.length === 1 && product.options[0].name.toLowerCase() === 'color';

  const renderInCardAddToCart = hasNoOptions || hasOneOptionWithOneValue || justHasColorOption;

  // Hitta vin-specifika fält
  const wineType = product.tags.find(tag => ['Red', 'White', 'Rosé', 'Sparkling', 'Dessert'].includes(tag)) || '';
  const vintage = product.tags.find(tag => /^\d{4}$/.test(tag)) || '';
  const region = product.tags.find(tag => !['Red', 'White', 'Rosé', 'Sparkling', 'Dessert'].includes(tag) && !/^\d{4}$/.test(tag)) || '';

  return (
    <div className="relative w-full aspect-[3/4] md:aspect-square bg-muted group overflow-hidden">
      <Link
        href={`/product/${product.handle}`}
        className="block size-full focus-visible:outline-none"
        aria-label={`View details for ${product.title}, price ${product.priceRange.minVariantPrice.amount}`}
        prefetch
      >
        <Suspense fallback={null}>
          <ProductImage product={product} />
        </Suspense>
      </Link>

      {/* Interactive Overlay */}
      <div className="absolute inset-0 p-2 w-full pointer-events-none">
        <div className="flex gap-6 justify-between items-baseline px-3 py-1 w-full font-semibold transition-all duration-300 translate-y-0 max-md:hidden group-hover:opacity-0 group-focus-visible:opacity-0 group-hover:-translate-y-full group-focus-visible:-translate-y-full">
          <p className="text-sm uppercase 2xl:text-base text-balance">{product.title}</p>
          <div className="flex gap-2 items-center text-sm uppercase 2xl:text-base">
            {formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
            {product.compareAtPrice && (
              <span className="line-through opacity-30">
                {formatPrice(product.compareAtPrice.amount, product.compareAtPrice.currencyCode)}
              </span>
            )}
          </div>
        </div>

        <div className="flex absolute inset-x-3 bottom-3 flex-col gap-8 px-2 py-3 rounded-md transition-all duration-300 pointer-events-none bg-popover md:opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 md:translate-y-1/3 group-hover:translate-y-0 group-focus-visible:translate-y-0 group-hover:pointer-events-auto group-focus-visible:pointer-events-auto max-md:pointer-events-auto">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 items-end">
            <p className="text-lg font-semibold text-pretty">{product.title}</p>
            <div className="flex gap-2 items-center place-self-end text-lg font-semibold">
              {formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
              {product.compareAtPrice && (
                <span className="text-base line-through opacity-30">
                  {formatPrice(product.compareAtPrice.amount, product.compareAtPrice.currencyCode)}
                </span>
              )}
            </div>

            {/* Wine-specific info */}
            <div className="col-span-2 space-y-2">
              {wineType && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Wine className="h-4 w-4" />
                  <span>{wineType}</span>
                </div>
              )}
              {vintage && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{vintage}</span>
                </div>
              )}
              {region && (
                <div className="text-sm text-muted-foreground">
                  <span>{region}</span>
                </div>
              )}
            </div>

            {/* Pallet Status */}
            <div className="col-span-2">
              <WinePalletStatusCompact wineId={product.id} />
            </div>

            {renderInCardAddToCart ? (
              <Suspense fallback={null}>
                <div className="self-center">
                  <VariantSelector product={product} />
                </div>
              </Suspense>
            ) : (
              <></>
            )}

            {renderInCardAddToCart ? (
              <Suspense fallback={<AddToCartButton className="col-start-2" product={product} size="sm" />}>
                <AddToCart className="col-start-2" size="sm" product={product} />
              </Suspense>
            ) : (
              <Button className="col-start-2" size="sm" variant="default" asChild>
                <Link href={`/product/${product.handle}`}>
                  <div className="flex justify-between items-center w-full">
                    <span>View Wine</span>
                    <ArrowRightIcon />
                  </div>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
