/**
 * Created by Eamonn on 2015/9/17.
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var sessionstore = require('sessionstore');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false,limit: '10mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var aDay = 3600000 * 24;
app.use(session({
    secret: '12345',
    cookie: {maxAge: aDay},
    store: sessionstore.createSessionStore(),
    resave: true,
    saveUninitialized: true
}));
module.exports = app;
