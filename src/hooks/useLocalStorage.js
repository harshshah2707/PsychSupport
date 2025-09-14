import { useState } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

export const useMoodData = () => {
  const [moodEntries, setMoodEntries] = useLocalStorage('mood_entries', []);

  const addMoodEntry = (mood, notes = '') => {
    const entry = {
      id: Date.now().toString(),
      mood: parseInt(mood),
      notes,
      date: new Date().toISOString(),
      timestamp: Date.now()
    };

    setMoodEntries(prev => [...prev, entry].slice(-30)); // Keep last 30 entries
    return entry;
  };

  const getMoodAverage = (days = 7) => {
    const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
    const recentEntries = moodEntries.filter(entry => entry.timestamp > cutoffDate);
    
    if (recentEntries.length === 0) return 0;
    
    const sum = recentEntries.reduce((total, entry) => total + entry.mood, 0);
    return Math.round((sum / recentEntries.length) * 10) / 10;
  };

  const getMoodTrend = () => {
    if (moodEntries.length < 2) return 'stable';
    
    const recent = moodEntries.slice(-5);
    const older = moodEntries.slice(-10, -5);
    
    const recentAvg = recent.reduce((sum, entry) => sum + entry.mood, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((sum, entry) => sum + entry.mood, 0) / older.length : recentAvg;
    
    const diff = recentAvg - olderAvg;
    
    if (diff > 0.5) return 'improving';
    if (diff < -0.5) return 'declining';
    return 'stable';
  };

  return {
    moodEntries,
    addMoodEntry,
    getMoodAverage,
    getMoodTrend
  };
};

export const useAssessments = () => {
  const [assessments, setAssessments] = useLocalStorage('user_assessments', []);

  const saveAssessment = (responses, type = 'general') => {
    const assessment = {
      id: Date.now().toString(),
      type,
      responses,
      completedAt: new Date().toISOString(),
      score: calculateAssessmentScore(responses)
    };

    setAssessments(prev => [assessment, ...prev]);
    return assessment;
  };

  const getLatestAssessment = () => {
    return assessments.length > 0 ? assessments[0] : null;
  };

  const getAssessmentHistory = () => {
    return assessments;
  };

  return {
    assessments,
    saveAssessment,
    getLatestAssessment,
    getAssessmentHistory
  };
};

export const useSavedResources = () => {
  const [savedResources, setSavedResources] = useLocalStorage('saved_resources', []);

  const saveResource = (resource) => {
    setSavedResources(prev => {
      const exists = prev.find(r => r.id === resource.id);
      if (exists) return prev;
      return [...prev, { ...resource, savedAt: new Date().toISOString() }];
    });
  };

  const unsaveResource = (resourceId) => {
    setSavedResources(prev => prev.filter(r => r.id !== resourceId));
  };

  const isResourceSaved = (resourceId) => {
    return savedResources.some(r => r.id === resourceId);
  };

  return {
    savedResources,
    saveResource,
    unsaveResource,
    isResourceSaved
  };
};

export const useActivityLog = () => {
  const [activities, setActivities] = useLocalStorage('user_activities', []);

  const logActivity = (type, description, metadata = {}) => {
    const activity = {
      id: Date.now().toString(),
      type,
      description,
      metadata,
      timestamp: Date.now(),
      date: new Date().toISOString()
    };

    setActivities(prev => [activity, ...prev].slice(0, 50)); // Keep last 50 activities
    return activity;
  };

  const getRecentActivities = (limit = 5) => {
    return activities.slice(0, limit);
  };

  const getActivitiesByType = (type) => {
    return activities.filter(activity => activity.type === type);
  };

  return {
    activities,
    logActivity,
    getRecentActivities,
    getActivitiesByType
  };
};

// Helper function to calculate assessment score
const calculateAssessmentScore = (responses) => {
  const values = Object.values(responses);
  let totalScore = 0;
  let maxPossibleScore = 0;

  values.forEach(response => {
    if (typeof response === 'number') {
      totalScore += response;
      maxPossibleScore += 10; // Assuming scale questions are 1-10
    } else if (Array.isArray(response)) {
      totalScore += response.length * 2; // Weight array responses
      maxPossibleScore += 10;
    } else {
      // For string responses, assign arbitrary scores
      const scoreMap = {
        'Never': 10, 'Rarely': 8, 'Sometimes': 6, 'Often': 4, 'Always': 2
      };
      totalScore += scoreMap[response] || 5;
      maxPossibleScore += 10;
    }
  });

  return maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
};
