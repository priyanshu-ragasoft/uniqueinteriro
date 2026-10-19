import { countries } from '../data/countries'

export default function CountrySelect({ value, onChange, label, optionClass }) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-auto max-w-full shrink-0 cursor-pointer bg-transparent py-2 pr-1 text-[15px] outline-none"
      style={{ fieldSizing: 'content' }}
    >
      {countries.map((country) => (
        <option key={country.id} value={country.id} className={optionClass}>
          {country.name} {country.dial}
        </option>
      ))}
    </select>
  )
}
