import { Checklist, Category } from '@/app/_types'

export const calculateCategoryCount = (lists: Checklist[], categoryName: string): number => {
  return lists.filter(list => (list.category || 'Uncategorized') === categoryName).length
}

export const generateCategories = (categoryNames: string[], lists: Checklist[]): Category[] => {
  return categoryNames.map(name => ({
    name,
    count: calculateCategoryCount(lists, name)
  }))
}

export const getCategoryDisplayName = (category?: string): string => {
  return category || 'Uncategorized'
}

export const sortCategories = (categories: Category[]): Category[] => {
  return [...categories].sort((a, b) => {
    if (a.name === 'Uncategorized') return 1
    if (b.name === 'Uncategorized') return -1
    return a.name.localeCompare(b.name)
  })
} 