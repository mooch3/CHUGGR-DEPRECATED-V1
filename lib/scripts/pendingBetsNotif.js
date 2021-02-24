"use strict";

var firestore = firebase.firestore();
var currentUser = document.getElementById('currentUser').value;
var pendingBets = firestore.collection('bets').where('allUsers', 'array-contains', currentUser);
var orderedBets = pendingBets.orderBy('dateOpened', 'desc');

function showPendingBets() {
  var betCounter = 0;
  orderedBets.onSnapshot(function (snapshot) {
    snapshot.forEach(function (bet) {
      var invitedUsers = bet.data().invitedUsers;
      console.log(invitedUsers);

      if (invitedUsers.hasOwnProperty(currentUser)) {
        betCounter++;
      }

      ;
    });
    console.log(betCounter);
    var div = document.getElementById('pendingBets');

    if (betCounter == 1) {
      div.style.display = 'block';
      var anchor = document.createElement('A');
      var textNode = document.createTextNode('You have 1 pending bet.');
      anchor.setAttribute('href', 'pendingbets');
      anchor.innerHTML = "&nbsp;" + "&nbsp;" + " View bet >";
      div.appendChild(textNode);
      div.appendChild(anchor);
    } else if (betCounter > 1) {
      div.style.display = 'block';

      var _anchor = document.createElement('A');

      var _textNode = document.createTextNode('You have ' + betCounter + ' pending bets.');

      _anchor.setAttribute('href', 'pendingbets');

      _anchor.innerHTML = "&nbsp;" + "&nbsp;" + " View bets >";
      div.appendChild(_textNode);
      div.appendChild(_anchor);
    }

    ;
  });
}

;
showPendingBets();