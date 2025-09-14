import React, { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import './GoalTracker.css';

const GoalTracker = ({ onGoalCompleted }) => {
  const [goals, setGoals] = useLocalStorage('user_goals', []);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'wellness',
    targetValue: 7,
    targetUnit: 'days',
    deadline: '',
    priority: 'medium'
  });

  const goalCategories = {
    wellness: { name: 'General Wellness', icon: '🌱', color: '#22c55e' },
    exercise: { name: 'Physical Activity', icon: '💪', color: '#f59e0b' },
    mindfulness: { name: 'Mindfulness', icon: '🧘', color: '#8b5cf6' },
    social: { name: 'Social Connection', icon: '👥', color: '#06b6d4' },
    sleep: { name: 'Sleep Health', icon: '😴', color: '#6366f1' },
    nutrition: { name: 'Nutrition', icon: '🥗', color: '#10b981' },
    learning: { name: 'Learning & Growth', icon: '📚', color: '#f97316' },
    creativity: { name: 'Creative Expression', icon: '🎨', color: '#ec4899' }
  };

  const priorityColors = {
    low: '#94a3b8',
    medium: '#f59e0b', 
    high: '#ef4444'
  };

  const getGoalProgress = (goal) => {
    const today = new Date().toDateString();
    const progress = goal.progress || {};
    const completedDays = Object.keys(progress).length;
    const progressPercentage = Math.min((completedDays / goal.targetValue) * 100, 100);
    const todayCompleted = progress[today] || false;
    
    return {
      completedDays,
      progressPercentage,
      todayCompleted,
      isComplete: progressPercentage >= 100
    };
  };

  const handleCreateGoal = () => {
    if (!newGoal.title.trim()) return;

    const goal = {
      id: Date.now().toString(),
      ...newGoal,
      createdAt: new Date().toISOString(),
      progress: {},
      status: 'active'
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({
      title: '',
      description: '',
      category: 'wellness',
      targetValue: 7,
      targetUnit: 'days',
      deadline: '',
      priority: 'medium'
    });
    setShowAddGoal(false);
  };

  const toggleDailyProgress = (goalId) => {
    const today = new Date().toDateString();
    
    setGoals(prev => prev.map(goal => {
      if (goal.id !== goalId) return goal;
      
      const progress = goal.progress || {};
      const newProgress = { ...progress };
      
      if (newProgress[today]) {
        delete newProgress[today];
      } else {
        newProgress[today] = true;
      }
      
      const updatedGoal = { ...goal, progress: newProgress };
      const { isComplete } = getGoalProgress(updatedGoal);
      
      if (isComplete && !goal.completedAt) {
        updatedGoal.completedAt = new Date().toISOString();
        updatedGoal.status = 'completed';
        if (onGoalCompleted) {
          onGoalCompleted(updatedGoal);
        }
      } else if (!isComplete && goal.completedAt) {
        delete updatedGoal.completedAt;
        updatedGoal.status = 'active';
      }
      
      return updatedGoal;
    }));
  };

  const deleteGoal = (goalId) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const getStreakInfo = (goal) => {
    const progress = goal.progress || {};
    const sortedDates = Object.keys(progress).sort((a, b) => new Date(b) - new Date(a));
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date();
    
    // Calculate current streak
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateString = checkDate.toDateString();
      
      if (progress[dateString]) {
        if (i === 0 || currentStreak > 0) {
          currentStreak++;
        }
      } else if (i === 0) {
        break;
      } else {
        break;
      }
    }
    
    // Calculate longest streak
    sortedDates.forEach(dateString => {
      if (progress[dateString]) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    });
    
    return { currentStreak, longestStreak };
  };

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');

  return (
    <div className="goal-tracker">
      <div className="goal-header">
        <h3>🎯 Goals & Progress</h3>
        <button 
          className="btn btn-primary btn-sm"
          onClick={() => setShowAddGoal(true)}
        >
          ➕ New Goal
        </button>
      </div>

      {showAddGoal && (
        <div className="add-goal-form">
          <h4>Create New Goal</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Goal Title</label>
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                placeholder="e.g., Daily meditation"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <select
                value={newGoal.category}
                onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                className="form-select"
              >
                {Object.entries(goalCategories).map(([key, cat]) => (
                  <option key={key} value={key}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Target</label>
              <div className="target-inputs">
                <input
                  type="number"
                  value={newGoal.targetValue}
                  onChange={(e) => setNewGoal({...newGoal, targetValue: parseInt(e.target.value)})}
                  className="form-input"
                  min="1"
                />
                <select
                  value={newGoal.targetUnit}
                  onChange={(e) => setNewGoal({...newGoal, targetUnit: e.target.value})}
                  className="form-select"
                >
                  <option value="days">days</option>
                  <option value="times">times</option>
                  <option value="hours">hours</option>
                  <option value="sessions">sessions</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Priority</label>
              <select
                value={newGoal.priority}
                onChange={(e) => setNewGoal({...newGoal, priority: e.target.value})}
                className="form-select"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            
            <div className="form-group full-width">
              <label>Description (Optional)</label>
              <textarea
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                placeholder="Why is this goal important to you?"
                className="form-textarea"
                rows="2"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleCreateGoal}>
              Create Goal
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setShowAddGoal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {activeGoals.length > 0 && (
        <div className="goals-section">
          <h4>🎯 Active Goals ({activeGoals.length})</h4>
          <div className="goals-grid">
            {activeGoals.map(goal => {
              const category = goalCategories[goal.category];
              const progress = getGoalProgress(goal);
              const streak = getStreakInfo(goal);
              
              return (
                <div key={goal.id} className="goal-card">
                  <div className="goal-card-header">
                    <div className="goal-info">
                      <div className="goal-category" style={{color: category.color}}>
                        {category.icon} {category.name}
                      </div>
                      <div 
                        className="goal-priority"
                        style={{color: priorityColors[goal.priority]}}
                      >
                        ⭐ {goal.priority}
                      </div>
                    </div>
                    <button 
                      className="delete-goal"
                      onClick={() => deleteGoal(goal.id)}
                      title="Delete goal"
                    >
                      ❌
                    </button>
                  </div>
                  
                  <h5 className="goal-title">{goal.title}</h5>
                  {goal.description && (
                    <p className="goal-description">{goal.description}</p>
                  )}
                  
                  <div className="progress-section">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{
                          width: `${progress.progressPercentage}%`,
                          backgroundColor: category.color
                        }}
                      />
                    </div>
                    <div className="progress-text">
                      {progress.completedDays} / {goal.targetValue} {goal.targetUnit} 
                      ({Math.round(progress.progressPercentage)}%)
                    </div>
                  </div>
                  
                  <div className="streak-info">
                    <span>🔥 Current: {streak.currentStreak} days</span>
                    <span>🏆 Best: {streak.longestStreak} days</span>
                  </div>
                  
                  <button
                    className={`daily-check ${progress.todayCompleted ? 'completed' : ''}`}
                    onClick={() => toggleDailyProgress(goal.id)}
                  >
                    {progress.todayCompleted ? '✅ Done Today!' : '⭕ Mark Today Complete'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {completedGoals.length > 0 && (
        <div className="goals-section">
          <h4>🏆 Completed Goals ({completedGoals.length})</h4>
          <div className="completed-goals">
            {completedGoals.map(goal => {
              const category = goalCategories[goal.category];
              const completedDate = new Date(goal.completedAt).toLocaleDateString();
              
              return (
                <div key={goal.id} className="completed-goal">
                  <span className="goal-icon">{category.icon}</span>
                  <div className="goal-info">
                    <span className="goal-name">{goal.title}</span>
                    <span className="completion-date">Completed on {completedDate}</span>
                  </div>
                  <span className="completion-badge">🎉</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <div className="empty-goals">
          <div className="empty-icon">🎯</div>
          <h4>No Goals Set Yet</h4>
          <p>Set your first wellness goal to start tracking your progress!</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddGoal(true)}
          >
            Create Your First Goal
          </button>
        </div>
      )}
    </div>
  );
};

export default GoalTracker;
