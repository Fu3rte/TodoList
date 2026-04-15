import { useState } from 'react';
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
