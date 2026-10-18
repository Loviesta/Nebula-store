import {
  HiOutlineArrowUpRight,
  HiOutlineHeart,
} from 'react-icons/hi2'

const Footer = () => {
  return (
    <footer id="about" className="bg-neutral-950 px-5 pb-8 pt-16 text-white sm:px-8 lg:px-12 lg:pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-2">
            <a
              href="#home"
              className="text-3xl font-extrabold tracking-[-0.08em]"
            >
              NEBULA<span className="text-orange-500">.</span>
            </a>

            <p className="mt-5 max-w-sm text-sm leading-7 text-neutral-400">
              Wear beyond limits. We create everyday essentials for people
              who express themselves without boundaries.
            </p>

            <a
              href="#shop"
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-400 transition hover:text-orange-300"
            >
              Explore Collection
              <HiOutlineArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-extrabold uppercase tracking-widest">
              Explore
            </h3>

            <div className="flex flex-col gap-4 text-sm text-neutral-400">
              <a href="#home" className="transition hover:text-white">
                Home
              </a>
              <a href="#shop" className="transition hover:text-white">
                Shop All
              </a>
              <a href="#collections" className="transition hover:text-white">
                Collections
              </a>
              <a href="#about" className="transition hover:text-white">
                About Us
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-extrabold uppercase tracking-widest">
              Customer Care
            </h3>

            <div className="flex flex-col gap-4 text-sm text-neutral-400">
              <a href="#about" className="transition hover:text-white">
                Contact Us
              </a>
              <a href="#about" className="transition hover:text-white">
                Shipping Information
              </a>
              <a href="#about" className="transition hover:text-white">
                Returns & Exchanges
              </a>
              <a href="#about" className="transition hover:text-white">
                FAQs
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-7 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 NEBULA. All rights reserved.</p>

          <p className="flex items-center gap-1">
            Designed with
            <HiOutlineHeart className="h-3.5 w-3.5 text-orange-500" />
            for the uncommon.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer