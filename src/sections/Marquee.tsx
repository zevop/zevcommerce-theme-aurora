'use client';

export default function Marquee({ settings }: { settings: any }) {
  const { text = 'Welcome to our store', speed = 'medium', background_color = '#1C1917', text_color = '#FAFAF9', padding_y = 'small', separator = '✦' } = settings;
  const paddingMap: Record<string, string> = { none: 'py-0', small: 'py-4', medium: 'py-6', large: 'py-10' };
  const sectionPadding = paddingMap[padding_y] || paddingMap.small;
  const speedMap: Record<string, string> = { slow: '40s', medium: '25s', fast: '15s' };
  const duration = speedMap[speed] || speedMap.medium;

  const repeatedText = Array(10).fill(`${text} ${separator} `).join('');

  return (
    <section className={`overflow-hidden ${sectionPadding}`} style={{ backgroundColor: background_color, color: text_color }}>
      <div className="whitespace-nowrap">
        <div
          className="inline-block animate-marquee text-sm md:text-base font-medium tracking-widest uppercase"
          style={{ animationDuration: duration }}
        >
          {repeatedText}
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee linear infinite;
        }
      `}</style>
    </section>
  );
}

export const schema = {
  type: 'marquee',
  name: 'Scrolling Text',
  settings: [
    { type: 'text', id: 'text', label: 'Text', default: 'Free shipping on all orders' },
    { type: 'text', id: 'separator', label: 'Separator', default: '✦' },
    { type: 'select', id: 'speed', label: 'Speed', options: [{ value: 'slow', label: 'Slow' }, { value: 'medium', label: 'Medium' }, { value: 'fast', label: 'Fast' }], default: 'medium' },
    { type: 'color', id: 'background_color', label: 'Background', default: '#1C1917' },
    { type: 'color', id: 'text_color', label: 'Text Color', default: '#FAFAF9' },
    { type: 'select', id: 'padding_y', label: 'Padding', options: [{ value: 'none', label: 'None' }, { value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }], default: 'small' },
  ],
};
