module.exports = (app, port) => {
    const steam = require("../controllers/steam.controller.js");

    const passport = require('passport');
    const session = require('express-session');
    const passportSteam = require('passport-steam');
    const SteamStrategy = passportSteam.Strategy;

    var router = require("express").Router();

    passport.serializeUser((user, done) => {
    done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    // [-----ROUTES-----]   Authentication
    router.get("/auth", passport.authenticate('steam', {failureRedirect: '/'}), steam.authenticate);
    router.get("/auth/return", passport.authenticate('steam', {failureRedirect: '/'}), steam.returnRedirect);
    router.get("/", steam.authenticationExecuted);



    passport.use(new SteamStrategy({
    returnURL: 'http://localhost:' + port + '/api/steam/auth/return',
    realm: 'http://localhost:' + port + '/api/steam',
    apiKey: '1AD36964899812CA1271CDF4D6251B79'
    }, function (identifier, profile, done) {
        process.nextTick(function () {
        profile.identifier = identifier;
        return done(null, profile);
        });
    }
    ));

    app.use(session({
        secret: 'drakarenan-steam-auth',
        saveUninitialized: true,
        resave: false,
        cookie: {
            maxAge: 3600000
        }
    }))

    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/api/steam', router);


    // router.get('/api/auth/steam', passport.authenticate('steam', {failureRedirect: '/'}), function (req, res) {
    //     res.redirect('/')
    // });

    // router.get('/api/auth/steam/return', passport.authenticate('steam', {failureRedirect: '/'}), function (req, res) {
    //     res.redirect('/')
    // });

    // app.get('/', (req, res) => {
//      res.send(req.user);
// });

    
}