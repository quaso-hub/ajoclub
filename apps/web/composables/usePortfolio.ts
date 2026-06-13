import { templates, templateCategories, getTemplateBySlug, getPublishedTemplates } from '~/utils/portfolio'
import type { Template } from '~/utils/portfolio'

export const usePortfolio = () => {
  const allTemplates = ref<Template[]>(getPublishedTemplates())
  const categories = ref(templateCategories)

  return {
    templates: allTemplates,
    categories,
    getTemplateBySlug,
  }
}
