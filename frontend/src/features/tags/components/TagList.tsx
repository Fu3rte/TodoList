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
