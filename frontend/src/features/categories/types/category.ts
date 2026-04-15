export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  user_id: number;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

export interface CreateCategoryInput {
  name: string;
  parent_id?: number;
}

export interface UpdateCategoryInput {
  name?: string;
  parent_id?: number | null;
}