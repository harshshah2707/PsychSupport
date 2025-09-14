import React, { useState } from 'react';
import { useActivityLog } from '../hooks/useLocalStorage';
import MoodCharts from '../components/charts/MoodCharts';
import GoalTracker from '../components/common/GoalTracker';
import WellnessChallenges from '../components/common/WellnessChallenges';
import './Wellness.css';

const Wellness = () => {
  const { logActivity } = useActivityLog();
  const [activeTab, setActiveTab] = useState('overview');

  const handleGoalCompleted = (goal) => {
    logActivity('goal', `Completed goal: ${goal.title}`, {
      category: goal.category,
      targetValue: goal.targetValue
    });
  };

  const handleChallengeCompleted = (challenge) => {
    logActivity('challenge', `Completed challenge: ${challenge.title}`, {
      category: challenge.category,
      duration: challenge.duration
    });
  };

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'goals', label: '🎯 Goals', icon: '🎯' },
    { id: 'challenges', label: '🏆 Challenges', icon: '🏆' }
  ];

  return (
    <div className="wellness-page">
      <div className="wellness-header">
        <h1>🌟 Wellness Hub</h1>
        <p>Track your progress, set goals, and take on challenges for better mental health</p>
      </div>

      <div className="wellness-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="wellness-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <MoodCharts />
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="goals-section">
            <GoalTracker onGoalCompleted={handleGoalCompleted} />
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="challenges-section">
            <WellnessChallenges onChallengeCompleted={handleChallengeCompleted} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Wellness;
