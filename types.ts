
export enum Role {
  Teacher = 'TEACHER',
  Student = 'STUDENT',
  Manager = 'MANAGER',
}

export interface User {
  id: string;
  name: string;
  username: string;
  role: Role;
}

export interface Student extends User {
  role: Role.Student;
  classIds: string[];
}

export interface Teacher extends User {
  role: Role.Teacher;
}

export interface Manager extends User {
  role: Role.Manager;
}

export interface Class {
  id: string;
  name: string;
  teacherId: string;
  studentIds: string[];
}

export interface Attendance {
  studentId: string;
  present: boolean;
}

export interface Lesson {
  id: string;
  classId: string;
  date: string; // YYYY-MM-DD
  topic: string;
  attendance: Attendance[];
}

export interface Activity {
  id: string;
  classId: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  fileUrl?: string;
}

export interface Submission {
  id: string;
  activityId: string;
  studentId: string;
  submittedAt: string; // ISO String
  fileUrl: string;
  grade?: number;
}