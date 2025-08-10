import { UserProfileClient } from "@/app/_components/_FeatureComponents/UserProfilePage/UserProfileClient";
import { isAdmin, getUsername } from "@/app/_server/actions/auth/utils";

export default async function ProfilePage() {
    const admin = await isAdmin();
    const username = await getUsername();

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            <UserProfileClient username={username} isAdmin={admin} />
        </div>
    );
}
