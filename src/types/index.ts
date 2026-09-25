export type Role = 'admin' | 'staff' | 'student';

export type Language = 'en' | 'ha' | 'yo' | 'ig' | 'fr' | 'ar' | 'es';

export interface UserSession {
  id: string;
  username: string;
  name: string;
  role: Role;
  email?: string;
  phone?: string;
  assignedClass?: string;
  subjectsTaught?: string[];
  avatar?: string;
}

export interface Staff {
  id: string;
  username: string; // e.g. GSTC/Stf/001
  name: string;
  phone: string;
  email?: string;
  password?: string;
  subjectsTaught: string[]; // e.g. ['English Language', 'Mathematics']
  formTeacherOf: string; // e.g. 'CCS 1' or 'None'
  createdAt: string;
}

export interface ClassRoom {
  id: string;
  name: string; // e.g. 'CCS 1', 'Garment 1'
  department: string; // e.g. 'Computer Studies', 'Vocational / Fashion', 'Science'
  formTeacherName: string;
  studentCount: number;
  capacity: number;
}

export interface Subject {
  id: string;
  code: string; // e.g. 'ENG 101', 'MTH 101'
  name: string; // e.g. 'English Language', 'Mathematics'
  category: 'Core' | 'Vocational / Technical' | 'Science';
  assignedTeachers: string[];
}

export interface Student {
  id: string;
  admissionNo: string; // e.g. GSTC/2025/001
  fullName: string;
  gender: 'Male' | 'Female';
  className: string; // e.g. 'CCS 1'
  dob: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  scratchCardPin?: string;
  status: 'Active' | 'Graduated' | 'Transferred';
}

export interface TeachingAssignment {
  id: string;
  staffId: string;
  staffName: string;
  subjectName: string;
  className: string;
  academicYear: string;
  term: string;
}

export interface SubjectScore {
  subjectName: string;
  ca1: number; // Max 20
  ca2: number; // Max 20
  exam: number; // Max 60
  total: number; // Max 100
  grade: string; // A1, B2, B3, C4, C5, C6, D7, E8, F9
  remark: string; // Distinction, Credit, Pass, Fail
}

export interface StudentResult {
  id: string;
  studentId: string;
  admissionNo: string;
  studentName: string;
  className: string;
  term: string; // 'First Term'
  session: string; // '2025/2026'
  scores: SubjectScore[];
  totalScore: number;
  averageScore: number;
  position: number;
  outOf: number;
  timesSchoolOpened: number;
  timesPresent: number;
  teacherRemarks: string;
  principalRemarks: string;
  nextTermBegins: string;
}

export interface ScratchCard {
  id: string;
  serialNumber: string; // e.g. GSTC-2025-48291
  pin: string; // 12-digit PIN e.g. 4829-1094-8832
  maxUsage: number; // Usually 5
  usageCount: number;
  status: 'active' | 'used' | 'expired';
  usedByAdmissionNo?: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  fullName: string;
  role: 'Super Admin' | 'Exam Officer' | 'Principal' | 'System Admin';
  email: string;
  lastActive: string;
  status: 'Active' | 'Suspended';
}

export interface SchoolSettings {
  schoolName: string;
  subtitle: string;
  motto: string;
  address: string;
  phone: string;
  email: string;
  currentTerm: string;
  currentSession: string;
  nextTermResumption: string;
  principalName: string;
  examOfficerName: string;
}
