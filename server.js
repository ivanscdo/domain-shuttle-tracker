var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");

var PORT = process.env.PORT || 3000;

var db = require("./models");

var app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/shuttlelogdb");

app.get("/form", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/form.html"));
});

app.get("/reports", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/reports.html"));
});

app.get("/login", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/login.html"));
});

app.get("/all-logs", function(req, res) {
    db.ShuttleLog.find({})
        .then(function(dbShuttleLog) {
            res.json(dbShuttleLog);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.get("/logs-by-name/:name", function(req, res) {
    var shuttleDriver = req.params.name;

    db.ShuttleLog.find({
        name: shuttleDriver
    })
        .then(function(dbShuttleDriver) {
            res.json(dbShuttleDriver);
        })
        .catch(function(err){
            res.json(err);
        });
});

app.get("/logs-by-shuttle/:shuttle", function(req, res) {
    var shuttleType = req.params.shuttle;

    db.ShuttleLog.find({
        shuttle: shuttleType
    })
        .then(function(dbShuttleType) {
            res.json(dbShuttleType);
        })
        .catch(function(err){
            res.json(err);
        });
});


app.post("/submit-shuttle-log", function(req, res) {
    var shuttleLog = new db.ShuttleLog(req.body);
    // shuttleLog.formatDate();

    db.ShuttleLog.create(shuttleLog)
        .then(function(dbShuttleLog) {
            res.sendFile(path.join(__dirname, "/public/form.html"));
            // res.json(dbShuttleLog)
        })
        .catch(function(err) {
            res.json(err);
        })
    // console.log(req.body);
    // res.json(req.body);

});

app.listen(PORT, function() {
    console.log("App running on http://localhost:" + PORT);
});