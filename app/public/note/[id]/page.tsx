import { redirect } from "next/navigation";
import { getAllDocs } from "@/app/_server/actions/data/notes-actions";
import { getItemSharingMetadata } from "@/app/_server/actions/sharing/sharing-utils";
import { PublicNoteView } from "@/app/_components/FeatureComponents/PublicView/PublicNoteView";

interface PublicNotePageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

export default async function PublicNotePage({ params }: PublicNotePageProps) {
  const { id } = params;

  const docsResult = await getAllDocs();
  if (!docsResult.success || !docsResult.data) {
    redirect("/");
  }

  const note = docsResult.data.find((doc) => doc.id === id);
  if (!note) {
    redirect("/");
  }

  const sharingMetadata = await getItemSharingMetadata(id, "note", note.owner!);

  if (!sharingMetadata || !sharingMetadata.isPubliclyShared) {
    redirect("/");
  }

  return <PublicNoteView note={note} />;
}
