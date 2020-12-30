const signOutBtn = document.getElementById('sign-out')


signOutBtn.addEventListener('click', (e) => {
  signout();
});


function signout() {
  firebase.auth().signOut().then(function() {
  // Sign-out successful.
  console.log('No user');
}).catch(function(error) {
  // An error happened.
  console.log('error' + error);
});
}
