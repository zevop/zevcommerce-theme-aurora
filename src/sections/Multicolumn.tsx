'use client';

import { BlockRenderer } from '@zevcommerce/storefront-api';
import { getSharedBlocks } from '@zevcommerce/theme-sdk';

export default function Multicolumn({ settings, blocks }: { settings: any; blocks: any[] }) {
  const { columns = 3, title, description, background_color, text_color, card_background = true, padding_y = 'large', image_aspect_ratio = 'square' } = settings;

  const paddingMap: Record<string, string> = { none: 'py-0', small: 'py-8', medium: 'py-16', large: 'py-24' };
  const sectionPadding = paddingMap[padding_y] || paddingMap.large;
  const gridColsMap: Record<number, string> = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-2 lg:grid-cols-4' };
  const gridCols = gridColsMap[columns] || 'md:grid-cols-3';

  const aspectMap: Record<string, string> = { feature: 'aspect-[16/9]', portrait: 'aspect-[3/4]', square: 'aspect-square', circle: 'aspect-square rounded-full' };
  const aspectClass = aspectMap[image_aspect_ratio] || 'aspect-square';

  // Group blocks by column (every 3 or 4 blocks = one column item)
  const columnBlocks = blocks.filter(b => b.type === 'column' || b.type === 'card');

  return (
    <section className={sectionPadding} style={{ backgroundColor: background_color || 'var(--color-background)', color: text_color || 'var(--color-text)' }}>
      <div className="container mx-auto px-4 sm:px-6">
        {(title || description) && (
          <div className="text-center mb-12 max-w-2xl mx-auto">
            {title && <h2 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h2>}
            {description && <p className="mt-4 text-base text-stone-600">{description}</p>}
          </div>
        )}
        {columnBlocks.length > 0 ? (
          <div className={`grid grid-cols-1 ${gridCols} gap-8`}>
            {columnBlocks.map((block, i) => {
              const s = block.settings || {};
              const resolveImg = (img: any) => typeof img === 'string' ? img : img?.url;
              const imgSrc = resolveImg(s.image);
              return (
                <div key={i} className={`group ${card_background ? 'bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-shadow' : ''}`}>
                  {imgSrc && (
                    <div className={`overflow-hidden rounded-xl mb-5 bg-stone-100 ${aspectClass}`}>
                      <img src={imgSrc} alt={s.heading || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  {s.heading && <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{s.heading}</h3>}
                  {s.text && <p className="text-sm text-stone-600 leading-relaxed">{s.text}</p>}
                  {s.link_text && s.link_url && (
                    <a href={s.link_url} className="inline-block mt-3 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors">{s.link_text} →</a>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`grid grid-cols-1 ${gridCols} gap-8`}>
            <BlockRenderer blocks={blocks} sectionSettings={settings} />
          </div>
        )}
      </div>
    </section>
  );
}

export const schema = {
  type: 'multicolumn',
  name: 'Multi-Column',
  settings: [
    { type: 'text', id: 'title', label: 'Heading' },
    { type: 'textarea', id: 'description', label: 'Description' },
    { type: 'range', id: 'columns', label: 'Columns', min: 2, max: 4, step: 1, default: 3 },
    { type: 'select', id: 'image_aspect_ratio', label: 'Image Shape', options: [{ value: 'feature', label: 'Feature (16:9)' }, { value: 'portrait', label: 'Portrait' }, { value: 'square', label: 'Square' }, { value: 'circle', label: 'Circle' }], default: 'square' },
    { type: 'checkbox', id: 'card_background', label: 'Card Background', default: true },
    { type: 'color', id: 'background_color', label: 'Section Background' },
    { type: 'color', id: 'text_color', label: 'Text Color' },
    { type: 'select', id: 'padding_y', label: 'Padding', options: [{ value: 'none', label: 'None' }, { value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }], default: 'large' },
  ],
  blocks: getSharedBlocks([
    {
      type: 'column', name: 'Column',
      settings: [
        { type: 'image', id: 'image', label: 'Image' },
        { type: 'text', id: 'heading', label: 'Heading', default: 'Column' },
        { type: 'textarea', id: 'text', label: 'Description', default: 'Describe this feature or benefit.' },
        { type: 'text', id: 'link_text', label: 'Link Text' },
        { type: 'text', id: 'link_url', label: 'Link URL' },
      ],
    },
  ]),
};
