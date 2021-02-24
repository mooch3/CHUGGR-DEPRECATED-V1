"use strict";

// Manipulate data from db to be user friendly. Replace "undefined" catergories with under and over or for against
cleanBet = function cleanBet() {
  var betCardDeck = document.getElementsByClassName('bet-card');
  Array.from(betCardDeck).forEach(function (betCard) {
    var betType = betCard.rows[0].cells[1];
    var team1 = betCard.rows[1].cells[0];
    var team2 = betCard.rows[2].cells[0]; // iterate through each card forEach bet card...

    if (betCard.rows[0].cells[1].innerHTML == "moneyline") {
      betType.innerHTML = "Money Line";
      betType.style.color = "#ff9933";
    } else if (betCard.rows[0].cells[1].innerHTML == "spread") {
      betType.innerHTML = "Spread";
      betType.style.color = "#ff9933";
      team1.style.color = "green";
      team2.style.color = "red";
      team1.innerHTML = betCard.rows[1].cells[0].innerHTML.replace("undefined: ", "Over: ");
      team2.innerHTML = betCard.rows[2].cells[0].innerHTML.replace("undefined: ", "Under: ");
    } else if (betCard.rows[0].cells[1].innerHTML == "event") {
      betType.innerHTML = "Event";
      betType.style.color = "#ff9933";
      team1.style.color = "green";
      team2.style.color = "red";
      team1.innerHTML = betCard.rows[1].cells[0].innerHTML.replace("undefined: ", "For: ");
      team2.innerHTML = betCard.rows[2].cells[0].innerHTML.replace("undefined: ", "Against: ");
    }
  });
};

cleanBet();