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
