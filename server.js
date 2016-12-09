/**
 * Created by mattpowell on 12/2/16.
 */

var OAuthStrategy = require('passport-oauth').OAuthStrategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var express = require('express');
var passport = require('passport');
    app = express();
var pg = require('pg');
var LocalStrategy = require('passport-local').Strategy;

app.use(express.static('www'));
// app.use(express.static('public'));
// app.use(express.cookieParser());
// app.use(express.bodyParser());
// app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
// app.use(app.router); *** DEPRECATED, DO NOT USE ***

app.get('/', function (request, response) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * FROM test_table', function(err, result) {
            done();
            if (err)
            { console.error(err); response.send("Error " + err); }
            else
            { response.render('index.html', {results: result.rows} ); }
        });
    });
});

// app.get('/', function (request, response) {
//     var hostUrl = request.protocol + '://' + request.get('host');
//     response.redirect(hostUrl + "/www/index.html");
// });



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

var localOptions = {
    usernameField: 'email'
};

var localLogin = new LocalStrategy(localOptions, function(email, password, done){
    User.findOne({
        email: email
    }, function(err, user){
        if(err){
            return done(err);
        }
        if(!user){
            return done(null, false, {error: 'Login failed. Please try again.'});
        }
        user.comparePassword(password, function(err, isMatch){
            if(err){
                return done(err);
            }
            if(!isMatch){
                return done(null, false, {error: 'Login failed. Please try again.'});
            }
            return done(null, user);
        });
    });
});

passport.use(localLogin);

passport.use('provider', new OAuthStrategy({
        requestTokenURL: 'https://www.provider.com/oauth/request_token',
        accessTokenURL: 'https://www.provider.com/oauth/access_token',
        userAuthorizationURL: 'https://www.provider.com/oauth/authorize',
        consumerKey: '123-456-789',
        consumerSecret: 'shhh-its-a-secret',
        callbackURL: 'postgres://kqzioadrsfandc:7gwnpWCSQgN-YszAAkB-ng_o6y@ec2-54-243-185-123.compute-1.amazonaws.com:5432/d5os6nia3gfi0a'
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
        callbackURL: "postgres://kqzioadrsfandc:7gwnpWCSQgN-YszAAkB-ng_o6y@ec2-54-243-185-123.compute-1.amazonaws.com:5432/d5os6nia3gfi0a"
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

app.post('/login',
    passport.authenticate('localLogin', {successRedirect: '/app/homebase',
        failureRedirect: '/login'}));
