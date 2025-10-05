import { Logo } from "./Logo";
import { getSettings } from "@/app/_server/actions/config";

interface ServerLogoProps {
  className?: string;
  size?: "16x16" | "32x32" | "180x180";
}

export const ServerLogo = async ({
  className = "h-8 w-8",
  size = "32x32",
}: ServerLogoProps) => {
  try {
    const settings = await getSettings();
    const iconKey =
      size === "16x16"
        ? "16x16Icon"
        : size === "32x32"
        ? "32x32Icon"
        : "180x180Icon";
    const iconUrl = settings[iconKey];

    if (iconUrl) {
      return (
        <img
          src={iconUrl}
          alt="App Logo"
          className={`${className} object-contain`}
        />
      );
    }
  } catch (error) {
    console.error("Error loading custom icon:", error);
  }

  return <Logo className={className} />;
};
