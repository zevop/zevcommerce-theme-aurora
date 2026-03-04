'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { getSharedBlocks } from '@zevcommerce/theme-sdk';

export default function FAQ({ settings, blocks }: { settings: any; blocks: any[] }) {
  const [openIndex, setOpenIndex] = useState(0);
  const { title, description, background_color, text_color, accent_color = '#B45309', padding_y = 'large', width = 'medium' } = settings;
  const faqs = blocks.filter(b => b.type === 'accordion' || b.type === 'question');

  const paddingMap: Record<string, string> = { none: 'py-0', small: 'py-8', medium: 'py-16', large: 'py-24' };
  const sectionPadding = paddingMap[padding_y] || paddingMap.large;
  const widthMap: Record<string, string> = { narrow: 'max-w-lg', medium: 'max-w-2xl', wide: 'max-w-4xl' };
  const widthClass = widthMap[width] || widthMap.medium;

  return (
    <section className={sectionPadding} style={{ backgroundColor: background_color || 'var(--color-background)', color: text_color || 'var(--color-text)' }}>
      <div className={`container mx-auto px-4 sm:px-6 ${widthClass} mx-auto`}>
        {(title || description) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h2>}
            {description && <p className="mt-4 text-base text-stone-600">{description}</p>}
          </div>
        )}
        <div className="divide-y divide-stone-200">
          {faqs.map((block, i) => {
            const s = block.settings || {};
            const isOpen = openIndex === i;
            return (
              <div key={i} className="relative" style={isOpen ? { borderLeftColor: accent_color } : {}}>
                {isOpen && <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ backgroundColor: accent_color }} />}
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className={`w-full flex items-center justify-between py-5 ${isOpen ? 'pl-4' : 'pl-0'} text-left transition-all`}
                >
                  <span className={`text-base font-medium ${isOpen ? 'text-stone-900' : 'text-stone-700'}`}>
                    {s.question || s.title || `Question ${i + 1}`}
                  </span>
                  <span className="shrink-0 ml-4">
                    {isOpen ? <Minus size={18} className="text-stone-400" /> : <Plus size={18} className="text-stone-400" />}
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}>
                  <div className={`text-sm text-stone-600 leading-relaxed ${isOpen ? 'pl-4' : 'pl-0'}`}>
                    {s.answer || s.content || 'Add an answer to this question.'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'faq',
  name: 'FAQ',
  settings: [
    { type: 'text', id: 'title', label: 'Heading', default: 'Frequently Asked Questions' },
    { type: 'textarea', id: 'description', label: 'Description' },
    { type: 'select', id: 'width', label: 'Content Width', options: [{ value: 'narrow', label: 'Narrow' }, { value: 'medium', label: 'Medium' }, { value: 'wide', label: 'Wide' }], default: 'medium' },
    { type: 'color', id: 'background_color', label: 'Background Color' },
    { type: 'color', id: 'text_color', label: 'Text Color' },
    { type: 'color', id: 'accent_color', label: 'Accent Color', default: '#B45309' },
    { type: 'select', id: 'padding_y', label: 'Padding', options: [{ value: 'none', label: 'None' }, { value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }], default: 'large' },
  ],
  blocks: getSharedBlocks([
    {
      type: 'accordion', name: 'Question',
      settings: [
        { type: 'text', id: 'question', label: 'Question', default: 'What is your return policy?' },
        { type: 'textarea', id: 'answer', label: 'Answer', default: 'We offer a 30-day return policy on all items.' },
      ],
    },
  ]),
};
