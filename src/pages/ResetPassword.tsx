import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Placeholder service – replace with real API call
const resetPassword = async (token: string, newPassword: string) => {
  const response = await fetch('/api/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password: newPassword })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Failed to reset password');
  }
};

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // The reset token is often passed via hash fragment: #access_token=XYZ
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/access_token=([^&]*)/);
    if (match) setToken(decodeURIComponent(match[1]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password !== confirmPassword) {
      toast.error('Senhas não coincidem ou vazias');
      return;
    }
    if (!token) {
      toast.error('Token de redefinição ausente');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      toast.success('Senha redefinida com sucesso');
      navigate('/login');
    } catch (err) {
      toast.error('Falha ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full space-y-4 rounded-lg bg-white p-6 shadow-lg"
      >
        <h1 className="text-center text-2xl font-bold">Redefinir Senha</h1>
        <div className="space-y-2">
          <Label htmlFor="password">Nova Senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Redefinir
        </Button>
      </form>
    </div>
  );
}
export default ResetPassword;
