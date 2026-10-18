import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
HiArrowLeft,
HiOutlineShoppingBag,
HiOutlineClipboardDocumentList,
HiOutlineArrowRight,
HiOutlineCheckCircle,
HiOutlineClock,
HiOutlineXCircle,
HiOutlineCalendarDays,
HiOutlineCreditCard,
HiOutlineTruck,
} from 'react-icons/hi2'

import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const formatPrice = (price) => {
return new Intl.NumberFormat('id-ID', {
style: 'currency',
currency: 'IDR',
maximumFractionDigits: 0,
}).format(Number(price) || 0)
}

// Format tanggal tanpa jam, cocok untuk tanggal estimasi kedatangan.
const formatDeliveryDate = (dateString) => {
if (!dateString) return null

// Tangani format YYYY-MM-DD agar tanggal tidak bergeser karena timezone.
const match = String(dateString).match(/^(\d{4})-(\d{2})-(\d{2})$/)

let date

if (match) {
date = new Date(
Number(match[1]),
Number(match[2]) - 1,
Number(match[3]),
)
} else {
date = new Date(dateString)
}

if (Number.isNaN(date.getTime())) return null

return new Intl.DateTimeFormat('id-ID', {
day: 'numeric',
month: 'long',
year: 'numeric',
}).format(date)
}

const formatDate = (date) => {
if (!date) return '-'

const parsedDate = new Date(date)

if (Number.isNaN(parsedDate.getTime())) return '-'

return new Intl.DateTimeFormat('id-ID', {
day: 'numeric',
month: 'long',
year: 'numeric',
hour: '2-digit',
minute: '2-digit',
}).format(parsedDate)
}

const getStatusStyle = (status) => {
const normalizedStatus = String(status || '').toLowerCase()

if (normalizedStatus.includes('cancel')) {
return {
label: status,
className: 'bg-red-50 text-red-600 border-red-100',
icon: HiOutlineXCircle,
}
}

if (
normalizedStatus.includes('complete') ||
normalizedStatus.includes('selesai') ||
normalizedStatus.includes('success')
) {
return {
label: status,
className: 'bg-green-50 text-green-700 border-green-100',
icon: HiOutlineCheckCircle,
}
}

return {
label: status || 'Menunggu Konfirmasi',
className: 'bg-orange-50 text-orange-600 border-orange-100',
icon: HiOutlineClock,
}
}

// Membaca estimasi dari format data Checkout.
const getDeliveryEstimate = (order) => {
const estimate = order.estimatedDelivery

if (estimate) {
const earliest = formatDeliveryDate(estimate.earliest)
const latest = formatDeliveryDate(estimate.latest)

// Gunakan label yang tersimpan jika tanggal tidak tersedia.
if (earliest && latest) {
  return earliest === latest ? earliest : `${earliest} – ${latest}`
}

if (estimate.label) return estimate.label

}

// Mendukung kemungkinan format data estimasi yang berbeda.
if (order.estimatedDeliveryDate) {
return formatDeliveryDate(order.estimatedDeliveryDate)
}

if (order.estimatedArrival) {
return formatDeliveryDate(order.estimatedArrival)
}

return null
}

const OrderHistory = () => {
const [orders, setOrders] = useState([])

useEffect(() => {
const loadOrders = () => {
try {
const savedOrders = JSON.parse(
localStorage.getItem('nebula-orders') || '[]',
)

    setOrders(Array.isArray(savedOrders) ? savedOrders : [])
  } catch (error) {
    console.error('Failed to load order history:', error)
    setOrders([])
  }
}

loadOrders()


window.addEventListener('storage', loadOrders)
window.addEventListener('nebula-orders-updated', loadOrders)

return () => {
  window.removeEventListener('storage', loadOrders)
  window.removeEventListener('nebula-orders-updated', loadOrders)
}

}, [])

return ( <div className="min-h-screen bg-neutral-50"> <Navbar />

  <main className="px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
    <div className="mx-auto max-w-6xl">
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 transition hover:text-orange-500"
      >
        <HiArrowLeft className="h-4 w-4" />
        Continue Shopping
      </Link>

      <div className="mb-10 flex flex-col justify-between gap-5 border-b border-neutral-200 pb-8 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
            Your NEBULA Account
          </p>

          <h1 className="text-3xl font-black tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
            Order History.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500">
            Keep track of your purchases and review the details of your
            previous orders.
          </p>
        </div>

        <div className="flex w-fit items-center gap-3 border border-neutral-200 bg-white px-5 py-4">
          <HiOutlineClipboardDocumentList className="h-6 w-6 text-orange-500" />

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Total Orders
            </p>

            <p className="text-xl font-black text-neutral-950">
              {orders.length.toString().padStart(2, '0')}
            </p>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="border border-neutral-200 bg-white px-5 py-16 text-center sm:py-24">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
            <HiOutlineShoppingBag className="h-10 w-10 text-neutral-400" />
          </div>

          <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.25em] text-orange-500">
            Nothing Here Yet
          </p>

          <h2 className="mt-3 text-2xl font-black text-neutral-950 sm:text-3xl">
            No orders yet.
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-500">
            Your order history will appear here after you complete your
            first checkout.
          </p>

          <Link
            to="/"
            className="mt-7 inline-flex items-center justify-center gap-3 bg-neutral-950 px-7 py-4 text-xs font-extrabold uppercase tracking-widest text-white transition-colors duration-300 hover:bg-orange-500"
          >
            Explore Collection
            <HiOutlineArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => {
            const status = getStatusStyle(order.status)
            const StatusIcon = status.icon
            const deliveryEstimate = getDeliveryEstimate(order)

            return (
              <article
                key={order.orderId || index}
                className="overflow-hidden border border-neutral-200 bg-white transition-shadow duration-300 hover:shadow-md"
              >
                <div className="flex flex-col gap-5 border-b border-neutral-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                      Order Number
                    </p>

                    <h2 className="mt-2 text-lg font-black text-neutral-950">
                      {order.orderId || 'NEBULA Order'}
                    </h2>

                    <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
                      <HiOutlineCalendarDays className="h-4 w-4" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  <div
                    className={`flex w-fit items-center gap-2 border px-3 py-2 text-xs font-bold ${status.className}`}
                  >
                    <StatusIcon className="h-4 w-4" />
                    {status.label}
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="space-y-4">
                    {(Array.isArray(order.items) ? order.items : []).map(
                      (item, itemIndex) => (
                        <div
                          key={`${item.id || item.name || 'item'}-${itemIndex}`}
                          className="flex gap-4"
                        >
                          <div className="h-20 w-16 shrink-0 overflow-hidden bg-neutral-100 sm:h-24 sm:w-20">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name || 'Product'}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <HiOutlineShoppingBag className="h-6 w-6 text-neutral-300" />
                              </div>
                            )}
                          </div>

                          <div className="flex min-w-0 flex-1 flex-col justify-center">
                            <h3 className="text-sm font-bold text-neutral-950">
                              {item.name || 'Product'}
                            </h3>

                            <p className="mt-1 text-xs text-neutral-500">
                              Quantity: {Number(item.quantity) || 1}
                            </p>

                            {item.selectedSize && (
                              <p className="mt-1 text-xs text-neutral-500">
                                Size: {item.selectedSize}
                              </p>
                            )}

                            {item.selectedColor && (
                              <p className="mt-1 text-xs text-neutral-500">
                                Color: {item.selectedColor}
                              </p>
                            )}

                            <p className="mt-2 text-sm font-extrabold text-neutral-950">
                              {formatPrice(
                                (Number(item.price) || 0) *
                                  (Number(item.quantity) || 1),
                              )}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  <div className="mt-6 grid gap-4 border-t border-neutral-100 pt-5 sm:grid-cols-2">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <HiOutlineTruck className="h-4 w-4" />
                        Shipping Method
                      </div>

                      <p className="mt-2 text-sm font-bold text-neutral-950">
                        {order.shippingMethod || 'Regular Delivery'}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <HiOutlineCreditCard className="h-4 w-4" />
                        Payment Method
                      </div>

                      <p className="mt-2 text-sm font-bold text-neutral-950">
                        {order.paymentMethod || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  {/* Estimasi kedatangan pesanan */}
                  <div className="mt-5 flex gap-3 border border-orange-200 bg-orange-50 p-4">
                    <HiOutlineTruck className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />

                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-orange-600">
                        Estimated Delivery
                      </p>

                      {deliveryEstimate ? (
                        <>
                          <p className="mt-1 text-sm font-extrabold text-neutral-950">
                            {deliveryEstimate}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-neutral-600">
                            {order.shippingMethodId === 'express' ||
                            String(order.shippingMethod || '')
                              .toLowerCase()
                              .includes('express')
                              ? 'Express Delivery · Estimasi 1–2 hari kerja'
                              : 'Regular Delivery · Estimasi 3–5 hari kerja'}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="mt-1 text-sm font-bold text-neutral-950">
                            Estimasi belum tersedia
                          </p>

                          <p className="mt-1 text-xs leading-5 text-neutral-600">
                            Pesanan ini dibuat sebelum informasi estimasi
                            kedatangan tersedia. Buat pesanan baru untuk
                            menyimpan estimasi tanggal kedatangan.
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-4 border-t border-neutral-200 pt-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                        Total Payment
                      </p>

                      <p className="mt-1 text-xl font-black text-neutral-950">
                        {formatPrice(order.total)}
                      </p>

                      <p className="mt-1 text-xs text-neutral-400">
                        Including shipping
                      </p>
                    </div>

                    <Link
                      to="/"
                      className="inline-flex items-center justify-center gap-2 border border-neutral-200 px-5 py-3 text-xs font-extrabold uppercase tracking-widest text-neutral-950 transition hover:border-neutral-950"
                    >
                      Shop Again
                      <HiOutlineArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <div className="mt-8 flex items-start gap-3 border border-orange-100 bg-orange-50 p-4">
        <HiOutlineClock className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />

        <p className="text-xs leading-5 text-neutral-600">
          <span className="font-bold text-neutral-950">Portfolio demo:</span>{' '}
          Order information is saved in this browser only. No real payment
          is processed, and orders are not synchronized between devices.
        </p>
      </div>
    </div>
  </main>

  <Footer />
</div>
)
}

export default OrderHistory
