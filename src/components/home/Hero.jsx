import { useEffect, useState } from 'react'
import {
HiArrowUpRight,
HiChevronLeft,
HiChevronRight,
} from 'react-icons/hi2'

const slides = [
{
image:
'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=85',
alt: 'Modern streetwear fashion collection',
season: 'Season 01 / 2026',
title: 'BE UNCOMMON.',
},
{
image:
'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
alt: 'Contemporary streetwear fashion model',
season: 'Season 02 / 2026',
title: 'OWN YOUR STYLE.',
},
{
image:
'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85',
alt: 'Urban fashion editorial collection',
season: 'Season 03 / 2026',
title: 'STAND APART.',
},
{
image:
'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85',
alt: 'Fashion models wearing modern everyday outfits',
season: 'Season 04 / 2026',
title: 'DEFINE YOURSELF.',
},
]

const Hero = () => {
const [activeSlide, setActiveSlide] = useState(0)
const [paused, setPaused] = useState(false)

const nextSlide = () => {
setActiveSlide((current) => (current + 1) % slides.length)
}

const previousSlide = () => {
setActiveSlide(
(current) => (current - 1 + slides.length) % slides.length,
)
}

useEffect(() => {
if (paused) return undefined


const interval = window.setInterval(() => {
  setActiveSlide((current) => (current + 1) % slides.length)
}, 5000)

return () => window.clearInterval(interval)


}, [paused])

return ( <section
   id="home"
   className="relative isolate overflow-hidden bg-neutral-950 text-white"
 >
{/* Background Decoration */} <div className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl sm:h-[500px] sm:w-[500px]" />

```
  <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:min-h-[680px] lg:grid-cols-2 lg:px-12">
    {/* Hero Text */}
    <div className="relative z-10 max-w-2xl">
      <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/15 px-4 py-2">
        <span className="h-2 w-2 rounded-full bg-orange-500" />

        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-300 sm:text-xs">
          Introducing Collection 2026
        </span>
      </div>

      <h1 className="text-5xl font-extrabold leading-[0.98] tracking-[-0.07em] sm:text-7xl lg:text-8xl">
        DEFINE
        <br />
        YOUR OWN
        <br />
        <span className="text-orange-500">UNIVERSE.</span>
      </h1>

      <p className="mt-7 max-w-md text-sm leading-7 text-neutral-400 sm:text-base">
        Discover everyday essentials designed for those who refuse to
        blend in. Find your style. Own your universe.
      </p>

      <div className="mt-9 flex flex-wrap items-center gap-5">
        <a
          href="#shop"
          className="inline-flex items-center gap-3 bg-orange-500 px-6 py-4 text-xs font-extrabold uppercase tracking-wider text-white transition hover:bg-orange-600 sm:px-8"
        >
          Shop Collection
          <HiArrowUpRight className="h-4 w-4" />
        </a>

        <a
          href="#collections"
          className="text-xs font-bold uppercase tracking-wider text-white transition hover:text-orange-500"
        >
          Explore More
        </a>
      </div>

      <div className="mt-12 flex items-center gap-8 border-t border-white/10 pt-7 sm:gap-12">
        <div>
          <p className="text-2xl font-extrabold sm:text-3xl">01</p>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-neutral-500">
            New Season
          </p>
        </div>

        <div>
          <p className="text-2xl font-extrabold sm:text-3xl">100%</p>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-neutral-500">
            Original Style
          </p>
        </div>

        <div>
          <p className="text-2xl font-extrabold sm:text-3xl">∞</p>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-neutral-500">
            Possibilities
          </p>
        </div>
      </div>
    </div>

    {/* Hero Slideshow */}
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div className="absolute inset-6 rotate-6 border border-orange-500/30 sm:inset-10" />

      <div
        className="relative aspect-[4/5] overflow-hidden bg-neutral-800"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setPaused(false)
          }
        }}
        aria-roledescription="carousel"
        aria-label="NEBULA fashion collection"
      >
        {/* Images with fade transition */}
        {slides.map((slide, index) => (
          <img
            key={slide.image}
            src={slide.image}
            alt={slide.alt}
            loading={index === 0 ? 'eager' : 'lazy'}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === activeSlide
                ? 'z-10 opacity-100'
                : 'z-0 opacity-0'
            }`}
          />
        ))}

        {/* Image Overlay */}
        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/75 via-transparent to-black/10" />

        {/* Slide Content */}
        <div className="absolute bottom-6 left-6 right-6 z-30 flex items-end justify-between gap-3 sm:bottom-8 sm:left-8 sm:right-8">
          <div className="min-w-0">
            <p
              key={`season-${activeSlide}`}
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-400"
            >
              {slides[activeSlide].season}
            </p>

            <p
              key={`title-${activeSlide}`}
              className="mt-2 text-xl font-extrabold tracking-tight sm:text-3xl"
            >
              {slides[activeSlide].title}
            </p>
          </div>

          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40">
            <HiArrowUpRight className="h-5 w-5" />
          </span>
        </div>

        {/* Previous Button */}
        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm transition hover:border-orange-500 hover:bg-orange-500 sm:left-5"
        >
          <HiChevronLeft className="h-5 w-5" />
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm transition hover:border-orange-500 hover:bg-orange-500 sm:right-5"
        >
          <HiChevronRight className="h-5 w-5" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-3 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 sm:bottom-4">
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={activeSlide === index ? 'true' : undefined}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeSlide === index
                  ? 'w-7 bg-orange-500'
                  : 'w-1.5 bg-white/70 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="absolute -bottom-4 -left-2 z-40 bg-orange-500 px-5 py-3 text-xs font-extrabold uppercase tracking-widest text-white sm:-left-5 sm:px-7 sm:py-4">
        Wear Beyond Limits.
      </div>
    </div>
  </div>
</section>
)
}

export default Hero
