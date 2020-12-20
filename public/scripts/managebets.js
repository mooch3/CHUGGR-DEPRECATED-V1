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


// reference to each bet form: Money Line, Spread, Event
const formMoneyLine = document.getElementById('money-line-form')
const formSpread = document.getElementById('spread-form');
const formEvent = document.getElementById('sport-event-form')



// TODO add friends to bet

// create a moneyline bet
formMoneyLine.addEventListener('submit', (e) => {
  e.preventDefault();

  const currentUser = document.getElementById('side1').value;
  const betRef = firestore.collection('bets').doc();
  const side1 = document.getElementById('side1');
  const side2 = document.getElementById('side2');

  firestore.collection('users').doc(currentUser).get().then(function(doc) {
    console.log(doc.data().firstName);
      // Wait for promise from firestore to load documents and use that data to get user first name
    if (side1.checked) {
      // create bet object
      const bet = {
        dateOpened: Date.now(),
        acceptedUsers: [currentUser],
        allUsers: [currentUser],
        invitedUsers: {},
        team1: formMoneyLine.team1.value,
        team2: formMoneyLine.team2.value,
        title: formMoneyLine.team1.value + " vs. " + formMoneyLine.team2.value,
        outstandingUsers: {},
        dueDate: new Date(formMoneyLine.dueDate.value).getTime(),
        stake: {
          beers: parseInt(formMoneyLine.beers.value),
          shots: parseInt(formMoneyLine.shots.value)
        },
        side1Users: {
          [currentUser]: doc.data().firstName,
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

      });

    } else if (side2.checked) {
      const bet = {
        dateOpened: Date.now(),
        acceptedUsers: [currentUser],
        allUsers: [currentUser],
        invitedUsers: {},
        team1: formMoneyLine.team1.value,
        team2: formMoneyLine.team2.value,
        title: formMoneyLine.team1.value + " vs. " + formMoneyLine.team2.value,
        outstandingUsers: {},
        dueDate: new Date(formMoneyLine.dueDate.value).getTime(),
        stake: {
          beers: parseInt(formMoneyLine.beers.value),
          shots: parseInt(formMoneyLine.shots.value)
        },
        side1Users: {},
        side2Users: {
          [currentUser]: doc.data().firstName,
        },
        type: "moneyline",
        isFinished: false,
        betID: betRef.id,
      };
      betRef.set(bet).then(() => {
        formMoneyLine.reset();
        formMoneyLine.style.display = "none";
        document.getElementById('successfulBet').style.display = "block";

      });
    };
  });




});

// create a "spread" bet
formSpread.addEventListener('submit', (e) => {
  e.preventDefault();

  const currentUser = document.getElementById('under').value;
  const betRef = firestore.collection('bets').doc();
  const over = document.getElementById('over');
  const under = document.getElementById('under');

  // Wait for promise from firestore to load documents and use that data to get user first name
  firestore.collection('users').doc(currentUser).get().then(function(doc) {
    if (over.checked) {
      // create bet object
      const bet = {
        betID: betRef.id,
        dateOpened: Date.now(),
        dueDate: new Date(formSpread.dueDate.value).getTime(),
        acceptedUsers: [currentUser],
        allUsers: [currentUser],
        invitedUsers: {},
        side1Users: {
          [currentUser]: doc.data().firstName
        },
        side2Users: {},
        title: formSpread.title.value,
        outstandingUsers: {},
        line: parseInt(formSpread.line.value),
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

      });

    } else if (under.checked) {
      // create bet object with opposing side selected
      // TODO: consolidate bet object...?
      const bet = {
        betID: betRef.id,
        dateOpened: Date.now(),
        dueDate: new Date(formSpread.dueDate.value).getTime(),
        acceptedUsers: [currentUser],
        allUsers: [currentUser],
        invitedUsers: {},
        side1Users: {},
        side2Users: {
          [currentUser]: doc.data().firstName
        },
        title: formSpread.title.value,
        outstandingUsers: {},
        line: parseInt(formSpread.line.value),
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

      });
    };

  });


});

// Make an event bet to DB
formEvent.addEventListener('submit', (e) => {
  e.preventDefault();

  const currentUser = document.getElementById('eventSide1').value;
  const betRef = firestore.collection('bets').doc();
  const eventSide1 = document.getElementById('eventSide1');
  const eventSide2 = document.getElementById('eventSide2');
  // Wait for promise from firestore to load documents and use that data to get user first name
  firestore.collection('users').doc(currentUser).get().then(function(doc) {
    if (eventSide1.checked) {
      // create bet object
      const bet = {
        betID: betRef.id,
        title: formEvent.title.value,
        dateOpened: Date.now(),
        dueDate: new Date(formEvent.dueDate.value).getTime(),
        acceptedUsers: [currentUser],
        allUsers: [currentUser],
        invitedUsers: {},
        side1Users: {
          [currentUser]: doc.data().firstName
        },
        side2Users: {},
        stake: {
          beers: parseInt(formEvent.beers.value),
          shots: parseInt(formEvent.shots.value),
        },
        type: "event",
        isFinished: false,
        outstandingUsers: {},
      }
      betRef.set(bet).then(() => {
        formEvent.reset();
        formEvent.style.display = "none"
        document.getElementById('successfulBet').style.display = "block"

      });

    } else if (eventSide2.checked) {
      const bet = {
        betID: betRef.id,
        title: formEvent.title.value,
        dateOpened: Date.now(),
        dueDate: new Date(formEvent.dueDate.value).getTime(),
        acceptedUsers: [currentUser],
        allUsers: [currentUser],
        invitedUsers: {},
        side1Users: {},
        side2Users: {
          [currentUser]: doc.data().firstName
        },
        stake: {
          beers: parseInt(formEvent.beers.value),
          shots: parseInt(formEvent.shots.value),
        },
        type: "event",
        isFinished: false,
        outstandingUsers: {},
      }
      betRef.set(bet).then(() => {
        formEvent.reset();
        formEvent.style.display = "none"
        document.getElementById('successfulBet').style.display = "block";

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
