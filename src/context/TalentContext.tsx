import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CurrentStudent, Badge } from '../types';

interface TalentContextType {
  currentStudent: CurrentStudent;
  updateStudent: (student: Partial<CurrentStudent>) => void;
  addEarnedBadge: (badge: Badge) => void;
  resetAllData: () => void;
}

const STORAGE_KEY_STUDENT = 'trusthire_student_portal_v1';

const DEFAULT_STUDENT: CurrentStudent = {
  name: 'Alex Chen',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
  university: 'Stanford University — Dept. of Computer Science',
  graduationYear: 'Class of 2026',
  githubHandle: 'alexchen-dev',
  email: 'alex.chen@cs.stanford.edu',
  targetRole: 'Senior Full-Stack & Systems Engineer',
  earnedBadges: []
};

const TalentContext = createContext<TalentContextType | undefined>(undefined);

export const TalentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize student from localStorage or default
  const [currentStudent, setCurrentStudent] = useState<CurrentStudent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...DEFAULT_STUDENT,
            ...parsed,
            earnedBadges: Array.isArray(parsed.earnedBadges) ? parsed.earnedBadges : []
          };
        }
      }
    } catch (e) {
      console.error('Failed reading localStorage for student', e);
    }
    return DEFAULT_STUDENT;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(currentStudent));
    } catch (e) {
      console.error('Failed writing student to localStorage', e);
    }
  }, [currentStudent]);

  const updateStudent = (updates: Partial<CurrentStudent>) => {
    setCurrentStudent(prev => ({ ...prev, ...updates }));
  };

  const addEarnedBadge = (badge: Badge) => {
    setCurrentStudent(prev => {
      const existing = prev.earnedBadges.filter(b => b.skillId !== badge.skillId);
      return {
        ...prev,
        earnedBadges: [badge, ...existing]
      };
    });
  };

  const resetAllData = () => {
    setCurrentStudent(DEFAULT_STUDENT);
    try {
      localStorage.removeItem(STORAGE_KEY_STUDENT);
      localStorage.removeItem('trusthire_candidates_v1');
      localStorage.removeItem('trusthire_candidates_v2');
      localStorage.removeItem('trusthire_student_v1');
      localStorage.removeItem('trusthire_student_v2');
    } catch (e) {
      console.error('Clear storage error:', e);
    }
  };

  return (
    <TalentContext.Provider
      value={{
        currentStudent,
        updateStudent,
        addEarnedBadge,
        resetAllData,
      }}
    >
      {children}
    </TalentContext.Provider>
  );
};

export const useTalent = () => {
  const context = useContext(TalentContext);
  if (!context) {
    throw new Error('useTalent must be used within a TalentProvider');
  }
  return context;
};
