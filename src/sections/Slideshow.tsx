'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BlockRenderer } from '@zevcommerce/storefront-api';
import { getSharedBlocks } from '@zevcommerce/theme-sdk';

export default function Slideshow({ settings, blocks }: { settings: any; blocks: any[] }) {
  const [current, setCurrent] = useState(0);
  const slides = blocks.filter(b => b.type === 'slide');
  const { height = 'large', autoplay = true, autoplay_speed = 5, show_arrows = true, show_dots = true } = settings;

  const heightMap: Record<string, string> = { small: 'min-h-[400px]', medium: 'min-h-[550px]', large: 'min-h-[700px]', full: 'min-h-screen' };
  const heightClass = heightMap[height] || heightMap.large;

  const next = useCallback(() => setCurrent(c => (c + 1) % Math.max(slides.length, 1)), [slides.length]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % Math.max(slides.length, 1)), [slides.length]);

  useEffect(() => {
    if (!autoplay || slides.length <= 1) return;
    const timer = setInterval(next, autoplay_speed * 1000);
    return () => clearInterval(timer);
  }, [autoplay, autoplay_speed, slides.length, next]);

  if (slides.length === 0) {
    return (
      <div className={`${heightClass} bg-stone-100 flex items-center justify-center`}>
        <p className="text-stone-400">Add slide blocks to this section</p>
      </div>
    );
  }

  const resolveImage = (img: any) => typeof img === 'string' ? img : img?.url;

  return (
    <div className={`relative ${heightClass} overflow-hidden bg-stone-900`}>
      {slides.map((slide, i) => {
        const s = slide.settings || {};
        const bgImage = resolveImage(s.image);
        const overlayOpacity = (s.overlay_opacity ?? 40) / 100;
        const alignH = s.content_horizontal || 'center';
        const alignV = s.content_vertical || 'center';
        const hMap: Record<string, string> = { left: 'items-start text-left', center: 'items-center text-center', right: 'items-end text-right' };
        const vMap: Record<string, string> = { top: 'justify-start pt-24', center: 'justify-center', bottom: 'justify-end pb-24' };

        return (
          <div
            key={i}
            className={`absolute inset-0 flex flex-col ${hMap[alignH] || hMap.center} ${vMap[alignV] || vMap.center} transition-opacity duration-700 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            style={{ backgroundImage: bgImage ? `url("${bgImage}")` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />
            <div className="relative z-10 container mx-auto px-4 sm:px-6 text-white max-w-3xl">
              {s.heading && <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>{s.heading}</h2>}
              {s.description && <p className="text-base md:text-lg mb-6 opacity-90 max-w-xl">{s.description}</p>}
              {s.button_text && s.button_link && (
                <a href={s.button_link} className="inline-flex items-center h-12 px-8 bg-white text-stone-900 rounded-lg text-sm font-medium uppercase tracking-wider hover:bg-stone-100 transition-colors">
                  {s.button_text}
                </a>
              )}
            </div>
          </div>
        );
      })}

      {/* Arrows */}
      {show_arrows && slides.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <ChevronLeft size={22} />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Dots */}
      {show_dots && slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-6' : 'bg-white/50'}`} />
          ))}
        </div>
      )}
    </div>
  );
}

export const schema = {
  type: 'slideshow',
  name: 'Slideshow',
  settings: [
    { type: 'select', id: 'height', label: 'Height', options: [{ value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }, { value: 'full', label: 'Full Screen' }], default: 'large' },
    { type: 'checkbox', id: 'autoplay', label: 'Autoplay', default: true },
    { type: 'range', id: 'autoplay_speed', label: 'Autoplay Speed (seconds)', min: 2, max: 10, step: 1, default: 5 },
    { type: 'checkbox', id: 'show_arrows', label: 'Show Arrows', default: true },
    { type: 'checkbox', id: 'show_dots', label: 'Show Dots', default: true },
  ],
  blocks: getSharedBlocks([
    {
      type: 'slide', name: 'Slide',
      settings: [
        { type: 'image', id: 'image', label: 'Background Image' },
        { type: 'text', id: 'heading', label: 'Heading', default: 'Slide Heading' },
        { type: 'textarea', id: 'description', label: 'Description' },
        { type: 'text', id: 'button_text', label: 'Button Text', default: 'Shop Now' },
        { type: 'text', id: 'button_link', label: 'Button Link', default: '/collections/all' },
        { type: 'range', id: 'overlay_opacity', label: 'Overlay Opacity', min: 0, max: 100, step: 5, default: 40 },
        { type: 'select', id: 'content_horizontal', label: 'Horizontal Position', options: [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }], default: 'center' },
        { type: 'select', id: 'content_vertical', label: 'Vertical Position', options: [{ value: 'top', label: 'Top' }, { value: 'center', label: 'Center' }, { value: 'bottom', label: 'Bottom' }], default: 'center' },
      ],
    },
  ]),
};
