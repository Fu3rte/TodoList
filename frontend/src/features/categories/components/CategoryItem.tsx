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