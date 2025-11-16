'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/admin/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-logo">
          <Image src="/lv-logo.png" alt="LV Clicks" width={120} height={60} priority />
        </div>
        <h1>Admin Login</h1>
        <p className="admin-login-subtitle">LV Clicks Portfolio Management</p>

        {error && <div className="admin-error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@lvclicks.com"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="admin-login-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="admin-login-footer">
          <a href="/">← Back to Website</a>
        </div>
      </div>

      <style jsx>{`
        .admin-login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--black) 0%, var(--dark-gray) 50%, var(--brown) 100%);
          padding: 1rem;
        }

        .admin-login-box {
          background: rgba(26, 26, 26, 0.95);
          border: 1px solid var(--gold);
          border-radius: 12px;
          padding: 2rem 1.5rem;
          max-width: 450px;
          width: 100%;
          box-shadow: 0 10px 40px rgba(212, 175, 55, 0.2);
        }

        @media (min-width: 640px) {
          .admin-login-container {
            padding: 2rem;
          }

          .admin-login-box {
            padding: 3rem 2.5rem;
          }
        }

        .admin-login-logo {
          text-align: center;
          margin-bottom: 2rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .admin-login-box h1 {
          font-family: 'Oswald', sans-serif;
          font-size: 1.75rem;
          text-align: center;
          color: var(--gold);
          margin-bottom: 0.5rem;
        }

        @media (min-width: 640px) {
          .admin-login-box h1 {
            font-size: 2.5rem;
          }
        }

        .admin-login-subtitle {
          text-align: center;
          color: rgba(255, 248, 231, 0.7);
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }

        .admin-error-message {
          background: rgba(220, 53, 69, 0.2);
          border: 1px solid rgba(220, 53, 69, 0.5);
          color: #ff6b6b;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .admin-login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .admin-form-group {
          display: flex;
          flex-direction: column;
        }

        .admin-form-group label {
          font-size: 0.9rem;
          color: var(--gold);
          margin-bottom: 0.5rem;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .admin-form-group input {
          padding: 1rem;
          background: rgba(26, 26, 26, 0.8);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: var(--cream);
          font-family: 'Lato', sans-serif;
          font-size: 1rem;
          border-radius: 6px;
          transition: all 0.3s;
        }

        .admin-form-group input:focus {
          outline: none;
          border-color: var(--gold);
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
        }

        .admin-login-button {
          padding: 1.2rem;
          background: var(--gold);
          color: var(--black);
          border: none;
          font-weight: 600;
          font-size: 1rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s;
          border-radius: 6px;
          margin-top: 0.5rem;
        }

        .admin-login-button:hover:not(:disabled) {
          background: var(--light-gold);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
        }

        .admin-login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .admin-login-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(212, 175, 55, 0.2);
        }

        .admin-login-footer a {
          color: var(--gold);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s;
        }

        .admin-login-footer a:hover {
          color: var(--light-gold);
        }
      `}</style>
    </div>
  );
}
