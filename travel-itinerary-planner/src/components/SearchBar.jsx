import { Search } from 'lucide-react'
import '../styles/SearchBar.css'

export default function SearchBar({
  label = 'Search destinations',
  onChange,
  placeholder = 'Where would you like to go?',
  value = '',
}) {
  return (
    <label className="search-bar">
      <Search className="search-bar__icon" size={20} aria-hidden="true" />
      <span className="search-bar__label">{label}</span>
      <input
        autoComplete="off"
        className="search-bar__input"
        onChange={onChange}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </label>
  )
}
