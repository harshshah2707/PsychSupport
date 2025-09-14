import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    preferences: {
      notifications: user?.preferences?.notifications || true,
      reminderFrequency: user?.preferences?.reminderFrequency || 'daily',
      privacyLevel: user?.preferences?.privacyLevel || 'private'
    }
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      preferences: {
        notifications: user?.preferences?.notifications || true,
        reminderFrequency: user?.preferences?.reminderFrequency || 'daily',
        privacyLevel: user?.preferences?.privacyLevel || 'private'
      }
    });
    setIsEditing(false);
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <div className="section-header">
            <h2>Personal Information</h2>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="btn-secondary">
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button onClick={handleSave} className="btn-primary">Save</button>
                <button onClick={handleCancel} className="btn-secondary">Cancel</button>
              </div>
            )}
          </div>

          <div className="profile-form">
            <div className="form-group">
              <label>Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                />
              ) : (
                <p className="form-value">{user?.name || 'Not set'}</p>
              )}
            </div>

            <div className="form-group">
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                />
              ) : (
                <p className="form-value">{user?.email || 'Not set'}</p>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Preferences</h2>
          
          <div className="preferences-form">
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="preferences.notifications"
                  checked={formData.preferences.notifications}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                Enable notifications
              </label>
              <p className="form-help">Receive reminders and wellness tips</p>
            </div>

            <div className="form-group">
              <label>Reminder Frequency</label>
              <select
                name="preferences.reminderFrequency"
                value={formData.preferences.reminderFrequency}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-select"
              >
                <option value="never">Never</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
              </select>
            </div>

            <div className="form-group">
              <label>Privacy Level</label>
              <select
                name="preferences.privacyLevel"
                value={formData.preferences.privacyLevel}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="form-select"
              >
                <option value="private">Private</option>
                <option value="anonymous">Anonymous Data Sharing</option>
                <option value="public">Public (for research)</option>
              </select>
              <p className="form-help">
                Control how your data is used for research and improvement
              </p>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Account Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Assessments Completed</h3>
              <p className="stat-value">12</p>
            </div>
            <div className="stat-card">
              <h3>Resources Accessed</h3>
              <p className="stat-value">28</p>
            </div>
            <div className="stat-card">
              <h3>Days Active</h3>
              <p className="stat-value">45</p>
            </div>
            <div className="stat-card">
              <h3>Current Streak</h3>
              <p className="stat-value">7 days</p>
            </div>
          </div>
        </div>

        <div className="profile-section danger-zone">
          <h2>Account Management</h2>
          <div className="danger-actions">
            <button className="btn-danger">Export My Data</button>
            <button className="btn-danger">Delete Account</button>
          </div>
          <p className="danger-warning">
            These actions cannot be undone. Please proceed with caution.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
