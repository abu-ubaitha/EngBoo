// EngBoo app core

const gameQuestions = {
  spellbee: window.spellBeeQuestions || [],
  hangman: window.hangmanQuestions || [],
  spot: window.spotQuestions || []
};

function getUnusedQuestion(game) {
  let data = getData();

  if (!data.usedQuestions) {
    data.usedQuestions = {};
  }

  if (!data.usedQuestions[game]) {
    data.usedQuestions[game] = [];
  }

  const used = data.usedQuestions[game];
  const source = gameQuestions[game] || [];

  const available = source.filter(q => !used.includes(q.id));

  if (available.length === 0) {
    data.usedQuestions[game] = [];
    saveData(data);
    return getUnusedQuestion(game);
  }

  const random = available[Math.floor(Math.random() * available.length)];
  used.push(random.id);
  saveData(data);
  return random;
}

function addSoundEffects() {
  window.engBooSounds = {
    hover: new Audio('assets/sounds/hover.mp3'),
    correct: new Audio('assets/sounds/correct.mp3'),
    wrong: new Audio('assets/sounds/wrong.mp3'),
    combo: new Audio('assets/sounds/combo.mp3'),
    levelup: new Audio('assets/sounds/levelup.mp3')
  };
}

function playSound(name) {
  const sound = window.engBooSounds?.[name];
  if (sound) {
    sound.currentTime = 0;
    sound.volume = 0.28;
    sound.play().catch(() => {});
  }
}

function claimDailyReward() {
  const data = getData();
  if (!data.daily) data.daily = { streak: 0, lastClaim: 0, coins: 0 };

  const today = new Date().toDateString();
  if (data.daily.lastClaim === today) {
    return null;
  }

  data.daily.lastClaim = today;
  data.daily.streak = (data.daily.streak || 0) + 1;
  const reward = Math.min(50 + data.daily.streak * 10, 120);
  data.daily.coins = (data.daily.coins || 0) + reward;
  saveData(data);
  return { reward, streak: data.daily.streak };
}

function registerUiInteractions() {
  document.querySelectorAll('button, .primary-btn, .secondary-btn').forEach(el => {
    el.addEventListener('mouseenter', () => playSound('hover'));
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  }
}

window.addEventListener('DOMContentLoaded', () => {
  addSoundEffects();
  registerUiInteractions();
  registerServiceWorker();
});
