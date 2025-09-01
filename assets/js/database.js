/**
 * Database implementation for CoSmoG website
 * Uses SQL.js (SQLite compiled to JavaScript) for client-side database
 */

e // Helper to ensure SQL.js is available
const SQL_LOADER = { promise: null };
async function ensureSqlJs() {
  if (typeof initSqlJs === 'function') return;
  if (!SQL_LOADER.promise) {
    SQL_LOADER.promise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js';
      s.async = true;
      s.onload = () => resolve();
      s.onerror = (e) => reject(e);
      document.head.appendChild(s);
    });
  }
  await SQL_LOADER.promise;
}

// Database initialization and management
const DB = {
  db: null,
  initialized: false,
  
  // Initialize the database
  async init() {
    if (this.initialized) return Promise.resolve(this.db);
    
    try {
      // Load SQL.js from CDN (ensure available)
      await ensureSqlJs();
      const sqlPromise = initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
      });
      
      // Check if we have a stored database
      const storedDB = localStorage.getItem('cosmog_db');
      
      const SQL = await sqlPromise;
      
      if (storedDB) {
        // Convert stored string to Uint8Array
        const arr = new Uint8Array(JSON.parse(storedDB));
        this.db = new SQL.Database(arr);
      } else {
        // Create a new database
        this.db = new SQL.Database();
        
        // Create tables
        this.db.run(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            roll_no TEXT NOT NULL,
            branch TEXT NOT NULL,
            email TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
          
          CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            amount REAL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
          
          CREATE TABLE IF NOT EXISTS registrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            event_id INTEGER,
            transaction_id TEXT,
            amount REAL DEFAULT 0,
            payment_screenshot TEXT,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (event_id) REFERENCES events(id)
          );
        `);
        
        // Insert default events
        this.db.run(`
          INSERT INTO events (title, description, amount) VALUES 
          ('Art / Design Art', 'Showcase creativity in art and design.', 49),
          ('Web Design Using Prompt', 'Prompt-driven modern web design techniques.', 0),
          ('Quiz', 'General and tech quiz challenges.', 29),
          ('Main Event', 'Flagship attraction of CoSmoG.', 0),
          ('Esports', 'Competitive gaming tournament.', 59),
          ('Editing Competition', 'Video/photo editing skills challenge.', 39),
          ('Movie Rampage', 'Fun movie-themed activities.', 0),
          ('Culturals', 'Cultural performances and showcases.', 0);
        `);
      }
      
      this.initialized = true;
      return this.db;
    } catch (err) {
      console.error('Database initialization failed:', err);
      return null;
    }
  },
  
  // Save the database to localStorage
  save() {
    if (!this.db) return;
    try {
      const data = this.db.export();
      const arr = Array.from(data);
      localStorage.setItem('cosmog_db', JSON.stringify(arr));
    } catch (e) {
      console.warn('DB save skipped:', e);
    }
  },
  
  // Execute a query and return results
  exec(sql, params = []) {
    if (!this.db) return null;
    
    try {
      return this.db.exec(sql, params);
    } catch (err) {
      console.error('SQL execution error:', err, sql, params);
      return null;
    }
  },
  
  // Run a query that doesn't return results
  run(sql, params = []) {
    if (!this.db) return false;
    
    try {
      this.db.run(sql, params);
      this.save();
      return true;
    } catch (err) {
      console.error('SQL run error:', err, sql, params);
      return false;
    }
  },
  
  // Get a single row (prepared statement)
  getOne(sql, params = []) {
    if (!this.db) return null;
    try {
      const stmt = this.db.prepare(sql);
      if (params && params.length) stmt.bind(params);
      let row = null;
      if (stmt.step()) {
        row = stmt.getAsObject();
      }
      stmt.free();
      return row;
    } catch (err) {
      console.error('SQL getOne error:', err, sql, params);
      return null;
    }
  },

  // Get multiple rows (prepared statement)
  getAll(sql, params = []) {
    if (!this.db) return [];
    try {
      const stmt = this.db.prepare(sql);
      if (params && params.length) stmt.bind(params);
      const rows = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      stmt.free();
      return rows;
    } catch (err) {
      console.error('SQL getAll error:', err, sql, params);
      return [];
    }
  }
};

// User-related operations
const Users = {
  // Create a new user
  create(userData) {
    return DB.run(
      'INSERT INTO users (name, roll_no, branch, email) VALUES (?, ?, ?, ?)',
      [userData.name, userData.roll_no, userData.branch, userData.email || null]
    );
  },
  
  // Get user by ID
  getById(id) {
    return DB.getOne('SELECT * FROM users WHERE id = ?', [id]);
  },
  
  // Get user by roll number
  getByRollNo(rollNo) {
    return DB.getOne('SELECT * FROM users WHERE roll_no = ?', [rollNo]);
  },
  
  // Get all users
  getAll() {
    return DB.getAll('SELECT * FROM users ORDER BY created_at DESC');
  }
};

// Event-related operations
const Events = {
  // Get all events
  getAll() {
    return DB.getAll('SELECT * FROM events ORDER BY title');
  },
  
  // Get event by ID
  getById(id) {
    return DB.getOne('SELECT * FROM events WHERE id = ?', [id]);
  },
  
  // Get event by title
  getByTitle(title) {
    return DB.getOne('SELECT * FROM events WHERE title = ?', [String(title || '').trim()]);
  },

  // Create event if missing
  create({ title, description, amount }) {
    const ok = DB.run('INSERT INTO events (title, description, amount) VALUES (?, ?, ?)', [String(title || '').trim(), description || null, Number(amount) || 0]);
    return ok;
  }
};

// Registration-related operations
const Registrations = {
  // Create a new registration
  async create(registrationData) {
    // Get or create user
    let userId = registrationData.user_id;
    
    if (!userId) {
      // Check if user exists by roll number
      const existingUser = await Users.getByRollNo(registrationData.roll_no);
      
      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Create new user
        const userCreated = Users.create({
          name: registrationData.name,
          roll_no: registrationData.roll_no,
          branch: registrationData.branch,
          email: registrationData.email
        });
        
        if (!userCreated) return false;
        
        // Get the newly created user
        const newUser = await Users.getByRollNo(registrationData.roll_no);
        if (!newUser) return false;
        
        userId = newUser.id;
      }
    }
    
    // Get event ID
    let eventId = registrationData.event_id;
    
    if (!eventId && registrationData.event_title) {
      const eventTitle = String(registrationData.event_title || '').trim();
      let event = await Events.getByTitle(eventTitle);
      if (!event) {
        // Create a fallback event record if not present
        Events.create({ title: eventTitle, description: null, amount: registrationData.amount || 0 });
        event = await Events.getByTitle(eventTitle);
      }
      if (event) eventId = event.id;
    }
    
    if (!eventId) return false;
    
    // Validate transaction ID if not provided
    let transactionId = registrationData.transaction_id;
    if (!transactionId || transactionId.trim() === '') {
      // Generate a fallback transaction ID if none provided
      transactionId = 'UPI' + Math.random().toString(36).substring(2, 10).toUpperCase();
          }
    
    // Create registration
    return DB.run(
      'INSERT INTO registrations (user_id, event_id, transaction_id, amount, payment_screenshot, status) VALUES (?, ?, ?, ?, ?, ?)',
      [
        userId,
        eventId,
        transactionId,
        registrationData.amount || 0,
        registrationData.payment_screenshot || null,
        registrationData.status || 'confirmed'
      ]
    );
  },
  
  // Get registration by ID
  getById(id) {
    return DB.getOne('SELECT * FROM registrations WHERE id = ?', [id]);
  },
  
  // Get all registrations with user and event details
  getAll() {
    return DB.getAll(`
      SELECT r.*, u.name, u.roll_no, u.branch, e.title as event_title, e.description as event_description
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      JOIN events e ON r.event_id = e.id
      ORDER BY r.created_at DESC
    `);
  },
  
  // Get recent registrations for the activity feed
  getRecent(limit = 10) {
    const lim = Math.max(1, Number(limit) || 10);
    return DB.getAll(`
      SELECT r.id, r.created_at, r.status, u.name, u.roll_no, u.branch, e.title as event_title
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      JOIN events e ON r.event_id = e.id
      WHERE r.status = 'confirmed'
      ORDER BY r.created_at DESC
      LIMIT ${lim}
    `);
  },
  
  // Get registrations by user ID
  getByUserId(userId) {
    return DB.getAll(`
      SELECT r.*, e.title as event_title, e.description as event_description
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `, [userId]);
  },
  
  // Get registrations by event ID
  getByEventId(eventId) {
    return DB.getAll(`
      SELECT r.*, u.name, u.roll_no, u.branch
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      WHERE r.event_id = ?
      ORDER BY r.created_at DESC
    `, [eventId]);
  },
  
  // Update registration status
  updateStatus(id, status) {
    return DB.run(
      'UPDATE registrations SET status = ? WHERE id = ?',
      [status, id]
    );
  }
};

// Export the database API
window.CosmogDB = {
  init: DB.init.bind(DB),
  Users,
  Events,
  Registrations
};