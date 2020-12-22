// const currentUser = document.getElementById('currentUser').value;
// const betID = document.getElementById('betID').value;
const betRef = firestore.collection('bets').doc(betID);
const fieldValue = firebase.firestore.FieldValue;


const closeBetButton = document.getElementById('closeBetButton');



betRef.get().then((doc) => {
  console.log(doc.data());
  closeBetButton.addEventListener('click', (e) => {
  const side1 = document.getElementById('side1UsersSelect');
  const side2 = document.getElementById('side2UsersSelect');
  closeBet(doc, side1, side2);
  });
});

function closeBet(doc, side1, side2) {
  finished();

  let beers = doc.data().stake.beers;
  let shots = doc.data().stake.shots;

  if (side1.checked == true) {
    side1Winners();
    let winnersCircle = doc.data().side1Users;
    let losersCircle = doc.data().side2Users;

    for (const winner in winnersCircle) {
      incrementWinners(winner, beers, shots);
    }

    for (const loser in losersCircle) {
      incrementLosers(loser, beers, shots);
      moveToOutStanding(loser);
    }

  } else if (side2.checked == true) {
    side2Winners();
    let winnersCircle = doc.data().side2Users;
    let losersCircle = doc.data().side1Users;

    for (const winner in winnersCircle) {
      incrementWinners(winner, beers, shots);
    };
    for (const loser in losersCircle) {
      incrementLosers(loser, beers, shots);
      moveToOutStanding(loser);
    };


  }
removeInvitedUsers();
setTimeout(() => {
  location.reload();
}, 300);

console.log('bet closed successfully');
};

function incrementWinners(winner, beers, shots) {
  firestore.collection('users').doc(winner).update({
    "drinksGiven.beers": fieldValue.increment(beers),
    "drinksGivenshots": fieldValue.increment(shots),
    betsWon: fieldValue.increment(1)
  });
};

function incrementLosers(loser, beers, shots) {
  firestore.collection('users').doc(loser).update({
    betsLost: fieldValue.increment(1),
    "drinksReceived.beers": fieldValue.increment(beers),
    "drinksReceived.shots": fieldValue.increment(shots),
    "drinksOutstanding.beers": fieldValue.increment(beers),
    "drinksOutstanding.shots": fieldValue.increment(shots)
  });
};

function moveToOutStanding(loser) {
  betRef.set({
    outstandingUsers: fieldValue.arrayUnion(loser)
  }, {merge:true})
};

function finished() {
  betRef.set({
    isFinished: true,
    dateFinished: Date.now()/1000
  }, {merge:true})
};

function removeInvitedUsers(){
  betRef.set({
    invitedUsers: {}
  },{merge:true})
}

function side1Winners(){
  betRef.set({
    winner: 'one'
  },{merge:true})
}

function side2Winners(){
  betRef.set({
    winner: 'two'
  },{merge:true})
}
