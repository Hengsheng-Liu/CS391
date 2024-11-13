import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { useAuth } from '@/contexts/UserContext';

export default function LoginPage() {
  const [signUp, setSignUp] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser } = useAuth();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(''); 

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const confirmPassword = formData.get('ConfirmPassword') as string;

    if (signUp && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, signUp }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Error during authentication');
      }
      setUser(data);
      router.push('/');
    } catch (error: any) {
      setError(error.message);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      {signUp && <input type="text" name="name" placeholder="Name" required />}
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      {signUp && <input type="password" name="ConfirmPassword" placeholder="Confirm Password" required />}
      <button type="submit">{signUp ? 'Sign Up' : 'Log In'}</button>
      <button onClick={() => setSignUp(!signUp)} type="button">
        {signUp ? 'Log In' : 'New User'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
