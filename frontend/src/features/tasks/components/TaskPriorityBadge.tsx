import type { Priority } from '../types/task';

interface TaskPriorityBadgeProps {
  priority: Priority;
}

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  const colors: Record<Priority, string> = {
    high: 'red',
    medium: 'yellow',
    low: 'green',
  };

  return <span style={{ color: colors[priority] }}>{priority}</span>;
}
