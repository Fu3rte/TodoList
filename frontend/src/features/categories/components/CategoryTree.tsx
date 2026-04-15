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