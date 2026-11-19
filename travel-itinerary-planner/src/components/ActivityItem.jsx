import { useState } from 'react'
import { Clock3, Pencil, Trash2 } from 'lucide-react'
import Button from './Button.jsx'
import Modal from './Modal.jsx'
import '../styles/ActivityItem.css'

function formatTime(time) {
  const [hours, minutes] = time.split(':').map(Number)
  const hour = hours % 12 || 12
  return `${hour}:${String(minutes).padStart(2, '0')} ${hours < 12 ? 'AM' : 'PM'}`
}

export default function ActivityItem({ activity, onDelete, onEdit }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  function handleDelete() {
    onDelete(activity.id)
    setConfirmDelete(false)
  }

  return (
    <article className="activity-item">
      <div className="activity-item__time">
        <Clock3 size={15} aria-hidden="true" />
        <time>{formatTime(activity.time)}</time>
      </div>

      <div className="activity-item__details">
        <div className="activity-item__title-row">
          <h3>{activity.title}</h3>
          <span className="activity-item__category">{activity.category}</span>
        </div>
        {activity.notes && <p>{activity.notes}</p>}
      </div>

      <div className="activity-item__actions">
        <button
          aria-label={`Edit ${activity.title}`}
          className="activity-item__icon-button"
          onClick={() => onEdit(activity)}
          type="button"
        >
          <Pencil size={16} aria-hidden="true" />
        </button>
        <button
          aria-label={`Delete ${activity.title}`}
          className="activity-item__icon-button activity-item__icon-button--danger"
          onClick={() => setConfirmDelete(true)}
          type="button"
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </div>

      <Modal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete this activity?"
      >
        <p className="activity-item__confirm-copy">
          “{activity.title}” will be removed from your itinerary.
        </p>
        <div className="activity-item__confirm-actions">
          <Button onClick={() => setConfirmDelete(false)} variant="secondary">
            Keep Activity
          </Button>
          <Button onClick={handleDelete} variant="danger">
            Delete Activity
          </Button>
        </div>
      </Modal>
    </article>
  )
}
