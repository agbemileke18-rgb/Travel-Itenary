import '../styles/Button.css'

export default function Button({
  children,
  className = '',
  disabled = false,
  onClick,
  size = 'medium',
  type = 'button',
  variant = 'primary',
}) {
  return (
    <button
      className={`button button--${variant} button--${size}${className ? ` ${className}` : ''}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  )
}
