import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HiArrowLeft,
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineCheckCircle,
  HiOutlineCreditCard,
  HiOutlineMapPin,
  HiOutlineUser,
} from 'react-icons/hi2'

import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const CART_KEY = 'nebula-cart'
const CHECKOUT_KEY = 'nebula-checkout-items'
const ORDERS_KEY = 'nebula-orders'

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(price) || 0)
}

// Gunakan tanggal lokal agar tidak bergeser akibat perbedaan zona waktu.
const toDateString = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// Menghitung tanggal kedatangan berdasarkan hari kerja.
// Sabtu dan Minggu tidak dihitung.
const addBusinessDays = (startDate, numberOfDays) => {
  const date = new Date(startDate)
  let addedDays = 0

  while (addedDays < numberOfDays) {
    date.setDate(date.getDate() + 1)

    const day = date.getDay()

    if (day !== 0 && day !== 6) {
      addedDays += 1
    }
  }

  return toDateString(date)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'

  const date = new Date(`${dateString}T12:00:00`)

  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
}

const shippingOptions = [
  {
    id: 'regular',
    name: 'Regular Delivery',
    description: 'Estimated delivery: 3–5 business days',
    price: 15000,
    minDays: 3,
    maxDays: 5,
  },
  {
    id: 'express',
    name: 'Express Delivery',
    description: 'Estimated delivery: 1–2 business days',
    price: 30000,
    minDays: 1,
    maxDays: 2,
  },
]

const paymentOptions = [
  {
    id: 'bank',
    name: 'Bank Transfer',
    description: 'Transfer through your banking application',
  },
  {
    id: 'ewallet',
    name: 'E-Wallet',
    description: 'Demo payment using an e-wallet',
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when your order arrives',
  },
]

const Checkout = () => {
  const navigate = useNavigate()

  const [cartItems, setCartItems] = useState([])
  const [form, setForm] = useState(initialForm)
  const [shippingMethod, setShippingMethod] = useState('regular')
  const [paymentMethod, setPaymentMethod] = useState('bank')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Baca hanya produk yang dipilih di halaman Cart.
  useEffect(() => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem(CART_KEY) || '[]',
      )

      const savedSelection = JSON.parse(
        localStorage.getItem(CHECKOUT_KEY) || '[]',
      )

      const fullCart = Array.isArray(savedCart) ? savedCart : []
      const selectedIds = Array.isArray(savedSelection)
        ? savedSelection
        : []

      const selectedCartItems = fullCart.filter((item) =>
        selectedIds.includes(item.cartItemId),
      )

      setCartItems(selectedCartItems)

      // Periksa agar tidak ada produk yang terlewat.
      if (
        selectedCartItems.length === 0 ||
        selectedCartItems.length !== new Set(selectedIds).size
      ) {
        if (selectedCartItems.length === 0) {
          setErrors({
            cart: 'No selected products found. Please select products from your cart.',
          })
        }
      }
    } catch (error) {
      console.error('Failed to load checkout cart:', error)
      setCartItems([])
      setErrors({
        cart: 'Unable to load your selected products. Please return to your cart.',
      })
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0,
  )

  const totalItems = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0,
  )

  const selectedShipping = shippingOptions.find(
    (option) => option.id === shippingMethod,
  )

  const shipping =
    subtotal === 0 || subtotal >= 500000
      ? 0
      : selectedShipping?.price || 0

  const total = subtotal + shipping

  // Perbarui nilai input formulir.
  const handleInputChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setErrors((current) => ({
      ...current,
      [name]: '',
    }))
  }

  // Validasi data pelanggan.
  const validateForm = () => {
    const newErrors = {}

    if (!form.fullName.trim()) {
      newErrors.fullName = 'Full name is required.'
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address.'
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required.'
    } else if (!/^[0-9+\-\s()]{8,20}$/.test(form.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number.'
    }

    if (!form.address.trim()) {
      newErrors.address = 'Shipping address is required.'
    }

    if (!form.city.trim()) {
      newErrors.city = 'City is required.'
    }

    if (!form.province.trim()) {
      newErrors.province = 'Province is required.'
    }

    if (!form.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required.'
    } else if (!/^[0-9]{5}$/.test(form.postalCode.trim())) {
      newErrors.postalCode = 'Postal code must contain 5 digits.'
    }

    setErrors((current) => ({
      ...current,
      ...newErrors,
      submit: '',
    }))

    return Object.keys(newErrors).length === 0
  }

  
  const handleSubmitOrder = (event) => {
    event.preventDefault()

    if (isSubmitting) return

    if (cartItems.length === 0) {
      navigate('/cart')
      return
    }

    if (!validateForm()) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })

      return
    }

    setIsSubmitting(true)

    try {
      
      const currentCart = JSON.parse(
        localStorage.getItem(CART_KEY) || '[]',
      )

      const currentSelection = JSON.parse(
        localStorage.getItem(CHECKOUT_KEY) || '[]',
      )

      const fullCart = Array.isArray(currentCart) ? currentCart : []
      const selectedIds = Array.isArray(currentSelection)
        ? currentSelection
        : []

      const selectedIdSet = new Set(selectedIds)

      const checkoutItems = fullCart.filter((item) =>
        selectedIdSet.has(item.cartItemId),
      )

      if (checkoutItems.length === 0) {
        setErrors({
          submit:
            'Your selected products are no longer available in the cart. Please return to your cart and select them again.',
        })

        setCartItems([])
        setIsSubmitting(false)
        return
      }

      // Memastikan produk yang ditampilkan dan produk yang dipesan sama.
      const currentSubtotal = checkoutItems.reduce(
        (sum, item) =>
          sum +
          (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0,
      )

      const currentTotalItems = checkoutItems.reduce(
        (sum, item) => sum + (Number(item.quantity) || 0),
        0,
      )

      const currentShipping =
        currentSubtotal === 0 || currentSubtotal >= 500000
          ? 0
          : selectedShipping?.price || 0

      const currentTotal = currentSubtotal + currentShipping

      const orderDate = new Date()
      const orderDateString = toDateString(orderDate)

      const earliestDelivery = addBusinessDays(
        orderDate,
        selectedShipping?.minDays || 3,
      )

      const latestDelivery = addBusinessDays(
        orderDate,
        selectedShipping?.maxDays || 5,
      )

      const order = {
        orderId: `NEB-${Date.now().toString().slice(-8)}`,
        customer: { ...form },
        items: checkoutItems.map((item) => ({ ...item })),
        shippingMethod: selectedShipping?.name || 'Regular Delivery',
        shippingMethodId: selectedShipping?.id || 'regular',
        paymentMethod:
          paymentOptions.find((option) => option.id === paymentMethod)?.name ||
          'Bank Transfer',
        subtotal: currentSubtotal,
        shipping: currentShipping,
        total: currentTotal,
        totalItems: currentTotalItems,
        createdAt: orderDate.toISOString(),
        orderDate: orderDateString,
        estimatedDelivery: {
          earliest: earliestDelivery,
          latest: latestDelivery,
          label:
            `${formatDate(earliestDelivery)} – ${formatDate(latestDelivery)}`,
        },
        status: 'Demo Order',
      }

      const savedOrders = JSON.parse(
        localStorage.getItem(ORDERS_KEY) || '[]',
      )

      const orders = Array.isArray(savedOrders) ? savedOrders : []

      // Produk yang tidak dipilih tetap ada di keranjang.
      const remainingCart = fullCart.filter(
        (item) => !selectedIdSet.has(item.cartItemId),
      )

      // Simpan data pesanan dan keranjang sebelum menampilkan sukses.
      localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify([order, ...orders]),
      )

      localStorage.setItem(CART_KEY, JSON.stringify(remainingCart))
      localStorage.setItem(CHECKOUT_KEY, JSON.stringify([]))

      window.dispatchEvent(new Event('nebula-cart-updated'))
      window.dispatchEvent(new Event('nebula-orders-updated'))

      setOrderSuccess(order)
    } catch (error) {
      console.error('Failed to save demo order:', error)

      setErrors((current) => ({
        ...current,
        submit:
          'Unable to save your demo order. Please check your browser storage and try again.',
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar />

        <main className="mx-auto max-w-7xl px-5 py-20 text-center text-sm text-neutral-500">
          Loading checkout...
        </main>

        <Footer />
      </div>
    )
  }

  // Tampilan setelah pesanan berhasil dibuat.
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center px-5 py-16 sm:px-8">
          <div className="w-full max-w-xl border border-neutral-200 bg-white p-7 text-center sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <HiOutlineCheckCircle className="h-11 w-11 text-green-600" />
            </div>

            <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.3em] text-orange-500">
              Order Created
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-neutral-950 sm:text-4xl">
              Thank You!
            </h1>

            <p className="mt-4 text-sm leading-6 text-neutral-500">
              Your demo order has been created successfully. No real payment
              has been processed.
            </p>

            <div className="mt-8 border border-neutral-200 bg-neutral-50 p-5 text-left">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-neutral-500">Order Number</span>

                <span className="text-sm font-extrabold text-neutral-950">
                  {orderSuccess.orderId}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="text-xs text-neutral-500">Total</span>

                <span className="text-sm font-extrabold text-neutral-950">
                  {formatPrice(orderSuccess.total)}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="text-xs text-neutral-500">
                  Payment Method
                </span>

                <span className="text-right text-sm font-bold text-neutral-950">
                  {orderSuccess.paymentMethod}
                </span>
              </div>

              <div className="mt-4 border-t border-neutral-200 pt-4">
                <p className="text-xs font-bold text-neutral-700">
                  Estimated Arrival
                </p>

                <p className="mt-2 text-sm font-extrabold text-green-700">
                  {orderSuccess.estimatedDelivery.label}
                </p>

                <p className="mt-1 text-xs leading-5 text-neutral-500">
                  {orderSuccess.shippingMethod}. Estimated business days
                  exclude Saturdays and Sundays.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/"
                className="flex flex-1 items-center justify-center bg-neutral-950 px-6 py-4 text-xs font-extrabold uppercase tracking-widest text-white transition hover:bg-orange-500"
              >
                Continue Shopping
              </Link>

              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="flex flex-1 items-center justify-center border border-neutral-200 px-6 py-4 text-xs font-extrabold uppercase tracking-widest text-neutral-950 transition hover:border-neutral-950"
              >
                View Cart
              </button>
            </div>

            <p className="mt-6 text-[10px] leading-5 text-neutral-400">
              NEBULA Store Portfolio Demo · This is not a real transaction.
              Delivery dates are estimates, not live tracking information.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <main className="px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/cart"
            className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 transition hover:text-orange-500"
          >
            <HiArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>

          <div className="mb-10 border-b border-neutral-200 pb-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
              Almost Yours
            </p>

            <h1 className="text-3xl font-black tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
              Checkout.
            </h1>

            <p className="mt-3 text-sm text-neutral-500">
              Complete your details to create your NEBULA demo order.
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="border border-neutral-200 bg-white px-5 py-16 text-center sm:py-24">
              <HiOutlineShoppingBag className="mx-auto h-12 w-12 text-neutral-300" />

              <h2 className="mt-6 text-2xl font-black text-neutral-950">
                No products selected.
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-500">
                Your cart may still contain products, but you need to select
                the products you want to purchase before checking out.
              </p>

              {errors.cart && (
                <p role="alert" className="mt-3 text-xs text-red-500">
                  {errors.cart}
                </p>
              )}

              <Link
                to="/cart"
                className="mt-7 inline-flex items-center gap-2 bg-neutral-950 px-7 py-4 text-xs font-extrabold uppercase tracking-widest text-white transition hover:bg-orange-500"
              >
                Return to Cart
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder} noValidate>
              <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
                {/* Customer Information */}
                <div className="space-y-8">
                  <section className="border border-neutral-200 bg-white p-5 sm:p-8">
                    <div className="mb-7 flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center bg-orange-50">
                        <HiOutlineUser className="h-5 w-5 text-orange-500" />
                      </div>

                      <div>
                        <h2 className="text-lg font-black text-neutral-950">
                          Customer Information
                        </h2>

                        <p className="mt-1 text-xs text-neutral-500">
                          Enter your contact details.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="fullName"
                          className="mb-2 block text-xs font-bold text-neutral-700"
                        >
                          Full Name *
                        </label>

                        <input
                          id="fullName"
                          name="fullName"
                          value={form.fullName}
                          onChange={handleInputChange}
                          autoComplete="name"
                          placeholder="Enter your full name"
                          className={`w-full border bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 ${
                            errors.fullName
                              ? 'border-red-400'
                              : 'border-neutral-200'
                          }`}
                        />

                        {errors.fullName && (
                          <p className="mt-2 text-xs text-red-500">
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="mb-2 block text-xs font-bold text-neutral-700"
                        >
                          Email Address *
                        </label>

                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleInputChange}
                          autoComplete="email"
                          placeholder="you@example.com"
                          className={`w-full border bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 ${
                            errors.email
                              ? 'border-red-400'
                              : 'border-neutral-200'
                          }`}
                        />

                        {errors.email && (
                          <p className="mt-2 text-xs text-red-500">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="mb-2 block text-xs font-bold text-neutral-700"
                        >
                          Phone Number *
                        </label>

                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleInputChange}
                          autoComplete="tel"
                          placeholder="08xxxxxxxxxx"
                          className={`w-full border bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 ${
                            errors.phone
                              ? 'border-red-400'
                              : 'border-neutral-200'
                          }`}
                        />

                        {errors.phone && (
                          <p className="mt-2 text-xs text-red-500">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Shipping Address */}
                  <section className="border border-neutral-200 bg-white p-5 sm:p-8">
                    <div className="mb-7 flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center bg-orange-50">
                        <HiOutlineMapPin className="h-5 w-5 text-orange-500" />
                      </div>

                      <div>
                        <h2 className="text-lg font-black text-neutral-950">
                          Shipping Address
                        </h2>

                        <p className="mt-1 text-xs text-neutral-500">
                          Where should we send your order?
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="address"
                          className="mb-2 block text-xs font-bold text-neutral-700"
                        >
                          Full Address *
                        </label>

                        <textarea
                          id="address"
                          name="address"
                          value={form.address}
                          onChange={handleInputChange}
                          autoComplete="street-address"
                          rows={3}
                          placeholder="Street name, house number, district..."
                          className={`w-full resize-y border bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 ${
                            errors.address
                              ? 'border-red-400'
                              : 'border-neutral-200'
                          }`}
                        />

                        {errors.address && (
                          <p className="mt-2 text-xs text-red-500">
                            {errors.address}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="city"
                          className="mb-2 block text-xs font-bold text-neutral-700"
                        >
                          City / Regency *
                        </label>

                        <input
                          id="city"
                          name="city"
                          value={form.city}
                          onChange={handleInputChange}
                          autoComplete="address-level2"
                          placeholder="Enter city or regency"
                          className={`w-full border bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 ${
                            errors.city
                              ? 'border-red-400'
                              : 'border-neutral-200'
                          }`}
                        />

                        {errors.city && (
                          <p className="mt-2 text-xs text-red-500">
                            {errors.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="province"
                          className="mb-2 block text-xs font-bold text-neutral-700"
                        >
                          Province *
                        </label>

                        <input
                          id="province"
                          name="province"
                          value={form.province}
                          onChange={handleInputChange}
                          autoComplete="address-level1"
                          placeholder="Enter province"
                          className={`w-full border bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 ${
                            errors.province
                              ? 'border-red-400'
                              : 'border-neutral-200'
                          }`}
                        />

                        {errors.province && (
                          <p className="mt-2 text-xs text-red-500">
                            {errors.province}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="postalCode"
                          className="mb-2 block text-xs font-bold text-neutral-700"
                        >
                          Postal Code *
                        </label>

                        <input
                          id="postalCode"
                          name="postalCode"
                          inputMode="numeric"
                          value={form.postalCode}
                          onChange={handleInputChange}
                          autoComplete="postal-code"
                          maxLength={5}
                          placeholder="5-digit postal code"
                          className={`w-full border bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 ${
                            errors.postalCode
                              ? 'border-red-400'
                              : 'border-neutral-200'
                          }`}
                        />

                        {errors.postalCode && (
                          <p className="mt-2 text-xs text-red-500">
                            {errors.postalCode}
                          </p>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Shipping Method */}
                  <section className="border border-neutral-200 bg-white p-5 sm:p-8">
                    <div className="mb-7 flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center bg-orange-50">
                        <HiOutlineTruck className="h-5 w-5 text-orange-500" />
                      </div>

                      <div>
                        <h2 className="text-lg font-black text-neutral-950">
                          Shipping Method
                        </h2>

                        <p className="mt-1 text-xs text-neutral-500">
                          Choose your preferred delivery option.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {shippingOptions.map((option) => (
                        <label
                          key={option.id}
                          className={`flex cursor-pointer items-start gap-4 border p-4 transition ${
                            shippingMethod === option.id
                              ? 'border-orange-500 bg-orange-50/50'
                              : 'border-neutral-200 hover:border-neutral-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="shippingMethod"
                            value={option.id}
                            checked={shippingMethod === option.id}
                            onChange={(event) =>
                              setShippingMethod(event.target.value)
                            }
                            className="mt-1 accent-orange-500"
                          />

                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-sm font-bold text-neutral-950">
                                {option.name}
                              </span>

                              <span className="text-sm font-extrabold text-neutral-950">
                                {subtotal >= 500000
                                  ? 'FREE'
                                  : formatPrice(option.price)}
                              </span>
                            </span>

                            <span className="mt-1 block text-xs leading-5 text-neutral-500">
                              {option.description}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>

                    {selectedShipping && (
                      <div className="mt-5 border border-neutral-200 bg-neutral-50 p-4">
                        <p className="text-xs font-bold text-neutral-700">
                          Estimated Arrival
                        </p>

                        <p className="mt-2 text-sm font-extrabold text-green-700">
                          {formatDate(
                            addBusinessDays(
                              new Date(),
                              selectedShipping.minDays,
                            ),
                          )}{' '}
                          –{' '}
                          {formatDate(
                            addBusinessDays(
                              new Date(),
                              selectedShipping.maxDays,
                            ),
                          )}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-neutral-500">
                          This is an estimate based on business days. Saturdays
                          and Sundays are excluded; public holidays are not
                          currently accounted for.
                        </p>
                      </div>
                    )}

                    {subtotal >= 500000 && (
                      <p className="mt-4 text-xs font-semibold text-green-600">
                        Congratulations! Your order qualifies for free shipping.
                      </p>
                    )}
                  </section>

                  {/* Payment Method */}
                  <section className="border border-neutral-200 bg-white p-5 sm:p-8">
                    <div className="mb-7 flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center bg-orange-50">
                        <HiOutlineCreditCard className="h-5 w-5 text-orange-500" />
                      </div>

                      <div>
                        <h2 className="text-lg font-black text-neutral-950">
                          Payment Method
                        </h2>

                        <p className="mt-1 text-xs text-neutral-500">
                          Select a demo payment method.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {paymentOptions.map((option) => (
                        <label
                          key={option.id}
                          className={`flex cursor-pointer items-start gap-4 border p-4 transition ${
                            paymentMethod === option.id
                              ? 'border-orange-500 bg-orange-50/50'
                              : 'border-neutral-200 hover:border-neutral-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={option.id}
                            checked={paymentMethod === option.id}
                            onChange={(event) =>
                              setPaymentMethod(event.target.value)
                            }
                            className="mt-1 accent-orange-500"
                          />

                          <span>
                            <span className="block text-sm font-bold text-neutral-950">
                              {option.name}
                            </span>

                            <span className="mt-1 block text-xs leading-5 text-neutral-500">
                              {option.description}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="mt-5 flex items-start gap-3 bg-neutral-50 p-4">
                      <HiOutlineShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-neutral-500" />

                      <p className="text-xs leading-5 text-neutral-500">
                        This is a portfolio demo. No real payment information
                        is collected or processed.
                      </p>
                    </div>
                  </section>
                </div>

                {/* Order Summary */}
                <aside className="border border-neutral-200 bg-white p-5 sm:p-7 lg:sticky lg:top-24">
                  <h2 className="text-lg font-black text-neutral-950">
                    Order Summary.
                  </h2>

                  <p className="mt-2 text-xs text-neutral-500">
                    {cartItems.length} selected product
                    {cartItems.length === 1 ? '' : 's'} · {totalItems}{' '}
                    {totalItems === 1 ? 'item' : 'items'}
                  </p>

                  <div className="mt-6 max-h-80 space-y-4 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="flex gap-3"
                      >
                        <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-neutral-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />

                          <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center bg-neutral-950 px-1 text-[10px] font-bold text-white">
                            {item.quantity}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold leading-5 text-neutral-950">
                            {item.name}
                          </p>

                          {(item.selectedSize || item.selectedColor) && (
                            <p className="mt-1 text-[10px] text-neutral-500">
                              {[item.selectedSize, item.selectedColor]
                                .filter(Boolean)
                                .join(' / ')}
                            </p>
                          )}

                          <p className="mt-2 text-xs font-extrabold text-neutral-950">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-4 border-t border-neutral-200 pt-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-neutral-500">Subtotal</span>

                      <span className="text-sm font-bold text-neutral-950">
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-neutral-500">
                        Shipping
                      </span>

                      <span className="text-sm font-bold text-neutral-950">
                        {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-neutral-200 pt-5">
                    <span className="text-sm font-extrabold uppercase tracking-wider text-neutral-950">
                      Total
                    </span>

                    <span className="text-lg font-black text-neutral-950">
                      {formatPrice(total)}
                    </span>
                  </div>

                  {errors.submit && (
                    <p role="alert" className="mt-4 text-xs leading-5 text-red-500">
                      {errors.submit}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || cartItems.length === 0}
                    className="mt-6 flex w-full items-center justify-center gap-3 bg-neutral-950 px-5 py-4 text-xs font-extrabold uppercase tracking-widest text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? 'Processing...' : 'Place Demo Order'}
                  </button>

                  <p className="mt-4 text-center text-[10px] leading-5 text-neutral-400">
                    Demo checkout only. No real payment will be processed.
                  </p>
                </aside>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Checkout