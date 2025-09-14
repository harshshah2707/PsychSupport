# 🔗 Integration Guide: React + Python + Firebase

## Complete Crisis Detection System Integration

This guide walks you through integrating your React psychological support system with Python backend and Firebase for real-time crisis detection and monitoring.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │  Python Flask   │    │    Firebase     │
│   (Frontend)    │◄──►│    Backend      │◄──►│   (Database)    │
│                 │    │                 │    │                 │
│ • UI Components │    │ • Crisis Detection│  │ • Firestore DB  │
│ • State Mgmt    │    │ • ML Algorithms  │    │ • Authentication│
│ • Real-time UI  │    │ • API Endpoints  │    │ • Push Messages │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

```powershell
# Run the setup script
python setup.py
```

### Option 2: Manual Setup

Follow the steps below for manual configuration.

## 📋 Prerequisites

### Required Software
- **Python 3.8+** - Backend server
- **Node.js 16+** - React development
- **Firebase Project** - Database and auth
- **Git** - Version control

### Check Prerequisites
```powershell
# Check Python
python --version

# Check Node.js
node --version

# Check npm
npm --version
```

## 🔧 Step-by-Step Integration

### Step 1: Firebase Project Setup

1. **Create Firebase Project**
   ```bash
   # Go to Firebase Console
   https://console.firebase.google.com/
   ```

2. **Enable Services**
   - Authentication (Email/Password)
   - Firestore Database
   - Cloud Messaging
   - Analytics (optional)

3. **Get Configuration**
   - Project Settings → General → Web apps
   - Copy configuration object

4. **Generate Service Account Key**
   - Project Settings → Service Accounts
   - Generate new private key
   - Save as `backend/firebase-service-account.json`

### Step 2: Backend Setup

1. **Create Virtual Environment**
   ```powershell
   cd backend
   python -m venv venv
   venv\Scripts\activate  # Windows
   # or
   source venv/bin/activate  # Unix/Mac
   ```

2. **Install Dependencies**
   ```powershell
   pip install -r requirements.txt
   ```

3. **Configure Environment**
   ```powershell
   # Create backend/.env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   FLASK_ENV=development
   FLASK_DEBUG=True
   SECRET_KEY=your-secret-key
   ```

4. **Test Backend**
   ```powershell
   python app.py
   # Visit: http://localhost:5000/api/health
   ```

### Step 3: Frontend Integration

1. **Install Firebase SDK**
   ```powershell
   npm install firebase
   ```

2. **Configure Firebase**
   ```javascript
   // src/config/firebase.js
   import { initializeApp } from 'firebase/app';
   
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     // ... other config
   };
   
   const app = initializeApp(firebaseConfig);
   ```

3. **Update Environment**
   ```env
   # .env
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Test Integration**
   ```powershell
   npm start
   # Visit: http://localhost:3000
   ```

## 🔐 Authentication Flow

### Firebase Authentication Setup

```javascript
// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const value = {
    currentUser,
    login,
    signup
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
```

## 📊 Crisis Detection Integration

### Frontend Crisis Detection Hook

```javascript
// src/hooks/useCrisisDetection.js
import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useCrisisDetection = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const analyzeContent = async (content, type = 'text') => {
    try {
      const response = await apiService.analyzeCrisisContent(content, type);
      
      if (response.overall_risk === 'high') {
        // Trigger immediate intervention UI
        showCrisisInterventionModal(response);
      }
      
      return response;
    } catch (error) {
      console.error('Crisis analysis failed:', error);
      return null;
    }
  };

  const showCrisisInterventionModal = (analysisResult) => {
    // Show crisis intervention modal with resources
    // This would trigger your crisis response UI
  };

  const subscribeToAlerts = () => {
    if (!isMonitoring) {
      const unsubscribe = apiService.subscribeToAlerts((newAlerts) => {
        setAlerts(prev => [...prev, ...newAlerts]);
      });
      setIsMonitoring(true);
      return unsubscribe;
    }
  };

  return {
    analyzeContent,
    subscribeToAlerts,
    alerts,
    isMonitoring
  };
};
```

### Backend Crisis Detection API

The Python backend provides these endpoints:

```python
# Crisis Detection Endpoints
POST /api/crisis/analyze          # Analyze text for crisis indicators
GET  /api/crisis/alerts/<user_id> # Get crisis alerts
GET  /api/resources/crisis        # Get crisis resources
POST /api/emergency/contacts      # Add emergency contacts
```

## 🔄 Real-time Features

### 1. Real-time Crisis Monitoring

```javascript
// src/components/CrisisMonitor.js
import { useEffect } from 'react';
import { useCrisisDetection } from '../hooks/useCrisisDetection';

const CrisisMonitor = () => {
  const { subscribeToAlerts, alerts } = useCrisisDetection();

  useEffect(() => {
    const unsubscribe = subscribeToAlerts();
    return unsubscribe;
  }, []);

  return (
    <div className="crisis-monitor">
      {alerts.map(alert => (
        <CrisisAlert key={alert.id} alert={alert} />
      ))}
    </div>
  );
};
```

### 2. Push Notifications

```javascript
// src/utils/notifications.js
import { messaging } from '../config/firebase';
import { getToken, onMessage } from 'firebase/messaging';

export const setupNotifications = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
    });
    
    // Send token to backend
    await apiService.updateNotificationToken(token);
    
    // Listen for messages
    onMessage(messaging, (payload) => {
      console.log('Crisis alert received:', payload);
      // Handle foreground notifications
      showInAppNotification(payload);
    });
    
  } catch (error) {
    console.error('Notification setup failed:', error);
  }
};
```

## 🗄️ Database Schema

### Firestore Collections

```javascript
// Users collection
users/{userId} = {
  email: string,
  name: string,
  emergency_contacts: [
    {
      name: string,
      phone: string,
      email: string,
      relationship: string,
      notification_token: string
    }
  ],
  created_at: timestamp,
  last_active: timestamp
}

// Crisis Events collection
crisis_events/{eventId} = {
  user_id: string,
  timestamp: timestamp,
  crisis_data: {
    severity: string,      // low, medium, high, critical
    score: number,
    indicators: array,
    text_analysis: object,
    mood_pattern: object
  },
  status: string,         // active, resolved, escalated
  response_actions: array
}

// User Moods subcollection
users/{userId}/moods/{moodId} = {
  timestamp: timestamp,
  score: number,          // 1-10 scale
  notes: string,
  activities: array,
  crisis_analysis: object  // Added by backend
}
```

## 🚀 Deployment Options

### Development Environment

```powershell
# Start backend
cd backend
venv\Scripts\activate
python app.py

# Start frontend (new terminal)
npm start
```

### Production Deployment

#### Option 1: Firebase Hosting + Cloud Run

```bash
# Deploy backend to Cloud Run
gcloud run deploy crisis-backend --source backend/

# Deploy frontend to Firebase Hosting
npm run build
firebase deploy --only hosting
```

#### Option 2: Traditional VPS

```bash
# Backend with Gunicorn
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Frontend with Nginx
npm run build
# Serve build/ directory with Nginx
```

## 🔒 Security Considerations

### 1. Firebase Security Rules

```javascript
// Firestore security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Moods subcollection
      match /moods/{moodId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Crisis events - restricted access
    match /crisis_events/{eventId} {
      allow read: if request.auth != null && 
        request.auth.uid == resource.data.user_id;
      allow write: if false; // Only backend can write
    }
  }
}
```

### 2. Environment Variables

```env
# Never commit these to version control
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
SECRET_KEY="your-secret-key"
TWILIO_AUTH_TOKEN="your-twilio-token"
```

### 3. API Security

```python
# Backend security measures
@app.before_request
def limit_remote_addr():
    # Rate limiting
    pass

@token_required
def protected_endpoint(current_user):
    # JWT token validation
    pass
```

## 🧪 Testing

### 1. Backend Testing

```python
# tests/test_crisis_detection.py
def test_crisis_detection():
    detector = CrisisDetector()
    result = detector.analyze_text("I want to hurt myself")
    assert result['severity'] == 'high'
    assert result['requires_immediate_attention'] == True
```

### 2. Frontend Testing

```javascript
// src/__tests__/CrisisDetection.test.js
import { render, screen } from '@testing-library/react';
import { CrisisMonitor } from '../components/CrisisMonitor';

test('displays crisis alerts', async () => {
  render(<CrisisMonitor />);
  // Test crisis alert functionality
});
```

### 3. Integration Testing

```bash
# Run backend tests
cd backend
python -m pytest tests/

# Run frontend tests
npm test

# E2E testing with Cypress
npm run cypress:run
```

## 📱 Mobile Integration

### Progressive Web App (PWA)

```javascript
// public/manifest.json
{
  "name": "Crisis Detection System",
  "short_name": "CrisisApp",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4285f4",
  "icons": [
    {
      "src": "icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### React Native Integration

```javascript
// For mobile app version
npm install @react-native-firebase/app
npm install @react-native-firebase/auth
npm install @react-native-firebase/firestore
npm install @react-native-firebase/messaging
```

## 🔍 Monitoring & Analytics

### 1. Application Monitoring

```python
# Backend logging
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Log crisis events
logger.info(f"Crisis detected for user {user_id}: {crisis_data}")
```

### 2. Crisis Analytics Dashboard

```javascript
// src/pages/Analytics.js
const CrisisAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      const data = await apiService.getCrisisAnalytics();
      setAnalytics(data);
    };
    fetchAnalytics();
  }, []);
  
  return (
    <div>
      <CrisisChart data={analytics?.trends} />
      <InterventionStats data={analytics?.interventions} />
    </div>
  );
};
```

## 🆘 Crisis Response Workflow

### 1. Automatic Detection
```
Text Input → Crisis Analysis → Severity Assessment → Alert Generation
```

### 2. Intervention Triggers
- **Low Risk**: In-app resources, self-help tools
- **Medium Risk**: Counselor notification, enhanced monitoring
- **High Risk**: Emergency contacts notified, crisis resources displayed
- **Critical**: Immediate emergency services, safety planning

### 3. Response Actions
```javascript
const crisisResponseActions = {
  low: ['show_resources', 'log_event'],
  medium: ['notify_counselor', 'increase_monitoring'],
  high: ['contact_emergency_contacts', 'show_crisis_resources'],
  critical: ['trigger_emergency_protocol', 'immediate_intervention']
};
```

## 🤝 Support & Maintenance

### Regular Maintenance Tasks

1. **Update Dependencies**
   ```bash
   pip install -U -r requirements.txt
   npm update
   ```

2. **Monitor Logs**
   ```bash
   tail -f backend/logs/crisis-detection.log
   ```

3. **Database Cleanup**
   ```python
   # Clean old crisis events
   cleanup_old_crisis_events(days=90)
   ```

### Getting Help

- **Firebase Documentation**: https://firebase.google.com/docs
- **Flask Documentation**: https://flask.palletsprojects.com/
- **React Documentation**: https://reactjs.org/docs
- **Crisis Detection Issues**: Create GitHub issue with logs

## 🎯 Next Steps

1. **Complete Firebase Setup** - Configure your Firebase project
2. **Run Setup Script** - Execute `python setup.py`
3. **Configure Environment** - Add your credentials to `.env` files
4. **Test Crisis Detection** - Try logging negative moods/journal entries
5. **Set Up Monitoring** - Configure alerts and notifications
6. **Deploy to Production** - Choose deployment strategy
7. **Train Your Team** - Document crisis response procedures

---

**⚠️ Important**: This system is designed to support mental health monitoring but should not replace professional mental health care. Always have proper emergency procedures and professional support systems in place.