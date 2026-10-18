import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  HiOutlineShoppingBag,
  HiOutlineSearch,
  HiOutlineHeart,
  HiOutlineMenuAlt3,
  HiOutlineX,
} from 'react-icons/hi'
import {
  HiOutlineClipboardDocumentList,
} from 'react-icons/hi2'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const [orderCount, setOrderCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  const location = useLocation()
  const navigate = useNavigate()

  // Membaca jumlah barang dari Shopping Cart
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const savedCart = JSON.parse(
          localStorage.getItem('nebula-cart') || '[]',
        )

        const totalItems = Array.isArray(savedCart)
          ? savedCart.reduce(
              (total, item) => total + (Number(item.quantity) || 0),
              0,
            )
          : 0

        setCartCount(totalItems)
      } catch (error) {
        console.error('Failed to read cart:', error)
        setCartCount(0)
      }
    }

    updateCartCount()

    window.addEventListener('nebula-cart-updated', updateCartCount)
    window.addEventListener('storage', updateCartCount)

    return () => {
      window.removeEventListener('nebula-cart-updated', updateCartCount)
      window.removeEventListener('storage', updateCartCount)
    }
  }, [location.pathname])

  // Membaca jumlah pesanan dari Order History
  useEffect(() => {
    const updateOrderCount = () => {
      try {
        const savedOrders = JSON.parse(
          localStorage.getItem('nebula-orders') || '[]',
        )

        setOrderCount(
          Array.isArray(savedOrders) ? savedOrders.length : 0,
        )
      } catch (error) {
        console.error('Failed to read order history:', error)
        setOrderCount(0)
      }
    }

    updateOrderCount()

    window.addEventListener('storage', updateOrderCount)
    window.addEventListener('nebula-orders-updated', updateOrderCount)

    return () => {
      window.removeEventListener('storage', updateOrderCount)
      window.removeEventListener('nebula-orders-updated', updateOrderCount)
    }
  }, [location.pathname])

  // Membaca jumlah produk Wishlist
  useEffect(() => {
    const updateWishlistCount = () => {
      try {
        const savedWishlist = JSON.parse(
          localStorage.getItem('nebula-wishlist') || '[]',
        )

        setWishlistCount(
          Array.isArray(savedWishlist) ? savedWishlist.length : 0,
        )
      } catch (error) {
        console.error('Failed to read wishlist:', error)
        setWishlistCount(0)
      }
    }

    updateWishlistCount()

    window.addEventListener(
      'nebula-wishlist-updated',
      updateWishlistCount,
    )
    window.addEventListener('storage', updateWishlistCount)

    return () => {
      window.removeEventListener(
        'nebula-wishlist-updated',
        updateWishlistCount,
      )
      window.removeEventListener('storage', updateWishlistCount)
    }
  }, [location.pathname])

  // Tutup menu mobile saat berpindah halaman
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Mengisi kembali kolom pencarian dari URL
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSearchQuery(params.get('search') || '')
  }, [location.search])

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'Shop', href: '/#shop' },
    { name: 'Collections', href: '/#collections' },
    { name: 'About', href: '/#about' },
  ]

  // Menjalankan pencarian produk
  const handleSearch = (event) => {
    event.preventDefault()

    const query = searchQuery.trim()

    if (!query) {
      setSearchOpen(true)
      return
    }

    setMenuOpen(false)
    setSearchOpen(false)

    navigate(`/?search=${encodeURIComponent(query)}#shop`)

    window.setTimeout(() => {
      document.getElementById('shop')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 150)
  }

  // Menghapus kata pencarian
  const clearSearch = () => {
    setSearchQuery('')
    navigate('/#shop')

    window.setTimeout(() => {
      document.getElementById('shop')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 150)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-md">
      {/* Main Navbar */}
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-[-0.08em] text-neutral-950 sm:text-3xl"
          aria-label="NEBULA Home"
        >
          NEBULA<span className="text-orange-500">.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-neutral-600 transition hover:text-orange-500"
            >
              {link.name}
            </a>
          ))}

          {/* Order History Desktop */}
          <Link
            to="/orders"
            className={`flex items-center gap-2 text-sm font-semibold transition hover:text-orange-500 ${
              location.pathname === '/orders'
                ? 'text-orange-500'
                : 'text-neutral-600'
            }`}
          >
            Orders

            {orderCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                {orderCount > 99 ? '99+' : orderCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Search Button */}
          <button
            type="button"
            aria-label={searchOpen ? 'Close search' : 'Search products'}
            aria-expanded={searchOpen}
            onClick={() => {
              setSearchOpen((current) => !current)
              setMenuOpen(false)
            }}
            className={`rounded-full p-2 transition hover:bg-neutral-100 ${
              searchOpen ? 'text-orange-500' : 'text-neutral-950'
            }`}
          >
            {searchOpen ? (
              <HiOutlineX className="h-5 w-5" />
            ) : (
              <HiOutlineSearch className="h-5 w-5" />
            )}
          </button>

          {/* Wishlist Desktop */}
          <Link
            to="/wishlist"
            aria-label={`Wishlist, ${wishlistCount} products`}
            title="Wishlist"
            className={`relative hidden rounded-full p-2 transition hover:bg-neutral-100 sm:block ${
              location.pathname === '/wishlist'
                ? 'text-orange-500'
                : 'text-neutral-950'
            }`}
          >
            <HiOutlineHeart className="h-5 w-5" />

            {wishlistCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>

          {/* Order History Icon */}
          <Link
            to="/orders"
            aria-label={`Order history, ${orderCount} orders`}
            title="Order History"
            className={`relative hidden rounded-full p-2 transition hover:bg-neutral-100 sm:block lg:hidden ${
              location.pathname === '/orders'
                ? 'text-orange-500'
                : 'text-neutral-950'
            }`}
          >
            <HiOutlineClipboardDocumentList className="h-5 w-5" />

            {orderCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                {orderCount > 99 ? '99+' : orderCount}
              </span>
            )}
          </Link>

          {/* Shopping Cart */}
          <Link
            to="/cart"
            aria-label={`Shopping cart, ${cartCount} items`}
            title="Shopping Cart"
            className={`relative rounded-full p-2 transition hover:bg-neutral-100 ${
              location.pathname === '/cart'
                ? 'text-orange-500'
                : 'text-neutral-950'
            }`}
          >
            <HiOutlineShoppingBag className="h-5 w-5" />

            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen((current) => !current)
              setSearchOpen(false)
            }}
            className="rounded-full p-2 transition hover:bg-neutral-100 lg:hidden"
          >
            {menuOpen ? (
              <HiOutlineX className="h-5 w-5" />
            ) : (
              <HiOutlineMenuAlt3 className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Search Panel */}
      {searchOpen && (
        <div className="border-t border-neutral-200 bg-white px-5 py-5 sm:px-8 lg:px-12">
          <form
            onSubmit={handleSearch}
            className="mx-auto flex max-w-3xl items-center gap-3"
          >
            <HiOutlineSearch className="h-5 w-5 shrink-0 text-neutral-400" />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products, e.g. hoodie..."
              aria-label="Search products"
              autoFocus
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="text-xs font-semibold text-neutral-500 transition hover:text-orange-500"
              >
                Clear
              </button>
            )}

            <button
              type="submit"
              className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-500"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="border-t border-neutral-200 bg-white px-5 py-5 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-neutral-700 transition hover:text-orange-500"
              >
                {link.name}
              </a>
            ))}

            {/* Order History Mobile */}
            <Link
              to="/orders"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center justify-between border-t border-neutral-200 pt-5 text-sm font-semibold transition hover:text-orange-500 ${
                location.pathname === '/orders'
                  ? 'text-orange-500'
                  : 'text-neutral-700'
              }`}
            >
              <span className="flex items-center gap-3">
                <HiOutlineClipboardDocumentList className="h-5 w-5" />
                Order History
              </span>

              {orderCount > 0 && (
                <span className="rounded-full bg-orange-500 px-2 py-1 text-xs font-bold text-white">
                  {orderCount > 99 ? '99+' : orderCount}
                </span>
              )}
            </Link>

            {/* Wishlist Mobile */}
            <Link
              to="/wishlist"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center justify-between border-t border-neutral-200 pt-5 text-sm font-semibold transition hover:text-orange-500 ${
                location.pathname === '/wishlist'
                  ? 'text-orange-500'
                  : 'text-neutral-700'
              }`}
            >
              <span className="flex items-center gap-3">
                <HiOutlineHeart className="h-5 w-5" />
                Wishlist
              </span>

              {wishlistCount > 0 && (
                <span className="rounded-full bg-orange-500 px-2 py-1 text-xs font-bold text-white">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link for Mobile */}
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between border-t border-neutral-200 pt-5 text-sm font-semibold text-neutral-700 transition hover:text-orange-500"
            >
              <span className="flex items-center gap-3">
                <HiOutlineShoppingBag className="h-5 w-5" />
                Shopping Cart
              </span>

              {cartCount > 0 && (
                <span className="rounded-full bg-orange-500 px-2 py-1 text-xs font-bold text-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}

export default Navbar