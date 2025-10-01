import { ImageIcon, File } from "lucide-react";

interface FileTabsProps {
  activeTab: "images" | "files";
  setActiveTab: (tab: "images" | "files") => void;
}

export const FileTabs = ({ activeTab, setActiveTab }: FileTabsProps) => (
  <div className="flex border-b border-border">
    {(["images", "files"] as const).map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
          activeTab === tab
            ? "text-primary border-b-2 border-primary bg-accent/50"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          {tab === "images" ? (
            <ImageIcon className="h-4 w-4" />
          ) : (
            <File className="h-4 w-4" />
          )}
          {tab === "images" ? "Images" : "Files"}
        </div>
      </button>
    ))}
  </div>
);
