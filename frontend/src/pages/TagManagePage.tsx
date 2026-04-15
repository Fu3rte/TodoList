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
