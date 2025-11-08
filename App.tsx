
import React, { useState, createContext, useContext, useMemo } from 'react';
import { User, Role } from './types';
import { api } from './services';
import LoginScreen from './LoginScreen';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import { Header } from './components';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const authContextValue = useMemo(() => ({
    user,
    login: async (username: string, password: string) => {
      const loggedInUser = await api.login(username, password);
      if (loggedInUser) {
        setUser(loggedInUser);
      } else {
        throw new Error('Usuário ou senha inválidos.');
      }
    },
    logout: () => {
      setUser(null);
    },
  }), [user]);

  return (
    <AuthContext.Provider value={authContextValue}>
      <Main />
    </AuthContext.Provider>
  );
};

const Main: React.FC = () => {
  const { user, login, logout } = useAuth();

  if (!user) {
    return <LoginScreen onLogin={login} />;
  }
  
  const renderDashboard = () => {
    switch(user.role) {
      case Role.Teacher:
      case Role.Manager:
        return <TeacherDashboard user={user} />;
      case Role.Student:
        return <StudentDashboard user={user} />;
      default:
        return <div>Papel de usuário desconhecido.</div>;
    }
  }

  return (
    <div>
        <Header user={user} onLogout={logout} />
        {renderDashboard()}
    </div>
  );
};

export default App;