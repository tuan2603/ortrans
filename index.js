'use strict';

var express = require('express'),
    app = express(),
    cors = require('cors'),
    mongoose = require('mongoose'),
    Task = require('./models/todoListModel'),
    User = require('./models/userModel'),
    TypeDrive = require('./models/typeDriveModel'),
    UserDoc = require('./models/userDocModel'),
    Referral = require('./models/referralModel'),
    Code = require('./models/codeModel'),
    bodyParser = require('body-parser'),
    path = require('path'),
    jsonwebtoken = require("jsonwebtoken");


const config = require("./config");
const port = config.AUrl;
mongoose.Promise = global.Promise;
mongoose.connect(config.database);
app.set('uploads','./public/uploads');
app.use(express.static('public'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json({limit: "20mb"}));
app.use(bodyParser.urlencoded({limit: "20mb", extended: true}));
app.use(cors());
app.use(function(req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === config.bearer) {
        jsonwebtoken.verify(req.headers.authorization.split(' ')[1], config.secret, function(err, decode) {
            if (err) req.user = undefined;
            req.user = decode;
            next();
        });
    } else {
        req.user = undefined;
        next();
    }
});
var routes = require('./routes/todoListRoutes');
routes(app);

app.use(express.static(path.join(__dirname, 'build')));

// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use(function(req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
});

app.listen(port, function(){
	console.log('todo list RESTful API server started on: ' + port);
});



module.exports = app;
