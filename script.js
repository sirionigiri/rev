const player = document.getElementById("player");
const bag = document.getElementById("bag");
const counterText = document.getElementById("hitCounter");
const comboText = document.getElementById("comboCounter");
const healthBar = document.getElementById("healthBar");
const flash = document.getElementById("flash");
const smackSound = document.getElementById("smackSound");
const kickBtn = document.getElementById("kickBtn");

let hits = 0;
let combo = 0;
let health = 100;

let lastHitTime = 0;
const cooldown = 250;         // ms
const comboWindow = 800;      // ms
let isAttacking = false;

function updateBagState() {
  if (hits >= 50) {
    bag.src = "assets/apology.png";
  } else if (hits >= 20) {
    bag.src = "assets/crying.png";
  } else {
    bag.src = "assets/smirk.png";
  }
}

function updateUI() {
  counterText.innerText = "Hits: " + hits;
  comboText.innerText = "Combo: " + combo;
  healthBar.style.width = health + "%";
}

const attackAnimationDuration = 300;

function attack(type) {
  const now = Date.now();

  if (isAttacking) return;
  if (now - lastHitTime < cooldown) return;

  isAttacking = true;

  if (now - lastHitTime < comboWindow) {
    combo++;
  } else {
    combo = 1;
  }

  lastHitTime = now;

  hits++;
  health = Math.max(0, health - 2);

  if (type === "punch") {
    player.src = "assets/punch.png";
    player.style.transform = "translateX(30px)";
  }

  if (type === "kick") {
    player.src = "assets/kick.png";
    player.style.transform = "translateX(40px) rotate(-8deg)";
  }

  if (hits < 20) {
    bag.src = "assets/pain.png";
  }

  bag.classList.add("shake");
  flash.classList.add("flashActive");

  smackSound.currentTime = 0;
  smackSound.play();

  updateUI();

  setTimeout(() => {
    player.src = "assets/rest.png";
    player.style.transform = "translateX(0px)";
    updateBagState();
    bag.classList.remove("shake");
    flash.classList.remove("flashActive");
    isAttacking = false;
  }, attackAnimationDuration);
}

document.addEventListener("click", () => attack("punch"));
document.addEventListener("touchstart", () => attack("punch"));

kickBtn.addEventListener("click", (e) => {
  e.stopPropagation();   // prevent triggering punch
  attack("kick");
});

document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("dblclick", e => e.preventDefault());