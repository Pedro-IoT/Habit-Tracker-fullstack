import { createLazyFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { ToastContainer, toast } from 'react-toastify';
import postRegister from '../api/postRegister.js';
import '../../public/Login.css';

export const Route = createLazyFileRoute('/register')({
  component: RegisterRoute,
})

function RegisterRoute() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationKey: ['register'],
    mutationFn: function (e) {
      e.preventDefault();
      const formData = new FormData(e.target);
      return postRegister(
        formData.get('name'),
        formData.get('email'),
        formData.get('password'),
      )
    },
    onSuccess: function () {
      navigate({to: "/habits"});
    },
    onError: function () {
      toast.error('Registration failed. Please try again.');
    }
  });

  return (
    <>
      <ToastContainer autoClose={2000} />
      <div className='login-container'>
        <div className='login-card'>
          <h2 className='auth-logo'>Register</h2>
          <form className='form-group' onSubmit={mutation.mutate}>
            <label htmlFor="name">Nome</label>
            <input type="text" name="name" placeholder="Nome" required />
            <label htmlFor="email">Email</label>
            <input type="email" name="email" placeholder="Email" required />
            <label htmlFor="password">Senha</label>
            <input type="password" name="password" placeholder="******" required />
            <button className='submit-btn' type="submit">Register</button>
          </form>
          <div className='auth-footer'>
            <p>Já possui uma conta? <Link to="/login">Faça login</Link>.</p>
          </div>
        </div>
      </div>
    </>
  )
}
