'use server'

import {
  getChecklists,
  createChecklist,
  deleteChecklist,
  addItem,
  updateItem,
  deleteItem,
  reorderItems,
  createCategory,
  deleteCategory,
  moveChecklist,
  getCategories,
  updateChecklistTitle
} from '@/lib/checklist'
import { revalidatePath } from 'next/cache'

export async function createList(title: string, category?: string) {
  console.log('Creating list with title:', title, 'category:', category)
  try {
    const list = await createChecklist(title, category)
    console.log('List created successfully:', list)
    revalidatePath('/')
    return { success: true, data: list }
  } catch (error) {
    console.error('Error creating list:', error)
    return { success: false, error: 'Failed to create list' }
  }
}

export async function deleteList(id: string) {
  try {
    await deleteChecklist(id)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete list' }
  }
}

export async function createItem(listId: string, text: string) {
  try {
    const item = await addItem(listId, text)
    revalidatePath('/')
    return { success: true, data: item }
  } catch (error) {
    return { success: false, error: 'Failed to create item' }
  }
}

export async function updateItemAction(listId: string, itemId: string, data: { text?: string; completed?: boolean }) {
  try {
    await updateItem(listId, itemId, data)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to update item' }
  }
}

export async function deleteItemAction(listId: string, itemId: string) {
  try {
    await deleteItem(listId, itemId)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete item' }
  }
}

export async function reorderItemsAction(listId: string, itemIds: string[]) {
  try {
    await reorderItems(listId, itemIds)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to reorder items' }
  }
}

export async function getLists() {
  console.log('Fetching lists...')
  try {
    const lists = await getChecklists()
    console.log('Lists fetched:', lists)
    return { success: true, data: lists }
  } catch (error) {
    console.error('Error fetching lists:', error)
    return { success: false, error: 'Failed to fetch lists' }
  }
}

export async function getCategoriesAction() {
  try {
    const categories = await getCategories()
    return { success: true, data: categories }
  } catch (error) {
    return { success: false, error: 'Failed to fetch categories' }
  }
}

export async function createCategoryAction(name: string) {
  try {
    await createCategory(name)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to create category' }
  }
}

export async function deleteCategoryAction(categoryId: string) {
  try {
    await deleteCategory(categoryId)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete category' }
  }
}

export async function moveChecklistAction(checklistId: string, newCategory?: string) {
  try {
    await moveChecklist(checklistId, newCategory)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to move checklist' }
  }
}

export async function updateChecklistTitleAction(checklistId: string, newTitle: string) {
  try {
    await updateChecklistTitle(checklistId, newTitle)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to update checklist title' }
  }
} 