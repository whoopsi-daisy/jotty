export interface Item {
  id: string
  text: string
  completed: boolean
  order: number
}

export interface List {
  id: string
  title: string
  category?: string
  items: Item[]
  createdAt: string
  updatedAt: string
}

export interface Category {
  name: string
  count: number
}

export interface Result<T> {
  success: boolean
  data?: T
  error?: string
} 