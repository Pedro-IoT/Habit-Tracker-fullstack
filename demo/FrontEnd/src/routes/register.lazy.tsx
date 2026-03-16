import RegisterForm from '@/features/auth/components/Register/RegisterForm';
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/register')({
  component: RegisterPage,
})





function RegisterPage() {
  return (
    <div className="register-page">
      <RegisterForm />
    </div>
  )

}
