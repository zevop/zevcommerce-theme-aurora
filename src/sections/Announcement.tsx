'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { BlockRenderer } from '@zevcommerce/storefront-api';
import { getSharedBlocks } from '@zevcommerce/theme-sdk';

export default function Announcement({ settings, blocks }: { settings: any; blocks: any[] }) {
  const [dismissed, setDismissed] = useState(false);
  const { style = 'minimal', showDismiss = true } = settings;

  if (dismissed) return null;

  return (
    <div className={`relative text-center py-2.5 px-4 text-sm ${style === 'minimal' ? '' : 'font-medium'}`}>
      <div className="container mx-auto flex items-center justify-center gap-4">
        <BlockRenderer blocks={blocks} sectionSettings={settings} />
        {showDismiss && (
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export const schema = {
  type: 'announcement',
  name: 'Announcement Bar',
  settings: [
    {
      type: 'select', id: 'style', label: 'Style',
      options: [
        { value: 'minimal', label: 'Minimal' },
        { value: 'bold', label: 'Bold' },
      ],
      default: 'minimal',
    },
    { type: 'checkbox', id: 'showDismiss', label: 'Show Dismiss Button', default: true },
  ],
  blocks: getSharedBlocks([
    {
      type: 'announcement', name: 'Announcement',
      settings: [
        { type: 'text', id: 'text', label: 'Announcement Text', default: 'Free shipping on orders over ₦50,000' },
        { type: 'color', id: 'background_color', label: 'Background Color', default: '#1C1917' },
        { type: 'color', id: 'text_color', label: 'Text Color', default: '#FAFAF9' },
      ],
    },
  ]),
};
