import { cn } from '@/lib/utils';
import Image from 'next/image';
import { FeaturedProductLabel } from './featured-product-label';
import { Product } from '@/lib/data';
import Link from 'next/link';

interface LatestProductCardProps {
  product: Product;
  principal?: boolean;
  className?: string;
  labelPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function LatestProductCard({
  product,
  principal = false,
  className,
  labelPosition = 'bottom-right',
}: LatestProductCardProps) {
  // Hantera tomma bild-URLs
  const hasValidImage = product.featuredImage?.url && product.featuredImage.url !== '';

  if (principal) {
    return (
      <div className={cn('min-h-fold flex flex-col relative', className)}>
        <Link href={`/product/${product.handle}`} className="size-full flex-1 flex flex-col" prefetch>
          {hasValidImage ? (
            <Image
              priority
              src={product.featuredImage.url}
              alt={product.featuredImage.altText}
              width={1000}
              height={100}
              quality={100}
              className="object-cover size-full flex-1"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-1">
              <div className="text-center text-gray-500">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-400 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
                <p className="text-sm font-medium">No Image</p>
              </div>
            </div>
          )}
        </Link>
        <div className="absolute bottom-0 left-0 grid w-full grid-cols-4 gap-6 pointer-events-none max-md:contents p-sides">
          <FeaturedProductLabel
            className="col-span-3 col-start-2 pointer-events-auto 2xl:col-start-3 2xl:col-span-2 shrink-0"
            product={product}
            principal
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <Link href={`/product/${product.handle}`} className="block w-full aspect-square" prefetch>
        {hasValidImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText}
            width={1000}
            height={100}
            className="object-cover size-full"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-400 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <p className="text-sm font-medium">No Image</p>
            </div>
          </div>
        )}
      </Link>

      <div
        className={cn(
          'absolute flex p-sides inset-0 items-end justify-end',
          labelPosition === 'top-left' && 'md:justify-start md:items-start',
          labelPosition === 'top-right' && 'md:justify-end md:items-start',
          labelPosition === 'bottom-left' && 'md:justify-start md:items-end',
          labelPosition === 'bottom-right' && 'md:justify-end md:items-end'
        )}
      >
        <FeaturedProductLabel product={product} />
      </div>
    </div>
  );
}
