firebase.initializeApp(firebaseConfig);

  const firestore = firebase.firestore();
  const auth = firebase.auth();
  const btnSignin = document.getElementById('SignIn');
  const inputEmail = document.getElementById('inputEmail');
  const inputPassword = document.getElementById('inputPassword');

  btnSignin.addEventListener('click', (e) => {
    const email = inputEmail.value;
    const pass = inputPassword.value;

    auth.signInWithEmailAndPassword(email, pass).catch(err => console.log(err));

  });

  firebase.auth().onAuthStateChanged(user => {
    console.log(user)
    if (user!=null){
      auth.currentUser.getIdToken(true).then((idToken) => {
        let xhr = new XMLHttpRequest();

        xhr.open('POST', '/SignIn', true);
        xhr.setRequestHeader('authToken', idToken);
        xhr.send()
        xhr.onreadystatechange = function() {
          // listen for state changes
          if (xhr.readyState == 4 && xhr.status == 200) {
            // when completed we can move to the dashboard
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
