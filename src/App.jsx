import { Routes, Route } from 'react-router-dom'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/home/Hero'
import Categories from './components/home/Categories'
import FeaturedProducts from './components/home/FeaturedProducts'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderHistory from './pages/OrderHistory'
import Wishlist from './pages/Wishlist'

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <Hero />
        <Categories />
        <FeaturedProducts />
      </main>

      <Footer />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<OrderHistory />} />
      <Route path="/wishlist" element={<Wishlist />} />
    </Routes>
  )
}

export default App