  let firestore = firebase.firestore();

  const currentUser = document.getElementById('currentUser').value;
  const pendingBets = firestore.collection('bets').where('allUsers', 'array-contains', currentUser);
  const orderedBets = pendingBets.orderBy('dateOpened', 'desc');

  function showPendingBets() {
    let betCounter = 0;
    orderedBets.onSnapshot((snapshot) => {


      snapshot.forEach((bet) => {

        const invitedUsers = bet.data().invitedUsers;
        console.log(invitedUsers)
        if (invitedUsers.hasOwnProperty(currentUser)) {
          betCounter++;
        };

      });
      console.log(betCounter)
      const div = document.getElementById('pendingBets');

      if (betCounter == 1) {
        div.style.display = 'block';
        const anchor = document.createElement('A');
        const textNode = document.createTextNode('You have 1 pending bet.');

        anchor.setAttribute('href', 'pendingbets');
        anchor.innerHTML = "&nbsp;" + "&nbsp;" + " View bet >"

        div.appendChild(textNode);
        div.appendChild(anchor);

      } else if (betCounter > 1) {
        div.style.display = 'block';
        const anchor = document.createElement('A');
        const textNode = document.createTextNode('You have ' + betCounter + ' pending bets.');

        anchor.setAttribute('href', 'pendingbets');
        anchor.innerHTML = "&nbsp;" + "&nbsp;" + " View bets >"

        div.appendChild(textNode);
        div.appendChild(anchor);
      };

    });
  };

  showPendingBets();
