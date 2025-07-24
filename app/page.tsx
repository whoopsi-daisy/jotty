import { getLists, getCategoriesAction } from './actions'
import { HomeClient } from '@/components/ui/pages/Home/HomeClient'

export default async function HomePage() {
  // Fetch data on the server
  const listsResult = await getLists()
  const categoriesResult = await getCategoriesAction()
  
  const lists = listsResult.success && listsResult.data ? listsResult.data : []
  const categoryNames = categoriesResult.success && categoriesResult.data ? categoriesResult.data : []
  
  // Convert category names to Category objects with count
  const categories = categoryNames.map(name => ({
    name,
    count: lists.filter(list => (list.category || 'Uncategorized') === name).length
  }))

  return (
    <HomeClient 
      initialLists={lists}
      initialCategories={categories}
    />
  )
} 