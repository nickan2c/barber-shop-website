'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFirebase } from '../../contexts/FirebaseContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();
  const { signIn, signUp } = useFirebase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      router.push('/book'); // Redirect back to booking page after successful login
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="main-layout">
      <nav className="nav">
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            Classic Cuts
          </Link>
          <div className="nav-links">
            <Link href="/services" className="nav-link">Services</Link>
            <Link href="/book" className="nav-link">Book Now</Link>
          </div>
        </div>
      </nav>

      <main className="container auth-page">
        <div className="auth-container">
          <h1 className="auth-title">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h1>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <button type="submit" className="btn btn-primary auth-button">
              {isRegistering ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="auth-switch">
            <p>
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}
              <button
                className="auth-switch-button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                }}
              >
                {isRegistering ? 'Sign In' : 'Create Account'}
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 