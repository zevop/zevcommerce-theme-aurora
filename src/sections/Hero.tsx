import { useTheme, BlockRenderer } from '@zevcommerce/storefront-api';
import { getSharedBlocks } from '@zevcommerce/theme-sdk';

export default function Hero({ settings, blocks }: { settings: any; blocks: any[] }) {
  const { storeConfig } = useTheme();
  const storeName = storeConfig?.name || 'Store';

  const processedBlocks = blocks.map(block => {
    if (block.type === 'heading' && block.settings?.text) {
      return { ...block, settings: { ...block.settings, text: block.settings.text.replace(/\{\{store_name\}\}/g, storeName) } };
    }
    return block;
  });

  const heightMap: Record<string, string> = {
    small: 'min-h-[400px]',
    medium: 'min-h-[550px]',
    large: 'min-h-[700px]',
    full: 'min-h-screen',
  };
  const heightClass = heightMap[settings.height] || heightMap.large;

  const alignMap: Record<string, string> = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };
  const alignClass = alignMap[settings.alignment] || alignMap.left;

  const vAlignMap: Record<string, string> = {
    top: 'justify-start pt-32',
    center: 'justify-center',
    bottom: 'justify-end pb-16 md:pb-24',
  };
  const vAlignClass = vAlignMap[settings.vertical_alignment] || vAlignMap.bottom;

  const resolveImage = (img: any) => {
    if (!img) return undefined;
    if (typeof img === 'string') return img;
    if (typeof img === 'object' && img.url) return img.url;
    return undefined;
  };

  const bgImage = resolveImage(settings.bg_image);
  const overlayColor = settings.overlay_color || '#1C1917';
  const overlayOpacity = (settings.overlay_opacity ?? 40) / 100;

  const sectionStyle: React.CSSProperties = {
    backgroundImage: bgImage ? `url("${bgImage}")` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
  if (settings.section_bg_color) sectionStyle.backgroundColor = settings.section_bg_color;

  const isSplit = settings.layout === 'split';

  if (isSplit) {
    return (
      <div className={`${heightClass} grid grid-cols-1 md:grid-cols-2`}>
        {/* Image side */}
        <div className="relative overflow-hidden bg-stone-100" style={bgImage ? { backgroundImage: `url("${bgImage}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
          {!bgImage && <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-100" />}
        </div>
        {/* Content side */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-16 bg-[var(--color-background,#FAFAF9)]">
          <BlockRenderer
            blocks={processedBlocks}
            sectionSettings={settings}
            className="w-full flex flex-col items-start text-left gap-1"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col w-full text-white ${heightClass} ${vAlignClass}`}
      style={sectionStyle}
    >
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: bgImage
            ? `linear-gradient(to top, ${overlayColor} 0%, ${overlayColor}88 40%, transparent 100%)`
            : undefined,
          backgroundColor: bgImage ? undefined : overlayColor,
          opacity: bgImage ? overlayOpacity + 0.3 : overlayOpacity,
        }}
      />

      <div className={`relative z-10 container mx-auto px-4 sm:px-6 py-16`}>
        <div className={`max-w-2xl ${settings.alignment === 'center' ? 'mx-auto' : ''}`}>
          <BlockRenderer
            blocks={processedBlocks}
            sectionSettings={settings}
            className={`w-full flex flex-col ${alignClass} gap-1`}
          />
        </div>
      </div>
    </div>
  );
}

export const schema = {
  type: 'hero',
  name: 'Hero Banner',
  max_blocks: 5,
  settings: [
    {
      type: 'select', id: 'height', label: 'Section Height',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
        { value: 'full', label: 'Full Screen' },
      ],
      default: 'full',
    },
    {
      type: 'select', id: 'layout', label: 'Layout',
      options: [
        { value: 'overlay', label: 'Text Over Image' },
        { value: 'split', label: 'Split (Image + Content)' },
      ],
      default: 'overlay',
    },
    {
      type: 'select', id: 'alignment', label: 'Text Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
      default: 'left',
    },
    {
      type: 'select', id: 'vertical_alignment', label: 'Vertical Alignment',
      options: [
        { value: 'top', label: 'Top' },
        { value: 'center', label: 'Center' },
        { value: 'bottom', label: 'Bottom' },
      ],
      default: 'bottom',
    },
    { type: 'image', id: 'bg_image', label: 'Background Image' },
    { type: 'color', id: 'overlay_color', label: 'Overlay Color', default: '#1C1917' },
    { type: 'range', id: 'overlay_opacity', label: 'Overlay Opacity', min: 0, max: 100, step: 5, default: 40 },
    { type: 'color', id: 'section_bg_color', label: 'Background Color (no image)' },
  ],
  blocks: getSharedBlocks([
    {
      type: 'heading', name: 'Heading',
      settings: [
        { type: 'text', id: 'text', label: 'Heading', default: 'Elevate Your Everyday' },
        { type: 'select', id: 'tag', label: 'HTML Tag', options: [{ value: 'h1', label: 'H1' }, { value: 'h2', label: 'H2' }], default: 'h1' },
        { type: 'color', id: 'color', label: 'Text Color' },
      ],
    },
    {
      type: 'text', name: 'Description',
      settings: [
        { type: 'textarea', id: 'text', label: 'Text content', default: 'Thoughtfully curated pieces designed for modern living.' },
        { type: 'color', id: 'color', label: 'Text Color' },
      ],
    },
    {
      type: 'button', name: 'Button',
      settings: [
        { type: 'text', id: 'text', label: 'Button text', default: 'Shop the Collection' },
        { type: 'text', id: 'link', label: 'Button link', default: '/collections/all' },
        { type: 'color', id: 'bg_color', label: 'Button Color' },
        { type: 'color', id: 'text_color', label: 'Button Text Color' },
      ],
    },
  ]),
};
