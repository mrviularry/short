const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = 3000;

// Simple in-memory "database" for this example
const urlDatabase = {};

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve HTML form at root
app.get('/', (req, res) => {
  res.send(`
    <h2>Simple URL Shortener</h2>
    <form action="/shorten" method="POST">
      <input type="url" name="urlToShorten" placeholder="Enter URL here" required>
      <button type="submit">Shorten URL</button>
    </form>
  `);
});

// Endpoint to create a short URL
app.post('/shorten', (req, res) => {
  const originalUrl = req.body.urlToShorten;
  const urlHash = crypto.createHash('md5').update(originalUrl).digest('hex').substring(0, 6);
  const shortUrl = `${req.protocol}://${req.get('host')}/${urlHash}`;

  // Store the hash and original URL
  urlDatabase[urlHash] = originalUrl;

  res.send(`Shortened URL: <a href="${shortUrl}">${shortUrl}</a>`);
});

// Redirect from a short URL to the original URL
app.get('/:hash', (req, res) => {
  const originalUrl = urlDatabase[req.params.hash];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.sendStatus(404);
  }
});

app.listen(port, () => {
  console.log(`URL Shortener app listening at http://localhost:${port}`);
});
