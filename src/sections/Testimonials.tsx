'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getSharedBlocks } from '@zevcommerce/theme-sdk';

export default function Testimonials({ settings, blocks }: { settings: any; blocks: any[] }) {
  const [current, setCurrent] = useState(0);
  const { background_color, text_color, padding_y = 'large', accent_color = '#B45309' } = settings;
  const testimonials = blocks.filter(b => b.type === 'testimonial');

  const paddingMap: Record<string, string> = { none: 'py-0', small: 'py-8', medium: 'py-16', large: 'py-24' };
  const sectionPadding = paddingMap[padding_y] || paddingMap.large;

  if (testimonials.length === 0) {
    return (
      <section className={`${sectionPadding} text-center`} style={{ backgroundColor: background_color || 'var(--color-background)' }}>
        <p className="text-stone-400">Add testimonial blocks to this section</p>
      </section>
    );
  }

  const active = testimonials[current]?.settings || {};

  const prev = () => setCurrent(c => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent(c => (c + 1) % testimonials.length);

  return (
    <section className={sectionPadding} style={{ backgroundColor: background_color || 'var(--color-background)', color: text_color || 'var(--color-text)' }}>
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
        {/* Decorative quote mark */}
        <div className="text-6xl md:text-7xl leading-none mb-6 select-none" style={{ fontFamily: 'var(--font-accent, Georgia)', color: accent_color, opacity: 0.3 }}>
          &ldquo;
        </div>

        {/* Quote */}
        <blockquote className="text-xl md:text-2xl lg:text-3xl leading-relaxed font-light mb-8" style={{ fontFamily: 'var(--font-accent, Georgia)' }}>
          {active.quote || 'Add a testimonial quote'}
        </blockquote>

        {/* Author */}
        <div className="flex flex-col items-center gap-3">
          {active.avatar && (
            <img
              src={typeof active.avatar === 'string' ? active.avatar : active.avatar?.url}
              alt={active.author || ''}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div>
            {active.author && <p className="text-sm font-semibold" style={{ color: 'var(--color-heading)' }}>{active.author}</p>}
            {active.title && <p className="text-xs text-stone-500 mt-0.5">{active.title}</p>}
          </div>
        </div>

        {/* Navigation */}
        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <button onClick={prev} className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-stone-900' : 'bg-stone-300'}`} />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export const schema = {
  type: 'testimonials',
  name: 'Testimonials',
  settings: [
    { type: 'color', id: 'background_color', label: 'Background Color' },
    { type: 'color', id: 'text_color', label: 'Text Color' },
    { type: 'color', id: 'accent_color', label: 'Quote Mark Color', default: '#B45309' },
    { type: 'select', id: 'padding_y', label: 'Padding', options: [{ value: 'none', label: 'None' }, { value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }], default: 'large' },
  ],
  blocks: getSharedBlocks([
    {
      type: 'testimonial', name: 'Testimonial',
      settings: [
        { type: 'textarea', id: 'quote', label: 'Quote', default: 'This product exceeded all my expectations. Beautiful quality and fast shipping.' },
        { type: 'text', id: 'author', label: 'Author Name', default: 'Sarah M.' },
        { type: 'text', id: 'title', label: 'Author Title', default: 'Verified Buyer' },
        { type: 'image', id: 'avatar', label: 'Author Photo' },
      ],
    },
  ]),
};
