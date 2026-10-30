export interface BookingValues { name: string; phone: string; date: string; time: string; guests: string; wishes: string }
export type BookingErrors = Partial<Record<keyof BookingValues, string>>
export const initialBooking: BookingValues = { name: '', phone: '', date: '', time: '', guests: '2', wishes: '' }
export const timeSlots = Array.from({ length: 21 }, (_, i) => `${String(12 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`)
/** The demo uses the visitor's local timezone; never UTC slicing near midnight. */
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
export function dateLimit(now = new Date()) {
  const max = new Date(now)
  max.setDate(max.getDate() + 90)
  return localDate(max)
}
/** Accept only a complete ISO calendar date, with no rollover or UTC conversion. */
export function parseBookingDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000-')) return null
  const date = new Date(`${value}T12:00:00`)
  return Number.isFinite(date.getTime()) && localDate(date) === value ? date : null
}
export function isSlotPast(date: string, time: string, now = new Date()) {
  const slot = parseBookingDate(date)
  if (!slot || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) return false
  const [hours, minutes] = time.split(':').map(Number)
  slot.setHours(hours, minutes, 0, 0)
  return slot.getTime() <= now.getTime()
}
export function validateBooking(values: BookingValues, now = new Date()): BookingErrors {
  const errors: BookingErrors = {}
  const name = values.name.trim()
  if (name.length < 2 || name.length > 60 || !/^[\p{L}][\p{L}\p{M}\s’'\-]+$/u.test(name)) errors.name = 'Укажите имя: от 2 до 60 букв.'
  const digits = values.phone.replace(/\D/g, '')
  if (!/^[+\d\s()\-]+$/.test(values.phone) || !/^[78]\d{10}$/.test(digits)) errors.phone = 'Введите номер в формате +7 (700) 123-45-67.'
  if (!parseBookingDate(values.date)) errors.date = 'Выберите существующую дату.'
  else if (values.date < localDate(now)) errors.date = 'Выберите сегодняшнюю или будущую дату.'
  else if (values.date > dateLimit(now)) errors.date = 'Выберите дату в ближайшие 90 дней.'
  if (!timeSlots.includes(values.time)) errors.time = 'Выберите время с 12:00 до 22:00.'
  else if (!errors.date && isSlotPast(values.date, values.time, now)) errors.time = 'Это время уже прошло. Выберите другое.'
  if (!/^[1-8]$/.test(values.guests)) errors.guests = 'Выберите от 1 до 8 гостей.'
  if (values.wishes.length > 500) errors.wishes = 'Не более 500 символов.'
  return errors
}
export function formatBookingDate(value: string) {
  const date = parseBookingDate(value)
  return date ? new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(date) : 'Дата не выбрана'
}
