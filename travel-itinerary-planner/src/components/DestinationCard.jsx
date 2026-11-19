import { Link } from 'react-router'
import { ArrowUpRight, MapPin } from 'lucide-react'
import '../styles/DestinationCard.css'

export default function DestinationCard({ destination }) {
  const {
    id,
    name,
    country,
    region,
    category,
    estimatedDailyBudget,
    image,
    description,
  } = destination

  return (
    <article className="destination-card">
      <Link
        aria-label={`View details for ${name}, ${country}`}
        className="destination-card__image-link"
        to={`/destinations/${encodeURIComponent(id)}`}
      >
        <img
          alt={`${name}, ${country}`}
          className="destination-card__image"
          loading="lazy"
          src={image}
        />
      </Link>
      <div className="destination-card__body">
        <div className="destination-card__badges">
          <span className="destination-card__badge">{region}</span>
          <span className="destination-card__badge destination-card__badge--category">
            {category}
          </span>
        </div>

        <div className="destination-card__heading">
          <div>
            <h2>{name}</h2>
            <p className="destination-card__location">
              <MapPin size={14} aria-hidden="true" />
              {country}
            </p>
          </div>
          <p className="destination-card__budget">
            <strong>${estimatedDailyBudget}</strong>
            <span>/ day</span>
          </p>
        </div>

        <p className="destination-card__description">{description}</p>

        <Link className="destination-card__details" to={`/destinations/${encodeURIComponent(id)}`}>
          View Details
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
