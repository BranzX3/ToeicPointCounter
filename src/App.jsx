import { useState, useMemo, useEffect } from 'react';
import AnswerSheet from './components/AnswerSheet';
import ScoreSummary from './components/ScoreSummary';
import ConfirmModal from './components/ConfirmModal';
import { calculateScore } from './utils/scoreConverter';
import './App.css';

const generateInitialState = (count) => {
  return new Array(count).fill(null).map(() => ({ choice: null, isCorrect: null }));
};

const loadState = (key, defaultCount) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error(`Failed to load ${key} from local storage`, e);
  }
  return generateInitialState(defaultCount);
};

function App() {
  const [listeningAnswers, setListeningAnswers] = useState(() => loadState('toeic_listening', 100));
  const [readingAnswers, setReadingAnswers] = useState(() => loadState('toeic_reading', 100));
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Auto-Save
  useEffect(() => {
    localStorage.setItem('toeic_listening', JSON.stringify(listeningAnswers));
  }, [listeningAnswers]);

  useEffect(() => {
    localStorage.setItem('toeic_reading', JSON.stringify(readingAnswers));
  }, [readingAnswers]);

  const handleSelectChoice = (section, index, choice) => {
    const setAnswers = section === 'listening' ? setListeningAnswers : setReadingAnswers;
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[index] = { 
        ...newAnswers[index], 
        choice: newAnswers[index].choice === choice ? null : choice 
      };
      return newAnswers;
    });
  };

  const handleToggleCorrect = (section, index, isCorrect) => {
    const setAnswers = section === 'listening' ? setListeningAnswers : setReadingAnswers;
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[index] = { 
        ...newAnswers[index], 
        isCorrect: newAnswers[index].isCorrect === isCorrect ? null : isCorrect 
      };
      return newAnswers;
    });
  };

  const executeReset = () => {
    setListeningAnswers(generateInitialState(100));
    setReadingAnswers(generateInitialState(100));
    setIsResetModalOpen(false);
  };

  const listeningRaw = listeningAnswers.filter(a => a.isCorrect === true).length;
  const readingRaw = readingAnswers.filter(a => a.isCorrect === true).length;
  
  const scaledScores = useMemo(() => calculateScore(listeningRaw, readingRaw), [listeningRaw, readingRaw]);

  return (
    <div className="container app-layout">
      <header className="app-header">
        <h1 className="text-gradient">TOEIC Answer Sheet</h1>
        <p className="app-subtitle">Mark your choices, then check answers to calculate your scaled TOEIC score.</p>
        <button className="btn btn-primary reset-btn" onClick={() => setIsResetModalOpen(true)}>
          Reset All
        </button>
      </header>

      <div className="main-content">
        <div className="questions-column">
          <AnswerSheet 
            sectionTitle="Listening Section (1-100)" 
            startIndex={1}
            questions={listeningAnswers} 
            onSelectChoice={(idx, choice) => handleSelectChoice('listening', idx, choice)}
            onToggleCorrect={(idx, isCorrect) => handleToggleCorrect('listening', idx, isCorrect)}
          />
          <AnswerSheet 
            sectionTitle="Reading Section (101-200)" 
            startIndex={101}
            questions={readingAnswers} 
            onSelectChoice={(idx, choice) => handleSelectChoice('reading', idx, choice)}
            onToggleCorrect={(idx, isCorrect) => handleToggleCorrect('reading', idx, isCorrect)}
          />
        </div>
        
        <div className="summary-column">
          <ScoreSummary 
            listeningRaw={listeningRaw}
            readingRaw={readingRaw}
            scaledScores={scaledScores}
          />
        </div>
      </div>

      <ConfirmModal 
        isOpen={isResetModalOpen}
        title="Reset All Answers?"
        message="This will clear all your selected choices and marks. This action cannot be undone."
        onConfirm={executeReset}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
}

export default App;
