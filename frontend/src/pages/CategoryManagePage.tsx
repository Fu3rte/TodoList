import { CategoryTree } from '../features/categories/components/CategoryTree';
import { CategoryForm } from '../features/categories/components/CategoryForm';

export function CategoryManagePage() {
  return (
    <div>
      <h1>Manage Categories</h1>
      <CategoryForm />
      <hr />
      <CategoryTree />
    </div>
  );
}