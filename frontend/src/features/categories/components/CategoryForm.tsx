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