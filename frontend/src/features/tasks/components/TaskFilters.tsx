import type { TaskFilters } from '../types/task';

interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
}

export function TaskFilters({ filters, onFiltersChange }: TaskFiltersProps) {
  return (
    <div>
      <select
        value={filters.category_id ?? ''}
        onChange={(e) =>
          onFiltersChange({
            ...filters,
            category_id: e.target.value ? Number(e.target.value) : undefined,
          })
        }
      >
        <option value="">All Categories</option>
      </select>
      <select
        value={filters.is_completed === undefined ? '' : filters.is_completed ? 'true' : 'false'}
        onChange={(e) =>
          onFiltersChange({
            ...filters,
            is_completed: e.target.value === '' ? undefined : e.target.value === 'true',
          })
        }
      >
        <option value="">All Status</option>
        <option value="false">Active</option>
        <option value="true">Completed</option>
      </select>
    </div>
  );
}
