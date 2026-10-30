import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowUpRight, Check, RotateCcw } from 'lucide-react'
import { dateLimit, formatBookingDate, initialBooking, isSlotPast, localDate, parseBookingDate, validateBooking, type BookingErrors, type BookingValues } from '../lib/booking'
import { Eyebrow, Ornament, Reveal } from './Primitives'
import { TimeSelect } from './TimeSelect'

export function Reservation() {
  const [values, setValues] = useState<BookingValues>({ ...initialBooking })
  const [errors, setErrors] = useState<BookingErrors>({})
  const [submitted, setSubmitted] = useState<BookingValues | null>(null)
  const [clock, setClock] = useState(() => new Date())
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  useEffect(() => { const timer = window.setInterval(() => setClock(new Date()), 30000); return () => window.clearInterval(timer) }, [])
  useEffect(() => { if (submitted) successRef.current?.focus({ preventScroll: true }) }, [submitted])
  function update(field: keyof BookingValues, value: string) {
    // Native date inputs emit intermediate edits too. Keep a still-valid time;
    // only discard it when a complete date makes that slot unavailable.
    setValues(current => ({ ...current, [field]: value, ...(field === 'date' && parseBookingDate(value) && isSlotPast(value, current.time) ? { time: '' } : {}) }))
    setErrors(current => ({ ...current, [field]: undefined, ...(field === 'date' ? { time: undefined } : {}) }))
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateBooking(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      const firstField = Object.keys(nextErrors)[0]
      formRef.current?.querySelector<HTMLElement>(`[name="${firstField}"]`)?.focus()
      return
    }
    // Deliberately no network, localStorage, cookies or analytics: a UI demonstration only.
    setSubmitted({ ...values, name: values.name.trim() })
    setValues({ ...initialBooking })
  }
  function reset() {
    setSubmitted(null)
    setErrors({})
    window.setTimeout(() => nameRef.current?.focus(), 0)
  }
  const fieldA11y = (field: keyof BookingValues) => ({ 'aria-invalid': Boolean(errors[field]), 'aria-describedby': errors[field] ? `${field}-error` : undefined })
  const error = (field: keyof BookingValues) => errors[field] ? <span className="field-error" id={`${field}-error`}>{errors[field]}</span> : null
  return <section className="reservation-section section" id="reservation" aria-labelledby="reservation-title" tabIndex={-1}>
    <div className="wrap reservation-layout"><Reveal className="reservation-copy"><Eyebrow>VOTRE TABLE VOUS ATTEND</Eyebrow><h2 id="reservation-title">Для вечера,<br/>который хочется<br/><em>запомнить.</em></h2><p>Ужин вдвоём, встреча с друзьями или маленький праздник без повода. Представьте свой идеальный вечер — мы продумали для него каждую деталь.</p><div className="reservation-seal"><Ornament/><span>UN MOMENT<br/>À PARTAGER</span></div><div className="demo-notice"><span>ДЕМОНСТРАЦИОННОЕ БРОНИРОВАНИЕ</span><p>Это фанатский дизайн-концепт. Форма показывает сценарий бронирования: данные никуда не отправляются, столик не резервируется. Можно использовать вымышленные данные.</p></div></Reveal>
      <Reveal className="reservation-form-container" delay={0.1}>
        {submitted ? <div className="booking-success" ref={successRef} tabIndex={-1} aria-labelledby="success-title"><span className="success-icon"><Check size={30} strokeWidth={1}/></span><p className="eyebrow">ДЕМОНСТРАЦИЯ ЗАВЕРШЕНА</p><h3 id="success-title">Прекрасный<br/><em>план на вечер.</em></h3><p>{submitted.name}, вы успешно прошли сценарий бронирования.</p><dl><div><dt>Дата</dt><dd>{formatBookingDate(submitted.date)}</dd></div><div><dt>Время</dt><dd>{submitted.time}</dd></div><div><dt>Гостей</dt><dd>{submitted.guests}</dd></div></dl><p className="success-disclaimer"><strong>Реальная бронь не создана.</strong><br/>Данные никуда не отправлены и исчезнут при обновлении страницы.</p><button className="button button-burgundy" onClick={reset}>Попробовать ещё раз<RotateCcw size={16}/></button></div> : <form ref={formRef} onSubmit={submit} noValidate aria-describedby="form-disclaimer">
          <div className="form-heading"><h3>Ваш столик</h3><span>ДЕМО</span></div><p className="form-subtitle">Немного деталей для вашего вечера.</p>
          <div className="form-grid"><label className="field full">Имя гостя <span aria-hidden="true">*</span><input ref={nameRef} name="name" value={values.name} onChange={e => update('name', e.target.value)} placeholder="Как к вам обращаться?" autoComplete="given-name" required maxLength={60} {...fieldA11y('name')}/>{error('name')}</label>
          <label className="field full">Номер телефона <span aria-hidden="true">*</span><input name="phone" type="tel" inputMode="tel" value={values.phone} onChange={e => update('phone', e.target.value)} placeholder="+7 (700) 123-45-67" autoComplete="tel" required maxLength={24} {...fieldA11y('phone')}/>{error('phone')}</label>
          <label className="field">Дата <span aria-hidden="true">*</span><input name="date" type="date" min={localDate(clock)} max={dateLimit(clock)} value={values.date} onChange={e => update('date', e.target.value)} required {...fieldA11y('date')}/>{error('date')}</label>
          <TimeSelect value={values.time} date={values.date} now={clock} onChange={value => update('time', value)} error={errors.time}/>
          <label className="field full">Количество гостей <span aria-hidden="true">*</span><select name="guests" value={values.guests} onChange={e => update('guests', e.target.value)} required {...fieldA11y('guests')}>{Array.from({ length: 8 }, (_, i) => <option value={String(i + 1)} key={i}>{i + 1} {i === 0 ? 'гость' : i < 4 ? 'гостя' : 'гостей'}</option>)}</select>{error('guests')}</label>
          <label className="field full">Пожелания <span className="optional">необязательно</span><textarea name="wishes" rows={2} value={values.wishes} onChange={e => update('wishes', e.target.value)} placeholder="Особый повод или любимый столик у окна…" maxLength={500} {...fieldA11y('wishes')}/>{error('wishes')}<span className="character-count">{values.wishes.length} / 500</span></label></div>
          <p className="sr-only" role="status">{Object.values(errors).filter(Boolean).length ? 'Проверьте поля формы. Первое поле с ошибкой выделено.' : ''}</p>
          <button type="submit" className="button button-burgundy form-submit">Забронировать · демо<ArrowUpRight size={18}/></button><p id="form-disclaimer" className="form-disclaimer">* Обязательные поля. Настоящая бронь не создаётся.<br/>Данные остаются только в памяти этой страницы.</p>
        </form>}
      </Reveal>
    </div>
  </section>
}
