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
    id: 'science',
    name: 'Science',
    icon: '🔬',
    color: 'from-green-400 to-emerald-600',
    chapters: [
      // Physics
      { id: 'light-reflection', name: 'Light - Reflection and Refraction', completed: false },
      { id: 'human-eye', name: 'The Human Eye and Colourful World', completed: false },
      { id: 'electricity', name: 'Electricity', completed: false },
      { id: 'magnetic-effects', name: 'Magnetic Effects of Electric Current', completed: false },
      // Chemistry
      { id: 'acids-bases', name: 'Acids, Bases and Salts', completed: false },
      { id: 'metals-nonmetals', name: 'Metals and Non-metals', completed: false },
      { id: 'carbon-compounds', name: 'Carbon and its Compounds', completed: false },
      { id: 'chemical-reactions', name: 'Chemical Reactions and Equations', completed: false },
      // Biology
      { id: 'life-processes', name: 'Life Processes', completed: false },
      { id: 'control-coordination', name: 'Control and Coordination', completed: false },
      { id: 'reproduction', name: 'How do Organisms Reproduce?', completed: false },
      { id: 'heredity-evolution', name: 'Heredity and Evolution', completed: false },
      { id: 'natural-resources', name: 'Our Environment', completed: false }
    ]
  },
  {
    id: 'english-first-flight',
    name: 'English - First Flight',
    icon: '📚',
    color: 'from-purple-400 to-pink-600',
    chapters: [
      // Prose
      { id: 'letter-to-god', name: 'A Letter to God', completed: false },
      { id: 'nelson-mandela', name: 'Nelson Mandela: Long Walk to Freedom', completed: false },
      { id: 'two-stories-flying', name: 'Two Stories about Flying', completed: false },
      { id: 'diary-anne-frank', name: 'From the Diary of Anne Frank', completed: false },
      { id: 'hundred-dresses-i', name: 'The Hundred Dresses - I', completed: false },
      { id: 'hundred-dresses-ii', name: 'The Hundred Dresses - II', completed: false },
      { id: 'glimpses-india', name: 'Glimpses of India', completed: false },
      { id: 'mijbil-otter', name: 'Mijbil the Otter', completed: false },
      { id: 'madam-rides-bus', name: 'Madam Rides the Bus', completed: false },
      { id: 'sermon-benares', name: 'The Sermon at Benares', completed: false },
      { id: 'proposal', name: 'The Proposal', completed: false },
      // Poetry
      { id: 'dust-snow', name: 'Dust of Snow', completed: false },
      { id: 'fire-ice', name: 'Fire and Ice', completed: false },
      { id: 'tiger-zoo', name: 'A Tiger in the Zoo', completed: false },
      { id: 'how-tell-wild-animals', name: 'How to Tell Wild Animals', completed: false },
      { id: 'ball-poem', name: 'The Ball Poem', completed: false },
      { id: 'amanda', name: 'Amanda!', completed: false },
      { id: 'animals', name: 'Animals', completed: false },
      { id: 'trees', name: 'The Trees', completed: false },
      { id: 'fog', name: 'Fog', completed: false },
      { id: 'tale-custard-dragon', name: 'The Tale of Custard the Dragon', completed: false },
      { id: 'for-anne-gregory', name: 'For Anne Gregory', completed: false }
    ]
  },
  {
    id: 'english-footprints',
    name: 'English - Footprints without Feet',
    icon: '👣',
    color: 'from-indigo-400 to-purple-600',
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
    id: 'social-science',
    name: 'Social Science',
    icon: '🌍',
    color: 'from-orange-400 to-red-600',
    chapters: [
      // History
      { id: 'nationalism-europe', name: 'The Rise of Nationalism in Europe', completed: false },
      { id: 'nationalism-india', name: 'Nationalism in India', completed: false },
      { id: 'making-global-world', name: 'The Making of a Global World', completed: false },
      { id: 'age-industrialisation', name: 'The Age of Industrialisation', completed: false },
      { id: 'print-culture', name: 'Print Culture and the Modern World', completed: false },
      // Geography
      { id: 'resources-development', name: 'Resources and Development', completed: false },
      { id: 'forest-wildlife', name: 'Forest and Wildlife Resources', completed: false },
      { id: 'water-resources', name: 'Water Resources', completed: false },
      { id: 'agriculture', name: 'Agriculture', completed: false },
      { id: 'minerals-energy', name: 'Minerals and Energy Resources', completed: false },
      { id: 'manufacturing', name: 'Manufacturing Industries', completed: false },
      { id: 'lifelines-national-economy', name: 'Lifelines of National Economy', completed: false },
      // Political Science
      { id: 'power-sharing', name: 'Power Sharing', completed: false },
      { id: 'federalism', name: 'Federalism', completed: false },
      { id: 'democracy-diversity', name: 'Democracy and Diversity', completed: false },
      { id: 'gender-religion-caste', name: 'Gender, Religion and Caste', completed: false },
      { id: 'popular-struggles', name: 'Popular Struggles and Movements', completed: false },
      { id: 'political-parties', name: 'Political Parties', completed: false },
      { id: 'outcomes-democracy', name: 'Outcomes of Democracy', completed: false },
      { id: 'challenges-democracy', name: 'Challenges to Democracy', completed: false },
      // Economics
      { id: 'development', name: 'Development', completed: false },
      { id: 'sectors-economy', name: 'Sectors of the Indian Economy', completed: false },
      { id: 'money-credit', name: 'Money and Credit', completed: false },
      { id: 'globalisation', name: 'Globalisation and the Indian Economy', completed: false },
      { id: 'consumer-rights', name: 'Consumer Rights', completed: false }
    ]
  },
  {
    id: 'hindi-kshitij',
    name: 'Hindi - क्षितिज',
    icon: '🇮🇳',
    color: 'from-yellow-400 to-orange-600',
    chapters: [
      // गद्य खंड
      { id: 'surdas-ke-pad', name: 'सूरदास के पद', completed: false },
      { id: 'ram-lakshman-parsuram-samvad', name: 'राम-लक्ष्मण-परशुराम संवाद', completed: false },
      { id: 'savaiye', name: 'सवैये', completed: false },
      { id: 'atal-bihari-vajpayee', name: 'आत्मकथ्य', completed: false },
      { id: 'ulahna', name: 'उलाहना', completed: false },
      { id: 'kanyadan', name: 'कन्यादान', completed: false },
      { id: 'chhattrasal', name: 'छत्रसाल', completed: false },
      { id: 'parwat-hriday', name: 'पर्वत प्रदेश में पावस', completed: false },
      { id: 'top', name: 'तोप', completed: false },
      { id: 'kahar', name: 'कहर', completed: false },
      { id: 'fag', name: 'फाग', completed: false },
      // गद्य खंड
      { id: 'netaji-subhash-chandra-bose', name: 'नेताजी का चश्मा', completed: false },
      { id: 'balgobin-bhagat', name: 'बालगोबिन भगत', completed: false },
      { id: 'lakhnnavi-andaz', name: 'लखनवी अंदाज़', completed: false },
      { id: 'manveeya-karuna', name: 'मानवीय करुणा की दिव्य चमक', completed: false },
      { id: 'ek-kahani-yah-bhi', name: 'एक कहानी यह भी', completed: false },
      { id: 'sapat-sagar', name: 'साना साना हाथ जोड़ि', completed: false },
      { id: 'main-kyon-likhta-hun', name: 'मैं क्यों लिखता हूँ', completed: false }
    ]
  },
  {
    id: 'hindi-kritika',
    name: 'Hindi - कृतिका',
    icon: '📝',
    color: 'from-red-400 to-pink-600',
    chapters: [
      { id: 'mata-ka-anchal', name: 'माता का आँचल', completed: false },
      { id: 'george-pancham-ki-naak', name: 'जॉर्ज पंचम की नाक', completed: false },
      { id: 'sana-sana-hath-jodi', name: 'साना साना हाथ जोड़ि', completed: false },
      { id: 'ahi-thayya-jinda-hai', name: 'अही ठैयाँ झुलनी हेरानी हो रामा!', completed: false }
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
