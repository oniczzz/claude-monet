import { test, expect, type Locator } from '@playwright/test'
import { images } from '../../src/data/images'

const cdnPattern = 'https://images.unsplash.com/**'
// A valid, deterministic image response tests Photo without depending on CDN uptime.
const imageFixture = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="24"><rect width="32" height="24" fill="#641e2d"/></svg>'

async function expectLoaded(image: Locator) {
  await image.scrollIntoViewIfNeeded()
  await expect.poll(() => image.evaluate((element: HTMLImageElement) =>
    element.complete && element.naturalWidth > 0 && element.naturalHeight > 0,
  )).toBe(true)
  await image.evaluate((element: HTMLImageElement) => element.decode())
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
})

test('photos use valid absolute CDN URLs and decode successful responses without fallback', async ({ page }) => {
  const fallbackRequests: string[] = []
  page.on('request', request => {
    if (new URL(request.url()).pathname.endsWith('/image-fallback.svg')) fallbackRequests.push(request.url())
  })
  await page.route(cdnPattern, route => route.fulfill({ status: 200, contentType: 'image/svg+xml', body: imageFixture }))
  await page.goto('./')

  const photos = page.locator('img.photo')
  await expect(photos.first()).toBeAttached()
  for (const photo of await photos.all()) {
    await expectLoaded(photo)
    const source = new URL(await photo.evaluate((image: HTMLImageElement) => image.currentSrc))
    expect(source.origin).toBe('https://images.unsplash.com')
    expect(Object.values(images).map(id => `/${id}`)).toContain(source.pathname)
    expect(['480', '800', '1200', '1920']).toContain(source.searchParams.get('w'))
    expect(source.searchParams.get('auto')).toBe('format')
    expect(source.searchParams.get('fit')).toBe('crop')
    await expect(photo).toHaveAttribute('srcset', /480w, .*800w, .*1200w, .*1920w/)
  }
  expect(fallbackRequests).toEqual([])
})

for (const failure of ['network', '404', 'invalid image'] as const) {
  test(`photos decode the real base-relative fallback after a CDN ${failure} failure`, async ({ page, request }) => {
    await page.route(cdnPattern, route => {
      if (failure === 'network') return route.abort()
      return route.fulfill({ status: failure === '404' ? 404 : 200, contentType: 'image/jpeg', body: 'not an image' })
    })
    await page.goto('./')
    const fallbackURL = new URL('image-fallback.svg', page.url()).href
    const response = await request.get(fallbackURL)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('image/svg+xml')
    expect(await response.text()).toContain('<svg')

    const photos = page.locator('img.photo')
    await expect(photos.first()).toBeAttached()
    for (const photo of await photos.all()) {
      await expectLoaded(photo)
      await expect(photo).toHaveJSProperty('currentSrc', fallbackURL)
      // A remaining srcset could make the browser retry the broken CDN instead.
      await expect(photo).toHaveJSProperty('srcset', '')
    }
  })
}
