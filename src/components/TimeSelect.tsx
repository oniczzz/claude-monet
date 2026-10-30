import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { ChevronDown, Clock3 } from 'lucide-react'
import { isSlotPast, timeSlots } from '../lib/booking'

interface TimeSelectProps {
  value: string
  date: string
  now: Date
  onChange: (value: string) => void
  error?: string
}

/** Focus stays on the combobox; navigation never commits a value until confirmed. */
export function TimeSelect({ value, date, now, onChange, error }: TimeSelectProps) {
  const id = useId()
  const listId = `${id}-list`
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const searchRef = useRef({ text: '', timestamp: 0 })
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const available = timeSlots.filter(time => !isSlotPast(date, time, now))
  const activeTime = available.includes(active) ? active : available[0]

  useEffect(() => {
    if (!open) return
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])

  useEffect(() => {
    const list = listRef.current
    const option = list?.querySelector<HTMLElement>('[data-active="true"]')
    if (!list || !option) return
    // Scroll only the list, without pulling the entire form out of view.
    if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop
    else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight
    }
  }, [open, activeTime])

  function show(last = false) {
    setActive(available.includes(value) ? value : (last ? available.at(-1) : available[0]) ?? '')
    searchRef.current = { text: '', timestamp: 0 }
    setOpen(true)
  }

  function choose(time: string) {
    if (!available.includes(time)) return
    onChange(time)
    setOpen(false)
    triggerRef.current?.focus({ preventScroll: true })
  }

  function keyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const { key } = event
    if (key === 'Tab') { setOpen(false); return }
    if (key === 'Escape') {
      if (open) { event.preventDefault(); event.stopPropagation(); setOpen(false) }
      return
    }
    if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter', ' '].includes(key)) {
      event.preventDefault()
      if (!open) {
        show(key === 'ArrowUp' || key === 'End')
        if (key === 'Home') setActive(available[0] ?? '')
        if (key === 'End') setActive(available.at(-1) ?? '')
      } else if (key === 'Enter' || key === ' ') {
        if (activeTime) choose(activeTime)
      } else if (key === 'Home' || key === 'End') {
        setActive((key === 'Home' ? available[0] : available.at(-1)) ?? '')
      } else {
        const columns = listRef.current ? getComputedStyle(listRef.current).gridTemplateColumns.split(' ').length : 1
        const step = key === 'ArrowDown' ? columns : key === 'ArrowUp' ? -columns : key === 'ArrowRight' ? 1 : -1
        // Move by the visual row vertically, skipping unavailable slots.
        for (let index = timeSlots.indexOf(activeTime) + step; index >= 0 && index < timeSlots.length; index += step) {
          if (available.includes(timeSlots[index])) { setActive(timeSlots[index]); break }
        }
      }
    } else if (/^[\d:]$/.test(key) && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault()
      const timestamp = Date.now()
      const text = (open && timestamp - searchRef.current.timestamp < 700 ? searchRef.current.text : '') + key
      searchRef.current = { text, timestamp }
      const match = available.find(time => time.startsWith(text))
      if (match) { setActive(match); setOpen(true) }
    }
  }

  return <div className="field time-field" ref={rootRef} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
  }}>
    <label htmlFor={id}>Время <span aria-hidden="true">*</span></label>
    <button ref={triggerRef} id={id} name="time" type="button" role="combobox"
      className="time-select-trigger" data-filled={Boolean(value)} aria-haspopup="listbox" aria-expanded={open}
      aria-controls={open ? listId : undefined} aria-activedescendant={open && activeTime ? `${id}-${activeTime}` : undefined}
      aria-required="true" aria-invalid={Boolean(error)} aria-describedby={error ? 'time-error' : undefined}
      onClick={() => open ? setOpen(false) : show()} onKeyDown={keyDown}>
      <span className="time-select-value"><Clock3 size={16} strokeWidth={1.4} aria-hidden="true"/>{value || 'Выберите время'}</span>
      <ChevronDown className="time-select-chevron" size={15} strokeWidth={1.4} aria-hidden="true"/>
    </button>
    <input type="hidden" name="time" value={value}/>
    {open && <div className="time-select-panel">
      <div className="time-select-heading" aria-hidden="true"><span>Время визита</span><span>Шаг 30 мин</span></div>
      <ul ref={listRef} id={listId} role="listbox" aria-label="Время" className="time-select-list">
        {timeSlots.map(time => <li id={`${id}-${time}`} key={time} role="option"
          aria-selected={value === time} aria-disabled={!available.includes(time)}
          data-active={activeTime === time} onPointerDown={event => event.preventDefault()}
          onClick={() => choose(time)}>{time}</li>)}
      </ul>
      {!available.length && <p className="time-select-empty" role="status">На эту дату время уже прошло. Выберите другую дату.</p>}
    </div>}
    {error && <span className="field-error" id="time-error">{error}</span>}
  </div>
}
