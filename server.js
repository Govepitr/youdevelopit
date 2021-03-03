const sqlite3 = require('sqlite3').verbose()
const express = require('express')
const PORT = process.env.PORT || 3001
const app = express()
const inputCheck = require('./utils/inputCheck')

// Express middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
// Connect to database
const db = new sqlite3.Database('./db/election.db', err => {
  if (err) {
    return console.error(err.message)
  }

  console.log('Connected to the most BORING Database ever.')
})

// Get single candidate
app.get('/api/candidate/:id', (req, res) => {
  const sql = `SELECT * FROM candidates 
               WHERE id = ?`
  const params = [req.params.id]
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }

    res.json({
      message: 'Ugh, lame people who will lie to you.',
      data: row
    })
  })
})

// GET a single candidate
db.get(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
  if(err) {
    console.log(err)
  }
  console.log("Here's a lame person", row)
})

// // Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`
  const params = [req.params.id]
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: res.message })
      return
    }

    res.json({
      message: 'They did not survive Thanos, oh noes.',
      changes: this.changes
    })
  })
})

// Create a candidate
app.post('/api/candidate', ({ body }, res) => {
  const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected')
  if (errors) {
    res.status(400).json({ error: errors })
    return
  }
  const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) 
              VALUES (?,?,?)`;
const params = [body.first_name, body.last_name, body.industry_connected];
// ES5 function, not arrow function, to use `this`
db.run(sql, params, function(err, result) {
  if (err) {
    res.status(400).json({ error: err.message });
    return;
  }

  res.json({
    message: 'A new challenger apppears.',
    data: body,
    id: this.lastID
  });
});
})


// Default response for any other request(Not Found) Catch all
app.use((req, res) => {
  res.status(404).end()
})

// Start server after DB connection
db.on('open', () => {
  app.listen(PORT, () => {
    console.log(`Ugh.. is this Groundhog's day except not funny? Oh yeah, ${PORT} is open or whatever.`)
  })
})
