import { useParams } from 'react-router-dom';
import { useTask } from '../features/tasks/hooks/useTask';
import { useUpdateTask } from '../features/tasks/hooks/useUpdateTask';
import { TaskForm } from '../features/tasks/components/TaskForm';
import type { CreateTaskInput } from '../features/tasks/types/task';

export function TaskEditPage() {
  const { id } = useParams<{ id: string }>();
  const taskId = Number(id);
  const { data: task, isLoading } = useTask(taskId);
  const updateTask = useUpdateTask(taskId);

  if (isLoading) return <div>Loading...</div>;
  if (!task) return <div>Task not found</div>;

  return (
    <div>
      <h1>Edit Task</h1>
      <TaskForm
        initialData={{
          title: task.title,
          description: task.description ?? undefined,
          category_id: task.category_id ?? undefined,
          priority: task.priority,
          due_date: task.due_date ?? undefined,
          tag_ids: task.tags.map((t) => t.id),
        }}
        onSubmit={(data: CreateTaskInput) => updateTask.mutate(data)}
        isPending={updateTask.isPending}
      />
    </div>
  );
}
