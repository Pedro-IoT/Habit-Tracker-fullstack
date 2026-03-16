import LoginForm from '@/features/auth/components/Login/LoginForm';
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/login')({
  component: LoginPage,
})



function LoginPage() {
  return (
    <div className="login-page">
      <LoginForm />
    </div>
  )
}
