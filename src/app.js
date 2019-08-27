const path = require('path')
const express = require('express')
const hbs =  require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

console.log(__dirname)
console.log(path.join(__dirname, '../public'))

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Andrew'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Andrew'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        help: 'Need help?',
        name: 'John',
        title: 'Help'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            errorMessage: "You must provide an address term"
        })
    } else {
        geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
            if (error) {
                return res.send({
                    errorMessage: error
                })
            }
    
            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send({
                        errorMessage: error
                    })
                }
    
                res.send({
                    location,
                    forecast: forecastData
                })
            })
        })
        
        
    }
        // return res.send({
        //     address: req.query.address,
        //     forecast: "Raining",
        //     location: "Timisoara"
        // })
})

app.get('/products', (req, res) => {
    

})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew',
        errorMessage: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up on port 3000.')
})
