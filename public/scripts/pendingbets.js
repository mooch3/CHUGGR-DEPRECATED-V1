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

  const currentUser = document.getElementById('currentUser').value;
  const pendingBets = firestore.collection('bets').where('allUsers', 'array-contains', currentUser);
  const orderedBets = pendingBets.orderBy('dateOpened', 'desc');

function findBets() {
  orderedBets.onSnapshot(snapshot => {

    snapshot.forEach(bet => {

      const invitedUsers = bet.data().invitedUsers;


      if (invitedUsers.hasOwnProperty(currentUser)){

        let betcard = document.createElement('table');
        document.getElementById('container').appendChild(betcard);

        betcard.classList.add('bet-card');

        let row1 = betcard.insertRow(0);
        let row2 = betcard.insertRow(1);
        let row3 = betcard.insertRow(2);

        let cell1 = row1.insertCell(0);
        let cell2 = row1.insertCell(1);
        let cell3 = row1.insertCell(2);

        let cell21 = row2.insertCell(0);
        let cell22 = row2.insertCell(1);
        let cell23 = row2.insertCell(2);

        let cell31 = row3.insertCell(0);
        let cell32 = row3.insertCell(1);
        let cell33 = row3.insertCell(2);

        cell1.innerHTML = bet.data().title;
        cell1.style.borderRadius = "15px 0 0 0"

        cell2.innerHTML = bet.data().type;
        cell3.innerHTML = bet.data().stake.beers + '🍺' + ' ' + bet.data().stake.shots + '🥃';
        cell3.style.borderRadius = "0 15px 0 0"

        cell21.innerHTML = bet.data().team1;
        cell23.innerHTML = bet.data().team2;

        const anchor1 = document.createElement('A');
        // TODO: add function to this anchor
        // anchor1.setAttribute();
        anchor1.innerHTML = "Click Here to Accept";
        anchor1.style.color = "Green";

        const anchor2 = document.createElement('A');
        // TODO: add reject function to this anchor
        // anchor2.setAttribute();
        anchor2.innerHTML = "Click Here to Reject";
        anchor2.style.color = "Red"

        cell31.style.borderRadius = "0 0 0 15px"
        cell31.appendChild(anchor1);

        cell33.style.borderRadius = "0 0 15px 0"
        cell33.appendChild(anchor2);


      };

    });
    const betCardDeck = document.getElementsByClassName('bet-card');
    fixData(betCardDeck);
  });
};

function fixData(betCardDeck){


    Array.from(betCardDeck).forEach((betCard) => {

      // iterate through each card forEach bet card...
      if (betCard.rows[0].cells[1].innerHTML == "moneyline") {
        betCard.rows[0].cells[1].innerHTML = "Money Line";

      } else if (betCard.rows[0].cells[1].innerHTML == "spread") {
        betCard.rows[0].cells[1].innerHTML = "Spread";
        betCard.rows[1].cells[0].innerHTML = betCard.rows[1].cells[0].innerHTML.replace("undefined", "Over");
        betCard.rows[1].cells[2].innerHTML = betCard.rows[1].cells[2].innerHTML.replace("undefined", "Under");

      } else if (betCard.rows[0].cells[1].innerHTML == "event") {
        betCard.rows[0].cells[1].innerHTML = "Event";
        betCard.rows[1].cells[0].innerHTML = betCard.rows[1].cells[0].innerHTML.replace("undefined", "For");
        betCard.rows[1].cells[2].innerHTML = betCard.rows[1].cells[2].innerHTML.replace("undefined", "Against");

      }

    });


}

findBets();
