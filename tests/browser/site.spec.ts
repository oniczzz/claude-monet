import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// External photography is tested separately from UI behavior. Force a network error
// to make the UI suite deterministic and exercise the real local fallback path.
test.beforeEach(async ({ page }) => {
  await page.route('https://images.unsplash.com/**', route => route.abort())
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')
})

test('renders the full experience without runtime errors and broken local images', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('CLAUDE MONET')
  for (const id of ['story', 'menu', 'signature', 'gallery', 'atmosphere', 'reservation', 'contacts']) {
    await expect(page.locator(`#${id}`)).toBeAttached()
  }
  await page.locator('#contacts').scrollIntoViewIfNeeded()
  await expect(page.locator('.hero-image img')).toHaveJSProperty('naturalWidth', 1200)
  expect(errors).toEqual([])
})

test('menu categories, keyboard tabs and ingredient dialog work', async ({ page }) => {
  await page.getByRole('tab', { name: 'Основные блюда' }).click()
  await expect(page.getByRole('tabpanel')).toContainText('Филе-миньон')
  await page.getByRole('tab', { name: 'Основные блюда' }).press('ArrowRight')
  await expect(page.getByRole('tab', { name: 'Десерты' })).toBeFocused()
  await expect(page.getByRole('tabpanel')).toContainText('Ванильный крем-брюле')
  const trigger = page.getByRole('button', { name: 'Состав и аллергены: Ванильный крем-брюле' })
  await trigger.click()
  await expect(page.getByRole('dialog')).toContainText('Молоко · Яйца')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(trigger).toBeFocused()
})

test('booking rejects invalid values, confirms a demo, sends no data and resets', async ({ page }) => {
  const posts: string[] = []
  page.on('request', request => { if (request.method() !== 'GET') posts.push(request.url()) })
  await page.locator('#reservation').scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: 'Забронировать · демо' }).click()
  await expect(page.locator('input[name="name"]')).toBeFocused()
  await expect(page.locator('#name-error')).toBeVisible()
  await page.locator('[name="name"]').fill('Анна')
  await page.locator('[name="phone"]').fill('+7 (700) 123-45-67')
  await page.locator('[name="date"]').fill('2020-01-01')
  await page.getByRole('button', { name: 'Забронировать · демо' }).click()
  await expect(page.locator('#date-error')).toContainText('сегодняшнюю или будущую')
  const tomorrow = await page.evaluate(() => {
    const date = new Date(); date.setDate(date.getDate() + 1)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  })
  await page.locator('[name="date"]').fill(tomorrow)
  await page.getByRole('combobox', { name: 'Время', exact: true }).click()
  await page.getByRole('option', { name: '19:00', exact: true }).click()
  await page.locator('[name="guests"]').selectOption('4')
  await page.locator('[name="wishes"]').fill('Столик у окна')
  await page.getByRole('button', { name: 'Забронировать · демо' }).click()
  await expect(page.locator('.booking-success')).toBeFocused()
  await expect(page.locator('.booking-success')).toContainText('Анна')
  await expect(page.locator('.booking-success dd')).toHaveText([/\d+ .+ \d{4}/, '19:00', '4'])
  await expect(page.locator('.booking-success')).toContainText('Реальная бронь не создана.')
  expect(posts).toEqual([])
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([])
  await page.getByRole('button', { name: 'Попробовать ещё раз' }).click()
  await expect(page.locator('[name="name"]')).toBeEmpty()
  await expect(page.locator('[name="name"]')).toBeFocused()
})

test('gallery supports next, previous, Escape and focus return', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Открыть фото: Там, где начинается вечер' })
  await trigger.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#gallery-lightbox-title')).toHaveText('Внимание к каждому штриху')
  await page.keyboard.press('ArrowLeft')
  await expect(page.locator('#gallery-lightbox-title')).toHaveText('Там, где начинается вечер')
  await page.keyboard.press('Tab')
  expect(await page.evaluate(() => Boolean(document.activeElement?.closest('dialog')))).toBe(true)
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
})

test('mobile menu opens, traps focus, and navigates', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Открыть меню' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Tab')
  expect(await page.evaluate(() => Boolean(document.activeElement?.closest('dialog')))).toBe(true)
  await page.getByRole('navigation', { name: 'Мобильная навигация' }).getByRole('link', { name: 'Меню', exact: false }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.locator('#menu')).toBeFocused()
  await expect(page).toHaveURL(/#menu$/)
})

test('signature dish controls update the content', async ({ page }) => {
  await page.getByRole('button', { name: 'Следующее фирменное блюдо' }).click()
  await expect(page.locator('.signature-description h3')).toHaveText('Лосось бер-блан')
  await page.getByRole('button', { name: 'Предыдущее фирменное блюдо' }).click()
  await expect(page.locator('.signature-description h3')).toHaveText('Филе-миньон')
})

test('layout stays within 320–1920px viewports', async ({ page }) => {
  for (const width of [320, 360, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 })
    await page.locator('#contacts').scrollIntoViewIfNeeded()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `horizontal overflow at ${width}px`).toBe(true)
  }
})

test('main page has no automatically detectable accessibility violations', async ({ page }) => {
  await page.locator('#contacts').scrollIntoViewIfNeeded()
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(results.violations).toEqual([])
})
