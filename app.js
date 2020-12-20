const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const admin = require('firebase-admin');
const firebase = require('firebase')
const app = express();


const firebaseConfig = {
  apiKey: "AIzaSyAJGkHcDPbbLW1pf29xb-uqNc9Ygd39F04",
  authDomain: "chuggr-6a851.firebaseapp.com",
  databaseURL: "https://chuggr-6a851.firebaseio.com",
  projectId: "chuggr-6a851",
  storageBucket: "chuggr-6a851.appspot.com",
  messagingSenderId: "1046653963698",
  appId: "1:1046653963698:web:e26ab6a28553d00f5be8ab",
  measurementId: "G-5TMDD3N2B2"
};

firebase.initializeApp(firebaseConfig);


const serviceAccount = require("/Users/smithdc/Desktop/MyApp/CHUGGR/chuggr-6a851-firebase-adminsdk-rbwee-19697363db.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chuggr-6a851.firebaseio.com"
});



// Set view for EJS templating engine
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('public'));
// accessible only if user is logged in

// reference for firestore DB
const db = admin.firestore();

// Redirect users with authstate listener
firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    app.get('/', (req, res) => {
      res.render('landingpage')
    });


  } else {
    // A user is detected

    app.get('/dashboard', async function(req, res) {
      // Retrieve data from Firestore
      // Use async function to fullfill promise
      const currentUser = firebase.auth().currentUser.uid;
      const docs = await db.collection('bets').where('acceptedUsers', 'array-contains', currentUser).get()

      res.render('dashboard', {
        docs: docs
      });
    });

    app.get('/managebets', function(req, res) {
      const currentUser = firebase.auth().currentUser.uid
      const nameRef = firebase.auth().currentUser.firstName
      res.render('managebets', {
        currentUser: currentUser,
        nameRef: nameRef
      });
    });

    // possible to have listner client side listening for changes?
    app.get('/bets/:betId', async function(req, res) {
      // TODO: Create dynamic page for each page
      const requestedBet = req.params.betId;
      const currentUser = firebase.auth().currentUser.uid;
      const bet = await db.collection('bets').doc(requestedBet).get();
      const chatRef = await db.collection('chatRooms').doc('chatTest').collection('actualMessages').get()
      console.log(bet.data())
        res.render('bets', {
          bet: bet.data(),
          chatRef: chatRef,
          currentUser: currentUser,
          betID: requestedBet
        });



      });






    // Get user profile
    app.get('/profile', async function(req, res) {
      const currentUser = firebase.auth().currentUser.uid;
      // possible to use a listener client side to reduce reads?
      const currentUserProfile = await db.collection('users').where('uid', '==', currentUser).get()


      res.render('profile', {
        currentUserProfile: currentUserProfile
      });
    });

    // Sign out of the application
    app.get('/signout', (req, res) => {
      res.render('signout')
    });
  };
});




// Render bet pages dynamically
app.post('/bets/:betId', async function(req, res) {
  // Post request to send chat message to firestore gets rendered real time on client side

  const uid = firebase.auth().currentUser.uid
  const docRef = await db.collection('chatRooms').doc('chatTest').collection('actualMessages')

  // http request headers sent error?
  docRef.add({
    message: req.body.message,
    sender: uid,
    timestamp: Date.now()
  }).then(() => {
    console.log('message is saved to chat')
  }).catch((err) => {
    console.log(err)
  });

});



// Accessible when user is not logged in
app.get('/', (req, res) => {
  res.render('landingpage')
});

app.get('/createAccount', (req, res) => {
  res.render('createAccount')
});

app.get('/signin', (req, res) => {
  res.render('signin')
});

app.get('/friends', (req, res) => {
  const currentUser = firebase.auth().currentUser.uid
  res.render('friends', {
    currentUser: currentUser
  })
});

// Create a new account with CHUGGR
// UID is automatically created and can be tapped into through firebase
app.post('/createAccount', (req, res) => {
  const email = req.body.inputEmail;
  const password = req.body.inputPassword;
  const userName = req.body.userName;
  const firstName = req.body.firstUserName;
  const lastName = req.body.lastUserName;
  const bio = req.body.bio;



  firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
  const uid = firebase.auth().currentUser.uid;
  const newUser = db.collection('users').doc(uid);


    // New user doc in db
    newUser.set({
      betsLost: 0,
      betsWon: 0,
      bio: bio,
      drinksGiven: {
        beers: 0,
        shots: 0,
      },
      drinksOutstanding: {
        beers: 0,
        shots: 0,
      },
      drinksReceived: {
        beers: 0,
        shots: 0,
      },
      email: email,
      firstName: firstName,
      lastName: lastName,
      numBets: 0,
      numFriends: 0,
      profilePic: "",
      recentFriends: [],
      uid: uid,
      userName: userName,
    });

  }).then((user) => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        res.redirect('dashboard');
      } else {
        console.log('No user')
        res.redirect('landingpage')
      }
    });
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

  });

});
// TODO: add a friend to your friends list
app.post('/friends', async function(req, res) {



});
// Sign Users In https request
app.post('/SignIn', (req, res) => {
  let email = req.body.inputEmail;
  let password = req.body.inputPassword;

  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // user is signed in
      res.redirect('dashboard');
    }
  });

});

// Sign out throwing http error "header sent" when you log out and log back in
// This means there must have data being sent multiple times
app.post('/signout', (req, res) => {

  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    res.redirect('signout');
  }).catch(function(error) {
    // An error happened.
    console.log(error);
  });
});

app.post('/managebets', function(req, res) {
  // redirect button after a bet is successfully saved to database
  res.redirect('dashboard');

});

// localhost:3000
app.listen(3000, () => {
  console.log('Now listening on port 3000');
});
