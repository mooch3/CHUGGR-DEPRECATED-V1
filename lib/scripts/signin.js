"use strict";

var firestore = firebase.firestore();
var btnSignin = document.getElementById('SignIn');
var inputEmail = document.getElementById('inputEmail');
var inputPassword = document.getElementById('inputPassword');
btnSignin.addEventListener('click', function (e) {
  var email = inputEmail.value;
  var pass = inputPassword.value;
  firebase.auth().signInWithEmailAndPassword(email, pass)["catch"](function (err) {
    return console.log(err);
  });
});
firebase.auth().onAuthStateChanged(function (user) {
  if (user != null) {
    console.log(user);
    firebase.auth().currentUser.getIdToken(true).then(function (idToken) {
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
      alert(error.message);
    });
  } else {
    console.log('Not logged in.');
  }
});