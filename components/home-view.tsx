"use client"

import { Calendar, CheckCircle, Folder, Plus, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Item {
  id: string
  text: string
  completed: boolean
  order: number
}

interface List {
  id: string
  title: string
  category?: string
  items: Item[]
  createdAt: string
  updatedAt: string
}

interface HomeViewProps {
  lists: List[]
  onUpdate: () => void
  onSelectChecklist: (id: string) => void
  onCreateModal: () => void
}

export function HomeView({ lists, onUpdate, onSelectChecklist, onCreateModal }: HomeViewProps) {
  const totalItems = lists.reduce((sum, list) => sum + list.items.length, 0)
  const completedItems = lists.reduce((sum, list) => sum + list.items.filter(item => item.completed).length, 0)
  const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  const getCompletionRate = (items: Item[]) => {
    const total = items.length;
    if (total === 0) return 0;
    const completed = items.filter(item => item.completed).length;
    return Math.round((completed / total) * 100);
  };

  // Group lists by category
  const groupedLists = lists.reduce<Record<string, List[]>>((acc, list) => {
    const category = list.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(list);
    return acc;
  }, {});

  return (
    <div className="h-full overflow-y-auto bg-background-secondary">
      {/* Empty State */}
      {lists.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center p-4">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Folder className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No checklists yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first checklist to get started. You can organize your tasks, track progress, and more.
          </p>
          <Button
            onClick={onCreateModal}
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Checklist
          </Button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Welcome Back
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Here's an overview of your checklists and progress.
              </p>
            </div>
            <Button
              onClick={onCreateModal}
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Checklist
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Folder className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Lists</p>
                  <p className="text-2xl font-bold text-foreground">{lists.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-foreground">{completedItems}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold text-foreground">{totalItems}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Progress</p>
                  <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          {Object.entries(groupedLists).map(([category, categoryLists]) => (
            <div key={category} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-muted rounded-lg">
                  <Folder className="h-5 w-5 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">{category}</h2>
                <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  {categoryLists.length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryLists.map((list) => (
                  <div
                    key={list.id}
                    onClick={() => onSelectChecklist(list.id)}
                    className="bg-card border border-border rounded-xl p-6 cursor-pointer hover:shadow-lg hover:border-primary transition-all duration-200 group"
                  >
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {list.title}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(list.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-2">
                        <span>Progress</span>
                        <span>{getCompletionRate(list.items)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-all duration-300"
                          style={{
                            width: `${getCompletionRate(list.items)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        <span>{list.items.filter(item => item.completed).length} completed</span>
                      </div>
                      <span className="bg-muted px-2 py-1 rounded-full">
                        {list.items.length} items
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 