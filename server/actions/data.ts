'use server'

import path from 'path'
import { List, Category } from '@/types'
import { 
  getUserDir,
  ensureDir,
  readFile,
  writeFile,
  deleteFile,
  readDir,
  deleteDir
} from '@/server/utils/files'

// Parse markdown content into a list
function parseMarkdown(content: string, id: string, category: string): List {
  const lines = content.split('\n')
  const title = lines[0]?.replace(/^#\s*/, '') || 'Untitled'
  const items = lines
    .slice(1)
    .filter(line => line.trim().startsWith('- ['))
    .map((line, index) => {
      const completed = line.includes('- [x]')
      const text = line.replace(/^-\s*\[[x ]\]\s*/, '')
      return { 
        id: `${id}-${index}`,
        text,
        completed,
        order: index
      }
    })

  return { 
    id, 
    title, 
    category, 
    items,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

// Convert list to markdown
function listToMarkdown(list: List): string {
  const header = `# ${list.title}\n`
  const items = list.items
    .map(item => `- [${item.completed ? 'x' : ' '}] ${item.text}`)
    .join('\n')
  return `${header}\n${items}`
}

export async function getLists() {
  try {
    const userDir = await getUserDir()
    await ensureDir(userDir)

    const categories = await readDir(userDir)
    const lists: List[] = []

    for (const category of categories) {
      if (!category.isDirectory()) continue

      const categoryDir = path.join(userDir, category.name)
      try {
        const files = await readDir(categoryDir)
        for (const file of files) {
          if (file.isFile() && file.name.endsWith('.md')) {
            const id = path.basename(file.name, '.md')
            const content = await readFile(path.join(categoryDir, file.name))
            lists.push(parseMarkdown(content, id, category.name))
          }
        }
      } catch (error) {
        // Skip if category directory doesn't exist
        continue
      }
    }

    return lists
  } catch (error) {
    return { error: 'Failed to fetch lists' }
  }
}

export async function getCategories() {
  try {
    const userDir = await getUserDir()
    await ensureDir(userDir)

    const entries = await readDir(userDir)
    const categories = entries
      .filter(entry => entry.isDirectory())
      .map(entry => ({
        name: entry.name,
        count: 0 // We'll update this after getting lists
      }))

    // Get lists to calculate counts
    const lists = await getLists()
    if ('error' in lists) {
      throw new Error(lists.error)
    }

    categories.forEach(cat => {
      cat.count = lists.filter(list => list.category === cat.name).length
    })

    return categories
  } catch (error) {
    return { error: 'Failed to fetch categories' }
  }
}

export async function createList(formData: FormData) {
  try {
    const title = formData.get('title') as string
    const category = formData.get('category') as string || 'Uncategorized'

    const userDir = await getUserDir()
    const id = Date.now().toString()
    const categoryDir = path.join(userDir, category)
    const filePath = path.join(categoryDir, `${id}.md`)

    const newList: List = {
      id,
      title,
      category,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await writeFile(filePath, listToMarkdown(newList))
    return { success: true, data: newList }
  } catch (error) {
    return { error: 'Failed to create list' }
  }
}

export async function updateList(formData: FormData) {
  try {
    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const category = formData.get('category') as string || 'Uncategorized'

    const lists = await getLists()
    if ('error' in lists) {
      throw new Error(lists.error)
    }

    const currentList = lists.find(list => list.id === id)
    if (!currentList) {
      throw new Error('List not found')
    }

    const updatedList: List = {
      ...currentList,
      title,
      category,
      updatedAt: new Date().toISOString()
    }

    const userDir = await getUserDir()
    const filePath = path.join(userDir, category, `${id}.md`)
    await writeFile(filePath, listToMarkdown(updatedList))

    // If category changed, delete old file
    if (category !== currentList.category) {
      const oldFilePath = path.join(userDir, currentList.category || 'Uncategorized', `${id}.md`)
      await deleteFile(oldFilePath)
    }

    return { success: true, data: updatedList }
  } catch (error) {
    return { error: 'Failed to update list' }
  }
}

export async function deleteList(formData: FormData) {
  try {
    const id = formData.get('id') as string
    const category = formData.get('category') as string || 'Uncategorized'

    const userDir = await getUserDir()
    const filePath = path.join(userDir, category, `${id}.md`)
    await deleteFile(filePath)

    return { success: true }
  } catch (error) {
    return { error: 'Failed to delete list' }
  }
}

export async function createCategory(formData: FormData) {
  try {
    const name = formData.get('name') as string

    const userDir = await getUserDir()
    const categoryDir = path.join(userDir, name)
    await ensureDir(categoryDir)

    return { success: true, data: { name, count: 0 } }
  } catch (error) {
    return { error: 'Failed to create category' }
  }
}

export async function deleteCategory(formData: FormData) {
  try {
    const name = formData.get('name') as string

    const userDir = await getUserDir()
    const categoryDir = path.join(userDir, name)
    await deleteDir(categoryDir)

    return { success: true }
  } catch (error) {
    return { error: 'Failed to delete category' }
  }
} 