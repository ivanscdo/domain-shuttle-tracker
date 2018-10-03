var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;


var PORT = process.env.PORT || 3000;
var db = require("./models");
var app = express();

app.use(express.static("public"));
app.use(session({ secret: "dogs", resave: false, saveUninitialized: false}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger("dev"));

passport.use(new LocalStrategy(
    function(username, password, done) {
        db.User.findOne({username: username}, function(err, user) {
            // console.log(username, password, err, user, done);
            // console.log(user.username, user.password);

            if (err) {return done(err); }
            if (!user || !user.password) {
                return done(null, false);
            }
            // if (!user.password)) {
            //     return done(null, false, {message: "Incorect password."});
            // }
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    db.User.findById(id, function(err, user) {
      done(err, user);
    });
  });

mongoose.Promise = Promise;

if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
} else {
    mongoose.connect("mongodb://localhost/shuttlelogdb");
}

app.get("/test/:username/:password", function(req, res) {
    // var date = Date();
    // var timezoneOffsetFull = date.substring(28,31);
    // var timezoneOffsetFullInt = parseInt(timezoneOffsetFull, 10);
    // var timezoneOffset = date.substring(29,31);
    // var timezoneOffsetInt = parseInt(timezoneOffset, 10);

    // var offsetCreated = new Date();
    // var offsetCreatedUTC = offsetCreated.getUTCHours();

    // var date = Date();
    // var timezoneOffset = date.substring(29,31);
    // var timezoneOffsetInt = parseInt(timezoneOffset,10);

    // if ( offsetCreatedUTC <= timezoneOffsetInt) {
    //     offsetCreated.setUTCHours( offsetCreatedUTC - timezoneOffsetInt );
        
    //     res.send(offsetCreated);


    // } else if ( offsetCreatedUTC > timezoneOffsetInt ) {

    //     res.send(offsetCreated);

    // }

    var username = req.params.username,
        password = req.params.password;

    db.User.find({
        username: username, 
        password: password
    })
    .then(function(dbUser) {
            res.json(dbUser);
        })
        .catch(function(err){
            res.json(err);
        });




});

app.get("/form", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/form.html"));
});

app.get("/reports", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/reports.html"));
});

app.get("/reports/all", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/reports-all.html"));
});


app.get("/reports/current-day", function(req, res){
    res.sendFile(path.join(__dirname, "/public/reports-currentDay.html"));
});

// app.get("/test-params/:testone/:testtwo", function(req, res) {
//     res.send("red wine, success!");
//     console.log(req.params.testone);
//     console.log(req.params.testtwo);
//     // if(req.params.test-one && req.params.test-two) {
//     //     res.send("red wine, success 1&2!");
//     //     console.log(`
//     //     test1: ${req.params.test-one} 
//     //     test2: ${req.params.test-two}`);
//     // } else if (req.params.test-one && !req.params.test-one) {
//     //     res.send("red wine, success 1!");
//     //     console.log(`${req.params.test-one}`)

//     // } else if (!req.params.test-one && !req.params.test-two) {
//     //     res.send("no params at all!");
//     // }
// });

app.get("/api/reports/current-day/:name", function(req, res) {
// app.get("/api/reports/current-day/", function(req, res) {

    var searchedDriver = req.params.name;

    var currentDate = new Date();
    // var newDate = new Date();
    // var date = Date();
    // var dateNow = Date.now();
    var searchedDate = "";

    // var subCurrentDate = currentDate.substring(0,14);
    // var toDateString = currentDate.toDateString();
    // var toISOString = currentDate.toISOString();
    // var toISOString = toDateString.toISOString();    
    // var toUTCString = currentDate.toUTCString();
    // var searchedDate = toISOString.substring(0,10);

    // console.log(`
    // currentDate: ${currentDate}
    // toISOString: ${toISOString}
    // searchedDate: ${searchedDate}
    // date: ${date}
    // date.substring: ${date.substring(0,15)}
    // timezone offset : ${currentDate.getTimezoneOffset()}
    // ${currentDate.setDate(25)}
    // ${currentDate}
    // ${currentDate.toISOString()}
    // `);

    // console.log(`
    // ${currentDate}
    // ${currentDate.toISOString()}
    // ${currentDate.getUTCHours()}
    // ${currentDate.getUTCMinutes()}
    // ${currentDate.setUTCHours(currentDate.getUTCHours()-2)}
    // ${currentDate}
    // ${currentDate.toISOString()}
    // `);

    // console.log(`
    // ${currentDate}
    // ${currentDate.toLocaleTimeString('en-US')}
    // ${currentDate.toISOString()}
    // `);

    if ( currentDate.getUTCHours() <= 5 ) {
        currentDate.setUTCHours( currentDate.getUTCHours() - 5 );
        // console.log(`
        // -hrs: > 18-
        // ${currentDate}
        // ${currentDate.toISOString()}
        // `);

        searchedDate = currentDate.toISOString().substring(0,10);
        
    } else if ( currentDate.getUTCHours() > 5 ) {
        // console.log(`===0:${currentDate.getUTCMinutes()}`);
        // console.log(`
        // -hrs: <= 18-
        // ${currentDate.getUTCHours()}
        // ${currentDate}
        // ${currentDate.toISOString()}
        // `);
        
        searchedDate = currentDate.toISOString().substring(0,10);
    }

    // console.log(searchedDate);

    db.ShuttleLog.find({
        dateString: searchedDate,
        // date: toISOString
        name: searchedDriver
    })
    .then(function(dbShuttleDriver) {
            res.json(dbShuttleDriver);
        })
        .catch(function(err){
            res.json(err);
        });

    // res.send(currentDate);
});

// app.get("/api/reports/:shuttleDriver/:dateFrom/:dateTo/:shuttle/:shift/:timeFrom/:timeTo/:pickUp/:dropOff/:passengers/:contact/:tipsFrom/:tipsTo/:tourist/:resident/:northside/:notes", function(req, res) {
// app.get("/api/reports/:shuttleDriver/:dateFrom/:dateTo/:shuttle/:shift/:timeFrom/:timeTo/:pickUp/:dropOff/:passengers/:contact/:tipsFrom/:tipsTo", function(req, res) {
// app.get("/api/reports/:shuttleDriver/:dateFrom/:dateTo/:shuttle/:shift/:timeFrom/:timeTo/:passengers/:contact/:tipsFrom/:tipsTo", function(req, res) {
// app.get("/api/reports/:shuttleDriver/:dateFrom/:dateTo/:shuttle/:shift/:passengers/:contact/:tipsFrom/:tipsTo", function(req, res) {
// app.get("/api/reports/:shuttleDriver/:dateFrom/:dateTo/:shuttle/:shift/:passengers/:contact", function(req, res) {
// app.get("/api/reports/:shuttleDriver/:dateFrom/:dateTo/:shuttle/:shift/:timeFrom/:timeTo/:pickUp/:dropOff/:passengers/:contact", function(req, res) {
// app.get("/api/reports/:dateFrom/:dateTo/:tipsFrom/:tipsTo", function(req, res) {
// app.get("/api/reports/:tourist/:resident/:northside/:noteExists", function(req, res) {
app.get("/api/reports/:noteExists", function(req, res) {







// app.get("/api/reports/:timeFrom/:timeTo", function(req, res) {
// app.get("/api/reports/:tourist/:resident/:northside", function(req, res) {
// app.get("/api/reports/:pickUp/:dropOff", function(req, res) {
// app.get("/api/reports/:contact/:tips", function(req, res) {
// app.get("/api/reports/:shuttle/:shift", function(req, res) {

    var searchDriver = req.params.shuttleDriver;

    var dateFrom = new Date(req.params.dateFrom);
    // var searchDateFrom = req.params.dateFrom;
    // var searchDateFrom = dateFrom.toISOString();
    // var dateFromISO = dateFrom.toISOString();
    // var searchDateFrom =ISODate("" + dateFromISO + "") "

    var dateTo = new Date(req.params.dateTo);
    // var searchDateTo = req.params.dateTo;
    // var searchDateTo = dateTo.toISOString();
    // var dateToISO = dateTo.toISOString();
    // var searchDateTo =" ISODate("" + dateToISO + "") "

    var searchShuttle = req.params.shuttle; 
    var searchShift = req.params.shift;
    var searchTimeFrom = req.params.timeFrom;
    var searchTimeTo = req.params.timeTo;
    var searchPickUp = req.params.pickUp;
    var searchDropOff = req.params.dropOff;
    var searchPassengers = req.params.passengers;
    var searchContact = req.params.contact;
    var searchTipsFrom = req.params.tipsFrom;
    var searchTipsTo = req.params.tipsTo;

    var searchTourist = req.params.tourist;
    var searchResident = req.params.resident;
    var searchNorthside = req.params.northside;
    var searchNotes = req.params.noteExists;

    // console.log(`
    // searchDateFrom: ${typeof searchDateFrom}
    // searchDateTo: ${searchDateTo}

    // dateFrom: ${typeof dateFrom}
    // dateTo: ${dateTo}

    // req.params: ${typeof req.params.dateFrom}
    // req.params: ${typeof req.params.dateTo}

    // ${ typeof new Date(searchDateFrom) }

    // `)

    // console.log(`
    // searchTimeFrom: ${searchTimeFrom}
    // searchTimeTo: ${searchTimeTo}
    // `);

    // console.log(`
    // searchTourist ${searchTourist}
    // searchResident ${searchResident}
    // searchNorthside ${searchNorthside}
    // `);

    // console.log(`
    // searchPickUp: ${searchPickUp}
    // searchDropOff: ${searchDropOff}
    // `);

    // console.log(`
    // tips: ${searchTips}
    // contact: ${searchContact}
    // `);

    // console.log(`
    // shuttle: ${searchShuttle}
    // shift: ${searchShift}
    // `);

    db.ShuttleLog.find({
        // name: searchDriver, 
        // date:  {
        //     // $gte: new Date( req.params.dateFrom ),
        //     // $lte: new Date( req.params.dateTo )
        //     $gte: dateFrom,
        //     $lte: dateTo
        // }, 
        // shuttle: searchShuttle,
        // shift: searchShift, 
        // time: {
        //     $gte: searchTimeFrom,
        //     $lte: searchTimeTo
        // },
        // pickUp: searchPickUp,
        // dropOff: searchDropOff,
        // passengers: searchPassengers,
        // contact: searchContact,
        // tips: {
        //     $gte: searchTipsFrom,
        //     $lte: searchTipsTo
        // }, 
        // tourist: searchTourist, 
        // resident: searchResident,
        // northside: searchNorthside, 
        noteExists: searchNotes
    })
        .then(function(dbShuttleLog){
            res.json(dbShuttleLog);
        })
        .catch(function(err){
            res.json(err);
        });
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

app.get("/api/logs-by-name/:name", function(req, res) {
    var searchedDriver = req.params.name;

    db.ShuttleLog.find({
        name: searchedDriver
    })
        .then(function(dbSearchedDriver) {
            res.json(dbSearchedDriver);
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

app.get("/red-wine-success", 
// passport.authenticate('local', { session: false }),
 function(req, res) {
    console.log(req);
    console.log(req.user);
    // res.send("red wine, success!");
    res.json({_id: req.user._id, username: req.user.username})
});


app.post("/submit-shuttle-log", function(req, res) {
    var shuttleLog = new db.ShuttleLog(req.body);
    shuttleLog.dateToDateString();
    // shuttleLog.formatTips();
    shuttleLog.timezoneOffsetLogCreated();
    // shuttleLog.timezoneOffsetLogUpdated();
    shuttleLog.checkIfNoteExists();

    db.ShuttleLog.create(shuttleLog)
        .then(function(dbShuttleLog) {
            res.sendFile(path.join(__dirname, "/public/form.html"));
            // res.json(dbShuttleLog)
        })
        .catch(function(err) {
            res.json(err);
        })
    console.log(req.body);
    // res.json(req.body);

});

app.post('/login',
  passport.authenticate('local', {  successRedirect: '/red-wine-success',
                                    failureRedirect: '/login',
                                    // failureFlash: false 
                                    // failureFlash: "Invalid username or password."
                                })
);

// app.post('/login', 
//   passport.authenticate('local', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/red-wine-success');
//   });

app.listen(PORT, function() {
    console.log("App running on http://localhost:" + PORT);
});