import { getLists, getCategories } from "@/app/_server/actions/data/actions";
import {
  getDocs,
  getDocsCategories,
} from "@/app/_server/actions/data/notes-actions";
import { getAllSharingStatusesAction } from "@/app/_server/actions/sharing/share-item";
import { HomeClient } from "@/app/_components/features/home/HomeClient";
import { isAdmin, getUsername } from "@/app/_server/actions/auth/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [listsResult, categoriesResult, docsResult, docsCategoriesResult] =
    await Promise.all([
      getLists(),
      getCategories(),
      getDocs(),
      getDocsCategories(),
    ]);

  const lists = listsResult.success && listsResult.data ? listsResult.data : [];
  const categories =
    categoriesResult.success && categoriesResult.data
      ? categoriesResult.data
      : [];
  const docs = docsResult.success && docsResult.data ? docsResult.data : [];
  const docsCategories =
    docsCategoriesResult.success && docsCategoriesResult.data
      ? docsCategoriesResult.data
      : [];
  const admin = await isAdmin();
  const username = await getUsername();

  const allItems = [...lists, ...docs];
  const itemsToCheck = allItems.map(item => ({
    id: item.id,
    type: 'type' in item && item.type === "task" ? "checklist" as const :
      'type' in item ? "checklist" as const : "document" as const,
    owner: item.owner || ""
  }));

  const sharingStatusesResult = await getAllSharingStatusesAction(itemsToCheck);
  const sharingStatuses = sharingStatusesResult.success && sharingStatusesResult.data
    ? sharingStatusesResult.data
    : {};

  return (
    <HomeClient
      initialLists={lists}
      initialCategories={categories}
      initialDocs={docs}
      initialDocsCategories={docsCategories}
      sharingStatuses={sharingStatuses}
      isAdmin={admin}
      username={username}
    />
  );
}
