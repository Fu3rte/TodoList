import { Link } from 'react-router-dom';
import type { Task } from '../types/task';
import { TaskToggle } from './TaskToggle';
import { TaskPriorityBadge } from './TaskPriorityBadge';
import { TagBadge } from '../../tags/components/TagBadge';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  return (
    <div>
      <TaskToggle id={task.id} isCompleted={task.is_completed} />
      <Link to={`/tasks/${task.id}`}>{task.title}</Link>
      <TaskPriorityBadge priority={task.priority} />
      {task.category && <span>{task.category.name}</span>}
      {task.tags.map((tag) => (
        <TagBadge key={tag.id} tag={tag} />
      ))}
    </div>
  );
}
