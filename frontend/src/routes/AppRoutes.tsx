import { createBrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { TaskListPage } from '../pages/TaskListPage';
import { TaskNewPage } from '../pages/TaskNewPage';
import { TaskDetailPage } from '../pages/TaskDetailPage';
import { TaskEditPage } from '../pages/TaskEditPage';
import { CategoryManagePage } from '../pages/CategoryManagePage';
import { TagManagePage } from '../pages/TagManagePage';

export const router = createBrowserRouter([
  {
    path: AppRoutes.LOGIN,
    element: <LoginPage />,
  },
  {
    path: AppRoutes.REGISTER,
    element: <RegisterPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: AppRoutes.TASKS,
        element: <TaskListPage />,
      },
      {
        path: AppRoutes.TASK_NEW,
        element: <TaskNewPage />,
      },
      {
        path: AppRoutes.TASK_DETAIL,
        element: <TaskDetailPage />,
      },
      {
        path: AppRoutes.TASK_EDIT,
        element: <TaskEditPage />,
      },
      {
        path: AppRoutes.CATEGORIES,
        element: <CategoryManagePage />,
      },
      {
        path: AppRoutes.TAGS,
        element: <TagManagePage />,
      },
    ],
  },
]);
