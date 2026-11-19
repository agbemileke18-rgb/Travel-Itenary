import { ArrowRight, Compass, Map, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import DestinationCard from '../components/DestinationCard.jsx'
import { destinations } from '../data/destinations.js'
import '../styles/LandingPage.css'

const steps = [
  {
    number: '01',
    title: 'Find your somewhere',
    description: 'Explore inspiring places and discover the one that feels right for you.',
    Icon: Compass,
  },
  {
    number: '02',
    title: 'Shape your itinerary',
    description: 'Save the sights, flavors, and little moments you do not want to miss.',
    Icon: Map,
  },
  {
    number: '03',
    title: 'Go make memories',
    description: 'Keep your plans together and leave room for the unexpected.',
    Icon: Sparkles,
  },
]

export default function LandingPage() {
  const featuredDestinations = destinations.slice(0, 3)

  return (
    <main className="landing-page">
      <section
        className="landing-hero"
        style={{ '--landing-hero-image': `url("${destinations[0].image}")` }}
      >
        <div className="landing-hero__content">
          <span className="landing-eyebrow">
            <Compass size={15} aria-hidden="true" />
            Make room for wonder
          </span>
          <h1>Find your next faraway feeling.</h1>
          <p>
            Thoughtful travel starts with a little inspiration. Discover somewhere new
            and turn the places you love into a journey of your own.
          </p>
          <div className="landing-hero__actions">
            <Link className="landing-cta landing-cta--light" to="/destinations">
              Explore Destinations
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link className="landing-cta landing-cta--outline" to="/trip/new">
              Plan a New Trip
            </Link>
          </div>
        </div>
        <div className="landing-hero__note">
          <span>01</span>
          <p>A world of good days awaits</p>
        </div>
      </section>

      <section className="landing-section landing-featured" aria-labelledby="featured-title">
        <div className="landing-section__heading">
          <div>
            <span className="landing-kicker">A little inspiration</span>
            <h2 id="featured-title">Featured Destinations</h2>
          </div>
          <Link className="landing-text-link" to="/destinations">
            View all destinations
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="landing-destination-grid">
          {featuredDestinations.map((destination) => (
            <DestinationCard destination={destination} key={destination.id} />
          ))}
        </div>
      </section>

      <section className="landing-how" aria-labelledby="how-title">
        <div className="landing-how__intro">
          <span className="landing-kicker">From daydream to departure</span>
          <h2 id="how-title">A better trip starts with a simple plan.</h2>
          <p>Bring your ideas together and make every day away feel like your own.</p>
        </div>
        <div className="landing-steps">
          {steps.map(({ number, title, description, Icon }) => (
            <article className="landing-step" key={number}>
              <div className="landing-step__top">
                <span>{number}</span>
                <Icon size={21} aria-hidden="true" />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
