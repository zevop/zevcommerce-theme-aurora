import { Truck, Shield, RefreshCw, Headphones, Star, Heart, Package, Zap } from 'lucide-react';
import { getSharedBlocks } from '@zevcommerce/theme-sdk';

const iconMap: Record<string, any> = {
  truck: Truck, shield: Shield, refresh: RefreshCw, headphones: Headphones,
  star: Star, heart: Heart, package: Package, zap: Zap,
};

export default function IconsWithText({ settings, blocks }: { settings: any; blocks: any[] }) {
  const { columns = 4, background_color, text_color, accent_color = '#B45309', padding_y = 'large', title } = settings;
  const paddingMap: Record<string, string> = { none: 'py-0', small: 'py-8', medium: 'py-16', large: 'py-24' };
  const sectionPadding = paddingMap[padding_y] || paddingMap.large;
  const gridColsMap: Record<number, string> = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-2 lg:grid-cols-4' };
  const gridCols = gridColsMap[columns] || 'md:grid-cols-2 lg:grid-cols-4';

  const items = blocks.filter(b => b.type === 'icon_item' || b.type === 'icon');

  return (
    <section className={sectionPadding} style={{ backgroundColor: background_color || 'var(--color-background)', color: text_color || 'var(--color-text)' }}>
      <div className="container mx-auto px-4 sm:px-6">
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-12" style={{ fontFamily: 'var(--font-heading)' }}>
            {title}
          </h2>
        )}
        <div className={`grid grid-cols-1 ${gridCols} gap-8`}>
          {items.map((block, i) => {
            const s = block.settings || {};
            const IconComp = iconMap[s.icon] || Package;
            return (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${accent_color}15` }}>
                  <IconComp size={24} style={{ color: accent_color }} />
                </div>
                {s.heading && <h3 className="text-base font-semibold mb-2">{s.heading}</h3>}
                {s.text && <p className="text-sm text-stone-600 leading-relaxed">{s.text}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'icons_with_text',
  name: 'Icons with Text',
  settings: [
    { type: 'text', id: 'title', label: 'Heading' },
    { type: 'range', id: 'columns', label: 'Columns', min: 2, max: 4, step: 1, default: 4 },
    { type: 'color', id: 'background_color', label: 'Background Color' },
    { type: 'color', id: 'text_color', label: 'Text Color' },
    { type: 'color', id: 'accent_color', label: 'Icon Color', default: '#B45309' },
    { type: 'select', id: 'padding_y', label: 'Padding', options: [{ value: 'none', label: 'None' }, { value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }], default: 'large' },
  ],
  blocks: getSharedBlocks([
    {
      type: 'icon_item', name: 'Icon Item',
      settings: [
        { type: 'select', id: 'icon', label: 'Icon', options: [{ value: 'truck', label: 'Shipping' }, { value: 'shield', label: 'Security' }, { value: 'refresh', label: 'Returns' }, { value: 'headphones', label: 'Support' }, { value: 'star', label: 'Quality' }, { value: 'heart', label: 'Heart' }, { value: 'package', label: 'Package' }, { value: 'zap', label: 'Fast' }], default: 'truck' },
        { type: 'text', id: 'heading', label: 'Heading', default: 'Free Shipping' },
        { type: 'textarea', id: 'text', label: 'Description', default: 'On orders over ₦50,000' },
      ],
    },
  ]),
};
