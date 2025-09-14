import React, { useState, useEffect, useCallback } from 'react';
import './BreathingExercise.css';

const BreathingExercise = ({ onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('ready'); // ready, inhale, hold, exhale, complete
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [totalCycles, setTotalCycles] = useState(5);
  const [technique, setTechnique] = useState('478'); // 4-7-8, box, triangle

  const techniques = {
    '478': {
      name: '4-7-8 Breathing',
      description: 'Inhale for 4, hold for 7, exhale for 8 seconds',
      phases: { inhale: 4, hold: 7, exhale: 8 },
      color: '#4f46e5'
    },
    'box': {
      name: 'Box Breathing',
      description: 'Inhale, hold, exhale, hold - all for 4 seconds',
      phases: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
      color: '#059669'
    },
    'triangle': {
      name: 'Triangle Breathing',
      description: 'Inhale for 4, hold for 4, exhale for 4 seconds',
      phases: { inhale: 4, hold: 4, exhale: 4 },
      color: '#dc2626'
    }
  };

  const currentTechnique = techniques[technique];
  const phases = Object.keys(currentTechnique.phases);

  const getPhaseInstruction = (phase) => {
    const instructions = {
      'ready': 'Get comfortable and prepare to breathe',
      'inhale': 'Breathe in slowly through your nose',
      'hold': 'Hold your breath gently',
      'hold1': 'Hold your breath gently',
      'hold2': 'Hold your breath gently',
      'exhale': 'Breathe out slowly through your mouth',
      'complete': 'Well done! Take a moment to notice how you feel'
    };
    return instructions[phase] || 'Breathe naturally';
  };

  const startExercise = useCallback(() => {
    setIsActive(true);
    setCurrentPhase(phases[0]);
    setSecondsLeft(currentTechnique.phases[phases[0]]);
    setCycleCount(0);
  }, [phases, currentTechnique.phases]);

  const stopExercise = useCallback(() => {
    setIsActive(false);
    setCurrentPhase('ready');
    setSecondsLeft(0);
    setCycleCount(0);
  }, []);

  const completeExercise = useCallback(() => {
    setIsActive(false);
    setCurrentPhase('complete');
    if (onComplete) {
      onComplete({
        technique: currentTechnique.name,
        cycles: totalCycles,
        duration: Object.values(currentTechnique.phases).reduce((a, b) => a + b, 0) * totalCycles
      });
    }
  }, [currentTechnique, totalCycles, onComplete]);

  useEffect(() => {
    let interval = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      // Move to next phase
      const currentPhaseIndex = phases.indexOf(currentPhase);
      const nextPhaseIndex = currentPhaseIndex + 1;

      if (nextPhaseIndex < phases.length) {
        // Next phase in current cycle
        const nextPhase = phases[nextPhaseIndex];
        setCurrentPhase(nextPhase);
        setSecondsLeft(currentTechnique.phases[nextPhase]);
      } else {
        // Cycle complete
        const newCycleCount = cycleCount + 1;
        setCycleCount(newCycleCount);

        if (newCycleCount >= totalCycles) {
          // Exercise complete
          completeExercise();
        } else {
          // Start new cycle
          setCurrentPhase(phases[0]);
          setSecondsLeft(currentTechnique.phases[phases[0]]);
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, currentPhase, phases, currentTechnique.phases, cycleCount, totalCycles, completeExercise]);

  const getCircleScale = () => {
    const totalSeconds = currentTechnique.phases[currentPhase] || 1;
    const progress = 1 - (secondsLeft / totalSeconds);
    
    if (currentPhase === 'inhale') {
      return 0.5 + (progress * 0.5); // Scale from 0.5 to 1
    } else if (currentPhase === 'exhale') {
      return 1 - (progress * 0.5); // Scale from 1 to 0.5
    } else {
      return 1; // Hold phases stay at full scale
    }
  };

  const resetToReady = () => {
    setCurrentPhase('ready');
    setIsActive(false);
    setSecondsLeft(0);
    setCycleCount(0);
  };

  return (
    <div className="breathing-exercise">
      <div className="breathing-header">
        <h3>🫁 Breathing Exercise</h3>
        <p>Take a moment to center yourself with mindful breathing</p>
      </div>

      {currentPhase !== 'complete' && (
        <div className="technique-selector">
          <label>Choose technique:</label>
          <select 
            value={technique} 
            onChange={(e) => setTechnique(e.target.value)}
            disabled={isActive}
          >
            {Object.entries(techniques).map(([key, tech]) => (
              <option key={key} value={key}>{tech.name}</option>
            ))}
          </select>
          <p className="technique-description">{currentTechnique.description}</p>
        </div>
      )}

      <div className="breathing-container">
        <div 
          className="breathing-circle"
          style={{
            transform: `scale(${getCircleScale()})`,
            backgroundColor: currentTechnique.color,
            opacity: isActive ? 0.8 : 0.3
          }}
        >
          <div className="breathing-text">
            {currentPhase === 'ready' && '🌸'}
            {currentPhase === 'inhale' && '↗️'}
            {(currentPhase === 'hold' || currentPhase === 'hold1' || currentPhase === 'hold2') && '⏸️'}
            {currentPhase === 'exhale' && '↘️'}
            {currentPhase === 'complete' && '✨'}
          </div>
        </div>

        <div className="breathing-instruction">
          <h4>{getPhaseInstruction(currentPhase)}</h4>
          {isActive && (
            <div className="breathing-counter">
              <span className="seconds">{secondsLeft}</span>
              <span className="cycle">Cycle {cycleCount + 1} of {totalCycles}</span>
            </div>
          )}
        </div>
      </div>

      {currentPhase === 'complete' && (
        <div className="completion-message">
          <h4>🎉 Exercise Complete!</h4>
          <p>You completed {totalCycles} cycles of {currentTechnique.name}</p>
          <p>Take a moment to notice how you feel. You might experience:</p>
          <ul>
            <li>Reduced stress and anxiety</li>
            <li>Improved focus and clarity</li>
            <li>A sense of calm and relaxation</li>
            <li>Better emotional regulation</li>
          </ul>
        </div>
      )}

      <div className="breathing-controls">
        {currentPhase === 'ready' && (
          <>
            <div className="cycle-selector">
              <label>Number of cycles:</label>
              <select 
                value={totalCycles} 
                onChange={(e) => setTotalCycles(parseInt(e.target.value))}
              >
                <option value="3">3 cycles (~1 min)</option>
                <option value="5">5 cycles (~2 min)</option>
                <option value="10">10 cycles (~4 min)</option>
                <option value="15">15 cycles (~6 min)</option>
              </select>
            </div>
            <button 
              className="btn btn-primary breathing-start"
              onClick={startExercise}
            >
              🌬️ Start Breathing
            </button>
          </>
        )}
        
        {isActive && (
          <button 
            className="btn btn-secondary breathing-stop"
            onClick={stopExercise}
          >
            ⏹️ Stop
          </button>
        )}
        
        {currentPhase === 'complete' && (
          <div className="completion-actions">
            <button 
              className="btn btn-primary"
              onClick={resetToReady}
            >
              🔄 Try Again
            </button>
            <button 
              className="btn btn-secondary"
              onClick={resetToReady}
            >
              ✅ Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreathingExercise;
