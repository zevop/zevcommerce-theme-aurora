export default function Video({ settings }: { settings: any }) {
  const { url, autoplay = false, padding_y = 'large', title, description, background_color } = settings;
  const paddingMap: Record<string, string> = { none: 'py-0', small: 'py-8', medium: 'py-16', large: 'py-24' };
  const sectionPadding = paddingMap[padding_y] || paddingMap.large;

  const getEmbedUrl = (rawUrl: string) => {
    if (!rawUrl) return null;
    const ytMatch = rawUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0${autoplay ? '&autoplay=1&mute=1' : ''}`;
    const vimeoMatch = rawUrl.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?${autoplay ? 'autoplay=1&muted=1' : ''}`;
    return rawUrl;
  };

  const embedUrl = getEmbedUrl(url);
  const isDirectVideo = url && (url.endsWith('.mp4') || url.endsWith('.webm'));

  return (
    <section className={sectionPadding} style={{ backgroundColor: background_color || 'var(--color-background)' }}>
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {(title || description) && (
          <div className="text-center mb-10">
            {title && <h2 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h2>}
            {description && <p className="mt-3 text-base text-stone-600">{description}</p>}
          </div>
        )}
        <div className="relative overflow-hidden rounded-2xl bg-stone-900 shadow-xl">
          {isDirectVideo ? (
            <video src={url} autoPlay={autoplay} muted={autoplay} loop playsInline controls className="w-full aspect-video" />
          ) : embedUrl ? (
            <iframe src={embedUrl} className="w-full aspect-video" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title={title || 'Video'} />
          ) : (
            <div className="aspect-video flex items-center justify-center text-stone-400">
              <p>Enter a YouTube, Vimeo, or video URL</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'video',
  name: 'Video',
  settings: [
    { type: 'text', id: 'url', label: 'Video URL', default: '' },
    { type: 'text', id: 'title', label: 'Heading' },
    { type: 'textarea', id: 'description', label: 'Description' },
    { type: 'checkbox', id: 'autoplay', label: 'Autoplay (muted)', default: false },
    { type: 'color', id: 'background_color', label: 'Background Color' },
    { type: 'select', id: 'padding_y', label: 'Padding', options: [{ value: 'none', label: 'None' }, { value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }], default: 'large' },
  ],
};
