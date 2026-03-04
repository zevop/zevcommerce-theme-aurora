import { useTheme, BlockRenderer } from '@zevcommerce/storefront-api';
import { getSharedBlocks, withColumnSettings } from '@zevcommerce/theme-sdk';

export default function Footer({ settings, blocks }: { settings: any; blocks: any[] }) {
  const { storeConfig } = useTheme();
  const { description, backgroundColor = '#F5F5F4', textColor = '#57534E', alignment = 'center', layout = 'centered' } = settings;
  const storeName = storeConfig?.name || 'Store';
  const logoSrc = storeConfig?.storeLogo;

  return (
    <footer className="pt-16 pb-10 border-t border-stone-200" style={{ backgroundColor, color: textColor }}>
      <div className="container mx-auto px-4 sm:px-6">
        {layout === 'centered' ? (
          <div className="text-center">
            {/* Logo / Store Name */}
            <div className="mb-8">
              {logoSrc ? (
                <img src={logoSrc} alt={storeName} className="h-8 w-auto object-contain mx-auto" />
              ) : (
                <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: textColor }}>{storeName}</h3>
              )}
              {description && (
                <p className="text-sm max-w-md mx-auto leading-relaxed opacity-80 mt-3" style={{ color: textColor }}>
                  {description}
                </p>
              )}
            </div>

            {/* Link columns — centered grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto text-left mb-10">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className="space-y-3">
                  <BlockRenderer blocks={blocks} columnIndex={idx} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Standard 4-col layout */
          <div className={`grid grid-cols-1 md:grid-cols-4 gap-12 text-${alignment}`}>
            <div className="space-y-4">
              <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-heading)', color: textColor }}>{storeName}</h3>
              {description && (
                <p className="text-sm max-w-xs leading-relaxed opacity-80" style={{ color: textColor }}>{description}</p>
              )}
              <BlockRenderer blocks={blocks} columnIndex={0} />
            </div>
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="space-y-4">
                <BlockRenderer blocks={blocks} columnIndex={idx} />
              </div>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}

export const schema = {
  type: 'footer',
  name: 'Footer',
  settings: [
    {
      type: 'select', id: 'layout', label: 'Layout',
      options: [
        { value: 'centered', label: 'Centered' },
        { value: 'standard', label: 'Standard (4 Columns)' },
      ],
      default: 'centered',
    },
    { type: 'textarea', id: 'description', label: 'Store Description', default: 'Thoughtfully curated collections for modern living.' },
    { type: 'color', id: 'backgroundColor', label: 'Background Color', default: '#F5F5F4' },
    { type: 'color', id: 'textColor', label: 'Text Color', default: '#57534E' },
    {
      type: 'select', id: 'alignment', label: 'Text Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
      ],
      default: 'center',
    },
  ],
  blocks: getSharedBlocks([
    {
      type: 'link_list', name: 'Link List',
      settings: [
        { type: 'text', id: 'title', label: 'Column Title', default: 'Quick Links' },
        { type: 'link_list', id: 'menu', label: 'Select Menu', default: 'footer' },
      ],
    },
    {
      type: 'social_link', name: 'Social Link',
      settings: [
        {
          type: 'select', id: 'platform', label: 'Platform',
          options: [
            { value: 'facebook', label: 'Facebook' }, { value: 'twitter', label: 'Twitter' },
            { value: 'instagram', label: 'Instagram' }, { value: 'linkedin', label: 'LinkedIn' },
            { value: 'youtube', label: 'YouTube' }, { value: 'tiktok', label: 'TikTok' },
          ],
          default: 'instagram',
        },
        { type: 'text', id: 'url', label: 'Link URL', default: 'https://instagram.com' },
        { type: 'color', id: 'icon_color', label: 'Icon Color', default: '#A8A29E' },
      ],
    },
  ], withColumnSettings),
};
