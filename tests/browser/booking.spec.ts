import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.use({ timezoneId: 'Asia/Almaty' })

test.beforeEach(async ({ page }) => {
  await page.route('https://images.unsplash.com/**', route => route.abort())
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.clock.setFixedTime(new Date('2026-10-30T15:10:00+05:00'))
  await page.goto('./')
  await page.locator('#reservation').scrollIntoViewIfNeeded()
})

const timeField = (page: Page) => page.getByRole('combobox', { name: 'Время', exact: true })
const submit = (page: Page) => page.getByRole('button', { name: 'Забронировать · демо' })

async function fillGuest(page: Page) {
  await page.locator('input[name="name"]').fill('Анна')
  await page.locator('input[name="phone"]').fill('+7 (700) 123-45-67')
}

async function chooseTime(page: Page, time: string) {
  await timeField(page).click()
  await page.getByRole('option', { name: time, exact: true }).click()
  await expect(timeField(page)).toHaveText(time)
  await expect(page.locator('input[name="time"]')).toHaveValue(time)
  await expect(page.getByRole('listbox')).toHaveCount(0)
}

async function expectContainedLayout(page: Page) {
  const geometry = await page.locator('.reservation-form-container').evaluate(container => {
    const bounds = container.getBoundingClientRect()
    const fields = [...container.querySelectorAll('.field')].map(field => field.getBoundingClientRect())
    const controls = [...container.querySelectorAll('input:not([type=hidden]), select, textarea, button, [role=listbox]')]
    return {
      pageFits: document.documentElement.scrollWidth <= window.innerWidth,
      formFits: bounds.left >= 0 && bounds.right <= window.innerWidth,
      controlsFit: controls.every(control => {
        const rect = control.getBoundingClientRect()
        return rect.left >= bounds.left && rect.right <= bounds.right + 1 && rect.top >= bounds.top && rect.bottom <= bounds.bottom + 1
      }),
      fieldsDoNotOverlap: fields.every((rect, index) => fields.slice(index + 1).every(other =>
        rect.right <= other.left + 1 || other.right <= rect.left + 1 || rect.bottom <= other.top + 1 || other.bottom <= rect.top + 1)),
    }
  })
  expect(geometry).toEqual({ pageFits: true, formFits: true, controlsFit: true, fieldsDoNotOverlap: true })
}

for (const width of [320, 375, 768, 1366]) {
  test(`time picker and demo submission fit ${width}px, including errors and confirmation`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 })
    await submit(page).click()
    await expect(page.locator('#name-error')).toBeVisible()
    await expectContainedLayout(page)
    await fillGuest(page)
    await page.locator('[name="date"]').fill('2026-10-31')
    await timeField(page).click()
    await expect(page.getByRole('listbox')).toBeVisible()
    await expectContainedLayout(page)
    const listSize = await page.getByRole('listbox').evaluate(list => ({ height: list.clientHeight, content: list.scrollHeight }))
    expect(listSize.height).toBeLessThanOrEqual(220)
    expect(listSize.content).toBeGreaterThan(listSize.height)
    const option = page.getByRole('option', { name: '19:00', exact: true })
    if (testInfo.project.use.hasTouch) await option.tap()
    else await option.click()
    await expect(timeField(page)).toHaveText('19:00')
    await expect(page.locator('input[name="time"]')).toHaveValue('19:00')
    await page.locator('[name="guests"]').selectOption('8')
    await page.locator('[name="wishes"]').fill('Столик у окна')
    expect(await page.locator('form').evaluate((form: HTMLFormElement) => new FormData(form).get('time'))).toBe('19:00')
    await submit(page).click()
    await expect(page.locator('.booking-success')).toBeFocused()
    await expect(page.locator('.booking-success dd')).toHaveText(['31 октября 2026 г.', '19:00', '8'])
    await expect(page.locator('.success-disclaimer')).toContainText('Реальная бронь не создана.')
    await expectContainedLayout(page)
    await page.getByRole('button', { name: 'Попробовать ещё раз' }).click()
    await expect(page.locator('input[name="name"]')).toBeFocused()
    await expect(timeField(page)).toHaveText('Выберите время')
    await expect(page.locator('[name="date"]')).toBeEmpty()
    await expect(page.locator('[name="guests"]')).toHaveValue('2')
  })
}

test('keyboard navigation commits explicitly and Escape, Tab and outside clicks close the list', async ({ page }) => {
  await page.locator('[name="date"]').fill('2026-10-31')
  await chooseTime(page, '19:00')
  const trigger = timeField(page)
  await trigger.press('ArrowDown')
  await trigger.press('End')
  await trigger.press('ArrowLeft')
  await expect(page.getByRole('option', { name: '21:30', exact: true })).toHaveAttribute('data-active', 'true')
  await expect(trigger).toHaveText('19:00')
  await trigger.press('Escape')
  await expect(page.getByRole('listbox')).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await expect(trigger).toHaveText('19:00')
  await trigger.press('Enter')
  await trigger.press('Home')
  await trigger.press('ArrowRight')
  await trigger.press(' ')
  await expect(trigger).toHaveText('12:30')
  await expect(page.locator('input[name="time"]')).toHaveValue('12:30')
  await trigger.press(' ')
  await trigger.press('Tab')
  await expect(page.locator('[name="guests"]')).toBeFocused()
  await expect(page.getByRole('listbox')).toHaveCount(0)
  await trigger.click()
  await page.locator('input[name="name"]').click()
  await expect(page.getByRole('listbox')).toHaveCount(0)
  await trigger.click()
  await trigger.click()
  await expect(page.getByRole('listbox')).toHaveCount(0)
  await expect(page.locator('.booking-success')).toHaveCount(0)
  await trigger.press('1')
  await trigger.press('9')
  await trigger.press('Enter')
  await expect(trigger).toHaveText('19:00')
})

test('date edits preserve the selected time unless the completed date makes it unavailable', async ({ page }) => {
  await chooseTime(page, '19:00')
  const date = page.locator('[name="date"]')
  await date.fill('2026-10-31')
  await expect(timeField(page)).toHaveText('19:00')
  await date.fill('')
  await expect(timeField(page)).toHaveText('19:00')
  await date.fill('2026-11-01')
  await expect(timeField(page)).toHaveText('19:00')
  await chooseTime(page, '12:00')
  await date.fill('2026-10-30')
  await expect(timeField(page)).toHaveText('Выберите время')
  await expect(page.locator('input[name="time"]')).toHaveValue('')
})

test('past slots cannot be clicked or reached with the keyboard; fully elapsed dates are explained', async ({ page }) => {
  await page.locator('[name="date"]').fill('2026-10-30')
  const trigger = timeField(page)
  await trigger.click()
  const elapsed = page.getByRole('option', { name: '15:00', exact: true })
  await expect(elapsed).toHaveAttribute('aria-disabled', 'true')
  // Force only bypasses Playwright's disabled-element check; the component must reject the click.
  await elapsed.click({ force: true })
  await expect(trigger).toHaveText('Выберите время')
  await trigger.press('Home')
  await trigger.press('ArrowUp')
  await expect(page.getByRole('option', { name: '15:30', exact: true })).toHaveAttribute('data-active', 'true')
  await trigger.press('Enter')
  await expect(trigger).toHaveText('15:30')
  await page.locator('[name="date"]').fill('2026-10-29')
  await trigger.click()
  await expect(page.locator('.time-select-empty')).toContainText('Выберите другую дату')
  await trigger.press('Enter')
  await expect(trigger).toHaveText('Выберите время')
  await expect(page.getByRole('listbox')).toBeVisible()
})

test('date bounds and incomplete input are validated, and submission focuses the time error', async ({ page }) => {
  await fillGuest(page)
  const date = page.locator('[name="date"]')
  await expect(date).toHaveAttribute('min', '2026-10-30')
  await expect(date).toHaveAttribute('max', '2027-01-28')
  for (const value of ['', '2026-10-29', '2027-01-29']) {
    await date.fill(value)
    await submit(page).click()
    await expect(date).toBeFocused()
    await expect(date).toHaveAttribute('aria-invalid', 'true')
    await expect(page.locator('#date-error')).toBeVisible()
  }
  await date.fill('2027-01-28')
  await submit(page).click()
  await expect(timeField(page)).toBeFocused()
  await expect(timeField(page)).toHaveAttribute('aria-invalid', 'true')
  await chooseTime(page, '22:00')
  await expect(page.locator('#time-error')).toHaveCount(0)
  await submit(page).click()
  await expect(page.locator('.booking-success dd')).toHaveText(['28 января 2027 г.', '22:00', '2'])
})

test('submission revalidates a time that expired while the form was open', async ({ page }) => {
  await fillGuest(page)
  await page.locator('[name="date"]').fill('2026-10-30')
  await chooseTime(page, '15:30')
  await page.clock.setFixedTime(new Date('2026-10-30T15:30:00+05:00'))
  await submit(page).click()
  await expect(page.locator('#time-error')).toContainText('Это время уже прошло')
  await expect(timeField(page)).toBeFocused()
  await expect(page.locator('.booking-success')).toHaveCount(0)
})

test('open time picker has no automatically detectable accessibility violations', async ({ page }) => {
  await page.locator('[name="date"]').fill('2026-10-30')
  await timeField(page).click()
  const results = await new AxeBuilder({ page }).include('#reservation').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(results.violations).toEqual([])
})
