import { useParams, Link } from 'react-router-dom';
import { useTask } from '../features/tasks/hooks/useTask';
import { useDeleteTask } from '../features/tasks/hooks/useDeleteTask';
import { TaskPriorityBadge } from '../features/tasks/components/TaskPriorityBadge';
import { TagBadge } from '../features/tags/components/TagBadge';

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const taskId = Number(id);
  const { data: task, isLoading, isError } = useTask(taskId);
  const deleteTask = useDeleteTask();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !task) return <div>Task not found</div>;

  const handleDelete = () => {
    if (confirm('Delete this task?')) {
      deleteTask.mutate(taskId);
    }
  };

  return (
    <div>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <p>Priority: <TaskPriorityBadge priority={task.priority} /></p>
      {task.category && <p>Category: {task.category.name}</p>}
      {task.due_date && <p>Due: {new Date(task.due_date).toLocaleString()}</p>}
      <div>
        Tags: {task.tags.map((tag) => <TagBadge key={tag.id} tag={tag} />)}
      </div>
      <Link to={`/tasks/${taskId}/edit`}>Edit</Link>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
