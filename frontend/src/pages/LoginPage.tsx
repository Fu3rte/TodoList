import { LoginForm } from '../features/auth/components/LoginForm';

export function LoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
