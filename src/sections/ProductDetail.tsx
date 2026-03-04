'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme, getProduct, BlockRenderer } from '@zevcommerce/storefront-api';
import { getSharedBlocks } from '@zevcommerce/theme-sdk';

export default function ProductDetail({ id, settings, blocks }: { id: string; settings: any; blocks: any[] }) {
  const { storeConfig } = useTheme();
  const router = useRouter();
  const domain = storeConfig?.handle || '';
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const slug = window.location.pathname.split('/products/')[1];
        if (slug && domain) {
          const data = await getProduct(domain, slug);
          setProduct(data);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [domain]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="space-y-4">
            <div className="aspect-square bg-stone-100 rounded-2xl" />
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(i => <div key={i} className="aspect-square bg-stone-100 rounded-lg" />)}
            </div>
          </div>
          <div className="space-y-4 pt-4">
            <div className="h-4 bg-stone-100 w-1/3 rounded" />
            <div className="h-8 bg-stone-100 w-2/3 rounded" />
            <div className="h-6 bg-stone-100 w-1/4 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-24 text-center">
        <p className="text-stone-500">Product not found</p>
      </div>
    );
  }

  const isSticky = settings.layout === 'sticky-sidebar';

  // Split blocks: images go in left column, everything else in right
  const imageBlocks = blocks.filter(b => b.type === 'product_images');
  const infoBlocks = blocks.filter(b => b.type !== 'product_images');

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-400 mb-8">
        <a href="/" className="hover:text-stone-600 transition-colors">Home</a>
        <span>/</span>
        <a href="/collections/all" className="hover:text-stone-600 transition-colors">Products</a>
        <span>/</span>
        <span className="text-stone-600">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Left: Images */}
        <div>
          <BlockRenderer
            blocks={imageBlocks}
            sectionSettings={{ ...settings, product }}
            className="space-y-4"
          />
        </div>

        {/* Right: Product Info */}
        <div className={isSticky ? 'lg:sticky lg:top-28' : ''}>
          <BlockRenderer
            blocks={infoBlocks}
            sectionSettings={{ ...settings, product }}
            className="space-y-1"
          />
        </div>
      </div>
    </div>
  );
}

export const schema = {
  type: 'product-detail',
  name: 'Product Detail',
  settings: [
    {
      type: 'select', id: 'layout', label: 'Layout',
      options: [
        { value: '2-col', label: 'Standard (2 Column)' },
        { value: 'sticky-sidebar', label: 'Sticky Sidebar' },
      ],
      default: 'sticky-sidebar',
    },
  ],
  blocks: getSharedBlocks([
    {
      type: 'product_images', name: 'Product Images',
      settings: [
        { type: 'select', id: 'layout', label: 'Gallery Layout', options: [{ value: 'stacked', label: 'Stacked' }, { value: 'carousel', label: 'Carousel' }, { value: 'grid', label: 'Grid' }], default: 'stacked' },
        { type: 'checkbox', id: 'enable_zoom', label: 'Enable Zoom', default: true },
        { type: 'checkbox', id: 'show_thumbnails', label: 'Show Thumbnails', default: true },
      ],
    },
    { type: 'product_title', name: 'Product Title', settings: [{ type: 'checkbox', id: 'show_vendor', label: 'Show Vendor', default: true }] },
    { type: 'product_price', name: 'Product Price', settings: [{ type: 'checkbox', id: 'show_compare_at', label: 'Show Compare-at Price', default: true }] },
    { type: 'product_variants', name: 'Variant Selector', settings: [{ type: 'select', id: 'style', label: 'Style', options: [{ value: 'buttons', label: 'Buttons' }, { value: 'dropdown', label: 'Dropdown' }], default: 'buttons' }] },
    { type: 'add_to_cart', name: 'Add to Cart', settings: [{ type: 'checkbox', id: 'show_quantity', label: 'Show Quantity', default: true }, { type: 'text', id: 'button_text', label: 'Button Text', default: 'Add to Cart' }] },
    { type: 'product_description', name: 'Description', settings: [{ type: 'checkbox', id: 'collapsible', label: 'Collapsible', default: true }] },
  ]),
};
