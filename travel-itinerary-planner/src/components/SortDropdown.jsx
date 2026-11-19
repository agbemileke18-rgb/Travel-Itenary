import '../styles/SortDropdown.css'

const sortOptions = [
  { value: 'name-asc', label: 'Name: A–Z' },
  { value: 'name-desc', label: 'Name: Z–A' },
  { value: 'budget-asc', label: 'Budget: Low to High' },
  { value: 'budget-desc', label: 'Budget: High to Low' },
]

export default function SortDropdown({
  onChange,
  options = sortOptions,
  value = 'name-asc',
}) {
  return (
    <label className="sort-dropdown">
      <span>Sort by</span>
      <select onChange={(event) => onChange?.(event.target.value)} value={value}>
        {options.map(({ label, value: optionValue }) => (
          <option key={optionValue} value={optionValue}>
            {label}
          </option>
        ))}
      </select>
    </label>
  )
}
