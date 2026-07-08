/**
 * Space Defender - Core Engine and UI Controller
 * Axumit Studios (C) 2026
 */

// ==========================================
// 🔊 SOUND EFFECTS MANAGER (Web Audio API Synth)
// ==========================================
class SoundEffectsManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  toggle() {
    this.init();
    this.enabled = !this.enabled;
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.enabled;
  }

  playLaser() {
    if (!this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playExplosion() {
    if (!this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(10, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playShieldHit() {
    if (!this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(350, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playPowerUp() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.setValueAtTime(330, now + 0.08);
    osc.frequency.setValueAtTime(392, now + 0.16);
    osc.frequency.setValueAtTime(520, now + 0.24);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.24);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.35);

    osc.start();
    osc.stop(now + 0.35);
  }

  playHurt() {
    if (!this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(30, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playWaveComplete() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(554, now + 0.12);
    osc.frequency.setValueAtTime(660, now + 0.24);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.36);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.36);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.55);

    osc.start();
    osc.stop(now + 0.55);
  }

  playSpecialActivate() {
    if (!this.enabled) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }
}

const sounds = new SoundEffectsManager();

// ==========================================
// 📊 GLOBAL RPG PERSISTENT STATS
// ==========================================
let playerStats = {
  credits: 0,
  gems: 0,
  highScore: 0,
  
  hullLvl: 1,      // Max lvl 5
  shieldLvl: 1,    // Max lvl 5
  weaponLvl: 1,    // Max lvl 5
  laserClass: 1,   // 1: Single, 2: Dual, 3: Triple, 4: Plasma Spread
  
  medLvl: 1,       // Max lvl 5
  turretLvl: 1,    // Max lvl 5
  
  unlockedShips: ['defender'], // 'defender', 'vulture', 'crusader'
  equippedShip: 'defender'
};

// Pricing config
const UPGRADE_COSTS = {
  hull: [50, 100, 180, 300],         // credits
  shield: [60, 120, 200, 320],       // credits
  weapon: [75, 150, 250, 400],       // credits
  laserClass: [3, 6, 12],            // gems
  med: [40, 80, 140, 220],           // credits
  turret: [50, 90, 150, 250],        // credits
  vultureUnlock: 5,                  // gems
  crusaderUnlock: 400                // credits
};

// Load stats from localstorage if exists
function loadProgress() {
  const data = localStorage.getItem('space_defender_rpg_stats');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      playerStats = { ...playerStats, ...parsed };
    } catch (e) {
      console.error("Failed to parse loaded progress", e);
    }
  }
}

function saveProgress() {
  localStorage.setItem('space_defender_rpg_stats', JSON.stringify(playerStats));
}

// ==========================================
// 🚪 SPLASH SCREEN SYSTEM
// ==========================================
function initSplashScreen() {
  const splash = document.getElementById('splash-screen');
  const progressBar = document.getElementById('splash-progress');
  
  // Animate progress bar
  setTimeout(() => {
    if (progressBar) progressBar.style.width = '100%';
  }, 100);

  // Transition to main menu
  setTimeout(() => {
    splash.classList.remove('active');
    setTimeout(() => {
      splash.style.display = 'none';
      showScreen('main-menu');
    }, 500);
  }, 2600);
}

// ==========================================
// 🎮 GAME STATE MANAGER & UI TRANSITIONS
// ==========================================
let currentGameInstance = null;
let currentScreenId = 'splash-screen';

function showScreen(screenId) {
  // Hide current active screen
  const currentScreen = document.getElementById(currentScreenId);
  if (currentScreen) {
    currentScreen.classList.remove('active');
    const oldScreen = currentScreen;
    setTimeout(() => {
      if (!oldScreen.classList.contains('active')) {
        oldScreen.style.display = 'none';
      }
    }, 500);
  }

  // Show target screen
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.style.display = 'flex';
    // Small delay to trigger transition opacity
    setTimeout(() => {
      targetScreen.classList.add('active');
    }, 50);
  }
  currentScreenId = screenId;
}

// Initialize Menu events
function initMenuSystem() {
  loadProgress();

  const btnStart = document.getElementById('btn-start-game');
  const btnSound = document.getElementById('btn-sound-toggle');
  const btnHow = document.getElementById('btn-how-to-play');
  const modalHow = document.getElementById('instructions-modal');
  const btnCloseHow = document.getElementById('btn-close-instructions');

  const btnPause = document.getElementById('btn-pause-game');
  const btnResume = document.getElementById('btn-resume-game');
  const btnExitMenu = document.getElementById('btn-exit-to-menu');

  const btnRestart = document.getElementById('btn-restart-game');
  const btnMenuFromOver = document.getElementById('btn-menu-from-over');

  // Launch Game
  btnStart.addEventListener('click', () => {
    sounds.init();
    showScreen('gameplay-container');
    if (currentGameInstance) {
      currentGameInstance.destroy();
    }
    currentGameInstance = createGame();
    currentGameInstance.start();
  });

  // Sound Control toggle
  btnSound.addEventListener('click', () => {
    const isEnabled = sounds.toggle();
    const onIcon = document.getElementById('sound-on-icon');
    const offIcon = document.getElementById('sound-off-icon');
    const soundText = document.getElementById('sound-text');
    
    if (isEnabled) {
      onIcon.classList.remove('hidden');
      offIcon.classList.add('hidden');
      soundText.innerText = "SOUND: ON";
    } else {
      onIcon.classList.add('hidden');
      offIcon.classList.remove('hidden');
      soundText.innerText = "SOUND: OFF";
    }
  });

  // Instructions Dialog
  btnHow.addEventListener('click', () => {
    modalHow.classList.remove('hidden');
  });
  btnCloseHow.addEventListener('click', () => {
    modalHow.classList.add('hidden');
  });

  // Pause & Upgrade Overlay
  btnPause.addEventListener('click', () => {
    if (currentGameInstance) {
      currentGameInstance.pause();
      openUpgradesOverlay();
    }
  });

  btnResume.addEventListener('click', () => {
    if (currentGameInstance) {
      currentGameInstance.resume();
      closeUpgradesOverlay();
    }
  });

  btnExitMenu.addEventListener('click', () => {
    closeUpgradesOverlay();
    if (currentGameInstance) {
      currentGameInstance.destroy();
      currentGameInstance = null;
    }
    showScreen('main-menu');
  });

  // Game over panel triggers
  btnRestart.addEventListener('click', () => {
    showScreen('gameplay-container');
    if (currentGameInstance) {
      currentGameInstance.destroy();
    }
    currentGameInstance = createGame();
    currentGameInstance.start();
  });

  btnMenuFromOver.addEventListener('click', () => {
    showScreen('main-menu');
  });

  // Shop upgrade action buttons mapping
  document.getElementById('btn-upgrade-hull').addEventListener('click', () => purchaseUpgrade('hull'));
  document.getElementById('btn-upgrade-shield').addEventListener('click', () => purchaseUpgrade('shield'));
  document.getElementById('btn-upgrade-weapon').addEventListener('click', () => purchaseUpgrade('weapon'));
  document.getElementById('btn-upgrade-laser-class').addEventListener('click', () => purchaseUpgrade('laserClass'));
  document.getElementById('btn-upgrade-ability-med').addEventListener('click', () => purchaseUpgrade('med'));
  document.getElementById('btn-upgrade-ability-turret').addEventListener('click', () => purchaseUpgrade('turret'));

  document.getElementById('btn-unlock-vulture').addEventListener('click', () => purchaseUpgrade('unlockVulture'));
  document.getElementById('btn-unlock-crusader').addEventListener('click', () => purchaseUpgrade('unlockCrusader'));

  // Ship selections
  document.getElementById('shop-ship-defender').addEventListener('click', () => selectShip('defender'));
  document.getElementById('shop-ship-vulture').addEventListener('click', () => selectShip('vulture'));
  document.getElementById('shop-ship-crusader').addEventListener('click', () => selectShip('crusader'));
}

// Open Shop / Pause Overlay
function openUpgradesOverlay() {
  updateUpgradesUI();
  document.getElementById('upgrades-overlay').classList.remove('hidden');
}

function closeUpgradesOverlay() {
  document.getElementById('upgrades-overlay').classList.add('hidden');
}

// Update shop stats elements and button prices
function updateUpgradesUI() {
  // Currencies
  document.getElementById('shop-credits').innerText = playerStats.credits;
  document.getElementById('shop-gems').innerText = playerStats.gems;

  // Levels
  document.getElementById('val-hull-lvl').innerText = playerStats.hullLvl;
  document.getElementById('val-shield-lvl').innerText = playerStats.shieldLvl;
  document.getElementById('val-weapon-lvl').innerText = playerStats.weaponLvl;
  
  const laserClasses = ["Single Laser", "Dual Laser", "Triple Blaster", "Plasma Spread"];
  document.getElementById('val-laser-class').innerText = laserClasses[playerStats.laserClass - 1];

  // Heal value description
  document.getElementById('val-med-heal').innerText = (40 + playerStats.medLvl * 10) + "%";
  document.getElementById('val-turret-time').innerText = (8 + playerStats.turretLvl * 2) + "s";

  // Costs
  const hIdx = playerStats.hullLvl - 1;
  const sIdx = playerStats.shieldLvl - 1;
  const wIdx = playerStats.weaponLvl - 1;
  const lIdx = playerStats.laserClass - 1;
  const mIdx = playerStats.medLvl - 1;
  const tIdx = playerStats.turretLvl - 1;

  document.getElementById('cost-hull-up').innerText = hIdx < UPGRADE_COSTS.hull.length ? UPGRADE_COSTS.hull[hIdx] : "MAX";
  document.getElementById('cost-shield-up').innerText = sIdx < UPGRADE_COSTS.shield.length ? UPGRADE_COSTS.shield[sIdx] : "MAX";
  document.getElementById('cost-weapon-up').innerText = wIdx < UPGRADE_COSTS.weapon.length ? UPGRADE_COSTS.weapon[wIdx] : "MAX";
  document.getElementById('cost-laser-up').innerText = lIdx < UPGRADE_COSTS.laserClass.length ? UPGRADE_COSTS.laserClass[lIdx] : "MAX";
  document.getElementById('cost-med-up').innerText = mIdx < UPGRADE_COSTS.med.length ? UPGRADE_COSTS.med[mIdx] : "MAX";
  document.getElementById('cost-turret-up').innerText = tIdx < UPGRADE_COSTS.turret.length ? UPGRADE_COSTS.turret[tIdx] : "MAX";

  // Check buttons disable states
  setupShopButtonState('btn-upgrade-hull', hIdx, UPGRADE_COSTS.hull, playerStats.credits);
  setupShopButtonState('btn-upgrade-shield', sIdx, UPGRADE_COSTS.shield, playerStats.credits);
  setupShopButtonState('btn-upgrade-weapon', wIdx, UPGRADE_COSTS.weapon, playerStats.credits);
  setupShopButtonState('btn-upgrade-laser-class', lIdx, UPGRADE_COSTS.laserClass, playerStats.gems, true);
  setupShopButtonState('btn-upgrade-ability-med', mIdx, UPGRADE_COSTS.med, playerStats.credits);
  setupShopButtonState('btn-upgrade-ability-turret', tIdx, UPGRADE_COSTS.turret, playerStats.credits);

  // Lock status of ship panels
  setupShipPanel('shop-ship-defender', 'defender');
  setupShipPanel('shop-ship-vulture', 'vulture');
  setupShipPanel('shop-ship-crusader', 'crusader');
}

function setupShopButtonState(btnId, idx, costsArray, userCurrency, isGems = false) {
  const btn = document.getElementById(btnId);
  if (!btn) return;

  if (idx >= costsArray.length) {
    btn.disabled = true;
    btn.innerText = "MAXED";
    btn.style.opacity = '0.5';
  } else {
    const cost = costsArray[idx];
    btn.disabled = userCurrency < cost;
    btn.style.opacity = userCurrency >= cost ? '1' : '0.5';
  }
}

function setupShipPanel(elementId, shipType) {
  const panel = document.getElementById(elementId);
  if (!panel) return;

  const isUnlocked = playerStats.unlockedShips.includes(shipType);
  const isEquipped = playerStats.equippedShip === shipType;

  // Visual highlights
  panel.classList.remove('border-cyan-500', 'border-slate-900', 'border-purple-500', 'border-yellow-500', 'shadow-[0_0_8px_rgba(6,182,212,0.1)]');
  
  if (isEquipped) {
    panel.classList.add('border-cyan-500', 'shadow-[0_0_8px_rgba(6,182,212,0.1)]');
  } else {
    panel.classList.add('border-slate-900');
  }

  // Button logic
  if (shipType === 'vulture') {
    const btn = document.getElementById('btn-unlock-vulture');
    if (isUnlocked) {
      btn.innerText = isEquipped ? "ACTIVE" : "EQUIP";
      btn.className = "px-3 py-1.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded-lg cursor-pointer uppercase";
    } else {
      btn.innerText = "UNLOCK";
      btn.className = "px-3 py-1.5 bg-purple-600 text-white text-[10px] font-bold rounded-lg cursor-pointer uppercase";
      btn.disabled = playerStats.gems < UPGRADE_COSTS.vultureUnlock;
      btn.style.opacity = playerStats.gems >= UPGRADE_COSTS.vultureUnlock ? '1' : '0.5';
    }
  } else if (shipType === 'crusader') {
    const btn = document.getElementById('btn-unlock-crusader');
    if (isUnlocked) {
      btn.innerText = isEquipped ? "ACTIVE" : "EQUIP";
      btn.className = "px-3 py-1.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded-lg cursor-pointer uppercase";
    } else {
      btn.innerText = "UNLOCK";
      btn.className = "px-3 py-1.5 bg-yellow-600 text-white text-[10px] font-bold rounded-lg cursor-pointer uppercase";
      btn.disabled = playerStats.credits < UPGRADE_COSTS.crusaderUnlock;
      btn.style.opacity = playerStats.credits >= UPGRADE_COSTS.crusaderUnlock ? '1' : '0.5';
    }
  }
}

// Purchase and enhance stats
function purchaseUpgrade(type) {
  sounds.init();
  let success = false;

  if (type === 'hull') {
    const cost = UPGRADE_COSTS.hull[playerStats.hullLvl - 1];
    if (playerStats.hullLvl < 5 && playerStats.credits >= cost) {
      playerStats.credits -= cost;
      playerStats.hullLvl++;
      success = true;
    }
  } else if (type === 'shield') {
    const cost = UPGRADE_COSTS.shield[playerStats.shieldLvl - 1];
    if (playerStats.shieldLvl < 5 && playerStats.credits >= cost) {
      playerStats.credits -= cost;
      playerStats.shieldLvl++;
      success = true;
    }
  } else if (type === 'weapon') {
    const cost = UPGRADE_COSTS.weapon[playerStats.weaponLvl - 1];
    if (playerStats.weaponLvl < 5 && playerStats.credits >= cost) {
      playerStats.credits -= cost;
      playerStats.weaponLvl++;
      success = true;
    }
  } else if (type === 'laserClass') {
    const cost = UPGRADE_COSTS.laserClass[playerStats.laserClass - 1];
    if (playerStats.laserClass < 4 && playerStats.gems >= cost) {
      playerStats.gems -= cost;
      playerStats.laserClass++;
      success = true;
    }
  } else if (type === 'med') {
    const cost = UPGRADE_COSTS.med[playerStats.medLvl - 1];
    if (playerStats.medLvl < 5 && playerStats.credits >= cost) {
      playerStats.credits -= cost;
      playerStats.medLvl++;
      success = true;
    }
  } else if (type === 'turret') {
    const cost = UPGRADE_COSTS.turret[playerStats.turretLvl - 1];
    if (playerStats.turretLvl < 5 && playerStats.credits >= cost) {
      playerStats.credits -= cost;
      playerStats.turretLvl++;
      success = true;
    }
  } else if (type === 'unlockVulture') {
    if (!playerStats.unlockedShips.includes('vulture') && playerStats.gems >= UPGRADE_COSTS.vultureUnlock) {
      playerStats.gems -= UPGRADE_COSTS.vultureUnlock;
      playerStats.unlockedShips.push('vulture');
      playerStats.equippedShip = 'vulture';
      success = true;
    } else if (playerStats.unlockedShips.includes('vulture')) {
      playerStats.equippedShip = 'vulture';
      success = true;
    }
  } else if (type === 'unlockCrusader') {
    if (!playerStats.unlockedShips.includes('crusader') && playerStats.credits >= UPGRADE_COSTS.crusaderUnlock) {
      playerStats.credits -= UPGRADE_COSTS.crusaderUnlock;
      playerStats.unlockedShips.push('crusader');
      playerStats.equippedShip = 'crusader';
      success = true;
    } else if (playerStats.unlockedShips.includes('crusader')) {
      playerStats.equippedShip = 'crusader';
      success = true;
    }
  }

  if (success) {
    sounds.playPowerUp();
    saveProgress();
    updateUpgradesUI();
    
    // Sync active game stats instantly
    if (currentGameInstance) {
      currentGameInstance.syncStats();
    }
  }
}

function selectShip(shipType) {
  if (playerStats.unlockedShips.includes(shipType)) {
    playerStats.equippedShip = shipType;
    sounds.playPowerUp();
    saveProgress();
    updateUpgradesUI();
    if (currentGameInstance) {
      currentGameInstance.syncStats();
    }
  }
}

// ==========================================
// 🧩 CORE GAME ENGINE (createGame)
// ==========================================
function createGame() {
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');

  // Pre-render deep space nebula onto an offscreen canvas to optimize drawing speed
  const nebulaCanvas = document.createElement('canvas');
  const nebSize = 250;
  nebulaCanvas.width = nebSize * 2;
  nebulaCanvas.height = nebSize * 2;
  const nebCtx = nebulaCanvas.getContext('2d');
  const nebGrad = nebCtx.createRadialGradient(nebSize, nebSize, 0, nebSize, nebSize, nebSize);
  nebGrad.addColorStop(0, 'rgba(124, 58, 237, 0.12)'); // Purple nebula glow
  nebGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.08)'); // Pink nebula glow
  nebGrad.addColorStop(1, 'transparent');
  nebCtx.beginPath();
  nebCtx.arc(nebSize, nebSize, nebSize, 0, Math.PI * 2);
  nebCtx.fillStyle = nebGrad;
  nebCtx.fill();

  // Game state
  let isRunning = false;
  let isPaused = false;
  let score = 0;
  let wave = 1;
  let enemiesDefeatedCount = 0;
  let creditsEarnedInRun = 0;
  
  // Game Loop request ID
  let animationFrameId = null;

  // Timing/Engine variables
  let time = 0;
  let lastTime = 0;
  let enemySpawnTimer = 0;
  let waveState = 'countdown'; // 'countdown', 'active', 'cleared'
  let waveTimer = 180; // 3 seconds wave alert count
  let currentEnemiesCountToSpawn = 10;
  let spawnedCountThisWave = 0;
  let waveSplashTimer = 0;

  // Starfield parallax background stars
  const stars = [];
  const backgroundObjects = [];
  let screenFlashAlpha = 0;
  let highScoreBeatenTextSpawned = false;

  function initStars() {
    stars.length = 0;
    const count = 75;
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 2.5 + 0.5,
        color: Math.random() > 0.8 ? 'rgba(0,191,255,0.4)' : 'rgba(255,255,255,0.3)'
      });
    }
  }

  function initBackgroundObjects() {
    backgroundObjects.length = 0;
    // Add 1 floating deep space nebula
    backgroundObjects.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5,
      size: Math.random() * 180 + 150,
      speed: 0.15,
      color1: 'rgba(124, 58, 237, 0.08)', // Purple nebula glow
      color2: 'rgba(236, 72, 153, 0.05)', // Pink nebula glow
      type: 'nebula'
    });
    // Add 2 background planets
    backgroundObjects.push({
      x: Math.random() * canvas.width,
      y: -100,
      size: Math.random() * 30 + 20,
      speed: 0.3,
      color: 'rgba(6, 182, 212, 0.2)', // Cyan gas planet
      craterColor: 'rgba(8, 145, 178, 0.25)',
      type: 'planet'
    });
    backgroundObjects.push({
      x: Math.random() * (canvas.width - 50) + 25,
      y: canvas.height * 0.5 + Math.random() * canvas.height * 0.3,
      size: Math.random() * 20 + 15,
      speed: 0.25,
      color: 'rgba(249, 115, 22, 0.15)', // Orange rocky planet
      craterColor: 'rgba(234, 88, 12, 0.2)',
      type: 'planet'
    });
  }

  // Pools
  const bullets = [];
  const enemyBullets = [];
  const enemies = [];
  const lootItems = [];
  const particles = [];
  const damageTexts = [];
  const drones = [];

  // Planet health stats
  let planetMaxHealth = 100;
  let planetHealth = 100;
  let screenShakeAmount = 0;

  // Player properties
  const player = {
    x: 0,
    y: 0,
    width: 38,
    height: 38,
    vx: 0,
    vy: 0,
    speed: 5.5,
    shield: 100,
    maxShield: 100,
    hull: 100,
    maxHull: 100,
    shieldRegenRate: 0.06,
    lastHit: 0,
    lastFired: 0,
    fireInterval: 220, // ms
    color: '#00bfff',
    engineFlareTimer: 0,
    flashUntil: 0,
    rapidFireUntil: 0,
    doubleShotUntil: 0
  };

  // Cooldown objects (durations in ms)
  const abilities = {
    med: { cd: 18000, lastUsed: -18000, active: false, triggerTime: 0 },
    turret: { cd: 22000, lastUsed: -22000, active: false, triggerTime: 0, duration: 10000 },
    overdrive: { cd: 25000, lastUsed: -25000, active: false, triggerTime: 0, duration: 6000 }
  };

  // Controls bindings
  const keys = {};
  
  // Touch Drag states (Direct 1:1, zero delay)
  let touchActive = false;
  let touchStartX = 0;
  let touchStartY = 0;
  let playerStartX = 0;
  let playerStartY = 0;

  // Setup Responsive Canvas
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Position player near bottom center on first resize or if outside screen
    if (player.x === 0 && player.y === 0) {
      player.x = canvas.width / 2;
      player.y = canvas.height * 0.75;
    }
    
    initStars();
    initBackgroundObjects();
  }

  // Synchronize player stats from upgraded store
  function syncStats() {
    // Ship multipliers
    let speedMult = 1.0;
    let shieldMaxMult = 1.0;
    let shieldRegenMult = 1.0;
    let hullMaxMult = 1.0;

    if (playerStats.equippedShip === 'vulture') {
      speedMult = 1.35;
      shieldMaxMult = 1.3;
      shieldRegenMult = 1.8;
      player.color = '#d946ef'; // Magenta themed ship
    } else if (playerStats.equippedShip === 'crusader') {
      speedMult = 0.8;
      hullMaxMult = 1.6;
      player.color = '#eab308'; // Gold themed ship
    } else {
      player.color = '#00bfff'; // Blue default
    }

    // RPG Tier additions
    player.maxHull = (100 + (playerStats.hullLvl - 1) * 25) * hullMaxMult;
    player.maxShield = (100 + (playerStats.shieldLvl - 1) * 25) * shieldMaxMult;
    player.shieldRegenRate = (0.06 + (playerStats.shieldLvl - 1) * 0.03) * shieldRegenMult;
    player.speed = (5.5 + (playerStats.weaponLvl - 1) * 0.2) * speedMult; // speed scales with level a tiny bit

    // Make sure shields/hull don't exceed newly computed maximums during run
    if (player.hull > player.maxHull) player.hull = player.maxHull;
    if (player.shield > player.maxShield) player.shield = player.maxShield;

    // Redraw HUD info in main thread
    updateHUDStats();
  }

  // Initialize Input Listeners
  function initInput() {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Touch Handlers for Mobile Devices
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    // Buttons
    document.getElementById('btn-ability-med').addEventListener('click', triggerMedKit);
    document.getElementById('btn-ability-turret').addEventListener('click', triggerAutoTurret);
    document.getElementById('btn-ability-overdrive').addEventListener('click', triggerOverdrive);
  }

  function handleKeyDown(e) {
    keys[e.key.toLowerCase()] = true;

    // Abilities numerical bindings
    if (e.key === '1') triggerMedKit();
    if (e.key === '2') triggerAutoTurret();
    if (e.key === '3') triggerOverdrive();
  }

  function handleKeyUp(e) {
    keys[e.key.toLowerCase()] = false;
  }

  // Mobile Relative Drag Touch Logic
  function handleTouchStart(e) {
    // Avoid blocking header HUD buttons
    if (e.touches[0].clientY < 80) return;
    // Avoid blocking footer panel buttons
    if (e.touches[0].clientY > canvas.height - 100) return;

    e.preventDefault();
    touchActive = true;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    playerStartX = player.x;
    playerStartY = player.y;
  }

  function handleTouchMove(e) {
    if (!touchActive) return;
    e.preventDefault();
    
    const curX = e.touches[0].clientX;
    const curY = e.touches[0].clientY;
    
    const dx = curX - touchStartX;
    const dy = curY - touchStartY;
    
    // Sensitivity factor prevents the player's finger from blocking the view of the ship.
    const sensitivity = 1.35;
    player.x = playerStartX + dx * sensitivity;
    player.y = playerStartY + dy * sensitivity;

    // Constrain player to clear play area (so it doesn't go under top HUD bar or bottom action row)
    player.x = Math.max(player.width / 2, Math.min(canvas.width - player.width / 2, player.x));
    player.y = Math.max(85 + player.height / 2, Math.min(canvas.height - 85 - player.height / 2, player.y));
  }

  function handleTouchEnd(e) {
    touchActive = false;
  }

  // ==========================================
  // ⚡️ ACTIVABLE ABILITY LOGIC
  // ==========================================
  function triggerMedKit() {
    const now = Date.now();
    const cd = abilities.med.cd - (playerStats.medLvl - 1) * 1500; // lower cooldown on upgrade
    if (now - abilities.med.lastUsed >= cd && player.hull > 0) {
      abilities.med.lastUsed = now;
      sounds.playSpecialActivate();

      // Heals 50% max hull + restores shields completely!
      const healPercentage = 0.4 + (playerStats.medLvl) * 0.1; // 50% base up to 90%
      player.hull = Math.min(player.maxHull, player.hull + player.maxHull * healPercentage);
      player.shield = player.maxShield;

      // Visual particles
      spawnParticleBurst(player.x, player.y, '#10b981', 30);
      spawnDamageText("+REPAIR+", player.x, player.y - 20, '#10b981');
    }
  }

  function triggerAutoTurret() {
    const now = Date.now();
    if (now - abilities.turret.lastUsed >= abilities.turret.cd && player.hull > 0) {
      abilities.turret.lastUsed = now;
      abilities.turret.triggerTime = now;
      abilities.turret.active = true;
      sounds.playSpecialActivate();

      // Spawn drone orbit companion
      const droneCount = playerStats.equippedShip === 'crusader' ? 2 : 1; // Crusader gets extra companion
      drones.length = 0; // Clear existing active turret spells

      const turretDur = 8000 + (playerStats.turretLvl) * 2000; // duration is 10s up to 18s

      for (let i = 0; i < droneCount; i++) {
        drones.push({
          angleOffset: (Math.PI * 2 / droneCount) * i,
          radius: 45,
          speed: 0.05,
          lastFired: 0,
          fireInterval: 320 - (playerStats.turretLvl * 20), // fires faster on upgrade
          expireTime: now + turretDur
        });
      }

      spawnParticleBurst(player.x, player.y, '#06b6d4', 25);
      spawnDamageText("DRONES DEPLOYED", player.x, player.y - 20, '#06b6d4');
    }
  }

  function triggerOverdrive() {
    const now = Date.now();
    if (now - abilities.overdrive.lastUsed >= abilities.overdrive.cd && player.hull > 0) {
      abilities.overdrive.lastUsed = now;
      abilities.overdrive.triggerTime = now;
      abilities.overdrive.active = true;
      sounds.playSpecialActivate();

      player.fireInterval = 75; // Ultra-rapid laser fire rate
      
      spawnParticleBurst(player.x, player.y, '#ec4899', 40);
      spawnDamageText("BURST OVERDRIVE", player.x, player.y - 20, '#ec4899');
    }
  }

  // ==========================================
  // 💥 PARTICLE & EFFECT GENERATOR
  // ==========================================
  function spawnParticleBurst(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        radius: Math.random() * 3 + 1,
        color: color,
        alpha: 1,
        decay: Math.random() * 0.03 + 0.015
      });
    }
  }

  function spawnDamageText(text, x, y, color) {
    damageTexts.push({
      text: text,
      x: x,
      y: y,
      vy: -1.2,
      alpha: 1.0,
      color: color || '#ffffff'
    });
  }

  // Trigger screen shake on impacts
  function triggerScreenShake(power) {
    screenShakeAmount = Math.max(screenShakeAmount, power);
  }

  // ==========================================
  // 🛡️ WAVE MANAGER LOGIC
  // ==========================================
  function advanceWave() {
    waveState = 'countdown';
    waveTimer = 90; // 1.5 seconds screen flash (much more immediate and dynamic!)
    
    // Waves parameters scaling
    if (wave === 1) {
      currentEnemiesCountToSpawn = 8;
    } else if (wave <= 3) {
      currentEnemiesCountToSpawn = 10 + (wave - 2) * 2;
    } else if (wave <= 6) {
      currentEnemiesCountToSpawn = 15 + (wave - 4) * 3;
    } else {
      currentEnemiesCountToSpawn = 24 + (wave - 7) * 4;
    }
    
    spawnedCountThisWave = 0;
    
    // Highlight alert warning message
    const alertLabel = document.getElementById('hud-alert');
    if (alertLabel) {
      alertLabel.innerText = `ALERT: WAVE ${wave} INCOMING`;
      alertLabel.style.opacity = '1';
    }

    sounds.playWaveComplete();
  }

  // ==========================================
  // 👾 ENEMIES COMPILER & PATTERNS
  // ==========================================
  function spawnEnemy() {
    const margin = 30;
    const roll = Math.random();
    
    // Choose enemy category based on wave progression ratios
    let type = 'asteroid';
    let size = 20;
    let hp = 1;
    let speed = 2.0;
    let points = 10;

    // Check if spawning Boss on waves multiple of 5
    const isBossWave = (wave % 5 === 0);
    const bossesCount = enemies.filter(e => e.isBoss).length;
    
    if (isBossWave && spawnedCountThisWave === 0 && bossesCount === 0) {
      // Spawn massive boss!
      enemies.push({
        x: canvas.width / 2,
        y: -120,
        vx: 1.5,
        vy: 1.0,
        width: 110,
        height: 60,
        hp: 30 + wave * 25,
        maxHp: 30 + wave * 25,
        points: 500,
        isBoss: true,
        lastShot: 0,
        lastMissile: 0,
        color: '#ff0055',
        shootInterval: 1200 - Math.min(600, wave * 40)
      });
      spawnedCountThisWave = currentEnemiesCountToSpawn; // End normal spawns until boss cleared
      return;
    }

    // Normal unit choices based on wave milestone scaling
    if (wave === 1) {
      // Wave 1: Slow enemies, few in number. Only swarmers (1-hit fast interceptor) and asteroids (slow)
      if (roll > 0.6) {
        type = 'swarmer';
        size = 11;
        hp = 1;
        speed = Math.random() * 0.6 + 2.0; // Slow-ish
        points = 15;
      } else {
        type = 'asteroid';
        size = Math.random() * 15 + 12;
        hp = 1;
        speed = Math.random() * 0.5 + 1.0; // Very slow
        points = 10;
      }
    } else if (wave >= 2 && wave <= 3) {
      // Wave 2 - 3: Medium speed, more enemies. Swarmers, asteroids, scouts, and bugs.
      if (roll > 0.75) {
        type = 'bug'; // Zig-zag kamikaze
        size = 14;
        hp = 2;
        speed = Math.random() * 0.8 + 2.2;
        points = 30;
      } else if (roll > 0.45) {
        type = 'scout'; // Shoots back
        size = 18;
        hp = 2;
        speed = Math.random() * 0.6 + 1.5;
        points = 25;
      } else if (roll > 0.2) {
        type = 'swarmer';
        size = 11;
        hp = 1;
        speed = Math.random() * 0.8 + 2.8;
        points = 15;
      } else {
        type = 'asteroid';
        size = Math.random() * 18 + 12;
        hp = Math.ceil(size / 10);
        speed = Math.random() * 0.8 + 1.4;
        points = Math.floor(size);
      }
    } else if (wave >= 4 && wave <= 6) {
      // Wave 4 - 6: Faster enemies, more bullets.
      if (roll > 0.8) {
        type = 'scout';
        size = 18;
        hp = 2 + Math.floor(wave / 5);
        speed = Math.random() * 0.8 + 2.4; // Faster
        points = 25;
      } else if (roll > 0.55) {
        type = 'bug';
        size = 14;
        hp = 2 + Math.floor(wave / 6);
        speed = Math.random() * 1.0 + 3.0; // Faster
        points = 35;
      } else if (roll > 0.25) {
        type = 'swarmer';
        size = 11;
        hp = 1;
        speed = Math.random() * 1.0 + 3.8; // Fast
        points = 15;
      } else {
        type = 'asteroid';
        size = Math.random() * 20 + 12;
        hp = Math.ceil(size / 8) + Math.floor(wave / 3);
        speed = Math.random() * 1.0 + 1.8;
        points = Math.floor(size);
      }
    } else {
      // Wave 7+: Very fast enemies, strong enemies (Elite) appear!
      if (roll > 0.78) {
        type = 'elite'; // Strong heavy units with twin heavy blasters
        size = 22;
        hp = 3 + Math.floor(wave / 4); // Takes 3+ hits
        speed = Math.random() * 0.4 + 1.4 + (wave * 0.02);
        points = 45;
      } else if (roll > 0.55) {
        type = 'bug';
        size = 14;
        hp = 2 + Math.floor(wave / 5);
        speed = Math.random() * 1.2 + 3.5 + (wave * 0.03); // Very fast
        points = 35;
      } else if (roll > 0.32) {
        type = 'scout';
        size = 18;
        hp = 3 + Math.floor(wave / 4);
        speed = Math.random() * 1.0 + 2.8 + (wave * 0.03); // Very fast
        points = 25;
      } else if (roll > 0.12) {
        type = 'swarmer';
        size = 11;
        hp = 1;
        speed = Math.random() * 1.2 + 4.5 + (wave * 0.04); // Extremely fast
        points = 15;
      } else {
        type = 'asteroid';
        size = Math.random() * 22 + 12;
        hp = Math.ceil(size / 7) + Math.floor(wave / 3);
        speed = Math.random() * 1.2 + 2.4 + (wave * 0.02);
        points = Math.floor(size);
      }
    }

    enemies.push({
      x: Math.random() * (canvas.width - margin * 2) + margin,
      y: -50,
      vx: (type === 'bug' || type === 'swarmer') ? 0 : (Math.random() - 0.5) * 1.2,
      vy: speed,
      size: size,
      hp: hp,
      maxHp: hp,
      type: type,
      points: points,
      isBoss: false,
      lastShot: 0,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.04
    });

    spawnedCountThisWave++;
  }

  // Fire weapons from standard Scout units, Elite units, or Boss
  function enemyAttack(enemy, now) {
    if (enemy.type === 'scout') {
      const interval = 2200 - Math.min(1000, wave * 50);
      if (now - enemy.lastShot >= interval) {
        enemy.lastShot = now;
        // Fire laser downwards at player
        const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        enemyBullets.push({
          x: enemy.x,
          y: enemy.y + enemy.size,
          vx: Math.cos(angle) * 4.2,
          vy: Math.sin(angle) * 4.2,
          size: 4,
          color: '#ff3366'
        });
      }
    } else if (enemy.type === 'elite') {
      const interval = 2000 - Math.min(800, wave * 60);
      if (now - enemy.lastShot >= interval) {
        enemy.lastShot = now;
        // Twin straight heavy lasers downwards
        enemyBullets.push({
          x: enemy.x - 10,
          y: enemy.y + 15,
          vx: 0,
          vy: 4.8,
          size: 4.5,
          color: '#f97316' // Golden heavy blasters
        });
        enemyBullets.push({
          x: enemy.x + 10,
          y: enemy.y + 15,
          vx: 0,
          vy: 4.8,
          size: 4.5,
          color: '#f97316'
        });
      }
    } else if (enemy.isBoss) {
      if (now - enemy.lastShot >= enemy.shootInterval) {
        enemy.lastShot = now;
        // Radial 3-shot laser wave
        const angles = [-0.2, 0, 0.2];
        angles.forEach(a => {
          enemyBullets.push({
            x: enemy.x,
            y: enemy.y + 35,
            vx: Math.sin(a) * 4.5,
            vy: Math.cos(a) * 4.5,
            size: 5,
            color: '#f43f5e'
          });
        });
        sounds.playShieldHit();
      }

      // Secondary lock-on missile
      if (now - enemy.lastMissile >= 4000) {
        enemy.lastMissile = now;
        const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        enemyBullets.push({
          x: enemy.x + (Math.random() > 0.5 ? 40 : -40),
          y: enemy.y + 10,
          vx: Math.cos(angle) * 3.0,
          vy: Math.sin(angle) * 3.0,
          size: 7,
          color: '#eab308',
          isMissile: true
        });
      }
    }
  }

  // ==========================================
  // 💎 LOOT SYSTEM
  // ==========================================
  function spawnLoot(x, y, enemy) {
    // Determine drops
    const drops = [];
    const creditsToDrop = Math.ceil(enemy.points / 5) + Math.floor(Math.random() * 3);
    
    // Drop Credit coins
    for (let i = 0; i < Math.min(5, creditsToDrop); i++) {
      drops.push({ type: 'credit', value: 1, radius: 5 });
    }

    // Gem drop chance (15% base, 100% from bosses)
    const gemRoll = Math.random();
    if (enemy.isBoss) {
      const bossGems = 2 + Math.floor(wave / 2);
      for (let i = 0; i < bossGems; i++) {
        drops.push({ type: 'gem', value: 1, radius: 6 });
      }
    } else if (gemRoll > 0.85) {
      drops.push({ type: 'gem', value: 1, radius: 6 });
    }

    // Spawn custom power-up drop chance (18% chance on normal enemies, 100% on bosses)
    const pRoll = Math.random();
    if (enemy.isBoss) {
      // Boss always drops 2 useful powerups!
      const types = ['heal', 'shield', 'rapid', 'double'];
      drops.push({ type: types[Math.floor(Math.random() * types.length)], value: 1, radius: 8 });
      drops.push({ type: types[Math.floor(Math.random() * types.length)], value: 1, radius: 8 });
    } else if (pRoll < 0.18) {
      const types = ['heal', 'shield', 'rapid', 'double'];
      const selectedType = types[Math.floor(Math.random() * types.length)];
      drops.push({ type: selectedType, value: 1, radius: 8 });
    }

    drops.forEach(d => {
      lootItems.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 1.5) * 2, // jump up slightly
        type: d.type,
        value: d.value,
        radius: d.radius || 5,
        magnetState: false
      });
    });
  }

  // ==========================================
  // 🚀 ACTIVE FIRE SYSTEM
  // ==========================================
  function playerFire(now) {
    let currentFireInterval = player.fireInterval;
    if (player.rapidFireUntil && now < player.rapidFireUntil) {
      currentFireInterval = player.fireInterval / 2.2; // Double fire rate!
    } else if (abilities.overdrive.active) {
      currentFireInterval = 85; // Ultra-rapid overdrive fire rate
    }

    if (now - player.lastFired >= currentFireInterval) {
      player.lastFired = now;
      sounds.playLaser();

      let laserClassLvl = playerStats.laserClass;
      if (player.doubleShotUntil && now < player.doubleShotUntil) {
        laserClassLvl = Math.min(4, laserClassLvl + 1); // Boost laser stream count!
      }

      // RPG Blaster multiplier
      const dmg = 1 + (playerStats.weaponLvl - 1) * 0.3;
      const laserSpeed = -18; // Much faster responsive lasers!

      // Muzzle flash particles
      for (let i = 0; i < 4; i++) {
        particles.push({
          x: player.x + (Math.random() - 0.5) * 12,
          y: player.y - 18,
          vx: (Math.random() - 0.5) * 4,
          vy: -Math.random() * 4 - 2,
          radius: Math.random() * 2 + 1,
          color: laserClassLvl >= 4 ? '#a78bfa' : '#22d3ee',
          alpha: 1,
          decay: Math.random() * 0.05 + 0.05
        });
      }

      if (laserClassLvl === 1) {
        // Single central laser
        bullets.push({ x: player.x, y: player.y - 18, vx: 0, vy: laserSpeed, dmg: dmg, size: 2.5, length: 14, color: '#22d3ee' });
      } else if (laserClassLvl === 2) {
        // Dual laser streams from wings
        bullets.push({ x: player.x - 14, y: player.y - 5, vx: 0, vy: laserSpeed, dmg: dmg * 0.8, size: 2.5, length: 14, color: '#22d3ee' });
        bullets.push({ x: player.x + 14, y: player.y - 5, vx: 0, vy: laserSpeed, dmg: dmg * 0.8, size: 2.5, length: 14, color: '#22d3ee' });
      } else if (laserClassLvl === 3) {
        // Triple Stream
        bullets.push({ x: player.x - 16, y: player.y - 5, vx: -1.5, vy: laserSpeed + 0.5, dmg: dmg * 0.7, size: 2.5, length: 14, color: '#22d3ee' });
        bullets.push({ x: player.x, y: player.y - 18, vx: 0, vy: laserSpeed, dmg: dmg, size: 2.5, length: 14, color: '#22d3ee' });
        bullets.push({ x: player.x + 16, y: player.y - 5, vx: 1.5, vy: laserSpeed + 0.5, dmg: dmg * 0.7, size: 2.5, length: 14, color: '#22d3ee' });
      } else if (laserClassLvl >= 4) {
        // Spread Plasma bursts (5 streams!)
        const spreads = [-3, -1.5, 0, 1.5, 3];
        spreads.forEach(sX => {
          bullets.push({
            x: player.x + sX * 4,
            y: player.y - 10,
            vx: sX * 1.2,
            vy: laserSpeed + 1,
            dmg: dmg * 0.65,
            size: 3,
            length: 12,
            color: '#a78bfa' // purple plasma look
          });
        });
      }
    }
  }

  // Orbit Companion / Turret behavior
  function updateDrones(now) {
    if (!abilities.turret.active) return;

    if (now > drones[0]?.expireTime) {
      abilities.turret.active = false;
      drones.length = 0;
      spawnDamageText("DRONES OFFLINE", player.x, player.y - 20, '#64748b');
      return;
    }

    drones.forEach(drone => {
      // Rotate drone in orbit circle around player
      drone.angleOffset += drone.speed;
      drone.x = player.x + Math.cos(drone.angleOffset) * drone.radius;
      drone.y = player.y + Math.sin(drone.angleOffset) * drone.radius;

      // Shoot nearest enemy
      if (now - drone.lastFired >= drone.fireInterval && enemies.length > 0) {
        drone.lastFired = now;
        
        // Find closest target
        let closest = null;
        let minDist = 99999;
        enemies.forEach(e => {
          const d = Math.hypot(e.x - drone.x, e.y - drone.y);
          if (d < minDist) {
            minDist = d;
            closest = e;
          }
        });

        if (closest && minDist < 350) {
          const angle = Math.atan2(closest.y - drone.y, closest.x - drone.x);
          bullets.push({
            x: drone.x,
            y: drone.y,
            vx: Math.cos(angle) * 10,
            vy: Math.sin(angle) * 10,
            dmg: 0.6,
            size: 2,
            color: '#38bdf8'
          });
          sounds.playLaser();
        }
      }
    });
  }

  // ==========================================
  // ⚙️ CORE GAME LOOP & PHYSICS UPDATE
  // ==========================================
  function update(delta) {
    time += delta;
    const now = Date.now();

    // Recover Screen shake drift
    if (screenShakeAmount > 0) {
      screenShakeAmount -= 0.35;
      if (screenShakeAmount < 0) screenShakeAmount = 0;
    }

    // 1. Move Background Parallax Stars, Nebulae, and Planets
    stars.forEach(star => {
      star.y += star.speed * delta;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
    });

    backgroundObjects.forEach(obj => {
      obj.y += obj.speed * delta;
      if (obj.y > canvas.height + obj.size) {
        obj.y = -obj.size;
        obj.x = Math.random() * canvas.width;
      }
    });

    // Decay damage screen flash
    if (screenFlashAlpha > 0) {
      screenFlashAlpha -= 0.02 * delta;
      if (screenFlashAlpha < 0) screenFlashAlpha = 0;
    }

    if (player.hull <= 0 || planetHealth <= 0) {
      triggerEndGame();
      return;
    }

    // 2. Cooldown timer durations updates inside abilities objects
    // Handles Burst Overdrive expiration
    if (abilities.overdrive.active && now - abilities.overdrive.triggerTime >= abilities.overdrive.duration) {
      abilities.overdrive.active = false;
      player.fireInterval = 220; // restore default fire rate
      spawnDamageText("OVERDRIVE OVER", player.x, player.y - 20, '#64748b');
    }

    // 3. Move Player Spaceship via keyboard WASD
    let moveX = 0;
    let moveY = 0;

    if (keys['w'] || keys['arrowup']) moveY = -1;
    if (keys['s'] || keys['arrowdown']) moveY = 1;
    if (keys['a'] || keys['arrowleft']) moveX = -1;
    if (keys['d'] || keys['arrowright']) moveX = 1;

    // Normalise movement vector
    if (moveX !== 0 && moveY !== 0) {
      const len = Math.hypot(moveX, moveY);
      moveX /= len;
      moveY /= len;
    }

    // Apply speed and position limits for keyboard
    if (!touchActive) {
      player.x += moveX * player.speed;
      player.y += moveY * player.speed;
    }

    player.x = Math.max(player.width / 2, Math.min(canvas.width - player.width / 2, player.x));
    player.y = Math.max(85 + player.height / 2, Math.min(canvas.height - 85 - player.height / 2, player.y));

    // Shield passive regeneration
    if (player.shield < player.maxShield && now - player.lastHit > 3000) {
      player.shield = Math.min(player.maxShield, player.shield + player.shieldRegenRate);
    }

    // Fire Player Weapons automatically!
    playerFire(now);

    // Orbit side drones updating
    updateDrones(now);

    // 4. Update Damage Floating Texts
    for (let i = damageTexts.length - 1; i >= 0; i--) {
      const dt = damageTexts[i];
      dt.y += dt.vy;
      dt.alpha -= 0.015;
      if (dt.alpha <= 0) {
        damageTexts.splice(i, 1);
      }
    }

    // 5. Update Wave progression timers
    if (waveSplashTimer > 0) {
      waveSplashTimer -= delta;
      if (waveSplashTimer < 0) waveSplashTimer = 0;
    }

    if (waveState === 'countdown') {
      waveTimer -= delta;
      if (waveTimer <= 0) {
        waveState = 'active';
        waveSplashTimer = 90; // 1.5 seconds splash alert
        const alertLabel = document.getElementById('hud-alert');
        if (alertLabel) alertLabel.style.opacity = '0';
        enemySpawnTimer = Math.max(45, 140 - wave * 8); // Trigger immediate spawn!
      }
    } else if (waveState === 'active') {
      // Spawn enemies periodically
      enemySpawnTimer += delta;
      const spawnRate = Math.max(45, 140 - wave * 8); // spawns speed up on waves
      
      if (enemySpawnTimer >= spawnRate && spawnedCountThisWave < currentEnemiesCountToSpawn) {
        enemySpawnTimer = 0;
        spawnEnemy();
      }

      // Check if wave is completely conquered
      if (spawnedCountThisWave >= currentEnemiesCountToSpawn && enemies.length === 0) {
        waveState = 'cleared';
        waveTimer = 60; // 1 second before next wave countdown (snappier inter-wave transition!)
      }
    } else if (waveState === 'cleared') {
      waveTimer -= delta;
      if (waveTimer <= 0) {
        wave++;
        // Give bonuses on clearing wave
        const awardCredits = 15 + wave * 5;
        const awardGems = Math.random() > 0.6 ? 1 : 0;
        playerStats.credits += awardCredits;
        playerStats.gems += awardGems;
        creditsEarnedInRun += awardCredits;

        spawnDamageText(`WAVE CLEAR! +${awardCredits} CR`, player.x, player.y - 40, '#facc15');
        if (awardGems > 0) {
          spawnDamageText(`+${awardGems} GEM FOUND`, player.x, player.y - 60, '#c084fc');
        }

        saveProgress();
        advanceWave();
      }
    }

    // 6. Update Player Laser Bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      b.x += b.vx;
      b.y += b.vy;

      // Delete if flies off-screen
      if (b.y < -20 || b.y > canvas.height + 20 || b.x < -20 || b.x > canvas.width + 20) {
        bullets.splice(i, 1);
      }
    }

    // 7. Update Enemy Laser Bullets
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      const eb = enemyBullets[i];
      
      // Homing missile behavior
      if (eb.isMissile) {
        const dx = player.x - eb.x;
        const dy = player.y - eb.y;
        const angle = Math.atan2(dy, dx);
        eb.vx = Math.cos(angle) * 3.5;
        eb.vy = Math.sin(angle) * 3.5;
      }

      eb.x += eb.vx;
      eb.y += eb.vy;

      // Collision check with player
      const dist = Math.hypot(eb.x - player.x, eb.y - player.y);
      if (dist < eb.size + player.width / 2 - 2) {
        enemyBullets.splice(i, 1);
        damagePlayer(eb.isMissile ? 25 : 12);
        continue;
      }

      // Collision with Planet at bottom of screen
      if (eb.y >= canvas.height - 10) {
        enemyBullets.splice(i, 1);
        damagePlanet(eb.isMissile ? 15 : 6);
        continue;
      }

      if (eb.y > canvas.height + 20 || eb.x < -20 || eb.x > canvas.width + 20) {
        enemyBullets.splice(i, 1);
      }
    }

    // 8. Update Enemies (Asteroids, Scouts, Bugs)
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];

      if (enemy.isBoss) {
        // Boss moves down slowly, then horizontally
        enemy.y += enemy.vy;
        if (enemy.y >= 100) {
          enemy.vy = 0;
          enemy.x += enemy.vx;
          if (enemy.x > canvas.width - enemy.width / 2 || enemy.x < enemy.width / 2) {
            enemy.vx *= -1;
          }
        }
      } else {
        // Normal unit movement
        if (enemy.type === 'bug') {
          // Zigzag horizontal sin waves
          enemy.x += Math.sin(time * 0.15) * 3.0;
        } else {
          enemy.x += enemy.vx;
        }
        enemy.y += enemy.vy;
        
        // Spin asteroids
        if (enemy.type === 'asteroid') {
          enemy.angle += enemy.spin;
        }
      }

      // Enemy fire triggers
      enemyAttack(enemy, now);

      // Check collision: Enemy crashing into Player
      const pRadius = player.width / 2;
      const enemyRadius = enemy.isBoss ? 40 : enemy.size;
      const shipCrashDist = Math.hypot(enemy.x - player.x, enemy.y - player.y);
      
      if (shipCrashDist < enemyRadius + pRadius) {
        // Destroy non-boss enemy instantly on crash
        if (!enemy.isBoss) {
          spawnParticleBurst(enemy.x, enemy.y, getEnemyColor(enemy.type), 15);
          enemies.splice(i, 1);
          enemiesDefeatedCount++;
          sounds.playExplosion();
        }
        
        damagePlayer(enemy.isBoss ? 45 : Math.floor(enemyRadius * 1.2));
        continue;
      }

      // Check collision: Enemy reaches bottom (Crashes into planet)
      const planetBoundary = canvas.height - 25;
      if (enemy.y >= planetBoundary + (enemy.isBoss ? 20 : enemy.size)) {
        enemies.splice(i, 1);
        damagePlanet(enemy.isBoss ? 60 : Math.floor(enemy.size * 1.3));
        continue;
      }

      // Check collision: Player Laser hitting Enemy
      for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j];
        
        // Check intersection bounds
        let hit = false;
        if (enemy.isBoss) {
          hit = (
            b.x > enemy.x - enemy.width / 2 &&
            b.x < enemy.x + enemy.width / 2 &&
            b.y > enemy.y - enemy.height / 2 &&
            b.y < enemy.y + enemy.height / 2
          );
        } else {
          hit = Math.hypot(b.x - enemy.x, b.y - enemy.y) < enemy.size + b.size;
        }

        if (hit) {
          bullets.splice(j, 1);
          enemy.hp -= b.dmg;

          // Hit feedback sparks
          spawnParticleBurst(b.x, b.y, b.color, 4);

          if (enemy.hp <= 0) {
            // Kill enemy
            spawnParticleBurst(enemy.x, enemy.y, getEnemyColor(enemy.type), enemy.isBoss ? 60 : 20);
            
            // Drop credits/gems loot
            spawnLoot(enemy.x, enemy.y, enemy);

            score += enemy.points;
            enemiesDefeatedCount++;
            sounds.playExplosion();

            // Floating score popup!
            const popupColor = enemy.isBoss ? '#facc15' : (enemy.type === 'elite' ? '#fbbf24' : '#38bdf8');
            spawnDamageText(`+${enemy.points}`, enemy.x, enemy.y - 10, popupColor);

            // High Score beaten popup!
            if (playerStats.highScore > 0 && score > playerStats.highScore && !highScoreBeatenTextSpawned) {
              highScoreBeatenTextSpawned = true;
              spawnDamageText("★ NEW HIGH SCORE ★", player.x, player.y - 30, '#facc15');
            }

            enemies.splice(i, 1);
            break;
          }
        }
      }
    }

    // 9. Update Loot Drops (Credits and Gems) and Magnet attraction
    for (let i = lootItems.length - 1; i >= 0; i--) {
      const item = lootItems[i];

      // Gravity / Drift downwards
      if (!item.magnetState) {
        item.y += 1.4;
        item.x += item.vx;
        item.vx *= 0.96; // decelerate lateral bounce
      }

      // Magnet attraction bounds (160px attraction circle)
      const distToPlayer = Math.hypot(item.x - player.x, item.y - player.y);
      if (distToPlayer < 160) {
        item.magnetState = true;
        // Fly directly towards player
        const angle = Math.atan2(player.y - item.y, player.x - item.x);
        item.x += Math.cos(angle) * 7.5;
        item.y += Math.sin(angle) * 7.5;
      }

      // Collect item boundaries
      if (distToPlayer < item.radius + player.width / 2) {
        lootItems.splice(i, 1);
        sounds.playPowerUp();

        if (item.type === 'credit') {
          playerStats.credits += item.value;
          creditsEarnedInRun += item.value;
          spawnDamageText("+1 CR", item.x, item.y, '#facc15');
        } else if (item.type === 'gem') {
          playerStats.gems += item.value;
          spawnDamageText("+1 GEM", item.x, item.y, '#c084fc');
        } else if (item.type === 'heal') {
          player.hull = Math.min(player.maxHull, player.hull + player.maxHull * 0.3);
          spawnDamageText("+30% REPAIR", item.x, item.y, '#10b981');
          spawnParticleBurst(player.x, player.y, '#10b981', 12);
        } else if (item.type === 'shield') {
          player.shield = Math.min(player.maxShield, player.shield + player.maxShield * 0.5);
          spawnDamageText("+50% SHIELD", item.x, item.y, '#06b6d4');
          spawnParticleBurst(player.x, player.y, '#06b6d4', 12);
        } else if (item.type === 'rapid') {
          player.rapidFireUntil = Date.now() + 6000;
          spawnDamageText("RAPID FIRE!", item.x, item.y, '#f59e0b');
          spawnParticleBurst(player.x, player.y, '#f59e0b', 12);
        } else if (item.type === 'double') {
          player.doubleShotUntil = Date.now() + 8000;
          spawnDamageText("DOUBLE SHOT!", item.x, item.y, '#a78bfa');
          spawnParticleBurst(player.x, player.y, '#a78bfa', 12);
        }

        saveProgress();
        updateHUDStats();
        continue;
      }

      // Drop off offscreen
      if (item.y > canvas.height + 20) {
        lootItems.splice(i, 1);
      }
    }

    // 10. Update Particles explosion dynamics
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      if (p.alpha <= 0) {
        particles.splice(i, 1);
      }
    }

    // Continuous UI updates
    updateHUDStats();
  }

  function getEnemyColor(type) {
    if (type === 'bug') return '#10b981'; // Green kamikaze bug sparks
    if (type === 'scout') return '#ec4899'; // Purple plasma scout
    if (type === 'swarmer') return '#f97316'; // Orange swarmer sparks
    if (type === 'elite') return '#fbbf24'; // Yellow-gold elite sparks
    return '#64748b'; // Gray slate asteroid dust
  }

  // Handle taking damage for the Spaceship
  function damagePlayer(dmg) {
    // Set hit flashes
    screenFlashAlpha = 0.55; // bright translucent red
    player.flashUntil = Date.now() + 150; // solid white flash for 150ms

    if (player.shield > 0) {
      player.shield -= dmg;
      sounds.playShieldHit();
      spawnParticleBurst(player.x, player.y, '#22d3ee', 8);
      if (player.shield < 0) {
        player.hull += player.shield; // Overflow to hull
        player.shield = 0;
      }
    } else {
      player.hull -= dmg;
      sounds.playHurt();
      spawnParticleBurst(player.x, player.y, '#ef4444', 12);
      triggerScreenShake(4);
    }
    player.lastHit = Date.now();
    updateHUDStats();
  }

  // Handle taking damage for home base Planet
  function damagePlanet(dmg) {
    planetHealth = Math.max(0, planetHealth - dmg);
    sounds.playHurt();
    triggerScreenShake(8);
    spawnParticleBurst(canvas.width / 2, canvas.height - 15, '#e11d48', 25);
    updateHUDStats();
  }

  // ==========================================
  // 🎨 CANVAS RENDERING LAYER
  // ==========================================
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dynamic camera screen shake
    ctx.save();
    if (screenShakeAmount > 0) {
      const dx = (Math.random() - 0.5) * screenShakeAmount;
      const dy = (Math.random() - 0.5) * screenShakeAmount;
      ctx.translate(dx, dy);
    }

    // 1. Draw Starfield
    stars.forEach(star => {
      ctx.fillStyle = star.color;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    });

    // Draw Background Nebulae and Planets
    backgroundObjects.forEach(obj => {
      if (obj.type === 'nebula') {
        ctx.drawImage(nebulaCanvas, obj.x - obj.size, obj.y - obj.size, obj.size * 2, obj.size * 2);
      } else if (obj.type === 'planet') {
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.size, 0, Math.PI * 2);
        ctx.fillStyle = obj.color;
        ctx.fill();
        // Draw subtle craters
        ctx.beginPath();
        ctx.arc(obj.x - obj.size * 0.3, obj.y - obj.size * 0.1, obj.size * 0.15, 0, Math.PI * 2);
        ctx.arc(obj.x + obj.size * 0.2, obj.y + obj.size * 0.3, obj.size * 0.12, 0, Math.PI * 2);
        ctx.arc(obj.x + obj.size * 0.1, obj.y - obj.size * 0.4, obj.size * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = obj.craterColor;
        ctx.fill();
      }
    });

    // 2. Draw Planet Defense Base (Arc dome at screen bottom)
    const planetY = canvas.height + 250;
    const planetRadius = 300;
    
    // Draw atmosphere glow layers
    const atmosphereGlow = ctx.createRadialGradient(
      canvas.width / 2, planetY, planetRadius - 60,
      canvas.width / 2, planetY, planetRadius + 30
    );
    atmosphereGlow.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
    atmosphereGlow.addColorStop(0.5, 'rgba(6, 182, 212, 0.15)');
    atmosphereGlow.addColorStop(1, 'rgba(5, 5, 13, 0)');

    ctx.beginPath();
    ctx.arc(canvas.width / 2, planetY, planetRadius + 30, Math.PI, 0);
    ctx.fillStyle = atmosphereGlow;
    ctx.fill();

    // Planet Crust Arc
    ctx.beginPath();
    ctx.arc(canvas.width / 2, planetY, planetRadius, Math.PI, 0);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#061c16';
    ctx.fill();
    ctx.stroke();

    // Draw grid rings representing Shield Grid on Earth
    ctx.beginPath();
    ctx.arc(canvas.width / 2, planetY, planetRadius - 15, Math.PI, 0);
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 3. Draw Loot Drops (Gold coins, Gems, and Powerups)
    lootItems.forEach(item => {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.beginPath();
      
      if (item.type === 'credit') {
        // Gold Coin
        ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (item.type === 'gem') {
        // Purple gem diamond shape
        ctx.moveTo(0, -item.radius);
        ctx.lineTo(item.radius * 0.8, 0);
        ctx.lineTo(0, item.radius);
        ctx.lineTo(-item.radius * 0.8, 0);
        ctx.closePath();
        ctx.fillStyle = '#c084fc';
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 10;
        ctx.fill();
      } else if (item.type === 'heal') {
        // Green Repair Kit Sphere
        ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.shadowColor = '#059669';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        // Draw white '+' sign
        ctx.beginPath();
        ctx.moveTo(-4, 0); ctx.lineTo(4, 0);
        ctx.moveTo(0, -4); ctx.lineTo(0, 4);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (item.type === 'shield') {
        // Cyan Shield bubble
        ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#06b6d4';
        ctx.shadowColor = '#0891b2';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        // Draw chevron
        ctx.beginPath();
        ctx.moveTo(-3, -2); ctx.lineTo(3, -2); ctx.lineTo(0, 3);
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      } else if (item.type === 'rapid') {
        // Orange Speed Bolt
        ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#f97316';
        ctx.shadowColor = '#ea580c';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        // Draw small lightning bolt
        ctx.beginPath();
        ctx.moveTo(1, -5); ctx.lineTo(-3, 0); ctx.lineTo(1, 0); ctx.lineTo(-1, 5);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else if (item.type === 'double') {
        // Purple double guns circle
        ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#a78bfa';
        ctx.shadowColor = '#7c3aed';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        // Draw double lines
        ctx.beginPath();
        ctx.moveTo(-2, -4); ctx.lineTo(-2, 4);
        ctx.moveTo(2, -4); ctx.lineTo(2, 4);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.restore();
    });

    // 4. Draw Player Spaceship
    if (player.hull > 0) {
      ctx.save();
      ctx.translate(player.x, player.y);

      // Flickering Engine flame flare
      player.engineFlareTimer += 0.2;
      const flameHeight = 12 + Math.sin(player.engineFlareTimer) * 4;
      ctx.beginPath();
      ctx.moveTo(-6, player.height / 2 - 2);
      ctx.lineTo(0, player.height / 2 - 2 + flameHeight);
      ctx.lineTo(6, player.height / 2 - 2);
      ctx.closePath();
      
      // Use pink thruster visual on burst overdrive state
      ctx.fillStyle = abilities.overdrive.active ? '#f43f5e' : '#f97316';
      ctx.shadowColor = abilities.overdrive.active ? '#ec4899' : '#ea580c';
      ctx.shadowBlur = 12;
      ctx.fill();

      // Draw companion Turrets if spell active
      if (abilities.turret.active) {
        drones.forEach(drone => {
          ctx.save();
          ctx.translate(Math.cos(drone.angleOffset) * drone.radius, Math.sin(drone.angleOffset) * drone.radius);
          
          // Draw small drone triangle
          ctx.beginPath();
          ctx.moveTo(0, -6);
          ctx.lineTo(5, 5);
          ctx.lineTo(-5, 5);
          ctx.closePath();
          ctx.fillStyle = '#38bdf8';
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#0284c7';
          ctx.fill();
          ctx.restore();
        });
      } else if (playerStats.equippedShip === 'crusader') {
        // Crusader cruiser gets a small passive permanent companion drone!
        ctx.save();
        const passiveAngle = (time * 0.03);
        ctx.translate(Math.cos(passiveAngle) * 40, Math.sin(passiveAngle) * 40);
        ctx.beginPath();
        ctx.arc(0, 0, 3.5, 0, Math.PI*2);
        ctx.fillStyle = '#eab308';
        ctx.fill();
        ctx.restore();
      }

      // Pilot Starship Vector Drawing
      const isFlashing = player.flashUntil && Date.now() < player.flashUntil;
      ctx.beginPath();
      // Nose
      ctx.moveTo(0, -player.height / 2);
      // Right wing flare
      ctx.lineTo(player.width / 2, player.height / 2);
      // Center hull notch
      ctx.lineTo(0, player.height / 3);
      // Left wing flare
      ctx.lineTo(-player.width / 2, player.height / 2);
      ctx.closePath();

      ctx.fillStyle = isFlashing ? '#ffffff' : '#0f172a';
      ctx.fill();
      ctx.strokeStyle = isFlashing ? '#ffffff' : player.color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = isFlashing ? '#ffffff' : player.color;
      ctx.shadowBlur = isFlashing ? 15 : 10;
      ctx.stroke();

      // Cockpit window bubble
      ctx.beginPath();
      ctx.arc(0, -player.height / 6, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Active circular energy shield border overlay
      if (player.shield > 0) {
        ctx.beginPath();
        ctx.arc(0, 0, player.width / 2 + 10, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(34, 211, 238, ${Math.min(1.0, player.shield / player.maxShield * 0.6)})`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 8;
        ctx.stroke();
      }

      // Draw auto-locking reticle indicators on the nearest target
      if (enemies.length > 0) {
        // Identify closest unit
        let closest = null;
        let minDist = 99999;
        enemies.forEach(e => {
          const d = Math.hypot(e.x - player.x, e.y - player.y);
          if (d < minDist) {
            minDist = d;
            closest = e;
          }
        });

        if (closest && minDist < 400) {
          // Draw locking brackets on closest target
          ctx.restore(); // Exit player local coordinate space temporarily
          ctx.save();
          ctx.translate(closest.x, closest.y);
          
          ctx.beginPath();
          ctx.arc(0, 0, (closest.isBoss ? 45 : closest.size) + 8, time * 0.05, time * 0.05 + 1.2);
          ctx.strokeStyle = 'rgba(6,182,212,0.5)';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, 0, (closest.isBoss ? 45 : closest.size) + 8, time * 0.05 + Math.PI, time * 0.05 + 1.2 + Math.PI);
          ctx.strokeStyle = 'rgba(6,182,212,0.5)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      ctx.restore();
    }

    // 5. Draw Laser Bullets
    bullets.forEach(b => {
      ctx.save();
      ctx.beginPath();
      const length = b.length || 12;
      ctx.moveTo(b.x, b.y - length / 2);
      ctx.lineTo(b.x, b.y + length / 2);
      ctx.strokeStyle = b.color;
      ctx.lineWidth = b.size * 2;
      ctx.lineCap = 'round';
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();
    });

    // 6. Draw Enemies (Asteroids, Scouts, Bugs, Boss)
    enemies.forEach(enemy => {
      ctx.save();
      ctx.translate(enemy.x, enemy.y);

      if (enemy.isBoss) {
        // Draw heavy Boss ship
        ctx.beginPath();
        // Nose side wings
        ctx.moveTo(0, 25);
        ctx.lineTo(enemy.width / 2, -15);
        ctx.lineTo(enemy.width / 3, -30);
        ctx.lineTo(-enemy.width / 3, -30);
        ctx.lineTo(-enemy.width / 2, -15);
        ctx.closePath();

        ctx.fillStyle = '#111827';
        ctx.fill();
        ctx.strokeStyle = enemy.color;
        ctx.lineWidth = 3;
        ctx.shadowColor = '#ff0055';
        ctx.shadowBlur = 14;
        ctx.stroke();

        // Glowing core crystal
        ctx.beginPath();
        ctx.arc(0, -5, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ff3366';
        ctx.fill();

        // Boss health bar above
        ctx.restore(); // exit space
        ctx.save();
        const hbW = 100;
        const pct = enemy.hp / enemy.maxHp;
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(enemy.x - hbW / 2, enemy.y - 45, hbW, 4);
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(enemy.x - hbW / 2, enemy.y - 45, hbW * pct, 4);
      } else {
        if (enemy.type === 'asteroid') {
          // Draw spinning asteroid vector
          ctx.rotate(enemy.angle);
          ctx.beginPath();
          // Draw rough rocky vectors
          const pts = 8;
          for (let p = 0; p < pts; p++) {
            const a = (Math.PI * 2 / pts) * p;
            const rOffset = p % 2 === 0 ? 0.8 : 1.1;
            const px = Math.cos(a) * enemy.size * rOffset;
            const py = Math.sin(a) * enemy.size * rOffset;
            if (p === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fillStyle = '#0f172a';
          ctx.fill();
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (enemy.type === 'scout') {
          // Sleek neon space vector
          ctx.beginPath();
          ctx.moveTo(0, enemy.size);
          ctx.lineTo(enemy.size, -enemy.size);
          ctx.lineTo(0, -enemy.size / 2);
          ctx.lineTo(-enemy.size, -enemy.size);
          ctx.closePath();
          ctx.fillStyle = '#1e1b4b';
          ctx.fill();
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#d946ef';
          ctx.shadowBlur = 8;
          ctx.stroke();
        } else if (enemy.type === 'bug') {
          // Bio insectoid ship
          ctx.beginPath();
          ctx.moveTo(0, enemy.size);
          ctx.lineTo(enemy.size * 0.7, 0);
          ctx.lineTo(enemy.size * 0.3, -enemy.size);
          ctx.lineTo(-enemy.size * 0.3, -enemy.size);
          ctx.lineTo(-enemy.size * 0.7, 0);
          ctx.closePath();
          ctx.fillStyle = '#064e3b';
          ctx.fill();
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#059669';
          ctx.shadowBlur = 8;
          ctx.stroke();
        } else if (enemy.type === 'swarmer') {
          // Sharp neon-orange triangular interceptor
          ctx.beginPath();
          ctx.moveTo(0, enemy.size * 1.2);
          ctx.lineTo(enemy.size * 0.8, -enemy.size * 0.8);
          ctx.lineTo(0, -enemy.size * 0.3);
          ctx.lineTo(-enemy.size * 0.8, -enemy.size * 0.8);
          ctx.closePath();
          ctx.fillStyle = '#1e110b';
          ctx.fill();
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 1.8;
          ctx.shadowColor = '#ea580c';
          ctx.shadowBlur = 8;
          ctx.stroke();
        } else if (enemy.type === 'elite') {
          // Heavy cruiser with golden wing shields
          ctx.beginPath();
          ctx.moveTo(0, enemy.size * 1.3);
          ctx.lineTo(enemy.size * 1.2, enemy.size * 0.2);
          ctx.lineTo(enemy.size * 0.8, -enemy.size * 1.1);
          ctx.lineTo(-enemy.size * 0.8, -enemy.size * 1.1);
          ctx.lineTo(-enemy.size * 1.2, enemy.size * 0.2);
          ctx.closePath();
          ctx.fillStyle = '#0f172a';
          ctx.fill();
          ctx.strokeStyle = '#fbbf24'; // Golden amber
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#d97706';
          ctx.shadowBlur = 12;
          ctx.stroke();

          // Central engine glow
          ctx.beginPath();
          ctx.arc(0, -enemy.size * 0.6, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#f97316';
          ctx.fill();
        }
      }
      ctx.restore();
    });

    // 7. Draw Enemy Laser Bullets
    enemyBullets.forEach(eb => {
      ctx.beginPath();
      ctx.arc(eb.x, eb.y, eb.size, 0, Math.PI * 2);
      ctx.fillStyle = eb.color;
      ctx.shadowColor = eb.color;
      ctx.shadowBlur = 8;
      ctx.fill();
    });

    // 8. Draw Explosions / Damage particles
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.restore();
    });

    // 9. Draw Damage/Loot floating text indicators
    damageTexts.forEach(dt => {
      ctx.save();
      ctx.globalAlpha = dt.alpha;
      ctx.fillStyle = dt.color;
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 3;
      ctx.shadowColor = '#000000';
      ctx.fillText(dt.text, dt.x, dt.y);
      ctx.restore();
    });

    // Fullscreen Red flash on damage hit
    if (screenFlashAlpha > 0) {
      ctx.save();
      ctx.fillStyle = `rgba(239, 68, 68, ${screenFlashAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    ctx.restore(); // exit camera translation

    // 10. Draw static on-screen active power-up HUD badges (ignores camera shake)
    let badgeY = 74;
    const now = Date.now();
    if (player.rapidFireUntil && now < player.rapidFireUntil) {
      const remaining = Math.ceil((player.rapidFireUntil - now) / 1000);
      ctx.save();
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#f97316';
      ctx.shadowColor = '#ea580c';
      ctx.shadowBlur = 8;
      ctx.fillText(`⚡ RAPID FIRE: ${remaining}s`, 16, badgeY);
      ctx.restore();
      badgeY += 18;
    }
    if (player.doubleShotUntil && now < player.doubleShotUntil) {
      const remaining = Math.ceil((player.doubleShotUntil - now) / 1000);
      ctx.save();
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#a78bfa';
      ctx.shadowColor = '#7c3aed';
      ctx.shadowBlur = 8;
      ctx.fillText(`🔫 DOUBLE SHOT: ${remaining}s`, 16, badgeY);
      ctx.restore();
      badgeY += 18;
    }
  }

  // ==========================================
  // 📈 HUD & SCREEN UPDATES
  // ==========================================
  function updateHUDStats() {
    document.getElementById('hud-score').innerText = score;
    document.getElementById('hud-wave').innerText = wave;
    document.getElementById('hud-credits').innerText = playerStats.credits;
    document.getElementById('hud-gems').innerText = playerStats.gems;
    document.getElementById('hud-high-score').innerText = playerStats.highScore;

    // Health ratios
    const pHealthPct = Math.max(0, (player.hull / player.maxHull) * 100);
    const pShieldPct = Math.max(0, (player.shield / player.maxShield) * 100);
    const planetHealthPct = Math.max(0, (planetHealth / planetMaxHealth) * 100);

    // Dynamic color coding for bars
    document.getElementById('planet-health-txt').innerText = Math.round(planetHealthPct) + "%";
    document.getElementById('planet-health-bar').style.width = planetHealthPct + "%";

    document.getElementById('ship-shield-txt').innerText = Math.round(pShieldPct) + "%";
    document.getElementById('ship-shield-bar').style.width = pShieldPct + "%";

    document.getElementById('ship-hull-txt').innerText = Math.round(pHealthPct) + "%";
    document.getElementById('ship-hull-bar').style.width = pHealthPct + "%";

    // Update center wave transition overlays
    const countdownEl = document.getElementById('wave-countdown-overlay');
    const startEl = document.getElementById('wave-start-overlay');
    if (countdownEl && startEl) {
      if (waveState === 'countdown') {
        countdownEl.classList.remove('hidden');
        countdownEl.classList.add('opacity-100');
        countdownEl.classList.remove('opacity-0');
        
        const titleEl = document.getElementById('wave-countdown-title');
        if (titleEl) titleEl.innerText = `WAVE ${wave} STARTS IN`;
        
        const secs = Math.max(1, Math.ceil(waveTimer / 60));
        const numEl = document.getElementById('wave-countdown-number');
        if (numEl && numEl.innerText !== String(secs)) {
          numEl.innerText = secs;
        }
        
        startEl.classList.add('hidden');
        startEl.classList.add('opacity-0');
        startEl.classList.remove('opacity-100');
      } else if (waveState === 'active' && waveSplashTimer > 0) {
        countdownEl.classList.add('hidden');
        countdownEl.classList.add('opacity-0');
        countdownEl.classList.remove('opacity-100');
        
        startEl.classList.remove('hidden');
        startEl.classList.add('opacity-100');
        startEl.classList.remove('opacity-0');
        
        const splashTitleEl = document.getElementById('wave-start-title');
        if (splashTitleEl) splashTitleEl.innerText = `WAVE ${wave}`;
      } else {
        countdownEl.classList.add('hidden');
        countdownEl.classList.add('opacity-0');
        countdownEl.classList.remove('opacity-100');
        
        startEl.classList.add('hidden');
        startEl.classList.add('opacity-0');
        startEl.classList.remove('opacity-100');
      }
    }

    // Abilities Cooldown overlay bars
    updateCooldownVisuals();
  }

  function updateCooldownVisuals() {
    const now = Date.now();

    // Med kit
    const medCD = abilities.med.cd - (playerStats.medLvl - 1) * 1500;
    const medElapsed = now - abilities.med.lastUsed;
    const medPct = Math.max(0, Math.min(100, 100 - (medElapsed / medCD * 100)));
    const overlayMed = document.getElementById('cooldown-med');
    overlayMed.style.height = medPct + "%";
    overlayMed.innerText = medPct > 0 ? Math.ceil((medCD - medElapsed) / 1000) : "";

    // Turret
    const turretElapsed = now - abilities.turret.lastUsed;
    const turretPct = Math.max(0, Math.min(100, 100 - (turretElapsed / abilities.turret.cd * 100)));
    const overlayTurret = document.getElementById('cooldown-turret');
    overlayTurret.style.height = turretPct + "%";
    overlayTurret.innerText = turretPct > 0 ? Math.ceil((abilities.turret.cd - turretElapsed) / 1000) : "";

    // Overdrive
    const odElapsed = now - abilities.overdrive.lastUsed;
    const odPct = Math.max(0, Math.min(100, 100 - (odElapsed / abilities.overdrive.cd * 100)));
    const overlayOD = document.getElementById('cooldown-overdrive');
    overlayOD.style.height = odPct + "%";
    overlayOD.innerText = odPct > 0 ? Math.ceil((abilities.overdrive.cd - odElapsed) / 1000) : "";
  }

  // ==========================================
  // 🛑 END RUN PROCESSORS
  // ==========================================
  function triggerEndGame() {
    isRunning = false;
    cancelAnimationFrame(animationFrameId);

    // Save Highscore
    if (score > playerStats.highScore) {
      playerStats.highScore = score;
      saveProgress();
    }

    // Set Game Over screen details
    document.getElementById('over-score').innerText = score;
    document.getElementById('over-high-score').innerText = playerStats.highScore;
    document.getElementById('over-wave').innerText = wave;
    document.getElementById('over-enemies').innerText = enemiesDefeatedCount;
    document.getElementById('over-credits').innerText = creditsEarnedInRun;

    sounds.playHurt();

    setTimeout(() => {
      showScreen('game-over-screen');
    }, 1200);
  }

  // Active game animation request loop
  function gameLoop(currentTime) {
    if (!isRunning) return;

    if (!isPaused) {
      const delta = lastTime ? (currentTime - lastTime) / 16.666 : 1;
      lastTime = currentTime;
      update(delta);
      draw();
    } else {
      // Keep background scrolling during pause
      lastTime = currentTime;
      draw();
    }

    animationFrameId = requestAnimationFrame(gameLoop);
  }

  return {
    start: function() {
      isRunning = true;
      isPaused = false;
      score = 0;
      wave = 1;
      enemiesDefeatedCount = 0;
      creditsEarnedInRun = 0;
      planetHealth = planetMaxHealth;
      highScoreBeatenTextSpawned = false;

      // Sync active player stats
      syncStats();

      // Reset Pools
      bullets.length = 0;
      enemyBullets.length = 0;
      enemies.length = 0;
      lootItems.length = 0;
      particles.length = 0;
      damageTexts.length = 0;
      drones.length = 0;

      player.hull = player.maxHull;
      player.shield = player.maxShield;

      // Position Player
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      // Trigger inputs and star fields
      initInput();
      advanceWave();

      // Start the core Loop
      lastTime = 0;
      animationFrameId = requestAnimationFrame(gameLoop);
    },

    pause: function() {
      isPaused = true;
    },

    resume: function() {
      isPaused = false;
      lastTime = 0;
    },

    destroy: function() {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      
      // Cleanup inputs
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);

      // Cleanup buttons to prevent click accumulation
      const btnMed = document.getElementById('btn-ability-med');
      const btnTurret = document.getElementById('btn-ability-turret');
      const btnOverdrive = document.getElementById('btn-ability-overdrive');
      if (btnMed) btnMed.removeEventListener('click', triggerMedKit);
      if (btnTurret) btnTurret.removeEventListener('click', triggerAutoTurret);
      if (btnOverdrive) btnOverdrive.removeEventListener('click', triggerOverdrive);
    },

    syncStats: syncStats
  };
}

// Global start
window.addEventListener('DOMContentLoaded', () => {
  initSplashScreen();
  initMenuSystem();
});
