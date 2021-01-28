const firestore = firebase.firestore();
const auth = firebase.auth();

const createAccountBtn = document.getElementById('createAccountBtn');

createAccountBtn.addEventListener('click', (e) => {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const userName = document.getElementById('userName').value;
  const password = document.getElementById('password').value;
  const bio = document.getElementById('bio').value;

auth.createUserWithEmailAndPassword(email, password).then(user => {
  console.log(firebase.auth().currentUser.uid);
  const uid = firebase.auth().currentUser.uid;
  const newUser = firestore.collection('testUsers').doc(uid);

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
  auth.onAuthStateChanged((user) => {
    console.log(user)
    if (user != null) {
      auth.currentUser.getIdToken(true).then((idToken) => {
        const xhr = new XMLHttpRequest();

        xhr.open('POST', '/SignIn', true);
        xhr.setRequestHeader('authToken', idToken);
        xhr.send()
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4 && xhr.status == 200) {
            window.location = "/dashboard";
          }
        }
      }).catch((error) => {
        console.log(error);
      });
    } else {
      console.log('Not logged in.')
    }
  });
}).catch((error) => {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
});
});
