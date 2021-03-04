"use strict";

var firestore = firebase.firestore();
var auth = firebase.auth();
var createAccountBtn = document.getElementById('createAccountBtn');
createAccountBtn.addEventListener('click', function (e) {
  var firstName = document.getElementById('firstName').value;
  var lastName = document.getElementById('lastName').value;
  var email = document.getElementById('email').value;
  var userName = document.getElementById('userName').value;
  var password = document.getElementById('password').value;
  var bio = document.getElementById('bio').value;
  auth.createUserWithEmailAndPassword(email, password).then(function (user) {
    console.log(firebase.auth().currentUser.uid);
    var uid = firebase.auth().currentUser.uid;
    var newUser = firestore.collection('users').doc(uid);
    newUser.set({
      betsLost: 0,
      betsWon: 0,
      bio: bio,
      drinksGiven: {
        beers: 0,
        shots: 0
      },
      drinksOutstanding: {
        beers: 0,
        shots: 0
      },
      drinksReceived: {
        beers: 0,
        shots: 0
      },
      email: email,
      firstName: firstName,
      lastName: lastName,
      numBets: 0,
      numFriends: 0,
      profilePic: "",
      recentFriends: [],
      uid: uid,
      userName: userName
    });
  }).then(function (user) {
    auth.onAuthStateChanged(function (user) {
      console.log(user);

      if (user != null) {
        auth.currentUser.getIdToken(true).then(function (idToken) {
          var xhr = new XMLHttpRequest();
          xhr.open('POST', '/hub/signin', true);
          xhr.setRequestHeader('authToken', idToken);
          xhr.send();

          xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
              window.location = "/hub/dashboard";
            }
          };
        })["catch"](function (error) {
          console.log(error);
        });
      } else {
        console.log('Not logged in.');
      }
    });
  })["catch"](function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorMessage);
  });
});