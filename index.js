const express = require('Express');
const Joi = require('joi');
const joi = require('joi');

const app = express();
app.use(express.json());

const movies = [{
    "Title": "You Can Count on Me",
    "US_Gross": 9180275,
    "Worldwide_Gross": 11005992,
    "US_DVD_Sales": null,
    "Production_Budget": 1200000,
    "Release_Date": "Nov 10 2000",
    "MPAA_Rating": "R",
    "Running_Time_min": null,
    "Distributor": "Paramount Vantage",
    "Source": "Original Screenplay",
    "Major_Genre": "Drama",
    "Creative_Type": "Contemporary Fiction",
    "Director": null,
    "Rotten_Tomatoes_Rating": 95,
    "IMDB_Rating": 7.7,
    "IMDB_Votes": 14261
}]


app.get('/', (req, res) => {
    res.send("Hello World");
});

app.get('/movies', (req, res) => {
    res.send(movies);
});

app.post('/movie', (req, res) => {
    const {error} = validateMovie(req.body);
    if(error){ 
        return error.details[0].message;
    }
    movies.push(req.body)
    res.send(movies);
});

app.get('/movie/:title', (req, res) => {
    var movie = checkMovie(req);
    if(movie.length === 0) {
        res.status(404).send("Movie With Searched Title Not Found")
    } else {
        res.send(movie);
    }
});

app.put('/movie/:title', (req, res) => {
    var movie = checkMovie(req);
    if(movie.length === 0) {
        res.status(404).send("Movie with Given Title is not found")
    }
    else if(movie.length > 1) {
        res.status(404).send("Title is not unique")
    }
    else {
        movie.Title = req.body.Title;
        res.send(movie)
    }
});

app.delete('/movie/:title', (req, res) => {
    var movie = checkMovie(req);
    if(movie.length === 0) {
        res.status(404).send("Movie with Given Title is not found")
    }
    else if(movie.length > 1) {
        res.status(404).send("Title is not unique")
    }
    else {
        const index = movies.indexOf(movie);
        movies.splice(index,1);
        res.send(movies)
    }
});

app.get('/report/:genre', (req, res) => {
    var report = checkGenre(req);
    if(report.length == 0) {
        res.status(404).send("Movie With Searched Genre Not Found")
    } else {
        res.send(report.length.toString());
    }
});

app.get('/reports/:date', (req, res) => {
    var movie = [];
    movies.forEach((key, val) => {
        if(key.Release_Date === req.params.date) {
            movie.push(key)
        }
    });
    if(movie.length == 0) {
        res.status(404).send("Movie With Release Date Not Found")
    } else {
        res.send(movie.length.toString());
    }
});

function validateMovie(req) {
    const schema = Joi.object({
        Title: Joi.string().min(3).required(),
        US_Gross: Joi.number().required(),
        Worldwide_Gross: Joi.number().required(),
        US_DVD_Sales: Joi.number().required(),
        Production_Budget: Joi.number().required(),
        Release_Date: Joi.date().required(),
        MPAA_Rating: Joi.number().required(),
        Running_Time_min: Joi.string().required(),
        Distributor: Joi.string().min(3).required(),
        Source: Joi.string().min(3).required(),
        Major_Genre: Joi.string().min(3).required(),
        Creative_Type: Joi.string().min(3).required(),
        Director: Joi.string().min(3).required(),
        Rotten_Tomatoes_Rating: Joi.number().required(),
        IMDB_Rating: Joi.number().min(3).required(),
        IMDB_Votes: Joi.number().min(3).required(),
    })
    return result = schema.validate(req);
}

function checkMovie(req) {
    var movie = []
    movies.forEach((key, val) => {
        if(key.Title === req.params.title) {
            movie.push(key)
        }
    });
    return movie;
}

function checkGenre(req) {
    var movie = [];
    movies.forEach((key, val) => {
        if(key.Major_Genre === req.params.genre) {
            movie.push(key)
        }
    });
    return movie;
}

app.listen(3000, () => console.log("Listening To Port 3000"));