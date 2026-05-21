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

let joinedRaw = data.users[user].joinedAt;

let joined = joinedRaw
  ? new Date(joinedRaw).toLocaleDateString()
  : "Unknown (old account)";
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
  joinedAt: Date.now(), // ✅ use timestamp (safer than ISO)
  stats: {
    spellbee: { plays: 0, best: 0 },
    hangman: { plays: 0, best: 0 },
    spot: { plays: 0, best: 0 }
  }
};

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

function updateScore(game, score) {
  let data = getData();
  let user = data.currentUser;

  if(!data.users[user].joinedAt){
  data.users[user].joinedAt = Date.now();
  saveData(data);
}

  if (!user) return;

  data.users[user].stats[game].plays++;

  if (score > data.users[user].stats[game].best) {
    data.users[user].stats[game].best = score;
  }

  data.leaderboard[game].push({
    user,
    score
  });

  data.leaderboard[game].sort((a, b) => b.score - a.score);

  saveData(data);
}

function logout(){
  logoutUser();
  window.location.href = "login.html";
}

data.users[username] = {
  password,
  joinedAt: new Date().toISOString(),
  stats: {
    spellbee: { plays: 0, best: 0 },
    hangman: { plays: 0, best: 0 },
    spot: { plays: 0, best: 0 } 
  }
};

function requireLogin() {
  const data = getData();
  if (!data.currentUser) {
    window.location.href = "Login.html";
  }
  return data.currentUser;
}

window.addEventListener("load", () => {
  requireLogin();
  loadLeaderboard();
});