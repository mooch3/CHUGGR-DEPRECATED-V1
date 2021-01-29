require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const admin = require('firebase-admin');
const firebase = require('firebase');
const cookieParser = require('cookie-parser')
const app = express();
const userControls = require('./controllers/userControllers');
const auth = require('./controllers/auth')


app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/dashboard', auth.cookieCheck, userControls.loadUserDashboard);

app.get('/pendingbets', auth.cookieCheck, userControls.loadUserPendingBets);

app.get('/managebets', auth.cookieCheck, userControls.loadUserManageBets);

app.get('/bets/:betId', auth.cookieCheck, userControls.loadUserDynamicBets);

app.get('/profile', auth.cookieCheck, userControls.loadUserProfile);

// Get any friend's profile
app.get('/profile/:userUID', auth.cookieCheck, userControls.loadUserFriendsProfile);

app.get('/friends', auth.cookieCheck, userControls.loadUserFriendsList);

app.get('/', (req, res) => {
  res.render('landingpage')
});

app.get('/signout', (req, res) => {
  res.clearCookie('session');
  res.render('signout');
});

app.get('/', (req, res) => {
  res.render('landingpage')
});

app.get('/createaccount', (req, res) => {
  res.render('createaccount')
});

app.get('/signin', (req, res) => {
  res.render('signin')
});

app.post('/SignIn', auth.setCookie);

app.post('/managebets', function(req, res) {
  res.redirect('dashboard');
});

// localhost:3000
app.listen(3000, () => {
  console.log('Now listening on port 3000');
});
