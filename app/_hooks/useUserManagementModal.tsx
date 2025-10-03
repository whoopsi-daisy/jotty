import { useState, useEffect } from "react";
import { User as UserType } from "@/app/_types";
import {
  createUser,
  deleteUser,
  updateUser,
} from "@/app/_server/actions/users";
import { useToast } from "@/app/_providers/ToastProvider";

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  user?: UserType;
  onSuccess: () => void;
}

export const useUserManagementModal = ({
  isOpen,
  mode,
  user,
  onSuccess,
  onClose,
}: UserManagementModalProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && user) {
        setUsername(user.username);
        setIsAdmin(user.isAdmin);
      } else {
        setUsername("");
        setIsAdmin(false);
      }
      setPassword("");
      setConfirmPassword("");
      setChangePassword(false);
      setError(null);
    }
  }, [isOpen, mode, user]);

  const validate = () => {
    if (!username.trim()) return "Username is required";
    const isPasswordRequired = mode === "add" || changePassword;
    if (isPasswordRequired && !password) return "Password is required";
    if (isPasswordRequired && password.length < 6)
      return "Password must be at least 6 characters long";
    if (isPasswordRequired && password !== confirmPassword)
      return "Passwords do not match";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      let result;
      if (mode === "add") {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("confirmPassword", confirmPassword);
        formData.append("isAdmin", String(isAdmin));
        result = await createUser(formData);
      } else {
        const formData = new FormData();
        formData.append("username", user!.username);
        formData.append("newUsername", username);
        if (changePassword && password) {
          formData.append("password", password);
          formData.append("confirmPassword", confirmPassword);
        }
        formData.append("isAdmin", String(isAdmin));
        result = await updateUser(formData);
      }

      if (result.success) {
        showToast({
          type: "success",
          title: `User ${mode === "add" ? "created" : "updated"} successfully!`,
        });
        onSuccess();
        onClose();
      } else {
        throw new Error(result.error || `Failed to ${mode} user`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !user ||
      !window.confirm(`Delete user "${user.username}"? This cannot be undone.`)
    )
      return;

    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("username", user.username);
      const result = await deleteUser(formData);

      if (result.success) {
        showToast({ type: "success", title: "User deleted successfully!" });
        onSuccess();
        onClose();
      } else {
        throw new Error(result.error || "Failed to delete user");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    state: {
      username,
      password,
      confirmPassword,
      isAdmin,
      changePassword,
      isLoading,
      error,
    },
    setters: {
      setUsername,
      setPassword,
      setConfirmPassword,
      setIsAdmin,
      setChangePassword,
    },
    handlers: { handleSubmit, handleDelete },
  };
};
