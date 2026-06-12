import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/AjoClub/)
  })

  test('has hero section with heading', async ({ page }) => {
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()
    await expect(heading).toContainText('Website yang bikin brand')
  })

  test('has services section', async ({ page }) => {
    const services = page.locator('#services')
    await expect(services).toBeVisible()
  })

  test('has work section', async ({ page }) => {
    const work = page.locator('#work')
    await expect(work).toBeVisible()
  })

  test('has about section', async ({ page }) => {
    const about = page.locator('#about')
    await expect(about).toBeVisible()
  })

  test('has contact section', async ({ page }) => {
    const contact = page.locator('#contact')
    await expect(contact).toBeVisible()
  })

  test('has theme toggle button', async ({ page }) => {
    const themeToggle = page.locator('button[aria-label*="Switch to"]')
    await expect(themeToggle.first()).toBeVisible()
  })

  test('can scroll to services section', async ({ page }) => {
    await page.locator('button', { hasText: 'Services' }).first().click()
    await page.waitForTimeout(2500)
    const services = page.locator('#services')
    await expect(services).toBeInViewport()
  })

  test('has WhatsApp contact CTA with the current number', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)

    const cta = page.locator('#contact a[href*="wa.me/6285188627365"]')
    await expect(cta).toBeVisible()
  })

  test('can open portfolio detail page', async ({ page }) => {
    await page.locator('#work').scrollIntoViewIfNeeded()
    await page.locator('a[href="/portfolio/immersive-studio-showroom"]').click()
    await expect(page.locator('h1')).toContainText('Immersive Studio Showroom')
  })
})
