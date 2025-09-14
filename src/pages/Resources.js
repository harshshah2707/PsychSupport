import React, { useState, useEffect } from 'react';
import { useSavedResources, useActivityLog } from '../hooks/useLocalStorage';
import './Resources.css';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { saveResource, unsaveResource, isResourceSaved } = useSavedResources();
  const { logActivity } = useActivityLog();

  const categories = [
    { id: 'all', name: 'All Resources' },
    { id: 'anxiety', name: 'Anxiety' },
    { id: 'depression', name: 'Depression' },
    { id: 'stress', name: 'Stress Management' },
    { id: 'sleep', name: 'Sleep' },
    { id: 'mindfulness', name: 'Mindfulness' },
    { id: 'emergency', name: 'Crisis Support' }
  ];

  useEffect(() => {
    // Mock resources data - in a real app, this would come from an API
    setResources([
      {
        id: 1,
        title: 'Deep Breathing Exercise',
        category: 'anxiety',
        type: 'exercise',
        description: 'A simple breathing technique to help reduce anxiety and promote relaxation.',
        content: '1. Sit comfortably and close your eyes.\n2. Breathe in slowly for 4 counts.\n3. Hold for 4 counts.\n4. Exhale slowly for 6 counts.\n5. Repeat 5-10 times.',
        duration: '5-10 minutes'
      },
      {
        id: 2,
        title: 'Understanding Depression',
        category: 'depression',
        type: 'article',
        description: 'Learn about the signs, symptoms, and coping strategies for depression.',
        content: 'Depression is more than just feeling sad...',
        readTime: '8 minutes'
      },
      {
        id: 3,
        title: 'Progressive Muscle Relaxation',
        category: 'stress',
        type: 'exercise',
        description: 'A technique to reduce physical tension and mental stress.',
        content: 'Start by tensing and relaxing each muscle group...',
        duration: '15-20 minutes'
      },
      {
        id: 4,
        title: 'Sleep Hygiene Tips',
        category: 'sleep',
        type: 'guide',
        description: 'Practical tips for better sleep quality and establishing healthy sleep habits.',
        content: '1. Maintain a consistent sleep schedule...',
        readTime: '5 minutes'
      },
      {
        id: 5,
        title: 'Crisis Helplines',
        category: 'emergency',
        type: 'emergency',
        description: 'Immediate support resources for mental health emergencies.',
        content: 'National Suicide Prevention Lifeline: 988\nCrisis Text Line: Text HOME to 741741',
        urgent: true
      }
    ]);
  }, []);

  const handleResourceSave = (resource) => {
    if (isResourceSaved(resource.id)) {
      unsaveResource(resource.id);
      logActivity('resource', `Unsaved resource: ${resource.title}`);
    } else {
      saveResource(resource);
      logActivity('resource', `Saved resource: ${resource.title}`);
    }
  };

  const handleResourceView = (resource) => {
    logActivity('resource', `Viewed resource: ${resource.title}`, {
      category: resource.category,
      type: resource.type
    });
    // In a real app, this would open a detailed view or external link
    alert(`Viewing: ${resource.title}\n\n${resource.content}`);
  };

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="resources">
      <div className="resources-header">
        <h1>Mental Health Resources</h1>
        <p>Find tools, articles, and exercises to support your mental well-being.</p>
      </div>

      <div className="resources-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="resources-grid">
        {filteredResources.map(resource => (
          <div key={resource.id} className={`resource-card ${resource.urgent ? 'urgent' : ''}`}>
            <div className="resource-header">
              <h3>{resource.title}</h3>
              <span className={`resource-type ${resource.type}`}>
                {resource.type}
              </span>
            </div>
            
            <p className="resource-description">
              {resource.description}
            </p>
            
            <div className="resource-meta">
              {resource.duration && (
                <span className="meta-item">Duration: {resource.duration}</span>
              )}
              {resource.readTime && (
                <span className="meta-item">Read time: {resource.readTime}</span>
              )}
            </div>
            
            <div className="resource-actions">
              <button 
                className="btn btn-primary"
                onClick={() => handleResourceView(resource)}
              >
                {resource.type === 'exercise' ? 'Start Exercise' : 
                 resource.type === 'emergency' ? 'Get Help Now' : 'Read More'}
              </button>
              <button 
                className={`btn ${
                  isResourceSaved(resource.id) ? 'btn-danger' : 'btn-secondary'
                }`}
                onClick={() => handleResourceSave(resource)}
              >
                {isResourceSaved(resource.id) ? '❤️ Saved' : '🔖 Save'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="no-resources">
          <p>No resources found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Resources;
