import { redirect } from "next/navigation";
import { getAllNotes } from "@/app/_server/actions/note";
import { getItemSharingMetadata } from "@/app/_server/actions/sharing";
import { PublicNoteView } from "@/app/_components/FeatureComponents/PublicView/PublicNoteView";
import { getUserByUsername } from "@/app/_server/actions/users";
import type { Metadata, ResolvingMetadata } from "next";
import { getMedatadaTitle } from "@/app/_server/actions/config";
import { Modes } from "@/app/_types/enums";

interface PublicNotePageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PublicNotePageProps): Promise<Metadata> {
  const { id } = params;

  return getMedatadaTitle(Modes.NOTES, id);
}

export default async function PublicNotePage({ params }: PublicNotePageProps) {
  const { id } = params;

  const docsResult = await getAllNotes();
  if (!docsResult.success || !docsResult.data) {
    redirect("/");
  }

  const note = docsResult.data.find((doc) => doc.id === id);
  if (!note) {
    redirect("/");
  }

  const sharingMetadata = await getItemSharingMetadata(id, "note", note.owner!);
  const user = await getUserByUsername(note.owner!);
  if (user) {
    user.avatarUrl = process.env.SERVE_PUBLIC_IMAGES
      ? user.avatarUrl
      : undefined;
  }

  if (!sharingMetadata || !sharingMetadata.isPubliclyShared) {
    redirect("/");
  }

  return <PublicNoteView note={note} user={user} />;
}
