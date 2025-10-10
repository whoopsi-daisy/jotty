import { Button } from "@/app/_components/GlobalComponents/Buttons/Button";

interface NavigationGlobalIconProps {
  onClick: () => void;
  icon: React.ReactNode;
}

export const NavigationGlobalIcon = ({
  onClick,
  icon,
}: NavigationGlobalIconProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onClick()}
      className="text-muted-foreground hover:bg-transparent lg:hover:bg-muted lg:hover:text-foreground transition-colors"
    >
      {icon}
    </Button>
  );
};
