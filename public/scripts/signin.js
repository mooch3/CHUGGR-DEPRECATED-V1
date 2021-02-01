  const firestore = firebase.firestore();
  const btnSignin = document.getElementById('SignIn');
  const inputEmail = document.getElementById('inputEmail');
  const inputPassword = document.getElementById('inputPassword');

  btnSignin.addEventListener('click', (e) => {
    const email = inputEmail.value;
    const pass = inputPassword.value;

    firebase.auth().signInWithEmailAndPassword(email, pass).catch(err => console.log(err));
  });

  firebase.auth().onAuthStateChanged(user => {
    if (user != null) {
      console.log(user);
      firebase.auth().currentUser.getIdToken(true).then((idToken) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/hub/signin', true);
        xhr.setRequestHeader('authToken', idToken);
        xhr.send()
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4 && xhr.status == 200) {
            window.location = "/hub/dashboard";
          }
        }
      }).catch((error) => {
        console.log(error);
      });
    } else {
      console.log('Not logged in.')
    }
  });
