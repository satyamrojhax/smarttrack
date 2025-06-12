
import React, { createContext, useContext, useState } from 'react';

interface Chapter {
  id: string;
  name: string;
  topics: string[];
  completed: boolean;
}

interface Subject {
  id: string;
  name: string;
  icon: string;
  chapters: Chapter[];
  progress: number;
}

interface SyllabusContextType {
  subjects: Subject[];
  updateChapterProgress: (subjectId: string, chapterId: string, completed: boolean) => void;
}

const SyllabusContext = createContext<SyllabusContextType | undefined>(undefined);

const initialSubjects: Subject[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: '📐',
    progress: 0,
    chapters: [
      {
        id: 'real-numbers',
        name: 'Real Numbers',
        topics: ['Euclid\'s Division Lemma', 'Fundamental Theorem of Arithmetic', 'Rational and Irrational Numbers', 'Decimal Expansions'],
        completed: false
      },
      {
        id: 'polynomials',
        name: 'Polynomials',
        topics: ['Degree of Polynomial', 'Zeros of Polynomial', 'Relationship between Zeros and Coefficients', 'Division Algorithm'],
        completed: false
      },
      {
        id: 'linear-equations',
        name: 'Pair of Linear Equations in Two Variables',
        topics: ['Graphical Method', 'Algebraic Methods', 'Substitution Method', 'Elimination Method', 'Cross Multiplication Method'],
        completed: false
      },
      {
        id: 'quadratic-equations',
        name: 'Quadratic Equations',
        topics: ['Standard Form', 'Solution by Factorization', 'Completing the Square', 'Quadratic Formula', 'Nature of Roots'],
        completed: false
      },
      {
        id: 'arithmetic-progressions',
        name: 'Arithmetic Progressions',
        topics: ['General Term', 'Sum of First n Terms', 'Applications in Daily Life'],
        completed: false
      },
      {
        id: 'triangles',
        name: 'Triangles',
        topics: ['Similar Triangles', 'Criteria for Similarity', 'Areas of Similar Triangles', 'Pythagoras Theorem'],
        completed: false
      },
      {
        id: 'coordinate-geometry',
        name: 'Coordinate Geometry',
        topics: ['Distance Formula', 'Section Formula', 'Area of Triangle', 'Collinearity of Points'],
        completed: false
      },
      {
        id: 'trigonometry',
        name: 'Introduction to Trigonometry',
        topics: ['Trigonometric Ratios', 'Trigonometric Identities', 'Heights and Distances'],
        completed: false
      },
      {
        id: 'circles',
        name: 'Circles',
        topics: ['Tangent to Circle', 'Number of Tangents from External Point', 'Properties of Tangents'],
        completed: false
      },
      {
        id: 'areas-volumes',
        name: 'Areas and Volumes',
        topics: ['Surface Areas', 'Volumes of Combinations of Solids', 'Conversion of Solid from One Shape to Another'],
        completed: false
      },
      {
        id: 'statistics',
        name: 'Statistics',
        topics: ['Mean of Grouped Data', 'Mode of Grouped Data', 'Median of Grouped Data', 'Cumulative Frequency Graph'],
        completed: false
      },
      {
        id: 'probability',
        name: 'Probability',
        topics: ['Classical Definition', 'Empirical Probability', 'Theoretical Probability', 'Elementary Events'],
        completed: false
      }
    ]
  },
  {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    progress: 0,
    chapters: [
      {
        id: 'chemical-reactions-equations',
        name: 'Chemical Reactions and Equations',
        topics: ['Types of Chemical Reactions', 'Balancing Chemical Equations', 'Oxidation and Reduction', 'Effects of Oxidation in Daily Life'],
        completed: false
      },
      {
        id: 'acids-bases-salts',
        name: 'Acids, Bases and Salts',
        topics: ['Properties of Acids and Bases', 'pH Scale', 'Preparation of Salts', 'Chemicals from Common Salt'],
        completed: false
      },
      {
        id: 'metals-non-metals',
        name: 'Metals and Non-metals',
        topics: ['Physical Properties', 'Chemical Properties', 'Occurrence and Extraction', 'Corrosion and Prevention'],
        completed: false
      },
      {
        id: 'carbon-compounds',
        name: 'Carbon and Its Compounds',
        topics: ['Covalent Bonding', 'Versatile Nature of Carbon', 'Homologous Series', 'Soaps and Detergents'],
        completed: false
      },
      {
        id: 'life-processes',
        name: 'Life Processes',
        topics: ['Nutrition', 'Respiration', 'Transportation', 'Excretion'],
        completed: false
      },
      {
        id: 'control-coordination',
        name: 'Control and Coordination',
        topics: ['Nervous System', 'Hormones in Animals', 'Plant Hormones', 'Coordination in Plants'],
        completed: false
      },
      {
        id: 'reproduction',
        name: 'How Do Organisms Reproduce?',
        topics: ['Modes of Reproduction', 'Sexual Reproduction in Flowering Plants', 'Human Reproductive System'],
        completed: false
      },
      {
        id: 'heredity-evolution',
        name: 'Heredity and Evolution',
        topics: ['Mendel\'s Laws', 'Sex Determination', 'Evolution and Classification', 'Acquired and Inherited Traits'],
        completed: false
      },
      {
        id: 'light',
        name: 'Light - Reflection and Refraction',
        topics: ['Reflection of Light', 'Spherical Mirrors', 'Refraction of Light', 'Lenses'],
        completed: false
      },
      {
        id: 'human-eye',
        name: 'The Human Eye and Colourful World',
        topics: ['Structure of Human Eye', 'Defects of Vision', 'Dispersion of Light', 'Atmospheric Refraction'],
        completed: false
      },
      {
        id: 'electricity',
        name: 'Electricity',
        topics: ['Electric Current', 'Ohm\'s Law', 'Resistance', 'Electric Power'],
        completed: false
      },
      {
        id: 'magnetic-effects',
        name: 'Magnetic Effects of Electric Current',
        topics: ['Magnetic Field', 'Electromagnetic Induction', 'Electric Motor', 'Electric Generator'],
        completed: false
      },
      {
        id: 'our-environment',
        name: 'Our Environment',
        topics: ['Ecosystem', 'Food Chains and Webs', 'Biodegradable and Non-biodegradable Substances', 'Ozone Depletion'],
        completed: false
      }
    ]
  },
  {
    id: 'english-first-flight',
    name: 'English - First Flight',
    icon: '📚',
    progress: 0,
    chapters: [
      {
        id: 'letter-to-god',
        name: 'A Letter to God',
        topics: ['Faith and Trust', 'Character Analysis', 'Theme and Message', 'Writing Skills'],
        completed: false
      },
      {
        id: 'nelson-mandela',
        name: 'Nelson Mandela: Long Walk to Freedom',
        topics: ['Apartheid', 'Freedom Struggle', 'Leadership Qualities', 'Social Justice'],
        completed: false
      },
      {
        id: 'two-stories-flying',
        name: 'Two Stories about Flying',
        topics: ['His First Flight', 'The Black Aeroplane', 'Courage and Determination', 'Overcoming Fear'],
        completed: false
      },
      {
        id: 'diary-anne-frank',
        name: 'From the Diary of Anne Frank',
        topics: ['Holocaust', 'Personal Experiences', 'Hope and Resilience', 'Human Rights'],
        completed: false
      },
      {
        id: 'glimpses-india',
        name: 'Glimpses of India',
        topics: ['A Baker from Goa', 'Coorg', 'Tea from Assam', 'Cultural Diversity'],
        completed: false
      },
      {
        id: 'mijbil-otter',
        name: 'Mijbil the Otter',
        topics: ['Human-Animal Bond', 'Adaptation', 'Conservation', 'Pet Care'],
        completed: false
      },
      {
        id: 'madam-rides-bus',
        name: 'Madam Rides the Bus',
        topics: ['Childhood Curiosity', 'Independence', 'Growing Up', 'Social Awareness'],
        completed: false
      },
      {
        id: 'sermon-benares',
        name: 'The Sermon at Benares',
        topics: ['Buddha\'s Teachings', 'Life and Death', 'Spiritual Wisdom', 'Enlightenment'],
        completed: false
      },
      {
        id: 'proposal',
        name: 'The Proposal',
        topics: ['Comedy Elements', 'Character Traits', 'Marriage Customs', 'Social Satire'],
        completed: false
      }
    ]
  },
  {
    id: 'english-footprints',
    name: 'English - Footprints without Feet',
    icon: '👣',
    progress: 0,
    chapters: [
      {
        id: 'triumph-surgery',
        name: 'A Triumph of Surgery',
        topics: ['Veterinary Care', 'Animal Welfare', 'Responsible Pet Ownership', 'Medical Ethics'],
        completed: false
      },
      {
        id: 'thief-story',
        name: 'The Thief\'s Story',
        topics: ['Moral Transformation', 'Trust and Friendship', 'Social Issues', 'Character Development'],
        completed: false
      },
      {
        id: 'midnight-visitor',
        name: 'The Midnight Visitor',
        topics: ['Suspense and Thriller', 'Quick Thinking', 'Espionage', 'Plot Twists'],
        completed: false
      },
      {
        id: 'question-of-trust',
        name: 'A Question of Trust',
        topics: ['Crime and Punishment', 'Deception', 'Trust Issues', 'Social Commentary'],
        completed: false
      },
      {
        id: 'footprints-without-feet',
        name: 'Footprints without Feet',
        topics: ['Science Fiction', 'Ethical Use of Science', 'Invisibility', 'Social Responsibility'],
        completed: false
      },
      {
        id: 'making-of-scientist',
        name: 'The Making of a Scientist',
        topics: ['Scientific Temperament', 'Curiosity and Research', 'Persistence', 'Innovation'],
        completed: false
      },
      {
        id: 'necklace',
        name: 'The Necklace',
        topics: ['Materialism', 'Pride and Vanity', 'Life Lessons', 'Social Status'],
        completed: false
      },
      {
        id: 'hack-driver',
        name: 'The Hack Driver',
        topics: ['Rural vs Urban Life', 'Human Nature', 'Deception', 'Social Commentary'],
        completed: false
      },
      {
        id: 'bholi',
        name: 'Bholi',
        topics: ['Women Empowerment', 'Education', 'Self-Confidence', 'Social Reform'],
        completed: false
      },
      {
        id: 'book-saved-earth',
        name: 'The Book That Saved the Earth',
        topics: ['Science Fiction', 'Power of Books', 'Space Exploration', 'Humor and Satire'],
        completed: false
      }
    ]
  },
  {
    id: 'social-science',
    name: 'Social Science',
    icon: '🌍',
    progress: 0,
    chapters: [
      {
        id: 'rise-of-nationalism',
        name: 'The Rise of Nationalism in Europe',
        topics: ['French Revolution', 'Napoleon', 'German and Italian Unification', 'Romanticism'],
        completed: false
      },
      {
        id: 'nationalism-india',
        name: 'Nationalism in India',
        topics: ['Non-Cooperation Movement', 'Civil Disobedience', 'Quit India Movement', 'Partition'],
        completed: false
      },
      {
        id: 'making-global-world',
        name: 'The Making of a Global World',
        topics: ['Pre-modern World', 'Industrial Revolution', 'Great Depression', 'Globalization'],
        completed: false
      },
      {
        id: 'age-of-industrialization',
        name: 'The Age of Industrialization',
        topics: ['Proto-industrialization', 'Factory System', 'Workers and Industrialization', 'Industrial Cities'],
        completed: false
      },
      {
        id: 'print-culture',
        name: 'Print Culture and the Modern World',
        topics: ['Print Revolution', 'Print and Reformation', 'Print and French Revolution', 'Print in India'],
        completed: false
      },
      {
        id: 'resources-development',
        name: 'Resources and Development',
        topics: ['Types of Resources', 'Land Resources', 'Soil as Resource', 'Resource Planning'],
        completed: false
      },
      {
        id: 'forest-wildlife',
        name: 'Forest and Wildlife Resources',
        topics: ['Biodiversity', 'Forest Types', 'Deforestation', 'Conservation'],
        completed: false
      },
      {
        id: 'water-resources',
        name: 'Water Resources',
        topics: ['Water Scarcity', 'Multi-purpose Projects', 'Rainwater Harvesting', 'Water Conservation'],
        completed: false
      },
      {
        id: 'agriculture',
        name: 'Agriculture',
        topics: ['Types of Farming', 'Cropping Patterns', 'Major Crops', 'Agricultural Development'],
        completed: false
      },
      {
        id: 'minerals-energy',
        name: 'Minerals and Energy Resources',
        topics: ['Types of Minerals', 'Distribution of Minerals', 'Energy Resources', 'Conservation'],
        completed: false
      },
      {
        id: 'manufacturing-industries',
        name: 'Manufacturing Industries',
        topics: ['Industrial Location', 'Textile Industry', 'Iron and Steel Industry', 'Industrial Pollution'],
        completed: false
      },
      {
        id: 'power-sharing',
        name: 'Power Sharing',
        topics: ['Democracy and Diversity', 'Forms of Power Sharing', 'Federal System', 'Language Policy'],
        completed: false
      },
      {
        id: 'federalism',
        name: 'Federalism',
        topics: ['Federal Features', 'Union and State Lists', 'Local Governments', 'Decentralization'],
        completed: false
      },
      {
        id: 'democracy-diversity',
        name: 'Democracy and Diversity',
        topics: ['Caste and Politics', 'Religion and Politics', 'Gender and Politics', 'Social Divisions'],
        completed: false
      },
      {
        id: 'political-parties',
        name: 'Political Parties',
        topics: ['Party System', 'National and Regional Parties', 'Party Reforms', 'Electoral System'],
        completed: false
      },
      {
        id: 'outcomes-democracy',
        name: 'Outcomes of Democracy',
        topics: ['Democratic Rights', 'Economic Growth', 'Inequality', 'Social Justice'],
        completed: false
      },
      {
        id: 'development',
        name: 'Development',
        topics: ['Development Indicators', 'Income and Other Goals', 'National Development', 'Sustainability'],
        completed: false
      },
      {
        id: 'sectors-economy',
        name: 'Sectors of the Indian Economy',
        topics: ['Primary, Secondary, Tertiary Sectors', 'GDP', 'Employment', 'Organized and Unorganized Sectors'],
        completed: false
      },
      {
        id: 'money-credit',
        name: 'Money and Credit',
        topics: ['Modern Forms of Money', 'Banking System', 'Credit', 'Self Help Groups'],
        completed: false
      },
      {
        id: 'globalization',
        name: 'Globalization and the Indian Economy',
        topics: ['Production and Trade', 'Foreign Investment', 'WTO', 'Impact on India'],
        completed: false
      },
      {
        id: 'consumer-rights',
        name: 'Consumer Rights',
        topics: ['Consumer Exploitation', 'Consumer Rights', 'Redressal Mechanism', 'Consumer Awareness'],
        completed: false
      }
    ]
  },
  {
    id: 'hindi',
    name: 'Hindi',
    icon: '🇮🇳',
    progress: 0,
    chapters: [
      {
        id: 'surdas-ke-pad',
        name: 'सूरदास के पद',
        topics: ['भक्ति काव्य', 'कृष्ण भक्ति', 'गोपियों के विरह', 'सूर के काव्य सौंदर्य'],
        completed: false
      },
      {
        id: 'ram-lakshman-parashuram',
        name: 'राम-लक्ष्मण-परशुराम संवाद',
        topics: ['तुलसीदास', 'धनुष भंग', 'वीर रस', 'संवाद शैली'],
        completed: false
      },
      {
        id: 'savetlana-ka-geet',
        name: 'सवैया और कवित्त',
        topics: ['देव के काव्य', 'प्रकृति चित्रण', 'श्रृंगार रस', 'अलंकार योजना'],
        completed: false
      },
      {
        id: 'aatmakatha',
        name: 'आत्मकथ्य',
        topics: ['जयशंकर प्रसाद', 'छायावाद', 'व्यक्तिगत अनुभव', 'भावनाओं की अभिव्यक्ति'],
        completed: false
      },
      {
        id: 'utsaah-aasha',
        name: 'उत्साह और अट नहीं रही है',
        topics: ['सूर्यकांत त्रिपाठी निराला', 'प्रगतिवाद', 'क्रांतिकारी भावना', 'प्रकृति प्रेम'],
        completed: false
      },
      {
        id: 'yeh-danturit-muskan',
        name: 'यह दंतुरित मुस्कान और फसल',
        topics: ['नागार्जुन', 'बच्चों का संसार', 'किसान जीवन', 'समाजवादी चेतना'],
        completed: false
      },
      {
        id: 'chhaya-mat-chhuna',
        name: 'छाया मत छूना',
        topics: ['गिरिजा कुमार माथुर', 'नयी कविता', 'दर्शन और काव्य', 'जीवन संघर्ष'],
        completed: false
      },
      {
        id: 'kanyadan',
        name: 'कन्यादान',
        topics: ['ऋतुराज', 'स्त्री शिक्षा', 'सामाजिक बदलाव', 'पारिवारिक रिश्ते'],
        completed: false
      },
      {
        id: 'sanskriti',
        name: 'संस्कृति',
        topics: ['भवानी प्रसाद मिश्र', 'सांस्कृतिक मूल्य', 'परंपरा और आधुनिकता', 'राष्ट्रीय चेतना'],
        completed: false
      },
      {
        id: 'kritika-chapters',
        name: 'कृतिका - गद्य खंड',
        topics: ['माता का अंचल', 'जॉर्ज पंचम की नाक', 'साना साना हाथ जोड़ि', 'एही ठैयाँ झुलनी हेरानी हो रामा'],
        completed: false
      }
    ]
  }
];

export const SyllabusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);

  const updateChapterProgress = (subjectId: string, chapterId: string, completed: boolean) => {
    setSubjects(prevSubjects =>
      prevSubjects.map(subject => {
        if (subject.id === subjectId) {
          const updatedChapters = subject.chapters.map(chapter =>
            chapter.id === chapterId ? { ...chapter, completed } : chapter
          );
          
          const completedCount = updatedChapters.filter(ch => ch.completed).length;
          const progress = Math.round((completedCount / updatedChapters.length) * 100);
          
          return { ...subject, chapters: updatedChapters, progress };
        }
        return subject;
      })
    );
  };

  return (
    <SyllabusContext.Provider value={{ subjects, updateChapterProgress }}>
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
