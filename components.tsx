
import React, { ReactNode } from 'react';
import { User, Role } from './types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-hover focus:ring-primary',
    secondary: 'bg-secondary hover:bg-secondary-hover focus:ring-secondary',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-gray-200 text-gray-700 border border-gray-300',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      id={id}
      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
      {...props}
    />
  </div>
);

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={`bg-surface rounded-lg shadow p-6 ${className}`}>
    {children}
  </div>
);


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-on-surface">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};


interface HeaderProps {
    user: User;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
    const getRoleName = (role: Role) => {
        switch (role) {
            case Role.Teacher: return 'Professor(a)';
            case Role.Student: return 'Aluno(a)';
            case Role.Manager: return 'Gestor(a)';
            default: return 'Usuário';
        }
    };

    return (
        <header className="bg-surface shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                         <img 
                            src="https://play-lh.googleusercontent.com/VzUfEzZ2q-y6lWl9liKGTxg7d6Ym5i7yYaHNHZogN8VDrx0RJJ6055mRVUzNMqT7ci9v" 
                            alt="UNIP Logo"
                            className="h-10 w-auto"
                         />
                        <span className="ml-3 text-xl font-bold text-primary">UNIP</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="font-semibold text-on-surface">{user.name}</p>
                            <p className="text-sm text-on-surface-secondary">
                              {getRoleName(user.role)}
                            </p>
                        </div>
                        <Button onClick={onLogout} variant="ghost">Sair</Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export const Spinner: React.FC = () => (
    <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
);