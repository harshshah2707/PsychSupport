import React, { useState } from 'react';
import './MoodLogger.css';

const MoodLogger = ({ onMoodLogged, currentMood }) => {
  const [mood, setMood] = useState(currentMood || 5);
  const [notes, setNotes] = useState('');
  const [isLogging, setIsLogging] = useState(false);

  const moodEmojis = {
    1: '😢', 2: '😕', 3: '😐', 4: '😊', 5: '🙂',
    6: '😌', 7: '😊', 8: '😄', 9: '🤗', 10: '🌟'
  };

  const moodLabels = {
    1: 'Terrible', 2: 'Bad', 3: 'Poor', 4: 'Fair', 5: 'Okay',
    6: 'Good', 7: 'Great', 8: 'Excellent', 9: 'Amazing', 10: 'Perfect'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLogging(true);

    try {
      await onMoodLogged(mood, notes);
      setNotes('');
      // Keep mood selection for next time
    } catch (error) {
      console.error('Failed to log mood:', error);
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="mood-logger">
      <h3>How are you feeling?</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mood-selector">
          <div className="mood-display">
            <span className="mood-emoji">{moodEmojis[mood]}</span>
            <span className="mood-label">{moodLabels[mood]}</span>
          </div>
          
          <input
            type="range"
            min="1"
            max="10"
            value={mood}
            onChange={(e) => setMood(parseInt(e.target.value))}
            className="mood-slider"
          />
          
          <div className="mood-scale-labels">
            <span>Terrible</span>
            <span>Perfect</span>
          </div>
        </div>
        
        <div className="notes-section">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional: How was your day? What affected your mood?"
            className="mood-notes"
            rows="3"
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isLogging}
        >
          {isLogging ? 'Logging...' : 'Log Mood'}
        </button>
      </form>
    </div>
  );
};

export default MoodLogger;
