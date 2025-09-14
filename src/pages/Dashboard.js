import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMoodData, useActivityLog } from '../hooks/useLocalStorage';
import MoodLogger from '../components/common/MoodLogger';
import DailyJournal from '../components/common/DailyJournal';
import BreathingExercise from '../components/common/BreathingExercise';
import CrisisSupport from '../components/common/CrisisSupport';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { moodEntries, addMoodEntry, getMoodAverage, getMoodTrend } = useMoodData();
  const { logActivity, getRecentActivities } = useActivityLog();
  const [showMoodLogger, setShowMoodLogger] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);

  const handleMoodLogged = async (mood, notes) => {
    const entry = addMoodEntry(mood, notes);
    logActivity('mood', `Logged mood: ${mood}/10`, { mood, notes });
    setShowMoodLogger(false);
    return entry;
  };

  const handleQuickAction = (action) => {
    logActivity(action, `Started ${action}`);
    
    switch (action) {
      case 'assessment':
        navigate('/assessment');
        break;
      case 'resources':
        navigate('/resources');
        break;
      case 'mood':
        setShowMoodLogger(true);
        break;
      case 'journal':
        setShowJournal(true);
        break;
      case 'breathing':
        setShowBreathing(true);
        break;
      case 'wellness':
        navigate('/wellness');
        break;
      default:
        break;
    }
  };

  const handleJournalEntry = (entry) => {
    logActivity('journal', `Wrote journal entry (${entry.wordCount} words)`);
    setShowJournal(false);
  };

  const handleBreathingComplete = (session) => {
    logActivity('breathing', `Completed ${session.technique} (${session.cycles} cycles)`);
    setShowBreathing(false);
  };

  const moodAverage = getMoodAverage();
  const moodTrend = getMoodTrend();
  const recentActivities = getRecentActivities(5);
  const todaysMood = moodEntries.length > 0 ? moodEntries[moodEntries.length - 1] : null;
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name || 'User'}!</h1>
        <p>How are you feeling today?</p>
        {!(showMoodLogger || showJournal || showBreathing) && (
          <div className="dashboard-quick-buttons">
            <button 
              className="btn btn-primary" 
              onClick={() => setShowMoodLogger(true)}
            >
              📊 Log Mood
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setShowJournal(true)}
            >
              📖 Write Journal
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setShowBreathing(true)}
            >
              🫁 Breathe
            </button>
          </div>
        )}
      </div>

      {showMoodLogger && (
        <div className="activity-container">
          <MoodLogger 
            onMoodLogged={handleMoodLogged}
            currentMood={todaysMood?.mood}
          />
          <button 
            className="btn btn-secondary mt-2" 
            onClick={() => setShowMoodLogger(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {showJournal && (
        <div className="activity-container">
          <DailyJournal onEntryAdded={handleJournalEntry} />
          <button 
            className="btn btn-secondary mt-2" 
            onClick={() => setShowJournal(false)}
          >
            Close Journal
          </button>
        </div>
      )}

      {showBreathing && (
        <div className="activity-container">
          <BreathingExercise onComplete={handleBreathingComplete} />
          <button 
            className="btn btn-secondary mt-2" 
            onClick={() => setShowBreathing(false)}
          >
            Close
          </button>
        </div>
      )}
      
      <CrisisSupport />
      
      <div className="dashboard-grid">
        <div className="dashboard-card mood-tracker">
          <h2>Mood Insights</h2>
          <div className="mood-chart">
            {moodEntries.length > 0 ? (
              <>
                <div className="mood-stats">
                  <div className="mood-stat">
                    <span className="stat-label">7-day Average</span>
                    <span className="stat-value">{moodAverage || 'N/A'}/10</span>
                  </div>
                  <div className="mood-stat">
                    <span className="stat-label">Trend</span>
                    <span className={`stat-value trend-${moodTrend}`}>
                      {moodTrend === 'improving' ? '📈' : 
                       moodTrend === 'declining' ? '📉' : '➡️'} {moodTrend}
                    </span>
                  </div>
                  <div className="mood-stat">
                    <span className="stat-label">Total Entries</span>
                    <span className="stat-value">{moodEntries.length}</span>
                  </div>
                </div>
                {todaysMood && (
                  <div className="last-mood">
                    <p>Last logged: {todaysMood.mood}/10 on {formatDate(todaysMood.date)}</p>
                    {todaysMood.notes && (
                      <p className="mood-notes">"${todaysMood.notes}"</p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <p>Start tracking your mood to see insights here!</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="dashboard-card quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button 
              className="action-btn primary"
              onClick={() => handleQuickAction('assessment')}
            >
              Take Assessment
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => handleQuickAction('resources')}
            >
              Browse Resources
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => handleQuickAction('journal')}
            >
              📖 Daily Journal
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => handleQuickAction('breathing')}
            >
              🫁 Breathing Exercise
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => handleQuickAction('wellness')}
            >
              🌟 Wellness Hub
            </button>
          </div>
        </div>
        
        <div className="dashboard-card recent-activities">
          <h2>Recent Activities</h2>
          <div className="activities-list">
            {recentActivities.length > 0 ? (
              recentActivities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <span className="activity-description">{activity.description}</span>
                  <span className="activity-date">{formatDate(activity.date)}</span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No recent activities. Start by taking an assessment or logging your mood!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
