import { z } from 'zod';
import { apiFetch } from '@/lib/apiClient';

const loginSchema = z.object({
  email: z.email({ message: 'Invalid Credentials' }),
  password: z.string().min(6, { message: 'Invalid Credentials' }),
});

type LoginData = z.infer<typeof loginSchema>;

export async function handleLogin(data: LoginData) {
  try {
    await apiFetch('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    throw new Error('Login failed');
  }
}

export function handleSubmitLogin(
  e: React.SubmitEvent<HTMLFormElement>
): LoginData | Error {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const validation = loginSchema.safeParse(data);
  if (!validation.success) {
    return new Error('Invalid login data');
  }

  return validation.data;
}

const registerSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' }),
});

type RegisterData = z.infer<typeof registerSchema>;

export async function handleRegister(data: RegisterData) {
  try {
    await apiFetch('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    throw new Error('Registration failed');
  }
}

export function handleSubmitRegister(
  e: React.SubmitEvent<HTMLFormElement>
): RegisterData | Error {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    name: formData.get('name') as string,
  };

  const validation = registerSchema.safeParse(data);
  if (!validation.success) {
    return new Error('Invalid registration data');
  }

  return validation.data;
}
