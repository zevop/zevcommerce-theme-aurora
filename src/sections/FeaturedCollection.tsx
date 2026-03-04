'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useTheme, getCollection, ProductCard } from '@zevcommerce/storefront-api';

const scrollContainer = (container: HTMLElement | null, direction: 'left' | 'right') => {
  if (!container) return;
  const scrollAmount = container.clientWidth * 0.8;
  container.scrollTo({ left: container.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount), behavior: 'smooth' });
};

export default function FeaturedCollection({ settings }: { settings: any }) {
  const { storeConfig } = useTheme();
  const [products, setProducts] = useState<any[]>([]);
  const [collectionInfo, setCollectionInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const domain = storeConfig?.handle || '';
  const collectionHandle = settings.collection;
  const limit = parseInt(settings.limit || '8');
  const columns = parseInt(settings.columns || '4');
  const layout = settings.layout || 'grid';
  const aspectRatio = settings.aspect_ratio || 'portrait';
  const borderRadius = settings.border_radius || 'lg';
  const hoverOverlay = settings.hover_overlay !== false;

  useEffect(() => {
    async function fetchData() {
      if (!domain || !collectionHandle) { setLoading(false); return; }
      setLoading(true);
      try {
        const collection = await getCollection(domain, collectionHandle);
        if (collection) {
          setCollectionInfo(collection);
          const productList = collection.products?.map((p: any) => p.product) || [];
          setProducts(productList.slice(0, limit));
        }
      } catch (error: any) {
        if (error?.response?.status !== 404) {
          console.error('Error fetching collection:', error);
        }
      } finally { setLoading(false); }
    }
    fetchData();
  }, [domain, collectionHandle, limit]);

  if (!collectionHandle) {
    return (
      <section className="py-16 bg-stone-50 border-y border-dashed border-stone-200">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-lg font-medium text-stone-400">Select a collection to display</h3>
        </div>
      </section>
    );
  }

  const paddingMap: Record<string, string> = { none: 'py-0', small: 'py-8', medium: 'py-16', large: 'py-24' };
  const sectionPadding = paddingMap[settings.padding_y] || paddingMap.large;
  const gapMap: Record<string, string> = { none: 'gap-0', small: 'gap-3', medium: 'gap-6', large: 'gap-10' };
  const gapClass = gapMap[settings.gap] || gapMap.medium;
  const gridColsMap: Record<number, string> = { 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5' };
  const gridColsClass = gridColsMap[columns] || 'lg:grid-cols-4';

  if (loading) {
    return (
      <div className={`container mx-auto px-4 sm:px-6 ${sectionPadding}`}>
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-stone-200 w-1/4 rounded" />
          <div className={`grid grid-cols-2 ${gridColsClass} gap-6`}>
            {[...Array(columns)].map((_, i) => <div key={i} className="aspect-[3/4] bg-stone-100 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className={`${sectionPadding} overflow-hidden`} style={{ backgroundColor: 'var(--color-background, #FAFAF9)' }}>
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div className="max-w-xl">
            {(settings.title || collectionInfo?.title) && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-heading)' }}>
                {settings.title || collectionInfo?.title}
              </h2>
            )}
            {settings.show_description && (settings.description || collectionInfo?.description) && (
              <p className="mt-4 text-base text-stone-600 line-clamp-2">{settings.description || collectionInfo?.description}</p>
            )}
          </div>
          {settings.show_view_all && (
            <Link href={`/collections/${collectionInfo?.handle}`} className="hidden md:flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors">
              View all <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {/* Grid */}
        {layout === 'grid' && (
          <div className={`grid grid-cols-2 md:grid-cols-3 ${gridColsClass} ${gapClass}`}>
            {products.map(product => (
              <div key={product.id} className={`group ${hoverOverlay ? 'relative overflow-hidden rounded-xl' : ''}`}>
                <ProductCard product={product} domain={domain} aspectRatio={aspectRatio} borderRadius={borderRadius} />
              </div>
            ))}
          </div>
        )}

        {/* Carousel */}
        {layout === 'carousel' && (
          <div className="relative group/carousel">
            <button onClick={() => scrollContainer(scrollRef.current, 'left')} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-11 h-11 bg-white rounded-full shadow-lg border border-stone-100 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hidden md:flex">
              <ChevronLeft size={22} />
            </button>
            <button onClick={() => scrollContainer(scrollRef.current, 'right')} className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-11 h-11 bg-white rounded-full shadow-lg border border-stone-100 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hidden md:flex">
              <ChevronRight size={22} />
            </button>
            <div ref={scrollRef} className={`flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pb-4 ${gapClass}`}>
              {products.map(product => (
                <div key={product.id} className={`snap-center shrink-0 w-[280px] sm:w-[320px] md:w-[calc(100%/${columns}-1rem)]`}>
                  <ProductCard product={product} domain={domain} aspectRatio={aspectRatio} borderRadius={borderRadius} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lookbook */}
        {layout === 'lookbook' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 relative overflow-hidden rounded-2xl aspect-[4/5] bg-stone-100">
              <img
                src={collectionInfo?.image?.url || products[0]?.media?.[0]?.url || ''}
                className="w-full h-full object-cover"
                alt={collectionInfo?.title || 'Collection'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                <span className="text-xs uppercase tracking-[0.15em] font-medium mb-2 text-stone-300">Featured Collection</span>
                <h3 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{collectionInfo?.title}</h3>
                <Link href={`/collections/${collectionInfo?.handle}`} className="inline-flex items-center gap-2 text-white font-medium hover:underline text-sm">
                  Shop Collection <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {products.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} domain={domain} aspectRatio="square" borderRadius={borderRadius} />
              ))}
            </div>
          </div>
        )}

        {settings.show_view_all && (
          <div className="mt-12 text-center md:hidden">
            <Link href={`/collections/${collectionInfo?.handle}`} className="inline-flex h-11 items-center justify-center rounded-lg border border-stone-300 px-8 text-sm font-medium tracking-wide uppercase hover:bg-stone-50 transition-colors">
              View all products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export const schema = {
  type: 'featured_collection',
  name: 'Featured Collection',
  settings: [
    { type: 'header', label: 'Content' },
    { type: 'collection_picker', id: 'collection', label: 'Collection', default: '' },
    { type: 'text', id: 'title', label: 'Heading' },
    { type: 'textarea', id: 'description', label: 'Description' },
    { type: 'checkbox', id: 'show_description', label: 'Show Description', default: false },
    { type: 'checkbox', id: 'show_view_all', label: 'Show "View All"', default: true },
    { type: 'header', label: 'Layout' },
    {
      type: 'select', id: 'layout', label: 'Layout Style',
      options: [
        { value: 'grid', label: 'Grid' },
        { value: 'carousel', label: 'Carousel' },
        { value: 'lookbook', label: 'Lookbook' },
      ],
      default: 'grid',
    },
    { type: 'range', id: 'columns', label: 'Desktop Columns', min: 2, max: 5, step: 1, default: 4 },
    { type: 'range', id: 'limit', label: 'Number of products', min: 4, max: 24, step: 4, default: 8 },
    { type: 'select', id: 'padding_y', label: 'Vertical Padding', options: [{ value: 'none', label: 'None' }, { value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }], default: 'large' },
    { type: 'select', id: 'gap', label: 'Grid Gap', options: [{ value: 'none', label: 'None' }, { value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }], default: 'medium' },
    { type: 'header', label: 'Card Style' },
    { type: 'select', id: 'aspect_ratio', label: 'Image Aspect Ratio', options: [{ value: 'auto', label: 'Auto' }, { value: 'square', label: 'Square' }, { value: 'portrait', label: 'Portrait' }, { value: 'landscape', label: 'Landscape' }], default: 'portrait' },
    { type: 'select', id: 'border_radius', label: 'Corner Radius', options: [{ value: 'none', label: 'Square' }, { value: 'sm', label: 'Small' }, { value: 'lg', label: 'Large' }, { value: 'full', label: 'Round' }], default: 'lg' },
    { type: 'checkbox', id: 'hover_overlay', label: 'Hover Overlay Effect', default: true },
  ],
};
