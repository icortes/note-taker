const express = require('express');
const path = require('path');

const notes = require('./db/db.json');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

//POST Route for api/notes
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);

    // Prepare a response object to send back to the client
    let response;
    //Check to see if there is anything in the request body
    if(req.body && req.body.title && req.body.text){
        response = {
            status: 'success',
            data: req.body
        };
        res.json(`Note ${req.body.title} has been added!`);


    } else {
        res.json('Request body must contain text and title');
    }

    console.log(response);
})

// GET Route for homepage and anything else
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.listen(PORT, () => console.log(`App listening on port ${PORT}`));