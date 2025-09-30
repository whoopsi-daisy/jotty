import { CheckSquare, PauseCircle, BarChart3 } from "lucide-react";

export const TASK_STATUS_CONFIG = {
  todo: {
    title: "To Do",
    Icon: CheckSquare,
    iconClassName: "text-muted-foreground",
  },
  in_progress: {
    title: "In Progress",
    Icon: BarChart3,
    iconClassName: "text-blue-600",
  },
  paused: {
    title: "Paused",
    Icon: PauseCircle,
    iconClassName: "text-yellow-600",
  },
  completed: {
    title: "Completed",
    Icon: CheckSquare,
    iconClassName: "text-green-600",
  },
};
