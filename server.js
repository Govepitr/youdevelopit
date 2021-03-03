const express = require('express')
const PORT = process.env.PORT || 3001
const app = express()

// Express middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())



// Default response for any other request(Not Found) Catch all
app.use((req, res) => {
  res.status(404).end()
})

app.listen(PORT, () => {
  console.log(`Ugh.. is this Groundhog's day except not funny? Oh yeah, ${PORT} is open or whatever.`)
})