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
