//Fiona Wang - Web Dev - Period 7 + 8 Even
//Backend Project

const express = require('express');
const app = express();

app.use(express.json());


// initialization
const genres = [
    { id: 1, name: 'Pop', month: 'October', year: '2022', songs: [{ id: 1, name: 'Snow On the Beach', artist: 'Taylor Swift' }] },
    { id: 2, name: 'Rap', month: 'July', year: '2020', songs: [] },
    { id: 3, name: 'Hip Hop', month: 'May', year: '2016', songs: [{ id: 1, name: 'White Tee', artist: 'Lil Peep' }] }
];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


// frontend
app.get('/', (req, res) => {
    res.send('Welcome To Music App \nMade By Fiona Wang');
});
app.post('/', (req, res) => {
    res.send('Got a POST request')
});
app.put('/', (req, res) => {
    res.send('Got a PUT request')
});
app.delete('/', (req, res) => {
    res.send('Got a DELETE request')
});


// HTTP GET requests
app.get('/api/genres', (req, res) => {
    res.send(genres.map((genre) => ({ id: genre.id, name: genre.name })));
});

// gets info of genre
app.get('/api/genres/:genreid', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.genreid));
    if (!genre) {
        res.status(404).send('The genre with the given ID was not found');
        return
    }
    res.send(genre);
});

// gets info about a song
app.get('/api/genres/:genreid/:songid', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.genreid));
    if (!genre) {
        res.status(404).send('The genre with the given ID was not found');
        return
    }
    else {
        const song = genre.songs.find(s => s.id === parseInt(req.params.songid));
        if (!song) {
            res.status(404).send('The song with the given ID was not found');
            return
        }
        res.send(song);
    }
});

// filters by year
app.get('/api/filter/:year', (req, res) => {
    const year = genres.filter(y => parseInt(y.year) === parseInt(req.params.year));
    const show = [
        { name: "filter", year: parseInt(req.params.year) },
        year.map((genre) => ({ id: genre.id, name: genre.name, month: genre.month, year: genre.year }))
    ];
    res.send(show);
});

// filters by month
app.get('/api/filter/month/:month', (req, res) => {
    const month = genres.filter(y => String(y.month).toLowerCase() === String(req.params.month).toLowerCase());
    const show = [
        { name: "filter", month: req.params.month },
        month.map((genre) => ({ id: genre.id, name: genre.name, month: genre.month, year: genre.year }))
    ];
    res.send(show);
});

// filters by month and year
app.get('/api/filter/:year/:month', (req, res) => {
    const year = genres.filter(y => parseInt(y.year) === parseInt(req.params.year));
    const month = year.filter(y => String(y.month).toLowerCase() === String(req.params.month).toLowerCase());
    const show = [
        { name: "filter", year: parseInt(req.params.year), month: req.params.month },
        month.map((genre) => ({ id: genre.id, name: genre.name, month: genre.month, year: genre.year }))
    ];
    res.send(show);
});


// HTTPS POST requests
app.post('/api/genres', (req, res) => {
    if (req.body.name.length > 3 && req.body.name.length < 16) {
        const date = new Date();
        const genre = {
            id: genres.length + 1,
            name: req.body.name,
            month: months[date.getMonth()],
            year: date.getFullYear(),
            songs: []
        }
        genres.push(genre);
        res.send(genre);
        return
    }
    res.status(404).send("Name is required. It should have a minimum of 3 characters and a maximum of 15 characters.");
});

// adds new song
app.post('/api/genres/:genreid', (req, res) => {
    if (req.body.name.length > 3 && req.body.name.length < 16) {
        const genre = genres.find(g => g.id === parseInt(req.params.genreid));
        if (!genre) {
            res.status(404).send('The genre with the given ID was not found.');
            return
        }
        const genrePos = genres.findIndex(g => g.id === parseInt(req.params.genreid));
        var singer = "Asynchronous";
        if (req.body.artist != null) {
            singer = req.body.artist;
        }
        const song = {
            id: genres[genrePos].songs.length + 1,
            name: req.body.name,
            artist: singer
        }
        genres[genrePos].songs.push(song);
        res.send(song);
        return
    }
    res.status(404).send("Name is required. It should have a minimum of 3 characters.");
});


// HTTP PUT requests

// changes genre name
app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre) {
        res.status(404).send('The genre with the given ID was not found.');
        return
    }
    if (req.body.name.length > 3 && req.body.name.length < 16) {
        const genrePos = genres.findIndex(g => g.id === parseInt(req.params.id));
        const date = new Date();
        const change = {
            id: parseInt(req.params.id),
            name: req.body.name,
            month: months[date.getMonth()],
            year: date.getFullYear(),
            songs: genres[genrePos].songs
        };
        genres[genrePos] = change;
        res.send(change);
        return
    };
    res.status(404).send("Name is required. It should have a minimum of 3 characters.");
});

// changes song name and artist
app.put('/api/genres/:genreid/:songid', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.genreid));
    if (!genre) {
        res.status(404).send('The genre with the given ID was not found.');
        return
    }
    const song = genre.songs.find(s => s.id === parseInt(req.params.songid));
    if (!song) {
        res.status(404).send('The song with the given ID was not found.');
        return
    }
    if (req.body.name.length > 3 && req.body.name.length < 16) {
        const genrePos = genres.findIndex(g => g.id === parseInt(req.params.genreid));
        var singer = "Asynchronous";
        if (req.body.artist != null) {
            singer = req.body.artist;
        }
        const change = {
            id: parseInt(req.params.songid),
            name: req.body.name,
            artist: singer
        };
        const songPos = genres[genrePos].songs.findIndex(s => s.id === parseInt(req.params.songid));
        genres[genrePos].songs[songPos] = change;
        res.send(change);
        return
    };
    res.status(404).send("Name is required. It should have a minimum of 3 characters.");
});


// HTTP DELETE request
// delete genre based on genreid
app.delete('/api/genres/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre) {
        res.status(404).send('The genre with the given ID was not found.');
        return
    }
    const genrePos = genres.findIndex(g => g.id === parseInt(req.params.id));
    const toDelete = genres[genrePos];
    genres.splice(genrePos, 1);
    res.send(toDelete);
});

// deletes song
app.delete('/api/genres/:genreid/:songid', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.genreid));
    if (!genre) {
        res.status(404).send('The genre with the given ID was not found.');
        return
    }
    else {
        const song = genre.songs.find(s => s.id === parseInt(req.params.songid));
        if (!song) {
            res.status(404).send('The song with the given ID was not found.');
            return
        }
        const genrePos = genres.findIndex(g => g.id === parseInt(req.params.genreid));
        const songPos = genres[genrePos].songs.findIndex(g => g.id === parseInt(req.params.songid));
        const toDelete = genres[genrePos].songs[songPos];
        genres[genrePos].songs.splice(songPos, 1);
        res.send(toDelete);
    }
});

app.listen(3000, () => {
    console.log("Listening on port 3000 ...");
});

/*I learned a lot in this project about how programs communicate with each other and how HTTP requests work. I learned about the 
PUT, GET, POST, and DELETE requests. This project can be further extended by working on the frontend by using CSS and HTML.*/
