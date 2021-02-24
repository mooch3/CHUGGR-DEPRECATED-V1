const firestore = firebase.firestore();
const fieldValue = firebase.firestore.FieldValue;


const currentUser = document.getElementById('currentUser').value;
const pendingBets = firestore.collection('bets').where('allUsers', 'array-contains', currentUser);
const orderedBets = pendingBets.orderBy('dateOpened', 'desc');
const currentRef = firestore.collection('users').doc(currentUser);

function betButtonFunc(betForms) {

  Array.from(betForms).forEach(form => {
    let betID = form.betID.value
    let firstName = form.firstName.value

    let sideOne = document.getElementById('sideOne' + betID);
    let sideTwo = document.getElementById('sideTwo' + betID);

    let btn1 = document.getElementById('btn1' + betID);
    let btn2 = document.getElementById('btn2' + betID);

    let betRef = firestore.collection('bets').doc(betID);
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
          }, 1000);

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
          }, 1000);
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
        }, 1000);
      });

  });
};
function removeFromInvited(betRef){
  betRef.set({
    invitedUsers: {
      [currentUser]: fieldValue.delete(),
    }
  }, {merge:true})
};

function removeBet(betRef) {
  betRef.set({
    allUsers: fieldValue.arrayRemove(currentUser),

  }, {merge:true})
};

function incrementBetTotal() {
  currentRef.update({numBets: fieldValue.increment(1)})
};

function moveToAcceptedUsers(betRef){
  betRef.update({
    acceptedUsers: fieldValue.arrayUnion(currentUser)
  })
};

const betForms = document.getElementsByClassName('betForm');
betButtonFunc(betForms);
console.log(betForms);

const betCardDeck = document.getElementsByClassName('bet-card');

