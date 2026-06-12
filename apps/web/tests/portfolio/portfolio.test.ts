import { describe, expect, it } from 'vitest'
import {
  getPortfolioBySlug,
  getPublishedPortfolio,
  getTemplateBySlug,
  portfolioCategories,
  portfolioTemplates,
  sourceLabel,
} from '../../utils/portfolio'

describe('portfolio data contract', () => {
  it('returns only published portfolio items in public helpers', () => {
    const items = getPublishedPortfolio()
    expect(items.length).toBeGreaterThan(0)
    expect(items.every(item => item.status === 'PUBLISHED')).toBe(true)
  })

  it('links each public portfolio item to a template and category', () => {
    for (const item of getPublishedPortfolio()) {
      expect(getTemplateBySlug(item.templateSlug)).toBeDefined()
      expect(portfolioCategories.some(category => category.slug === item.categorySlug)).toBe(true)
    }
  })

  it('defines scene presets and source labels for showroom cards', () => {
    const item = getPortfolioBySlug('immersive-studio-showroom')
    expect(item?.scenePreset).toBe('particle-morph')
    expect(sourceLabel(item!.source)).toBe('Internal Demo')
  })

  it('keeps templates category-addressable', () => {
    expect(portfolioTemplates.filter(template => template.categorySlug === 'growth')).toHaveLength(2)
  })
})
