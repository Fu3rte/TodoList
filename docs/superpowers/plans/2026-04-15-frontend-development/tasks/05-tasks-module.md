# Task 5: Tasks Module

> **For agentic workers:** Implement this task step-by-step using superpowers:executing-plans.

**Goal:** 实现任务模块：任务的增删改查、筛选、分页、任务完成切换、优先级显示。

**Files:**
- Create: `frontend/src/features/tasks/types/task.ts`
- Create: `frontend/src/features/tasks/services/taskApi.ts`
- Create: `frontend/src/features/tasks/hooks/useTasks.ts`
- Create: `frontend/src/features/tasks/hooks/useTask.ts`
- Create: `frontend/src/features/tasks/hooks/useCreateTask.ts`
- Create: `frontend/src/features/tasks/hooks/useUpdateTask.ts`
- Create: `frontend/src/features/tasks/hooks/useToggleTask.ts`
- Create: `frontend/src/features/tasks/hooks/useDeleteTask.ts`
- Create: `frontend/src/features/tasks/components/TaskPriorityBadge.tsx`
- Create: `frontend/src/features/tasks/components/TaskToggle.tsx`
- Create: `frontend/src/features/tasks/components/TaskItem.tsx`
- Create: `frontend/src/features/tasks/components/TaskFilters.tsx`
- Create: `frontend/src/features/tasks/components/TaskPagination.tsx`
- Create: `frontend/src/features/tasks/components/TaskList.tsx`
- Create: `frontend/src/features/tasks/components/TaskForm.tsx`
- Create: `frontend/src/pages/TaskListPage.tsx`
- Create: `frontend/src/pages/TaskNewPage.tsx`
- Create: `frontend/src/pages/TaskDetailPage.tsx`
- Create: `frontend/src/pages/TaskEditPage.tsx`

---

## Task 5.1: Task 类型定义

- [ ] **Step 1: Create frontend/src/features/tasks/types/task.ts**

```typescript
import type { Category } from '../../categories/types/category';
import type { Tag } from '../../tags/types/tag';

export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  category_id: number | null;
  priority: Priority;
  due_date: string | null;
  is_completed: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
  tags: Tag[];
  category: Category | null;
}

export interface TaskFilters {
  category_id?: number;
  tag_id?: number;
  is_completed?: boolean;
  page?: number;
  page_size?: number;
}

export interface TaskListResponse {
  total: number;
  page: number;
  page_size: number;
  tasks: Task[];
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  category_id?: number;
  priority?: Priority;
  due_date?: string;
  tag_ids?: number[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  category_id?: number | null;
  priority?: Priority;
  due_date?: string | null;
  tag_ids?: number[];
}
```

- [ ] **Step 2: Commit**

Run:
```bash
git add frontend/src/features/tasks/types/task.ts
git commit -m "feat: add task types"
```

---

## Task 5.2: Task API 服务

- [ ] **Step 1: Create frontend/src/features/tasks/services/taskApi.ts**

```typescript
import axiosInstance from '../../../shared/lib/axiosInstance';
import type {
  Task,
  TaskFilters,
  TaskListResponse,
  CreateTaskInput,
  UpdateTaskInput,
} from '../types/task';

export const taskApi = {
  getTasks: async (filters?: TaskFilters): Promise<TaskListResponse> => {
    const response = await axiosInstance.get<TaskListResponse>('/api/tasks', { params: filters });
    return response.data;
  },

  getTask: async (id: number): Promise<Task> => {
    const response = await axiosInstance.get<Task>(`/api/tasks/${id}`);
    return response.data;
  },

  createTask: async (data: CreateTaskInput): Promise<Task> => {
    const response = await axiosInstance.post<Task>('/api/tasks', data);
    return response.data;
  },

  updateTask: async (id: number, data: UpdateTaskInput): Promise<Task> => {
    const response = await axiosInstance.put<Task>(`/api/tasks/${id}`, data);
    return response.data;
  },

  toggleTask: async (id: number): Promise<{ is_completed: boolean }> => {
    const response = await axiosInstance.patch<{ is_completed: boolean }>(`/api/tasks/${id}/toggle`);
    return response.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/tasks/${id}`);
  },
};
```

- [ ] **Step 2: Commit**

Run:
```bash
git add frontend/src/features/tasks/services/taskApi.ts
git commit -m "feat: add task API service"
```

---

## Task 5.3: Task Hooks

- [ ] **Step 1: Create frontend/src/features/tasks/hooks/useTasks.ts**

```typescript
import { useQuery } from '@tanstack/react-query';
import { taskApi } from '../services/taskApi';
import type { TaskFilters } from '../types/task';

export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => taskApi.getTasks(filters),
  });
}
```

- [ ] **Step 2: Create frontend/src/features/tasks/hooks/useTask.ts**

```typescript
import { useQuery } from '@tanstack/react-query';
import { taskApi } from '../services/taskApi';

export function useTask(id: number) {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => taskApi.getTask(id),
    enabled: !!id,
  });
}
```

- [ ] **Step 3: Create frontend/src/features/tasks/hooks/useCreateTask.ts**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { taskApi } from '../services/taskApi';
import type { CreateTaskInput } from '../types/task';

export function useCreateTask() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateTaskInput) => taskApi.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      navigate('/');
    },
  });
}
```

- [ ] **Step 4: Create frontend/src/features/tasks/hooks/useUpdateTask.ts**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { taskApi } from '../services/taskApi';
import type { UpdateTaskInput } from '../types/task';

export function useUpdateTask(id: number) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UpdateTaskInput) => taskApi.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      navigate(`/tasks/${id}`);
    },
  });
}
```

- [ ] **Step 5: Create frontend/src/features/tasks/hooks/useToggleTask.ts**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../services/taskApi';

export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => taskApi.toggleTask(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousData = queryClient.getQueryData(['tasks']);

      queryClient.setQueryData(['tasks'], (old: { tasks: Array<{ id: number; is_completed: boolean }> } | undefined) => {
        if (!old) return old;
        return {
          ...old,
          tasks: old.tasks.map((t) =>
            t.id === id ? { ...t, is_completed: !t.is_completed } : t
          ),
        };
      });

      return { previousData };
    },
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['tasks'], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
```

- [ ] **Step 6: Create frontend/src/features/tasks/hooks/useDeleteTask.ts**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { taskApi } from '../services/taskApi';

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (id: number) => taskApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      navigate('/');
    },
  });
}
```

- [ ] **Step 7: Commit**

Run:
```bash
git add frontend/src/features/tasks/hooks/useTasks.ts frontend/src/features/tasks/hooks/useTask.ts frontend/src/features/tasks/hooks/useCreateTask.ts frontend/src/features/tasks/hooks/useUpdateTask.ts frontend/src/features/tasks/hooks/useToggleTask.ts frontend/src/features/tasks/hooks/useDeleteTask.ts
git commit -m "feat: add task hooks"
```

---

## Task 5.4: Task 组件

- [ ] **Step 1: Create frontend/src/features/tasks/components/TaskPriorityBadge.tsx**

```typescript
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
```

- [ ] **Step 2: Create frontend/src/features/tasks/components/TaskToggle.tsx**

```typescript
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
```

- [ ] **Step 3: Create frontend/src/features/tasks/components/TaskItem.tsx**

```typescript
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
```

- [ ] **Step 4: Create frontend/src/features/tasks/components/TaskFilters.tsx**

```typescript
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
        value={filters.is_completed ?? ''}
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
```

- [ ] **Step 5: Create frontend/src/features/tasks/components/TaskPagination.tsx**

```typescript
interface TaskPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function TaskPagination({ page, pageSize, total, onPageChange }: TaskPaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
        Next
      </button>
    </div>
  );
}
```

- [ ] **Step 6: Create frontend/src/features/tasks/components/TaskList.tsx**

```typescript
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
```

- [ ] **Step 7: Create frontend/src/features/tasks/components/TaskForm.tsx**

```typescript
import { useState, useEffect } from 'react';
import { useCategories } from '../../categories/hooks/useCategories';
import { useTags } from '../../tags/hooks/useTags';
import type { CreateTaskInput, Priority } from '../types/task';

interface TaskFormProps {
  initialData?: Partial<CreateTaskInput>;
  onSubmit: (data: CreateTaskInput) => void;
  isPending: boolean;
}

export function TaskForm({ initialData, onSubmit, isPending }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [categoryId, setCategoryId] = useState<number | undefined>(initialData?.category_id);
  const [priority, setPriority] = useState<Priority>(initialData?.priority ?? 'medium');
  const [dueDate, setDueDate] = useState(initialData?.due_date ?? '');
  const [tagIds, setTagIds] = useState<number[]>(initialData?.tag_ids ?? []);
  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description: description || undefined,
      category_id: categoryId,
      priority,
      due_date: dueDate || undefined,
      tag_ids: tagIds.length > 0 ? tagIds : undefined,
    });
  };

  const toggleTag = (tagId: number) => {
    setTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
        />
      </div>
      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
        />
      </div>
      <div>
        <select value={categoryId ?? ''} onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}>
          <option value="">No category</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div>
        <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div>
        <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>
      <div>
        <span>Tags:</span>
        {tags?.map((tag) => (
          <label key={tag.id}>
            <input
              type="checkbox"
              checked={tagIds.includes(tag.id)}
              onChange={() => toggleTag(tag.id)}
            />
            {tag.name}
          </label>
        ))}
      </div>
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

- [ ] **Step 8: Commit**

Run:
```bash
git add frontend/src/features/tasks/components/TaskPriorityBadge.tsx frontend/src/features/tasks/components/TaskToggle.tsx frontend/src/features/tasks/components/TaskItem.tsx frontend/src/features/tasks/components/TaskFilters.tsx frontend/src/features/tasks/components/TaskPagination.tsx frontend/src/features/tasks/components/TaskList.tsx frontend/src/features/tasks/components/TaskForm.tsx
git commit -m "feat: add task components"
```

---

## Task 5.5: Task 页面

- [ ] **Step 1: Create frontend/src/pages/TaskListPage.tsx**

```typescript
import { TaskList } from '../features/tasks/components/TaskList';

export function TaskListPage() {
  return <TaskList />;
}
```

- [ ] **Step 2: Create frontend/src/pages/TaskNewPage.tsx**

```typescript
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
```

- [ ] **Step 3: Create frontend/src/pages/TaskDetailPage.tsx**

```typescript
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTask } from '../features/tasks/hooks/useTask';
import { useDeleteTask } from '../features/tasks/hooks/useDeleteTask';
import { TaskPriorityBadge } from '../features/tasks/components/TaskPriorityBadge';
import { TagBadge } from '../features/tags/components/TagBadge';

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const taskId = Number(id);
  const { data: task, isLoading, isError } = useTask(taskId);
  const deleteTask = useDeleteTask();
  const navigate = useNavigate();

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
```

- [ ] **Step 4: Create frontend/src/pages/TaskEditPage.tsx**

```typescript
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
```

- [ ] **Step 5: Commit**

Run:
```bash
git add frontend/src/pages/TaskListPage.tsx frontend/src/pages/TaskNewPage.tsx frontend/src/pages/TaskDetailPage.tsx frontend/src/pages/TaskEditPage.tsx
git commit -m "feat: add task pages"
```
