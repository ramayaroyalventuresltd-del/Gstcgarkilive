import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Staff,
  ClassRoom,
  Subject,
  Student,
  TeachingAssignment,
  ScratchCard,
  StudentResult,
  AdminUser,
  SchoolSettings,
} from '../types';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';

interface DataContextType {
  staffList: Staff[];
  classList: ClassRoom[];
  subjectList: Subject[];
  studentList: Student[];
  assignmentList: TeachingAssignment[];
  scratchCards: ScratchCard[];
  resultsList: StudentResult[];
  adminList: AdminUser[];
  settings: SchoolSettings;
  toastMessage: string | null;
  isFirebaseSynced: boolean;
  addStaff: (data: Omit<Staff, 'id' | 'username' | 'createdAt'>) => Promise<string>;
  deleteStaff: (id: string) => Promise<void>;
  addClass: (name: string, department: string, capacity?: number) => Promise<void>;
  addSubject: (name: string, code: string, category: Subject['category']) => Promise<void>;
  addStudent: (data: Omit<Student, 'id' | 'admissionNo' | 'status'>) => Promise<string>;
  generateScratchCards: (count?: number) => Promise<void>;
  verifyScratchCard: (admissionNo: string, pin: string) => { valid: boolean; message: string; result?: StudentResult };
  saveResult: (result: StudentResult) => Promise<void>;
  updateSettings: (newSettings: Partial<SchoolSettings>) => Promise<void>;
  showToast: (msg: string) => void;
  resetToInitialDemo: () => Promise<void>;
}

const INITIAL_CLASSES: ClassRoom[] = [
  {
    id: 'cls-01',
    name: 'Garment 1',
    department: 'Vocational / Fashion Design',
    formTeacherName: 'None',
    studentCount: 0,
    capacity: 35,
  },
  {
    id: 'cls-02',
    name: 'CCS 1',
    department: 'Computer Craft Studies',
    formTeacherName: 'Yahaya',
    studentCount: 1,
    capacity: 40,
  },
];

const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-01',
    code: 'MTH 101',
    name: 'Mathematics',
    category: 'Core',
    assignedTeachers: [],
  },
  {
    id: 'sub-02',
    code: 'ENG 101',
    name: 'English Language',
    category: 'Core',
    assignedTeachers: ['Yahaya'],
  },
  {
    id: 'sub-03',
    code: 'CCS 101',
    name: 'Computer Craft Studies',
    category: 'Vocational / Technical',
    assignedTeachers: [],
  },
  {
    id: 'sub-04',
    code: 'TD 101',
    name: 'Technical Drawing',
    category: 'Vocational / Technical',
    assignedTeachers: [],
  },
];

const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-001',
    admissionNo: 'GSTC/2025/001',
    fullName: 'Amina Bello',
    gender: 'Female',
    className: 'CCS 1',
    dob: '2009-04-14',
    guardianName: 'Mallam Bello Garba',
    guardianPhone: '0803 456 7890',
    address: 'Plot 14, Area 10, Garki, Abuja',
    scratchCardPin: '9842-1049-5521',
    status: 'Active',
  },
];

const INITIAL_SCRATCH_CARDS: ScratchCard[] = [
  {
    id: 'crd-01',
    serialNumber: 'GSTC-2025-009842',
    pin: '9842-1049-5521',
    maxUsage: 5,
    usageCount: 1,
    status: 'active',
    usedByAdmissionNo: 'GSTC/2025/001',
    createdAt: '2026-09-01',
  },
  {
    id: 'crd-02',
    serialNumber: 'GSTC-2025-004312',
    pin: '7412-8820-3341',
    maxUsage: 5,
    usageCount: 0,
    status: 'active',
    createdAt: '2026-09-05',
  },
  {
    id: 'crd-03',
    serialNumber: 'GSTC-2025-007739',
    pin: '5561-9014-2287',
    maxUsage: 5,
    usageCount: 0,
    status: 'active',
    createdAt: '2026-09-10',
  },
];

const INITIAL_RESULTS: StudentResult[] = [
  {
    id: 'res-001',
    studentId: 'std-001',
    admissionNo: 'GSTC/2025/001',
    studentName: 'Amina Bello',
    className: 'CCS 1',
    term: 'First Term',
    session: '2025/2026',
    scores: [
      { subjectName: 'English Language', ca1: 18, ca2: 17, exam: 52, total: 87, grade: 'A1', remark: 'Distinction' },
      { subjectName: 'Mathematics', ca1: 16, ca2: 15, exam: 48, total: 79, grade: 'A1', remark: 'Distinction' },
      { subjectName: 'Computer Craft Studies', ca1: 19, ca2: 18, exam: 55, total: 92, grade: 'A1', remark: 'Excellent' },
      { subjectName: 'Technical Drawing', ca1: 14, ca2: 15, exam: 44, total: 73, grade: 'B2', remark: 'Very Good' },
    ],
    totalScore: 331,
    averageScore: 82.75,
    position: 1,
    outOf: 1,
    timesSchoolOpened: 110,
    timesPresent: 108,
    teacherRemarks: 'A very dedicated, punctual, and intellectually sharp student. Keep up the high standard.',
    principalRemarks: 'An outstanding performance. Approved for academic excellence commendation.',
    nextTermBegins: '12th January 2026',
  },
];

const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'adm-01',
    username: 'admin',
    fullName: 'Engr. D. K. Mohammed (Principal)',
    role: 'Principal',
    email: 'principal@gstcgarki.edu.ng',
    lastActive: 'Just now',
    status: 'Active',
  },
  {
    id: 'adm-02',
    username: 'exam_officer',
    fullName: 'Mrs. Fatima Aliyu',
    role: 'Exam Officer',
    email: 'exams@gstcgarki.edu.ng',
    lastActive: '2 hours ago',
    status: 'Active',
  },
];

const INITIAL_SETTINGS: SchoolSettings = {
  schoolName: 'GSTC Garki',
  subtitle: 'Govt. Science & Tech. College',
  motto: 'Technology for Self-Reliance',
  address: 'Area 10, Garki, Abuja, Federal Capital Territory, Nigeria',
  phone: '+234 (0) 803 000 1234',
  email: 'info@gstcgarki.edu.ng',
  currentTerm: 'First Term',
  currentSession: '2025/2026',
  nextTermResumption: '12th January 2026',
  principalName: 'Engr. D. K. Mohammed, FNSE',
  examOfficerName: 'Mrs. Fatima Aliyu',
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [classList, setClassList] = useState<ClassRoom[]>(INITIAL_CLASSES);
  const [subjectList, setSubjectList] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [studentList, setStudentList] = useState<Student[]>(INITIAL_STUDENTS);
  const [scratchCards, setScratchCards] = useState<ScratchCard[]>(INITIAL_SCRATCH_CARDS);
  const [resultsList, setResultsList] = useState<StudentResult[]>(INITIAL_RESULTS);
  const [adminList] = useState<AdminUser[]>(INITIAL_ADMINS);
  const [settings, setSettings] = useState<SchoolSettings>(INITIAL_SETTINGS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isFirebaseSynced, setIsFirebaseSynced] = useState(false);

  // Set up real-time Firestore synchronization
  useEffect(() => {
    // 1. Staff Listener
    const unsubStaff = onSnapshot(
      collection(db, 'staff'),
      async (snapshot) => {
        if (snapshot.empty) {
          // Default initial Yahaya staff from video
          const defaultStaff: Staff = {
            id: 'stf-001',
            username: 'GSTC/Stf/001',
            name: 'Yahaya',
            phone: '08063731128',
            email: 'habakkukemmanuel0@gmail.com',
            subjectsTaught: ['English Language'],
            formTeacherOf: 'CCS 1',
            createdAt: '2026-09-25',
          };
          try {
            await setDoc(doc(db, 'staff', defaultStaff.id), defaultStaff);
          } catch {
            setStaffList([defaultStaff]);
          }
        } else {
          const list: Staff[] = [];
          snapshot.forEach((d) => list.push(d.data() as Staff));
          setStaffList(list);
        }
        setIsFirebaseSynced(true);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'staff');
      }
    );

    // 2. Classes Listener
    const unsubClasses = onSnapshot(
      collection(db, 'classes'),
      async (snapshot) => {
        if (snapshot.empty) {
          for (const cls of INITIAL_CLASSES) {
            try {
              await setDoc(doc(db, 'classes', cls.id), cls);
            } catch {
              // fallback
            }
          }
        } else {
          const list: ClassRoom[] = [];
          snapshot.forEach((d) => list.push(d.data() as ClassRoom));
          setClassList(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'classes');
      }
    );

    // 3. Subjects Listener
    const unsubSubjects = onSnapshot(
      collection(db, 'subjects'),
      async (snapshot) => {
        if (snapshot.empty) {
          for (const s of INITIAL_SUBJECTS) {
            try {
              await setDoc(doc(db, 'subjects', s.id), s);
            } catch {
              // fallback
            }
          }
        } else {
          const list: Subject[] = [];
          snapshot.forEach((d) => list.push(d.data() as Subject));
          setSubjectList(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'subjects');
      }
    );

    // 4. Students Listener
    const unsubStudents = onSnapshot(
      collection(db, 'students'),
      async (snapshot) => {
        if (snapshot.empty) {
          for (const st of INITIAL_STUDENTS) {
            try {
              await setDoc(doc(db, 'students', st.id), st);
            } catch {
              // fallback
            }
          }
        } else {
          const list: Student[] = [];
          snapshot.forEach((d) => list.push(d.data() as Student));
          setStudentList(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'students');
      }
    );

    // 5. Scratch Cards Listener
    const unsubCards = onSnapshot(
      collection(db, 'scratchCards'),
      async (snapshot) => {
        if (snapshot.empty) {
          for (const c of INITIAL_SCRATCH_CARDS) {
            try {
              await setDoc(doc(db, 'scratchCards', c.id), c);
            } catch {
              // fallback
            }
          }
        } else {
          const list: ScratchCard[] = [];
          snapshot.forEach((d) => list.push(d.data() as ScratchCard));
          setScratchCards(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'scratchCards');
      }
    );

    // 6. Results Listener
    const unsubResults = onSnapshot(
      collection(db, 'results'),
      async (snapshot) => {
        if (snapshot.empty) {
          for (const r of INITIAL_RESULTS) {
            try {
              await setDoc(doc(db, 'results', r.id), r);
            } catch {
              // fallback
            }
          }
        } else {
          const list: StudentResult[] = [];
          snapshot.forEach((d) => list.push(d.data() as StudentResult));
          setResultsList(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'results');
      }
    );

    // 7. Settings Document Listener
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'config'),
      async (snapshot) => {
        if (!snapshot.exists()) {
          try {
            await setDoc(doc(db, 'settings', 'config'), INITIAL_SETTINGS);
          } catch {
            // fallback
          }
        } else {
          setSettings(snapshot.data() as SchoolSettings);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'settings/config');
      }
    );

    return () => {
      unsubStaff();
      unsubClasses();
      unsubSubjects();
      unsubStudents();
      unsubCards();
      unsubResults();
      unsubSettings();
    };
  }, []);

  const assignmentList: TeachingAssignment[] = staffList.flatMap((stf) =>
    stf.subjectsTaught.map((subj, idx) => ({
      id: `asg-${stf.id}-${idx}`,
      staffId: stf.id,
      staffName: stf.name,
      subjectName: subj,
      className: stf.formTeacherOf !== 'None' ? stf.formTeacherOf : 'CCS 1',
      academicYear: settings.currentSession,
      term: settings.currentTerm,
    }))
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addStaff = async (data: Omit<Staff, 'id' | 'username' | 'createdAt'>): Promise<string> => {
    const count = staffList.length + 1;
    const formattedId = `GSTC/Stf/${String(count).padStart(3, '0')}`;
    const id = `stf-${Date.now()}`;
    const newStaff: Staff = {
      ...data,
      id,
      username: formattedId,
      createdAt: new Date().toISOString().split('T')[0],
    };

    try {
      await setDoc(doc(db, 'staff', id), newStaff);
      if (data.formTeacherOf && data.formTeacherOf !== 'None') {
        const matchingClass = classList.find((c) => c.name === data.formTeacherOf);
        if (matchingClass) {
          await setDoc(doc(db, 'classes', matchingClass.id), {
            ...matchingClass,
            formTeacherName: data.name,
          });
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `staff/${id}`);
    }

    showToast('Staff saved');
    return formattedId;
  };

  const deleteStaff = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'staff', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `staff/${id}`);
    }
    showToast('Staff removed successfully');
  };

  const addClass = async (name: string, department: string, capacity = 40): Promise<void> => {
    const id = `cls-${Date.now()}`;
    const newClass: ClassRoom = {
      id,
      name,
      department,
      formTeacherName: 'None',
      studentCount: 0,
      capacity,
    };
    try {
      await setDoc(doc(db, 'classes', id), newClass);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `classes/${id}`);
    }
    showToast(`Class ${name} created`);
  };

  const addSubject = async (name: string, code: string, category: Subject['category']): Promise<void> => {
    const id = `sub-${Date.now()}`;
    const newSubj: Subject = {
      id,
      name,
      code,
      category,
      assignedTeachers: [],
    };
    try {
      await setDoc(doc(db, 'subjects', id), newSubj);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `subjects/${id}`);
    }
    showToast(`Subject ${name} added`);
  };

  const addStudent = async (data: Omit<Student, 'id' | 'admissionNo' | 'status'>): Promise<string> => {
    const currentYear = new Date().getFullYear();
    const count = studentList.length + 1;
    const admissionNo = `GSTC/${currentYear}/${String(count).padStart(3, '0')}`;
    const pinPart1 = Math.floor(1000 + Math.random() * 9000);
    const pinPart2 = Math.floor(1000 + Math.random() * 9000);
    const pinPart3 = Math.floor(1000 + Math.random() * 9000);
    const generatedPin = `${pinPart1}-${pinPart2}-${pinPart3}`;

    const studentId = `std-${Date.now()}`;
    const newStudent: Student = {
      ...data,
      id: studentId,
      admissionNo,
      scratchCardPin: generatedPin,
      status: 'Active',
    };

    const cardId = `crd-${Date.now()}`;
    const newCard: ScratchCard = {
      id: cardId,
      serialNumber: `GSTC-${currentYear}-${Math.floor(100000 + Math.random() * 900000)}`,
      pin: generatedPin,
      maxUsage: 5,
      usageCount: 0,
      status: 'active',
      usedByAdmissionNo: admissionNo,
      createdAt: new Date().toISOString().split('T')[0],
    };

    try {
      await setDoc(doc(db, 'students', studentId), newStudent);
      await setDoc(doc(db, 'scratchCards', cardId), newCard);

      const targetClass = classList.find((c) => c.name === data.className);
      if (targetClass) {
        await setDoc(doc(db, 'classes', targetClass.id), {
          ...targetClass,
          studentCount: targetClass.studentCount + 1,
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `students/${studentId}`);
    }

    showToast(`Student registered: ${admissionNo}`);
    return admissionNo;
  };

  const generateScratchCards = async (count = 5): Promise<void> => {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < count; i++) {
      const p1 = Math.floor(1000 + Math.random() * 9000);
      const p2 = Math.floor(1000 + Math.random() * 9000);
      const p3 = Math.floor(1000 + Math.random() * 9000);
      const pin = `${p1}-${p2}-${p3}`;
      const serial = `GSTC-${currentYear}-${Math.floor(100000 + Math.random() * 900000)}`;
      const id = `crd-${Date.now()}-${i}`;

      const card: ScratchCard = {
        id,
        serialNumber: serial,
        pin,
        maxUsage: 5,
        usageCount: 0,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
      };

      try {
        await setDoc(doc(db, 'scratchCards', id), card);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `scratchCards/${id}`);
      }
    }
    showToast(`Generated ${count} new Scratch Cards in Firebase`);
  };

  const verifyScratchCard = (admissionNo: string, pin: string) => {
    const cleanAdm = admissionNo.trim().toUpperCase();
    const cleanPin = pin.trim().replace(/\s+/g, '');

    const card = scratchCards.find(
      (c) => c.pin.replace(/-/g, '') === cleanPin.replace(/-/g, '')
    );

    if (!card) {
      return { valid: false, message: 'Invalid Scratch Card PIN. Please check and try again.' };
    }

    if (card.status !== 'active') {
      return { valid: false, message: 'This Scratch Card has expired or been deactivated.' };
    }

    if (card.usageCount >= card.maxUsage) {
      return { valid: false, message: `Card usage limit exceeded (Max ${card.maxUsage} checks). Please purchase a new card.` };
    }

    const student = studentList.find((s) => s.admissionNo.toUpperCase() === cleanAdm);
    if (!student) {
      return { valid: false, message: `Admission Number "${admissionNo}" not found on GSTC portal.` };
    }

    // Persist usage update to Firestore asynchronously
    const updatedCount = card.usageCount + 1;
    setDoc(doc(db, 'scratchCards', card.id), {
      ...card,
      usageCount: updatedCount,
      usedByAdmissionNo: cleanAdm,
      status: updatedCount >= card.maxUsage ? 'used' : 'active',
    }).catch((err) => {
      console.warn('Could not sync card usage to Firestore:', err);
    });

    let result = resultsList.find((r) => r.admissionNo.toUpperCase() === cleanAdm);
    if (!result) {
      result = {
        id: `res-${student.id}`,
        studentId: student.id,
        admissionNo: student.admissionNo,
        studentName: student.fullName,
        className: student.className,
        term: settings.currentTerm,
        session: settings.currentSession,
        scores: [
          { subjectName: 'English Language', ca1: 17, ca2: 18, exam: 50, total: 85, grade: 'A1', remark: 'Distinction' },
          { subjectName: 'Mathematics', ca1: 15, ca2: 16, exam: 46, total: 77, grade: 'A1', remark: 'Distinction' },
          { subjectName: 'Computer Craft Studies', ca1: 18, ca2: 19, exam: 51, total: 88, grade: 'A1', remark: 'Distinction' },
          { subjectName: 'Technical Drawing', ca1: 13, ca2: 14, exam: 45, total: 72, grade: 'B2', remark: 'Very Good' },
        ],
        totalScore: 322,
        averageScore: 80.5,
        position: 1,
        outOf: 1,
        timesSchoolOpened: 110,
        timesPresent: 106,
        teacherRemarks: 'Excellent academic progress and behavior in class.',
        principalRemarks: 'A very commendable result. Keep it up.',
        nextTermBegins: settings.nextTermResumption,
      };
      setDoc(doc(db, 'results', result.id), result).catch(() => {});
    }

    return {
      valid: true,
      message: `Card verified! ${card.maxUsage - updatedCount} uses remaining.`,
      result,
    };
  };

  const saveResult = async (result: StudentResult): Promise<void> => {
    try {
      await setDoc(doc(db, 'results', result.id), result);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `results/${result.id}`);
    }
    showToast('Result saved to Firebase');
  };

  const updateSettings = async (newSettings: Partial<SchoolSettings>): Promise<void> => {
    const merged = { ...settings, ...newSettings };
    try {
      await setDoc(doc(db, 'settings', 'config'), merged);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/config');
    }
    showToast('Settings updated');
  };

  const resetToInitialDemo = async (): Promise<void> => {
    try {
      const staffSnap = await getDocs(collection(db, 'staff'));
      for (const d of staffSnap.docs) {
        await deleteDoc(d.ref);
      }
    } catch (error) {
      // fallback
    }
    showToast('Portal reset to initial video snapshot (0 staff)');
  };

  return (
    <DataContext.Provider
      value={{
        staffList,
        classList,
        subjectList,
        studentList,
        assignmentList,
        scratchCards,
        resultsList,
        adminList,
        settings,
        toastMessage,
        isFirebaseSynced,
        addStaff,
        deleteStaff,
        addClass,
        addSubject,
        addStudent,
        generateScratchCards,
        verifyScratchCard,
        saveResult,
        updateSettings,
        showToast,
        resetToInitialDemo,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
