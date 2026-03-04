import { BlockRenderer } from '@zevcommerce/storefront-api';
import { getSharedBlocks } from '@zevcommerce/theme-sdk';

export default function Newsletter({ settings, blocks }: { settings: any; blocks: any[] }) {
  const {
    background_color = '#1C1917',
    text_color = '#FAFAF9',
    accent_color = '#B45309',
    padding_y = 'large',
  } = settings;

  const resolveImage = (img: any) => {
    if (!img) return undefined;
    if (typeof img === 'string') return img;
    if (typeof img === 'object' && img.url) return img.url;
    return undefined;
  };
  const bgImage = resolveImage(settings.bg_image);

  const paddingMap: Record<string, string> = { none: 'py-0', small: 'py-10', medium: 'py-16', large: 'py-24' };
  const sectionPadding = paddingMap[padding_y] || paddingMap.large;

  return (
    <section
      className={`relative ${sectionPadding} overflow-hidden`}
      style={{
        backgroundColor: background_color,
        color: text_color,
        backgroundImage: bgImage ? `url("${bgImage}")` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {bgImage && <div className="absolute inset-0 bg-black/50" />}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center max-w-2xl">
        <div className="w-8 h-0.5 mx-auto mb-8" style={{ backgroundColor: accent_color }} />
        <BlockRenderer
          blocks={blocks}
          sectionSettings={settings}
          className="flex flex-col items-center text-center gap-2"
        />
      </div>
    </section>
  );
}

export const schema = {
  type: 'newsletter',
  name: 'Newsletter',
  max_blocks: 4,
  settings: [
    { type: 'color', id: 'background_color', label: 'Background Color', default: '#1C1917' },
    { type: 'color', id: 'text_color', label: 'Text Color', default: '#FAFAF9' },
    { type: 'color', id: 'accent_color', label: 'Accent Color', default: '#B45309' },
    { type: 'image', id: 'bg_image', label: 'Background Image' },
    { type: 'select', id: 'padding_y', label: 'Vertical Padding', options: [{ value: 'none', label: 'None' }, { value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }], default: 'large' },
  ],
  blocks: getSharedBlocks([
    { type: 'heading', name: 'Heading', settings: [{ type: 'text', id: 'text', label: 'Heading', default: 'Stay in the Loop' }, { type: 'color', id: 'color', label: 'Text Color' }] },
    { type: 'text', name: 'Description', settings: [{ type: 'textarea', id: 'text', label: 'Text', default: 'Be the first to know about new arrivals and exclusive offers.' }, { type: 'color', id: 'color', label: 'Text Color' }] },
    { type: 'email_signup', name: 'Email Signup', settings: [{ type: 'text', id: 'placeholder', label: 'Placeholder', default: 'Enter your email' }, { type: 'text', id: 'button_text', label: 'Button Text', default: 'Subscribe' }] },
  ]),
};
