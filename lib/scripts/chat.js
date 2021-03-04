"use strict";

var firestore = firebase.firestore();
var renderChatBox = document.getElementById('renderChatBox'); // retrieve latest messages from firestore and order by time stamp

if (renderChatBox != null) {
  var sendMessage = function sendMessage(message) {
    // TODO: do I want to send messages from client side or back end?
    chatRef.collection('actualMessages').doc().set(message).then(function () {
      console.log('message sent!');
    });
  };

  var createChat = function createChat(chatRef) {
    chatRef.set({
      betID: betID
    });
  };

  // load messages when the page is called, then only listen for changes (not all documents)
  var currentUser = document.getElementById('currentUser').value;
  var userRef = firestore.collection('users').doc(currentUser);
  var betID = document.getElementById('betID').value;
  var chatRef = firestore.collection('chatRooms').doc(betID);
  var send = document.getElementById('sendMessage');
  var inputRef = document.getElementById('chatValue');
  inputRef.addEventListener('keypress', function (e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      send.click();
      var chatbox = document.getElementById('chat-message-container');
      chatbox.scrollTop = chatbox.scrollHeight - chatbox.clientHeight;
    }
  });
  send.addEventListener('click', function (e) {
    var input = document.getElementById('chatValue').value;
    userRef.get().then(function (doc) {
      var message = {
        body: input,
        timestamp: Date.now() / 1000,
        userName: doc.data().userName,
        uid: doc.data().uid
      };
      sendMessage(message);
    });
    document.getElementById('chatValue').value = '';
  });
  ;
  ;

  getRealtimeChat = function getRealtimeChat() {
    var orderChat = firestore.collection('chatRooms').doc(betID).collection('actualMessages').orderBy('timestamp');
    orderChat.onSnapshot(function (snapshot) {
      snapshot.docChanges().forEach(function (change) {
        // render messages to client side
        if (change.type == 'added') {
          console.log(change.doc.data());
          var chatMessageContainer = document.getElementById('chat-message-container');
          var firstDiv = document.createElement('Div');
          firstDiv.className = 'message-box-holder';
          var firstDiv2 = document.createElement('Div');
          firstDiv2.className = 'message-box-holder';
          var secondDiv = document.createElement('Div');
          secondDiv.className = 'message-box';
          var sender = document.createElement('Div');
          sender.className = 'message-sender';
          var node = document.createTextNode(change.doc.data().body);

          if (change.doc.data().uid == currentUser) {
            chatMessageContainer.appendChild(firstDiv);
            firstDiv.appendChild(secondDiv);
            secondDiv.appendChild(node);
          } else {
            var senderNode = document.createTextNode(change.doc.data().userName);
            chatMessageContainer.appendChild(firstDiv);
            firstDiv.appendChild(sender);
            sender.appendChild(senderNode);
            secondDiv.classList.add('message-partner');
            firstDiv.appendChild(secondDiv);
            secondDiv.appendChild(node);
          }

          ;
        }

        ;
      });
    });
  }; // set listener


  createChat(chatRef);
  getRealtimeChat();
}