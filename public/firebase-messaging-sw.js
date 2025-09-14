// Firebase messaging service worker
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title || 'Crisis Alert';
  const notificationOptions = {
    body: payload.notification.body || 'A mental health crisis has been detected.',
    icon: '/icons/crisis-alert.png',
    badge: '/icons/crisis-badge.png',
    tag: 'crisis-alert',
    requireInteraction: true,
    actions: [
      {
        action: 'view-alert',
        title: 'View Alert'
      },
      {
        action: 'call-help',
        title: 'Call for Help'
      }
    ],
    data: {
      url: '/crisis-response',
      crisis_id: payload.data?.crisis_id,
      severity: payload.data?.severity
    }
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'view-alert') {
    // Open the crisis response page
    event.waitUntil(
      clients.openWindow('/crisis-response')
    );
  } else if (event.action === 'call-help') {
    // Open emergency services
    event.waitUntil(
      clients.openWindow('tel:988') // Suicide prevention lifeline
    );
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});