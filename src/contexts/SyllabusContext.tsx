
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Chapter {
  id: string;
  name: string;
  completed: boolean;
}

interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  chapters: Chapter[];
}

const syllabusData: Subject[] = [
  {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    color: 'from-green-400 to-emerald-600',
    chapters: [
      { id: 'life-processes', name: 'Life Processes', completed: false },
      { id: 'control-coordination', name: 'Control and Coordination', completed: false },
      { id: 'reproduction', name: 'How do Organisms Reproduce?', completed: false },
      { id: 'heredity-evolution', name: 'Heredity and Evolution', completed: false },
      { id: 'light', name: 'Light - Reflection and Refraction', completed: false },
      { id: 'human-eye', name: 'The Human Eye and Colourful World', completed: false },
      { id: 'electricity', name: 'Electricity', completed: false },
      { id: 'magnetic-effects', name: 'Magnetic Effects of Electric Current', completed: false },
      { id: 'natural-resources', name: 'Our Environment', completed: false },
      { id: 'acids-bases', name: 'Acids, Bases and Salts', completed: false },
      { id: 'metals-nonmetals', name: 'Metals and Non-metals', completed: false },
      { id: 'carbon-compounds', name: 'Carbon and its Compounds', completed: false }
    ]
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: '📐',
    color: 'from-blue-400 to-indigo-600',
    chapters: [
      { id: 'real-numbers', name: 'Real Numbers', completed: false },
      { id: 'polynomials', name: 'Polynomials', completed: false },
      { id: 'linear-equations', name: 'Pair of Linear Equations in Two Variables', completed: false },
      { id: 'quadratic-equations', name: 'Quadratic Equations', completed: false },
      { id: 'arithmetic-progressions', name: 'Arithmetic Progressions', completed: false },
      { id: 'triangles', name: 'Triangles', completed: false },
      { id: 'coordinate-geometry', name: 'Coordinate Geometry', completed: false },
      { id: 'trigonometry', name: 'Introduction to Trigonometry', completed: false },
      { id: 'heights-distances', name: 'Some Applications of Trigonometry', completed: false },
      { id: 'circles', name: 'Circles', completed: false },
      { id: 'areas-volumes', name: 'Areas Related to Circles', completed: false },
      { id: 'surface-areas', name: 'Surface Areas and Volumes', completed: false },
      { id: 'statistics', name: 'Statistics', completed: false },
      { id: 'probability', name: 'Probability', completed: false }
    ]
  },
  {
    id: 'english',
    name: 'English',
    icon: '📚',
    color: 'from-purple-400 to-pink-600',
    chapters: [
      { id: 'letter-diary', name: 'A Letter to God', completed: false },
      { id: 'nelson-mandela', name: 'Nelson Mandela: Long Walk to Freedom', completed: false },
      { id: 'two-stories', name: 'Two Stories about Flying', completed: false },
      { id: 'diary-anne', name: 'From the Diary of Anne Frank', completed: false },
      { id: 'hundred-dresses', name: 'The Hundred Dresses', completed: false },
      { id: 'glimpses-india', name: 'Glimpses of India', completed: false },
      { id: 'mijbil-otter', name: 'Mijbil the Otter', completed: false },
      { id: 'madam-rides', name: 'Madam Rides the Bus', completed: false },
      { id: 'sermon-benares', name: 'The Sermon at Benares', completed: false },
      { id: 'proposal', name: 'The Proposal', completed: false }
    ]
  },
  {
    id: 'social-science',
    name: 'Social Science',
    icon: '🌍',
    color: 'from-orange-400 to-red-600',
    chapters: [
      { id: 'nationalism-europe', name: 'The Rise of Nationalism in Europe', completed: false },
      { id: 'nationalism-india', name: 'Nationalism in India', completed: false },
      { id: 'making-global-world', name: 'The Making of a Global World', completed: false },
      { id: 'resources-development', name: 'Resources and Development', completed: false },
      { id: 'forest-wildlife', name: 'Forest and Wildlife Resources', completed: false },
      { id: 'water-resources', name: 'Water Resources', completed: false },
      { id: 'agriculture', name: 'Agriculture', completed: false },
      { id: 'minerals-energy', name: 'Minerals and Energy Resources', completed: false },
      { id: 'manufacturing', name: 'Manufacturing Industries', completed: false },
      { id: 'power-sharing', name: 'Power Sharing', completed: false },
      { id: 'federalism', name: 'Federalism', completed: false },
      { id: 'democracy-diversity', name: 'Democracy and Diversity', completed: false },
      { id: 'development', name: 'Development', completed: false },
      { id: 'sectors-economy', name: 'Sectors of the Indian Economy', completed: false },
      { id: 'money-credit', name: 'Money and Credit', completed: false }
    ]
  }
];

interface SyllabusContextType {
  subjects: Subject[];
  toggleChapterCompletion: (subjectId: string, chapterId: string) => void;
  getOverallProgress: () => number;
  getSubjectProgress: (subjectId: string) => number;
  resetProgress: () => void;
}

const SyllabusContext = createContext<SyllabusContextType | undefined>(undefined);

export const SyllabusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('syllabusProgress');
    return saved ? JSON.parse(saved) : syllabusData;
  });

  useEffect(() => {
    localStorage.setItem('syllabusProgress', JSON.stringify(subjects));
  }, [subjects]);

  const toggleChapterCompletion = (subjectId: string, chapterId: string) => {
    setSubjects(prev => prev.map(subject => 
      subject.id === subjectId 
        ? {
            ...subject,
            chapters: subject.chapters.map(chapter =>
              chapter.id === chapterId 
                ? { ...chapter, completed: !chapter.completed }
                : chapter
            )
          }
        : subject
    ));
  };

  const getOverallProgress = (): number => {
    const totalChapters = subjects.reduce((total, subject) => total + subject.chapters.length, 0);
    const completedChapters = subjects.reduce(
      (total, subject) => total + subject.chapters.filter(chapter => chapter.completed).length,
      0
    );
    return totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
  };

  const getSubjectProgress = (subjectId: string): number => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return 0;
    
    const completedChapters = subject.chapters.filter(chapter => chapter.completed).length;
    return subject.chapters.length > 0 ? Math.round((completedChapters / subject.chapters.length) * 100) : 0;
  };

  const resetProgress = () => {
    setSubjects(syllabusData);
  };

  return (
    <SyllabusContext.Provider value={{
      subjects,
      toggleChapterCompletion,
      getOverallProgress,
      getSubjectProgress,
      resetProgress
    }}>
      {children}
    </SyllabusContext.Provider>
  );
};

export const useSyllabus = () => {
  const context = useContext(SyllabusContext);
  if (context === undefined) {
    throw new Error('useSyllabus must be used within a SyllabusProvider');
  }
  return context;
};
