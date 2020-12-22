
function closeBetCleaner(){
  let betCard = document.getElementById('betCard')
  let side1Radio = document.getElementById('side1Radio');
  let side2Radio = document.getElementById('side2Radio');

  if (betCard.rows[0].cells[1].innerHTML == "Event") {
    side1Radio.innerHTML = "For";
    side2Radio.innerHTML = "Against";

  } else if (betCard.rows[0].cells[1].innerHTML == "Spread") {
    betCard.rows[0].cells[1].innerHTML = "Spread";

    side1Radio.innerHTML = "Over";
    side2Radio.innerHTML = "Under";

  }
};
closeBetCleaner();
