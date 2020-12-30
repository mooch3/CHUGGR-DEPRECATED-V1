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
      const docs = await db.collection('testBets').where('acceptedUsers', 'array-contains', currentUser).get()
      console.log(currentUser)
      res.render('dashboard', {
        docs: docs,
        currentUser: currentUser
      });
    });

    app.get('/pendingbets', async function(req, res) {
      const currentUser = firebase.auth().currentUser.uid;
      const pendingBets = db.collection('testBets').where('allUsers', 'array-contains', currentUser).orderBy('dateOpened', 'desc');

      const snapshot = await pendingBets.get();

      res.render('pendingbets', {
        currentUser: currentUser,
        snapshot: snapshot
      });
    });

    app.get('/managebets', async function(req, res) {
      const currentUser = firebase.auth().currentUser.uid
      const nameRef = firebase.auth().currentUser.firstName
      const friendRef = await db.collection('testUsers').doc(currentUser).collection('friends').get()
      res.render('managebets', {
        currentUser: currentUser,
        nameRef: nameRef,
        friendRef: friendRef
      });
    });

    // possible to have listner client side listening for changes?
    app.get('/bets/:betId', async function(req, res) {
      // TODO: Create dynamic page for each page
      const requestedBet = req.params.betId;
      const currentUser = firebase.auth().currentUser.uid;
      const bet = await db.collection('testBets').doc(requestedBet).get();
      const chatRef = await db.collection('testChatRooms').doc('chatTest').collection('actualMessages').get()
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
      const currentUserProfile = await db.collection('testUsers').where('uid', '==', currentUser).get()


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

// Accessible when user is not logged in
app.get('/', (req, res) => {
  res.render('landingpage')
});

app.get('/createAccount', (req, res) => {
  res.render('createAccount')
});
// TODO create a check if the email is already in use
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
  const newUser = db.collection('testUsers').doc(uid);


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
        res.redirect('/SignIn');
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
app.post('/bets/:betID', async function (req, res){

});

app.post('/pendingbets', async function(req, res){

});
// TODO: add a friend to your friends list
app.post('/friends', async function(req, res) {



});
// Sign Users In https request
app.post('/SignIn', function(req, res) {
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
      console.log(firebase.auth().currentUser)
      res.redirect('dashboard');
    }
  });


});

// Sign out throwing http error "header sent" when you log out and log back in
app.post('/signout', async function (req, res) {

  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    console.log(firebase.auth().currentUser)
    console.log('You signed out')
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
