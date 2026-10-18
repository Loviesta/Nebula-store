import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineHeart,
  HiHeart,
  HiOutlineShoppingBag,
  HiOutlineTrash,
  HiArrowLeft,
} from 'react-icons/hi2'

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)
}

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([])
  const [message, setMessage] = useState('')

  // Membaca Wishlist dari localStorage
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const savedWishlist = JSON.parse(
          localStorage.getItem('nebula-wishlist') || '[]',
        )

        setWishlist(
          Array.isArray(savedWishlist) ? savedWishlist : [],
        )
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

  // Menghapus produk dari Wishlist
  const handleRemove = (product) => {
    try {
      const updatedWishlist = wishlist.filter(
        (item) => item.id !== product.id,
      )

      localStorage.setItem(
        'nebula-wishlist',
        JSON.stringify(updatedWishlist),
      )

      setWishlist(updatedWishlist)

      window.dispatchEvent(new Event('nebula-wishlist-updated'))

      setMessage(`${product.name} removed from wishlist.`)

      window.setTimeout(() => {
        setMessage('')
      }, 2500)
    } catch (error) {
      console.error('Failed to remove product:', error)
      setMessage('Unable to remove product. Please try again.')
    }
  }

  // Menambahkan produk ke Shopping Cart
  
const handleAddToCart = (product) => {
  try {
    // Ambil data Cart
    const savedCart = JSON.parse(
      localStorage.getItem('nebula-cart') || '[]',
    )

    const cart = Array.isArray(savedCart) ? savedCart : []

    // Cari produk yang sama di Cart
    const existingItem = cart.find(
      (item) =>
        item.id === product.id &&
        !item.selectedSize &&
        !item.selectedColor,
    )

    let updatedCart

    // Jika produk sudah ada, tambahkan jumlahnya
    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.id === product.id &&
        !item.selectedSize &&
        !item.selectedColor
          ? {
              ...item,
              quantity: (Number(item.quantity) || 0) + 1,
            }
          : item,
      )
    } else {
      // Jika belum ada, masukkan produk ke Cart
      updatedCart = [
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]
    }

    // Simpan Cart
    localStorage.setItem(
      'nebula-cart',
      JSON.stringify(updatedCart),
    )

    // Hapus produk dari Wishlist
    const savedWishlist = JSON.parse(
      localStorage.getItem('nebula-wishlist') || '[]',
    )

    const updatedWishlist = (
      Array.isArray(savedWishlist) ? savedWishlist : []
    ).filter((item) => item.id !== product.id)

    localStorage.setItem(
      'nebula-wishlist',
      JSON.stringify(updatedWishlist),
    )

    // Perbarui tampilan Wishlist
    setWishlist(updatedWishlist)

    // Beri tahu Navbar dan komponen lain
    window.dispatchEvent(new Event('nebula-cart-updated'))
    window.dispatchEvent(new Event('nebula-wishlist-updated'))

    // Tampilkan notifikasi
    setMessage(`${product.name} moved to cart successfully!`)

    window.setTimeout(() => {
      setMessage('')
    }, 2500)
  } catch (error) {
    console.error('Failed to move product to cart:', error)

    setMessage('Unable to move product to cart. Please try again.')

    window.setTimeout(() => {
      setMessage('')
    }, 2500)
  }
}

  // Menghapus semua produk Wishlist
  const handleClearWishlist = () => {
    try {
      localStorage.setItem('nebula-wishlist', JSON.stringify([]))

      setWishlist([])

      window.dispatchEvent(new Event('nebula-wishlist-updated'))

      setMessage('Your wishlist has been cleared.')

      window.setTimeout(() => {
        setMessage('')
      }, 2500)
    } catch (error) {
      console.error('Failed to clear wishlist:', error)
      setMessage('Unable to clear wishlist. Please try again.')
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-10 border-b border-neutral-200 pb-8 sm:mb-12">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 transition hover:text-orange-500"
          >
            <HiArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.25em] text-orange-500">
                Your Favorites
              </p>

              <h1 className="text-3xl font-black tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
                My Wishlist<span className="text-orange-500">.</span>
              </h1>

              <p className="mt-3 text-sm leading-6 text-neutral-500">
                Keep the pieces you love in one place.
              </p>

              <p className="mt-2 text-xs font-semibold text-neutral-400">
                {wishlist.length}{' '}
                {wishlist.length === 1 ? 'product' : 'products'} saved
              </p>
            </div>

            {wishlist.length > 0 && (
              <button
                type="button"
                onClick={handleClearWishlist}
                className="inline-flex items-center gap-2 self-start border border-neutral-300 px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-600 transition hover:border-red-500 hover:text-red-500 sm:self-auto"
              >
                <HiOutlineTrash className="h-4 w-4" />
                Clear Wishlist
              </button>
            )}
          </div>
        </div>

        {/* Notification */}
        {message && (
          <div
            role="status"
            className="mb-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {message}
          </div>
        )}

        {/* Wishlist Products */}
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
            {wishlist.map((product) => (
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

                  {/* Remove Wishlist Button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(product)}
                    aria-label={`Remove ${product.name} from wishlist`}
                    title="Remove from Wishlist"
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-orange-500 transition hover:bg-orange-500 hover:text-white"
                  >
                    <HiHeart className="h-5 w-5" />
                  </button>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="absolute inset-x-2 bottom-2 flex items-center justify-center gap-2 bg-white py-3 text-[10px] font-extrabold uppercase tracking-wider text-neutral-950 transition hover:bg-orange-500 hover:text-white sm:inset-x-4 sm:bottom-4 sm:text-xs"
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

                    {product.rating != null && (
                      <span className="text-[10px] font-semibold text-neutral-600 sm:text-xs">
                        ★ {product.rating}
                      </span>
                    )}
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

                  {/* Remove Link */}
                  <button
                    type="button"
                    onClick={() => handleRemove(product)}
                    className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 transition hover:text-red-500 sm:text-xs"
                  >
                    <HiOutlineTrash className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty Wishlist */
          <div className="flex flex-col items-center justify-center border border-dashed border-neutral-300 bg-white px-5 py-16 text-center sm:py-24">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
              <HiOutlineHeart className="h-9 w-9 text-orange-500" />
            </div>

            <h2 className="mt-6 text-xl font-black text-neutral-950 sm:text-2xl">
              Your Wishlist Is Empty.
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-neutral-500">
              You haven't saved any products yet. Explore our collection
              and tap the heart icon on the products you love.
            </p>

            <Link
              to="/#shop"
              className="mt-7 inline-flex items-center gap-2 bg-neutral-950 px-7 py-4 text-xs font-extrabold uppercase tracking-widest text-white transition hover:bg-orange-500"
            >
              <HiOutlineShoppingBag className="h-4 w-4" />
              Explore Products
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}

export default Wishlist