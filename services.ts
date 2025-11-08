import { MOCK_USERS, MOCK_CLASSES, MOCK_LESSONS, MOCK_ACTIVITIES, MOCK_SUBMISSIONS } from './constants';
import { User, Class, Student, Lesson, Activity, Submission, Role, Teacher, Manager } from './types';

// NOTE: In a real app, this would be a class with methods that make API calls.
// Here, we're just manipulating in-memory arrays to simulate a backend.

let users: (Student | Teacher | Manager)[] = [...MOCK_USERS];
let classes = [...MOCK_CLASSES];
let lessons = [...MOCK_LESSONS];
let activities = [...MOCK_ACTIVITIES];
let submissions = [...MOCK_SUBMISSIONS];

export const api = {
  // Auth
  login: async (username: string, password_unused: string): Promise<User | null> => {
    // In a real app, you'd validate the password.
    const user = users.find(u => u.username === username);
    return user ? { ...user } : null;
  },
  
  getAllUsers: async (): Promise<User[]> => {
    return [...users];
  },

  createUser: async (userData: { name: string, username: string, role: Role }): Promise<User> => {
    const existingUser = users.find(u => u.username === userData.username);
    if (existingUser) {
      throw new Error('Nome de usuário já existe.');
    }

    const baseUser = {
      id: `u${Date.now()}`,
      name: userData.name,
      username: userData.username,
    };

    let newUser: User;

    if (userData.role === Role.Student) {
      newUser = {
        ...baseUser,
        role: Role.Student,
        classIds: []
      } as Student;
    } else if (userData.role === Role.Teacher) {
      newUser = {
        ...baseUser,
        role: Role.Teacher
      } as Teacher;
    } else {
       newUser = {
        ...baseUser,
        role: Role.Manager
      } as Manager;
    }
    
    users.push(newUser as Student | Teacher | Manager);
    return newUser;
  },


  // Teachers
  getClassesByTeacher: async (teacherId: string): Promise<Class[]> => {
    return classes.filter(c => c.teacherId === teacherId);
  },
  
  createClass: async (name: string, teacherId: string): Promise<Class> => {
    const newClass: Class = {
      id: `c${Date.now()}`,
      name,
      teacherId,
      studentIds: [],
    };
    classes.push(newClass);
    return newClass;
  },
  
  updateClass: async (classId: string, name: string): Promise<Class | null> => {
    const classIndex = classes.findIndex(c => c.id === classId);
    if (classIndex === -1) return null;
    classes[classIndex].name = name;
    return classes[classIndex];
  },

  deleteClass: async (classId: string): Promise<boolean> => {
      const initialLength = classes.length;
      classes = classes.filter(c => c.id !== classId);
      // Also remove this class from students
      users.forEach(user => {
          if ('classIds' in user) {
              (user as Student).classIds = (user as Student).classIds.filter(id => id !== classId);
          }
      });
      return classes.length < initialLength;
  },


  getStudentsInClass: async (classId: string): Promise<Student[]> => {
    const classInfo = classes.find(c => c.id === classId);
    if (!classInfo) return [];
    return users.filter(u => u.role === Role.Student && classInfo.studentIds.includes(u.id)) as Student[];
  },

  getAllStudents: async (): Promise<Student[]> => {
    return users.filter(u => u.role === 'STUDENT') as Student[];
  },

  addStudentToClass: async (classId: string, studentId: string): Promise<boolean> => {
    const classInfo = classes.find(c => c.id === classId);
    if (!classInfo || classInfo.studentIds.includes(studentId)) return false;
    classInfo.studentIds.push(studentId);
    
    const student = users.find(u => u.id === studentId) as Student;
    if (student && !student.classIds.includes(classId)) {
        student.classIds.push(classId);
    }
    return true;
  },

  removeStudentFromClass: async (classId: string, studentId: string): Promise<boolean> => {
    const classInfo = classes.find(c => c.id === classId);
    if (!classInfo) return false;
    classInfo.studentIds = classInfo.studentIds.filter(id => id !== studentId);

    const student = users.find(u => u.id === studentId) as Student;
    if (student) {
        student.classIds = student.classIds.filter(id => id !== classId);
    }
    return true;
  },
  
  getLessonsByClass: async(classId: string): Promise<Lesson[]> => {
      return lessons.filter(l => l.classId === classId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  
  createLesson: async (lesson: Omit<Lesson, 'id'>): Promise<Lesson> => {
      const newLesson: Lesson = { ...lesson, id: `l${Date.now()}` };
      lessons.push(newLesson);
      return newLesson;
  },
  
  getActivitiesByClass: async(classId: string): Promise<Activity[]> => {
      return activities.filter(a => a.classId === classId);
  },
  
  createActivity: async (activity: Omit<Activity, 'id'>): Promise<Activity> => {
      const newActivity: Activity = { ...activity, id: `a${Date.now()}` };
      activities.push(newActivity);
      return newActivity;
  },
  
  getSubmissionsForActivity: async (activityId: string): Promise<Submission[]> => {
      return submissions.filter(s => s.activityId === activityId);
  },

  // Students
  getClassesByStudent: async (studentId: string): Promise<Class[]> => {
      const student = users.find(u => u.id === studentId) as Student;
      if (!student) return [];
      return classes.filter(c => student.classIds.includes(c.id));
  },

  getSubmissionForActivity: async (activityId: string, studentId: string): Promise<Submission | undefined> => {
    return submissions.find(s => s.activityId === activityId && s.studentId === studentId);
  },

  submitActivity: async (submission: Omit<Submission, 'id'>): Promise<Submission> => {
    const newSubmission: Submission = { ...submission, id: `sub${Date.now()}` };
    submissions.push(newSubmission);
    return newSubmission;
  }
};