import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import './DailyJournal.css';

const DailyJournal = ({ onEntryAdded }) => {
  const [journalEntries, setJournalEntries] = useLocalStorage('journal_entries', []);
  const [currentEntry, setCurrentEntry] = useState('');
  const [gratitude, setGratitude] = useState(['', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);

  const journalPrompts = [
    "What made you smile today?",
    "What challenge did you overcome?",
    "How did you take care of yourself today?",
    "What are you looking forward to tomorrow?",
    "Describe a moment when you felt peaceful today.",
    "What lesson did you learn today?",
    "Who or what are you grateful for?",
    "How did you show kindness today?"
  ];

  const todaysDate = new Date().toDateString();
  const todaysEntry = journalEntries.find(entry => 
    new Date(entry.date).toDateString() === todaysDate
  );

  const handleGratitudeChange = (index, value) => {
    const newGratitude = [...gratitude];
    newGratitude[index] = value;
    setGratitude(newGratitude);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentEntry.trim()) return;

    setIsSubmitting(true);

    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content: currentEntry,
      gratitude: gratitude.filter(item => item.trim()),
      wordCount: currentEntry.trim().split(/\s+/).length,
      mood: null // Can be linked to mood if logged same day
    };

    const updatedEntries = [newEntry, ...journalEntries.slice(0, 49)]; // Keep last 50
    setJournalEntries(updatedEntries);
    
    // Clear form
    setCurrentEntry('');
    setGratitude(['', '', '']);
    setIsSubmitting(false);

    if (onEntryAdded) {
      onEntryAdded(newEntry);
    }
  };

  const getRandomPrompt = () => {
    return journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
  };

  if (todaysEntry) {
    return (
      <div className="daily-journal completed">
        <h3>✅ Today's Journal Entry</h3>
        <div className="journal-preview">
          <p><strong>Written:</strong> {new Date(todaysEntry.date).toLocaleTimeString()}</p>
          <p><strong>Words:</strong> {todaysEntry.wordCount}</p>
          <div className="entry-preview">
            {todaysEntry.content.length > 150 
              ? `${todaysEntry.content.substring(0, 150)}...` 
              : todaysEntry.content}
          </div>
          {todaysEntry.gratitude.length > 0 && (
            <div className="gratitude-preview">
              <strong>Grateful for:</strong> {todaysEntry.gratitude.join(', ')}
            </div>
          )}
        </div>
        <button 
          className="btn btn-secondary"
          onClick={() => setJournalEntries(journalEntries.filter(e => e.id !== todaysEntry.id))}
        >
          Write New Entry
        </button>
      </div>
    );
  }

  return (
    <div className="daily-journal">
      <h3>📖 Daily Reflection</h3>
      <p className="journal-subtitle">Take a moment to reflect on your day</p>

      <form onSubmit={handleSubmit}>
        <div className="journal-prompts">
          <button 
            type="button"
            className="prompt-toggle"
            onClick={() => setShowPrompts(!showPrompts)}
          >
            {showPrompts ? '🙈 Hide' : '💡 Need inspiration?'}
          </button>
          
          {showPrompts && (
            <div className="prompts-list">
              <p><strong>Try writing about:</strong></p>
              <div className="prompt-buttons">
                {journalPrompts.slice(0, 4).map((prompt, index) => (
                  <button
                    key={index}
                    type="button"
                    className="prompt-btn"
                    onClick={() => setCurrentEntry(prompt + '\n\n')}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <button 
                type="button"
                className="random-prompt-btn"
                onClick={() => setCurrentEntry(getRandomPrompt() + '\n\n')}
              >
                🎲 Random prompt
              </button>
            </div>
          )}
        </div>

        <div className="journal-input">
          <textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            placeholder="How was your day? What's on your mind? Write freely about your thoughts, feelings, and experiences..."
            className="journal-textarea"
            rows="8"
            required
          />
          <div className="word-count">
            {currentEntry.trim() ? currentEntry.trim().split(/\s+/).length : 0} words
          </div>
        </div>

        <div className="gratitude-section">
          <h4>🙏 Three Good Things</h4>
          <p>What are you grateful for today?</p>
          {gratitude.map((item, index) => (
            <input
              key={index}
              type="text"
              value={item}
              onChange={(e) => handleGratitudeChange(index, e.target.value)}
              placeholder={`Something good #${index + 1}...`}
              className="gratitude-input"
            />
          ))}
        </div>

        <button 
          type="submit"
          className="btn btn-primary journal-submit"
          disabled={!currentEntry.trim() || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : '💾 Save Entry'}
        </button>
      </form>

      {journalEntries.length > 0 && (
        <div className="journal-stats">
          <p>📊 <strong>{journalEntries.length}</strong> entries written • Average <strong>{Math.round(journalEntries.reduce((sum, entry) => sum + entry.wordCount, 0) / journalEntries.length)}</strong> words per entry</p>
        </div>
      )}
    </div>
  );
};

export default DailyJournal;
