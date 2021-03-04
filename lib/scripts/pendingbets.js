"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var firestore = firebase.firestore();
var fieldValue = firebase.firestore.FieldValue;
var currentUser = document.getElementById('currentUser').value;
var pendingBets = firestore.collection('bets').where('allUsers', 'array-contains', currentUser);
var orderedBets = pendingBets.orderBy('dateOpened', 'desc');
var currentRef = firestore.collection('users').doc(currentUser);

function fixData(betCardDeck) {
  Array.from(betCardDeck).forEach(function (betCard) {
    // iterate through each card forEach bet card...
    if (betCard.rows[0].cells[1].innerHTML == "moneyline") {
      betCard.rows[0].cells[1].innerHTML = "Money Line";
    } else if (betCard.rows[0].cells[1].innerHTML == "spread") {
      betCard.rows[0].cells[1].innerHTML = "Spread";
      var overNode = document.createTextNode("Over");
      var underNode = document.createTextNode("Under");
      betCard.rows[1].cells[0].appendChild(overNode);
      betCard.rows[1].cells[2].appendChild(underNode);
    } else if (betCard.rows[0].cells[1].innerHTML == "event") {
      betCard.rows[0].cells[1].innerHTML = "Event";
      var forNode = document.createTextNode("For");
      var againstNode = document.createTextNode("Against");
      betCard.rows[1].cells[0].appendChild(forNode);
      betCard.rows[1].cells[2].appendChild(againstNode);
    }
  });
}

;

function betButtonFunc(betForms) {
  Array.from(betForms).forEach(function (form) {
    var betID = form.betID.value;
    var firstName = form.firstName.value;
    var sideOne = document.getElementById('sideOne' + betID);
    var sideTwo = document.getElementById('sideTwo' + betID);
    var btn1 = document.getElementById('btn1' + betID);
    var btn2 = document.getElementById('btn2' + betID);
    var betRef = firestore.collection('bets').doc(betID);
    console.log(sideOne.checked);
    btn1.addEventListener('click', function (e) {
      console.log(sideOne.checked);

      if (sideOne.checked == true) {
        betRef.set({
          side1Users: _defineProperty({}, currentUser, firstName)
        }, {
          merge: true
        });
        removeFromInvited(betRef);
        incrementBetTotal();
        moveToAcceptedUsers(betRef);
        console.log('You joined side 1');
        setTimeout(function () {
          location.reload();
        }, 1000);
      } else if (sideTwo.checked == true) {
        betRef.set({
          side2Users: _defineProperty({}, currentUser, firstName)
        }, {
          merge: true
        });
        removeFromInvited(betRef);
        incrementBetTotal();
        moveToAcceptedUsers(betRef);
        console.log("You joined side 2!");
        setTimeout(function () {
          location.reload();
        }, 1000);
      } else {
        console.log("no check received");
      }

      ;
    });
    btn2.addEventListener('click', function (e) {
      removeFromInvited(betRef);
      removeBet(betRef);
      console.log('You rejected the bet');
      setTimeout(function () {
        location.reload();
      }, 1000);
    });
  });
}

;

function removeFromInvited(betRef) {
  betRef.set({
    invitedUsers: _defineProperty({}, currentUser, fieldValue["delete"]())
  }, {
    merge: true
  });
}

;

function removeBet(betRef) {
  betRef.set({
    allUsers: fieldValue.arrayRemove(currentUser)
  }, {
    merge: true
  });
}

;

function incrementBetTotal() {
  currentRef.update({
    numBets: fieldValue.increment(1)
  });
}

;

function moveToAcceptedUsers(betRef) {
  betRef.update({
    acceptedUsers: fieldValue.arrayUnion(currentUser)
  });
}

;
var betForms = document.getElementsByClassName('betForm');
betButtonFunc(betForms);
console.log(betForms);
var betCardDeck = document.getElementsByClassName('bet-card');
fixData(betCardDeck);
console.log(betCardDeck);