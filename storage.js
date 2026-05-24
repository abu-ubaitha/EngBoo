async function submitScore(game, score){

  const data = getData();

  const username =
  data.currentUser;

  if(!username) return;

  // CHECK EXISTING SCORE

  const { data: existing } =
  await supabaseClient
    .from("leaderboard")
    .select("*")
    .eq("username", username)
    .eq("game", game)
    .single();

  // UPDATE ONLY IF HIGHER

  if(existing){

    if(score > existing.score){

      await supabaseClient
        .from("leaderboard")
        .update({
          score: score
        })
        .eq("id", existing.id);

    }

  }

  else{

    await supabaseClient
      .from("leaderboard")
      .insert([
        {
          username: username,
          game: game,
          score: score
        }
      ]);

  }

}

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

async function getLeaderboard(game){

  const { data, error } =
  await supabaseClient
    .from("leaderboard")
    .select("*")
    .eq("game", game)
    .order("score", {
      ascending:false
    })
    .limit(10);

  if(error){

    console.error(error);
    return [];

  }

  return data;

}

      score: score,

      plays: stats?.plays || 0,

      joinedAt: user.joinedAt,

      level: level,

      xp: score * 3,

      coins: Math.floor(score / 2),

      totalScore: score,

      winStreak: Math.floor(score / 15),

      country: "India",

      accuracy: Math.min(100, 55 + Math.floor(score / 8)) + "%",

      gamesPlayed: stats?.plays || 0,

      favorite: game,

      badges: [
        level + " Rank",
        score >= 100 ? "🔥 High Scorer" : "🎮 New Challenger",
        stats?.plays >= 10 ? "⚡ Active Player" : "🌱 Beginner"
      ]

    });

  }

  leaderboard.sort(
    (a,b)=> b.score - a.score
  );

  return leaderboard;

}