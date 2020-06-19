const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const logger=require('heroku-logger');
const app = express()
require('dotenv').config()

const apiKey = process.env.API_KEY;
const port=process.env.PORT||3000;
let gaID=process.env.GA_ID;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
})

app.post('/', function (req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
  logger.info(`iiiiiiii....${gaID}`);
  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again',gaID:gaID});
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again',gaID:gaID});
      } else {
        let weatherText = `It's ${+((weather.main.temp-32)*(5/9)).toFixed(3)} degree celcius in ${weather.name}!`;
        res.render('index', {weather: weatherText, error: null,gaID:gaID});
      }
    }
  });
})

app.listen(port, function () {
  console.log(`App listening on port ${port}!`);
})