import type { Tag } from '../types/tag';

interface TagBadgeProps {
  tag: Tag;
}

export function TagBadge({ tag }: TagBadgeProps) {
  return <span>{tag.name}</span>;
}
