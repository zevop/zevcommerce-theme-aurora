import { BlockRenderer } from '@zevcommerce/storefront-api';
import { getSharedBlocks } from '@zevcommerce/theme-sdk';

export default function ImageWithText({ settings, blocks }: { settings: any; blocks: any[] }) {
  const {
    image_position = 'left',
    image_width = '1/2',
    layout = 'overlap',
    background_color,
    text_color,
    accent_line = true,
    accent_color = '#B45309',
    padding_y = 'large',
  } = settings;

  const resolveImage = (img: any) => {
    if (!img) return undefined;
    if (typeof img === 'string') return img;
    if (typeof img === 'object' && img.url) return img.url;
    return undefined;
  };
  const imgSrc = resolveImage(settings.image);

  const paddingMap: Record<string, string> = { none: 'py-0', small: 'py-8', medium: 'py-16', large: 'py-24' };
  const sectionPadding = paddingMap[padding_y] || paddingMap.large;

  const widthMap: Record<string, string> = { '1/3': 'lg:w-5/12', '1/2': 'lg:w-1/2', '2/3': 'lg:w-7/12' };
  const imgWidthClass = widthMap[image_width] || 'lg:w-1/2';
  const contentWidthMap: Record<string, string> = { '1/3': 'lg:w-7/12', '1/2': 'lg:w-1/2', '2/3': 'lg:w-5/12' };
  const contentWidthClass = contentWidthMap[image_width] || 'lg:w-1/2';

  const isOverlap = layout === 'overlap';
  const isReversed = image_position === 'right';

  return (
    <section className={sectionPadding} style={{ backgroundColor: background_color || 'var(--color-background, #FAFAF9)' }}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-0`}>
          {/* Image */}
          <div className={`w-full ${imgWidthClass} ${isOverlap ? (isReversed ? 'lg:pl-12' : 'lg:pr-12') : ''}`}>
            <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-stone-100">
              {imgSrc ? (
                <img src={imgSrc} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-100" />
              )}
            </div>
          </div>

          {/* Content */}
          <div className={`w-full ${contentWidthClass} ${isOverlap ? (isReversed ? 'lg:-mr-12' : 'lg:-ml-12') + ' lg:relative lg:z-10' : ''}`}>
            <div
              className={`${isOverlap ? 'bg-white shadow-lg rounded-2xl p-8 md:p-12' : 'py-4 md:py-8'}`}
              style={{ color: text_color || 'var(--color-text)' }}
            >
              {accent_line && (
                <div className="w-10 h-0.5 mb-6" style={{ backgroundColor: accent_color }} />
              )}
              <BlockRenderer
                blocks={blocks}
                sectionSettings={settings}
                className="flex flex-col items-start text-left gap-1"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'image_with_text',
  name: 'Image with Text',
  max_blocks: 5,
  settings: [
    { type: 'image', id: 'image', label: 'Image' },
    { type: 'select', id: 'image_position', label: 'Image Position', options: [{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }], default: 'left' },
    { type: 'select', id: 'image_width', label: 'Image Width', options: [{ value: '1/3', label: 'One Third' }, { value: '1/2', label: 'Half' }, { value: '2/3', label: 'Two Thirds' }], default: '1/2' },
    { type: 'select', id: 'layout', label: 'Layout Style', options: [{ value: 'overlap', label: 'Overlapping Card' }, { value: 'standard', label: 'Side by Side' }], default: 'overlap' },
    { type: 'color', id: 'background_color', label: 'Section Background' },
    { type: 'color', id: 'text_color', label: 'Text Color' },
    { type: 'checkbox', id: 'accent_line', label: 'Show Accent Line', default: true },
    { type: 'color', id: 'accent_color', label: 'Accent Line Color', default: '#B45309' },
    { type: 'select', id: 'padding_y', label: 'Vertical Padding', options: [{ value: 'none', label: 'None' }, { value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }], default: 'large' },
  ],
  blocks: getSharedBlocks([
    { type: 'heading', name: 'Heading', settings: [{ type: 'text', id: 'text', label: 'Heading', default: 'Crafted with Purpose' }, { type: 'color', id: 'color', label: 'Text Color' }] },
    { type: 'text', name: 'Description', settings: [{ type: 'textarea', id: 'text', label: 'Text', default: 'Every product is thoughtfully designed and sustainably sourced.' }, { type: 'color', id: 'color', label: 'Text Color' }] },
    { type: 'button', name: 'Button', settings: [{ type: 'text', id: 'text', label: 'Button text', default: 'Learn More' }, { type: 'text', id: 'link', label: 'Button link', default: '/pages/about' }, { type: 'color', id: 'bg_color', label: 'Button Color' }, { type: 'color', id: 'text_color', label: 'Button Text Color' }] },
  ]),
};
