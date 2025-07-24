import { List, Category, Result } from '@/types'
import { getLists, getCategoriesAction } from '@/app/actions'
import { generateCategories } from './category-utils'

export async function fetchAllData(): Promise<{
  lists: List[]
  categories: Category[]
}> {
  const [listsResult, categoriesResult] = await Promise.all([
    getLists(),
    getCategoriesAction()
  ])

  const lists = listsResult.success && listsResult.data ? listsResult.data : []
  const categoryNames = categoriesResult.success && categoriesResult.data ? categoriesResult.data : []
  const categories = generateCategories(categoryNames, lists)

  return { lists, categories }
}

export function sortLists(lists: List[]): List[] {
  return [...lists].sort((a, b) => {
    // Sort by category first
    const catA = a.category || 'Uncategorized'
    const catB = b.category || 'Uncategorized'
    if (catA !== catB) {
      if (catA === 'Uncategorized') return 1
      if (catB === 'Uncategorized') return -1
      return catA.localeCompare(catB)
    }
    // Then by date
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })
}

export function filterListsByCategory(lists: List[], category: string | null): List[] {
  if (!category) return lists
  return lists.filter(list => (list.category || 'Uncategorized') === category)
}

export function getCompletionStats(list: List) {
  const completedCount = list.items.filter(item => item.completed).length
  const totalCount = list.items.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return {
    completed: completedCount,
    total: totalCount,
    progress
  }
} 