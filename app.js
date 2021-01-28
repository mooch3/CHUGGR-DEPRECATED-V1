require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const admin = require('firebase-admin');
const firebase = require('firebase');
const app = express();
const SERVICE_ACCOUNT = require(process.env.FIREBASE_SERVICE_ACCOUNT)

admin.initializeApp({
  credential: admin.credential.cert(SERVICE_ACCOUNT),
  databaseURL: "https://chuggr-6a851.firebaseio.com"
});

// Set view for EJS templating engine
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));
const db = admin.firestore();
var currentUser;
// Global variables are bad practice, research a way to replace your current
// sign-in flow

   const loadUserDashboard = async function(req, res) {
     if (!currentUser) {
       res.redirect('/signin')
     } else {
      const docs = await db.collection('testBets')
                           .where('acceptedUsers', 'array-contains', currentUser)
                           .get();
      res.render('dashboard', {
        docs: docs,
        currentUser: currentUser
      });
    }
  };
const loadUserPendingBets = async function(req, res) {
    if (!currentUser) {
      res.redirect('/signin')
    } else {
      const pendingBets = db.collection('testBets')
                            .where('allUsers', 'array-contains', currentUser)
                            .orderBy('dateOpened', 'desc');

      const snapshot = await pendingBets.get();

      res.render('pendingbets', {
        currentUser: currentUser,
        snapshot: snapshot
      });
    };
  }
const loadUserManageBets = async function(req, res) {
    if (!currentUser) {
      res.redirect('/signin')
    } else {
      const nameRef = await db.collection('testUsers')
                              .doc(currentUser)
      const friendRef = await db.collection('testUsers')
                              .doc(currentUser)
                              .collection('friends')
                              .get();
      res.render('managebets', {
        currentUser: currentUser,
        friendRef: friendRef
      });
    }
  }
const loadUserDynamicBets = async function(req, res) {
    if (!currentUser) {
      res.redirect('/signin');
    } else {

      const requestedBet = req.params.betId;
      const bet = await db.collection('testBets')
                          .doc(requestedBet)
                          .get();
      const chatRef = await db.collection('testChatRooms')
                              .doc('chatTest')
                              .collection('actualMessages')
                              .get();
      res.render('bets', {
        bet: bet.data(),
        chatRef: chatRef,
        currentUser: currentUser,
        betID: requestedBet
      });
    }
  }
const loadUserProfile = async function(req, res) {
  if (!currentUser){
    res.redirect('/signin');
  } else {
    const requestedProfile = currentUser;
    const userProfile = await db.collection('testUsers')
                                .where('uid', '==', requestedProfile)
                                .get();
      res.render('profile', {
        userProfile: userProfile
      });
    }
  }
const loadFriendProfile = async function(req, res) {
    if (!currentUser) {
      res.redirect('/signin');
    } else {
      const requestedProfile = req.params.userUID;
      const userProfile = await db.collection('testUsers')
                                  .where('uid', '==', requestedProfile)
                                  .get();
      res.render('profile', {
        userProfile: userProfile,
      });
    }
  }
const loadUserFriendsList = async function(req, res) {
    if (!currentUser) {
      res.redirect('/signin');
    } else {
      const friendsList = await db.collection('testUsers')
                                  .doc(currentUser)
                                  .collection('friends')
                                  .get();
      console.log(friendsList)
      res.render('friends', {
        friendsList: friendsList,
        currentUser: currentUser
      })
    };
  }

const authenticateUser = async function(req, res, next) {
  const authToken = await req.get('authToken');

  if (authToken) {
      admin
        .auth()
        .verifyIdToken(authToken)
        .then((decodedToken) => {
          currentUser = decodedToken.uid;
          console.log(decodedToken);
        })
        .then((currentUser) => {
          res.redirect('dashboard')
        })
        .catch((error) => {
          // Handle error
          console.log('not authorized')
        });
    }
  };


// Routes
app.get('/dashboard', loadUserDashboard);

app.get('/pendingbets', loadUserPendingBets);

app.get('/managebets', loadUserManageBets);

app.get('/bets/:betId', loadUserDynamicBets);

app.get('/profile', loadUserProfile);

// Get any another friend's profile
app.get('/profile/:userUID', loadFriendProfile);

app.get('/friends', loadUserFriendsList);

app.get('/', (req, res) => {
  res.render('landingpage')
});

app.get('/signout', (req, res) => {
  res.render('signout')
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

app.post('/SignIn', authenticateUser);

app.post('/managebets', function(req, res) {
  res.redirect('dashboard');
});

// localhost:3000
app.listen(3000, () => {
  console.log('Now listening on port 3000');
});
