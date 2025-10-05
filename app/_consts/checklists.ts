import { CheckSquare, PauseCircle, BarChart3 } from "lucide-react";
import { Modes, TaskStatus, TaskStatusLabels } from "../_types/enums";

export const CHECKLISTS_FOLDER = Modes.CHECKLISTS;

export const TASK_STATUS_CONFIG = {
  [TaskStatus.TODO]: {
    title: TaskStatusLabels.TODO,
    Icon: CheckSquare,
    iconClassName: "text-muted-foreground",
  },
  [TaskStatus.IN_PROGRESS]: {
    title: TaskStatusLabels.IN_PROGRESS,
    Icon: BarChart3,
    iconClassName: "text-blue-600",
  },
  [TaskStatus.PAUSED]: {
    title: TaskStatusLabels.PAUSED,
    Icon: PauseCircle,
    iconClassName: "text-yellow-600",
  },
  [TaskStatus.COMPLETED]: {
    title: TaskStatusLabels.COMPLETED,
    Icon: CheckSquare,
    iconClassName: "text-green-600",
  },
};
