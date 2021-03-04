"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var firestore = firebase.firestore(); // reference to each bet form: Money Line, Spread, Event

var formMoneyLine = document.getElementById('money-line-form');
var formSpread = document.getElementById('spread-form');
var formEvent = document.getElementById('sport-event-form'); // reference current user

var currentUser = document.getElementById('currentUser').value;
var currentRef = firestore.collection('users').doc(currentUser);
var fieldValue = firebase.firestore.FieldValue; // TODO add friends to bet

function addFriendsToBet(selectedFriends) {
  // Add friends to bet by Username
  var friendChecks = document.getElementsByClassName('friend-select');
  Array.from(friendChecks).forEach(function (friend) {
    if (friend.checked == true) {
      var friendInfo = friend.value.split(' ');
      selectedFriends[friendInfo[0]] = friendInfo[1];
    }

    ;
  });
}

;

function allBetUsers(allUsersArr) {
  var allFriends = document.getElementsByClassName('friend-select');
  Array.from(allFriends).forEach(function (friend) {
    if (friend.checked == true) {
      var friendInfo = friend.value.split(' ');
      var friendUid = friendInfo[0];
      allUsersArr.push(friendUid);
    }
  });
}

; // create a moneyline bet

formMoneyLine.addEventListener('submit', function (e) {
  e.preventDefault();
  var currentUser = document.getElementById('side1').value;
  var betRef = firestore.collection('bets').doc();
  var side1 = document.getElementById('side1');
  var side2 = document.getElementById('side2');
  var selectedFriends = {};
  var allUsersArr = [currentUser];
  allBetUsers(allUsersArr);
  addFriendsToBet(selectedFriends);
  firestore.collection('users').doc(currentUser).get().then(function (doc) {
    // Wait for promise from firestore to load documents and use that data to get user first name
    if (side1.checked) {
      // create bet object
      var bet = {
        dateOpened: Date.now() / 1000,
        acceptedUsers: [currentUser],
        allUsers: allUsersArr,
        invitedUsers: selectedFriends,
        team1: formMoneyLine.team1.value,
        team2: formMoneyLine.team2.value,
        title: formMoneyLine.team1.value + " vs. " + formMoneyLine.team2.value,
        outstandingUsers: [],
        dueDate: new Date(formMoneyLine.dueDate.value).getTime() / 1000,
        stake: {
          beers: parseInt(formMoneyLine.beers.value),
          shots: parseInt(formMoneyLine.shots.value)
        },
        side1Users: _defineProperty({}, currentUser, doc.data().userName),
        side2Users: {},
        type: "moneyline",
        isFinished: false,
        betID: betRef.id
      };
      betRef.set(bet).then(function () {
        formMoneyLine.reset();
        formMoneyLine.style.display = "none";
        document.getElementById('successfulBet').style.display = "block";
        incrementBetTotal();
      });
    } else if (side2.checked) {
      var _bet = {
        dateOpened: Date.now() / 1000,
        acceptedUsers: [currentUser],
        allUsers: allUsersArr,
        invitedUsers: selectedFriends,
        team1: formMoneyLine.team1.value,
        team2: formMoneyLine.team2.value,
        title: formMoneyLine.team1.value + " vs. " + formMoneyLine.team2.value,
        outstandingUsers: [],
        dueDate: new Date(formMoneyLine.dueDate.value).getTime() / 1000,
        stake: {
          beers: parseInt(formMoneyLine.beers.value),
          shots: parseInt(formMoneyLine.shots.value)
        },
        side1Users: {},
        side2Users: _defineProperty({}, currentUser, doc.data().userName),
        type: "moneyline",
        isFinished: false,
        betID: betRef.id
      };
      betRef.set(_bet).then(function () {
        formMoneyLine.reset();
        formMoneyLine.style.display = "none";
        document.getElementById('successfulBet').style.display = "block";
        incrementBetTotal();
      });
    }

    ;
  });
}); // create a "spread" bet

formSpread.addEventListener('submit', function (e) {
  e.preventDefault();
  var currentUser = document.getElementById('under').value;
  var betRef = firestore.collection('bets').doc();
  var over = document.getElementById('over');
  var under = document.getElementById('under');
  var selectedFriends = {};
  var allUsersArr = [currentUser];
  allBetUsers(allUsersArr);
  addFriendsToBet(selectedFriends); // Wait for promise from firestore to load documents and use that data to get user first name

  firestore.collection('users').doc(currentUser).get().then(function (doc) {
    if (over.checked) {
      // create bet object
      var bet = {
        betID: betRef.id,
        dateOpened: Date.now() / 1000,
        dueDate: new Date(formSpread.dueDate.value).getTime() / 1000,
        acceptedUsers: [currentUser],
        allUsers: allUsersArr,
        invitedUsers: selectedFriends,
        side1Users: _defineProperty({}, currentUser, doc.data().userName),
        side2Users: {},
        title: formSpread.title.value,
        outstandingUsers: [],
        line: parseFloat(formSpread.line.value),
        stake: {
          beers: parseInt(formSpread.beers.value),
          shots: parseInt(formSpread.shots.value)
        },
        type: "spread",
        isFinished: false
      };
      betRef.set(bet).then(function () {
        formSpread.reset();
        formSpread.style.display = "none";
        document.getElementById('successfulBet').style.display = "block";
        incrementBetTotal();
      });
    } else if (under.checked) {
      // create bet object with opposing side selected
      // TODO: consolidate bet object...?
      var _bet2 = {
        betID: betRef.id,
        dateOpened: Date.now() / 1000,
        dueDate: new Date(formSpread.dueDate.value).getTime() / 1000,
        acceptedUsers: [currentUser],
        allUsers: allUsersArr,
        invitedUsers: selectedFriends,
        side1Users: {},
        side2Users: _defineProperty({}, currentUser, doc.data().userName),
        title: formSpread.title.value,
        outstandingUsers: [],
        line: parseFloat(formSpread.line.value),
        stake: {
          beers: parseInt(formSpread.beers.value),
          shots: parseInt(formSpread.shots.value)
        },
        type: "spread",
        isFinished: false
      };
      betRef.set(_bet2).then(function () {
        formSpread.reset();
        formSpread.style.display = "none";
        document.getElementById('successfulBet').style.display = "block";
        incrementBetTotal();
      });
    }

    ;
  });
}); // Make an event bet to DB

formEvent.addEventListener('submit', function (e) {
  e.preventDefault();
  var currentUser = document.getElementById('eventSide1').value;
  var betRef = firestore.collection('bets').doc();
  var eventSide1 = document.getElementById('eventSide1');
  var eventSide2 = document.getElementById('eventSide2');
  var selectedFriends = {};
  var allUsersArr = [currentUser];
  allBetUsers(allUsersArr);
  addFriendsToBet(selectedFriends); // Wait for promise from firestore to load documents and use that data to get user first name

  firestore.collection('users').doc(currentUser).get().then(function (doc) {
    if (eventSide1.checked) {
      // create bet object
      var bet = {
        betID: betRef.id,
        title: formEvent.title.value,
        dateOpened: Date.now() / 1000,
        dueDate: new Date(formEvent.dueDate.value).getTime() / 1000,
        acceptedUsers: [currentUser],
        allUsers: allUsersArr,
        invitedUsers: selectedFriends,
        side1Users: _defineProperty({}, currentUser, doc.data().userName),
        side2Users: {},
        stake: {
          beers: parseInt(formEvent.beers.value),
          shots: parseInt(formEvent.shots.value)
        },
        type: "event",
        isFinished: false,
        outstandingUsers: []
      };
      betRef.set(bet).then(function () {
        formEvent.reset();
        formEvent.style.display = "none";
        document.getElementById('successfulBet').style.display = "block";
        incrementBetTotal();
      });
    } else if (eventSide2.checked) {
      var _bet3 = {
        betID: betRef.id,
        title: formEvent.title.value,
        dateOpened: Date.now() / 1000,
        dueDate: new Date(formEvent.dueDate.value).getTime() / 1000,
        acceptedUsers: [currentUser],
        allUsers: allUsersArr,
        invitedUsers: selectedFriends,
        side1Users: {},
        side2Users: _defineProperty({}, currentUser, doc.data().userName),
        stake: {
          beers: parseInt(formEvent.beers.value),
          shots: parseInt(formEvent.shots.value)
        },
        type: "event",
        isFinished: false,
        outstandingUsers: []
      };
      betRef.set(_bet3).then(function () {
        formEvent.reset();
        formEvent.style.display = "none";
        document.getElementById('successfulBet').style.display = "block";
        incrementBetTotal();
      });
    }

    ;
  });
}); // when button is clicked, render or hide the requested bet form and reset other forms

function showMoneyline() {
  var moneyLine = document.getElementById("money-line");
  var spread = document.getElementById("spread");
  var sportEvent = document.getElementById("sport-event");
  var moneyLineForm = document.getElementById('money-line-form');
  var spreadForm = document.getElementById('spread-form');
  var sportEventForm = document.getElementById('sport-event-form');

  if (moneyLine.style.display = "none") {
    moneyLine.style.display = "block";
    sportEvent.style.display = "none";
    spread.style.display = "none";
    spreadForm.reset();
    sportEventForm.reset();
  }
}

;

function showSportEvent() {
  var moneyLine = document.getElementById("money-line");
  var spread = document.getElementById("spread");
  var sportEvent = document.getElementById("sport-event");
  var moneyLineForm = document.getElementById('money-line-form');
  var spreadForm = document.getElementById('spread-form');
  var sportEventForm = document.getElementById('sport-event-form');

  if (sportEvent.style.display = "none") {
    sportEvent.style.display = "block";
    moneyLine.style.display = "none";
    spread.style.display = "none";
    moneyLineForm.reset();
    sportEventForm.reset();
  }
}

function showSpread() {
  var moneyLine = document.getElementById("money-line");
  var spread = document.getElementById("spread");
  var sportEvent = document.getElementById("sport-event");
  var moneyLineForm = document.getElementById('money-line-form');
  var spreadForm = document.getElementById('spread-form');
  var sportEventForm = document.getElementById('sport-event-form');

  if (spread.style.display = "none") {
    spread.style.display = "block";
    moneyLine.style.display = "none";
    sportEvent.style.display = "none";
    sportEventForm.reset();
    moneyLineForm.reset();
  }
}

function incrementBetTotal() {
  currentRef.update({
    numBets: fieldValue.increment(1)
  });
}

;