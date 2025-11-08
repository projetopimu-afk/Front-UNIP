import React from 'react';
import { User, Role, Student, Teacher, Class, Lesson, Activity, Submission, Manager } from './types';

// Mock Users
// FIX: Changed type from User[] to (Teacher | Student)[] to allow for Student-specific properties like classIds.
export const MOCK_USERS: (Teacher | Student | Manager)[] = [
  { id: 't1', name: 'Prof. Ana Silva', username: 'ana.silva', role: Role.Teacher },
  { id: 'm1', name: 'Gestor Carlos', username: 'carlos.gestor', role: Role.Manager },
  { id: 's1', name: 'Bruno Costa', username: 'bruno.costa', role: Role.Student, classIds: ['c1'] },
  { id: 's2', name: 'Carla Dias', username: 'carla.dias', role: Role.Student, classIds: ['c1', 'c2'] },
  { id: 's3', name: 'Daniel Alves', username: 'daniel.alves', role: Role.Student, classIds: ['c1'] },
  { id: 's4', name: 'Eduarda Lima', username: 'eduarda.lima', role: Role.Student, classIds: ['c2'] },
  { id: 's5', name: 'Felipe Souza', username: 'felipe.souza', role: Role.Student, classIds: ['c2'] },
];

export const MOCK_CLASSES: Class[] = [
  { id: 'c1', name: 'Matemática - 9º Ano A', teacherId: 't1', studentIds: ['s1', 's2', 's3'] },
  { id: 'c2', name: 'Ciências - 9º Ano B', teacherId: 't1', studentIds: ['s2', 's4', 's5'] },
];

export const MOCK_LESSONS: Lesson[] = [
  {
    id: 'l1',
    classId: 'c1',
    date: '2024-07-20',
    topic: 'Introdução a Álgebra',
    attendance: [
      { studentId: 's1', present: true },
      { studentId: 's2', present: true },
      { studentId: 's3', present: false },
    ],
  },
   {
    id: 'l2',
    classId: 'c1',
    date: '2024-07-22',
    topic: 'Equações de Primeiro Grau',
    attendance: [
      { studentId: 's1', present: true },
      { studentId: 's2', present: false },
      { studentId: 's3', present: true },
    ],
  },
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    classId: 'c1',
    title: 'Lista de Exercícios 1',
    description: 'Resolver os exercícios da página 25.',
    dueDate: '2024-07-28',
    fileUrl: 'path/to/file1.pdf',
  },
  {
    id: 'a2',
    classId: 'c2',
    title: 'Relatório de Laboratório',
    description: 'Descrever o experimento sobre fotossíntese.',
    dueDate: '2024-08-05',
  },
];

export const MOCK_SUBMISSIONS: Submission[] = [
    {
        id: 'sub1',
        activityId: 'a1',
        studentId: 's1',
        submittedAt: new Date().toISOString(),
        fileUrl: 'path/to/submission1.pdf'
    },
    {
        id: 'sub2',
        activityId: 'a1',
        studentId: 's3',
        submittedAt: new Date().toISOString(),
        fileUrl: 'path/to/submission3.pdf'
    }
];


// Icons
export const UsersIcon = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.176-5.973" />
  </svg>
);

export const BookOpenIcon = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

export const ClipboardListIcon = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

export const UploadIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export const PlusIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

export const TrashIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const PencilIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

export const UserPlusIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
);