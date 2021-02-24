  const firestore = firebase.firestore();
  const btnSignin = document.getElementById('SignIn');
  const inputEmail = document.getElementById('inputEmail');
  const inputPassword = document.getElementById('inputPassword');
  const loader = document.getElementById('loadWrapper');
  
  inputPassword.addEventListener('keypress', (e)=> {
    if (e.keyCode === 13){
      e.preventDefault();
      btnSignin.click();
    }
  });

  btnSignin.addEventListener('click', (e) => {
    const email = inputEmail.value;
    const pass = inputPassword.value;
    loader.style.display = "flex";

    firebase.auth().signInWithEmailAndPassword(email, pass).catch(error => {
    loader.style.display = "none";
     alert(error.message);
  });
  });

  firebase.auth().onAuthStateChanged(user => {
    
    if (user != null) {
      console.log(user);
      loader.style.display = "flex";
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
        loader.style.display = "none";
        alert(error.message);
      });
    } else {
      console.log('Not logged in.')
    }
  });
