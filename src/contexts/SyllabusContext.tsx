import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface Chapter {
  id: string;
  name: string;
  completed: boolean;
}

interface Subject {
  id: string;
  name: string;
  icon: string;
  chapters: Chapter[];
}

interface SyllabusContextProps {
  subjects: Subject[];
  toggleChapterCompletion: (subjectId: string, chapterId: string) => void;
  getSubjectProgress: (subjectId: string) => number;
  resetProgress: () => void;
}

const SyllabusContext = createContext<SyllabusContextProps | undefined>(undefined);

interface SyllabusProviderProps {
  children: ReactNode;
}

const initialSubjects: Subject[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: '📊',
    chapters: [
      { id: 'real-numbers', name: 'Real Numbers', completed: false },
      { id: 'polynomials', name: 'Polynomials', completed: false },
      { id: 'linear-equations', name: 'Pair of Linear Equations in Two Variables', completed: false },
      { id: 'quadratic-equations', name: 'Quadratic Equations', completed: false },
      { id: 'arithmetic-progressions', name: 'Arithmetic Progressions', completed: false },
      { id: 'triangles', name: 'Triangles', completed: false },
      { id: 'coordinate-geometry', name: 'Coordinate Geometry', completed: false },
      { id: 'trigonometry', name: 'Introduction to Trigonometry', completed: false },
      { id: 'trigonometry-applications', name: 'Some Applications of Trigonometry', completed: false },
      { id: 'circles', name: 'Circles', completed: false },
      { id: 'area-related-circles', name: 'Area Related to Circles', completed: false },
      { id: 'surface-area-volumes', name: 'Surface Area and Volumes', completed: false },
      { id: 'statistics', name: 'Statistics', completed: false },
      { id: 'probability', name: 'Probability', completed: false }
    ]
  },
  {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    chapters: [
      { id: 'light-reflection', name: 'Light - Reflection and Refraction', completed: false },
      { id: 'human-eye', name: 'Human Eye and Colourful World', completed: false },
      { id: 'electricity', name: 'Electricity', completed: false },
      { id: 'magnetic-effects', name: 'Magnetic Effects of Electric Current', completed: false },
      { id: 'life-processes', name: 'Life Processes', completed: false },
      { id: 'control-coordination', name: 'Control and Coordination', completed: false },
      { id: 'reproduction', name: 'How do Organisms Reproduce?', completed: false },
      { id: 'heredity-evolution', name: 'Heredity and Evolution', completed: false },
      { id: 'natural-resources', name: 'Natural Resource Management', completed: false },
      { id: 'acids-bases', name: 'Acids, Bases and Salts', completed: false },
      { id: 'metals-nonmetals', name: 'Metals and Non-metals', completed: false },
      { id: 'carbon-compounds', name: 'Carbon and its Compounds', completed: false },
      { id: 'periodic-classification', name: 'Periodic Classification of Elements', completed: false }
    ]
  },
  {
    id: 'social-science',
    name: 'Social Science',
    icon: '🌍',
    chapters: [
      { id: 'nationalism-europe', name: 'The Rise of Nationalism in Europe', completed: false },
      { id: 'nationalism-india', name: 'Nationalism in India', completed: false },
      { id: 'making-global-world', name: 'The Making of a Global World', completed: false },
      { id: 'age-industrialisation', name: 'The Age of Industrialisation', completed: false },
      { id: 'print-culture', name: 'Print Culture and the Modern World', completed: false },
      { id: 'resources-development', name: 'Resources and Development', completed: false },
      { id: 'forest-wildlife', name: 'Forest and Wildlife Resources', completed: false },
      { id: 'water-resources', name: 'Water Resources', completed: false },
      { id: 'agriculture', name: 'Agriculture', completed: false },
      { id: 'minerals-energy', name: 'Minerals and Energy Resources', completed: false },
      { id: 'manufacturing-industries', name: 'Manufacturing Industries', completed: false },
      { id: 'lifelines-economy', name: 'Lifelines of National Economy', completed: false },
      { id: 'power-sharing', name: 'Power Sharing', completed: false },
      { id: 'federalism', name: 'Federalism', completed: false },
      { id: 'democracy-diversity', name: 'Democracy and Diversity', completed: false },
      { id: 'gender-religion-caste', name: 'Gender, Religion and Caste', completed: false },
      { id: 'popular-struggles', name: 'Popular Struggles and Movements', completed: false },
      { id: 'political-parties', name: 'Political Parties', completed: false },
      { id: 'outcomes-democracy', name: 'Outcomes of Democracy', completed: false },
      { id: 'challenges-democracy', name: 'Challenges to Democracy', completed: false },
      { id: 'development', name: 'Development', completed: false },
      { id: 'sectors-economy', name: 'Sectors of the Indian Economy', completed: false },
      { id: 'money-credit', name: 'Money and Credit', completed: false },
      { id: 'globalisation', name: 'Globalisation and the Indian Economy', completed: false },
      { id: 'consumer-rights', name: 'Consumer Rights', completed: false }
    ]
  },
  {
    id: 'english-first-flight',
    name: 'English - First Flight',
    icon: '📖',
    chapters: [
      { id: 'letter-to-god', name: 'A Letter to God', completed: false },
      { id: 'nelson-mandela', name: 'Nelson Mandela: Long Walk to Freedom', completed: false },
      { id: 'two-stories-flying', name: 'Two Stories about Flying', completed: false },
      { id: 'from-diary-anne-frank', name: 'From the Diary of Anne Frank', completed: false },
      { id: 'hundred-dresses-i', name: 'The Hundred Dresses - I', completed: false },
      { id: 'hundred-dresses-ii', name: 'The Hundred Dresses - II', completed: false },
      { id: 'glimpses-india', name: 'Glimpses of India', completed: false },
      { id: 'mijbil-otter', name: 'Mijbil the Otter', completed: false },
      { id: 'madam-rides-bus', name: 'Madam Rides the Bus', completed: false },
      { id: 'sermon-benares', name: 'The Sermon at Benares', completed: false },
      { id: 'proposal', name: 'The Proposal', completed: false }
    ]
  },
  {
    id: 'english-footprints',
    name: 'English - Footprints Without Feet',
    icon: '👣',
    chapters: [
      { id: 'triumph-surgery', name: 'A Triumph of Surgery', completed: false },
      { id: 'thief-story', name: 'The Thief\'s Story', completed: false },
      { id: 'midnight-visitor', name: 'The Midnight Visitor', completed: false },
      { id: 'question-trust', name: 'A Question of Trust', completed: false },
      { id: 'footprints-without-feet', name: 'Footprints without Feet', completed: false },
      { id: 'making-scientist', name: 'The Making of a Scientist', completed: false },
      { id: 'necklace', name: 'The Necklace', completed: false },
      { id: 'hack-driver', name: 'The Hack Driver', completed: false },
      { id: 'bholi', name: 'Bholi', completed: false },
      { id: 'book-saved-earth', name: 'The Book That Saved the Earth', completed: false }
    ]
  },
  {
    id: 'hindi',
    name: 'Hindi',
    icon: '🇮🇳',
    chapters: [
      { id: 'surdas-ke-pad', name: 'सूरदास के पद', completed: false },
      { id: 'ram-lakshman-parshuram', name: 'राम-लक्ष्मण-परशुराम संवाद', completed: false },
      { id: 'neta-ji-subhash', name: 'नेताजी का चश्मा', completed: false },
      { id: 'balgobin-bhagat', name: 'बालगोबिन भगत', completed: false },
      { id: 'lakhmi', name: 'लखनवी अंदाज़', completed: false },
      { id: 'manushyata', name: 'मनुष्यता', completed: false },
      { id: 'parwat-pradesh', name: 'पर्वत प्रदेश में पावस', completed: false },
      { id: 'top', name: 'तोप', completed: false },
      { id: 'kargil-vijay', name: 'कारतूस', completed: false },
      { id: 'balshek', name: 'बालक', completed: false }
    ]
  }
];

export const SyllabusProvider: React.FC<SyllabusProviderProps> = ({ children }) => {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const storedSubjects = localStorage.getItem('syllabus');
    return storedSubjects ? JSON.parse(storedSubjects) : initialSubjects;
  });

  useEffect(() => {
    localStorage.setItem('syllabus', JSON.stringify(subjects));
  }, [subjects]);

  const toggleChapterCompletion = (subjectId: string, chapterId: string) => {
    setSubjects(prevSubjects =>
      prevSubjects.map(subject =>
        subject.id === subjectId
          ? {
              ...subject,
              chapters: subject.chapters.map(chapter =>
                chapter.id === chapterId
                  ? { ...chapter, completed: !chapter.completed }
                  : chapter
              ),
            }
          : subject
      )
    );
  };

  const getSubjectProgress = (subjectId: string): number => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return 0;

    const completedChapters = subject.chapters.filter(chapter => chapter.completed).length;
    return Math.round((completedChapters / subject.chapters.length) * 100);
  };

  const resetProgress = () => {
    setSubjects(initialSubjects);
  };

  return (
    <SyllabusContext.Provider value={{ subjects, toggleChapterCompletion, getSubjectProgress, resetProgress }}>
      {children}
    </SyllabusContext.Provider>
  );
};

export const useSyllabus = () => {
  const context = useContext(SyllabusContext);
  if (!context) {
    throw new Error('useSyllabus must be used within a SyllabusProvider');
  }
  return context;
};
