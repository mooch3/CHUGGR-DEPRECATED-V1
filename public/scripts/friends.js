const firestore = firebase.firestore();
const addFriend = document.getElementById('addFriend');
const friendForm = document.getElementById('friendForm');
const findFriends = document.getElementById('findFriends')
const currentUser = friendForm.me.value;
const usersRef = firestore.collection('users').where('uid', 'not-in', [currentUser]);
const friendRef = firestore.collection('users').doc(currentUser).collection('friends');
const currentRef = firestore.collection('users').doc(currentUser);
const fieldValue = firebase.firestore.FieldValue;
const potentialFriends = [];
const friendObjects = [];

// create a protential friends array
usersRef.onSnapshot((allUsers) => {
  allUsers.forEach((user) => {

      const friend = {
        firstName: user.data().firstName,
        lastName: user.data().lastName,
        profilePic: user.data().profilePic,
        uid: user.data().uid,
        userName: user.data().userName,
      };

      friendObjects.push(friend)
      potentialFriends.push(user.data().firstName + " " + user.data().lastName + " (" + user.data().userName + ")");

      potentialFriends.sort();


    });
// potential friends are collected into the array filter this array by the input value
console.log(potentialFriends);
console.log(friendObjects);
// auto complete all friend possibilities
autocomplete(findFriends, potentialFriends);
addFriendFunc(friendObjects);
});


// add a non consenual friend onClick
function increment() {
  currentRef.update({numFriends: fieldValue.increment(1)})
}

function addFriendFunc(friendObjects) {
  addFriend.addEventListener("click", (e) => {

    const regExpCheck = /\(([^)]+)\)/;
    // get the friend's username value from findFriends input
    const selectedFriend = regExpCheck.exec(findFriends.value);


    console.log(selectedFriend[1])
    const filteredFriend = friendObjects.filter((object) => object.userName == selectedFriend[1]);
    console.log(filteredFriend)
    if (filteredFriend[0].userName == selectedFriend[1]) {


      friendRef.doc(filteredFriend[0].uid).get().then((doc) => {
        // if that friend does not exist add the friend object to friends collection
        if (!doc.exists) {


          friendRef.doc(filteredFriend[0].uid).set(filteredFriend[0]);

          document.getElementById('friendSuccess').style.display = 'block';
          setTimeout(() => {
            document.getElementById('friendSuccess').style.display = 'none';
          }, 5000);
          friendForm.reset();
          increment();


        } else if (doc.exists) {
          console.log("You are already friends with this person.");
          document.getElementById('friendFail').style.display = 'block';
          setTimeout(() => {
            document.getElementById('friendFail').style.display = 'none';
          }, 5000)
        };
      });
    } else {
      console.log('User not found')
      let noResult = document.getElementById('noResult');
      noResult.style.display = "block";
      setTimeout(() => {
        noResult.style.display = "none";
      }, 5000)
    };
  });
};


// auto complete function finds friends based off of the letters in the value box
function autocomplete(inp, arr) {

  var currentFocus;

  inp.addEventListener("input", function(e) {
    var a, b, i, val = this.value;

    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;

    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");

    this.parentNode.appendChild(a);

    for (i = 0; i < arr.length; i++) {

      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {

        b = document.createElement("DIV");

        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);

        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";

        b.addEventListener("click", function(e) {

          inp.value = this.getElementsByTagName("input")[0].value;

          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });

  inp.addEventListener("keydown", function(e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {

      currentFocus++;

      addActive(x);
    } else if (e.keyCode == 38) {

      currentFocus--;

      addActive(x);
    } else if (e.keyCode == 13) {

      e.preventDefault();
      if (currentFocus > -1) {

        if (x) x[currentFocus].click();
      }
    }
  });

  function addActive(x) {

    if (!x) return false;

    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);

    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {

    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(elmnt) {

    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  document.addEventListener("click", function(e) {
    closeAllLists(e.target);
  });
}
