'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme, getCollections, getStorePermalink } from '@zevcommerce/storefront-api';
import { getSharedBlocks } from '@zevcommerce/theme-sdk';

export default function CollectionList({ settings, blocks }: { settings: any; blocks: any[] }) {
  const { storeConfig } = useTheme();
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const domain = storeConfig?.handle || '';

  const { layout = 'grid', columns = 3, title, description, padding_y = 'large' } = settings;
  const paddingMap: Record<string, string> = { none: 'py-0', small: 'py-8', medium: 'py-16', large: 'py-24' };
  const sectionPadding = paddingMap[padding_y] || paddingMap.large;

  const collectionItems = blocks.filter(b => b.type === 'collection_item');

  useEffect(() => {
    async function load() {
      if (!domain) { setLoading(false); return; }
      try {
        const data = await getCollections(domain);
        setCollections(data || []);
      } catch { /* empty */ } finally { setLoading(false); }
    }
    if (collectionItems.length === 0) load();
    else setLoading(false);
  }, [domain, collectionItems.length]);

  const items = collectionItems.length > 0
    ? collectionItems.map(b => ({
        title: b.settings?.title || 'Collection',
        handle: b.settings?.collection || '',
        image: typeof b.settings?.image === 'string' ? b.settings?.image : b.settings?.image?.url,
      }))
    : collections.map(c => ({
        title: c.title,
        handle: c.handle,
        image: c.image?.url,
      }));

  const gridColsMap: Record<number, string> = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-2 lg:grid-cols-4' };
  const gridCols = gridColsMap[columns] || 'md:grid-cols-3';

  if (loading) {
    return (
      <div className={`container mx-auto px-4 sm:px-6 ${sectionPadding}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-stone-200 w-1/3 rounded mb-8" />
          <div className={`grid grid-cols-2 ${gridCols} gap-6`}>
            {[1, 2, 3].map(i => <div key={i} className="aspect-[3/4] bg-stone-100 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={sectionPadding} style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container mx-auto px-4 sm:px-6">
        {(title || description) && (
          <div className="text-center mb-12 max-w-2xl mx-auto">
            {title && <h2 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h2>}
            {description && <p className="mt-4 text-base text-stone-600">{description}</p>}
          </div>
        )}

        {layout === 'grid' && (
          <div className={`grid grid-cols-2 ${gridCols} gap-5 md:gap-7`}>
            {items.map((item, i) => (
              <Link key={i} href={getStorePermalink(domain, `/collections/${item.handle}`)} className="group">
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-stone-100">
                  {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent flex items-end p-6">
                    <h3 className="text-white text-lg md:text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{item.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {layout === 'masonry' && (
          <div className="columns-2 md:columns-3 gap-5 space-y-5">
            {items.map((item, i) => (
              <Link key={i} href={getStorePermalink(domain, `/collections/${item.handle}`)} className="group block break-inside-avoid">
                <div className={`relative overflow-hidden rounded-2xl bg-stone-100 ${i % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}>
                  {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent flex items-end p-6">
                    <h3 className="text-white text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{item.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export const schema = {
  type: 'collection_list',
  name: 'Collection List',
  settings: [
    { type: 'text', id: 'title', label: 'Heading' },
    { type: 'textarea', id: 'description', label: 'Description' },
    { type: 'select', id: 'layout', label: 'Layout', options: [{ value: 'grid', label: 'Grid' }, { value: 'masonry', label: 'Masonry' }], default: 'grid' },
    { type: 'range', id: 'columns', label: 'Columns', min: 2, max: 4, step: 1, default: 3 },
    { type: 'select', id: 'padding_y', label: 'Padding', options: [{ value: 'none', label: 'None' }, { value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }], default: 'large' },
  ],
  blocks: getSharedBlocks([
    {
      type: 'collection_item', name: 'Collection',
      settings: [
        { type: 'collection_picker', id: 'collection', label: 'Collection' },
        { type: 'text', id: 'title', label: 'Custom Title' },
        { type: 'image', id: 'image', label: 'Custom Image' },
      ],
    },
  ]),
};
