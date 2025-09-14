import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import './WellnessChallenges.css';

const WellnessChallenges = ({ onChallengeCompleted }) => {
  const [userChallenges, setUserChallenges] = useLocalStorage('wellness_challenges', []);

  const availableChallenges = [
    {
      id: 'gratitude_7',
      title: '7 Days of Gratitude',
      description: 'Write down 3 things you\'re grateful for each day',
      duration: 7,
      category: 'mindfulness',
      difficulty: 'easy',
      badge: '🙏',
      color: '#f59e0b',
      tasks: [
        'Day 1: List 3 things you\'re grateful for today',
        'Day 2: Express gratitude to someone in your life',
        'Day 3: Find beauty in something ordinary',
        'Day 4: Appreciate a challenge that helped you grow',
        'Day 5: Be thankful for your body and health',
        'Day 6: Acknowledge someone who supports you',
        'Day 7: Reflect on your personal achievements'
      ]
    },
    {
      id: 'movement_5',
      title: '5-Minute Daily Movement',
      description: 'Move your body for at least 5 minutes every day',
      duration: 7,
      category: 'physical',
      difficulty: 'easy',
      badge: '🏃‍♀️',
      color: '#22c55e',
      tasks: [
        'Day 1: Take a 5-minute walk',
        'Day 2: Do some gentle stretching',
        'Day 3: Dance to your favorite songs',
        'Day 4: Try basic yoga poses',
        'Day 5: Do jumping jacks or push-ups',
        'Day 6: Walk up and down stairs',
        'Day 7: Free choice - any movement!'
      ]
    },
    {
      id: 'digital_detox',
      title: 'Digital Sunset Challenge',
      description: 'No screens 1 hour before bedtime for a week',
      duration: 7,
      category: 'wellness',
      difficulty: 'medium',
      badge: '🌅',
      color: '#8b5cf6',
      tasks: [
        'Day 1: Put devices away 1 hour before bed',
        'Day 2: Read a book instead of scrolling',
        'Day 3: Try meditation or deep breathing',
        'Day 4: Write in a journal',
        'Day 5: Listen to calming music',
        'Day 6: Do gentle stretches',
        'Day 7: Plan tomorrow without screens'
      ]
    },
    {
      id: 'kindness_week',
      title: 'Acts of Kindness Week',
      description: 'Perform one act of kindness each day',
      duration: 7,
      category: 'social',
      difficulty: 'easy',
      badge: '💝',
      color: '#ec4899',
      tasks: [
        'Day 1: Compliment a stranger',
        'Day 2: Help someone with a task',
        'Day 3: Send an encouraging message',
        'Day 4: Donate to a cause you care about',
        'Day 5: Volunteer your time',
        'Day 6: Listen actively to someone',
        'Day 7: Forgive someone (including yourself)'
      ]
    },
    {
      id: 'hydration_challenge',
      title: 'Stay Hydrated Challenge',
      description: 'Drink 8 glasses of water daily for a week',
      duration: 7,
      category: 'health',
      difficulty: 'medium',
      badge: '💧',
      color: '#06b6d4',
      tasks: [
        'Day 1: Start with a glass of water upon waking',
        'Day 2: Set hourly reminders to drink water',
        'Day 3: Try infused water with fruits',
        'Day 4: Replace one sugary drink with water',
        'Day 5: Drink water before each meal',
        'Day 6: Carry a water bottle everywhere',
        'Day 7: Celebrate your hydration success!'
      ]
    },
    {
      id: 'creative_spark',
      title: 'Creative Spark Week',
      description: 'Engage in a creative activity every day',
      duration: 7,
      category: 'creativity',
      difficulty: 'medium',
      badge: '🎨',
      color: '#f97316',
      tasks: [
        'Day 1: Draw or sketch something',
        'Day 2: Write a short poem or story',
        'Day 3: Take artistic photos',
        'Day 4: Try a new recipe',
        'Day 5: Make something with your hands',
        'Day 6: Sing or play music',
        'Day 7: Create a vision board'
      ]
    }
  ];

  const getChallengeProgress = (challenge) => {
    if (!challenge) return { completed: 0, total: 0, percentage: 0 };
    
    const progress = challenge.progress || {};
    const completed = Object.keys(progress).length;
    const percentage = (completed / challenge.duration) * 100;
    
    return { completed, total: challenge.duration, percentage };
  };

  const startChallenge = (challengeTemplate) => {
    const newChallenge = {
      ...challengeTemplate,
      startedAt: new Date().toISOString(),
      progress: {},
      status: 'active'
    };
    
    setUserChallenges(prev => [...prev, newChallenge]);
  };

  const markTaskComplete = (challengeId, dayIndex) => {
    const today = new Date().toDateString();
    
    setUserChallenges(prev => prev.map(challenge => {
      if (challenge.id !== challengeId) return challenge;
      
      const progress = challenge.progress || {};
      const dayKey = `day_${dayIndex + 1}`;
      
      const newProgress = { ...progress };
      if (newProgress[dayKey]) {
        delete newProgress[dayKey];
      } else {
        newProgress[dayKey] = {
          completed: true,
          completedAt: today
        };
      }
      
      const updatedChallenge = { ...challenge, progress: newProgress };
      const challengeProgress = getChallengeProgress(updatedChallenge);
      
      if (challengeProgress.percentage >= 100 && challenge.status === 'active') {
        updatedChallenge.status = 'completed';
        updatedChallenge.completedAt = new Date().toISOString();
        
        if (onChallengeCompleted) {
          onChallengeCompleted(updatedChallenge);
        }
      }
      
      return updatedChallenge;
    }));
  };

  const deleteChallenge = (challengeId) => {
    setUserChallenges(prev => prev.filter(c => c.id !== challengeId));
  };

  const activeChallenges = userChallenges.filter(c => c.status === 'active');
  const completedChallenges = userChallenges.filter(c => c.status === 'completed');
  const availableToStart = availableChallenges.filter(
    template => !userChallenges.some(uc => uc.id === template.id && uc.status === 'active')
  );

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: '#22c55e',
      medium: '#f59e0b',
      hard: '#ef4444'
    };
    return colors[difficulty] || '#6b7280';
  };

  const getDaysRemaining = (challenge) => {
    const startDate = new Date(challenge.startedAt);
    const endDate = new Date(startDate.getTime() + challenge.duration * 24 * 60 * 60 * 1000);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return (
    <div className="wellness-challenges">
      <div className="challenges-header">
        <h3>🏆 Wellness Challenges</h3>
        <div className="challenge-stats">
          <span>Active: {activeChallenges.length}</span>
          <span>Completed: {completedChallenges.length}</span>
        </div>
      </div>

      {/* Active Challenges */}
      {activeChallenges.length > 0 && (
        <div className="challenges-section">
          <h4>🎯 Active Challenges</h4>
          <div className="active-challenges">
            {activeChallenges.map(challenge => {
              const progress = getChallengeProgress(challenge);
              const daysRemaining = getDaysRemaining(challenge);
              
              return (
                <div key={challenge.id} className="active-challenge">
                  <div className="challenge-header">
                    <div className="challenge-info">
                      <span className="challenge-badge" style={{color: challenge.color}}>
                        {challenge.badge}
                      </span>
                      <div>
                        <h5>{challenge.title}</h5>
                        <p>{challenge.description}</p>
                      </div>
                    </div>
                    <div className="challenge-meta">
                      <span className="days-remaining">
                        {daysRemaining === 0 ? 'Last day!' : `${daysRemaining} days left`}
                      </span>
                      <button 
                        className="delete-challenge"
                        onClick={() => deleteChallenge(challenge.id)}
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                  
                  <div className="progress-overview">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{
                          width: `${progress.percentage}%`,
                          backgroundColor: challenge.color
                        }}
                      />
                    </div>
                    <span className="progress-text">
                      {progress.completed}/{progress.total} days ({Math.round(progress.percentage)}%)
                    </span>
                  </div>
                  
                  <div className="challenge-tasks">
                    {challenge.tasks.map((task, index) => {
                      const dayKey = `day_${index + 1}`;
                      const isCompleted = challenge.progress && challenge.progress[dayKey];
                      
                      return (
                        <div key={index} className={`task-item ${isCompleted ? 'completed' : ''}`}>
                          <button
                            className="task-checkbox"
                            onClick={() => markTaskComplete(challenge.id, index)}
                          >
                            {isCompleted ? '✅' : '⭕'}
                          </button>
                          <span className="task-text">{task}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Challenges */}
      {availableToStart.length > 0 && (
        <div className="challenges-section">
          <h4>🚀 Start a New Challenge</h4>
          <div className="available-challenges">
            {availableToStart.map(challenge => (
              <div key={challenge.id} className="challenge-card">
                <div className="card-header">
                  <span className="challenge-badge" style={{color: challenge.color}}>
                    {challenge.badge}
                  </span>
                  <span 
                    className="difficulty-badge"
                    style={{backgroundColor: getDifficultyColor(challenge.difficulty)}}
                  >
                    {challenge.difficulty}
                  </span>
                </div>
                
                <h5>{challenge.title}</h5>
                <p>{challenge.description}</p>
                
                <div className="challenge-details">
                  <span>📅 {challenge.duration} days</span>
                  <span>🏷️ {challenge.category}</span>
                </div>
                
                <button 
                  className="btn btn-primary start-challenge"
                  onClick={() => startChallenge(challenge)}
                >
                  Start Challenge
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Challenges */}
      {completedChallenges.length > 0 && (
        <div className="challenges-section">
          <h4>🏆 Completed Challenges</h4>
          <div className="completed-challenges">
            {completedChallenges.map(challenge => {
              const completedDate = new Date(challenge.completedAt).toLocaleDateString();
              
              return (
                <div key={challenge.id} className="completed-challenge">
                  <span className="challenge-badge" style={{color: challenge.color}}>
                    {challenge.badge}
                  </span>
                  <div className="challenge-info">
                    <h6>{challenge.title}</h6>
                    <span>Completed on {completedDate}</span>
                  </div>
                  <span className="completion-badge">🎉</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {userChallenges.length === 0 && (
        <div className="empty-challenges">
          <div className="empty-icon">🏆</div>
          <h4>Ready for a Challenge?</h4>
          <p>Take on wellness challenges to build healthy habits and earn badges!</p>
        </div>
      )}
    </div>
  );
};

export default WellnessChallenges;
