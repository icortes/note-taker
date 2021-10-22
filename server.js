const express = require('express');
const fs = require('fs');
const path = require('path');
//helper method for generating unique ids
const {
    v4: uuidv4
} = require('uuid');
const notes = require('./db/db.json');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

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

    //destructuring for items in req.body
    const {
        title,
        text
    } = req.body;

    //Check to see if there is anything in the request body
    if (req.body && req.body.title && req.body.text) {

        //variable for the object to be saved
        const newNote = {
            title,
            text,
            id: uuidv4()
        };

        //read the contents of db
        fs.readFile('./db/db.json', 'utf-8', (err, data) => {
            if (err) throw err;
            else {
                const parsedData = JSON.parse(data);
                //console.log(parsedData);
                parsedData.push(newNote);

                //write the string to db
                fs.writeFile('./db/db.json', JSON.stringify(parsedData, null, 4), (err) => {
                    err ? console.error(err) : console.log(`Note for ${newNote.title} has been written to JSON file`);
                });
            }
        });

        const response = {
            status: 'success',
            body: newNote,
        };

        //console.log(response);
        res.json(response);
    } else {
        res.json('Request body must contain text and title');
    }

});

// DELETE Route
app.delete('/api/notes/:id', (req, res) => {
    console.info(`${req.method} request received to delete note`);

    const id = req.params.id;
    notes.forEach((note, index) => {

        if (note.id === id) {
            notes.splice(index, 1);
            fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4), (err) => {
                err ? console.error(err) : console.log(`Failed to write to file`);
            });
            res.json(`Note with id ${id} has been deleted`);
        }
    });
});

// GET Route for homepage and anything else
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.listen(PORT, () => console.log(`App listening on port ${PORT}`));