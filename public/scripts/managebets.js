const firestore = firebase.firestore();

// reference to each bet form: Money Line, Spread, Event
const formMoneyLine = document.getElementById('money-line-form')
const formSpread = document.getElementById('spread-form');
const formEvent = document.getElementById('sport-event-form')
// reference current user
const currentUser = document.getElementById('currentUser').value;
const currentRef = firestore.collection('testUsers').doc(currentUser);
const fieldValue = firebase.firestore.FieldValue;

// TODO add friends to bet

function addFriendsToBet(selectedFriends) {

  const friendChecks = document.getElementsByClassName('friend-select');

  Array.from(friendChecks).forEach(friend => {
    if (friend.checked == true){
      const friendInfo = friend.value.split(' ');
      selectedFriends[friendInfo[0]] = friendInfo[1];
    };
  });

};

function allBetUsers(allUsersArr) {

  const allFriends = document.getElementsByClassName('friend-select');

  Array.from(allFriends).forEach(friend => {
    if (friend.checked == true){
      const friendInfo = friend.value.split(' ');
      const friendUid = friendInfo[0];
      allUsersArr.push(friendUid);
    }
  });

};

// create a moneyline bet
formMoneyLine.addEventListener('submit', (e) => {
  e.preventDefault();

  const currentUser = document.getElementById('side1').value;
  const betRef = firestore.collection('testBets').doc();
  const side1 = document.getElementById('side1');
  const side2 = document.getElementById('side2');
  const selectedFriends = {};
  const allUsersArr = [currentUser]

  allBetUsers(allUsersArr);
  addFriendsToBet(selectedFriends);


  firestore.collection('testUsers').doc(currentUser).get().then(function(doc) {
    console.log(doc.data().firstName);
    // Wait for promise from firestore to load documents and use that data to get user first name
    if (side1.checked) {
      // create bet object
      const bet = {
        dateOpened: Date.now(),
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
        side1Users: {
          [currentUser]: doc.data().userName,
        },
        side2Users: {},
        type: "moneyline",
        isFinished: false,
        betID: betRef.id,
      };
      betRef.set(bet).then(() => {
        formMoneyLine.reset();
        formMoneyLine.style.display = "none";
        document.getElementById('successfulBet').style.display = "block";
        incrementBetTotal();
      });

    } else if (side2.checked) {
      const bet = {
        dateOpened: Date.now(),
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
        side2Users: {
          [currentUser]: doc.data().userName,
        },
        type: "moneyline",
        isFinished: false,
        betID: betRef.id,
      };
      betRef.set(bet).then(() => {
        formMoneyLine.reset();
        formMoneyLine.style.display = "none";
        document.getElementById('successfulBet').style.display = "block";
        incrementBetTotal();
      });
    };
  });




});

// create a "spread" bet
formSpread.addEventListener('submit', (e) => {
  e.preventDefault();

  const currentUser = document.getElementById('under').value;
  const betRef = firestore.collection('testBets').doc();
  const over = document.getElementById('over');
  const under = document.getElementById('under');
  const selectedFriends = {};
  const allUsersArr = [currentUser];

  allBetUsers(allUsersArr);
  addFriendsToBet(selectedFriends);

  // Wait for promise from firestore to load documents and use that data to get user first name
  firestore.collection('testUsers').doc(currentUser).get().then(function(doc) {
    if (over.checked) {
      // create bet object
      const bet = {
        betID: betRef.id,
        dateOpened: Date.now(),
        dueDate: new Date(formSpread.dueDate.value).getTime() / 1000,
        acceptedUsers: [currentUser],
        allUsers: allUsersArr,
        invitedUsers: selectedFriends,
        side1Users: {
          [currentUser]: doc.data().userName,
        },
        side2Users: {},
        title: formSpread.title.value,
        outstandingUsers: [],
        line: parseFloat(formSpread.line.value),
        stake: {
          beers: parseInt(formSpread.beers.value),
          shots: parseInt(formSpread.shots.value),
        },
        type: "spread",
        isFinished: false,
      };

      betRef.set(bet).then(() => {
        formSpread.reset();
        formSpread.style.display = "none";
        document.getElementById('successfulBet').style.display = "block";
        incrementBetTotal();
      });

    } else if (under.checked) {
      // create bet object with opposing side selected
      // TODO: consolidate bet object...?
      const bet = {
        betID: betRef.id,
        dateOpened: Date.now(),
        dueDate: new Date(formSpread.dueDate.value).getTime() / 1000,
        acceptedUsers: [currentUser],
        allUsers: allUsersArr,
        invitedUsers: selectedFriends,
        side1Users: {},
        side2Users: {
          [currentUser]: doc.data().userName,
        },
        title: formSpread.title.value,
        outstandingUsers: [],
        line: parseFloat(formSpread.line.value),
        stake: {
          beers: parseInt(formSpread.beers.value),
          shots: parseInt(formSpread.shots.value),
        },
        type: "spread",
        isFinished: false,
      };
      betRef.set(bet).then(() => {
        formSpread.reset();
        formSpread.style.display = "none";
        document.getElementById('successfulBet').style.display = "block";
        incrementBetTotal();
      });
    };

  });


});

// Make an event bet to DB
formEvent.addEventListener('submit', (e) => {
  e.preventDefault();

  const currentUser = document.getElementById('eventSide1').value;
  const betRef = firestore.collection('testBets').doc();
  const eventSide1 = document.getElementById('eventSide1');
  const eventSide2 = document.getElementById('eventSide2');
  const selectedFriends = {};
  const allUsersArr = [currentUser]

  allBetUsers(allUsersArr);
  addFriendsToBet(selectedFriends);
  // Wait for promise from firestore to load documents and use that data to get user first name
  firestore.collection('testUsers').doc(currentUser).get().then(function(doc) {
    if (eventSide1.checked) {
      // create bet object
      const bet = {
        betID: betRef.id,
        title: formEvent.title.value,
        dateOpened: Date.now(),
        dueDate: new Date(formEvent.dueDate.value).getTime() / 1000,
        acceptedUsers: [currentUser],
        allUsers: allUsersArr,
        invitedUsers: selectedFriends,
        side1Users: {
          [currentUser]: doc.data().userName
        },
        side2Users: {},
        stake: {
          beers: parseInt(formEvent.beers.value),
          shots: parseInt(formEvent.shots.value),
        },
        type: "event",
        isFinished: false,
        outstandingUsers: [],
      }
      betRef.set(bet).then(() => {
        formEvent.reset();
        formEvent.style.display = "none"
        document.getElementById('successfulBet').style.display = "block"
        incrementBetTotal();
      });

    } else if (eventSide2.checked) {
      const bet = {
        betID: betRef.id,
        title: formEvent.title.value,
        dateOpened: Date.now(),
        dueDate: new Date(formEvent.dueDate.value).getTime() / 1000,
        acceptedUsers: [currentUser],
        allUsers: allUsersArr,
        invitedUsers: selectedFriends,
        side1Users: {},
        side2Users: {
          [currentUser]: doc.data().userName,
        },
        stake: {
          beers: parseInt(formEvent.beers.value),
          shots: parseInt(formEvent.shots.value),
        },
        type: "event",
        isFinished: false,
        outstandingUsers: [],
      }
      betRef.set(bet).then(() => {
        formEvent.reset();
        formEvent.style.display = "none"
        document.getElementById('successfulBet').style.display = "block";
        incrementBetTotal();
      });
    };


  });

});


// when button is clicked, render or hide the requested bet form and reset other forms
function showMoneyline() {
  let moneyLine = document.getElementById("money-line");
  let spread = document.getElementById("spread");
  let sportEvent = document.getElementById("sport-event");

  let moneyLineForm = document.getElementById('money-line-form');
  let spreadForm = document.getElementById('spread-form');
  let sportEventForm = document.getElementById('sport-event-form');


  if (moneyLine.style.display = "none") {
    moneyLine.style.display = "block";
    sportEvent.style.display = "none";
    spread.style.display = "none";
    spreadForm.reset();
    sportEventForm.reset();
  }


};

function showSportEvent() {
  let moneyLine = document.getElementById("money-line");
  let spread = document.getElementById("spread");
  let sportEvent = document.getElementById("sport-event");

  let moneyLineForm = document.getElementById('money-line-form');
  let spreadForm = document.getElementById('spread-form');
  let sportEventForm = document.getElementById('sport-event-form');

  if (sportEvent.style.display = "none") {
    sportEvent.style.display = "block";
    moneyLine.style.display = "none";
    spread.style.display = "none";
    moneyLineForm.reset();
    sportEventForm.reset();
  }

}

function showSpread() {
  let moneyLine = document.getElementById("money-line");
  let spread = document.getElementById("spread");
  let sportEvent = document.getElementById("sport-event");

  let moneyLineForm = document.getElementById('money-line-form');
  let spreadForm = document.getElementById('spread-form');
  let sportEventForm = document.getElementById('sport-event-form');


  if (spread.style.display = "none") {
    spread.style.display = "block";
    moneyLine.style.display = "none";
    sportEvent.style.display = "none";
    sportEventForm.reset();
    moneyLineForm.reset();

  }

}

function incrementBetTotal() {
  currentRef.update({numBets: fieldValue.increment(1)})
};

firebase.auth().onAuthStateChanged(user => {
  if (user){
    console.log(user)
  } else {
    console.log('Not logged in.')
  }

});
