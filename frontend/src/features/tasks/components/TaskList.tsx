import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import type { TaskFilters } from '../types/task';
import { TaskItem } from './TaskItem';
import { TaskFilters } from './TaskFilters';
import { TaskPagination } from './TaskPagination';

export function TaskList() {
  const [filters, setFilters] = useState<TaskFilters>({ page: 1, page_size: 20 });
  const { data, isLoading, isError } = useTasks(filters);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading tasks</div>;

  return (
    <div>
      <h1>Tasks</h1>
      <Link to="/tasks/new">Create New Task</Link>
      <TaskFilters filters={filters} onFiltersChange={setFilters} />
      {data?.tasks.length === 0 ? (
        <div>No tasks found</div>
      ) : (
        data?.tasks.map((task) => <TaskItem key={task.id} task={task} />)
      )}
      {data && (
        <TaskPagination
          page={data.page}
          pageSize={data.page_size}
          total={data.total}
          onPageChange={(page) => setFilters({ ...filters, page })}
        />
      )}
    </div>
  );
}
