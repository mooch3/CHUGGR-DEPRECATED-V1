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
