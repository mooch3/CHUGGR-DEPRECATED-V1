"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var fieldValue = firebase.firestore.FieldValue;
var betID = document.getElementById('betID').value;
var currentUser = document.getElementById('currentUser').value;
var closeBetButton = document.getElementById('closeBetButton');
var oustandingBetButton = document.getElementById('outstandingBetButton');
var uninvitedUser = firestore.collection('users').doc(currentUser);
var joinBet = document.getElementById('joinBet');
var betRef = firestore.collection('bets').doc(betID);

if (joinBet != null) {
  uninvitedUser.get().then(function (doc) {
    var joinBetButton = document.getElementById('joinBetButton');
    console.log(doc.data().userName);
    joinBetButton.addEventListener('click', function (e) {
      var joinSideOne = document.getElementById('joinSideOne');
      var joinSideTwo = document.getElementById('joinSideTwo');

      if (joinSideOne.checked === true) {
        betRef.set({
          side1Users: _defineProperty({}, currentUser, doc.data().userName)
        }, {
          merge: true
        });
        incrementBetTotal();
        moveToAcceptedUsers(betRef);
        addToAllUsers(betRef);
        console.log('You joined side 1');
        setTimeout(function () {
          location.reload();
        }, 800);
      } else if (joinSideTwo.checked === true) {
        betRef.set({
          side2Users: _defineProperty({}, currentUser, doc.data().userName)
        }, {
          merge: true
        });
        incrementBetTotal();
        moveToAcceptedUsers(betRef);
        addToAllUsers(betRef);
        console.log('You joined side 2');
        setTimeout(function () {
          location.reload();
        }, 800);
      }
    });
  });
}

;
betRef.get().then(function (doc) {
  console.log(Object.keys(doc.data().side1Users).length);

  if (closeBetButton != null) {
    console.log(doc.data());
    closeBetButton.addEventListener('click', function (e) {
      var side1 = document.getElementById('side1UsersSelect');
      var side2 = document.getElementById('side2UsersSelect');
      closeBet(doc, side1, side2);
    });
  } else if (oustandingBetButton != null) {
    outstandingBetButton.addEventListener('click', function (e) {
      var outstanding = document.getElementById('outstandingBtnSelect');
      moveOutOfOutstanding();
      decrementOutstanding(doc);
      console.log('User moved out of oustanding.');
    });
  }

  ;
});

function closeBet(doc, side1, side2) {
  var beers = doc.data().stake.beers;
  var shots = doc.data().stake.shots;

  if (side1.checked == true) {
    side1Winners();
    var winnersCircle = doc.data().side1Users;
    var losersCircle = doc.data().side2Users;

    if (Object.keys(doc.data().side2Users).length > 0) {
      for (var winner in winnersCircle) {
        incrementWinners(winner, beers, shots);
      }

      ;
    }

    ;

    for (var loser in losersCircle) {
      incrementLosers(loser, beers, shots);
      moveToOutStanding(loser);
    }
  } else if (side2.checked == true) {
    side2Winners();
    var _winnersCircle = doc.data().side2Users;
    var _losersCircle = doc.data().side1Users;

    if (Object.keys(doc.data().side1Users).length > 0) {
      for (var _winner in _winnersCircle) {
        incrementWinners(_winner, beers, shots);
      }

      ;
    }

    ;

    for (var _loser in _losersCircle) {
      incrementLosers(_loser, beers, shots);
      moveToOutStanding(_loser);
    }

    ;
  }

  removeInvitedUsers();
  finished();
  setTimeout(function () {
    location.reload();
  }, 800);
  console.log('bet closed successfully');
}

;

function incrementWinners(winner, beers, shots) {
  firestore.collection('users').doc(winner).update({
    "drinksGiven.beers": fieldValue.increment(beers),
    "drinksGiven.shots": fieldValue.increment(shots),
    betsWon: fieldValue.increment(1)
  });
}

;

function incrementLosers(loser, beers, shots) {
  firestore.collection('users').doc(loser).update({
    betsLost: fieldValue.increment(1),
    "drinksReceived.beers": fieldValue.increment(beers),
    "drinksReceived.shots": fieldValue.increment(shots),
    "drinksOutstanding.beers": fieldValue.increment(beers),
    "drinksOutstanding.shots": fieldValue.increment(shots)
  });
}

;

function moveToOutStanding(loser) {
  betRef.set({
    outstandingUsers: fieldValue.arrayUnion(loser)
  }, {
    merge: true
  });
}

;

function finished() {
  betRef.set({
    isFinished: true,
    dateFinished: Date.now() / 1000
  }, {
    merge: true
  });
}

;

function removeInvitedUsers() {
  betRef.set({
    invitedUsers: {}
  }, {
    merge: true
  });
}

function side1Winners() {
  betRef.set({
    winner: 'one'
  }, {
    merge: true
  });
}

function side2Winners() {
  betRef.set({
    winner: 'two'
  }, {
    merge: true
  });
}

function moveOutOfOutstanding() {
  betRef.set({
    outstandingUsers: fieldValue.arrayRemove(currentUser)
  }, {
    merge: true
  });
  setTimeout(function () {
    location.reload();
  }, 700);
}

function decrementOutstanding(doc) {
  var beers = doc.data().stake.beers;
  var shots = doc.data().stake.shots;
  var userRef = firestore.collection('users').doc(currentUser);
  userRef.update({
    "drinksOutstanding.beers": fieldValue.increment(beers * -1),
    "drinksOutstanding.shots": fieldValue.increment(shots * -1)
  }, {
    merge: true
  });
}

;

function incrementBetTotal() {
  uninvitedUser.update({
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

function addToAllUsers(betRef) {
  betRef.update({
    allUsers: fieldValue.arrayUnion(currentUser)
  });
}

;