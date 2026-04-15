# Task 4: Tags Module

> **For agentic workers:** Implement this task step-by-step using superpowers:executing-plans.

**Goal:** 实现标签模块：标签的增删改查、标签徽章展示。

**Files:**
- Create: `frontend/src/features/tags/types/tag.ts`
- Create: `frontend/src/features/tags/services/tagApi.ts`
- Create: `frontend/src/features/tags/hooks/useTags.ts`
- Create: `frontend/src/features/tags/hooks/useCreateTag.ts`
- Create: `frontend/src/features/tags/hooks/useUpdateTag.ts`
- Create: `frontend/src/features/tags/hooks/useDeleteTag.ts`
- Create: `frontend/src/features/tags/components/TagItem.tsx`
- Create: `frontend/src/features/tags/components/TagList.tsx`
- Create: `frontend/src/features/tags/components/TagForm.tsx`
- Create: `frontend/src/features/tags/components/TagBadge.tsx`
- Create: `frontend/src/pages/TagManagePage.tsx`

---

## Task 4.1: Tag 类型定义

- [ ] **Step 1: Create frontend/src/features/tags/types/tag.ts**

```typescript
export interface Tag {
  id: number;
  name: string;
  user_id: number;
  created_at: string;
}

export interface CreateTagInput {
  name: string;
}

export interface UpdateTagInput {
  name?: string;
}
```

- [ ] **Step 2: Commit**

Run:
```bash
git add frontend/src/features/tags/types/tag.ts
git commit -m "feat: add tag types"
```

---

## Task 4.2: Tag API 服务

- [ ] **Step 1: Create frontend/src/features/tags/services/tagApi.ts**

```typescript
import axiosInstance from '../../../shared/lib/axiosInstance';
import type { Tag, CreateTagInput, UpdateTagInput } from '../types/tag';

export const tagApi = {
  getTags: async (): Promise<Tag[]> => {
    const response = await axiosInstance.get<Tag[]>('/api/tags');
    return response.data;
  },

  createTag: async (data: CreateTagInput): Promise<Tag> => {
    const response = await axiosInstance.post<Tag>('/api/tags', data);
    return response.data;
  },

  updateTag: async (id: number, data: UpdateTagInput): Promise<Tag> => {
    const response = await axiosInstance.put<Tag>(`/api/tags/${id}`, data);
    return response.data;
  },

  deleteTag: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/tags/${id}`);
  },
};
```

- [ ] **Step 2: Commit**

Run:
```bash
git add frontend/src/features/tags/services/tagApi.ts
git commit -m "feat: add tag API service"
```

---

## Task 4.3: Tag Hooks

- [ ] **Step 1: Create frontend/src/features/tags/hooks/useTags.ts**

```typescript
import { useQuery } from '@tanstack/react-query';
import { tagApi } from '../services/tagApi';

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => tagApi.getTags(),
  });
}
```

- [ ] **Step 2: Create frontend/src/features/tags/hooks/useCreateTag.ts**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tagApi } from '../services/tagApi';
import type { CreateTagInput } from '../types/tag';

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTagInput) => tagApi.createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}
```

- [ ] **Step 3: Create frontend/src/features/tags/hooks/useUpdateTag.ts**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tagApi } from '../services/tagApi';
import type { UpdateTagInput } from '../types/tag';

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTagInput }) =>
      tagApi.updateTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}
```

- [ ] **Step 4: Create frontend/src/features/tags/hooks/useDeleteTag.ts**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tagApi } from '../services/tagApi';

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tagApi.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}
```

- [ ] **Step 5: Commit**

Run:
```bash
git add frontend/src/features/tags/hooks/useTags.ts frontend/src/features/tags/hooks/useCreateTag.ts frontend/src/features/tags/hooks/useUpdateTag.ts frontend/src/features/tags/hooks/useDeleteTag.ts
git commit -m "feat: add tag hooks"
```

---

## Task 4.4: Tag 组件

- [ ] **Step 1: Create frontend/src/features/tags/components/TagItem.tsx**

```typescript
import { useState } from 'react';
import type { Tag } from '../types/tag';
import { useUpdateTag } from '../hooks/useUpdateTag';
import { useDeleteTag } from '../hooks/useDeleteTag';

interface TagItemProps {
  tag: Tag;
}

export function TagItem({ tag }: TagItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(tag.name);
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();

  const handleUpdate = () => {
    updateTag.mutate(
      { id: tag.id, data: { name } },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const handleDelete = () => {
    if (confirm('Delete this tag?')) {
      deleteTag.mutate(tag.id);
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
          <span>{tag.name}</span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create frontend/src/features/tags/components/TagList.tsx**

```typescript
import { useTags } from '../hooks/useTags';
import { TagItem } from './TagItem';

export function TagList() {
  const { data: tags, isLoading, isError } = useTags();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading tags</div>;

  return (
    <div>
      <h2>Tags</h2>
      {tags?.length === 0 ? (
        <div>No tags yet</div>
      ) : (
        tags?.map((tag) => <TagItem key={tag.id} tag={tag} />)
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create frontend/src/features/tags/components/TagForm.tsx**

```typescript
import { useState } from 'react';
import { useCreateTag } from '../hooks/useCreateTag';

export function TagForm() {
  const [name, setName] = useState('');
  const createTag = useCreateTag();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTag.mutate(
      { name },
      { onSuccess: () => setName('') }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tag name"
        required
      />
      <button type="submit" disabled={createTag.isPending}>
        {createTag.isPending ? 'Creating...' : 'Create Tag'}
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Create frontend/src/features/tags/components/TagBadge.tsx**

```typescript
import type { Tag } from '../types/tag';

interface TagBadgeProps {
  tag: Tag;
}

export function TagBadge({ tag }: TagBadgeProps) {
  return <span>{tag.name}</span>;
}
```

- [ ] **Step 5: Create frontend/src/pages/TagManagePage.tsx**

```typescript
import { TagList } from '../features/tags/components/TagList';
import { TagForm } from '../features/tags/components/TagForm';

export function TagManagePage() {
  return (
    <div>
      <h1>Manage Tags</h1>
      <TagForm />
      <hr />
      <TagList />
    </div>
  );
}
```

- [ ] **Step 6: Commit**

Run:
```bash
git add frontend/src/features/tags/components/TagItem.tsx frontend/src/features/tags/components/TagList.tsx frontend/src/features/tags/components/TagForm.tsx frontend/src/features/tags/components/TagBadge.tsx frontend/src/pages/TagManagePage.tsx
git commit -m "feat: add tag components and page"
```
