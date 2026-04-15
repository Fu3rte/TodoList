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
