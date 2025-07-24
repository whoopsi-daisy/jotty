"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { getUsers } from "@/app/_server/actions/users/manage";
import { switchUser } from "@/app/_server/actions/users/switch";
import { useRouter } from "next/navigation";
import { Button } from "./ui/elements/button";
import { cn } from "@/app/_utils/utils";

interface Props {
  currentUsername: string;
}

interface User {
  username: string;
  isAdmin: boolean;
}

export default function UserSwitcher({ currentUsername }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function loadUsers() {
      const result = await getUsers();
      if (!("error" in result)) {
        setUsers(result);
      }
    }
    loadUsers();
  }, []);

  const handleSwitchUser = async (username: string) => {
    const formData = new FormData();
    formData.append("username", username);
    const result = await switchUser(formData);
    if (!("error" in result)) {
      setIsOpen(false);
      router.refresh();
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 h-9"
      >
        <span className="text-sm font-medium truncate max-w-[100px]">
          {currentUsername}
        </span>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-50 w-48 mt-1 bg-card border border-border rounded-lg shadow-lg py-1">
            {users.map((user) => (
              <button
                key={user.username}
                onClick={() => handleSwitchUser(user.username)}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
                  user.username === currentUsername &&
                  "bg-accent text-accent-foreground"
                )}
              >
                {user.username}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
