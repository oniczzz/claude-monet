import { test } from 'node:test'
import assert from 'node:assert/strict'
import { dateLimit, formatBookingDate, initialBooking, isSlotPast, localDate, parseBookingDate, timeSlots, validateBooking } from '../src/lib/booking.ts'

const now = new Date(2026, 9, 30, 15, 10)
const valid = { name: 'Анна-Мария', phone: '+7 (700) 123-45-67', date: '2026-10-31', time: '19:00', guests: '2', wishes: 'Столик у окна' }

test('successful demo booking accepts all six fields', () => {
  assert.deepEqual(validateBooking(valid, now), {})
  assert.deepEqual(valid, { name: 'Анна-Мария', phone: '+7 (700) 123-45-67', date: '2026-10-31', time: '19:00', guests: '2', wishes: 'Столик у окна' })
})
test('empty form reports name, phone, date and time errors', () => {
  assert.deepEqual(Object.keys(validateBooking(initialBooking, now)), ['name', 'phone', 'date', 'time'])
})
test('validates real dates, past dates and the 90-day window', () => {
  for (const date of ['2026-02-30', '2026-13-01', '2026-10-29', '2027-01-29', 'invalid', '2026-1-01']) {
    assert.ok(validateBooking({ ...valid, date }, now).date, date)
  }
  assert.equal(dateLimit(now), '2027-01-28')
  assert.equal(validateBooking({ ...valid, date: dateLimit(now) }, now).date, undefined)
})
test('today is allowed but already elapsed times are rejected', () => {
  assert.ok(validateBooking({ ...valid, date: '2026-10-30', time: '15:00' }, now).time)
  assert.equal(validateBooking({ ...valid, date: '2026-10-30', time: '15:30' }, now).time, undefined)
  assert.ok(isSlotPast('2026-10-30', '15:10', now))
})
test('rejects nonexistent time slots and tampered guest values', () => {
  for (const time of ['', '03:00', '12:15', '22:30', '99:00']) assert.ok(validateBooking({ ...valid, time }, now).time)
  for (const guests of ['', '0', '9', '-1', '2abc', '2.5', '02']) assert.ok(validateBooking({ ...valid, guests }, now).guests)
  for (const guests of ['1', '2', '8']) assert.equal(validateBooking({ ...valid, guests }, now).guests, undefined)
})
test('validates Unicode guest names without accepting markup or digits', () => {
  for (const name of ['Élodie', 'Айгерім', 'Жан-Пьер', "O’Connor", 'Анна Мария']) assert.equal(validateBooking({ ...valid, name }, now).name, undefined, name)
  for (const name of ['', 'А', '1234', '<script>', 'А'.repeat(61)]) assert.ok(validateBooking({ ...valid, name }, now).name, name)
})
test('validates phone format and does not silently accept alphabetic input', () => {
  for (const phone of ['+77001234567', '8 (700) 123-45-67']) assert.equal(validateBooking({ ...valid, phone }, now).phone, undefined)
  for (const phone of ['', '+7', '+1 700 123 4567', 'abc+77001234567', '+770012345678']) assert.ok(validateBooking({ ...valid, phone }, now).phone)
})
test('wishes are optional and limited to 500 characters', () => {
  assert.equal(validateBooking({ ...valid, wishes: '' }, now).wishes, undefined)
  assert.equal(validateBooking({ ...valid, wishes: 'А'.repeat(500) }, now).wishes, undefined)
  assert.ok(validateBooking({ ...valid, wishes: 'А'.repeat(501) }, now).wishes)
})
test('local date calculation is stable around midnight and year boundaries', () => {
  assert.equal(localDate(new Date(2026, 11, 31, 23, 59)), '2026-12-31')
  assert.equal(localDate(new Date(2027, 0, 1, 0, 1)), '2027-01-01')
})
test('last same-day slot cannot be booked after closing', () => {
  const late = new Date(2026, 9, 30, 22, 0)
  assert.ok(validateBooking({ ...valid, date: '2026-10-30', time: '22:00' }, late).time)
  assert.deepEqual(validateBooking(valid, late), {})
})
test('time slot endpoints are 12:00 and 22:00', () => {
  assert.equal(timeSlots.length, 21)
  assert.equal(timeSlots[0], '12:00')
  assert.equal(timeSlots.at(-1), '22:00')
})

test('manual date fragments and nonexistent calendar days are safe throughout the form', () => {
  for (const date of ['', '2', '2026-', '2026-10-', '30.10.2026', '2026-02-29', '2026-04-31', '2026-00-10', '2026-10-00', '0000-01-01', '2026-10-31T12:00:00']) {
    assert.equal(parseBookingDate(date), null, date)
    assert.ok(validateBooking({ ...valid, date }, now).date, date)
    assert.equal(isSlotPast(date, '19:00', now), false, date)
    assert.equal(formatBookingDate(date), 'Дата не выбрана', date)
  }
})

test('date parsing and confirmation retain the local calendar day, including leap days', () => {
  for (const value of ['2024-02-29', '2026-12-31', '2027-01-01']) {
    assert.equal(localDate(parseBookingDate(value)), value)
  }
  assert.equal(formatBookingDate('2026-10-31'), '31 октября 2026 г.')
  assert.equal(parseBookingDate('2025-02-29'), null)
})

test('a selected time is rejected if it expires before submission', () => {
  const booking = { ...valid, date: '2026-10-30', time: '15:30' }
  assert.deepEqual(validateBooking(booking, now), {})
  assert.ok(validateBooking(booking, new Date(2026, 9, 30, 15, 30)).time)
})

test('every offered time and guest count can reach a valid demo confirmation', () => {
  for (const time of timeSlots) {
    for (let guests = 1; guests <= 8; guests++) {
      assert.deepEqual(validateBooking({ ...valid, time, guests: String(guests) }, now), {})
    }
  }
})
