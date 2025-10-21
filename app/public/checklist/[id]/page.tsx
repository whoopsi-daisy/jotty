import { redirect } from "next/navigation";
import { getAllLists } from "@/app/_server/actions/checklist";
import { getItemSharingMetadata } from "@/app/_server/actions/sharing";
import { PublicChecklistView } from "@/app/_components/FeatureComponents/PublicView/PublicChecklistView";
import { CheckForNeedsMigration } from "@/app/_server/actions/note";
import { getUserByUsername } from "@/app/_server/actions/users";
import type { Metadata, ResolvingMetadata } from "next";
import { Modes } from "@/app/_types/enums";
import { getMedatadaTitle } from "@/app/_server/actions/config";

interface PublicChecklistPageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PublicChecklistPageProps): Promise<Metadata> {
  const { id } = params;

  return getMedatadaTitle(Modes.CHECKLISTS, id);
}

export default async function PublicChecklistPage({
  params,
}: PublicChecklistPageProps) {
  const { id } = params;

  await CheckForNeedsMigration();

  const listsResult = await getAllLists();
  if (!listsResult.success || !listsResult.data) {
    redirect("/");
  }

  const checklist = listsResult.data.find((list) => list.id === id);
  if (!checklist) {
    redirect("/");
  }

  const user = await getUserByUsername(checklist.owner!);
  if (user) {
    user.avatarUrl = process.env.SERVE_PUBLIC_IMAGES
      ? user.avatarUrl
      : undefined;
  }

  const sharingMetadata = await getItemSharingMetadata(
    id,
    "checklist",
    checklist.owner!
  );

  if (!sharingMetadata || !sharingMetadata.isPubliclyShared) {
    redirect("/");
  }

  return <PublicChecklistView checklist={checklist} user={user} />;
}
