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

const firestore = firebase.firestore();
const fieldValue = firebase.firestore.FieldValue;


const currentUser = document.getElementById('currentUser').value;
const pendingBets = firestore.collection('testBets').where('allUsers', 'array-contains', currentUser);
const orderedBets = pendingBets.orderBy('dateOpened', 'desc');
const currentRef = firestore.collection('testUsers').doc(currentUser);

function fixData(betCardDeck) {


  Array.from(betCardDeck).forEach((betCard) => {

    // iterate through each card forEach bet card...
    if (betCard.rows[0].cells[1].innerHTML == "moneyline") {
      betCard.rows[0].cells[1].innerHTML = "Money Line";

    } else if (betCard.rows[0].cells[1].innerHTML == "spread") {
      betCard.rows[0].cells[1].innerHTML = "Spread";
      let overNode = document.createTextNode("Over");
      let underNode = document.createTextNode("Under");
      betCard.rows[1].cells[0].appendChild(overNode);
      betCard.rows[1].cells[2].appendChild(underNode);

    } else if (betCard.rows[0].cells[1].innerHTML == "event") {
      betCard.rows[0].cells[1].innerHTML = "Event";
      let forNode = document.createTextNode("For");
      let againstNode = document.createTextNode("Against");
      betCard.rows[1].cells[0].appendChild(forNode);
      betCard.rows[1].cells[2].appendChild(againstNode);

    }
  });
};


function betButtonFunc(betForms) {

  Array.from(betForms).forEach(form => {
    let betID = form.betID.value
    let firstName = form.firstName.value

    let sideOne = document.getElementById('sideOne' + betID);
    let sideTwo = document.getElementById('sideTwo' + betID);

    let btn1 = document.getElementById('btn1' + betID);
    let btn2 = document.getElementById('btn2' + betID);

    let betRef = firestore.collection('testBets').doc(betID);
    console.log(sideOne.checked);

      btn1.addEventListener('click', (e) => {
        console.log(sideOne.checked);
        if (sideOne.checked == true) {
          betRef.set({
            side1Users: {
              [currentUser]: firstName,
            }
          }, {
            merge: true
          });
          removeFromInvited(betRef);
          incrementBetTotal();
          moveToAcceptedUsers(betRef);
          console.log('You joined side 1')
          setTimeout(() => {
            location.reload()
          }, 100);

        } else if (sideTwo.checked == true) {
          betRef.set({
            side2Users: {
              [currentUser]: firstName,
            },
          }, {
            merge: true
          });

          removeFromInvited(betRef);
          incrementBetTotal();
          moveToAcceptedUsers(betRef);
          console.log("You joined side 2!")
          setTimeout(() => {
            location.reload()
          }, 300);
        } else {
          console.log("no check received");
        };

      });
      btn2.addEventListener('click', (e) => {
        removeFromInvited(betRef);
        removeBet(betRef);
        console.log('You rejected the bet');
        setTimeout(() => {
          location.reload()
        }, 300);
      });

  });
};


function removeFromInvited(betRef){
  betRef.set({
    invitedUsers: {
      [currentUser]: fieldValue.delete(),
    }
  }, {merge:true})
}

function removeBet(betRef) {
  betRef.set({
    allUsers: fieldValue.arrayRemove(currentUser),

  }, {merge:true})
};

function incrementBetTotal() {
  currentRef.update({numBets: fieldValue.increment(1)})
}

function moveToAcceptedUsers(betRef){
  betRef.update({
    acceptedUsers: fieldValue.arrayUnion(currentUser)
  })
};



const betForms = document.getElementsByClassName('betForm');
betButtonFunc(betForms);
console.log(betForms);

const betCardDeck = document.getElementsByClassName('bet-card');
fixData(betCardDeck);
console.log(betCardDeck);
