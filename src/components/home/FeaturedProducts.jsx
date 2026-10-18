import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  HiOutlineHeart,
  HiHeart,
  HiOutlineShoppingBag,
  HiStar,
  HiOutlineAdjustmentsHorizontal,
} from 'react-icons/hi2'

import { HiOutlineSearch } from 'react-icons/hi'

import products from '../../data/Products'
import SectionHeading from '../ui/SectionHeading'

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)
}

const categories = [
  'All Products',
  'T-Shirts',
  'Hoodies',
  'Pants',
  'Outerwear',
]

const priceRanges = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under Rp200.000', value: 'under-200' },
  { label: 'Rp200.000 - Rp300.000', value: '200-300' },
  { label: 'Rp300.000 - Rp400.000', value: '300-400' },
  { label: 'Above Rp400.000', value: 'above-400' },
]

const FeaturedProducts = () => {
  const [message, setMessage] = useState('')
  const [activeCategory, setActiveCategory] = useState('All Products')
  const [activePrice, setActivePrice] = useState('all')
  const [wishlist, setWishlist] = useState([])

  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  // Membaca Wishlist dari localStorage
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const savedWishlist = JSON.parse(
          localStorage.getItem('nebula-wishlist') || '[]',
        )

        setWishlist(Array.isArray(savedWishlist) ? savedWishlist : [])
      } catch (error) {
        console.error('Failed to load wishlist:', error)
        setWishlist([])
      }
    }

    loadWishlist()

    window.addEventListener('storage', loadWishlist)
    window.addEventListener('nebula-wishlist-updated', loadWishlist)

    return () => {
      window.removeEventListener('storage', loadWishlist)
      window.removeEventListener('nebula-wishlist-updated', loadWishlist)
    }
  }, [])

  // Memperbarui URL ketika kata pencarian dihapus
  const handleClearSearch = () => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('search')
    setSearchParams(nextParams, { replace: true })
  }

  // Filter pencarian, kategori, dan harga
  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return products.filter((product) => {
      const matchesSearch =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery)

      const matchesCategory =
        activeCategory === 'All Products' ||
        product.category === activeCategory

      let matchesPrice = true

      switch (activePrice) {
        case 'under-200':
          matchesPrice = product.price < 200000
          break

        case '200-300':
          matchesPrice =
            product.price >= 200000 && product.price <= 300000
          break

        case '300-400':
          matchesPrice =
            product.price > 300000 && product.price <= 400000
          break

        case 'above-400':
          matchesPrice = product.price > 400000
          break

        default:
          matchesPrice = true
      }

      return matchesSearch && matchesCategory && matchesPrice
    })
  }, [searchQuery, activeCategory, activePrice])

  // Menambahkan produk ke keranjang
  const handleAddToCart = (product) => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem('nebula-cart') || '[]',
      )

      const cart = Array.isArray(savedCart) ? savedCart : []

      const existingItem = cart.find(
        (item) =>
          item.id === product.id &&
          !item.selectedSize &&
          !item.selectedColor,
      )

      let updatedCart

      if (existingItem) {
        updatedCart = cart.map((item) =>
          item.id === product.id &&
          !item.selectedSize &&
          !item.selectedColor
            ? { ...item, quantity: (Number(item.quantity) || 0) + 1 }
            : item,
        )
      } else {
        updatedCart = [
          ...cart,
          {
            ...product,
            quantity: 1,
          },
        ]
      }

      localStorage.setItem('nebula-cart', JSON.stringify(updatedCart))

      window.dispatchEvent(new Event('nebula-cart-updated'))

      setMessage(`${product.name} added to cart!`)

      window.setTimeout(() => {
        setMessage('')
      }, 2500)
    } catch (error) {
      console.error('Failed to add product to cart:', error)
      setMessage('Unable to add product. Please try again.')
    }
  }

  // Menambah atau menghapus produk dari Wishlist
  const handleToggleWishlist = (product) => {
    try {
      const savedWishlist = JSON.parse(
        localStorage.getItem('nebula-wishlist') || '[]',
      )

      const currentWishlist = Array.isArray(savedWishlist)
        ? savedWishlist
        : []

      const isFavorite = currentWishlist.some(
        (item) => item.id === product.id,
      )

      let updatedWishlist

      if (isFavorite) {
        updatedWishlist = currentWishlist.filter(
          (item) => item.id !== product.id,
        )

        setMessage(`${product.name} removed from wishlist.`)
      } else {
        updatedWishlist = [...currentWishlist, product]

        setMessage(`${product.name} added to wishlist!`)
      }

      localStorage.setItem(
        'nebula-wishlist',
        JSON.stringify(updatedWishlist),
      )

      setWishlist(updatedWishlist)

      window.dispatchEvent(new Event('nebula-wishlist-updated'))

      window.setTimeout(() => {
        setMessage('')
      }, 2500)
    } catch (error) {
      console.error('Failed to update wishlist:', error)
      setMessage('Unable to update wishlist. Please try again.')
    }
  }

  // Mereset seluruh filter dan pencarian
  const handleResetFilters = () => {
    setActiveCategory('All Products')
    setActivePrice('all')

    if (searchQuery) {
      const nextParams = new URLSearchParams(searchParams)
      nextParams.delete('search')
      setSearchParams(nextParams, { replace: true })
    }
  }

  // Mengarahkan pengguna ke katalog saat hasil pencarian berubah
  useEffect(() => {
    if (searchQuery) {
      const timer = window.setTimeout(() => {
        document.getElementById('shop')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 200)

      return () => window.clearTimeout(timer)
    }
  }, [searchQuery])

  return (
    <section
      id="shop"
      className="scroll-mt-24 bg-neutral-50 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Curated for You"
          title="Featured Products."
          description="Explore our latest essentials. Carefully selected for comfort, quality, and everyday expression."
        />

        {/* Notification */}
        {message && (
          <div
            role="status"
            className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {message}
          </div>
        )}

        {/* Search Results Information */}
        {searchQuery && (
          <div className="mb-8 flex flex-col gap-3 border border-orange-200 bg-orange-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <HiOutlineSearch className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />

              <div>
                <p className="text-sm font-bold text-neutral-950">
                  Search results for &quot;{searchQuery}&quot;
                </p>

                <p className="mt-1 text-xs text-neutral-600">
                  Found {filteredProducts.length}{' '}
                  {filteredProducts.length === 1 ? 'product' : 'products'}{' '}
                  matching your search and filters.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearSearch}
              className="self-start text-xs font-extrabold uppercase tracking-wider text-orange-600 transition hover:text-neutral-950 sm:self-center"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Category Filters */}
        <div className="mb-8">
          <p className="mb-4 text-xs font-extrabold uppercase tracking-widest text-neutral-950">
            Shop by Category
          </p>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const isActive = activeCategory === category

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={isActive}
                  className={`border px-4 py-2.5 text-xs font-bold transition ${
                    isActive
                      ? 'border-neutral-950 bg-neutral-950 text-white'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-950 hover:text-neutral-950'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </div>

        {/* Price Filter and Product Count */}
        <div className="mb-8 flex flex-col gap-4 border-y border-neutral-200 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <label
              htmlFor="price-filter"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-700"
            >
              <HiOutlineAdjustmentsHorizontal className="h-4 w-4" />
              Filter by Price
            </label>

            <select
              id="price-filter"
              value={activePrice}
              onChange={(event) => setActivePrice(event.target.value)}
              className="min-h-10 border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 outline-none transition focus:border-orange-500"
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs text-neutral-500">
            Showing{' '}
            <span className="font-bold text-neutral-950">
              {filteredProducts.length}
            </span>{' '}
            of{' '}
            <span className="font-bold text-neutral-950">
              {products.length}
            </span>{' '}
            products
          </p>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4 lg:gap-y-10">
            {filteredProducts.map((product) => {
              const isFavorite = wishlist.some(
                (item) => item.id === product.id,
              )

              return (
                <article key={product.id} className="group">
                  {/* Product Image */}
                  <div className="relative overflow-hidden bg-neutral-200">
                    <Link
                      to={`/product/${product.id}`}
                      aria-label={`View ${product.name}`}
                      className="block aspect-[3/4] overflow-hidden"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    </Link>

                    {/* Product Badge */}
                    {product.badge && (
                      <span className="pointer-events-none absolute left-3 top-3 bg-white px-2 py-1 text-[9px] font-extrabold tracking-wider text-neutral-950 sm:left-4 sm:top-4 sm:px-3 sm:py-2">
                        {product.badge}
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      aria-label={
                        isFavorite
                          ? `Remove ${product.name} from wishlist`
                          : `Add ${product.name} to wishlist`
                      }
                      aria-pressed={isFavorite}
                      onClick={() => handleToggleWishlist(product)}
                      className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white transition sm:right-4 sm:top-4 ${
                        isFavorite
                          ? 'text-orange-500'
                          : 'text-neutral-800 hover:bg-orange-500 hover:text-white'
                      }`}
                    >
                      {isFavorite ? (
                        <HiHeart className="h-5 w-5" />
                      ) : (
                        <HiOutlineHeart className="h-5 w-5" />
                      )}
                    </button>

                    {/* Add to Cart */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="absolute inset-x-2 bottom-2 z-10 flex translate-y-0 items-center justify-center gap-2 bg-white py-3 text-[10px] font-extrabold uppercase tracking-wider text-neutral-950 transition hover:bg-orange-500 hover:text-white sm:inset-x-4 sm:bottom-4 sm:text-xs lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
                    >
                      <HiOutlineShoppingBag className="h-4 w-4" />
                      Add to Cart
                    </button>
                  </div>

                  {/* Product Information */}
                  <div className="pt-4">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 sm:text-xs">
                        {product.category}
                      </p>

                      <div className="flex items-center gap-1">
                        <HiStar className="h-3.5 w-3.5 text-orange-500" />

                        <span className="text-[10px] font-semibold text-neutral-600 sm:text-xs">
                          {product.rating}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/product/${product.id}`}
                      className="text-xs font-bold text-neutral-950 transition hover:text-orange-500 sm:text-sm"
                    >
                      {product.name}
                    </Link>

                    <p className="mt-2 text-xs font-extrabold text-neutral-950 sm:text-sm">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          /* No Products Found */
          <div className="flex flex-col items-center justify-center border border-dashed border-neutral-300 bg-white px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
              <HiOutlineSearch className="h-7 w-7 text-neutral-400" />
            </div>

            <h3 className="mt-5 text-lg font-black text-neutral-950">
              No Products Found.
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
              {searchQuery
                ? `We couldn't find any products matching "${searchQuery}" with your selected filters. Try another search term or reset the filters.`
                : "We couldn't find products matching your selected filters. Try another category or price range."}
            </p>

            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-6 bg-neutral-950 px-6 py-3 text-xs font-extrabold uppercase tracking-widest text-white transition hover:bg-orange-500"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* View All Products */}
        <div className="mt-12 text-center sm:mt-16">
          <button
            type="button"
            onClick={handleResetFilters}
            className="border border-neutral-950 px-8 py-4 text-xs font-extrabold uppercase tracking-widest transition hover:bg-neutral-950 hover:text-white"
          >
            View All Products
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts