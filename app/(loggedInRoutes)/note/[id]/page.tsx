import { redirect } from "next/navigation";
import {
  getNotes,
  getAllNotes,
  CheckForNeedsMigration,
} from "@/app/_server/actions/note";
import { getAllSharingStatuses } from "@/app/_server/actions/sharing";
import { isAdmin, getUsername, getCurrentUser } from "@/app/_server/actions/users";
import { NoteClient } from "@/app/_components/FeatureComponents/Notes/NoteClient";
import { Modes } from "@/app/_types/enums";
import { getCategories } from "@/app/_server/actions/category";

interface NotePageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

export default async function NotePage({ params }: NotePageProps) {
  const { id } = params;
  const user = await getCurrentUser();
  const username = user?.username || "";
  const isAdminUser = user?.isAdmin || false;

  await CheckForNeedsMigration();

  const [docsResult, categoriesResult] = await Promise.all([
    getNotes(username),
    getCategories(Modes.NOTES),
  ]);

  if (!docsResult.success || !docsResult.data) {
    redirect("/");
  }

  let note = docsResult.data.find((doc) => doc.id === id);

  if (!note && isAdminUser) {
    const allDocsResult = await getAllNotes();
    if (allDocsResult.success && allDocsResult.data) {
      note = allDocsResult.data.find((doc) => doc.id === id);
    }
  }

  if (!note) {
    redirect("/");
  }

  const docsCategories =
    categoriesResult.success && categoriesResult.data
      ? categoriesResult.data
      : [];

  const allItems = [...docsResult.data];
  const itemsToCheck = allItems.map((item) => ({
    id: item.id,
    type: "note" as const,
    owner: item.owner || "",
  }));

  const sharingStatusesResult = await getAllSharingStatuses(itemsToCheck);
  const sharingStatuses =
    sharingStatusesResult.success && sharingStatusesResult.data
      ? sharingStatusesResult.data
      : {};

  return (
    <NoteClient
      note={note}
      docs={docsResult.data}
      categories={docsCategories}
      sharingStatuses={sharingStatuses}
      user={user}
    />
  );
}
