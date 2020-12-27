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

  let firestore = firebase.firestore();

  const btnSignin = document.getElementById('SignIn');
  const inputEmail = document.getElementById('inputEmail');
  const inputPassword = document.getElementById('inputPassword');

  btnSignin.addEventListener('click', (e) => {
    const email = inputEmail.value;
    const pass = inputPassword.value;
    const auth = firebase.auth();

    auth.signInWithEmailAndPassword(email, pass).catch(err => console.log(err));

  });

  firebase.auth().onAuthStateChanged(user => {
    if (user){
      console.log(user)
      btnSignin.style.display = "none";
    } else {
      console.log('Not logged in.')
    }

  });
