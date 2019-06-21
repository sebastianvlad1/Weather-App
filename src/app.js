const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');


const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewPath = path.join(__dirname, '../templates/views');
const partialPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewPath);
hbs.registerPartials(partialPath);


// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

//
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Brinzas Sebastian-Vlad'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is a helpful text.',
        title: 'Help',
        name: 'Brinzas Sebastian-Vlad'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
      title: 'About me',
      name: 'Brinzas Sebastian-Vlad'  
    })
});

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address.'
        });
    }
    address = req.query.address;

    geocode(address, (error, { latitude, longitude, location } = {} ) => {
        if(error){
            return res.send({
                error
            });
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({
                    error
                });
            } else{
                res.send({
                    forecast: forecastData,
                    location,
                    address
                });
            }
        });
    });
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term!'
        });
    }
    res.send({
        products: []
    });
});

app.get('/help/*', (rez, res) => {
    res.render('404', {
        title: '404 Error',
        name: 'Brinzas Seabstian-Vlad',
        errorMessage: 'Error: Help article not found.'
    })
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 Page',
        name: 'Brinzas Sebastian-Vlad',
        errorMessage: 'Error 404: Page not found'
    });
});

app.listen(3000, () => {
    console.log('Server is up on port 3000!');
});