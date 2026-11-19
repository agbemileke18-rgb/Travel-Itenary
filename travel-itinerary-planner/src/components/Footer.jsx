import { Link } from 'react-router'
import { Compass, Heart } from 'lucide-react'
import '../styles/Footer.css'

const footerLinks = [
  { label: 'Home', to: '/' },
  { label: 'Destinations', to: '/destinations' },
  { label: 'Create a trip', to: '/trip/new' },
  { label: 'My itinerary', to: '/itinerary' },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer__main">
        <div className="footer__about">
          <Link className="footer__brand" to="/">
            <Compass size={21} aria-hidden="true" />
            <span>wayfarer</span>
          </Link>
          <p>Thoughtful trip planning, from the first idea to the journey home.</p>
        </div>

        <nav className="footer__navigation" aria-label="Footer navigation">
          <h2>Explore</h2>
          {footerLinks.map(({ label, to }) => (
            <Link key={to} to={to}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="footer__project">
          <h2>Plan with purpose</h2>
          <p>Save your favorite places and shape a trip that feels like yours.</p>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© Wayfarer Travel Planner</span>
        <span className="footer__made-with">
          Made for curious travelers <Heart size={14} aria-hidden="true" />
        </span>
      </div>
    </footer>
  )
}
