import Image from 'next/image'
import Link from 'next/link'

// Static bestsellers — no DB call needed on the home page
const BESTSELLERS = [
  {
    name: 'Midnight Santal',
    category: 'Woody',
    price: '₦84,000',
    size: '30ml',
    image: '/images/Santal Noir.png',
    badge: 'Bestseller',
  },
  {
    name: 'Imperial Rose',
    category: 'Floral',
    price: '₦105,000',
    size: '30ml',
    image: '/images/Imperial Rose.png',
    badge: 'New',
  },
  {
    name: 'Desert Smoke',
    category: 'Oriental',
    price: '₦96,000',
    size: '30ml',
    image: '/images/Desert Smoke.png',
    badge: null,
  },
]

const COLLECTION_PREVIEWS = [
  { name: 'Luxe Bottle', image: '/images/Luxe Perfume Bottle.png' },
  { name: 'Lagos Morning', image: '/images/Lagos Morning Perfume.png' },
  { name: 'Desert Jasmine', image: '/images/Desert Jasmine Perfume.png' },
  { name: 'Artisanal', image: '/images/Artisanal laboratory.png' },
  { name: 'Bestseller', image: '/images/Bestseller perfume bottle.png' },
  { name: 'Sandalwood Noir', image: '/images/Sandalwood Noir Perfume.png' },
]

export default function HomePage() {
  return (
    <main className="bg-[#ad9772] text-[#F5EFE6] min-h-screen">

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-end overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/Luxurious perfume bottle close-up.png"
            alt="Aura Luxe signature bottle"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Dark gradient overlay — heavier at bottom so text pops */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#100E0B] via-[#100E0B]/60 to-transparent" />
        </div>

        {/* Hero text — bottom-left, matching Figma */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pb-16 sm:pb-24 w-full">
          <p className="text-xs uppercase tracking-[0.25em] text-[#B8924A] mb-4">
            The Art of Scent
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] mb-6 max-w-2xl">
            Define Your Aura<br />
            <em className="italic text-[#B8924A]">Precisely.</em>
          </h1>
          <p className="text-sm sm:text-base text-[#F5EFE6]/60 max-w-sm mb-8 leading-relaxed">
            Artisan fragrances crafted for the discerning, or build a signature
            blend entirely your own.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#B8924A] text-[#100E0B] text-xs uppercase tracking-[0.15em] font-medium hover:bg-[#C9A45A] transition-colors"
            >
              Explore Collection
            </Link>
            <Link
              href="/customizer"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-white/30 text-xs uppercase tracking-[0.15em] hover:border-[#B8924A] hover:text-[#B8924A] transition-colors"
            >
              Mix Your Own
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 z-10 hidden sm:flex flex-col items-center gap-2 text-white/30">
          <span className="text-[10px] uppercase tracking-[0.2em] rotate-90 origin-center translate-y-4">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ── MOST PURCHASED / BESTSELLERS ───────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#B8924A] mb-2">Curated for you</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
              Most Purchased
            </h2>
          </div>
          <Link
            href="/catalog"
            className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#F5EFE6]/50 hover:text-[#B8924A] transition-colors"
          >
            View all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {BESTSELLERS.map((item) => (
            <Link href="/catalog" key={item.name} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#1C1813] mb-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                {item.badge && (
                  <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 bg-[#B8924A] text-[#100E0B] font-medium">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#B8924A] mb-1">{item.category}</p>
              <h3 className="font-[family-name:var(--font-display)] text-lg mb-1 group-hover:text-[#B8924A] transition-colors">
                {item.name}
              </h3>
              <p className="text-sm text-[#F5EFE6]/50">
                {item.price} <span className="text-xs">/ {item.size}</span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── DIVIDER ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* ── THE COLLECTION GRID ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#B8924A] mb-2">Explore</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
              Our Collection
            </h2>
          </div>
          <Link
            href="/catalog"
            className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#F5EFE6]/50 hover:text-[#B8924A] transition-colors"
          >
            Full catalog
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Asymmetric grid — large left, 2×2 right, matching Figma layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Large feature tile */}
          <div className="col-span-2 sm:col-span-1 row-span-2 relative aspect-[4/5] sm:aspect-auto overflow-hidden bg-[#1C1813]">
            <Image
              src={COLLECTION_PREVIEWS[0].image}
              alt={COLLECTION_PREVIEWS[0].name}
              fill
              className="object-cover object-center hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* 4 smaller tiles */}
          {COLLECTION_PREVIEWS.slice(1, 5).map((item) => (
            <div key={item.name} className="relative aspect-square overflow-hidden bg-[#1C1813]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover object-center hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#F5EFE6]/50 hover:text-[#B8924A] transition-colors"
          >
            View full catalog
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* ── BESPOKE LAB CTA ─────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/Artisanal laboratory.png"
            alt="Bespoke Lab"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#100E0B]/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.25em] text-[#B8924A] mb-4">
              Bespoke Lab
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl leading-tight mb-6">
              Your Scent,<br />
              <em className="italic text-[#B8924A]">Digitally Mastered.</em>
            </h2>
            <p className="text-sm sm:text-base text-[#F5EFE6]/60 mb-8 leading-relaxed max-w-sm">
              Describe how you want to feel — confident, mysterious, like rain on
              warm earth — and our AI selects and blends the perfect notes for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/customizer"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#B8924A] text-[#100E0B] text-xs uppercase tracking-[0.15em] font-medium hover:bg-[#C9A45A] transition-colors"
              >
                Start Your Blend
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center px-8 py-3.5 border border-white/20 text-xs uppercase tracking-[0.15em] hover:border-[#B8924A] hover:text-[#B8924A] transition-colors"
              >
                Browse Ready-Made
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-white/10 mt-0">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div>
              <p className="font-[family-name:var(--font-display)] text-xl italic tracking-wide text-[#B8924A] mb-1">
                Aura Luxe
              </p>
              <p className="text-xs text-[#F5EFE6]/30">Artisan fragrances, Lagos.</p>
            </div>
            <nav className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.15em] text-[#F5EFE6]/40">
              <Link href="/catalog" className="hover:text-[#B8924A] transition-colors">Collections</Link>
              <Link href="/customizer" className="hover:text-[#B8924A] transition-colors">Bespoke Lab</Link>
              <Link href="/orders" className="hover:text-[#B8924A] transition-colors">Orders</Link>
            </nav>
            <p className="text-xs text-[#F5EFE6]/20">© 2026 Aura Luxe</p>
          </div>
        </div>
      </footer>

    </main>
  )
}