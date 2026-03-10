import { createLazyFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import postLogin from '../api/postLogin.js';
import { toast, ToastContainer } from 'react-toastify';
import '../../public/Login.css'

export const Route = createLazyFileRoute('/login')({
  component: LoginRoute,
})

function LoginRoute() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationKey: ['login'],
    mutationFn: function (e) {
      e.preventDefault();
      const formData = new FormData(e.target);
      return postLogin(
        formData.get('email'),
        formData.get('password'),
      )
    },
    onSuccess: function () {
      navigate({to: "/habits"});
    },
    onError: function () {
      toast.error('Login failed. Please check your credentials and try again.');
    }
  });

  return (
    <>
      <ToastContainer autoClose={2000} />
      <div className='login-container'>
        <div className='login-card'>
          <h2 className='auth-logo'>Login</h2>
          <form className='form-group' onSubmit={mutation.mutate}>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" placeholder="Email" required />
            <label htmlFor="password">Senha</label>
            <input type="password" name="password" placeholder="******" required />
            <button className='submit-btn' type="submit">Entrar</button>
          </form>
          <div className='auth-footer'>
            <p>Ainda não faz parte? <Link to="/register">Criar Conta</Link></p>
          </div>
        </div>
      </div>
    </>
  )
}
