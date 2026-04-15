import { useToggleTask } from '../hooks/useToggleTask';

interface TaskToggleProps {
  id: number;
  isCompleted: boolean;
}

export function TaskToggle({ id, isCompleted }: TaskToggleProps) {
  const toggleTask = useToggleTask();

  return (
    <input
      type="checkbox"
      checked={isCompleted}
      onChange={() => toggleTask.mutate(id)}
      disabled={toggleTask.isPending}
    />
  );
}
