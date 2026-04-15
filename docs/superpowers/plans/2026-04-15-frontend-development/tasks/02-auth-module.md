# Task 2: Auth Module

> **For agentic workers:** Implement this task step-by-step using superpowers:executing-plans.

**Goal:** 实现认证模块：用户注册、登录、Token 刷新、用户信息获取。

**Files:**
- Create: `frontend/src/features/auth/types/auth.ts`
- Create: `frontend/src/features/auth/services/authApi.ts`
- Create: `frontend/src/features/auth/hooks/useLogin.ts`
- Create: `frontend/src/features/auth/hooks/useRegister.ts`
- Create: `frontend/src/features/auth/hooks/useAuth.ts`
- Create: `frontend/src/features/auth/components/LoginForm.tsx`
- Create: `frontend/src/features/auth/components/RegisterForm.tsx`
- Create: `frontend/src/pages/LoginPage.tsx`
- Create: `frontend/src/pages/RegisterPage.tsx`

---

## Task 2.1: Auth 类型定义

- [ ] **Step 1: Create frontend/src/features/auth/types/auth.ts**

```typescript
export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}
```

- [ ] **Step 2: Commit**

Run:
```bash
git add frontend/src/features/auth/types/auth.ts
git commit -m "feat: add auth types"
```

---

## Task 2.2: Auth API 服务

- [ ] **Step 1: Create frontend/src/features/auth/services/authApi.ts**

```typescript
import axiosInstance from '../../../shared/lib/axiosInstance';
import type { User, AuthTokens, LoginCredentials, RegisterData } from '../types/auth';

export const authApi = {
  register: async (data: RegisterData): Promise<User> => {
    const response = await axiosInstance.post<User>('/api/auth/register', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    const response = await axiosInstance.post<AuthTokens>('/api/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await axiosInstance.post<AuthTokens>('/api/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/api/auth/me');
    return response.data;
  },
};
```

- [ ] **Step 2: Commit**

Run:
```bash
git add frontend/src/features/auth/services/authApi.ts
git commit -m "feat: add auth API service"
```

---

## Task 2.3: Auth Hooks

- [ ] **Step 1: Create frontend/src/features/auth/hooks/useLogin.ts**

```typescript
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { useAuthStore } from '../../../stores/authStore';
import type { LoginCredentials } from '../types/auth';

export function useLogin() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: async (data) => {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      const user = await authApi.getMe();
      setUser(user);
      navigate('/');
    },
  });
}
```

- [ ] **Step 2: Create frontend/src/features/auth/hooks/useRegister.ts**

```typescript
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';
import type { RegisterData } from '../types/auth';

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: () => {
      navigate('/login');
    },
  });
}
```

- [ ] **Step 3: Create frontend/src/features/auth/hooks/useAuth.ts**

```typescript
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../services/authApi';
import { useAuthStore } from '../../../stores/authStore';

export function useAuth() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authApi.getMe(),
    enabled: isAuthenticated,
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
```

- [ ] **Step 4: Commit**

Run:
```bash
git add frontend/src/features/auth/hooks/useLogin.ts frontend/src/features/auth/hooks/useRegister.ts frontend/src/features/auth/hooks/useAuth.ts
git commit -m "feat: add auth hooks"
```

---

## Task 2.4: Auth 页面组件

- [ ] **Step 1: Create frontend/src/features/auth/components/LoginForm.tsx**

```typescript
import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={login.isPending}>
        {login.isPending ? 'Logging in...' : 'Login'}
      </button>
      {login.isError && <div>Login failed</div>}
    </form>
  );
}
```

- [ ] **Step 2: Create frontend/src/features/auth/components/RegisterForm.tsx**

```typescript
import { useState } from 'react';
import { useRegister } from '../hooks/useRegister';

export function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const register = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate({ username, email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={register.isPending}>
        {register.isPending ? 'Registering...' : 'Register'}
      </button>
      {register.isError && <div>Registration failed</div>}
    </form>
  );
}
```

- [ ] **Step 3: Create frontend/src/pages/LoginPage.tsx**

```typescript
import { LoginForm } from '../features/auth/components/LoginForm';

export function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <LoginForm />
    </div>
  );
}
```

- [ ] **Step 4: Create frontend/src/pages/RegisterPage.tsx**

```typescript
import { RegisterForm } from '../features/auth/components/RegisterForm';

export function RegisterPage() {
  return (
    <div>
      <h1>Register</h1>
      <RegisterForm />
    </div>
  );
}
```

- [ ] **Step 5: Commit**

Run:
```bash
git add frontend/src/features/auth/components/LoginForm.tsx frontend/src/features/auth/components/RegisterForm.tsx frontend/src/pages/LoginPage.tsx frontend/src/pages/RegisterPage.tsx
git commit -m "feat: add login and register pages"
```
