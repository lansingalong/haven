import {
  useState,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
  ChangeEvent,
} from 'react'
import styles from './Autocomplete.module.css'

export interface AutocompleteOption {
  label: string
  value: string
}

/* ── Single-select ── */
export interface AutocompleteSingleProps {
  options: AutocompleteOption[]
  value: AutocompleteOption | null
  onChange: (value: AutocompleteOption | null) => void
  label?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
  helperText?: string
  id?: string
}

export function AutocompleteSingle({
  options,
  value,
  onChange,
  label,
  placeholder = 'Search…',
  disabled = false,
  error = false,
  helperText,
  id,
}: AutocompleteSingleProps) {
  const [inputValue, setInputValue] = useState(value?.label ?? '')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(inputValue.toLowerCase())
  )

  useEffect(() => {
    setInputValue(value?.label ?? '')
  }, [value])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setOpen(true)
    setActiveIndex(-1)
    if (!e.target.value) onChange(null)
  }

  const handleSelect = useCallback((opt: AutocompleteOption) => {
    onChange(opt)
    setInputValue(opt.label)
    setOpen(false)
    setActiveIndex(-1)
    inputRef.current?.blur()
  }, [onChange])

  const handleClear = () => {
    onChange(null)
    setInputValue('')
    setOpen(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') setOpen(true)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      handleSelect(filtered[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
      setInputValue(value?.label ?? '')
    }
  }

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex])

  const inputId = id ?? 'autocomplete-single'
  const listId = `${inputId}-listbox`

  return (
    <div className={`${styles.root} ${disabled ? styles.disabled : ''} ${error ? styles.error : ''}`}>
      {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
      <div className={styles.inputWrap}>
        <input
          ref={inputRef}
          id={inputId}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined}
          className={styles.input}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
        {value && !disabled && (
          <button
            className={styles.clearBtn}
            onClick={handleClear}
            tabIndex={-1}
            aria-label="Clear"
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
        <span className={styles.chevron} aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
      {open && filtered.length > 0 && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className={styles.listbox}
        >
          {filtered.map((opt, i) => (
            <li
              key={opt.value}
              id={`${listId}-opt-${i}`}
              role="option"
              aria-selected={value?.value === opt.value}
              className={`${styles.option} ${i === activeIndex ? styles.active : ''} ${value?.value === opt.value ? styles.selected : ''}`}
              onMouseDown={() => handleSelect(opt)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
      {helperText && (
        <p className={styles.helperText}>{helperText}</p>
      )}
    </div>
  )
}

/* ── Multi-select ── */
export interface AutocompleteMultiProps {
  options: AutocompleteOption[]
  value: AutocompleteOption[]
  onChange: (value: AutocompleteOption[]) => void
  label?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
  helperText?: string
  id?: string
}

export function AutocompleteMulti({
  options,
  value,
  onChange,
  label,
  placeholder = 'Search…',
  disabled = false,
  error = false,
  helperText,
  id,
}: AutocompleteMultiProps) {
  const [inputValue, setInputValue] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selectedValues = new Set(value.map(v => v.value))
  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(inputValue.toLowerCase())
  )

  const handleSelect = useCallback((opt: AutocompleteOption) => {
    if (selectedValues.has(opt.value)) {
      onChange(value.filter(v => v.value !== opt.value))
    } else {
      onChange([...value, opt])
    }
    setInputValue('')
    inputRef.current?.focus()
  }, [value, onChange, selectedValues])

  const handleRemoveChip = (optValue: string) => {
    onChange(value.filter(v => v.value !== optValue))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1))
      return
    }
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') setOpen(true)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      handleSelect(filtered[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const inputId = id ?? 'autocomplete-multi'
  const listId = `${inputId}-listbox`

  return (
    <div className={`${styles.root} ${disabled ? styles.disabled : ''} ${error ? styles.error : ''}`}>
      {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
      <div className={`${styles.inputWrap} ${styles.multiWrap}`}>
        {value.map(opt => (
          <span key={opt.value} className={styles.chip}>
            {opt.label}
            {!disabled && (
              <button
                className={styles.chipDelete}
                onClick={() => handleRemoveChip(opt.value)}
                tabIndex={-1}
                type="button"
                aria-label={`Remove ${opt.label}`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </span>
        ))}
        <input
          ref={inputRef}
          id={inputId}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          className={`${styles.input} ${styles.multiInput}`}
          value={inputValue}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={disabled}
          onChange={e => { setInputValue(e.target.value); setOpen(true); setActiveIndex(-1) }}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
      </div>
      {open && filtered.length > 0 && (
        <ul ref={listRef} id={listId} role="listbox" className={styles.listbox}>
          {filtered.map((opt, i) => (
            <li
              key={opt.value}
              id={`${listId}-opt-${i}`}
              role="option"
              aria-selected={selectedValues.has(opt.value)}
              className={`${styles.option} ${i === activeIndex ? styles.active : ''} ${selectedValues.has(opt.value) ? styles.selected : ''}`}
              onMouseDown={() => handleSelect(opt)}
            >
              <span className={`${styles.checkmark} ${selectedValues.has(opt.value) ? styles.checkmarkVisible : ''}`}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              {opt.label}
            </li>
          ))}
        </ul>
      )}
      {helperText && <p className={styles.helperText}>{helperText}</p>}
    </div>
  )
}
