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

  let firestore = firebase.firestore()

  // retrieve latest messages from firestore and order by time stamp
  const chatRef = firestore.collection('chatRooms').doc('chatTest').collection('actualMessages').orderBy('timestamp')
  // load messages when the page is called, then only listen for changes (not all documents)

  sendMessage = function() {
    // TODO: do I want to send messages from client side or back end?
  }
    // TODO: I just changed the app UI but I have not updated the javascript code for rendering
  getRealtimeChat = function() {

    chatRef.onSnapshot(snapshot => {

    snapshot.docChanges().forEach(message => {
      // render messages to client side
        if (message.type == 'added') {

          let para = document.createElement('p');
          let node = document.createTextNode(message.doc.data().sender + ": " + message.doc.data().message);
          para.appendChild(node);

          var element = document.getElementById('chat-box');
          element.appendChild(para);
        }

      });

    });

    };
    // set listener


getRealtimeChat();
