import { getLists, getCategories } from "@/app/_server/actions/data/actions";
import { HomeClient } from "@/app/_components/ui/pages/Home/HomeClient";
import { isAdmin, getUsername } from "@/app/_server/actions/auth/utils";

export default async function HomePage() {
  // Fetch data on the server
  const listsResult = await getLists();
  const categoriesResult = await getCategories();

  const lists = listsResult.success && listsResult.data ? listsResult.data : [];
  const categories =
    categoriesResult.success && categoriesResult.data
      ? categoriesResult.data
      : [];
  const admin = await isAdmin();
  const username = await getUsername();

  return (
    <HomeClient
      initialLists={lists}
      initialCategories={categories}
      isAdmin={admin}
      username={username}
    />
  );
}
