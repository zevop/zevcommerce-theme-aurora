'use client';

import { useTheme } from '@zevcommerce/storefront-api';

export default function Copyright({ settings }: { settings: any }) {
  const { storeConfig } = useTheme();
  const storeName = storeConfig?.name || 'Store';
  const year = new Date().getFullYear();
  const { copyrightText, backgroundColor = '#F5F5F4', textColor = '#A8A29E', showBorder = true } = settings;

  return (
    <div
      className={`py-5 ${showBorder ? 'border-t border-stone-200' : ''}`}
      style={{ backgroundColor, color: textColor }}
    >
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs tracking-wide">
          {copyrightText || `© ${year} ${storeName}. All rights reserved.`}
        </p>
      </div>
    </div>
  );
}

export const schema = {
  type: 'copyright',
  name: 'Copyright Bar',
  settings: [
    { type: 'text', id: 'copyrightText', label: 'Copyright Text', default: '' },
    { type: 'color', id: 'backgroundColor', label: 'Background Color', default: '#F5F5F4' },
    { type: 'color', id: 'textColor', label: 'Text Color', default: '#A8A29E' },
    { type: 'checkbox', id: 'showBorder', label: 'Show Top Border', default: true },
  ],
};
