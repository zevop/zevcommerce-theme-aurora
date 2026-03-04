import { BlockRenderer } from '@zevcommerce/storefront-api';
import { getSharedBlocks } from '@zevcommerce/theme-sdk';

export default function RichText({ settings, blocks }: { settings: any; blocks: any[] }) {
  const { alignment = 'center', width = 'medium', background_color, text_color, padding_y = 'large', accent_line = false, accent_color = '#B45309' } = settings;

  const widthMap: Record<string, string> = { narrow: 'max-w-lg', medium: 'max-w-2xl', wide: 'max-w-4xl', full: 'max-w-full' };
  const widthClass = widthMap[width] || widthMap.medium;
  const alignMap: Record<string, string> = { left: 'items-start text-left', center: 'items-center text-center mx-auto', right: 'items-end text-right ml-auto' };
  const alignClass = alignMap[alignment] || alignMap.center;
  const paddingMap: Record<string, string> = { none: 'py-0', small: 'py-8', medium: 'py-16', large: 'py-24' };
  const sectionPadding = paddingMap[padding_y] || paddingMap.large;

  return (
    <section className={sectionPadding} style={{ backgroundColor: background_color || 'var(--color-background)', color: text_color || 'var(--color-text)' }}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className={`${widthClass} ${alignClass}`}>
          {accent_line && <div className={`w-10 h-0.5 mb-6 ${alignment === 'center' ? 'mx-auto' : ''}`} style={{ backgroundColor: accent_color }} />}
          <BlockRenderer blocks={blocks} sectionSettings={settings} className={`flex flex-col ${alignClass} gap-1`} />
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'rich_text',
  name: 'Rich Text',
  max_blocks: 6,
  settings: [
    { type: 'select', id: 'alignment', label: 'Alignment', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }], default: 'center' },
    { type: 'select', id: 'width', label: 'Content Width', options: [{ value: 'narrow', label: 'Narrow' }, { value: 'medium', label: 'Medium' }, { value: 'wide', label: 'Wide' }, { value: 'full', label: 'Full' }], default: 'medium' },
    { type: 'color', id: 'background_color', label: 'Background Color' },
    { type: 'color', id: 'text_color', label: 'Text Color' },
    { type: 'checkbox', id: 'accent_line', label: 'Show Accent Line', default: false },
    { type: 'color', id: 'accent_color', label: 'Accent Color', default: '#B45309' },
    { type: 'select', id: 'padding_y', label: 'Vertical Padding', options: [{ value: 'none', label: 'None' }, { value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }], default: 'large' },
  ],
  blocks: getSharedBlocks([
    { type: 'heading', name: 'Heading', settings: [{ type: 'text', id: 'text', label: 'Heading', default: 'Our Story' }, { type: 'color', id: 'color', label: 'Color' }] },
    { type: 'text', name: 'Text', settings: [{ type: 'textarea', id: 'text', label: 'Text', default: 'Share your brand story with your customers.' }, { type: 'color', id: 'color', label: 'Color' }] },
    { type: 'button', name: 'Button', settings: [{ type: 'text', id: 'text', label: 'Button text', default: 'Learn More' }, { type: 'text', id: 'link', label: 'Link', default: '/' }, { type: 'color', id: 'bg_color', label: 'Button Color' }, { type: 'color', id: 'text_color', label: 'Button Text Color' }] },
    { type: 'image', name: 'Image', settings: [{ type: 'image', id: 'src', label: 'Image' }] },
  ]),
};
