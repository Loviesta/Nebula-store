import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  HiArrowLeft,
  HiOutlineHeart,
  HiOutlineMinus,
  HiOutlinePlus,
  HiOutlineShoppingBag,
  HiStar,
} from 'react-icons/hi2'

import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import products from '../data/Products'

const formatPrice = (price) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)

const sizes = ['S', 'M', 'L', 'XL']

const ProductDetail = () => {
  const { id } = useParams()

  const product = products.find(
    (item) => item.id === Number(id),
  )

  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedColor, setSelectedColor] = useState('Black')
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [message, setMessage] = useState('')

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />

        <main className="flex flex-1 flex-col items-center justify-center px-5 text-center">
          <h1 className="text-3xl font-black text-neutral-950">
            Product Not Found.
          </h1>

          <p className="mt-3 text-sm text-neutral-500">
            Sorry, we couldn't find the product you're looking for.
          </p>

          <Link
            to="/"
            className="mt-6 bg-neutral-950 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-orange-500"
          >
            Back to Home
          </Link>
        </main>

        <Footer />
      </div>
    )
  }

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      quantity,
      selectedSize,
      selectedColor,
    }

    const savedCart = JSON.parse(
      localStorage.getItem('nebula-cart') || '[]',
    )

    const existingItem = savedCart.find(
      (item) =>
        item.id === cartItem.id &&
        item.selectedSize === cartItem.selectedSize &&
        item.selectedColor === cartItem.selectedColor,
    )

    let updatedCart

    if (existingItem) {
      updatedCart = savedCart.map((item) =>
        item.id === cartItem.id &&
        item.selectedSize === cartItem.selectedSize &&
        item.selectedColor === cartItem.selectedColor
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      )
    } else {
      updatedCart = [...savedCart, cartItem]
    }

    localStorage.setItem(
      'nebula-cart',
      JSON.stringify(updatedCart),
    )
    window.dispatchEvent(new Event('nebula-cart-updated'))

    setMessage('Product added to your cart successfully!')

    window.setTimeout(() => {
      setMessage('')
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 transition hover:text-orange-500"
          >
            <HiArrowLeft className="h-4 w-4" />
            Back to Shop
          </Link>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Product Image */}
            <div className="relative overflow-hidden bg-neutral-100">
              <img
                src={product.image}
                alt={product.name}
                className="aspect-[4/5] h-full w-full object-cover"
              />

              {product.badge && (
                <span className="absolute left-4 top-4 bg-white px-4 py-2 text-[10px] font-extrabold tracking-widest text-neutral-950">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Product Information */}
            <div className="flex flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">
                {product.category}
              </p>

              <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>

              <div className="mt-5 flex items-center gap-2">
                <div className="flex items-center gap-1 text-orange-500">
                  <HiStar className="h-5 w-5" />
                </div>

                <span className="text-sm font-bold text-neutral-950">
                  {product.rating}
                </span>

                <span className="text-sm text-neutral-400">
                  / 5.0
                </span>
              </div>

              <p className="mt-6 text-2xl font-black text-neutral-950">
                {formatPrice(product.price)}
              </p>

              <div className="my-8 border-t border-neutral-200" />

              <p className="text-sm leading-7 text-neutral-600">
                Designed for everyday expression. This {product.name.toLowerCase()}{' '}
                combines a clean silhouette with versatile styling,
                making it an essential addition to your everyday wardrobe.
                Wear it your way with the NEBULA collection.
              </p>

              {/* Color Selection */}
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-neutral-950">
                    Color
                  </p>

                  <span className="text-xs text-neutral-500">
                    {selectedColor}
                  </span>
                </div>

                <div className="mt-4 flex gap-3">
                  {[
                    {
                      name: 'Black',
                      className: 'bg-neutral-950',
                    },
                    {
                      name: 'White',
                      className: 'bg-white',
                    },
                    {
                      name: 'Gray',
                      className: 'bg-neutral-400',
                    },
                  ].map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      aria-label={`Select ${color.name}`}
                      aria-pressed={selectedColor === color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                        selectedColor === color.name
                          ? 'border-orange-500'
                          : 'border-neutral-200'
                      }`}
                    >
                      <span
                        className={`h-7 w-7 rounded-full border border-neutral-200 ${color.className}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mt-8">
                <p className="text-xs font-extrabold uppercase tracking-wider text-neutral-950">
                  Select Size
                </p>

                <div className="mt-4 grid grid-cols-4 gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      aria-pressed={selectedSize === size}
                      onClick={() => setSelectedSize(size)}
                      className={`border py-3 text-xs font-bold transition ${
                        selectedSize === size
                          ? 'border-neutral-950 bg-neutral-950 text-white'
                          : 'border-neutral-200 text-neutral-600 hover:border-neutral-950'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and Wishlist */}
              <div className="mt-8 flex flex-wrap gap-3">
                <div className="flex h-12 items-center border border-neutral-200">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() =>
                      setQuantity((current) => Math.max(1, current - 1))
                    }
                    className="flex h-full w-11 items-center justify-center text-neutral-600 transition hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <HiOutlineMinus className="h-4 w-4" />
                  </button>

                  <span className="w-8 text-center text-sm font-bold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() =>
                      setQuantity((current) => current + 1)
                    }
                    className="flex h-full w-11 items-center justify-center text-neutral-600 transition hover:text-orange-500"
                  >
                    <HiOutlinePlus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  aria-label="Toggle wishlist"
                  aria-pressed={isWishlisted}
                  onClick={() => setIsWishlisted((current) => !current)}
                  className={`flex h-12 w-12 items-center justify-center border transition ${
                    isWishlisted
                      ? 'border-orange-500 text-orange-500'
                      : 'border-neutral-200 text-neutral-700 hover:border-orange-500 hover:text-orange-500'
                  }`}
                >
                  <HiOutlineHeart className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex h-12 flex-1 items-center justify-center gap-2 bg-neutral-950 px-5 text-xs font-extrabold uppercase tracking-wider text-white transition hover:bg-orange-500"
                >
                  <HiOutlineShoppingBag className="h-4 w-4" />
                  Add to Cart
                </button>
              </div>

              {message && (
                <p
                  role="status"
                  className="mt-4 border border-green-200 bg-green-50 p-3 text-sm text-green-700"
                >
                  {message}
                </p>
              )}

              <div className="mt-8 border-t border-neutral-200 pt-6">
                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Category
                  </span>

                  <span className="text-sm text-neutral-500">
                    {product.category}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-neutral-100 py-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Quantity
                  </span>

                  <span className="text-sm text-neutral-500">
                    {quantity} item{quantity > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-neutral-100 py-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Subtotal
                  </span>

                  <span className="text-sm font-bold text-neutral-950">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ProductDetail