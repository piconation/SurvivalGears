/**
 * Created by mattpowell on 12/2/16.
 */

var OAuthStrategy = require('passport-oauth').OAuthStrategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var express = require('express');
var passport = require('passport');
    app = express();

// app.use(express.static('www'));
// app.use(express.static('public'));
// app.use(express.cookieParser());
// app.use(express.bodyParser());
// app.use(express.session({ secret: 'keyboard cat' }));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(app.router);

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// API Routes
// app.get('/blah', routeHandler);

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

app.post('/login',
    passport.authenticate('local', {successRedirect: '/app/homebase',
        failureRedirect: '/login'}));

passport.use('provider', new OAuthStrategy({
        requestTokenURL: 'https://www.provider.com/oauth/request_token',
        accessTokenURL: 'https://www.provider.com/oauth/access_token',
        userAuthorizationURL: 'https://www.provider.com/oauth/authorize',
        consumerKey: '123-456-789',
        consumerSecret: 'shhh-its-a-secret',
        callbackURL: 'https://www.example.com/auth/provider/callback'
    },
    function(token, tokenSecret, profile, done) {
        User.findOrCreate('Insert user name here', function(err, user) {
            done(err, user);
        });
    }
));

app.get('/auth/provider/callback',
    passport.authenticate('provider', { successRedirect: '/',
        failureRedirect: '/login' }));

passport.use(new FacebookStrategy({
        clientID: 1760337584239123,
        clientSecret: 'f1833e6c4fd2f4a4b0f0add1857c7280',
        callbackURL: "https://matc-gp.com/__/auth/handler"
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOrCreate('Insert user name here', function(err, user) {
            if (err) { return done(err); }
            done(null, user);
        });
    }
));

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/',
        failureRedirect: '/login' }));

passport.use(new GoogleStrategy({
        clientID: 1049868233251,
        clientSecret: 'M_PWpSPXorT587FH-VJ9sHMp',
        callbackURL: "https://accounts.google.com/o/oauth2/auth"
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(err, user);
        });
    }
));

app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });