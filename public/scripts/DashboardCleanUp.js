// // Manipulate data from db to be user friendly. Replace "undefined" catergories with under and over or for against
// cleanBet = function() {
//   const betCardDeck = document.getElementsByClassName('bet-card');

//   Array.from(betCardDeck).forEach((betCard) => {
//     let betType = betCard.rows[0].cells[1];
//     let team1 = betCard.rows[1].cells[0];
//     let team2 = betCard.rows[2].cells[0];
//     // iterate through each card forEach bet card...
//     if (betCard.rows[0].cells[1].innerHTML == "moneyline") {
//       betType.innerHTML = "Money Line";
//       betType.style.color = "#ff9933";
//     } else if (betCard.rows[0].cells[1].innerHTML == "spread") {
//       betType.innerHTML = "Spread";
//       betType.style.color = "#ff9933"
//       team1.style.color = "green";
//       team2.style.color = "red";
//       team1.innerHTML = betCard.rows[1].cells[0].innerHTML.replace("undefined: ", "Over: ");
//       team2.innerHTML = betCard.rows[2].cells[0].innerHTML.replace("undefined: ", "Under: ");
//     } else if (betCard.rows[0].cells[1].innerHTML == "event") {
//       betType.innerHTML = "Event";
//       betType.style.color = "#ff9933"
//       team1.style.color = "green";
//       team2.style.color = "red";
//       team1.innerHTML = betCard.rows[1].cells[0].innerHTML.replace("undefined: ", "For: ");
//       team2.innerHTML = betCard.rows[2].cells[0].innerHTML.replace("undefined: ", "Against: ");
//     }
//   });

// };

// cleanBet();
