import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { Menu, Plane, X } from 'lucide-react'
import { useTrips } from '../context/TripContext.jsx'
import '../styles/Navbar.css'

const navigationItems = [
  { label: 'Home', to: '/', end: true },
  { label: 'Destinations', to: '/destinations' },
  { label: 'Create Trip', to: '/trip/new' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { activeTrip } = useTrips()
  const activityCount = activeTrip?.activities?.length ?? 0

  return (
    <header className="site-header">
      <div className="navbar">
        <Link
          className="navbar__brand"
          onClick={() => setMenuOpen(false)}
          to="/"
          aria-label="Wayfarer home"
        >
          <span className="navbar__brand-icon" aria-hidden="true">
            <Plane size={19} strokeWidth={2.2} />
          </span>
          <span>wayfarer</span>
        </Link>

        <button
          className="navbar__toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav
          className={`navbar__navigation${menuOpen ? ' navbar__navigation--open' : ''}`}
          id="primary-navigation"
          aria-label="Primary navigation"
        >
          {navigationItems.map(({ label, to, end }) => (
            <NavLink
              className={({ isActive }) =>
                `navbar__link${isActive ? ' navbar__link--active' : ''}`
              }
              end={end}
              key={to}
              onClick={() => setMenuOpen(false)}
              to={to}
            >
              {label}
            </NavLink>
          ))}
          <NavLink
            className={({ isActive }) =>
              `navbar__link navbar__itinerary-link${isActive ? ' navbar__link--active' : ''}`
            }
            onClick={() => setMenuOpen(false)}
            to="/itinerary"
          >
            My Itinerary
            <span className="navbar__activity-count" aria-label={`${activityCount} scheduled activities`}>
              {activityCount}
            </span>
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
