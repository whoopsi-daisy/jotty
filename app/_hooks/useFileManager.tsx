import { useState, useCallback, useMemo } from "react";
import {
  getFiles,
  uploadFile,
  deleteFile,
  FileItem,
} from "@/app/_server/actions/upload";

export const useFileManager = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<"images" | "files">("images");

  const loadFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getFiles();
      if (result.success && result.data) setFiles(result.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile as Blob);
    try {
      const result = await uploadFile(formData);
      if (result.success) {
        setSelectedFile(null);
        await loadFiles();
      } else {
        alert(result.error || "Upload failed");
      }
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (
    fileName: string,
    fileType: "image" | "file"
  ) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    const formData = new FormData();
    formData.append("fileName", fileName);
    formData.append("fileType", fileType);
    const result = await deleteFile(formData);
    if (result.success) await loadFiles();
    else alert(result.error || "Failed to delete file");
  };

  const filteredFiles = useMemo(
    () =>
      files.filter((file) =>
        activeTab === "images" ? file.type === "image" : file.type === "file"
      ),
    [files, activeTab]
  );

  return {
    files,
    isLoading,
    isUploading,
    selectedFile,
    setSelectedFile,
    activeTab,
    setActiveTab,
    loadFiles,
    handleUpload,
    handleDeleteFile,
    filteredFiles,
  };
};
