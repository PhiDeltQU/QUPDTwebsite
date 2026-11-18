import { LoginForm } from '@/components/auth/login-form';

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-fraternity-cream px-6 py-16">
      <LoginForm
        scope="admin"
        title="Officer & administrator access"
        description="Sign in with your officer email and the admin password. Ask a current admin to add your email if you are new."
        redirectTo="/admin"
      />
    </main>
  );
}
