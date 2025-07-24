import fs from 'fs/promises'
import path from 'path'

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  order: number
}

export interface Checklist {
  id: string
  title: string
  category?: string
  items: ChecklistItem[]
  createdAt: string
  updatedAt: string
}

const DATA_DIR = process.env.DATA_DIR || './data/checklists'

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Sanitize filename
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

// Get file path for checklist
function getChecklistPath(title: string, category?: string): string {
  const sanitizedTitle = sanitizeFilename(title)
  const timestamp = Date.now()
  const filename = `${sanitizedTitle}-${timestamp}.md`
  
  if (category) {
    const categoryDir = path.join(DATA_DIR, sanitizeFilename(category))
    return path.join(categoryDir, filename)
  }
  
  return path.join(DATA_DIR, filename)
}

// Parse markdown content to checklist
function parseMarkdown(content: string): ChecklistItem[] {
  const lines = content.split('\n')
  const items: ChecklistItem[] = []
  
  lines.forEach((line, index) => {
    const trimmed = line.trim()
    if (trimmed.startsWith('- [ ] ') || trimmed.startsWith('- [x] ')) {
      const completed = trimmed.startsWith('- [x] ')
      const text = trimmed.substring(6) // Remove "- [ ] " or "- [x] "
      items.push({
        id: `item-${index}`,
        text,
        completed,
        order: index
      })
    }
  })
  
  return items
}

// Convert checklist items to markdown
function itemsToMarkdown(items: ChecklistItem[]): string {
  return items
    .sort((a, b) => {
      // Completed items go to bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }
      return a.order - b.order
    })
    .map(item => `- [${item.completed ? 'x' : ' '}] ${item.text}`)
    .join('\n')
}

// Scan directory recursively for checklists
async function scanDirectory(dir: string, checklists: Checklist[] = []): Promise<Checklist[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    
    if (entry.isDirectory()) {
      // Recursively scan subdirectories
      await scanDirectory(fullPath, checklists)
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      try {
        const content = await fs.readFile(fullPath, 'utf-8')
        const lines = content.split('\n')
        
        // First line is the title
        const title = lines[0].replace(/^#\s*/, '') || 'Untitled'
        const items = parseMarkdown(content)
        
        const stats = await fs.stat(fullPath)
        const relativePath = path.relative(DATA_DIR, fullPath)
        const pathParts = relativePath.split(path.sep)
        
        // Extract category from path - if file is in a subdirectory, that's the category
        let checklistCategory: string | undefined = undefined
        if (pathParts.length > 1) {
          checklistCategory = pathParts[0]
        }
        
        checklists.push({
          id: entry.name.replace('.md', ''),
          title,
          category: checklistCategory,
          items,
          createdAt: stats.birthtime.toISOString(),
          updatedAt: stats.mtime.toISOString()
        })
      } catch (error) {
        console.error(`Error reading file ${fullPath}:`, error)
      }
    }
  }
  
  return checklists
}

// Get all available categories
export async function getCategories(): Promise<string[]> {
  await ensureDataDir()
  
  try {
    const entries = await fs.readdir(DATA_DIR, { withFileTypes: true })
    const categories: string[] = []
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        categories.push(entry.name)
      }
    }
    
    return categories.sort()
  } catch (error) {
    console.error('Error reading categories:', error)
    return []
  }
}

// Get all checklists
export async function getChecklists(): Promise<Checklist[]> {
  await ensureDataDir()
  
  try {
    const checklists = await scanDirectory(DATA_DIR)
    return checklists.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  } catch (error) {
    console.error('Error reading checklists:', error)
    return []
  }
}

// Create a new checklist
export async function createChecklist(title: string, category?: string): Promise<Checklist> {
  await ensureDataDir()
  
  const filePath = getChecklistPath(title, category)
  
  // Ensure category directory exists
  if (category) {
    const categoryDir = path.dirname(filePath)
    await fs.mkdir(categoryDir, { recursive: true })
  }
  
  // Create content
  const content = `# ${title}\n\n`
  
  await fs.writeFile(filePath, content, 'utf-8')
  
  return {
    id: path.basename(filePath, '.md'),
    title,
    category,
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

// Create a new category (creates directory)
export async function createCategory(name: string): Promise<void> {
  await ensureDataDir()
  
  const categoryDir = path.join(DATA_DIR, sanitizeFilename(name))
  await fs.mkdir(categoryDir, { recursive: true })
}

// Delete a category and all its checklists
export async function deleteCategory(name: string): Promise<void> {
  await ensureDataDir()
  
  const categoryDir = path.join(DATA_DIR, sanitizeFilename(name))
  
  try {
    // Check if directory exists
    await fs.access(categoryDir)
    
    // Remove the entire directory and all its contents
    await fs.rm(categoryDir, { recursive: true, force: true })
  } catch (error) {
    throw new Error('Category not found or could not be deleted')
  }
}

// Move checklist to different category
export async function moveChecklist(checklistId: string, newCategory?: string): Promise<void> {
  const checklists = await getChecklists()
  const checklist = checklists.find(c => c.id === checklistId)
  
  if (!checklist) {
    throw new Error('Checklist not found')
  }
  
  // Find the current file
  const files = await fs.readdir(DATA_DIR, { recursive: true })
  let currentFilePath: string | null = null
  
  for (const file of files) {
    if (typeof file === 'string' && file.includes(checklistId)) {
      currentFilePath = path.join(DATA_DIR, file)
      break
    }
  }
  
  if (!currentFilePath) {
    throw new Error('Checklist file not found')
  }
  
  // Create new file path
  const newFilePath = getChecklistPath(checklist.title, newCategory)
  
  // Read current content
  const content = await fs.readFile(currentFilePath, 'utf-8')
  
  // Write to new location
  await fs.writeFile(newFilePath, content, 'utf-8')
  
  // Delete old file
  await fs.unlink(currentFilePath)
}

// Update checklist title
export async function updateChecklistTitle(checklistId: string, newTitle: string): Promise<void> {
  const checklists = await getChecklists()
  const checklist = checklists.find(c => c.id === checklistId)
  
  if (!checklist) {
    throw new Error('Checklist not found')
  }
  
  // Find the current file
  const files = await fs.readdir(DATA_DIR, { recursive: true })
  let currentFilePath: string | null = null
  
  for (const file of files) {
    if (typeof file === 'string' && file.includes(checklistId)) {
      currentFilePath = path.join(DATA_DIR, file)
      break
    }
  }
  
  if (!currentFilePath) {
    throw new Error('Checklist file not found')
  }
  
  // Read current content
  const content = await fs.readFile(currentFilePath, 'utf-8')
  const lines = content.split('\n')
  
  // Update the title line (first line)
  lines[0] = `# ${newTitle}`
  
  // Create new file path with new title
  const newFilePath = getChecklistPath(newTitle, checklist.category)
  
  // Write updated content to new location
  await fs.writeFile(newFilePath, lines.join('\n'), 'utf-8')
  
  // Delete old file
  await fs.unlink(currentFilePath)
}

// Delete a checklist
export async function deleteChecklist(id: string): Promise<void> {
  // Find the file by scanning all directories
  const checklists = await getChecklists()
  const checklist = checklists.find(c => c.id === id)
  
  if (!checklist) {
    throw new Error('Checklist not found')
  }
  
  // Find the actual file path
  const files = await fs.readdir(DATA_DIR, { recursive: true })
  for (const file of files) {
    if (typeof file === 'string' && file.includes(id)) {
      await fs.unlink(path.join(DATA_DIR, file))
      break
    }
  }
}

// Add item to checklist
export async function addItem(checklistId: string, text: string): Promise<ChecklistItem> {
  const checklists = await getChecklists()
  const checklist = checklists.find(c => c.id === checklistId)
  
  if (!checklist) {
    throw new Error('Checklist not found')
  }
  
  // Find the actual file path
  const files = await fs.readdir(DATA_DIR, { recursive: true })
  let filePath: string | null = null
  
  for (const file of files) {
    if (typeof file === 'string' && file.includes(checklistId)) {
      filePath = path.join(DATA_DIR, file)
      break
    }
  }
  
  if (!filePath) {
    throw new Error('Checklist file not found')
  }
  
  const content = await fs.readFile(filePath, 'utf-8')
  const items = parseMarkdown(content)
  const newOrder = items.length
  
  const newItem: ChecklistItem = {
    id: `item-${Date.now()}`,
    text,
    completed: false,
    order: newOrder
  }
  
  // Add the new item to the markdown
  const newContent = content + `\n- [ ] ${text}`
  await fs.writeFile(filePath, newContent, 'utf-8')
  
  return newItem
}

// Update item (toggle completion or reorder)
export async function updateItem(checklistId: string, itemId: string, updates: Partial<ChecklistItem>): Promise<void> {
  const checklists = await getChecklists()
  const checklist = checklists.find(c => c.id === checklistId)
  
  if (!checklist) {
    throw new Error('Checklist not found')
  }
  
  // Find the actual file path
  const files = await fs.readdir(DATA_DIR, { recursive: true })
  let filePath: string | null = null
  
  for (const file of files) {
    if (typeof file === 'string' && file.includes(checklistId)) {
      filePath = path.join(DATA_DIR, file)
      break
    }
  }
  
  if (!filePath) {
    throw new Error('Checklist file not found')
  }
  
  const content = await fs.readFile(filePath, 'utf-8')
  const items = parseMarkdown(content)
  
  const itemIndex = items.findIndex(item => item.id === itemId)
  if (itemIndex === -1) return
  
  // Update the item
  items[itemIndex] = { ...items[itemIndex], ...updates }
  
  // Convert back to markdown and save
  const lines = content.split('\n')
  const titleLine = lines[0]
  const newContent = titleLine + '\n\n' + itemsToMarkdown(items)
  
  await fs.writeFile(filePath, newContent, 'utf-8')
}

// Delete item
export async function deleteItem(checklistId: string, itemId: string): Promise<void> {
  const checklists = await getChecklists()
  const checklist = checklists.find(c => c.id === checklistId)
  
  if (!checklist) {
    throw new Error('Checklist not found')
  }
  
  // Find the actual file path
  const files = await fs.readdir(DATA_DIR, { recursive: true })
  let filePath: string | null = null
  
  for (const file of files) {
    if (typeof file === 'string' && file.includes(checklistId)) {
      filePath = path.join(DATA_DIR, file)
      break
    }
  }
  
  if (!filePath) {
    throw new Error('Checklist file not found')
  }
  
  const content = await fs.readFile(filePath, 'utf-8')
  const items = parseMarkdown(content)
  
  const filteredItems = items.filter(item => item.id !== itemId)
  
  const lines = content.split('\n')
  const titleLine = lines[0]
  const newContent = titleLine + '\n\n' + itemsToMarkdown(filteredItems)
  
  await fs.writeFile(filePath, newContent, 'utf-8')
}

// Reorder items
export async function reorderItems(checklistId: string, itemIds: string[]): Promise<void> {
  const checklists = await getChecklists()
  const checklist = checklists.find(c => c.id === checklistId)
  
  if (!checklist) {
    throw new Error('Checklist not found')
  }
  
  // Find the actual file path
  const files = await fs.readdir(DATA_DIR, { recursive: true })
  let filePath: string | null = null
  
  for (const file of files) {
    if (typeof file === 'string' && file.includes(checklistId)) {
      filePath = path.join(DATA_DIR, file)
      break
    }
  }
  
  if (!filePath) {
    throw new Error('Checklist file not found')
  }
  
  const content = await fs.readFile(filePath, 'utf-8')
  const items = parseMarkdown(content)
  
  // Create new order based on itemIds
  const reorderedItems = itemIds.map((id, index) => {
    const item = items.find(item => item.id === id)
    return item ? { ...item, order: index } : null
  }).filter(Boolean) as ChecklistItem[]
  
  // Add any remaining items (completed ones that weren't in the drag)
  const remainingItems = items.filter(item => !itemIds.includes(item.id))
  reorderedItems.push(...remainingItems)
  
  const lines = content.split('\n')
  const titleLine = lines[0]
  const newContent = titleLine + '\n\n' + itemsToMarkdown(reorderedItems)
  
  await fs.writeFile(filePath, newContent, 'utf-8')
} 