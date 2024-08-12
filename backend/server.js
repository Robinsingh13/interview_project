const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();  // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Check if the database connection is successful
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database as ID', db.threadId);

  // Check if a default banner needs to be added
  db.query('SELECT COUNT(*) AS count FROM banners', (err, result) => {
    if (err) {
      console.error('Error checking banner count:', err);
    } else if (result[0].count === 0) {
      addDefaultBanner();
    }
  });
});

const addDefaultBanner = () => {
  db.query(
    'INSERT INTO banners (id, description, timer, link, isVisible) VALUES (1, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE description = VALUES(description), timer = VALUES(timer), link = VALUES(link), isVisible = VALUES(isVisible)',
    ["Welcome to our website!", 3600, "http://example.com", 1],
    (err, result) => {
      if (err) {
        console.error('Error inserting default banner:', err);
      } else {
        console.log('Default banner added or updated');
      }
    }
  );
};

// Get all banners
app.get('/api/get-banners', (req, res) => {
    db.query('SELECT * FROM banners', (err, results) => {
      if (err) throw err;
      // Filter out expired banners
      const now = new Date();
      const activeBanners = results.filter(banner => new Date(banner.expiration_time) > now);
      {console.log(activeBanners)}
      res.json(activeBanners);
      
    });
  });
  

// Fetch a specific banner
app.get('/api/get-banner/:id', (req, res) => {
  db.query('SELECT * FROM banners WHERE id = ?', [req.params.id], (err, results) => {
    if (err) {
      console.error('Error fetching banner:', err);
      res.status(500).send('Error fetching banner');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Banner not found');
      return;
    }
    res.json(results[0]);
  });
});

// Add a new banner
app.post('/api/add-banner', (req, res) => {
    const { description, timer, link, isVisible, imageUrl } = req.body;
    {console.log(req.body)}

    const expirationTime = new Date(Date.now() + timer * 1000).toISOString(); // Calculate expiration time
    {console.log(expirationTime)}
    db.query(
      'INSERT INTO banners (description, timer, link, isVisible, image_url, expiration_time) VALUES (?, ?, ?, ?, ?, ?)',
      [description, timer, link, isVisible, imageUrl, expirationTime],
      (err, results) => {
        if (err) throw err;
        res.json({ id: results.insertId });
      }
    );
  });
    // Update an existing banner
    app.put('/api/update-banner/:id', (req, res) => {
        const { description, timer, link, isVisible, imageUrl, expirationTime } = req.body;
      
        db.query(
          'UPDATE banners SET description = ?, timer = ?, link = ?, isVisible = ?, image_url = ?, expiration_time = ? WHERE id = ?',
          [description, timer, link, isVisible, imageUrl, expirationTime, req.params.id],
          (err, results) => {
            if (err) throw err;
            res.json({ affectedRows: results.affectedRows });
          }
        );
      });
        // Update visibility only
app.put('/api/update-banner-visibility/:id', (req, res) => {
    const { isVisible } = req.body;
    {console.log(isVisible)}
    {console.log(req.params.id)}
    db.query(
      'UPDATE banners SET isVisible = ? WHERE id = ?',
      [isVisible ? 1 : 0, req.params.id],

      
      (err, results) => {
        if (err) {
          console.error('Error updating banner visibility:', err);
          res.status(500).send('Error updating banner visibility');
          return;
        }
        res.json({ affectedRows: results.affectedRows });
      }
    );
  });
  
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
