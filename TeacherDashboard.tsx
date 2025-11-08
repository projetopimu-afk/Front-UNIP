import React, { useState, useEffect, useCallback } from 'react';
import { User, Class, Student, Lesson, Activity, Submission, Role } from './types';
import { api } from './services';
import { Button, Card, Input, Modal, Spinner } from './components';
import { BookOpenIcon, ClipboardListIcon, UsersIcon, PlusIcon, PencilIcon, TrashIcon, UserPlusIcon } from './constants';

type TeacherView = 'classes' | 'lessons' | 'activities' | 'users';

const TeacherDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [view, setView] = useState<TeacherView>('classes');

  const renderContent = () => {
    switch (view) {
      case 'classes': return <ClassManager teacherId={user.id} />;
      case 'lessons': return <LessonManager teacherId={user.id} />;
      case 'activities': return <ActivityManager teacherId={user.id} />;
      case 'users': return <UserManager />;
      default: return <ClassManager teacherId={user.id} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <nav className="md:w-64 bg-surface p-4 shadow-lg md:min-h-screen">
        <h2 className="text-lg font-bold text-on-surface mb-6">Painel de {user.role === Role.Manager ? 'Gestão' : 'Professor'}</h2>
        <ul>
          <SidebarItem icon={<UsersIcon />} label="Turmas e Alunos" isActive={view === 'classes'} onClick={() => setView('classes')} />
          <SidebarItem icon={<BookOpenIcon />} label="Diário Eletrônico" isActive={view === 'lessons'} onClick={() => setView('lessons')} />
          <SidebarItem icon={<ClipboardListIcon />} label="Atividades" isActive={view === 'activities'} onClick={() => setView('activities')} />
          <SidebarItem icon={<UserPlusIcon />} label="Gerenciar Usuários" isActive={view === 'users'} onClick={() => setView('users')} />
        </ul>
      </nav>
      <main className="flex-1 p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

// Sidebar Item Component
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}
const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, onClick }) => (
  <li className="mb-2">
    <button
      onClick={onClick}
      className={`w-full flex items-center p-3 rounded-lg text-left transition-colors duration-200 ${
        isActive ? 'bg-primary text-white' : 'hover:bg-gray-200 text-gray-700'
      }`}
    >
      {icon}
      <span className="ml-3 font-medium">{label}</span>
    </button>
  </li>
);


// Class Manager Component
const ClassManager: React.FC<{ teacherId: string }> = ({ teacherId }) => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [allStudents, setAllStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [isClassModalOpen, setClassModalOpen] = useState(false);
    const [isStudentModalOpen, setStudentModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<Class | null>(null);
    const [newClassName, setNewClassName] = useState('');
    const [studentToAdd, setStudentToAdd] = useState('');

    const fetchClasses = useCallback(async () => {
        setLoading(true);
        const fetchedClasses = await api.getClassesByTeacher(teacherId);
        setClasses(fetchedClasses);
        setLoading(false);
    }, [teacherId]);

    useEffect(() => {
        fetchClasses();
        api.getAllStudents().then(setAllStudents);
    }, [fetchClasses]);

    useEffect(() => {
        if (selectedClass) {
            api.getStudentsInClass(selectedClass.id).then(setStudents);
        } else {
            setStudents([]);
        }
    }, [selectedClass]);

    const handleSaveClass = async () => {
        if (editingClass) {
            await api.updateClass(editingClass.id, newClassName);
        } else {
            await api.createClass(newClassName, teacherId);
        }
        await fetchClasses();
        closeClassModal();
    };

    const handleDeleteClass = async (classId: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta turma?')) {
            await api.deleteClass(classId);
            if(selectedClass?.id === classId) setSelectedClass(null);
            await fetchClasses();
        }
    }

    const handleAddStudent = async () => {
        if (selectedClass && studentToAdd) {
            await api.addStudentToClass(selectedClass.id, studentToAdd);
            const updatedStudents = await api.getStudentsInClass(selectedClass.id);
            setStudents(updatedStudents);
            closeStudentModal();
        }
    };
    
    const handleRemoveStudent = async (studentId: string) => {
        if (selectedClass && window.confirm('Remover este aluno da turma?')) {
            await api.removeStudentFromClass(selectedClass.id, studentId);
            const updatedStudents = await api.getStudentsInClass(selectedClass.id);
            setStudents(updatedStudents);
        }
    };

    const openClassModal = (cls: Class | null = null) => {
        setEditingClass(cls);
        setNewClassName(cls ? cls.name : '');
        setClassModalOpen(true);
    };

    const closeClassModal = () => {
        setClassModalOpen(false);
        setEditingClass(null);
        setNewClassName('');
    };
    
    const openStudentModal = () => setStudentModalOpen(true);
    const closeStudentModal = () => {
        setStudentModalOpen(false);
        setStudentToAdd('');
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gerenciamento de Turmas</h1>
                <Button onClick={() => openClassModal()}><PlusIcon className="w-5 h-5 mr-2" /> Nova Turma</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Minhas Turmas</h2>
                        {classes.length === 0 ? <p>Nenhuma turma cadastrada.</p> : (
                            <ul className="space-y-2">
                                {classes.map(cls => (
                                    <li key={cls.id} 
                                        onClick={() => setSelectedClass(cls)}
                                        className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${selectedClass?.id === cls.id ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                    >
                                        <span>{cls.name}</span>
                                        <div>
                                            <button onClick={(e) => {e.stopPropagation(); openClassModal(cls)}} className="p-1 hover:text-blue-400"><PencilIcon className="w-4 h-4" /></button>
                                            <button onClick={(e) => {e.stopPropagation(); handleDeleteClass(cls.id)}} className="p-1 hover:text-red-400"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>
                </div>
                <div className="md:col-span-2">
                    {selectedClass ? (
                        <Card>
                             <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Alunos em {selectedClass.name}</h2>
                                <Button onClick={openStudentModal} variant="secondary"><PlusIcon className="w-5 h-5 mr-2" /> Adicionar Aluno</Button>
                            </div>
                            {students.length === 0 ? <p>Nenhum aluno nesta turma.</p> : (
                                <ul className="divide-y divide-gray-200">
                                    {students.map(std => (
                                        <li key={std.id} className="py-3 flex justify-between items-center">
                                            <span>{std.name}</span>
                                            <Button onClick={() => handleRemoveStudent(std.id)} variant="danger">Remover</Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card>
                    ) : <Card><p className="text-center text-gray-500">Selecione uma turma para ver os alunos.</p></Card>}
                </div>
            </div>

             <Modal isOpen={isClassModalOpen} onClose={closeClassModal} title={editingClass ? 'Editar Turma' : 'Nova Turma'}>
                <div className="space-y-4">
                    <Input label="Nome da Turma" value={newClassName} onChange={e => setNewClassName(e.target.value)} />
                    <div className="flex justify-end space-x-2">
                        <Button variant="ghost" onClick={closeClassModal}>Cancelar</Button>
                        <Button onClick={handleSaveClass}>Salvar</Button>
                    </div>
                </div>
            </Modal>
            
            <Modal isOpen={isStudentModalOpen} onClose={closeStudentModal} title="Adicionar Aluno">
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Selecione o Aluno</label>
                    <select
                        value={studentToAdd}
                        onChange={e => setStudentToAdd(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                    >
                        <option value="">-- Selecione um aluno --</option>
                        {allStudents
                            .filter(s => !selectedClass?.studentIds.includes(s.id))
                            .map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                        }
                    </select>
                     <div className="flex justify-end space-x-2">
                        <Button variant="ghost" onClick={closeStudentModal}>Cancelar</Button>
                        <Button onClick={handleAddStudent}>Adicionar</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};


// User Manager Component
const UserManager: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', username: '', role: Role.Student });
    const [error, setError] = useState('');

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const allUsers = await api.getAllUsers();
            setUsers(allUsers);
        } catch (err) {
            setError('Falha ao carregar usuários.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);
    
    const handleOpenModal = () => {
        setNewUser({ name: '', username: '', role: Role.Student });
        setError('');
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSaveUser = async () => {
        if (!newUser.name || !newUser.username) {
            setError('Nome e nome de usuário são obrigatórios.');
            return;
        }
        setError('');
        try {
            await api.createUser(newUser);
            await fetchUsers();
            handleCloseModal();
        } catch (err) {
            setError((err as Error).message);
        }
    };

    const getRoleStyle = (role: Role) => {
        switch (role) {
            case Role.Teacher: return 'bg-blue-100 text-blue-800';
            case Role.Student: return 'bg-green-100 text-green-800';
            case Role.Manager: return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    const getRoleName = (role: Role) => {
        switch (role) {
            case Role.Teacher: return 'Professor';
            case Role.Student: return 'Aluno';
            case Role.Manager: return 'Gestor';
            default: return 'Desconhecido';
        }
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
                <Button onClick={handleOpenModal}><PlusIcon className="w-5 h-5 mr-2" /> Novo Usuário</Button>
            </div>
            <Card>
                {users.length === 0 ? <p>Nenhum usuário no sistema.</p> : (
                    <ul className="divide-y divide-gray-200">
                        {users.map(user => (
                            <li key={user.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-sm text-gray-500">@{user.username}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold leading-5 rounded-full ${getRoleStyle(user.role)}`}>
                                    {getRoleName(user.role)}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Cadastrar Novo Usuário">
                <div className="space-y-4">
                    {error && <p className="text-red-500 text-sm bg-red-100 p-2 rounded">{error}</p>}
                    <Input 
                        label="Nome Completo" 
                        value={newUser.name} 
                        onChange={e => setNewUser({ ...newUser, name: e.target.value })} 
                        required
                    />
                    <Input 
                        label="Nome de Usuário" 
                        value={newUser.username} 
                        onChange={e => setNewUser({ ...newUser, username: e.target.value })} 
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Função</label>
                        <select
                            value={newUser.role}
                            onChange={e => setNewUser({ ...newUser, role: e.target.value as Role })}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        >
                            <option value={Role.Student}>Aluno</option>
                            <option value={Role.Teacher}>Professor</option>
                            <option value={Role.Manager}>Gestor</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                        <Button variant="ghost" onClick={handleCloseModal}>Cancelar</Button>
                        <Button onClick={handleSaveUser}>Salvar</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

// Dummy Components for other views
const LessonManager: React.FC<{ teacherId: string }> = ({ teacherId }) => <Card><h1 className="text-3xl font-bold">Diário Eletrônico</h1><p>Funcionalidade em desenvolvimento.</p></Card>;
const ActivityManager: React.FC<{ teacherId: string }> = ({ teacherId }) => <Card><h1 className="text-3xl font-bold">Gerenciamento de Atividades</h1><p>Funcionalidade em desenvolvimento.</p></Card>;

export default TeacherDashboard;