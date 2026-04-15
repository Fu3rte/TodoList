import { useCreateTask } from '../features/tasks/hooks/useCreateTask';
import { TaskForm } from '../features/tasks/components/TaskForm';
import type { CreateTaskInput } from '../features/tasks/types/task';

export function TaskNewPage() {
  const createTask = useCreateTask();

  return (
    <div>
      <h1>Create New Task</h1>
      <TaskForm onSubmit={(data: CreateTaskInput) => createTask.mutate(data)} isPending={createTask.isPending} />
    </div>
  );
}
