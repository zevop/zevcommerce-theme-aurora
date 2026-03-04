'use client';

import Link from 'next/link';
import { Search, User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useTheme, resolveMenuUrl, getStorePermalink, useCartStore } from '@zevcommerce/storefront-api';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';

function NavDropdown({ item, domain }: { item: any; domain: string }) {
  const itemUrl = resolveMenuUrl(item, domain);

  if (!item.children || item.children.length === 0) {
    return (
      <Link
        href={itemUrl}
        className="text-sm tracking-wide text-stone-600 hover:text-stone-900 transition-colors whitespace-nowrap"
      >
        {item.title}
      </Link>
    );
  }

  return (
    <div className="relative group/menu">
      <button className="flex items-center gap-1.5 text-sm tracking-wide text-stone-600 group-hover/menu:text-stone-900 transition-colors whitespace-nowrap py-4">
        {item.title}
        <ChevronDown className="h-3 w-3 transition-transform group-hover/menu:rotate-180" />
      </button>
      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 translate-y-2 invisible group-hover/menu:opacity-100 group-hover/menu:translate-y-0 group-hover/menu:visible transition-all duration-200 z-[100]">
        <div className="bg-white border border-stone-100 shadow-xl rounded-xl py-2 min-w-[220px]">
          {item.children.map((child: any) => (
            <Link
              key={child.id}
              href={resolveMenuUrl(child, domain)}
              className="block px-5 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
            >
              {child.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Header({ settings }: { settings: any }) {
  const { storeConfig, menus } = useTheme();
  const { openCart, items } = useCartStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const params = useParams();

  const domain = (params?.domain as string) || storeConfig?.handle || '';
  const { logo: themeLogo, menuHandle, showSearch = true, showCart = true, showAccount = true, layout = 'centered' } = settings;
  const logoSrc = themeLogo || storeConfig?.storeLogo;
  const storeName = storeConfig?.name || 'Store';

  const availableMenus = Object.values(menus || {});
  const defaultMenu = availableMenus.find((m: any) => m.isDefault);
  const activeMenu = (menuHandle && menus?.[menuHandle]) || defaultMenu || availableMenus[0];
  const menuItems = (activeMenu as any)?.items || [];
  const accountsEnabled = !!storeConfig?.accountConfig?.loginEnabled;

  // Scroll detection for transparent-to-solid transition
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Search suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 2) {
        try {
          const { getProducts } = await import('@zevcommerce/storefront-api');
          const { data } = await getProducts(domain, 1, 5, searchQuery);
          setSuggestions(data);
          setShowSuggestions(true);
        } catch { setSuggestions([]); }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, domain]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (!searchQuery.trim()) return;
    router.push(getStorePermalink(domain, `/search?q=${encodeURIComponent(searchQuery)}`));
    setIsSearchOpen(false);
  };

  const isCentered = layout === 'centered';

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm'
            : 'bg-white border-b border-stone-100'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          {isCentered ? (
            /* Centered layout: icons | nav | LOGO | nav | icons */
            <div className="flex items-center justify-between h-16 md:h-20">
              {/* Left: Mobile menu + Search */}
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="md:hidden text-stone-500 hover:text-stone-900 transition-colors p-1"
                >
                  <Menu className="h-5 w-5" />
                </button>
                {showSearch && (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className={`text-stone-500 hover:text-stone-900 transition-colors p-1 ${isSearchOpen ? 'invisible' : ''}`}
                  >
                    <Search className="h-5 w-5" />
                  </button>
                )}
                <nav className="hidden md:flex items-center gap-8">
                  {menuItems.slice(0, Math.ceil(menuItems.length / 2)).map((item: any) => (
                    <NavDropdown key={item.id} item={item} domain={domain} />
                  ))}
                </nav>
              </div>

              {/* Center: Logo */}
              <div className="flex-shrink-0 px-4">
                <Link href={getStorePermalink(domain, '/')} className="block">
                  {logoSrc ? (
                    <img src={logoSrc} alt={storeName} className="h-8 md:h-10 w-auto object-contain" />
                  ) : (
                    <span className="text-xl md:text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                      {storeName}
                    </span>
                  )}
                </Link>
              </div>

              {/* Right: Nav + Icons */}
              <div className="flex items-center justify-end gap-3 flex-1">
                <nav className="hidden md:flex items-center gap-8 mr-4">
                  {menuItems.slice(Math.ceil(menuItems.length / 2)).map((item: any) => (
                    <NavDropdown key={item.id} item={item} domain={domain} />
                  ))}
                </nav>
                {showAccount && accountsEnabled && (
                  <Link
                    href={getStorePermalink(domain, '/account')}
                    className="text-stone-500 hover:text-stone-900 transition-colors p-1"
                  >
                    <User className="h-5 w-5" />
                  </Link>
                )}
                {showCart && (
                  <button
                    onClick={openCart}
                    className="text-stone-500 hover:text-stone-900 transition-colors relative p-1 group"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    {items.length > 0 && (
                      <span className="absolute -top-0.5 -right-1 bg-amber-700 text-white text-[9px] min-w-[16px] h-4 rounded-full flex items-center justify-center px-1 font-medium">
                        {items.length}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Left-aligned layout (same as standard) */
            <div className="flex items-center justify-between h-16 md:h-20">
              <div className="flex items-center gap-8">
                <Link href={getStorePermalink(domain, '/')} className="text-xl font-bold tracking-tight shrink-0">
                  {logoSrc ? (
                    <img src={logoSrc} alt={storeName} className="h-8 md:h-10 w-auto object-contain" />
                  ) : (
                    <span style={{ fontFamily: 'var(--font-heading)' }}>{storeName}</span>
                  )}
                </Link>
                <nav className="hidden md:flex items-center gap-8">
                  {menuItems.map((item: any) => (
                    <NavDropdown key={item.id} item={item} domain={domain} />
                  ))}
                </nav>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-stone-500 hover:text-stone-900 p-1">
                  <Menu className="h-5 w-5" />
                </button>
                {showSearch && (
                  <button onClick={() => setIsSearchOpen(true)} className="text-stone-500 hover:text-stone-900 p-1">
                    <Search className="h-5 w-5" />
                  </button>
                )}
                {showAccount && accountsEnabled && (
                  <Link href={getStorePermalink(domain, '/account')} className="text-stone-500 hover:text-stone-900 p-1">
                    <User className="h-5 w-5" />
                  </Link>
                )}
                {showCart && (
                  <button onClick={openCart} className="text-stone-500 hover:text-stone-900 relative p-1">
                    <ShoppingBag className="h-5 w-5" />
                    {items.length > 0 && (
                      <span className="absolute -top-0.5 -right-1 bg-amber-700 text-white text-[9px] min-w-[16px] h-4 rounded-full flex items-center justify-center px-1 font-medium">
                        {items.length}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Search Overlay */}
          <div className={`absolute inset-0 z-10 bg-white flex items-center px-4 transition-all duration-300 ${isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
            <div className="w-full max-w-2xl mx-auto relative">
              <form onSubmit={handleSearch} className="relative flex items-center w-full">
                <Search className="absolute left-0 h-5 w-5 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search our store..."
                  className="w-full pl-8 pr-12 py-2 text-lg border-b-2 border-stone-200 focus:border-stone-900 outline-none bg-transparent placeholder:text-stone-300 transition-colors"
                  autoFocus={isSearchOpen}
                />
                <button type="button" onClick={() => { setIsSearchOpen(false); setSuggestions([]); }} className="absolute right-0 p-2 text-stone-400 hover:text-stone-900 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </form>
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-stone-100 overflow-hidden z-50">
                  <div className="py-2">
                    <h3 className="px-4 py-2 text-xs font-semibold text-stone-400 uppercase tracking-wider">Products</h3>
                    {suggestions.map((product) => (
                      <Link
                        key={product.id}
                        href={getStorePermalink(domain, `/products/${product.slug}`)}
                        onClick={() => { setIsSearchOpen(false); setSuggestions([]); }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors"
                      >
                        <div className="h-10 w-10 bg-stone-100 rounded-lg overflow-hidden shrink-0">
                          {product.media?.[0]?.url ? (
                            <img src={product.media[0].url} alt={product.title} className="object-cover w-full h-full" />
                          ) : (
                            <ShoppingBag className="h-5 w-5 text-stone-400 m-auto mt-2.5" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-stone-900 line-clamp-1">{product.title}</p>
                          <p className="text-xs text-stone-500">₦{parseFloat(product.variants?.[0]?.price || '0').toLocaleString()}</p>
                        </div>
                      </Link>
                    ))}
                    <button onClick={handleSearch} className="w-full text-left px-4 py-3 text-sm text-amber-700 font-medium hover:bg-stone-50 transition-colors border-t border-stone-100">
                      View all results for &quot;{searchQuery}&quot;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] md:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-5 border-b border-stone-100">
              <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{storeName}</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-stone-400 hover:text-stone-900">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="p-5 space-y-1">
              {menuItems.map((item: any) => (
                <Link
                  key={item.id}
                  href={resolveMenuUrl(item, domain)}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 text-base text-stone-700 hover:text-stone-900 border-b border-stone-50 transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export const schema = {
  type: 'header',
  name: 'Header',
  settings: [
    { type: 'image', id: 'logo', label: 'Logo Image' },
    { type: 'image', id: 'favicon', label: 'Favicon Image' },
    {
      type: 'select', id: 'layout', label: 'Layout',
      options: [
        { value: 'centered', label: 'Centered Logo' },
        { value: 'left', label: 'Left Aligned' },
      ],
      default: 'centered',
    },
    { type: 'link_list', id: 'menuHandle', label: 'Main Menu', default: 'main-menu' },
    { type: 'checkbox', id: 'showSearch', label: 'Show Search', default: true },
    { type: 'checkbox', id: 'showAccount', label: 'Show Account', default: true },
    { type: 'checkbox', id: 'showCart', label: 'Show Cart', default: true },
  ],
};
