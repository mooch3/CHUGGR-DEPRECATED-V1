// Check to see isFinished boolean and render a "Closed" or "Pending" to view
function isDone() {
  const betCardDeck = document.getElementsByClassName('bet-card');
  Array.from(betCardDeck).forEach((betCard) => {
    const isFinished = betCard.rows[2].cells[1];
    if(isFinished.innerHTML == "false"){
      isFinished.innerHTML = "Pending";
      isFinished.style.color = "green";

    } else if (isFinished.innerHTML == "true") {
      isFinished.innerHTML = "Closed";
      isFinished.style.color = "red"
    }

  })


};

// Manipulate data from db to be user friendly. Replace "undefined" catergories with under and over or for against
cleanBet = function() {
  const betCardDeck = document.getElementsByClassName('bet-card');

  Array.from(betCardDeck).forEach((betCard) => {

    // iterate through each card forEach bet card...
    if (betCard.rows[0].cells[1].innerHTML == "moneyline") {
      betCard.rows[0].cells[1].innerHTML = "Money Line";

    } else if (betCard.rows[0].cells[1].innerHTML == "spread") {
      betCard.rows[0].cells[1].innerHTML = "Spread";
      betCard.rows[1].cells[0].innerHTML = betCard.rows[1].cells[0].innerHTML.replace("undefined: ", "Over: ");
      betCard.rows[2].cells[0].innerHTML = betCard.rows[2].cells[0].innerHTML.replace("undefined: ", "Under: ");


    } else if (betCard.rows[0].cells[1].innerHTML == "event") {
      betCard.rows[0].cells[1].innerHTML = "Event";
      betCard.rows[1].cells[0].innerHTML = betCard.rows[1].cells[0].innerHTML.replace("undefined: ", "For: ");
      betCard.rows[2].cells[0].innerHTML = betCard.rows[2].cells[0].innerHTML.replace("undefined: ", "Against: ");

    }

  });

};
isDone();
cleanBet();
