const express = require('express');
const path = require('path');

const notes = require('./db/db.json');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for api/notes
app.get('/api/notes', (req, res) => {
    //log our request to the terminal
    console.info(`${req.method} request received to get notes`);

    //send all notes to the client
    return res.json(notes);
});

// GET Route for anything else
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.listen(PORT, () => console.log(`App listening on port ${PORT}`));