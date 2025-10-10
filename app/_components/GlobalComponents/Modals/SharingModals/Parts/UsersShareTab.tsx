import { User } from "@/app/_types";
import { Search } from "lucide-react";
import { UserAvatar } from "../../../User/UserAvatar";
import { cn } from "@/app/_utils/global-utils";

export const UsersShareTab = ({
  filteredUsers,
  selectedUsers,
  currentSharing,
  handleUserToggle,
  searchQuery,
  setSearchQuery,
}: any) => (
  <div className="space-y-4">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search users..."
        className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
    <div className="max-h-48 overflow-y-auto">
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user: User) => (
          <label
            key={user.username}
            className={cn(
              "flex mt-2 items-center p-3 rounded-lg hover:bg-accent cursor-pointer relative",
              selectedUsers.includes(user.username) && "bg-accent"
            )}
          >
            <input
              type="checkbox"
              checked={selectedUsers.includes(user.username)}
              onChange={() => handleUserToggle(user.username)}
              className="rounded border-border text-primary focus:ring-primary opacity-0 absolute right-0"
            />
            <UserAvatar size="sm" className="mr-2" username={user.username} avatarUrl={user.avatarUrl} />
            <span className="text-sm font-medium">{user.username}</span>
            {currentSharing.includes(user.username) && (
              <span className="ml-auto text-xs text-primary font-medium">
                Shared
              </span>
            )}
          </label>
        ))
      ) : (
        <p className="text-center text-sm text-muted-foreground py-4">
          No users found.
        </p>
      )}
    </div>
  </div>
);
