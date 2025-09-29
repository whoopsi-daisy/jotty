"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/_components/ui/elements/button";
import { Label } from "@/app/_components/ui/elements/label";
import { Upload, X, Settings, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/app/_providers/ToastProvider";
import {
  getAppSettingsAction,
  updateAppSettingsAction,
  uploadAppIconAction,
} from "@/app/_server/actions/data/app-settings-actions";
import { useFaviconUpdate } from "@/app/_hooks/useFaviconUpdate";

interface AppSettings {
  appName: string;
  appDescription: string;
  "16x16Icon": string;
  "32x32Icon": string;
  "180x180Icon": string;
}

interface ImageUploadProps {
  label: string;
  description: string;
  iconType: keyof AppSettings;
  currentUrl: string;
  onUpload: (iconType: keyof AppSettings, url: string) => void;
  isUploading: boolean;
  showToast: (toast: {
    type: "success" | "error" | "info";
    title: string;
    message?: string;
  }) => void;
}

function ImageUpload({
  label,
  description,
  iconType,
  currentUrl,
  onUpload,
  isUploading,
  showToast,
}: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast({
        type: "error",
        title: "Invalid File",
        message: "Please select an image file",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast({
        type: "error",
        title: "File Too Large",
        message: "File size must be less than 5MB",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("iconType", iconType);

    try {
      const result = await uploadAppIconAction(formData);
      if (result.success && result.data) {
        onUpload(iconType, result.data.url);
        showToast({
          type: "success",
          title: "Success",
          message: "Icon uploaded successfully",
        });
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showToast({
        type: "error",
        title: "Upload Failed",
        message: error instanceof Error ? error.message : "Upload failed",
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const clearImage = () => {
    onUpload(iconType, "");
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <p className="text-xs text-muted-foreground">{description}</p>

      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {currentUrl ? (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <img
                src={currentUrl}
                alt={`${label} preview`}
                className="w-12 h-12 object-contain rounded border"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Current icon</p>
              <p className="text-xs text-muted-foreground truncate">
                {currentUrl}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearImage}
              className="flex-shrink-0 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Drop image here or click to upload
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WebP up to 5MB
              </p>
            </div>
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        id={`upload-${iconType}`}
        disabled={isUploading}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        disabled={isUploading}
        onClick={() => document.getElementById(`upload-${iconType}`)?.click()}
      >
        <Upload className="h-4 w-4 mr-2" />
        {isUploading ? "Uploading..." : "Choose File"}
      </Button>
    </div>
  );
}

export function AppSettingsTab() {
  const { showToast } = useToast();
  const { updateFavicons } = useFaviconUpdate();
  const [settings, setSettings] = useState<AppSettings>({
    appName: "",
    appDescription: "",
    "16x16Icon": "",
    "32x32Icon": "",
    "180x180Icon": "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const result = await getAppSettingsAction();
      if (result.success && result.data) {
        setSettings(result.data);
      } else {
        showToast({
          type: "error",
          title: "Load Error",
          message: result.error || "Failed to load settings",
        });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      showToast({
        type: "error",
        title: "Load Error",
        message: "Failed to load settings",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof AppSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleImageUpload = (iconType: keyof AppSettings, url: string) => {
    setSettings((prev) => ({ ...prev, [iconType]: url }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("appName", settings.appName);
      formData.append("appDescription", settings.appDescription);
      formData.append("16x16Icon", settings["16x16Icon"]);
      formData.append("32x32Icon", settings["32x32Icon"]);
      formData.append("180x180Icon", settings["180x180Icon"]);

      const result = await updateAppSettingsAction(formData);
      if (result.success) {
        showToast({
          type: "success",
          title: "Success",
          message: "Settings saved successfully",
        });
        setHasChanges(false);
        await updateFavicons();
      } else {
        throw new Error(result.error || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      showToast({
        type: "error",
        title: "Save Error",
        message:
          error instanceof Error ? error.message : "Failed to save settings",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    loadSettings();
    setHasChanges(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Settings
          </h2>
          <p className="text-muted-foreground">
            Customize your application name, description, and icons
          </p>
        </div>
      </div>

      <div className="bg-background border border-border rounded-lg p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="appName">Application Name</Label>
            <input
              id="appName"
              type="text"
              value={settings.appName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("appName", e.target.value)
              }
              placeholder="rwMarkable"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground">
              This will appear in the browser tab and PWA name
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="appDescription">Application Description</Label>
            <input
              id="appDescription"
              type="text"
              value={settings.appDescription}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange("appDescription", e.target.value)
              }
              placeholder="A simple, fast, and lightweight checklist and notes application"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground">
              Used for search engines and PWA description
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Application Icons</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <ImageUpload
                label="16x16 Favicon"
                description="Small favicon for browser tabs"
                iconType="16x16Icon"
                currentUrl={settings["16x16Icon"]}
                onUpload={handleImageUpload}
                isUploading={isUploading}
                showToast={showToast}
              />

              <ImageUpload
                label="32x32 Logo"
                description="Standard logo for desktop"
                iconType="32x32Icon"
                currentUrl={settings["32x32Icon"]}
                onUpload={handleImageUpload}
                isUploading={isUploading}
                showToast={showToast}
              />

              <ImageUpload
                label="180x180 Apple Touch Icon"
                description="Icon for iOS home screen"
                iconType="180x180Icon"
                currentUrl={settings["180x180Icon"]}
                onUpload={handleImageUpload}
                isUploading={isUploading}
                showToast={showToast}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="min-w-[100px]"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>

          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isSaving || !hasChanges}
          >
            Reset
          </Button>

          {hasChanges && (
            <p className="text-sm text-muted-foreground">
              You have unsaved changes
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
