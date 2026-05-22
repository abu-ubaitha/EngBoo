
// ======================
// GAME DATA ENGINE
// ======================

function getData() {
  return JSON.parse(localStorage.getItem("gameData")) || {
    users: {},
    currentUser: null,
    leaderboard: {
      spellbee: [],
      hangman: [],
      spot: []
    }
  };
}


function saveData(data) {
  localStorage.setItem("gameData", JSON.stringify(data));
}

// ======================
// REGISTER USER
// ======================

function registerUser(username, password) {
  let data = getData();

  if (!username || !password) return false;

  if (data.users[username]) {
    alert("User already exists");
    return false;
  }

  data.users[username] = {
    password,
    joinedAt: Date.now(),
    stats: {
      spellbee: { plays: 0, best: 0 },
      hangman: { plays: 0, best: 0 },
      spot: { plays: 0, best: 0 }
    }
  };

  data.currentUser = username; // ✅ ADD THIS
  saveData(data);

  return true;
}

// ======================
// LOGIN USER
// ======================

function loginUser(username, password) {
  let data = getData();

  if (!data.users[username]) {
    alert("User not found");
    return false;
  }

  if (data.users[username].password !== password) {
    alert("Wrong password");
    return false;
  }

  data.currentUser = username;
  saveData(data);
  return true;
}

// ======================
// LOGOUT
// ======================

function logoutUser() {
  let data = getData();
  data.currentUser = null;
  saveData(data);
}

// ======================
// UPDATE SCORE
// ======================


function logout(){
  logoutUser();
  window.location.href = "login.html";
}



function requireLogin() {
  const data = getData();
  if (!data.currentUser) {
    window.location.href = "login.html";
  }
  return data.currentUser;
}

window.addEventListener("load", () => {

  const page =
  window.location.pathname
  .split("/")
  .pop()
  .toLowerCase();

  // PAGES THAT DON'T NEED LOGIN

  const publicPages = [
    "login.html",
    "register.html"
  ];

  // ONLY PROTECT PRIVATE PAGES

  if(!publicPages.includes(page)){

    requireLogin();

  }

  // LOAD LEADERBOARD ONLY IF EXISTS

  if(typeof loadLeaderboard === "function"){

    loadLeaderboard();

  }

});



function updateScore(game, score) {
  let data = getData();
  let user = data.currentUser;

  if (!user) return;

  if (!data.users[user].stats) {
    data.users[user].stats = {};
  }

  if (!data.users[user].stats[game]) {
    data.users[user].stats[game] = { plays: 0, best: 0 };
  }

  let g = data.users[user].stats[game];

  g.plays += 1;

  if (score > g.best) {
    g.best = score;
  }

  saveData(data);
}