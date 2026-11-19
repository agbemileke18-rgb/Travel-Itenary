import { useEffect } from 'react'
import { Link, Outlet, Route, Routes, useLocation } from 'react-router'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import LandingPage from './pages/LandingPage.jsx'
import BrowseDestinationsPage from './pages/BrowseDestinationsPage.jsx'
import DestinationDetailsPage from './pages/DestinationDetailsPage.jsx'
import TripFormPage from './pages/TripFormPage.jsx'
import MyItineraryPage from './pages/MyItineraryPage.jsx'
import './App.css'

function ScrollToTop() {
  const { pathname, search, hash } = useLocation()

  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, search, hash])

  return null
}

function AppLayout() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <span className="not-found-page__code">404</span>
      <h1>This page is off the map.</h1>
      <p>The page you’re looking for may have moved or may no longer exist.</p>
      <Link className="not-found-page__link" to="/">
        Back to home
      </Link>
    </main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="destinations" element={<BrowseDestinationsPage />} />
        <Route path="destinations/:id" element={<DestinationDetailsPage />} />
        <Route path="trip/new" element={<TripFormPage />} />
        <Route path="trip/edit/:id" element={<TripFormPage />} />
        <Route path="itinerary" element={<MyItineraryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
