import React, { useState, useEffect } from 'react';
import { useMoodData, useAssessments } from '../../hooks/useLocalStorage';
import './CrisisSupport.css';

const CrisisSupport = () => {
  const { moodEntries } = useMoodData();
  const { assessments } = useAssessments();
  const [riskLevel, setRiskLevel] = useState('low');
  const [showCrisisCard, setShowCrisisCard] = useState(false);
  const [emergencyContacts] = useState([
    { name: 'National Suicide Prevention Lifeline', number: '988', available: '24/7' },
    { name: 'Crisis Text Line', number: 'Text HOME to 741741', available: '24/7' },
    { name: 'SAMHSA National Helpline', number: '1-800-662-4357', available: '24/7' },
    { name: 'Emergency Services', number: '911', available: '24/7' }
  ]);

  // Crisis detection algorithm
  useEffect(() => {
    const detectCrisisRisk = () => {
      let riskFactors = 0;
      
      // Check recent mood patterns
      const recentMoods = moodEntries.slice(-7); // Last 7 entries
      if (recentMoods.length > 0) {
        const avgMood = recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length;
        const veryLowMoods = recentMoods.filter(entry => entry.mood <= 3).length;
        
        if (avgMood <= 4) riskFactors += 2;
        if (veryLowMoods >= 3) riskFactors += 3;
        
        // Check for declining trend
        const firstHalf = recentMoods.slice(0, Math.floor(recentMoods.length / 2));
        const secondHalf = recentMoods.slice(Math.floor(recentMoods.length / 2));
        
        if (firstHalf.length > 0 && secondHalf.length > 0) {
          const firstAvg = firstHalf.reduce((sum, entry) => sum + entry.mood, 0) / firstHalf.length;
          const secondAvg = secondHalf.reduce((sum, entry) => sum + entry.mood, 0) / secondHalf.length;
          
          if (firstAvg - secondAvg >= 2) riskFactors += 2;
        }
      }
      
      // Check recent assessment scores
      const recentAssessments = assessments.slice(-3); // Last 3 assessments
      if (recentAssessments.length > 0) {
        const lowScores = recentAssessments.filter(assessment => assessment.score <= 40).length;
        if (lowScores >= 2) riskFactors += 2;
      }
      
      // Determine risk level
      if (riskFactors >= 5) {
        setRiskLevel('high');
        setShowCrisisCard(true);
      } else if (riskFactors >= 3) {
        setRiskLevel('medium');
      } else {
        setRiskLevel('low');
      }
    };

    detectCrisisRisk();
  }, [moodEntries, assessments]);

  const handleCallHelpline = (number) => {
    // In a real app, this would integrate with the device's phone functionality
    if (number.includes('Text')) {
      alert(`Opening messaging app to send: HOME to 741741`);
    } else {
      alert(`Calling ${number}...`);
    }
  };

  const getSupportMessage = () => {
    const messages = {
      low: "You're doing great! Keep up with your wellness routine.",
      medium: "We notice you might be going through a tough time. Consider reaching out for support.",
      high: "Your wellbeing is important. Please don't hesitate to reach out for immediate support."
    };
    return messages[riskLevel];
  };

  const getCrisisCardColor = () => {
    const colors = {
      low: '#22c55e',
      medium: '#f59e0b',
      high: '#ef4444'
    };
    return colors[riskLevel];
  };

  if (!showCrisisCard && riskLevel === 'low') {
    return null; // Don't show for low risk
  }

  return (
    <div className={`crisis-support ${riskLevel}-risk`}>
      {riskLevel === 'high' && (
        <div className="urgent-notice">
          <h3>🚨 Immediate Support Available</h3>
          <p>If you're having thoughts of self-harm or suicide, please reach out for help immediately.</p>
        </div>
      )}
      
      <div className="support-message" style={{ borderColor: getCrisisCardColor() }}>
        <h4>💜 Support & Care</h4>
        <p>{getSupportMessage()}</p>
      </div>

      <div className="emergency-contacts">
        <h4>📞 Get Help Now</h4>
        <div className="contacts-grid">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="contact-card">
              <div className="contact-info">
                <h5>{contact.name}</h5>
                <p className="contact-number">{contact.number}</p>
                <span className="availability">{contact.available}</span>
              </div>
              <button 
                className="contact-button"
                onClick={() => handleCallHelpline(contact.number)}
              >
                {contact.number.includes('Text') ? '💬' : '📞'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="coping-strategies">
        <h4>🛡️ Immediate Coping Strategies</h4>
        <div className="strategies-list">
          <div className="strategy">
            <span className="strategy-icon">🫁</span>
            <div>
              <strong>Deep Breathing</strong>
              <p>Take slow, deep breaths. Breathe in for 4, hold for 4, out for 6.</p>
            </div>
          </div>
          <div className="strategy">
            <span className="strategy-icon">🌱</span>
            <div>
              <strong>Grounding Exercise</strong>
              <p>Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.</p>
            </div>
          </div>
          <div className="strategy">
            <span className="strategy-icon">👥</span>
            <div>
              <strong>Reach Out</strong>
              <p>Contact a trusted friend, family member, or mental health professional.</p>
            </div>
          </div>
          <div className="strategy">
            <span className="strategy-icon">🏃‍♀️</span>
            <div>
              <strong>Movement</strong>
              <p>Take a walk, do some stretches, or any gentle physical activity.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="safety-plan">
        <h4>🛡️ Safety Reminders</h4>
        <ul>
          <li>You are not alone - help is available 24/7</li>
          <li>This difficult time will pass</li>
          <li>Reaching out for help is a sign of strength</li>
          <li>Small steps toward self-care matter</li>
          <li>Your life has value and meaning</li>
        </ul>
      </div>

      {showCrisisCard && (
        <button 
          className="dismiss-button"
          onClick={() => setShowCrisisCard(false)}
        >
          I'm feeling better now
        </button>
      )}
    </div>
  );
};

export default CrisisSupport;
