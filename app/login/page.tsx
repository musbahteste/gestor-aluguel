"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log('[login] submitting', { username: !!username, password: !!password });
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      console.log('[login] response status', res.status);
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.log('[login] error body', body);
        setError(body?.error || 'Erro ao autenticar');
        setLoading(false);
        return;
      }
      console.log('[login] success', body);
      // Redirect immediately to dashboard after successful login
      router.push('/dashboard');
    } catch (err) {
      console.error('[login] network error', err);
      setError('Erro de rede');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container">
      <div style={{ maxWidth: 480, margin: '80px auto' }} className="ui-card">
        <h1 className="ui-card-title">Entrar</h1>
        <form className="ui-form" onSubmit={handleSubmit}>
          <div className="ui-form-field">
            <label className="ui-label">Usuário</label>
            <input className="ui-input" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="ui-form-field">
            <label className="ui-label">Senha</label>
            <input className="ui-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <div style={{ color: 'var(--color-danger)' }}>{error}</div>}
          <div style={{ marginTop: 12 }}>
            <button className="ui-button" type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
