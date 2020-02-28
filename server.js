require('dotenv').config();

var port = process.env.PORT || 3000;

const path = require('path');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const mongoose = require('mongoose');
const crypto = require('crypto');
const passport = require('passport');
const io = require('socket.io')(http)

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to database'))


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/public",express.static(__dirname + '/public'))
app.get('/update', function (req, res) {
    res.redirect('/login')
})

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/mobile', function (req, res) {
    res.sendFile(path.join(__dirname + '/mobile.html'))
})


const playersRouter = require('./routes/players')
app.use('/players', playersRouter)

const tablesRouter = require('./routes/tables')
app.use('/tables', tablesRouter)

const scoresRouter = require('./routes/scores')
app.use('/scores', scoresRouter)

const matchesRouter = require('./routes/matches')
app.use('/matches', matchesRouter)



// added from passport tutorial @ https://levelup.gitconnected.com/...
const session = require('express-session');

// NEW ----------------------------------------------------------------------------------------
const LocalStrategy = require('passport-local').Strategy;

// ---

const MongoStore = require('connect-mongo')(session);

// NEW --------------------------------------------------------------------------------------------------------------
// START PASSPORT
function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}
function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
    return {
      salt: salt,
      hash: genHash
    };
}

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const userSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String
});

const User = db.model('User', userSchema);
// Tells Passport to use this strategy for the passport.authenticate() method
passport.use(new LocalStrategy(
    // Here is the function that is supplied with the username and password field from the login POST request
    function(username, password, cb) {
        // Search the MongoDB database for the user with the supplied username
        User.findOne({ username: username })
            .then((user) => {
                /**
                 * The callback function expects two values: 
                 * 
                 * 1. Err
                 * 2. User 
                 * 
                 * If we don't find a user in the database, that doesn't mean there is an application error,
                 * so we use `null` for the error value, and `false` for the user value
                 */
                if (!user) { return cb(null, false) }
                
                /**
                 * Since the function hasn't returned, we know that we have a valid `user` object.  We then
                 * validate the `user` object `hash` and `salt` fields with the supplied password using our 
                 * utility function.  If they match, the `isValid` variable equals True.
                 */
                const isValid = validPassword(password, user.hash, user.salt);
                
                if (isValid) {
                    // Since we have a valid user, we want to return no err and the user object
                    return cb(null, user);
                } else {
                    // Since we have an invalid user, we want to return no err and no user
                    return cb(null, false);
                }
            })
            .catch((err) => {   
                // This is an application error, so we need to populate the callback `err` field with it
                cb(err);
            });
}));

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});
passport.deserializeUser(function(id, cb) {
    User.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});
//
// END PASSPORT ------------------------------------------------------------------------------------------







/**
 * -------------- SESSION SETUP ----------------
 */
/**
 * The MongoStore is used to store session data.  We will learn more about this in the post.
 * 
 * Note that the `connection` used for the MongoStore is the same connection that we are using above
 */
const sessionStore = new MongoStore({ mongooseConnection: db, collection: 'sessions' })
/**
 * See the documentation for all possible options - https://www.npmjs.com/package/express-session
 * 
 * As a brief overview (we will add more later): 
 * 
 * secret: This is a random string that will be used to "authenticate" the session.  In a production environment,
 * you would want to set this to a long, randomly generated string
 * 
 * resave: when set to true, this will force the session to save even if nothing changed.  If you don't set this, 
 * the app will still run but you will get a warning in the terminal
 * 
 * saveUninitialized: Similar to resave, when set true, this forces the session to be saved even if it is unitialized
 */
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore 
}));

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */
/**
 * Notice that these middlewares are initialized after the `express-session` middleware.  This is because
 * Passport relies on the `express-session` middleware and must have access to the `req.session` object.
 * 
 * passport.initialize() - This creates middleware that runs before every HTTP request.  It works in two steps: 
 *      1. Checks to see if the current session has a `req.session.passport` object on it.  This object will be
 *          
 *          { user: '<Mongo DB user ID>' }
 * 
 *      2.  If it finds a session with a `req.session.passport` property, it grabs the User ID and saves it to an 
 *          internal Passport method for later.
 *  
 * passport.session() - This calls the Passport Authenticator using the "Session Strategy".  Here are the basic
 * steps that this method takes:
 *      1.  Takes the MongoDB user ID obtained from the `passport.initialize()` method (run directly before) and passes
 *          it to the `passport.deserializeUser()` function (defined above in this module).  The `passport.deserializeUser()`
 *          function will look up the User by the given ID in the database and return it.
 *      2.  If the `passport.deserializeUser()` returns a user object, this user object is assigned to the `req.user` property
 *          and can be accessed within the route.  If no user is returned, nothing happens and `next()` is called.
 */
app.use(passport.initialize());
app.use(passport.session());


/**
 * -------------- ROUTES ----------------
 */
// When you visit http://localhost:3000/login, you will see "Login Page"
app.get('/login', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/login.html'));
});
// Since we are using the passport.authenticate() method, we should be redirected no matter what 
app.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: 'login-success' }), (err, req, res, next) => {
    if (err) next(err);
});
// When you visit http://localhost:3000/register, you will see "Register Page"
/*app.get('/register', (req, res, next) => {
    const form = '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';
    res.send(form);
    
});
app.post('/register', (req, res, next) => {
    
    const saltHash = genPassword(req.body.password);
    
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt
    });
    newUser.save()
        .then((user) => {
            console.log(user);
        });
    res.redirect('/login');
});
/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 * 
 * Also, look up what behaviour express session has without a maxage set
 */
app.get('/protected-route', (req, res, next) => {
    console.log(req.session);
    if (req.isAuthenticated()) {
        res.send('<h1>You are authenticated</h1>');
    } else {
        res.send('<h1>You are not authenticated</h1>');
    }
});
// Visiting this route logs the user out
app.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/login');
});
app.get('/login-success', (req, res, next) => {
    console.log(req.session);
    res.sendFile(path.join(__dirname + '/update.html'));
});
app.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});




io.on('connection', async function(socket) {
    console.log("A user connected")

    //send scores to client
    const Score = require('./models/score')
    const scores = await Score.find()
    socket.emit('scores', scores)

    //send tables to client
    const Table = require('./models/table')
    const tables = await Table.find()
    socket.emit('tables', tables)

    socket.on('updateTable', table => {
        console.log('Incoming table...')
        socket.broadcast.emit('tableChange', table)
    })

    socket.on('updateScore', score => {
        console.log('Incoming score...')
        socket.broadcast.emit('scoreChange', score)
    })
    
    socket.on('updateMatch', match => {
        console.log('Incoming match...')
        socket.broadcast.emit('matchChange', match)
    })

    socket.on('disconnect', function(){
        console.log('user disconnected');
        });
})

//app.listen(port, () => console.log('Server Started'))

http.listen(port, () => console.log("http listening"))




/**
 * -------------- HELPER FUNCTIONS ----------------
 */
/**
 * 
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 * 
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}
/**
 * 
 * @param {*} password - The password string that the user inputs to the password field in the register form
 * 
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 * 
 * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
 * You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
 */
function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
    return {
      salt: salt,
      hash: genHash
    };
}