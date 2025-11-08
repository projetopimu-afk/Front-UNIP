
import React, { useState } from 'react';
import { Button, Input, Card } from './components';
import { Role } from './types';
import { api } from './services';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => Promise<void>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
            <img 
                src="https://play-lh.googleusercontent.com/VzUfEzZ2q-y6lWl9liKGTxg7d6Ym5i7yYaHNHZogN8VDrx0RJJ6055mRVUzNMqT7ci9v" 
                alt="UNIP Logo" 
                className="mx-auto h-20 w-auto" 
            />
            <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
              {isRegistering ? 'Crie sua Conta' : 'Acesse o Portal Acadêmico'}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {isRegistering 
                ? 'Preencha os campos para criar seu acesso.'
                : "Utilize seu nome de usuário para entrar."
              }
            </p>
        </div>
        <Card>
          {isRegistering ? (
            <RegisterForm onLogin={onLogin} onSwitchToLogin={() => setIsRegistering(false)} />
          ) : (
            <LoginForm onLogin={onLogin} onSwitchToRegister={() => setIsRegistering(true)} />
          )}
        </Card>
        <p className="mt-6 text-center text-xs text-gray-500">
            Para fins de demonstração, use:<br/>
            Professor: <span className="font-mono">ana.silva</span> | Aluno: <span className="font-mono">bruno.costa</span> | Gestor: <span className="font-mono">carlos.gestor</span><br/>
            (Qualquer senha funciona)
        </p>
      </div>
    </div>
  );
};

// --- Login Form Component ---
const LoginForm: React.FC<{ onLogin: LoginScreenProps['onLogin']; onSwitchToRegister: () => void; }> = ({ onLogin, onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(username, password);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="username"
          label="Nome de usuário"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          id="password"
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Não tem uma conta?{' '}
        <button onClick={onSwitchToRegister} className="font-medium text-primary hover:text-primary-hover">
          Cadastre-se
        </button>
      </p>
    </>
  );
};


// --- Register Form Component ---
const RegisterForm: React.FC<{ onLogin: LoginScreenProps['onLogin']; onSwitchToLogin: () => void; }> = ({ onLogin, onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<Role>(Role.Student);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !username || !password) {
            setError("Todos os campos são obrigatórios.");
            return;
        }
        setError('');
        setLoading(true);
        try {
            await api.createUser({ name, username, role });
            // Auto-login after successful registration
            await onLogin(username, password);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <Input
                    id="name"
                    label="Nome Completo"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <Input
                    id="reg-username"
                    label="Nome de usuário"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <Input
                    id="reg-password"
                    label="Senha"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Eu sou um(a)</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value as Role)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                    >
                        <option value={Role.Student}>Aluno</option>
                        <option value={Role.Teacher}>Professor</option>
                        <option value={Role.Manager}>Gestor</option>
                    </select>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
                Já tem uma conta?{' '}
                <button onClick={onSwitchToLogin} className="font-medium text-primary hover:text-primary-hover">
                    Entrar
                </button>
            </p>
        </>
    );
};


export default LoginScreen;