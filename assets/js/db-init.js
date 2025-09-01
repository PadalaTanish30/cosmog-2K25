/**
 * Database initialization script for CoSmoG website
 * Loads SQL.js and initializes the database
 */

// Add SQL.js script to the page
document.addEventListener('DOMContentLoaded', function() {
  // Add SQL.js script
  const sqlScript = document.createElement('script');
  sqlScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js';
  sqlScript.integrity = 'sha512-n7swEtVCvXpQ7KxgpPyp0+iJXEX2TRt4nLzNlBGvQNVVKhyJpQBw3gens+Si0Q5C6QQkZrYJAqDkYALy/jL/w==';
  sqlScript.crossOrigin = 'anonymous';
  sqlScript.defer = true;
  document.head.appendChild(sqlScript);
  
  // Initialize database after SQL.js is loaded
  sqlScript.onload = async function() {
    try {
      // Initialize the database
      await window.CosmogDB.init();
      
      // Migrate data from localStorage if needed
      migrateFromLocalStorage();
      
      // Initialize activity feed if present
      if (document.querySelector('.activity-feed')) {
        updateActivityFeed();
      }
      // Initialize live ticker if present
      if (document.getElementById('ticker-content')) {
        updateTicker();
      }
    } catch (err) {
      console.error('Failed to initialize database:', err);
    }
  };
});

// Migrate data from localStorage to the new database
async function migrateFromLocalStorage() {
  const oldRegistrations = localStorage.getItem('registrations');
  if (!oldRegistrations) return;
  
  try {
    const registrations = JSON.parse(oldRegistrations);
    if (!Array.isArray(registrations) || registrations.length === 0) return;
    
    // Migrating existing registrations from localStorage
    
    // Process each registration
    for (const reg of registrations) {
      await window.CosmogDB.Registrations.create({
        name: reg.name,
        roll_no: reg.roll,
        branch: reg.branch,
        event_title: reg.event,
        amount: parseFloat(reg.amount.replace('₹', '')) || 0,
        transaction_id: reg.paymentId,
        status: reg.status,
        created_at: reg.timestamp
      });
    }
    
    // Clear old storage after successful migration
    localStorage.removeItem('registrations');
    // Migration completed
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

// Update the activity feed with recent registrations
async function updateActivityFeed() {
  const feedContainer = document.querySelector('.activity-feed');
  if (!feedContainer) return;
  
  try {
    const recentRegistrations = await window.CosmogDB.Registrations.getRecent(5);
    
    if (recentRegistrations.length === 0) {
      feedContainer.innerHTML = '<div class="empty-feed">No registrations yet. Be the first to register!</div>';
      return;
    }
    
    // Clear existing content
    feedContainer.innerHTML = '';
    
    // Add each registration to the feed
    recentRegistrations.forEach(reg => {
      const regTime = new Date(reg.created_at);
      const timeAgo = getTimeAgo(regTime);
      
      const item = document.createElement('div');
      item.className = 'feed-item';
      item.innerHTML = `
        <div class="feed-avatar">${reg.name.charAt(0)}</div>
        <div class="feed-content">
          <div class="feed-header">
            <span class="feed-name">${reg.name}</span>
            <span class="feed-time">${timeAgo}</span>
          </div>
          <div class="feed-message">
            Registered for <strong>${reg.event_title}</strong>! 🎉
          </div>
          <div class="feed-footer">
            <span class="feed-branch">${reg.branch}</span>
          </div>
        </div>
      `;
      
      feedContainer.appendChild(item);
    });
    
    // Add animation to the newest item
    const newestItem = feedContainer.querySelector('.feed-item:first-child');
    if (newestItem) {
      newestItem.classList.add('new-registration');
      setTimeout(() => {
        newestItem.classList.remove('new-registration');
      }, 3000);
    }
  } catch (err) {
    console.error('Failed to update activity feed:', err);
    feedContainer.innerHTML = '<div class="error">Could not load recent registrations</div>';
  }
}

// Update the live registrations ticker
async function updateTicker() {
  const el = document.getElementById('ticker-content');
  if (!el || !window.CosmogDB?.Registrations?.getRecent) return;
  try {
    const recents = await window.CosmogDB.Registrations.getRecent(10);
    if (!recents || recents.length === 0) {
      el.innerHTML = '<span class="ticker-item">No registrations yet. Be the first to register!</span>';
      return;
    }
    const items = recents.map(r => {
      const name = String(r.name || '').split(' ')[0];
      const branch = r.branch || '';
      const event = r.event_title || 'Event';
      return `<span class="ticker-item">${name} (${branch}) registered for ${event}</span>`;
    }).join('<span class="ticker-sep"> • </span>');
    // Duplicate content for seamless loop
    el.innerHTML = items + '<span class="ticker-sep"> • </span>' + items;
  } catch (e) {
    console.error('Failed to update ticker', e);
  }
}

// Helper function to format time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + ' year' + (interval === 1 ? '' : 's') + ' ago';
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + ' month' + (interval === 1 ? '' : 's') + ' ago';
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + ' day' + (interval === 1 ? '' : 's') + ' ago';
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + ' hour' + (interval === 1 ? '' : 's') + ' ago';
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + ' minute' + (interval === 1 ? '' : 's') + ' ago';
  
  return 'just now';
}

// Set up periodic refresh of the activity feed
setInterval(() => {
  if (document.querySelector('.activity-feed')) updateActivityFeed();
  if (document.getElementById('ticker-content')) updateTicker();
}, 60000); // Update every minute