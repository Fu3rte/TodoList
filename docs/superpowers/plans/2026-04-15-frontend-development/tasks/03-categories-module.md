# Task 3: Categories Module

> **For agentic workers:** Implement this task step-by-step using superpowers:executing-plans.

**Goal:** 实现分类模块：分类的增删改查、树形结构展示。

**Files:**
- Create: `frontend/src/features/categories/types/category.ts`
- Create: `frontend/src/features/categories/services/categoryApi.ts`
- Create: `frontend/src/features/categories/hooks/useCategories.ts`
- Create: `frontend/src/features/categories/hooks/useCreateCategory.ts`
- Create: `frontend/src/features/categories/hooks/useUpdateCategory.ts`
- Create: `frontend/src/features/categories/hooks/useDeleteCategory.ts`
- Create: `frontend/src/features/categories/components/CategoryItem.tsx`
- Create: `frontend/src/features/categories/components/CategoryTree.tsx`
- Create: `frontend/src/features/categories/components/CategoryForm.tsx`
- Create: `frontend/src/pages/CategoryManagePage.tsx`

---

## Task 3.1: Category 类型定义

- [ ] **Step 1: Create frontend/src/features/categories/types/category.ts**

```typescript
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
```

- [ ] **Step 2: Commit**

Run:
```bash
git add frontend/src/features/categories/types/category.ts
git commit -m "feat: add category types"
```

---

## Task 3.2: Category API 服务

- [ ] **Step 1: Create frontend/src/features/categories/services/categoryApi.ts**

```typescript
import axiosInstance from '../../../shared/lib/axiosInstance';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../types/category';

export const categoryApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get<Category[]>('/api/categories');
    return response.data;
  },

  createCategory: async (data: CreateCategoryInput): Promise<Category> => {
    const response = await axiosInstance.post<Category>('/api/categories', data);
    return response.data;
  },

  updateCategory: async (id: number, data: UpdateCategoryInput): Promise<Category> => {
    const response = await axiosInstance.put<Category>(`/api/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/categories/${id}`);
  },
};
```

- [ ] **Step 2: Commit**

Run:
```bash
git add frontend/src/features/categories/services/categoryApi.ts
git commit -m "feat: add category API service"
```

---

## Task 3.3: Category Hooks

- [ ] **Step 1: Create frontend/src/features/categories/hooks/useCategories.ts**

```typescript
import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../services/categoryApi';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories(),
  });
}
```

- [ ] **Step 2: Create frontend/src/features/categories/hooks/useCreateCategory.ts**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../services/categoryApi';
import type { CreateCategoryInput } from '../types/category';

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryInput) => categoryApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
```

- [ ] **Step 3: Create frontend/src/features/categories/hooks/useUpdateCategory.ts**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../services/categoryApi';
import type { UpdateCategoryInput } from '../types/category';

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryInput }) =>
      categoryApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
```

- [ ] **Step 4: Create frontend/src/features/categories/hooks/useDeleteCategory.ts**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../services/categoryApi';

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
```

- [ ] **Step 5: Commit**

Run:
```bash
git add frontend/src/features/categories/hooks/useCategories.ts frontend/src/features/categories/hooks/useCreateCategory.ts frontend/src/features/categories/hooks/useUpdateCategory.ts frontend/src/features/categories/hooks/useDeleteCategory.ts
git commit -m "feat: add category hooks"
```

---

## Task 3.4: Category 组件

- [ ] **Step 1: Create frontend/src/features/categories/components/CategoryItem.tsx**

```typescript
import { useState } from 'react';
import type { Category } from '../types/category';
import { useUpdateCategory } from '../hooks/useUpdateCategory';
import { useDeleteCategory } from '../hooks/useDeleteCategory';

interface CategoryItemProps {
  category: Category;
  onEdit?: (category: Category) => void;
}

export function CategoryItem({ category, onEdit }: CategoryItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleUpdate = () => {
    updateCategory.mutate(
      { id: category.id, data: { name } },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const handleDelete = () => {
    if (confirm('Delete this category?')) {
      deleteCategory.mutate(category.id);
    }
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <span>{category.name}</span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
      {category.children && category.children.length > 0 && (
        <div style={{ marginLeft: 20 }}>
          {category.children.map((child) => (
            <CategoryItem key={child.id} category={child} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create frontend/src/features/categories/components/CategoryTree.tsx**

```typescript
import { useCategories } from '../hooks/useCategories';
import { CategoryItem } from './CategoryItem';
import type { Category } from '../types/category';

function buildTree(categories: Category[]): Category[] {
  const map = new Map<number, Category>();
  const roots: Category[] = [];

  categories.forEach((cat) => {
    map.set(cat.id, { ...cat, children: [] });
  });

  map.forEach((cat) => {
    if (cat.parent_id && map.has(cat.parent_id)) {
      map.get(cat.parent_id)!.children!.push(cat);
    } else {
      roots.push(cat);
    }
  });

  return roots;
}

export function CategoryTree() {
  const { data: categories, isLoading, isError } = useCategories();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading categories</div>;

  const tree = buildTree(categories || []);

  return (
    <div>
      <h2>Categories</h2>
      {tree.length === 0 ? (
        <div>No categories yet</div>
      ) : (
        tree.map((category) => (
          <CategoryItem key={category.id} category={category} />
        ))
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create frontend/src/features/categories/components/CategoryForm.tsx**

```typescript
import { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { useCreateCategory } from '../hooks/useCreateCategory';

export function CategoryForm() {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<number | undefined>(undefined);
  const createCategory = useCreateCategory();
  const { data: categories } = useCategories();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCategory.mutate(
      { name, parent_id: parentId },
      { onSuccess: () => {
        setName('');
        setParentId(undefined);
      }}
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category name"
        required
      />
      <select
        value={parentId ?? ''}
        onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : undefined)}
      >
        <option value="">No parent</option>
        {categories?.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <button type="submit" disabled={createCategory.isPending}>
        {createCategory.isPending ? 'Creating...' : 'Create Category'}
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Create frontend/src/pages/CategoryManagePage.tsx**

```typescript
import { CategoryTree } from '../features/categories/components/CategoryTree';
import { CategoryForm } from '../features/categories/components/CategoryForm';

export function CategoryManagePage() {
  return (
    <div>
      <h1>Manage Categories</h1>
      <CategoryForm />
      <hr />
      <CategoryTree />
    </div>
  );
}
```

- [ ] **Step 5: Commit**

Run:
```bash
git add frontend/src/features/categories/components/CategoryItem.tsx frontend/src/features/categories/components/CategoryTree.tsx frontend/src/features/categories/components/CategoryForm.tsx frontend/src/pages/CategoryManagePage.tsx
git commit -m "feat: add category components and page"
```
