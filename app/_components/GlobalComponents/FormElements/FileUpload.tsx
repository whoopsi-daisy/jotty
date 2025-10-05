import { Button } from "../Buttons/Button";
import { Upload } from "lucide-react";
import { formatFileSize } from "@/app/_utils/file-icon-utils";
import { Loader2 } from "lucide-react";

interface FileUploadProps {
  activeTab: "images" | "files";
  selectedFile: File | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  isUploading: boolean;
}

export const FileUpload = ({
  activeTab,
  selectedFile,
  onFileSelect,
  onUpload,
  isUploading,
}: FileUploadProps) => (
  <div className="p-6 border-b border-border">
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <input
        type="file"
        accept={activeTab === "images" ? "image/*" : "*"}
        onChange={onFileSelect}
        className="hidden"
        id="file-upload"
      />
      <Button
        variant="outline"
        onClick={() => document.getElementById("file-upload")?.click()}
        className="w-full sm:w-auto"
      >
        <Upload className="h-4 w-4 mr-2" /> Choose{" "}
        {activeTab === "images" ? "Image" : "File"}
      </Button>
      {selectedFile && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1">
          <span className="text-sm text-muted-foreground truncate max-w-xs">
            {selectedFile.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatFileSize(selectedFile.size)}
          </span>
          <Button
            onClick={onUpload}
            disabled={isUploading}
            size="sm"
            className="w-full sm:w-auto"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </div>
      )}
    </div>
  </div>
);
