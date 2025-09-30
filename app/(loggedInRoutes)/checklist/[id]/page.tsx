import { redirect } from "next/navigation";
import { getLists, getCategories } from "@/app/_server/actions/data/actions";
import { getAllLists } from "@/app/_server/actions/data/list-queries";
import { getAllSharingStatusesAction } from "@/app/_server/actions/sharing/share-item";
import { isAdmin, getUsername } from "@/app/_server/actions/auth/utils";
import { ChecklistClient } from "@/app/_components/FeatureComponents/Checklists/Parts/ChecklistClient";

interface ChecklistPageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

export default async function ChecklistPage({ params }: ChecklistPageProps) {
  const { id } = params;
  const username = await getUsername();
  const isAdminUser = await isAdmin();

  const [listsResult, categoriesResult] = await Promise.all([
    getLists(username),
    getCategories(),
  ]);

  if (!listsResult.success || !listsResult.data) {
    redirect("/");
  }

  let checklist = listsResult.data.find((list) => list.id === id);

  if (!checklist && isAdminUser) {
    const allListsResult = await getAllLists();
    if (allListsResult.success && allListsResult.data) {
      checklist = allListsResult.data.find((list) => list.id === id);
    }
  }

  if (!checklist) {
    redirect("/");
  }

  const categories =
    categoriesResult.success && categoriesResult.data
      ? categoriesResult.data
      : [];

  const allItems = [...listsResult.data];
  const itemsToCheck = allItems.map((item) => ({
    id: item.id,
    type: "checklist" as const,
    owner: item.owner || "",
  }));

  const sharingStatusesResult = await getAllSharingStatusesAction(itemsToCheck);
  const sharingStatuses =
    sharingStatusesResult.success && sharingStatusesResult.data
      ? sharingStatusesResult.data
      : {};

  return (
    <ChecklistClient
      checklist={checklist}
      lists={listsResult.data}
      categories={categories}
      sharingStatuses={sharingStatuses}
      username={username}
      isAdmin={isAdminUser}
    />
  );
}
