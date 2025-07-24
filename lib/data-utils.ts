import { List, Category } from '@/types'
import { 
  getLists,
  getCategories,
  createListAction,
  updateListAction,
  deleteListAction,
  createCategoryAction,
  deleteCategoryAction,
  updateItemAction,
  createItemAction,
  deleteItemAction,
  reorderItemsAction
} from '@/app/actions'

export async function fetchAllData(): Promise<{
  lists: List[]
  categories: Category[]
}> {
  const [listsResult, categoriesResult] = await Promise.all([
    getLists(),
    getCategories()
  ])

  const lists = listsResult.success && listsResult.data ? listsResult.data : []
  const categories = categoriesResult.success && categoriesResult.data ? categoriesResult.data : []

  return { lists, categories }
}

export async function getList(id: string): Promise<List | null> {
  const result = await getLists()
  if (!result.success) return null
  return result.data.find(list => list.id === id) || null
}

export async function createList(title: string, category?: string): Promise<List | null> {
  const formData = new FormData()
  formData.append('title', title)
  if (category) formData.append('category', category)

  const result = await createListAction(formData)
  return result.success && result.data ? result.data : null
}

export async function updateList(id: string, title: string, category?: string): Promise<List | null> {
  const formData = new FormData()
  formData.append('id', id)
  formData.append('title', title)
  if (category) formData.append('category', category)

  const result = await updateListAction(formData)
  return result.success && result.data ? result.data : null
}

export async function deleteList(id: string, category?: string): Promise<boolean> {
  const formData = new FormData()
  formData.append('id', id)
  if (category) formData.append('category', category)

  const result = await deleteListAction(formData)
  return result.success || false
}

export async function createCategory(name: string): Promise<Category | null> {
  const formData = new FormData()
  formData.append('name', name)

  const result = await createCategoryAction(formData)
  return result.success && result.data ? result.data : null
}

export async function deleteCategory(name: string): Promise<boolean> {
  const formData = new FormData()
  formData.append('name', name)

  const result = await deleteCategoryAction(formData)
  return result.success || false
}

export async function updateItem(listId: string, itemId: string, completed: boolean): Promise<boolean> {
  const formData = new FormData()
  formData.append('listId', listId)
  formData.append('itemId', itemId)
  formData.append('completed', String(completed))

  const result = await updateItemAction(formData)
  return result.success || false
}

export async function createItem(listId: string, text: string): Promise<any> {
  const formData = new FormData()
  formData.append('listId', listId)
  formData.append('text', text)

  const result = await createItemAction(formData)
  return result.success && result.data ? result.data : null
}

export async function deleteItem(listId: string, itemId: string): Promise<boolean> {
  const formData = new FormData()
  formData.append('listId', listId)
  formData.append('itemId', itemId)

  const result = await deleteItemAction(formData)
  return result.success || false
}

export async function reorderItems(listId: string, itemIds: string[]): Promise<boolean> {
  const formData = new FormData()
  formData.append('listId', listId)
  formData.append('itemIds', JSON.stringify(itemIds))

  const result = await reorderItemsAction(formData)
  return result.success || false
}

export function calculateCategoryCount(lists: List[], categoryName: string): number {
  return lists.filter(list => (list.category || 'Uncategorized') === categoryName).length
}

export function generateCategories(categoryNames: string[], lists: List[]): Category[] {
  return categoryNames.map(name => ({
    name,
    count: calculateCategoryCount(lists, name)
  }))
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