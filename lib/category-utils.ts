import { List, Category } from '@/types'

export function calculateCategoryCount(lists: List[], categoryName: string): number {
  return lists.filter(list => (list.category || 'Uncategorized') === categoryName).length
}

export function generateCategories(categoryNames: string[], lists: List[]): Category[] {
  return categoryNames.map(name => ({
    name,
    count: calculateCategoryCount(lists, name)
  }))
}

export function getCategoryDisplayName(category?: string): string {
  return category || 'Uncategorized'
}

export function sortCategories(categories: Category[]): Category[] {
  return [...categories].sort((a, b) => {
    // Always put Uncategorized last
    if (a.name === 'Uncategorized') return 1
    if (b.name === 'Uncategorized') return -1
    return a.name.localeCompare(b.name)
  })
} 