import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HiArrowLeft,
  HiOutlineShoppingBag,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineArrowRight,
  HiOutlineShieldCheck,
} from 'react-icons/hi2'

import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const CART_KEY = 'nebula-cart'
const CHECKOUT_KEY = 'nebula-checkout-items'

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)
}

const createCartItemId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const Cart = () => {
  const navigate = useNavigate()

  const [cartItems, setCartItems] = useState([])
  const [selectedItemIds, setSelectedItemIds] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = JSON.parse(
          localStorage.getItem(CART_KEY) || '[]',
        )

        const validCart = Array.isArray(savedCart) ? savedCart : []

        
        const usedIds = new Set()

        const normalizedCart = validCart.map((item) => {
          let cartItemId = item.cartItemId

          if (!cartItemId || usedIds.has(cartItemId)) {
            cartItemId = createCartItemId()
          }

          usedIds.add(cartItemId)

          return {
            ...item,
            cartItemId,
            quantity: Math.max(1, Number(item.quantity) || 1),
          }
        })

        localStorage.setItem(CART_KEY, JSON.stringify(normalizedCart))

        setCartItems(normalizedCart)

        
        let savedSelection = []

        try {
          const parsedSelection = JSON.parse(
            localStorage.getItem(CHECKOUT_KEY) || 'null',
          )

          if (Array.isArray(parsedSelection)) {
            savedSelection = parsedSelection
          }
        } catch {
          savedSelection = []
        }

        const availableIds = new Set(
          normalizedCart.map((item) => item.cartItemId),
        )

        const validSelection = savedSelection.filter((id) =>
          availableIds.has(id),
        )

        
        const selectionToUse =
          savedSelection === null
            ? normalizedCart.map((item) => item.cartItemId)
            : validSelection

        setSelectedItemIds(selectionToUse)
        localStorage.setItem(CHECKOUT_KEY, JSON.stringify(selectionToUse))
      } catch (error) {
        console.error('Failed to load cart:', error)
        setCartItems([])
        setSelectedItemIds([])
      } finally {
        setIsLoaded(true)
      }
    }

    loadCart()

    window.addEventListener('nebula-cart-updated', loadCart)

    return () => {
      window.removeEventListener('nebula-cart-updated', loadCart)
    }
  }, [])

  const saveCart = (updatedCart) => {
    const updatedIds = new Set(
      updatedCart.map((item) => item.cartItemId),
    )

    const validSelectedIds = selectedItemIds.filter((id) =>
      updatedIds.has(id),
    )

    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart))
    localStorage.setItem(CHECKOUT_KEY, JSON.stringify(validSelectedIds))

    setCartItems(updatedCart)
    setSelectedItemIds(validSelectedIds)

    window.dispatchEvent(new Event('nebula-cart-updated'))
  }

  const saveSelection = (updatedSelection) => {
    setSelectedItemIds(updatedSelection)
    localStorage.setItem(CHECKOUT_KEY, JSON.stringify(updatedSelection))
  }

  const toggleItem = (cartItemId) => {
    const isSelected = selectedItemIds.includes(cartItemId)

    const updatedSelection = isSelected
      ? selectedItemIds.filter((id) => id !== cartItemId)
      : [...selectedItemIds, cartItemId]

    saveSelection(updatedSelection)
  }

  const allSelected =
    cartItems.length > 0 &&
    cartItems.every((item) =>
      selectedItemIds.includes(item.cartItemId),
    )

  const toggleSelectAll = () => {
    if (allSelected) {
      saveSelection([])
    } else {
      saveSelection(cartItems.map((item) => item.cartItemId))
    }
  }

  const updateQuantity = (item, change) => {
    const updatedCart = cartItems.map((cartItem) => {
      if (cartItem.cartItemId !== item.cartItemId) {
        return cartItem
      }

      return {
        ...cartItem,
        quantity: Math.max(1, cartItem.quantity + change),
      }
    })

    saveCart(updatedCart)
  }

  const removeItem = (item) => {
    const updatedCart = cartItems.filter(
      (cartItem) => cartItem.cartItemId !== item.cartItemId,
    )

    const updatedSelection = selectedItemIds.filter(
      (id) => id !== item.cartItemId,
    )

    localStorage.setItem(CHECKOUT_KEY, JSON.stringify(updatedSelection))
    setSelectedItemIds(updatedSelection)

    saveCart(updatedCart)
  }

  const selectedItems = cartItems.filter((item) =>
    selectedItemIds.includes(item.cartItemId),
  )

  const subtotal = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )

  const shipping = subtotal === 0 || subtotal >= 500000 ? 0 : 15000
  const total = subtotal + shipping

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  )

  const selectedQuantity = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  )

  const handleCheckout = () => {
    if (selectedItems.length === 0) return

    // Simpan ID produk terpilih sebelum membuka halaman checkout.
    localStorage.setItem(
      CHECKOUT_KEY,
      JSON.stringify(selectedItems.map((item) => item.cartItemId)),
    )

    navigate('/checkout')
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="mx-auto max-w-7xl px-5 py-20 text-center text-sm text-neutral-500">
          Loading your cart...
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="min-h-[70vh] px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 transition hover:text-orange-500"
          >
            <HiArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>

          <div className="mb-8 flex flex-col justify-between gap-4 border-b border-neutral-200 pb-8 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
                Your Selection
              </p>

              <h1 className="text-3xl font-black tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
                Shopping Cart.
              </h1>

              <p className="mt-3 text-sm text-neutral-500">
                Select the products you want to purchase.
              </p>
            </div>

            <p className="text-sm font-semibold text-neutral-500">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your bag
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center sm:py-24">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100">
                <HiOutlineShoppingBag className="h-10 w-10 text-neutral-400" />
              </div>

              <h2 className="mt-7 text-2xl font-black text-neutral-950">
                Your cart is empty.
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-500">
                Looks like you haven't added anything to your bag yet.
                Explore our collection and find your next favorite piece.
              </p>

              <Link
                to="/"
                className="mt-8 inline-flex items-center gap-3 bg-neutral-950 px-7 py-4 text-xs font-extrabold uppercase tracking-widest text-white transition hover:bg-orange-500"
              >
                Explore Collection
                <HiOutlineArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid items-start gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
              <section>
                {/* Select All */}
                <div className="mb-2 flex items-center justify-between gap-4 border-b border-neutral-200 py-4">
                  <label className="flex cursor-pointer items-center gap-3 text-sm font-bold text-neutral-800">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 cursor-pointer accent-orange-500"
                    />
                    Select All ({cartItems.length} products)
                  </label>

                  <span className="text-xs text-neutral-500">
                    {selectedItems.length} selected
                  </span>
                </div>

                <div className="hidden grid-cols-[24px_1fr_100px_100px] gap-4 border-b border-neutral-200 pb-4 pt-2 text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 sm:grid">
                  <span />
                  <span>Product</span>
                  <span className="text-center">Quantity</span>
                  <span className="text-right">Total</span>
                </div>

                <div className="divide-y divide-neutral-200">
                  {cartItems.map((item) => {
                    const isSelected = selectedItemIds.includes(
                      item.cartItemId,
                    )

                    return (
                      <article
                        key={item.cartItemId}
                        className={`grid grid-cols-[24px_88px_1fr] gap-3 py-6 transition sm:grid-cols-[24px_100px_1fr] sm:gap-4 ${
                          isSelected ? 'bg-orange-50/40' : ''
                        }`}
                      >
                        {/* Product Checkbox */}
                        <div className="flex justify-center pt-1">
                          <input
                            type="checkbox"
                            aria-label={`Select ${item.name}`}
                            checked={isSelected}
                            onChange={() => toggleItem(item.cartItemId)}
                            className="h-4 w-4 cursor-pointer accent-orange-500"
                          />
                        </div>

                        {/* Product Image */}
                        <Link
                          to={`/product/${item.id}`}
                          className="block aspect-[3/4] overflow-hidden bg-neutral-100"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover transition duration-500 hover:scale-105"
                          />
                        </Link>

                        {/* Product Details */}
                        <div className="flex min-w-0 flex-col justify-between gap-4">
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
                                  {item.category}
                                </p>

                                <Link
                                  to={`/product/${item.id}`}
                                  className="mt-2 block text-sm font-extrabold leading-5 text-neutral-950 transition hover:text-orange-500 sm:text-base"
                                >
                                  {item.name}
                                </Link>

                                <p className="mt-2 text-sm font-bold text-neutral-950">
                                  {formatPrice(item.price)}
                                </p>
                              </div>

                              <p className="hidden whitespace-nowrap text-sm font-extrabold text-neutral-950 sm:block">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {item.selectedSize && (
                                <span className="border border-neutral-200 px-2 py-1 text-[10px] font-semibold text-neutral-600">
                                  Size: {item.selectedSize}
                                </span>
                              )}

                              {item.selectedColor && (
                                <span className="border border-neutral-200 px-2 py-1 text-[10px] font-semibold text-neutral-600">
                                  Color: {item.selectedColor}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex h-9 items-center border border-neutral-200">
                              <button
                                type="button"
                                aria-label={`Decrease quantity of ${item.name}`}
                                disabled={item.quantity <= 1}
                                onClick={() => updateQuantity(item, -1)}
                                className="flex h-full w-9 items-center justify-center text-neutral-600 transition hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                <HiOutlineMinus className="h-3.5 w-3.5" />
                              </button>

                              <span className="w-8 text-center text-xs font-bold text-neutral-950">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                aria-label={`Increase quantity of ${item.name}`}
                                onClick={() => updateQuantity(item, 1)}
                                className="flex h-full w-9 items-center justify-center text-neutral-600 transition hover:text-orange-500"
                              >
                                <HiOutlinePlus className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <p className="text-xs font-extrabold text-neutral-950 sm:hidden">
                              {formatPrice(item.price * item.quantity)}
                            </p>

                            <button
                              type="button"
                              onClick={() => removeItem(item)}
                              className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 transition hover:text-red-500"
                            >
                              <HiOutlineTrash className="h-4 w-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>

                <div className="mt-5 flex items-start gap-3 border border-neutral-200 bg-neutral-50 p-4">
                  <HiOutlineShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-neutral-600" />

                  <div>
                    <p className="text-xs font-bold text-neutral-950">
                      Shop with confidence
                    </p>

                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      Only selected products will be included in this checkout.
                      Unselected products will remain in your cart.
                    </p>
                  </div>
                </div>
              </section>

              {/* Order Summary */}
              <aside className="border border-neutral-200 p-5 sm:p-7 lg:sticky lg:top-8">
                <h2 className="text-lg font-black text-neutral-950">
                  Order Summary.
                </h2>

                <p className="mt-2 text-xs leading-5 text-neutral-500">
                  Summary of your selected products.
                </p>

                <div className="mt-7 space-y-4 border-b border-neutral-200 pb-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-neutral-500">
                      Selected products
                    </span>

                    <span className="text-sm font-bold text-neutral-950">
                      {selectedItems.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-neutral-500">
                      Subtotal ({selectedQuantity} items)
                    </span>

                    <span className="text-sm font-bold text-neutral-950">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm text-neutral-500">
                      Shipping
                    </span>

                    <span className="text-right text-sm font-bold text-neutral-950">
                      {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </span>
                  </div>

                  {subtotal > 0 && subtotal < 500000 && (
                    <p className="text-xs leading-5 text-neutral-500">
                      Add {formatPrice(500000 - subtotal)} more to get free
                      shipping.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 py-5">
                  <span className="text-sm font-extrabold uppercase tracking-wider text-neutral-950">
                    Total
                  </span>

                  <span className="text-lg font-black text-neutral-950">
                    {formatPrice(total)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0}
                  className="flex w-full items-center justify-center gap-3 bg-neutral-950 px-5 py-4 text-xs font-extrabold uppercase tracking-widest text-white transition-colors duration-300 hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
                >
                  Checkout Selected Items
                  <HiOutlineArrowRight className="h-4 w-4" />
                </button>

                {selectedItems.length === 0 && (
                  <p className="mt-3 text-center text-xs text-red-500">
                    Select at least one product to continue.
                  </p>
                )}

                <Link
                  to="/"
                  className="mt-4 flex w-full items-center justify-center border border-neutral-200 px-5 py-4 text-xs font-extrabold uppercase tracking-widest text-neutral-950 transition hover:border-neutral-950"
                >
                  Continue Shopping
                </Link>

                <p className="mt-5 text-center text-[10px] leading-5 text-neutral-400">
                  Demo checkout only. No real payment will be processed.
                </p>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Cart