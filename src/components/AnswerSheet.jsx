import React from 'react';
import './AnswerSheet.css';

const OPTIONS = ['A', 'B', 'C', 'D'];

const AnswerSheet = ({ sectionTitle, startIndex, questions, onSelectChoice, onToggleCorrect }) => {
  return (
    <div className="answer-sheet-section glass-panel">
      <h2 className="section-title text-gradient">{sectionTitle}</h2>
      <div className="questions-list">
        {questions.map((q, index) => {
          const questionNumber = startIndex + index;
          return (
            <div key={questionNumber} className={`question-row ${q.isCorrect ? 'marked-correct' : q.isCorrect === false ? 'marked-wrong' : ''}`}>
              <div className="question-number">{questionNumber}.</div>
              
              <div className="options-group">
                {OPTIONS.map(opt => (
                  <button
                    key={opt}
                    className={`option-btn ${q.choice === opt ? 'selected' : ''}`}
                    onClick={() => onSelectChoice(index, opt)}
                    aria-label={`Question ${questionNumber} Option ${opt}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              
              <div className="mark-group">
                <button 
                  className={`mark-btn correct-btn ${q.isCorrect === true ? 'active' : ''}`}
                  onClick={() => onToggleCorrect(index, true)}
                  title="Mark Correct"
                >
                  ✓
                </button>
                <button 
                  className={`mark-btn wrong-btn ${q.isCorrect === false ? 'active' : ''}`}
                  onClick={() => onToggleCorrect(index, false)}
                  title="Mark Incorrect"
                >
                  ✗
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnswerSheet;
