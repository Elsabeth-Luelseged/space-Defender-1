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
    this.musicVolume = 0.5;
    this.sfxVolume = 0.6;
    this.difficulty = 'normal'; // 'easy', 'normal', 'hard'
    this.musicPaused = false;

    // Music scheduling & state
    this.musicIntervalId = null;
    this.musicStep = 0;
    this.currentTrackType = null; // 'calm', 'intense', 'boss'
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

  // Sequenced retro space background track loop
  startMusic(trackType) {
    this.init();
    if (!this.enabled) return;
    if (this.currentTrackType === trackType && this.musicIntervalId) return;
    this.stopMusic();

    this.currentTrackType = trackType;
    this.musicPaused = false;
    let bpm = 110;
    let scale = [130.81, 155.56, 196.00, 233.08]; // C3, Eb3, G3, Bb3 (C-Minor arpeggio)
    let pattern = [0, 1, 2, 3, 2, 1, 0, 3];

    if (trackType === 'intense') {
      bpm = 130;
      scale = [130.81, 146.83, 155.56, 196.00, 207.65, 233.08]; // C, D, Eb, G, Ab, Bb
      pattern = [0, 2, 3, 5, 4, 3, 2, 0, 2, 3, 5, 2, 4, 3, 0, 1];
    } else if (trackType === 'boss') {
      bpm = 145;
      scale = [73.42, 82.41, 87.31, 98.00, 110.00, 116.54]; // D2, E2, F2, G2, A2, Bb2 (dissonant dark boss metal)
      pattern = [0, 0, 2, 0, 3, 0, 4, 5, 4, 0, 3, 0, 2, 0, 1, 0];
    }

    const stepDuration = 60 / bpm / 2; // eighth notes
    this.musicStep = 0;

    this.musicIntervalId = setInterval(() => {
      if (this.ctx && this.ctx.state === 'suspended') return;
      this.playMusicNote(scale, pattern, stepDuration);
    }, stepDuration * 1000);
  }

  playMusicNote(scale, pattern, duration) {
    if (!this.enabled || this.musicVolume <= 0.01) return;
    this.init();

    const index = pattern[this.musicStep % pattern.length];
    const freq = scale[index];
    this.musicStep++;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = this.currentTrackType === 'boss' ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(this.currentTrackType === 'boss' ? 500 : 350, this.ctx.currentTime);

    const maxVol = this.currentTrackType === 'boss' ? 0.08 : 0.05;
    gain.gain.setValueAtTime(maxVol * this.musicVolume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration - 0.02);

    osc.start();
    osc.stop(this.ctx.currentTime + duration - 0.01);
  }

  stopMusic() {
    if (this.musicIntervalId) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
    this.currentTrackType = null;
    this.musicPaused = false;
  }

  pauseMusic() {
    if (this.musicIntervalId) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
      this.musicPaused = true;
    }
  }

  resumeMusic() {
    if (this.musicPaused && this.currentTrackType) {
      this.startMusic(this.currentTrackType);
      this.musicPaused = false;
    }
  }

  playUIHover() {
    if (!this.enabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.02 * this.sfxVolume, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      console.log(e);
    }
  }

  playUIClick() {
    if (!this.enabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.05 * this.sfxVolume, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.log(e);
    }
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

    gain.gain.setValueAtTime(0.12 * this.sfxVolume, this.ctx.currentTime);
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

    gain.gain.setValueAtTime(0.25 * this.sfxVolume, this.ctx.currentTime);
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

    gain.gain.setValueAtTime(0.15 * this.sfxVolume, this.ctx.currentTime);
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

    gain.gain.setValueAtTime(0.18 * this.sfxVolume, now);
    gain.gain.linearRampToValueAtTime(0.18 * this.sfxVolume, now + 0.24);
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

    gain.gain.setValueAtTime(0.2 * this.sfxVolume, this.ctx.currentTime);
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

    gain.gain.setValueAtTime(0.15 * this.sfxVolume, now);
    gain.gain.linearRampToValueAtTime(0.15 * this.sfxVolume, now + 0.36);
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

    gain.gain.setValueAtTime(0.12 * this.sfxVolume, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playWarning() {
    if (!this.enabled) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      // Pulse 1
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(330, now);
      osc1.frequency.linearRampToValueAtTime(220, now + 0.15);
      gain1.gain.setValueAtTime(0.25 * this.sfxVolume, now);
      gain1.gain.linearRampToValueAtTime(0.001, now + 0.15);
      osc1.start();
      osc1.stop(now + 0.15);

      // Pulse 2 (delayed slightly)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(330, now + 0.18);
      osc2.frequency.linearRampToValueAtTime(220, now + 0.33);
      gain2.gain.setValueAtTime(0.25 * this.sfxVolume, now + 0.18);
      gain2.gain.linearRampToValueAtTime(0.001, now + 0.33);
      osc2.start();
      osc2.stop(now + 0.33);
    } catch (e) {
      console.log(e);
    }
  }
}

const sounds = new SoundEffectsManager();

// Detect mobile device to disable heavy 2D canvas shadows and optimize rendering
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

// Masterclass Canvas shadow optimization for mobile devices (removes layout/fill lag)
if (isMobileDevice) {
  Object.defineProperty(CanvasRenderingContext2D.prototype, 'shadowBlur', {
    set: function() {},
    get: function() { return 0; }
  });
  Object.defineProperty(CanvasRenderingContext2D.prototype, 'shadowColor', {
    set: function() {},
    get: function() { return 'transparent'; }
  });
}

// ==========================================
// 📊 GLOBAL RPG PERSISTENT STATS
// ==========================================
let playerStats = {
  credits: 0,
  gems: 0,
  highScore: 0,

  // LEVEL PROGRESSION (STAGES: 1-10 EASY, 11-20 HARD, 21-30 EXPERT)
  highestUnlockedLevel: 1,
  currentLevel: 1,
  completedLevels: [],
  
  hullLvl: 1,      // Max lvl 5
  shieldLvl: 1,    // Max lvl 5
  weaponLvl: 1,    // Max lvl 5
  laserClass: 1,   // 1: Single, 2: Dual, 3: Triple, 4: Plasma Spread
  
  medLvl: 1,       // Max lvl 5
  turretLvl: 1,    // Max lvl 5

  // NEW UPGRADES
  speedLvl: 1,     // Max lvl 5
  fireRateLvl: 1,  // Max lvl 5
  critLvl: 1,      // Max lvl 5
  missileLvl: 0,   // Max lvl 5
  cooldownLvl: 1,  // Max lvl 5

  // AUDIO & DIFFICULTY SETTINGS
  musicVolume: 50,
  sfxVolume: 60,
  mute: false,
  difficulty: 'normal',
  fullscreen: false,
  screenShakeEnabled: true,
  particleQuality: 'high',
  mouseSensitivity: 13,
  reduceFlashing: false,
  uiScale: 100,
  
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
  crusaderUnlock: 400,               // credits

  // NEW UPGRADES
  speed: [50, 100, 180, 300],        // credits
  fireRate: [60, 110, 190, 310],     // credits
  crit: [70, 120, 200, 320],         // credits
  missile: [80, 140, 220, 350],      // credits
  cooldown: [50, 90, 150, 240]       // credits
};

// Load stats from localstorage if exists
function loadProgress() {
  const data = localStorage.getItem('space_defender_rpg_stats');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      playerStats = { ...playerStats, ...parsed };
      if (!playerStats.highestUnlockedLevel || playerStats.highestUnlockedLevel < 1) {
        playerStats.highestUnlockedLevel = 1;
      }
      if (!playerStats.currentLevel || playerStats.currentLevel < 1) {
        playerStats.currentLevel = 1;
      }
      if (!Array.isArray(playerStats.completedLevels)) {
        playerStats.completedLevels = [];
      }
    } catch (e) {
      console.error("Failed to parse loaded progress", e);
    }
  }
  updateMainUI();
}

function saveProgress() {
  localStorage.setItem('space_defender_rpg_stats', JSON.stringify(playerStats));
  updateMainUI();
}

function updateMainUI() {
  const highest = playerStats.highestUnlockedLevel || 1;
  const tagEl = document.getElementById('continue-lvl-tag');
  if (tagEl) {
    tagEl.innerText = `LVL ${highest}`;
  }

  const btnContinue = document.getElementById('btn-continue-game');
  if (btnContinue) {
    if (highest > 1) {
      btnContinue.classList.remove('opacity-60');
      btnContinue.disabled = false;
    } else {
      btnContinue.classList.add('opacity-60');
    }
  }
}

// Render 30 Levels Grid for Easy (1-10), Hard (11-20), Expert (21-30)
function renderLevelSelectGrid() {
  const easyGrid = document.getElementById('grid-stage-easy');
  const hardGrid = document.getElementById('grid-stage-hard');
  const expertGrid = document.getElementById('grid-stage-expert');

  if (!easyGrid || !hardGrid || !expertGrid) return;

  easyGrid.innerHTML = '';
  hardGrid.innerHTML = '';
  expertGrid.innerHTML = '';

  const highest = playerStats.highestUnlockedLevel || 1;
  const completed = playerStats.completedLevels || [];

  // Stage Lock Banners
  const hardLockMsg = document.getElementById('hard-stage-lock-msg');
  if (hardLockMsg) {
    if (highest >= 11) {
      hardLockMsg.innerText = "UNLOCKED";
      hardLockMsg.className = "text-[9px] text-emerald-400 font-bold";
    } else {
      hardLockMsg.innerText = "REQUIRES LEVEL 10 CLEAR";
      hardLockMsg.className = "text-[9px] text-slate-400 font-semibold";
    }
  }

  const expertLockMsg = document.getElementById('expert-stage-lock-msg');
  if (expertLockMsg) {
    if (highest >= 21) {
      expertLockMsg.innerText = "UNLOCKED";
      expertLockMsg.className = "text-[9px] text-emerald-400 font-bold";
    } else {
      expertLockMsg.innerText = "REQUIRES LEVEL 20 CLEAR";
      expertLockMsg.className = "text-[9px] text-slate-400 font-semibold";
    }
  }

  for (let i = 1; i <= 30; i++) {
    const isUnlocked = i <= highest;
    const isDone = completed.includes(i);
    const isBoss = (i === 10 || i === 20 || i === 30);

    const btn = document.createElement('button');
    btn.type = 'button';

    let badgeIcon = isDone ? '✅' : (isBoss ? '👑' : (isUnlocked ? '▶' : '🔒'));
    let subtext = isDone ? 'CLEARED' : (isBoss ? 'BOSS' : (isUnlocked ? 'READY' : 'LOCKED'));

    if (isUnlocked) {
      btn.className = "p-2.5 rounded-xl border font-mono transition transform active:scale-95 cursor-pointer flex flex-col items-center justify-center space-y-0.5 " +
        (isBoss ? "bg-amber-950/30 border-amber-500/50 text-amber-300 hover:bg-amber-900/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]" : "bg-slate-900 border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/50 hover:border-cyan-400");
    } else {
      btn.disabled = true;
      btn.className = "p-2.5 rounded-xl border border-slate-900 bg-slate-950/50 text-slate-600 font-mono cursor-not-allowed opacity-50 flex flex-col items-center justify-center space-y-0.5";
    }

    btn.innerHTML = `
      <span class="text-xs font-extrabold flex items-center space-x-1">
        <span>LVL ${i}</span>
        <span>${badgeIcon}</span>
      </span>
      <span class="text-[8px] tracking-wider uppercase font-bold opacity-80">${subtext}</span>
    `;

    if (isUnlocked) {
      btn.addEventListener('mouseenter', () => {
        sounds.playUIHover();
      });

      btn.addEventListener('click', () => {
        sounds.playUIClick();
        playerStats.currentLevel = i;
        saveProgress();
        
        const modalSelect = document.getElementById('level-select-modal');
        if (modalSelect) modalSelect.classList.add('hidden');
        
        sounds.init();
        showScreen('gameplay-container');
        if (currentGameInstance) {
          currentGameInstance.destroy();
        }
        currentGameInstance = createGame(i);
        currentGameInstance.start();
      });
    }

    if (i <= 10) easyGrid.appendChild(btn);
    else if (i <= 20) hardGrid.appendChild(btn);
    else expertGrid.appendChild(btn);
  }
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
  const btnMainSettings = document.getElementById('btn-main-settings');
  const btnHow = document.getElementById('btn-how-to-play');
  const modalHow = document.getElementById('instructions-modal');

  // Pause elements
  const btnPause = document.getElementById('btn-pause-game');
  const pauseModal = document.getElementById('pause-modal');
  const btnPauseResume = document.getElementById('btn-pause-resume');
  const btnPauseRestart = document.getElementById('btn-pause-restart');
  const btnPauseShop = document.getElementById('btn-pause-shop');
  const btnPauseSettings = document.getElementById('btn-pause-settings');
  const btnPauseMenu = document.getElementById('btn-pause-menu');

  // Upgrades overlay buttons
  const btnResumeFromShop = document.getElementById('btn-resume-game');
  const btnExitFromShop = document.getElementById('btn-exit-to-menu');

  // Game over elements
  const btnRestart = document.getElementById('btn-restart-game');
  const btnMenuFromOver = document.getElementById('btn-menu-from-over');

  // Settings Modal elements
  const settingsModal = document.getElementById('settings-modal');
  const btnCloseSettings = document.getElementById('btn-close-settings');
  const btnSaveSettings = document.getElementById('btn-save-settings');
  const sliderMusic = document.getElementById('slider-music-volume');
  const sliderSfx = document.getElementById('slider-sfx-volume');
  const valMusic = document.getElementById('val-music-volume');
  const valSfx = document.getElementById('val-sfx-volume');
  const toggleFullscreenBox = document.getElementById('toggle-fullscreen');

  const btnDiffEasy = document.getElementById('btn-diff-easy');
  const btnDiffNormal = document.getElementById('btn-diff-normal');
  const btnDiffHard = document.getElementById('btn-diff-hard');

  // New accessibility / optimization settings elements
  const toggleMute = document.getElementById('toggle-mute');
  const toggleScreenShake = document.getElementById('toggle-screen-shake');
  const btnParticleLow = document.getElementById('btn-particle-low');
  const btnParticleMedium = document.getElementById('btn-particle-medium');
  const btnParticleHigh = document.getElementById('btn-particle-high');
  const sliderMouseSensitivity = document.getElementById('slider-mouse-sensitivity');
  const valMouseSensitivity = document.getElementById('val-mouse-sensitivity');
  const toggleReduceFlashing = document.getElementById('toggle-reduce-flashing');
  const sliderUiScale = document.getElementById('slider-ui-scale');
  const valUiScale = document.getElementById('val-ui-scale');

  let selectedDifficulty = playerStats.difficulty || 'normal';
  let selectedParticleQuality = playerStats.particleQuality || 'high';

  // Apply visual button state for difficulty select
  function renderDifficultySelection(diff) {
    selectedDifficulty = diff;
    const btnMap = {
      easy: btnDiffEasy,
      normal: btnDiffNormal,
      hard: btnDiffHard
    };
    ['easy', 'normal', 'hard'].forEach(d => {
      const b = btnMap[d];
      if (!b) return;
      if (d === diff) {
        b.className = "py-2 bg-purple-600/20 text-purple-400 font-bold rounded-lg border border-purple-500/40 cursor-pointer uppercase transition text-center text-[10px]";
      } else {
        b.className = "py-2 bg-slate-800 text-slate-400 font-bold rounded-lg border border-transparent cursor-pointer uppercase transition text-center text-[10px]";
      }
    });
  }

  // Apply visual button state for particle quality select
  function renderParticleQualitySelection(quality) {
    selectedParticleQuality = quality;
    const btnMap = {
      low: btnParticleLow,
      medium: btnParticleMedium,
      high: btnParticleHigh
    };
    ['low', 'medium', 'high'].forEach(q => {
      const b = btnMap[q];
      if (!b) return;
      if (q === quality) {
        b.className = "py-1.5 bg-purple-600/20 text-purple-400 font-bold rounded-lg border border-purple-500/40 cursor-pointer uppercase transition text-center text-[9px]";
      } else {
        b.className = "py-1.5 bg-slate-800 text-slate-400 font-bold rounded-lg border border-transparent cursor-pointer uppercase transition text-center text-[9px]";
      }
    });
  }

  // Engine applying mechanism
  function applySettingsToEngine() {
    sounds.musicVolume = playerStats.musicVolume / 100;
    sounds.sfxVolume = playerStats.sfxVolume / 100;
    sounds.enabled = !playerStats.mute;
    
    if (playerStats.mute) {
      sounds.stopMusic();
    } else {
      if (currentGameInstance && !currentGameInstance.isPaused() && currentScreenId === 'gameplay-container') {
        sounds.resumeMusic();
      }
    }

    const scale = (playerStats.uiScale || 100) / 100;
    document.documentElement.style.setProperty('--ui-scale-factor', scale);
    document.body.style.transform = scale === 1 ? "" : `scale(${scale})`;
    document.body.style.transformOrigin = 'center center';

    updateSoundToggleButton();
  }

  function updateSoundToggleButton() {
    const soundText = document.getElementById('sound-text');
    if (soundText) {
      soundText.innerText = sounds.enabled ? "SOUND: ON" : "SOUND: OFF";
    }
  }

  // Populate settings fields from stats
  function populateSettingsUI() {
    sliderMusic.value = playerStats.musicVolume;
    valMusic.innerText = playerStats.musicVolume + "%";
    sliderSfx.value = playerStats.sfxVolume;
    valSfx.innerText = playerStats.sfxVolume + "%";
    
    if (toggleMute) toggleMute.checked = playerStats.mute || false;
    toggleFullscreenBox.checked = playerStats.fullscreen;
    if (toggleScreenShake) toggleScreenShake.checked = playerStats.screenShakeEnabled !== false;
    
    renderDifficultySelection(playerStats.difficulty || 'normal');
    renderParticleQualitySelection(playerStats.particleQuality || 'high');
    
    if (sliderMouseSensitivity) {
      sliderMouseSensitivity.value = playerStats.mouseSensitivity !== undefined ? playerStats.mouseSensitivity : 13;
      valMouseSensitivity.innerText = ((playerStats.mouseSensitivity !== undefined ? playerStats.mouseSensitivity : 13) / 10).toFixed(2) + "x";
    }
    
    if (toggleReduceFlashing) toggleReduceFlashing.checked = playerStats.reduceFlashing || false;
    
    if (sliderUiScale) {
      sliderUiScale.value = playerStats.uiScale !== undefined ? playerStats.uiScale : 100;
      valUiScale.innerText = (playerStats.uiScale !== undefined ? playerStats.uiScale : 100) + "%";
    }
  }

  // Open settings
  function openSettings() {
    populateSettingsUI();
    settingsModal.classList.remove('hidden');
  }

  function closeSettings() {
    settingsModal.classList.add('hidden');
  }

  btnMainSettings.addEventListener('click', openSettings);
  btnPauseSettings.addEventListener('click', () => {
    executePauseAction(btnPauseSettings, openSettings);
  });
  btnCloseSettings.addEventListener('click', closeSettings);

  // Live slider feedback
  sliderMusic.addEventListener('input', (e) => {
    const vol = e.target.value;
    valMusic.innerText = vol + "%";
    sounds.musicVolume = vol / 100;
  });

  sliderSfx.addEventListener('input', (e) => {
    const vol = e.target.value;
    valSfx.innerText = vol + "%";
    sounds.sfxVolume = vol / 100;
    // Play quick laser beep to sample volume
    sounds.playLaser();
  });

  if (sliderMouseSensitivity) {
    sliderMouseSensitivity.addEventListener('input', (e) => {
      valMouseSensitivity.innerText = (e.target.value / 10).toFixed(2) + "x";
    });
  }

  if (sliderUiScale) {
    sliderUiScale.addEventListener('input', (e) => {
      valUiScale.innerText = e.target.value + "%";
    });
  }

  toggleFullscreenBox.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.log("Error entering fullscreen:", err);
        });
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
  });

  btnDiffEasy.addEventListener('click', () => renderDifficultySelection('easy'));
  btnDiffNormal.addEventListener('click', () => renderDifficultySelection('normal'));
  btnDiffHard.addEventListener('click', () => renderDifficultySelection('hard'));

  if (btnParticleLow) btnParticleLow.addEventListener('click', () => renderParticleQualitySelection('low'));
  if (btnParticleMedium) btnParticleMedium.addEventListener('click', () => renderParticleQualitySelection('medium'));
  if (btnParticleHigh) btnParticleHigh.addEventListener('click', () => renderParticleQualitySelection('high'));

  btnSaveSettings.addEventListener('click', () => {
    playerStats.musicVolume = parseInt(sliderMusic.value);
    playerStats.sfxVolume = parseInt(sliderSfx.value);
    if (toggleMute) playerStats.mute = toggleMute.checked;
    playerStats.fullscreen = toggleFullscreenBox.checked;
    if (toggleScreenShake) playerStats.screenShakeEnabled = toggleScreenShake.checked;
    playerStats.particleQuality = selectedParticleQuality;
    playerStats.difficulty = selectedDifficulty;
    if (sliderMouseSensitivity) playerStats.mouseSensitivity = parseInt(sliderMouseSensitivity.value);
    if (toggleReduceFlashing) playerStats.reduceFlashing = toggleReduceFlashing.checked;
    if (sliderUiScale) playerStats.uiScale = parseInt(sliderUiScale.value);

    applySettingsToEngine();
    saveProgress();
    closeSettings();
    sounds.playPowerUp();
  });

  // Launch Game / New Game
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      sounds.init();
      playerStats.currentLevel = 1;
      showScreen('gameplay-container');
      if (currentGameInstance) {
        currentGameInstance.destroy();
      }
      currentGameInstance = createGame(1);
      currentGameInstance.start();
    });
  }

  // New Game Button
  const btnNewGame = document.getElementById('btn-new-game');
  if (btnNewGame) {
    btnNewGame.addEventListener('click', () => {
      sounds.init();
      playerStats.currentLevel = 1;
      showScreen('gameplay-container');
      if (currentGameInstance) {
        currentGameInstance.destroy();
      }
      currentGameInstance = createGame(1);
      currentGameInstance.start();
    });
  }

  // Continue Game Button
  const btnContinue = document.getElementById('btn-continue-game');
  if (btnContinue) {
    btnContinue.addEventListener('click', () => {
      sounds.init();
      const startLvl = playerStats.highestUnlockedLevel || 1;
      playerStats.currentLevel = startLvl;
      showScreen('gameplay-container');
      if (currentGameInstance) {
        currentGameInstance.destroy();
      }
      currentGameInstance = createGame(startLvl);
      currentGameInstance.start();
    });
  }

  // Level Select Modal Triggers
  const btnLevelSelect = document.getElementById('btn-level-select');
  const modalLevelSelect = document.getElementById('level-select-modal');
  const btnCloseLevelSelect = document.getElementById('btn-close-level-select');
  const btnBackLevelSelect = document.getElementById('btn-back-level-select');

  if (btnLevelSelect && modalLevelSelect) {
    btnLevelSelect.addEventListener('mouseenter', () => {
      sounds.playUIHover();
    });
    btnLevelSelect.addEventListener('click', () => {
      sounds.playUIClick();
      renderLevelSelectGrid();
      modalLevelSelect.classList.remove('hidden');
    });
  }
  if (btnCloseLevelSelect && modalLevelSelect) {
    btnCloseLevelSelect.addEventListener('mouseenter', () => {
      sounds.playUIHover();
    });
    btnCloseLevelSelect.addEventListener('click', () => {
      sounds.playUIClick();
      modalLevelSelect.classList.add('hidden');
    });
  }
  if (btnBackLevelSelect && modalLevelSelect) {
    btnBackLevelSelect.addEventListener('mouseenter', () => {
      sounds.playUIHover();
    });
    btnBackLevelSelect.addEventListener('click', () => {
      sounds.playUIClick();
      modalLevelSelect.classList.add('hidden');
    });
  }

  // Main Menu Hangar / Upgrades Shop Button
  const btnMainShop = document.getElementById('btn-main-shop');
  if (btnMainShop) {
    btnMainShop.addEventListener('click', () => {
      openUpgradesOverlay();
    });
  }

  // Level Complete Modal buttons
  const btnCompleteContinue = document.getElementById('btn-complete-continue');
  if (btnCompleteContinue) {
    btnCompleteContinue.addEventListener('click', () => {
      document.getElementById('level-complete-modal').classList.add('hidden');
      showScreen('gameplay-container');
      const nextLvl = (playerStats.currentLevel || 1) + 1;
      playerStats.currentLevel = nextLvl;
      if (currentGameInstance) {
        currentGameInstance.startNextLevel(nextLvl);
      } else {
        currentGameInstance = createGame(nextLvl);
        currentGameInstance.start();
      }
    });
  }

  const btnCompleteShop = document.getElementById('btn-complete-shop');
  if (btnCompleteShop) {
    btnCompleteShop.addEventListener('click', () => {
      document.getElementById('level-complete-modal').classList.add('hidden');
      openUpgradesOverlay();
    });
  }

  const btnCompleteMenu = document.getElementById('btn-complete-menu');
  if (btnCompleteMenu) {
    btnCompleteMenu.addEventListener('click', () => {
      document.getElementById('level-complete-modal').classList.add('hidden');
      showScreen('main-menu');
    });
  }

  // Victory Modal buttons
  const btnVictoryReplay = document.getElementById('btn-victory-replay-expert');
  if (btnVictoryReplay) {
    btnVictoryReplay.addEventListener('click', () => {
      document.getElementById('victory-modal').classList.add('hidden');
      showScreen('gameplay-container');
      if (currentGameInstance) currentGameInstance.destroy();
      currentGameInstance = createGame(21);
      currentGameInstance.start();
    });
  }

  const btnVictoryNewGame = document.getElementById('btn-victory-new-game');
  if (btnVictoryNewGame) {
    btnVictoryNewGame.addEventListener('click', () => {
      document.getElementById('victory-modal').classList.add('hidden');
      showScreen('gameplay-container');
      if (currentGameInstance) currentGameInstance.destroy();
      currentGameInstance = createGame(1);
      currentGameInstance.start();
    });
  }

  const btnVictoryMenu = document.getElementById('btn-victory-menu');
  if (btnVictoryMenu) {
    btnVictoryMenu.addEventListener('click', () => {
      document.getElementById('victory-modal').classList.add('hidden');
      showScreen('main-menu');
    });
  }

  // Sound Control toggle
  btnSound.addEventListener('click', () => {
    const isEnabled = sounds.toggle();
    playerStats.mute = !isEnabled;
    saveProgress();
    updateSoundToggleButton();
    if (toggleMute) toggleMute.checked = playerStats.mute;
  });

  // Instructions Dialog
  btnHow.addEventListener('click', () => {
    startTutorial();
  });

  // PAUSE MODAL OPERATIONS & DECORATORS
  const pauseButtons = [
    { element: btnPauseResume, color: 'rgba(6, 182, 212, 0.8)' },
    { element: btnPauseRestart, color: 'rgba(244, 63, 94, 0.8)' },
    { element: btnPauseShop, color: 'rgba(139, 92, 246, 0.8)' },
    { element: btnPauseSettings, color: 'rgba(100, 116, 139, 0.8)' },
    { element: btnPauseMenu, color: 'rgba(148, 163, 184, 0.4)' }
  ];

  pauseButtons.forEach(({ element, color }) => {
    if (!element) return;
    
    element.style.transition = "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.15s ease-out, filter 0.15s ease-out";
    element.style.transformOrigin = "center";
    
    const handleHoverStart = () => {
      element.style.transform = "scale(1.05)";
      element.style.boxShadow = `0 0 15px ${color}`;
      element.style.filter = "brightness(1.15)";
      sounds.playUIHover();
    };
    
    const handleHoverEnd = () => {
      element.style.transform = "scale(1)";
      element.style.boxShadow = "none";
      element.style.filter = "none";
    };
    
    element.addEventListener('mouseenter', handleHoverStart);
    element.addEventListener('mouseleave', handleHoverEnd);
    element.addEventListener('focus', handleHoverStart);
    element.addEventListener('blur', handleHoverEnd);
  });

  let isActionProcessing = false;

  function executePauseAction(buttonElement, callback) {
    if (isActionProcessing) return;
    isActionProcessing = true;
    
    sounds.playUIClick();
    buttonElement.style.transform = "scale(0.95)";
    
    setTimeout(() => {
      buttonElement.style.transform = "scale(1.05)";
      try {
        callback();
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => {
          isActionProcessing = false;
        }, 150);
      }
    }, 100);
  }

  btnPause.addEventListener('click', () => {
    if (currentGameInstance) {
      currentGameInstance.pause();
      pauseModal.classList.remove('hidden');
      btnPauseResume.focus();
    }
  });

  btnPauseResume.addEventListener('click', () => {
    executePauseAction(btnPauseResume, () => {
      if (currentGameInstance) {
        currentGameInstance.resume();
        pauseModal.classList.add('hidden');
        const canvas = document.getElementById('game-canvas');
        if (canvas) canvas.focus();
      }
    });
  });

  btnPauseRestart.addEventListener('click', () => {
    executePauseAction(btnPauseRestart, () => {
      if (confirm("Restart the current mission? Your score and credits earned during this run will be reset.")) {
        if (currentGameInstance) {
          const earned = typeof currentGameInstance.getCreditsEarnedInRun === 'function' ? currentGameInstance.getCreditsEarnedInRun() : 0;
          playerStats.credits = Math.max(0, playerStats.credits - earned);
          saveProgress();
          currentGameInstance.destroy();
        }
        pauseModal.classList.add('hidden');
        showScreen('gameplay-container');
        currentGameInstance = createGame(playerStats.currentLevel || 1);
        currentGameInstance.start();
      }
    });
  });

  btnPauseShop.addEventListener('click', () => {
    executePauseAction(btnPauseShop, () => {
      pauseModal.classList.add('hidden');
      openUpgradesOverlay();
    });
  });

  btnPauseMenu.addEventListener('click', () => {
    executePauseAction(btnPauseMenu, () => {
      if (confirm("Return to the Main Menu? Your current mission progress will be lost.")) {
        pauseModal.classList.add('hidden');
        if (currentGameInstance) {
          currentGameInstance.destroy();
          currentGameInstance = null;
        }
        sounds.stopMusic();
        showScreen('main-menu');
      }
    });
  });

  // ESC key opens and closes pause modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      if (!settingsModal.classList.contains('hidden')) {
        closeSettings();
        return;
      }
      
      if (currentScreenId === 'gameplay-container') {
        if (pauseModal.classList.contains('hidden')) {
          if (currentGameInstance) {
            currentGameInstance.pause();
            pauseModal.classList.remove('hidden');
            btnPauseResume.focus();
          }
        } else {
          if (currentGameInstance) {
            currentGameInstance.resume();
            pauseModal.classList.add('hidden');
            const canvas = document.getElementById('game-canvas');
            if (canvas) canvas.focus();
          }
        }
      }
    }
  });

  // Initial immediate application of progress-saved volume / settings
  applySettingsToEngine();

  // Upgrades Hangar buttons
  btnResumeFromShop.addEventListener('click', () => {
    if (currentGameInstance) {
      currentGameInstance.resume();
      closeUpgradesOverlay();
    }
  });

  btnExitFromShop.addEventListener('click', () => {
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
    const restartLvl = playerStats.currentLevel || 1;
    currentGameInstance = createGame(restartLvl);
    currentGameInstance.start();
  });

  btnMenuFromOver.addEventListener('click', () => {
    if (currentGameInstance) {
      currentGameInstance.destroy();
      currentGameInstance = null;
    }
    showScreen('main-menu');
  });

  // Shop upgrade action buttons mapping
  document.getElementById('btn-upgrade-hull').addEventListener('click', () => purchaseUpgrade('hull'));
  document.getElementById('btn-upgrade-shield').addEventListener('click', () => purchaseUpgrade('shield'));
  document.getElementById('btn-upgrade-weapon').addEventListener('click', () => purchaseUpgrade('weapon'));
  document.getElementById('btn-upgrade-laser-class').addEventListener('click', () => purchaseUpgrade('laserClass'));
  document.getElementById('btn-upgrade-ability-med').addEventListener('click', () => purchaseUpgrade('med'));
  document.getElementById('btn-upgrade-ability-turret').addEventListener('click', () => purchaseUpgrade('turret'));

  // Mapping new Advanced Offense Upgrades
  document.getElementById('btn-upgrade-speed').addEventListener('click', () => purchaseUpgrade('speed'));
  document.getElementById('btn-upgrade-firerate').addEventListener('click', () => purchaseUpgrade('fireRate'));
  document.getElementById('btn-upgrade-crit').addEventListener('click', () => purchaseUpgrade('crit'));
  document.getElementById('btn-upgrade-missile').addEventListener('click', () => purchaseUpgrade('missile'));
  document.getElementById('btn-upgrade-cooldown').addEventListener('click', () => purchaseUpgrade('cooldown'));

  document.getElementById('btn-unlock-vulture').addEventListener('click', () => purchaseUpgrade('unlockVulture'));
  document.getElementById('btn-unlock-crusader').addEventListener('click', () => purchaseUpgrade('unlockCrusader'));

  // Ship selections
  document.getElementById('shop-ship-defender').addEventListener('click', () => selectShip('defender'));
  document.getElementById('shop-ship-vulture').addEventListener('click', () => selectShip('vulture'));
  document.getElementById('shop-ship-crusader').addEventListener('click', () => selectShip('crusader'));

  // Setup visual tutorial system
  initTutorialSystem();
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

  // NEW ADVANCED LEVELS UI
  document.getElementById('val-speed-lvl').innerText = playerStats.speedLvl;
  document.getElementById('val-firerate-lvl').innerText = playerStats.fireRateLvl;
  document.getElementById('val-crit-lvl').innerText = playerStats.critLvl;
  document.getElementById('val-missile-lvl').innerText = playerStats.missileLvl;
  document.getElementById('val-cooldown-lvl').innerText = playerStats.cooldownLvl;

  // Costs
  const hIdx = playerStats.hullLvl - 1;
  const sIdx = playerStats.shieldLvl - 1;
  const wIdx = playerStats.weaponLvl - 1;
  const lIdx = playerStats.laserClass - 1;
  const mIdx = playerStats.medLvl - 1;
  const tIdx = playerStats.turretLvl - 1;

  // Advanced costs indices
  const spIdx = playerStats.speedLvl - 1;
  const frIdx = playerStats.fireRateLvl - 1;
  const crIdx = playerStats.critLvl - 1;
  const msIdx = playerStats.missileLvl; // starts at lvl 0, indices are index 0,1,2,3
  const cdIdx = playerStats.cooldownLvl - 1;

  document.getElementById('cost-hull-up').innerText = hIdx < UPGRADE_COSTS.hull.length ? UPGRADE_COSTS.hull[hIdx] : "MAX";
  document.getElementById('cost-shield-up').innerText = sIdx < UPGRADE_COSTS.shield.length ? UPGRADE_COSTS.shield[sIdx] : "MAX";
  document.getElementById('cost-weapon-up').innerText = wIdx < UPGRADE_COSTS.weapon.length ? UPGRADE_COSTS.weapon[wIdx] : "MAX";
  document.getElementById('cost-laser-up').innerText = lIdx < UPGRADE_COSTS.laserClass.length ? UPGRADE_COSTS.laserClass[lIdx] : "MAX";
  document.getElementById('cost-med-up').innerText = mIdx < UPGRADE_COSTS.med.length ? UPGRADE_COSTS.med[mIdx] : "MAX";
  document.getElementById('cost-turret-up').innerText = tIdx < UPGRADE_COSTS.turret.length ? UPGRADE_COSTS.turret[tIdx] : "MAX";

  // New Advanced costs UI
  document.getElementById('cost-speed-up').innerText = spIdx < UPGRADE_COSTS.speed.length ? UPGRADE_COSTS.speed[spIdx] : "MAX";
  document.getElementById('cost-firerate-up').innerText = frIdx < UPGRADE_COSTS.fireRate.length ? UPGRADE_COSTS.fireRate[frIdx] : "MAX";
  document.getElementById('cost-crit-up').innerText = crIdx < UPGRADE_COSTS.crit.length ? UPGRADE_COSTS.crit[crIdx] : "MAX";
  document.getElementById('cost-missile-up').innerText = msIdx < UPGRADE_COSTS.missile.length ? UPGRADE_COSTS.missile[msIdx] : "MAX";
  document.getElementById('cost-cooldown-up').innerText = cdIdx < UPGRADE_COSTS.cooldown.length ? UPGRADE_COSTS.cooldown[cdIdx] : "MAX";

  // Check buttons disable states
  setupShopButtonState('btn-upgrade-hull', hIdx, UPGRADE_COSTS.hull, playerStats.credits);
  setupShopButtonState('btn-upgrade-shield', sIdx, UPGRADE_COSTS.shield, playerStats.credits);
  setupShopButtonState('btn-upgrade-weapon', wIdx, UPGRADE_COSTS.weapon, playerStats.credits);
  setupShopButtonState('btn-upgrade-laser-class', lIdx, UPGRADE_COSTS.laserClass, playerStats.gems, true);
  setupShopButtonState('btn-upgrade-ability-med', mIdx, UPGRADE_COSTS.med, playerStats.credits);
  setupShopButtonState('btn-upgrade-ability-turret', tIdx, UPGRADE_COSTS.turret, playerStats.credits);

  // setup new buttons disable states
  setupShopButtonState('btn-upgrade-speed', spIdx, UPGRADE_COSTS.speed, playerStats.credits);
  setupShopButtonState('btn-upgrade-firerate', frIdx, UPGRADE_COSTS.fireRate, playerStats.credits);
  setupShopButtonState('btn-upgrade-crit', crIdx, UPGRADE_COSTS.crit, playerStats.credits);
  setupShopButtonState('btn-upgrade-missile', msIdx, UPGRADE_COSTS.missile, playerStats.credits);
  setupShopButtonState('btn-upgrade-cooldown', cdIdx, UPGRADE_COSTS.cooldown, playerStats.credits);

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
  } else if (type === 'speed') {
    const cost = UPGRADE_COSTS.speed[playerStats.speedLvl - 1];
    if (playerStats.speedLvl < 5 && playerStats.credits >= cost) {
      playerStats.credits -= cost;
      playerStats.speedLvl++;
      success = true;
    }
  } else if (type === 'fireRate') {
    const cost = UPGRADE_COSTS.fireRate[playerStats.fireRateLvl - 1];
    if (playerStats.fireRateLvl < 5 && playerStats.credits >= cost) {
      playerStats.credits -= cost;
      playerStats.fireRateLvl++;
      success = true;
    }
  } else if (type === 'crit') {
    const cost = UPGRADE_COSTS.crit[playerStats.critLvl - 1];
    if (playerStats.critLvl < 5 && playerStats.credits >= cost) {
      playerStats.credits -= cost;
      playerStats.critLvl++;
      success = true;
    }
  } else if (type === 'missile') {
    const cost = UPGRADE_COSTS.missile[playerStats.missileLvl];
    if (playerStats.missileLvl < 5 && playerStats.credits >= cost) {
      playerStats.credits -= cost;
      playerStats.missileLvl++;
      success = true;
    }
  } else if (type === 'cooldown') {
    const cost = UPGRADE_COSTS.cooldown[playerStats.cooldownLvl - 1];
    if (playerStats.cooldownLvl < 5 && playerStats.credits >= cost) {
      playerStats.credits -= cost;
      playerStats.cooldownLvl++;
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
function createGame(startLevelNumber = 1) {
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
  let currentLevel = startLevelNumber || playerStats.currentLevel || 1;
  let wave = currentLevel;
  let enemiesDefeatedCount = 0;
  let creditsEarnedInRun = 0;

  // Level Statistics Tracking
  let shotsFiredInLevel = 0;
  let shotsHitInLevel = 0;
  let enemiesDefeatedInLevel = 0;
  let targetEnemiesCount = 20;
  let levelStartTime = Date.now();
  
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
  let alienCoreWarningTimer = 0;

  // Starfield parallax background stars
  const stars = [];
  const backgroundObjects = [];
  let screenFlashAlpha = 0;
  let highScoreBeatenTextSpawned = false;

  // Cache to track HUD values and prevent layout thrashing / frame lag
  let lastHudState = {
    score: -1,
    wave: -1,
    credits: -1,
    gems: -1,
    highScore: -1,
    planetHealthPct: -1,
    pShieldPct: -1,
    pHealthPct: -1,
    lives: -1,
    objectiveTxt: '',
    waveState: '',
    medPct: -1,
    turretPct: -1,
    odPct: -1
  };

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
  const playerMissiles = [];
  const enemies = [];
  const lootItems = [];
  const particles = [];
  const damageTexts = [];
  const drones = [];
  const alienCores = [];

  let lastMissileFired = 0;

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
    lives: 3,
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
    const sensitivity = (playerStats.mouseSensitivity !== undefined ? playerStats.mouseSensitivity : 13) / 10;
    player.x = playerStartX + dx * sensitivity;
    player.y = playerStartY + dy * sensitivity;

    // Constrain player to clear play area (so it doesn't go under top HUD bar or bottom action row)
    player.x = Math.max(player.width / 2, Math.min(canvas.width - player.width / 2, player.x));
    player.y = Math.max(62 + player.height / 2, Math.min(canvas.height - 85 - player.height / 2, player.y));
  }

  function handleTouchEnd(e) {
    touchActive = false;
  }

  // ==========================================
  // ⚡️ ACTIVABLE ABILITY LOGIC
  // ==========================================
  function triggerMedKit() {
    const now = Date.now();
    const baseCd = abilities.med.cd - (playerStats.medLvl - 1) * 1500; // lower cooldown on upgrade
    const cd = baseCd * (1 - (playerStats.cooldownLvl - 1) * 0.1);
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
    const cd = abilities.turret.cd * (1 - (playerStats.cooldownLvl - 1) * 0.1);
    if (now - abilities.turret.lastUsed >= cd && player.hull > 0) {
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
    const cd = abilities.overdrive.cd * (1 - (playerStats.cooldownLvl - 1) * 0.1);
    if (now - abilities.overdrive.lastUsed >= cd && player.hull > 0) {
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
    const quality = playerStats.particleQuality || 'high';
    let scale = 1.0;
    if (quality === 'medium') scale = 0.5;
    else if (quality === 'low') scale = 0.2;
    
    const finalCount = Math.max(1, Math.round(count * scale));

    for (let i = 0; i < finalCount; i++) {
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
    if (playerStats.screenShakeEnabled === false) return;
    screenShakeAmount = Math.max(screenShakeAmount, power);
  }

  // ==========================================
  // 🛡️ LEVEL & STAGE MANAGER LOGIC
  // ==========================================
  function showLevelBanner(lvl) {
    const banner = document.getElementById('level-banner-overlay');
    const bannerNum = document.getElementById('level-banner-number');
    const bannerSub = document.getElementById('level-banner-subtitle');

    if (!banner || !bannerNum || !bannerSub) return;

    bannerNum.innerText = `LEVEL ${lvl}`;

    if (lvl === 10) {
      bannerSub.innerText = "ELIMINATE EASY STAGE BOSS";
    } else if (lvl === 20) {
      bannerSub.innerText = "ELIMINATE HARD STAGE BOSS";
    } else if (lvl === 30) {
      bannerSub.innerText = "ELIMINATE FINAL COSMIC BOSS";
    } else if (lvl === 1 || lvl === 11 || lvl === 21) {
      bannerSub.innerText = "ENGAGE ALL ENEMY FORCES";
    } else {
      bannerSub.innerText = "Destroy All Hostiles";
    }

    banner.classList.remove('hidden');
    banner.classList.remove('opacity-0');
    banner.classList.add('opacity-100');

    setTimeout(() => {
      banner.classList.add('opacity-0');
      banner.classList.remove('opacity-100');
      setTimeout(() => {
        banner.classList.add('hidden');
      }, 300);
    }, 2200);
  }

  function updateDifficultyBadge(lvl) {
    const badgeEl = document.getElementById('hud-difficulty-badge');
    if (!badgeEl) return;

    if (lvl <= 10) {
      badgeEl.innerText = "🟢 EASY";
      badgeEl.className = "px-2 py-1 rounded-lg text-[8px] font-extrabold tracking-wider bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.2)]";
    } else if (lvl <= 20) {
      badgeEl.innerText = "🟡 HARD";
      badgeEl.className = "px-2 py-1 rounded-lg text-[8px] font-extrabold tracking-wider bg-yellow-950/80 border border-yellow-500/40 text-yellow-400 shadow-[0_0_6px_rgba(234,179,8,0.2)]";
    } else {
      badgeEl.innerText = "🔴 EXPERT";
      badgeEl.className = "px-2 py-1 rounded-lg text-[8px] font-extrabold tracking-wider bg-rose-950/80 border border-rose-500/40 text-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.2)]";
    }
  }

  function startLevel(lvl) {
    currentLevel = lvl;
    wave = lvl;
    waveState = 'countdown';
    waveTimer = 30; // 0.5s level banner count

    shotsFiredInLevel = 0;
    shotsHitInLevel = 0;
    enemiesDefeatedInLevel = 0;
    levelStartTime = Date.now();

    const isBossLvl = (lvl === 10 || lvl === 20 || lvl === 30);
    if (isBossLvl) {
      targetEnemiesCount = 1;
    } else if (lvl === 1) {
      targetEnemiesCount = 20;
    } else if (lvl === 2) {
      targetEnemiesCount = 30;
    } else {
      targetEnemiesCount = 20 + (lvl - 1) * 5;
    }

    currentEnemiesCountToSpawn = targetEnemiesCount;
    spawnedCountThisWave = 0;

    const hudLvl = document.getElementById('hud-level');
    if (hudLvl) hudLvl.innerText = currentLevel;

    updateDifficultyBadge(currentLevel);
    showLevelBanner(currentLevel);
    sounds.playWaveComplete();
    updateHUDStats();
  }

  function advanceWave() {
    startLevel(currentLevel);
  }

  // ==========================================
  // 👾 ENEMIES COMPILER & PATTERNS
  // ==========================================
  function spawnEnemy() {
    const margin = 30;
    const roll = Math.random();
    
    let type = 'asteroid';
    let size = 20;
    let hp = 1;
    let speed = 2.0;
    let points = 10;

    let hpMult = 1.0;
    let speedMult = 1.0;
    if (currentLevel <= 10) {
      hpMult = 0.65;
      speedMult = 0.75;
    } else if (currentLevel <= 20) {
      hpMult = 1.2;
      speedMult = 1.25;
    } else {
      hpMult = 1.8;
      speedMult = 1.6;
    }

    const isBossLevel = (currentLevel === 10 || currentLevel === 20 || currentLevel === 30);
    const bossesCount = enemies.filter(e => e.isBoss).length;
    
    if (isBossLevel && spawnedCountThisWave === 0 && bossesCount === 0) {
      const baseHp = currentLevel === 10 ? 120 : (currentLevel === 20 ? 300 : 600);
      const bossHp = Math.round(baseHp * hpMult);
      enemies.push({
        x: canvas.width / 2,
        y: -120,
        vx: currentLevel >= 21 ? 2.5 : 1.5,
        vy: 1.0 * speedMult,
        width: 110,
        height: 60,
        hp: bossHp,
        maxHp: bossHp,
        points: currentLevel === 30 ? 2500 : (currentLevel === 20 ? 1200 : 500),
        isBoss: true,
        lastShot: 0,
        lastMissile: 0,
        color: currentLevel === 30 ? '#dc2626' : (currentLevel === 20 ? '#f59e0b' : '#ff0055'),
        shootInterval: (1100 - Math.min(600, currentLevel * 25)) / speedMult
      });
      sounds.startMusic('boss');
      spawnedCountThisWave = currentEnemiesCountToSpawn;
      return;
    }

    if (currentLevel <= 3) {
      if (roll > 0.6) {
        type = 'swarmer';
        size = 11;
        hp = 1;
        speed = (Math.random() * 0.5 + 2.0) * speedMult;
        points = 15;
      } else {
        type = 'asteroid';
        size = Math.random() * 12 + 12;
        hp = 1;
        speed = (Math.random() * 0.5 + 1.4) * speedMult;
        points = 10;
      }
    } else if (currentLevel <= 10) {
      if (roll > 0.80) {
        type = 'bug';
        size = 14;
        hp = 1;
        speed = (Math.random() * 0.8 + 2.2) * speedMult;
        points = 30;
      } else if (roll > 0.55) {
        type = 'scout';
        size = 18;
        hp = 2;
        speed = (Math.random() * 0.6 + 1.8) * speedMult;
        points = 25;
      } else if (roll > 0.25) {
        type = 'swarmer';
        size = 11;
        hp = 1;
        speed = (Math.random() * 0.8 + 2.5) * speedMult;
        points = 15;
      } else {
        type = 'asteroid';
        size = Math.random() * 16 + 12;
        hp = Math.ceil(size / 10);
        speed = (Math.random() * 0.8 + 1.6) * speedMult;
        points = Math.floor(size);
      }
    } else if (currentLevel <= 20) {
      if (roll > 0.80) {
        type = 'elite';
        size = 22;
        hp = Math.round((3 + Math.floor((currentLevel - 10) / 3)) * hpMult);
        speed = (Math.random() * 0.5 + 1.6) * speedMult;
        points = 45;
      } else if (roll > 0.55) {
        type = 'bug';
        size = 14;
        hp = Math.round(2 * hpMult);
        speed = (Math.random() * 1.0 + 3.0) * speedMult;
        points = 35;
      } else if (roll > 0.30) {
        type = 'scout';
        size = 18;
        hp = Math.round(2 * hpMult);
        speed = (Math.random() * 0.8 + 2.4) * speedMult;
        points = 25;
      } else if (roll > 0.12) {
        type = 'swarmer';
        size = 11;
        hp = 1;
        speed = (Math.random() * 1.0 + 3.8) * speedMult;
        points = 15;
      } else {
        type = 'asteroid';
        size = Math.random() * 20 + 12;
        hp = Math.ceil(size / 8);
        speed = (Math.random() * 1.0 + 2.0) * speedMult;
        points = Math.floor(size);
      }
    } else {
      if (roll > 0.65) {
        type = 'elite';
        size = 22;
        hp = Math.round((4 + Math.floor((currentLevel - 20) / 2)) * hpMult);
        speed = (Math.random() * 0.6 + 2.0) * speedMult;
        points = 60;
      } else if (roll > 0.45) {
        type = 'bug';
        size = 14;
        hp = Math.round(3 * hpMult);
        speed = (Math.random() * 1.2 + 3.8) * speedMult;
        points = 40;
      } else if (roll > 0.25) {
        type = 'scout';
        size = 18;
        hp = Math.round(3 * hpMult);
        speed = (Math.random() * 1.0 + 3.2) * speedMult;
        points = 30;
      } else if (roll > 0.10) {
        type = 'swarmer';
        size = 11;
        hp = 1;
        speed = (Math.random() * 1.4 + 4.8) * speedMult;
        points = 20;
      } else {
        type = 'asteroid';
        size = Math.random() * 22 + 12;
        hp = Math.ceil(size / 6);
        speed = (Math.random() * 1.2 + 2.6) * speedMult;
        points = Math.floor(size);
      }
    }

    const scaledHp = Math.max(1, hp);
    const scaledSpeed = speed;

    enemies.push({
      x: Math.random() * (canvas.width - margin * 2) + margin,
      y: -50,
      vx: (type === 'bug' || type === 'swarmer') ? 0 : (Math.random() - 0.5) * 1.2,
      vy: scaledSpeed,
      size: size,
      hp: scaledHp,
      maxHp: scaledHp,
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
    if (currentLevel <= 3) return; // No enemy shooting during early levels (1-3)
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
    // 10% chance to drop an Alien Core instead of rewards (non-boss only)
    if (!enemy.isBoss && Math.random() < 0.10) {
      // Spawn Alien Core!
      alienCores.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 1.2 + Math.random() * 0.8,
        radius: 12,
        hp: 15 + wave * 3,
        maxHp: 15 + wave * 3,
        pulseTime: Math.random() * 100
      });

      // Show warning banner
      alienCoreWarningTimer = 120; // ~2 seconds
      const warningEl = document.getElementById('alien-core-warning');
      if (warningEl) {
        warningEl.classList.remove('opacity-0', 'scale-95');
        warningEl.classList.add('opacity-100', 'scale-100');
      }

      // Play warning sound
      sounds.playWarning();
      return;
    }

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
        spawnedAt: Date.now(),
        magnetState: false
      });
    });
  }

  // ==========================================
  // 🚀 ACTIVE FIRE SYSTEM
  // ==========================================
  function playerFire(now) {
    // 1. Homing Missile Fire Check
    if (playerStats.missileLvl > 0) {
      const missileCD = 4500 - (playerStats.missileLvl - 1) * 700; // Level 1: 4.5s, Level 5: 1.7s
      if (now - lastMissileFired >= missileCD) {
        lastMissileFired = now;
        shotsFiredInLevel++;

        // Find initial nearest target
        let target = null;
        if (enemies.length > 0) {
          let minDist = 99999;
          enemies.forEach(e => {
            const d = Math.hypot(e.x - player.x, e.y - player.y);
            if (d < minDist) {
              minDist = d;
              target = e;
            }
          });
        }

        playerMissiles.push({
          x: player.x,
          y: player.y - 15,
          vx: 0,
          vy: -6,
          target: target,
          dmg: 4 + playerStats.missileLvl * 2, // 6 up to 14 damage!
          size: 6
        });
        spawnDamageText("MISSILE", player.x, player.y - 25, '#f59e0b');
      }
    }

    let currentFireInterval = player.fireInterval;
    if (player.rapidFireUntil && now < player.rapidFireUntil) {
      currentFireInterval = player.fireInterval / 2.2; // Double fire rate!
    } else if (abilities.overdrive.active) {
      currentFireInterval = 85; // Ultra-rapid overdrive fire rate
    }

    if (now - player.lastFired >= currentFireInterval) {
      player.lastFired = now;
      shotsFiredInLevel++;
      sounds.playLaser();

      let laserClassLvl = playerStats.laserClass;
      if (player.doubleShotUntil && now < player.doubleShotUntil) {
        laserClassLvl = Math.min(4, laserClassLvl + 1); // Boost laser stream count!
      }

      // RPG Blaster multiplier
      let dmg = 1 + (playerStats.weaponLvl - 1) * 0.3;
      
      // Critical Strike chance check (Level 1 = 0%, up to 32% at Level 5)
      const critChance = (playerStats.critLvl - 1) * 0.08;
      const isCrit = Math.random() < critChance;
      if (isCrit) {
        dmg *= 2.0;
      }

      const laserSpeed = -18; // Much faster responsive lasers!

      // Muzzle flash particles
      for (let i = 0; i < 4; i++) {
        particles.push({
          x: player.x + (Math.random() - 0.5) * 12,
          y: player.y - 18,
          vx: (Math.random() - 0.5) * 4,
          vy: -Math.random() * 4 - 2,
          radius: Math.random() * 2 + 1,
          color: isCrit ? '#fbbf24' : (laserClassLvl >= 4 ? '#a78bfa' : '#22d3ee'),
          alpha: 1,
          decay: Math.random() * 0.05 + 0.05
        });
      }

      const bulletColor = isCrit ? '#fef08a' : (laserClassLvl >= 4 ? '#a78bfa' : '#facc15');

      if (laserClassLvl === 1) {
        // Dual golden lasers from wing cannons (Matching XTREME starfighter!)
        bullets.push({ x: player.x - 16, y: player.y - 12, vx: 0, vy: laserSpeed, dmg: dmg * 0.9, size: 2.8, length: 18, color: bulletColor, isCrit: isCrit });
        bullets.push({ x: player.x + 16, y: player.y - 12, vx: 0, vy: laserSpeed, dmg: dmg * 0.9, size: 2.8, length: 18, color: bulletColor, isCrit: isCrit });
      } else if (laserClassLvl === 2) {
        // Dual reinforced heavy golden plasma beams
        bullets.push({ x: player.x - 16, y: player.y - 12, vx: 0, vy: laserSpeed, dmg: dmg * 1.1, size: 3.2, length: 22, color: bulletColor, isCrit: isCrit });
        bullets.push({ x: player.x + 16, y: player.y - 12, vx: 0, vy: laserSpeed, dmg: dmg * 1.1, size: 3.2, length: 22, color: bulletColor, isCrit: isCrit });
      } else if (laserClassLvl === 3) {
        // Triple Stream (Dual wing lasers + center plasma stream)
        bullets.push({ x: player.x - 16, y: player.y - 10, vx: -1.2, vy: laserSpeed + 0.5, dmg: dmg * 0.8, size: 2.8, length: 18, color: bulletColor, isCrit: isCrit });
        bullets.push({ x: player.x, y: player.y - 20, vx: 0, vy: laserSpeed, dmg: dmg, size: 3.2, length: 22, color: '#38bdf8', isCrit: isCrit });
        bullets.push({ x: player.x + 16, y: player.y - 10, vx: 1.2, vy: laserSpeed + 0.5, dmg: dmg * 0.8, size: 2.8, length: 18, color: bulletColor, isCrit: isCrit });
      } else if (laserClassLvl >= 4) {
        // Spread Plasma bursts (5 streams!)
        const spreads = [-3, -1.5, 0, 1.5, 3];
        spreads.forEach(sX => {
          bullets.push({
            x: player.x + sX * 5,
            y: player.y - 12,
            vx: sX * 1.2,
            vy: laserSpeed + 1,
            dmg: dmg * 0.7,
            size: 3.2,
            length: 18,
            color: sX === 0 ? '#38bdf8' : bulletColor,
            isCrit: isCrit
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

  // Player & Planet Damage Handlers
  function damagePlayer(dmg) {
    if (player.flashUntil && Date.now() < player.flashUntil) return;

    player.lastHit = Date.now();
    let remainingDmg = dmg;

    if (player.shield > 0) {
      if (player.shield >= remainingDmg) {
        player.shield -= remainingDmg;
        remainingDmg = 0;
        sounds.playShieldHit();
      } else {
        remainingDmg -= player.shield;
        player.shield = 0;
      }
    }

    if (remainingDmg > 0) {
      player.hull -= remainingDmg;
      screenFlashAlpha = 0.4;
      triggerScreenShake(8);
      sounds.playHurt();

      if (player.hull <= 0) {
        player.hull = 0;
        player.lives--;

        if (player.lives > 0) {
          spawnParticleBurst(player.x, player.y, '#f43f5e', 25);
          spawnDamageText(`LIFE LOST! ${player.lives} REMAINING`, player.x, player.y - 30, '#f87171');
          player.hull = player.maxHull;
          player.shield = player.maxShield;
          player.flashUntil = Date.now() + 2500; // 2.5s invincibility
        } else {
          spawnParticleBurst(player.x, player.y, '#ef4444', 40);
          triggerEndGame();
        }
      }
    }

    updateHUDStats();
  }

  function damagePlanet(dmg) {
    planetHealth -= dmg;
    if (planetHealth <= 0) {
      planetHealth = 0;
      triggerEndGame();
    }
    updateHUDStats();
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

    // Decay warning banner timer
    if (alienCoreWarningTimer > 0) {
      alienCoreWarningTimer -= delta;
      if (alienCoreWarningTimer <= 0) {
        const warningEl = document.getElementById('alien-core-warning');
        if (warningEl) {
          warningEl.classList.remove('opacity-100', 'scale-100');
          warningEl.classList.add('opacity-0', 'scale-95');
        }
      }
    }

    if ((player.hull <= 0 && player.lives <= 0) || planetHealth <= 0) {
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
    player.y = Math.max(62 + player.height / 2, Math.min(canvas.height - 85 - player.height / 2, player.y));

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
        enemySpawnTimer = 100; // Trigger immediate spawn!
      }
    } else if (waveState === 'active') {
      // Spawn enemies periodically based on objective target
      enemySpawnTimer += delta;
      const spawnRate = Math.max(30, 90 - wave * 4);
      
      const isBossLvl = (currentLevel === 10 || currentLevel === 20 || currentLevel === 30);
      if (isBossLvl) {
        if (spawnedCountThisWave < 1 && enemies.filter(e => e.isBoss).length === 0) {
          if (enemySpawnTimer >= spawnRate) {
            enemySpawnTimer = 0;
            spawnEnemy();
          }
        }
      } else {
        if (enemiesDefeatedInLevel + enemies.length < targetEnemiesCount && enemies.length < 10) {
          if (enemySpawnTimer >= spawnRate) {
            enemySpawnTimer = 0;
            spawnEnemy();
          }
        }
      }

      // Check if level objective is completely conquered
      if (isBossLvl) {
        const bossCount = enemies.filter(e => e.isBoss).length;
        if (spawnedCountThisWave >= 1 && bossCount === 0 && enemiesDefeatedInLevel >= 1 && enemies.length === 0) {
          waveState = 'cleared';
          triggerLevelComplete();
        }
      } else {
        if (enemiesDefeatedInLevel >= targetEnemiesCount && enemies.length === 0) {
          waveState = 'cleared';
          triggerLevelComplete();
        }
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

    // 6b. Update Player Homing Missiles
    for (let i = playerMissiles.length - 1; i >= 0; i--) {
      const pm = playerMissiles[i];

      // Homing tracking logic: target must still be alive and active
      if (pm.target && enemies.includes(pm.target)) {
        const dx = pm.target.x - pm.x;
        const dy = pm.target.y - pm.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 5) {
          pm.vx = (dx / dist) * 11;
          pm.vy = (dy / dist) * 11;
        }
      } else {
        // Target is dead or gone, scan for nearest alternative
        if (enemies.length > 0) {
          let closest = null;
          let minDist = 99999;
          enemies.forEach(e => {
            const d = Math.hypot(e.x - pm.x, e.y - pm.y);
            if (d < minDist) {
              minDist = d;
              closest = e;
            }
          });
          pm.target = closest;
        } else {
          // No targets left, keep flying straight upwards
          pm.vy = -12;
        }
      }

      pm.x += pm.vx;
      pm.y += pm.vy;

      // Smoke particles trail
      if (Math.random() > 0.4) {
        particles.push({
          x: pm.x,
          y: pm.y + 8,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 2 + 1,
          radius: Math.random() * 2 + 1,
          color: '#f97316', // orange rocket spark
          alpha: 0.8,
          decay: 0.05
        });
      }

      // Delete if flies too far offscreen
      if (pm.y < -50 || pm.y > canvas.height + 50 || pm.x < -50 || pm.x > canvas.width + 50) {
        playerMissiles.splice(i, 1);
        continue;
      }

      // Collsion check with enemies
      let missileExploded = false;
      for (let j = enemies.length - 1; j >= 0; j--) {
        const enemy = enemies[j];
        let hit = false;
        if (enemy.isBoss) {
          hit = (
            pm.x > enemy.x - enemy.width / 2 &&
            pm.x < enemy.x + enemy.width / 2 &&
            pm.y > enemy.y - enemy.height / 2 &&
            pm.y < enemy.y + enemy.height / 2
          );
        } else {
          hit = Math.hypot(pm.x - enemy.x, pm.y - enemy.y) < enemy.size + pm.size;
        }

        if (hit) {
          missileExploded = true;
          break;
        }
      }

      // Collision check with alien cores
      if (!missileExploded) {
        for (let j = alienCores.length - 1; j >= 0; j--) {
          const core = alienCores[j];
          if (Math.hypot(pm.x - core.x, pm.y - core.y) < core.radius + pm.size) {
            missileExploded = true;
            break;
          }
        }
      }

      if (missileExploded) {
        // Trigger splash explosion visuals
        spawnParticleBurst(pm.x, pm.y, '#f97316', 30);
        sounds.playExplosion();
        triggerScreenShake(6);

        // Deal splash damage to all enemies within 100px range
        for (let j = enemies.length - 1; j >= 0; j--) {
          const enemy = enemies[j];
          const distToMissile = Math.hypot(enemy.x - pm.x, enemy.y - pm.y);
          if (distToMissile < 100) {
            // Target takes full damage, surrounding ones take 60%
            const splashDamage = pm.dmg * (distToMissile < 35 ? 1.0 : 0.6);
            enemy.hp -= splashDamage;

            // Spawn localized splash damage indicator text
            spawnDamageText(`-${Math.round(splashDamage)}`, enemy.x, enemy.y - 15, '#fca5a5');

            if (enemy.hp <= 0) {
              spawnParticleBurst(enemy.x, enemy.y, getEnemyColor(enemy.type), enemy.isBoss ? 60 : 20);
              spawnLoot(enemy.x, enemy.y, enemy);
              score += enemy.points;
              enemiesDefeatedCount++;
              
              const popupColor = enemy.isBoss ? '#facc15' : (enemy.type === 'elite' ? '#fbbf24' : '#38bdf8');
              spawnDamageText(`+${enemy.points}`, enemy.x, enemy.y - 30, popupColor);
              
              if (playerStats.highScore > 0 && score > playerStats.highScore && !highScoreBeatenTextSpawned) {
                highScoreBeatenTextSpawned = true;
                spawnDamageText("★ NEW HIGH SCORE ★", player.x, player.y - 30, '#facc15');
              }

              enemies.splice(j, 1);
            }
          }
        }

        // Deal splash damage to all alien cores within 100px range
        for (let j = alienCores.length - 1; j >= 0; j--) {
          const core = alienCores[j];
          const distToMissile = Math.hypot(core.x - pm.x, core.y - pm.y);
          if (distToMissile < 100) {
            const splashDamage = pm.dmg * (distToMissile < 35 ? 1.0 : 0.6);
            core.hp -= splashDamage;

            // Spawn localized splash damage indicator text
            spawnDamageText(`-${Math.round(splashDamage)}`, core.x, core.y - 15, '#fca5a5');

            if (core.hp <= 0) {
              spawnParticleBurst(core.x, core.y, '#ef4444', 18);
              score += 50;
              spawnDamageText("+50", core.x, core.y - 12, '#38bdf8');
              spawnDamageText("CORE DESTROYED", core.x, core.y, '#10b981');
              alienCores.splice(j, 1);
            }
          }
        }

        playerMissiles.splice(i, 1);
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
          shotsHitInLevel++;
          bullets.splice(j, 1);
          enemy.hp -= b.dmg;

          // Critical strike visual feedback
          if (b.isCrit) {
            spawnDamageText(`CRIT! -${Math.round(b.dmg)}`, enemy.x, enemy.y - 12, '#fbbf24');
            spawnParticleBurst(b.x, b.y, '#fbbf24', 8);
          } else {
            // Hit feedback sparks
            spawnParticleBurst(b.x, b.y, b.color, 4);
          }

          if (enemy.hp <= 0) {
            // Kill enemy
            spawnParticleBurst(enemy.x, enemy.y, getEnemyColor(enemy.type), enemy.isBoss ? 60 : 20);
            
            // Drop credits/gems loot
            spawnLoot(enemy.x, enemy.y, enemy);

            score += enemy.points;
            enemiesDefeatedCount++;
            enemiesDefeatedInLevel++;
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

      // Check credit expiration (disappear after 6 seconds)
      if (item.type === 'credit') {
        const age = Date.now() - item.spawnedAt;
        if (age > 6000) {
          lootItems.splice(i, 1);
          continue;
        }
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

    // 9.5. Update Alien Cores (dangerous falling cores)
    for (let i = alienCores.length - 1; i >= 0; i--) {
      const core = alienCores[i];
      core.x += core.vx * delta;
      core.y += core.vy * delta;

      // Pulse scaling animation helper
      core.pulseTime += 0.1 * delta;

      // Bounce horizontally off the side walls
      if (core.x < core.radius) {
        core.x = core.radius;
        core.vx *= -1;
      } else if (core.x > canvas.width - core.radius) {
        core.x = canvas.width - core.radius;
        core.vx *= -1;
      }

      // Check collision: Player ship hitting Alien Core
      const distToPlayer = Math.hypot(core.x - player.x, core.y - player.y);
      if (distToPlayer < core.radius + player.width / 2) {
        spawnParticleBurst(core.x, core.y, '#ef4444', 20);
        sounds.playExplosion();
        damagePlayer(20);
        alienCores.splice(i, 1);
        continue;
      }

      // Check collision: Player Laser hitting Alien Core
      for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j];
        const distToBullet = Math.hypot(b.x - core.x, b.y - core.y);
        if (distToBullet < core.radius + b.size) {
          bullets.splice(j, 1);
          core.hp -= b.dmg;

          // Spark feedback particles
          spawnParticleBurst(b.x, b.y, '#fca5a5', 5);

          if (core.hp <= 0) {
            // Destroyed! Give bonus
            spawnParticleBurst(core.x, core.y, '#ef4444', 25);
            sounds.playExplosion();

            score += 50;
            spawnDamageText("+50", core.x, core.y - 12, '#38bdf8');
            spawnDamageText("CORE DESTROYED", core.x, core.y, '#10b981');

            alienCores.splice(i, 1);
            break;
          }
        }
      }

      if (core.hp <= 0) continue;

      // Check collision: Reaches bottom (Crashes into planet)
      const planetBoundary = canvas.height - 25;
      if (core.y >= planetBoundary) {
        // Reducer amount: 5 to 10%
        const integrityLoss = Math.floor(Math.random() * 6) + 5; // 5% to 10%
        damagePlanet(integrityLoss);

        // Display floating damage text (e.g., "-5% Integrity")
        spawnDamageText(`-${integrityLoss}% Integrity`, core.x, canvas.height - 60, '#ef4444');

        // Play warning sound
        sounds.playWarning();

        // Flash screen red
        screenFlashAlpha = 0.65;

        // Shake the camera
        triggerScreenShake(12);

        // Particle burst
        spawnParticleBurst(core.x, canvas.height - 15, '#ef4444', 25);

        alienCores.splice(i, 1);
        continue;
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
    const reduced = playerStats.reduceFlashing || false;
    screenFlashAlpha = reduced ? 0.12 : 0.55; // bright translucent red or safe minor flash
    if (!reduced) {
      player.flashUntil = Date.now() + 150; // solid white flash for 150ms
    }

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

    // 1. Draw Space Cosmic Background & Stars
    ctx.save();
    
    // Cosmic Magenta/Purple Nebula Backdrop Glow
    const cosmicGrad = ctx.createRadialGradient(
      canvas.width * 0.5, canvas.height * 0.3, 50,
      canvas.width * 0.5, canvas.height * 0.3, canvas.width * 0.8
    );
    cosmicGrad.addColorStop(0, 'rgba(124, 58, 237, 0.18)'); // Deep Purple nebula core
    cosmicGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.10)'); // Pink cosmic dust
    cosmicGrad.addColorStop(1, 'rgba(5, 5, 13, 0)');
    ctx.fillStyle = cosmicGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
        ctx.beginPath();
        ctx.arc(obj.x - obj.size * 0.3, obj.y - obj.size * 0.1, obj.size * 0.15, 0, Math.PI * 2);
        ctx.arc(obj.x + obj.size * 0.2, obj.y + obj.size * 0.3, obj.size * 0.12, 0, Math.PI * 2);
        ctx.fillStyle = obj.craterColor;
        ctx.fill();
      }
    });

    // 2. Draw Planet Defense Base & Earth Curve with Illuminated City Lights
    const planetY = canvas.height + 250;
    const planetRadius = 310;
    
    // Earth Atmosphere Glow Limb
    const atmosphereGlow = ctx.createRadialGradient(
      canvas.width / 2, planetY, planetRadius - 50,
      canvas.width / 2, planetY, planetRadius + 40
    );
    atmosphereGlow.addColorStop(0, 'rgba(34, 211, 238, 0.45)');
    atmosphereGlow.addColorStop(0.4, 'rgba(59, 130, 246, 0.25)');
    atmosphereGlow.addColorStop(1, 'rgba(5, 5, 13, 0)');

    ctx.beginPath();
    ctx.arc(canvas.width / 2, planetY, planetRadius + 40, Math.PI, 0);
    ctx.fillStyle = atmosphereGlow;
    ctx.fill();

    // Earth Crust / Ocean Arc
    ctx.beginPath();
    ctx.arc(canvas.width / 2, planetY, planetRadius, Math.PI, 0);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
    ctx.lineWidth = 3;
    const earthGrad = ctx.createLinearGradient(0, canvas.height - 60, 0, canvas.height);
    earthGrad.addColorStop(0, '#0c2a26');
    earthGrad.addColorStop(1, '#02100d');
    ctx.fillStyle = earthGrad;
    ctx.fill();
    ctx.stroke();

    // City Night Lights illuminated on Earth surface
    const cityPoints = [
      { angle: Math.PI * 0.58, r: planetRadius - 15, size: 2.5 },
      { angle: Math.PI * 0.62, r: planetRadius - 22, size: 3.0 },
      { angle: Math.PI * 0.65, r: planetRadius - 12, size: 2.0 },
      { angle: Math.PI * 0.72, r: planetRadius - 18, size: 3.5 },
      { angle: Math.PI * 0.76, r: planetRadius - 25, size: 2.0 },
      { angle: Math.PI * 0.82, r: planetRadius - 14, size: 3.0 },
      { angle: Math.PI * 0.88, r: planetRadius - 20, size: 2.5 },
      { angle: Math.PI * 0.38, r: planetRadius - 18, size: 2.8 },
      { angle: Math.PI * 0.44, r: planetRadius - 22, size: 3.2 },
      { angle: Math.PI * 0.48, r: planetRadius - 12, size: 2.2 }
    ];

    ctx.save();
    cityPoints.forEach(pt => {
      const cx = canvas.width / 2 + Math.cos(pt.angle) * pt.r;
      const cy = planetY + Math.sin(pt.angle) * pt.r;
      if (cy < canvas.height + 10) {
        ctx.beginPath();
        ctx.arc(cx, cy, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.fill();
      }
    });
    ctx.restore();

    // Earth Shield Grid Ring
    ctx.beginPath();
    ctx.arc(canvas.width / 2, planetY, planetRadius - 10, Math.PI, 0);
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // 3. Draw Loot Drops (Gold coins, Gems, and Powerups)
    lootItems.forEach(item => {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.beginPath();
      
      if (item.type === 'credit') {
        // Disappearing credits blink
        const age = Date.now() - item.spawnedAt;
        if (age > 4000) {
          if (Math.floor(age / 150) % 2 === 0) {
            ctx.restore();
            return;
          }
        }
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

    // 3.5. Draw Alien Cores (Spiky, glowing, pulsing red design with warning indicators)
    alienCores.forEach(core => {
      ctx.save();
      ctx.translate(core.x, core.y);

      // Pulse scaling factor using core.pulseTime
      const pulseFactor = 1 + Math.sin(core.pulseTime) * 0.15;
      const baseRadius = core.radius * pulseFactor;

      // Outer warning aura ring
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 1.6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.fill();

      // Glowing shadow effects
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 15;

      // Spiky design: Draw a multi-pointed star shape
      ctx.beginPath();
      const spikes = 10;
      const outerRad = baseRadius * 1.25;
      const innerRad = baseRadius * 0.7;
      let rot = Math.PI / 2 * 3;
      let step = Math.PI / spikes;

      ctx.moveTo(0, -outerRad);
      for (let i = 0; i < spikes; i++) {
        // Outer spike
        let x1 = Math.cos(rot) * outerRad;
        let y1 = Math.sin(rot) * outerRad;
        ctx.lineTo(x1, y1);
        rot += step;

        // Inner trough
        let x2 = Math.cos(rot) * innerRad;
        let y2 = Math.sin(rot) * innerRad;
        ctx.lineTo(x2, y2);
        rot += step;
      }
      ctx.closePath();
      ctx.fillStyle = '#ef4444'; // Bright Red Core
      ctx.fill();

      // Inner Core core glow
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = '#fca5a5'; // Soft red/pink center
      ctx.shadowBlur = 5;
      ctx.fill();

      // Display HP bar above the core
      if (core.hp < core.maxHp) {
        const barW = 24;
        const barH = 3;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(-barW / 2, -baseRadius - 10, barW, barH);
        
        const healthPct = Math.max(0, core.hp / core.maxHp);
        ctx.fillStyle = '#f87171';
        ctx.fillRect(-barW / 2, -baseRadius - 10, barW * healthPct, barH);
      }

      ctx.restore();
    });

    // 4. Draw Player Spaceship (XTREME Starfighter)
    if (player.hull > 0) {
      ctx.save();
      ctx.translate(player.x, player.y);

      const isFlashing = player.flashUntil && Date.now() < player.flashUntil;
      player.engineFlareTimer += 0.2;
      const flameHeight = 14 + Math.sin(player.engineFlareTimer) * 5;

      // Dual Main Rear Thrusters Flame
      [-10, 10].forEach(thrusterX => {
        const thrusterGrad = ctx.createLinearGradient(thrusterX, 16, thrusterX, 16 + flameHeight);
        if (abilities.overdrive.active) {
          thrusterGrad.addColorStop(0, '#ffffff');
          thrusterGrad.addColorStop(0.3, '#ec4899');
          thrusterGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
        } else {
          thrusterGrad.addColorStop(0, '#ffffff');
          thrusterGrad.addColorStop(0.3, '#06b6d4');
          thrusterGrad.addColorStop(1, 'rgba(124, 58, 237, 0)');
        }
        ctx.beginPath();
        ctx.moveTo(thrusterX - 4, 16);
        ctx.lineTo(thrusterX, 16 + flameHeight);
        ctx.lineTo(thrusterX + 4, 16);
        ctx.closePath();
        ctx.fillStyle = thrusterGrad;
        ctx.shadowColor = abilities.overdrive.active ? '#f43f5e' : '#06b6d4';
        ctx.shadowBlur = 12;
        ctx.fill();
      });

      // Central Engine Exhaust Flare
      const centerFlame = ctx.createLinearGradient(0, 18, 0, 18 + flameHeight * 1.2);
      centerFlame.addColorStop(0, '#ffffff');
      centerFlame.addColorStop(0.4, '#f59e0b');
      centerFlame.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.beginPath();
      ctx.moveTo(-5, 18);
      ctx.lineTo(0, 18 + flameHeight * 1.2);
      ctx.lineTo(5, 18);
      ctx.closePath();
      ctx.fillStyle = centerFlame;
      ctx.fill();

      // Active companion drones
      if (abilities.turret.active) {
        drones.forEach(drone => {
          ctx.save();
          ctx.translate(Math.cos(drone.angleOffset) * drone.radius, Math.sin(drone.angleOffset) * drone.radius);
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
        ctx.save();
        const passiveAngle = (time * 0.03);
        ctx.translate(Math.cos(passiveAngle) * 40, Math.sin(passiveAngle) * 40);
        ctx.beginPath();
        ctx.arc(0, 0, 3.5, 0, Math.PI*2);
        ctx.fillStyle = '#eab308';
        ctx.fill();
        ctx.restore();
      }

      // XTREME Starfighter Ship Hull Path Drawing
      if (isFlashing) {
        // Solid white flash on hit
        ctx.beginPath();
        ctx.moveTo(0, -24);
        ctx.lineTo(8, -12);
        ctx.lineTo(24, 6);
        ctx.lineTo(22, 18);
        ctx.lineTo(12, 14);
        ctx.lineTo(6, 20);
        ctx.lineTo(-6, 20);
        ctx.lineTo(-12, 14);
        ctx.lineTo(-22, 18);
        ctx.lineTo(-24, 6);
        ctx.lineTo(-8, -12);
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 15;
        ctx.fill();
      } else {
        // Swept Metallic Wings
        const wingGrad = ctx.createLinearGradient(-24, 0, 24, 0);
        wingGrad.addColorStop(0, '#1e293b');
        wingGrad.addColorStop(0.2, '#334155');
        wingGrad.addColorStop(0.5, '#0f172a');
        wingGrad.addColorStop(0.8, '#334155');
        wingGrad.addColorStop(1, '#1e293b');

        ctx.beginPath();
        ctx.moveTo(0, -24); // Nose tip
        ctx.lineTo(8, -12); // Right upper wing joint
        ctx.lineTo(24, 6); // Right wing tip
        ctx.lineTo(22, 18); // Right wing fin tail
        ctx.lineTo(12, 14); // Right wing notch
        ctx.lineTo(6, 20); // Right thruster pod
        ctx.lineTo(-6, 20); // Rear center tail
        ctx.lineTo(-12, 14); // Left thruster pod
        ctx.lineTo(-22, 18); // Left wing notch
        ctx.lineTo(-24, 6); // Left wing tip
        ctx.lineTo(-8, -12); // Left upper wing joint
        ctx.closePath();

        ctx.fillStyle = wingGrad;
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Neon Blue Energy Lines along wings
        ctx.beginPath();
        ctx.moveTo(4, -8);
        ctx.lineTo(18, 4);
        ctx.lineTo(16, 12);
        ctx.moveTo(-4, -8);
        ctx.lineTo(-18, 4);
        ctx.lineTo(-16, 12);
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2.0;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.stroke();

        // Central Fuselage Armor Tube
        const bodyGrad = ctx.createLinearGradient(0, -24, 0, 18);
        bodyGrad.addColorStop(0, '#475569');
        bodyGrad.addColorStop(0.3, '#1e293b');
        bodyGrad.addColorStop(1, '#0f172a');

        ctx.beginPath();
        ctx.moveTo(0, -24);
        ctx.lineTo(7, -10);
        ctx.lineTo(8, 12);
        ctx.lineTo(0, 18);
        ctx.lineTo(-8, 12);
        ctx.lineTo(-7, -10);
        ctx.closePath();
        ctx.fillStyle = bodyGrad;
        ctx.fill();
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Dual Wing Cannon Mounts (Where the golden lasers fire from!)
        [-16, 16].forEach(gunX => {
          ctx.beginPath();
          ctx.rect(gunX - 2.5, -8, 5, 14);
          ctx.fillStyle = '#334155';
          ctx.fill();
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.beginPath();
          ctx.rect(gunX - 1.5, -14, 3, 6);
          ctx.fillStyle = '#94a3b8';
          ctx.fill();
        });

        // High-Tech Glass Cockpit Canopy Dome (Glowing Royal Blue Glass)
        const canopyGrad = ctx.createRadialGradient(0, -8, 1, 0, -8, 8);
        canopyGrad.addColorStop(0, '#93c5fd'); // Specular light highlight
        canopyGrad.addColorStop(0.3, '#3b82f6'); // Glowing blue
        canopyGrad.addColorStop(0.8, '#1d4ed8'); // Deep royal blue
        canopyGrad.addColorStop(1, '#0f172a'); // Frame boundary

        ctx.beginPath();
        ctx.ellipse(0, -8, 5.5, 9, 0, 0, Math.PI * 2);
        ctx.fillStyle = canopyGrad;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 1;
        ctx.stroke();

        // White Glare Curve on Cockpit Dome
        ctx.beginPath();
        ctx.arc(-1.5, -11, 2.5, Math.PI * 1.1, Math.PI * 1.7);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Active circular energy shield border overlay
      if (player.shield > 0) {
        ctx.beginPath();
        ctx.arc(0, 0, player.width / 2 + 10, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(34, 211, 238, ${Math.min(1.0, player.shield / player.maxShield * 0.6)})`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 10;
        ctx.stroke();
      }

      // Draw auto-locking reticle indicators on the nearest target
      if (enemies.length > 0) {
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
          ctx.restore();
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

    // 5. Draw Laser Bullets (Dual-layer golden beam with white-hot core)
    bullets.forEach(b => {
      ctx.save();
      const length = b.length || 18;
      
      // Outer Laser Glow Aura
      ctx.beginPath();
      ctx.moveTo(b.x, b.y - length / 2);
      ctx.lineTo(b.x, b.y + length / 2);
      ctx.strokeStyle = b.color || '#facc15';
      ctx.lineWidth = (b.size || 2.8) * 2.2;
      ctx.lineCap = 'round';
      ctx.shadowColor = b.color || '#f59e0b';
      ctx.shadowBlur = 12;
      ctx.stroke();

      // White-Hot Center Core Line inside the Laser Beam!
      ctx.beginPath();
      ctx.moveTo(b.x, b.y - length / 2 + 2);
      ctx.lineTo(b.x, b.y + length / 2 - 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = Math.max(1, (b.size || 2.8) * 0.9);
      ctx.stroke();

      ctx.restore();
    });

    // 5b. Draw Player Homing Missiles
    playerMissiles.forEach(pm => {
      ctx.save();
      ctx.translate(pm.x, pm.y);
      // Angle the missile towards its target speed direction
      const angle = Math.atan2(pm.vy, pm.vx) + Math.PI / 2;
      ctx.rotate(angle);
      
      // Draw a sleek rocket body
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(4, 2);
      ctx.lineTo(2, 8);
      ctx.lineTo(-2, 8);
      ctx.lineTo(-4, 2);
      ctx.closePath();
      
      ctx.fillStyle = '#f59e0b'; // Gold rocket body
      ctx.fill();
      ctx.strokeStyle = '#ea580c'; // Red-orange outline
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      // Draw fire thrust flame backing
      ctx.beginPath();
      ctx.moveTo(-2, 8);
      ctx.lineTo(0, 15 + Math.random() * 5);
      ctx.lineTo(2, 8);
      ctx.closePath();
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      
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
    if (score !== lastHudState.score) {
      document.getElementById('hud-score').innerText = score;
      lastHudState.score = score;
    }
    if (wave !== lastHudState.wave) {
      document.getElementById('hud-wave').innerText = wave;
      lastHudState.wave = wave;
    }
    if (playerStats.credits !== lastHudState.credits) {
      document.getElementById('hud-credits').innerText = playerStats.credits;
      lastHudState.credits = playerStats.credits;
    }
    if (playerStats.gems !== lastHudState.gems) {
      document.getElementById('hud-gems').innerText = playerStats.gems;
      lastHudState.gems = playerStats.gems;
    }
    if (playerStats.highScore !== lastHudState.highScore) {
      document.getElementById('hud-high-score').innerText = playerStats.highScore;
      lastHudState.highScore = playerStats.highScore;
    }

    if (player.lives !== lastHudState.lives) {
      const livesEl = document.getElementById('hud-lives-txt');
      if (livesEl) livesEl.innerText = player.lives;
      lastHudState.lives = player.lives;
    }

    const isBossLvl = (currentLevel === 10 || currentLevel === 20 || currentLevel === 30);
    let objectiveTxt = "";
    if (isBossLvl) {
      const boss = enemies.find(e => e.isBoss);
      if (boss) {
        const bossHpPct = Math.max(0, Math.round((boss.hp / boss.maxHp) * 100));
        objectiveTxt = `Defeat Boss (${bossHpPct}%)`;
      } else if (enemiesDefeatedInLevel >= 1) {
        objectiveTxt = `Boss Defeated!`;
      } else {
        objectiveTxt = `Defeat Boss`;
      }
    } else {
      objectiveTxt = `Destroy ${enemiesDefeatedInLevel} / ${targetEnemiesCount}`;
    }

    if (objectiveTxt !== lastHudState.objectiveTxt) {
      const objEl = document.getElementById('hud-objective-txt');
      if (objEl) objEl.innerText = objectiveTxt;
      lastHudState.objectiveTxt = objectiveTxt;
    }

    // Health ratios
    const pHealthPct = Math.max(0, (player.hull / player.maxHull) * 100);
    const pShieldPct = Math.max(0, (player.shield / player.maxShield) * 100);
    const planetHealthPct = Math.max(0, (planetHealth / planetMaxHealth) * 100);

    const roundedPlanet = Math.round(planetHealthPct);
    if (roundedPlanet !== lastHudState.planetHealthPct) {
      document.getElementById('planet-health-txt').innerText = roundedPlanet + "%";
      document.getElementById('planet-health-bar').style.width = planetHealthPct + "%";
      lastHudState.planetHealthPct = roundedPlanet;
    }

    const roundedShield = Math.round(pShieldPct);
    if (roundedShield !== lastHudState.pShieldPct) {
      document.getElementById('ship-shield-txt').innerText = roundedShield + "%";
      document.getElementById('ship-shield-bar').style.width = pShieldPct + "%";
      lastHudState.pShieldPct = roundedShield;
    }

    const roundedHealth = Math.round(pHealthPct);
    if (roundedHealth !== lastHudState.pHealthPct) {
      document.getElementById('ship-hull-txt').innerText = roundedHealth + "%";
      document.getElementById('ship-hull-bar').style.width = pHealthPct + "%";
      lastHudState.pHealthPct = roundedHealth;
    }

    // Update center wave transition overlays
    const countdownEl = document.getElementById('wave-countdown-overlay');
    const startEl = document.getElementById('wave-start-overlay');
    if (countdownEl && startEl) {
      const secs = Math.max(1, Math.ceil(waveTimer / 60));
      const stateKey = `${waveState}_${wave}_${secs}_${waveSplashTimer > 0}`;
      
      if (stateKey !== lastHudState.waveState) {
        if (waveState === 'countdown') {
          countdownEl.classList.remove('hidden');
          countdownEl.classList.add('opacity-100');
          countdownEl.classList.remove('opacity-0');
          
          const titleEl = document.getElementById('wave-countdown-title');
          if (titleEl) titleEl.innerText = `WAVE ${wave} STARTS IN`;
          
          const numEl = document.getElementById('wave-countdown-number');
          if (numEl) numEl.innerText = secs;
          
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
        lastHudState.waveState = stateKey;
      }
    }

    // Abilities Cooldown overlay bars
    updateCooldownVisuals();
  }

  function updateCooldownVisuals() {
    const now = Date.now();
    const cdReduction = 1 - (playerStats.cooldownLvl - 1) * 0.1;

    // Med kit
    const medCD = (abilities.med.cd - (playerStats.medLvl - 1) * 1500) * cdReduction;
    const medElapsed = now - abilities.med.lastUsed;
    const medPct = Math.max(0, Math.min(100, 100 - (medElapsed / medCD * 100)));
    const roundedMed = Math.round(medPct);
    if (roundedMed !== lastHudState.medPct) {
      const overlayMed = document.getElementById('cooldown-med');
      if (overlayMed) {
        overlayMed.style.height = medPct + "%";
        overlayMed.innerText = medPct > 0 ? Math.ceil((medCD - medElapsed) / 1000) : "";
      }
      lastHudState.medPct = roundedMed;
    }

    // Turret
    const turretCD = abilities.turret.cd * cdReduction;
    const turretElapsed = now - abilities.turret.lastUsed;
    const turretPct = Math.max(0, Math.min(100, 100 - (turretElapsed / turretCD * 100)));
    const roundedTurret = Math.round(turretPct);
    if (roundedTurret !== lastHudState.turretPct) {
      const overlayTurret = document.getElementById('cooldown-turret');
      if (overlayTurret) {
        overlayTurret.style.height = turretPct + "%";
        overlayTurret.innerText = turretPct > 0 ? Math.ceil((turretCD - turretElapsed) / 1000) : "";
      }
      lastHudState.turretPct = roundedTurret;
    }

    // Overdrive
    const odCD = abilities.overdrive.cd * cdReduction;
    const odElapsed = now - abilities.overdrive.lastUsed;
    const odPct = Math.max(0, Math.min(100, 100 - (odElapsed / odCD * 100)));
    const roundedOD = Math.round(odPct);
    if (roundedOD !== lastHudState.odPct) {
      const overlayOD = document.getElementById('cooldown-overdrive');
      if (overlayOD) {
        overlayOD.style.height = odPct + "%";
        overlayOD.innerText = odPct > 0 ? Math.ceil((odCD - odElapsed) / 1000) : "";
      }
      lastHudState.odPct = roundedOD;
    }
  }

  function destroyGame() {
    isRunning = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    window.removeEventListener('resize', resizeCanvas);
    
    // Cleanup inputs to ensure no touch blocking on Game Over or Menu overlays
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
  }

  // ==========================================
  // 🛑 END RUN PROCESSORS & LEVEL CONQUEST
  // ==========================================
  function triggerLevelComplete() {
    waveState = 'cleared';
    destroyGame();

    const levelScore = score;
    const accuracy = shotsFiredInLevel > 0 ? Math.min(100, Math.round((shotsHitInLevel / shotsFiredInLevel) * 100)) : 100;
    const levelTime = Math.max(1, Math.round((Date.now() - levelStartTime) / 1000));

    // Calculate rating
    let rating = 'C';
    let ratingBonusPct = 0;
    if (accuracy >= 80) {
      rating = 'S';
      ratingBonusPct = 0.50;
    } else if (accuracy >= 65) {
      rating = 'A';
      ratingBonusPct = 0.30;
    } else if (accuracy >= 50) {
      rating = 'B';
      ratingBonusPct = 0.15;
    }

    const baseCredits = 50 + currentLevel * 15;
    const ratingBonusCredits = Math.round(baseCredits * ratingBonusPct);
    const totalLevelCredits = baseCredits + ratingBonusCredits;

    playerStats.credits += totalLevelCredits;
    creditsEarnedInRun += totalLevelCredits;

    if (!Array.isArray(playerStats.completedLevels)) playerStats.completedLevels = [];
    if (!playerStats.completedLevels.includes(currentLevel)) {
      playerStats.completedLevels.push(currentLevel);
    }

    if (currentLevel < 30) {
      playerStats.highestUnlockedLevel = Math.max(playerStats.highestUnlockedLevel || 1, currentLevel + 1);
    }
    playerStats.currentLevel = currentLevel;
    saveProgress();

    sounds.playWaveComplete();

    // Final Level 30 Victory condition check!
    if (currentLevel === 30) {
      const vicScore = document.getElementById('vic-score');
      const vicEnemies = document.getElementById('vic-enemies');
      const vicCredits = document.getElementById('vic-credits');
      if (vicScore) vicScore.innerText = score;
      if (vicEnemies) vicEnemies.innerText = enemiesDefeatedCount;
      if (vicCredits) vicCredits.innerText = creditsEarnedInRun + " CR";

      const vicModal = document.getElementById('victory-modal');
      if (vicModal) vicModal.classList.remove('hidden');
      return;
    }

    // Populate Level Complete Modal
    const lcTitle = document.getElementById('lc-level-title');
    if (lcTitle) lcTitle.innerText = `LEVEL ${currentLevel} CONQUERED`;

    const rankTextEl = document.getElementById('lc-rank-text');
    const rankBadgeEl = document.getElementById('lc-rank-badge');
    if (rankTextEl && rankBadgeEl) {
      rankTextEl.innerText = `RANK ${rating}`;
      if (rating === 'S') {
        rankBadgeEl.className = "px-6 py-2 rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-400 text-yellow-300 flex items-center space-x-2 shadow-[0_0_15px_rgba(234,179,8,0.4)]";
      } else if (rating === 'A') {
        rankBadgeEl.className = "px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400 text-cyan-300 flex items-center space-x-2 shadow-[0_0_15px_rgba(6,182,212,0.4)]";
      } else if (rating === 'B') {
        rankBadgeEl.className = "px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center space-x-2 shadow-[0_0_15px_rgba(16,185,129,0.4)]";
      } else {
        rankBadgeEl.className = "px-6 py-2 rounded-xl bg-gradient-to-r from-slate-700/20 to-slate-800/20 border-2 border-slate-500 text-slate-300 flex items-center space-x-2";
      }
    }

    const lcScore = document.getElementById('lc-score');
    const lcAccuracy = document.getElementById('lc-accuracy');
    const lcEnemies = document.getElementById('lc-enemies');
    const lcCredits = document.getElementById('lc-credits');
    const lcTime = document.getElementById('lc-time');

    if (lcScore) lcScore.innerText = `+${score}`;
    if (lcAccuracy) lcAccuracy.innerText = `${accuracy}% (${shotsHitInLevel}/${shotsFiredInLevel} hits)`;
    if (lcEnemies) lcEnemies.innerText = enemiesDefeatedInLevel;
    if (lcCredits) lcCredits.innerText = `+${totalLevelCredits} CR (${ratingBonusPct > 0 ? `+${Math.round(ratingBonusPct * 100)}% Rating Bonus` : 'Standard'})`;
    if (lcTime) lcTime.innerText = `${levelTime}s`;

    // Milestone rewards every 5 levels
    const bonusBanner = document.getElementById('lc-bonus-banner');
    if (bonusBanner) {
      if (currentLevel % 5 === 0) {
        bonusBanner.classList.remove('hidden');
        if (currentLevel === 10) {
          bonusBanner.innerText = "👑 EASY STAGE CLEAR! Hard Stage Unlocked + 10 Gems & 1000 CR!";
          playerStats.gems += 10;
          playerStats.credits += 1000;
        } else if (currentLevel === 20) {
          bonusBanner.innerText = "👑 HARD STAGE CLEAR! Expert Stage Unlocked + 25 Gems & 2000 CR!";
          playerStats.gems += 25;
          playerStats.credits += 2000;
        } else {
          bonusBanner.innerText = `🎁 MILESTONE LEVEL ${currentLevel} BONUS: +500 Credits & 5 Gems!`;
          playerStats.credits += 500;
          playerStats.gems += 5;
        }
        saveProgress();
      } else {
        bonusBanner.classList.add('hidden');
      }
    }

    const lcModal = document.getElementById('level-complete-modal');
    if (lcModal) lcModal.classList.remove('hidden');
  }

  function triggerEndGame() {
    destroyGame(); // Release all touch/drag event listeners instantly on game over!

    // Save Highscore
    if (score > playerStats.highScore) {
      playerStats.highScore = score;
      saveProgress();
    }

    // Set Game Over screen details
    document.getElementById('over-score').innerText = score;
    document.getElementById('over-high-score').innerText = playerStats.highScore;
    document.getElementById('over-wave').innerText = currentLevel;
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
    start: function(lvl = startLevelNumber) {
      isRunning = true;
      isPaused = false;
      score = 0;
      currentLevel = lvl || 1;
      wave = currentLevel;
      enemiesDefeatedCount = 0;
      creditsEarnedInRun = 0;
      planetHealth = planetMaxHealth;
      highScoreBeatenTextSpawned = false;

      // Sync active player stats
      syncStats();

      // Reset Pools
      bullets.length = 0;
      enemyBullets.length = 0;
      playerMissiles.length = 0;
      enemies.length = 0;
      lootItems.length = 0;
      particles.length = 0;
      damageTexts.length = 0;
      drones.length = 0;
      alienCores.length = 0;

      alienCoreWarningTimer = 0;
      const warningEl = document.getElementById('alien-core-warning');
      if (warningEl) {
        warningEl.classList.remove('opacity-100', 'scale-100');
        warningEl.classList.add('opacity-0', 'scale-95');
      }

      lastMissileFired = 0;

      player.hull = player.maxHull;
      player.shield = player.maxShield;

      // Position Player
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      // Trigger inputs and star fields
      initInput();
      startLevel(currentLevel);

      // Start the core Loop
      lastTime = 0;
      animationFrameId = requestAnimationFrame(gameLoop);
    },

    startNextLevel: function(nextLvl) {
      isRunning = true;
      isPaused = false;
      currentLevel = nextLvl;
      wave = currentLevel;

      bullets.length = 0;
      enemyBullets.length = 0;
      playerMissiles.length = 0;
      enemies.length = 0;
      lootItems.length = 0;
      particles.length = 0;
      damageTexts.length = 0;
      alienCores.length = 0;

      player.hull = player.maxHull;
      player.shield = player.maxShield;

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      initInput();
      startLevel(nextLvl);

      lastTime = 0;
      animationFrameId = requestAnimationFrame(gameLoop);
    },

    pause: function() {
      isPaused = true;
      sounds.pauseMusic();
    },

    resume: function() {
      isPaused = false;
      lastTime = 0;
      sounds.resumeMusic();
    },

    destroy: destroyGame,

    syncStats: syncStats,

    getCreditsEarnedInRun: function() {
      return creditsEarnedInRun;
    },

    isPaused: function() {
      return isPaused;
    }
  };
}

// ============================================================================
// 🎓 INTERACTIVE VISUAL TUTORIAL SYSTEM (CYBERPUNK / NEON EMULATION)
// ============================================================================
let tutorialRunning = false;
let tutorialStep = 0;
let tutorialTimer = 0;
let tutorialAnimationId = null;

const TUT_CAPTIONS = [
  "Move your ship to dodge incoming threats.",
  "Press Space to fire and destroy enemies.",
  "Don't let enemies reach Earth. Protect the Planet Core.",
  "Collect credits and power-ups to become stronger.",
  "Use your special abilities at the right moment.",
  "Survive waves and defeat powerful bosses."
];

const TUT_TITLES = [
  "Step 1 of 6: Movement",
  "Step 2 of 6: Shoot",
  "Step 3 of 6: Protect Earth",
  "Step 4 of 6: Collect Rewards",
  "Step 5 of 6: Use Abilities",
  "Step 6 of 6: Boss Battle"
];

// Local state for tutorial simulation
let tutState = {
  playerX: 240,
  playerY: 200,
  playerTargetX: 240,
  playerColor: '#22d3ee',
  playerShield: 0,
  playerHull: 100,
  enemies: [],
  bullets: [],
  loot: [],
  particles: [],
  planetHealth: 100,
  warningTimer: 0,
  score: 0,
  credits: 0,
  gems: 0,
  abilityState: 'heal',
  abilityCycleTimer: 0,
  bossActive: false,
  bossX: 240,
  bossY: -50,
  bossHP: 100,
  bossMaxHP: 100,
  bossDirection: 1,
  screenShake: 0,
  explosionTime: 0
};

let tutStars = [];
for (let i = 0; i < 30; i++) {
  tutStars.push({
    x: Math.random() * 480,
    y: Math.random() * 260,
    size: Math.random() * 1.5 + 0.5,
    speed: Math.random() * 0.4 + 0.1
  });
}

function resetTutStepState(step) {
  tutState.enemies = [];
  tutState.bullets = [];
  tutState.loot = [];
  tutState.particles = [];
  tutState.planetHealth = 100;
  tutState.warningTimer = 0;
  tutState.abilityCycleTimer = 0;
  tutState.bossActive = false;
  tutState.bossX = 240;
  tutState.bossY = -50;
  tutState.bossHP = 100;
  tutState.screenShake = 0;

  if (step === 0) {
    tutState.playerX = 240;
    tutState.playerY = 210;
  } else if (step === 1) {
    tutState.playerX = 240;
    tutState.playerY = 210;
  } else if (step === 2) {
    tutState.playerX = 100;
    tutState.playerY = 210;
  } else if (step === 3) {
    tutState.playerX = 240;
    tutState.playerY = 210;
    tutState.loot.push({ x: 200, y: 30, vy: 1.2, type: 'credit', radius: 7 });
  } else if (step === 4) {
    tutState.playerX = 240;
    tutState.playerY = 210;
  } else if (step === 5) {
    tutState.playerX = 240;
    tutState.playerY = 210;
    tutState.bossActive = true;
    tutState.bossY = -60;
  }
}

function updateTutorialKeycapsHTML(step) {
  const container = document.getElementById('tutorial-keycaps');
  if (!container) return;

  if (step === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center select-none">
        <div class="flex space-x-1.5 mb-1">
          <kbd id="key-w" class="px-2.5 py-1 bg-[#121225] border border-slate-800 rounded-md text-[9px] text-slate-500 font-bold">W</kbd>
        </div>
        <div class="flex space-x-1.5">
          <kbd id="key-a" class="px-2.5 py-1 bg-[#121225] border border-slate-800 rounded-md text-[9px] text-slate-500 font-bold transition-all duration-100">A</kbd>
          <kbd id="key-s" class="px-2.5 py-1 bg-[#121225] border border-slate-800 rounded-md text-[9px] text-slate-500 font-bold">S</kbd>
          <kbd id="key-d" class="px-2.5 py-1 bg-[#121225] border border-slate-800 rounded-md text-[9px] text-slate-500 font-bold transition-all duration-100">D</kbd>
        </div>
      </div>
      <span class="text-slate-600 text-[10px] mx-3">OR</span>
      <div class="flex space-x-1.5">
        <kbd id="key-left" class="px-2.5 py-2 bg-[#121225] border border-slate-800 rounded-md text-[9px] text-slate-500 font-bold transition-all duration-100">◀</kbd>
        <kbd id="key-right" class="px-2.5 py-2 bg-[#121225] border border-slate-800 rounded-md text-[9px] text-slate-500 font-bold transition-all duration-100">▶</kbd>
      </div>
    `;
  } else if (step === 1) {
    container.innerHTML = `
      <kbd id="key-space" class="px-12 py-2 bg-[#121225] border border-slate-800 rounded-md text-[9px] text-slate-500 font-bold uppercase tracking-widest transition-all duration-100">SPACE (AUTO-FIRE)</kbd>
    `;
  } else if (step === 2) {
    container.innerHTML = `
      <div class="text-rose-500 font-bold flex items-center space-x-1 animate-pulse text-[10px]">
        <svg class="w-3.5 h-3.5 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
        <span class="tracking-wider">ALERT: PLANET INTEGRITY CRITICAL</span>
      </div>
    `;
  } else if (step === 3) {
    container.innerHTML = `
      <div class="flex items-center space-x-4 bg-slate-950/80 px-4 py-1.5 rounded-lg border border-slate-900 shadow-sm text-[10px]">
        <div class="flex items-center space-x-1.5 text-yellow-400 font-bold">
          <span>CR:</span>
          <span id="tut-cr-val">${tutState.credits}</span>
        </div>
        <div class="h-3 w-[1px] bg-slate-800"></div>
        <div class="flex items-center space-x-1.5 text-purple-400 font-bold">
          <span>GEMS:</span>
          <span id="tut-gems-val">${tutState.gems}</span>
        </div>
      </div>
    `;
  } else if (step === 4) {
    container.innerHTML = `
      <div class="flex space-x-2">
        <kbd id="key-1" class="px-3 py-1.5 bg-[#121225] border border-slate-800 rounded-md text-[9px] text-slate-500 transition-all duration-100 flex flex-col items-center min-w-[50px]">
          <span class="text-[8px] text-slate-400 font-bold">MED</span>
          <span class="text-[8px] font-extrabold mt-0.5">[1]</span>
        </kbd>
        <kbd id="key-2" class="px-3 py-1.5 bg-[#121225] border border-slate-800 rounded-md text-[9px] text-slate-500 transition-all duration-100 flex flex-col items-center min-w-[50px]">
          <span class="text-[8px] text-slate-400 font-bold">TURR</span>
          <span class="text-[8px] font-extrabold mt-0.5">[2]</span>
        </kbd>
        <kbd id="key-3" class="px-3 py-1.5 bg-[#121225] border border-slate-800 rounded-md text-[9px] text-slate-500 transition-all duration-100 flex flex-col items-center min-w-[50px]">
          <span class="text-[8px] text-slate-400 font-bold">BURST</span>
          <span class="text-[8px] font-extrabold mt-0.5">[3]</span>
        </kbd>
      </div>
    `;
  } else if (step === 5) {
    container.innerHTML = `
      <div class="text-rose-500 border border-rose-500/30 bg-rose-950/20 px-4 py-1.5 rounded-lg font-bold flex items-center space-x-1 animate-pulse text-[10px] tracking-wider">
        <span>☠ THREAT: BOSS CLASS SIGNAL</span>
      </div>
    `;
  }
}

function drawTutorialStars(ctx) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  tutStars.forEach(s => {
    s.y += s.speed;
    if (s.y > 260) s.y = 0;
    ctx.fillRect(s.x, s.y, s.size, s.size);
  });
}

function drawTutorialPlanetBase(ctx, isCrit) {
  const planetY = 260 + 200;
  const planetRadius = 240;

  const glow = ctx.createRadialGradient(240, planetY, planetRadius - 40, 240, planetY, planetRadius + 15);
  glow.addColorStop(0, isCrit ? 'rgba(244, 63, 94, 0.4)' : 'rgba(16, 185, 129, 0.3)');
  glow.addColorStop(0.5, isCrit ? 'rgba(244, 63, 94, 0.15)' : 'rgba(6, 182, 212, 0.1)');
  glow.addColorStop(1, 'rgba(5, 5, 13, 0)');

  ctx.beginPath();
  ctx.arc(240, planetY, planetRadius + 15, Math.PI, 0);
  ctx.fillStyle = glow;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(240, planetY, planetRadius, Math.PI, 0);
  ctx.strokeStyle = isCrit ? '#f43f5e' : '#10b981';
  ctx.lineWidth = 2.5;
  ctx.fillStyle = isCrit ? '#1c0c0c' : '#061c16';
  ctx.fill();
  ctx.stroke();
}

function drawTutorialPlayer(ctx, px, py, healing, shield, activeBurst, timer) {
  ctx.save();
  ctx.translate(px, py);

  const flameHeight = 8 + Math.sin(timer * 0.3) * 3;
  ctx.beginPath();
  ctx.moveTo(-4, 10);
  ctx.lineTo(0, 10 + flameHeight);
  ctx.lineTo(4, 10);
  ctx.closePath();
  ctx.fillStyle = activeBurst ? '#f43f5e' : '#f97316';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.lineTo(12, 12);
  ctx.lineTo(0, 7);
  ctx.lineTo(-12, 12);
  ctx.closePath();

  ctx.fillStyle = '#0f172a';
  ctx.fill();
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#22d3ee';
  ctx.shadowBlur = 8;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, -3, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  if (healing) {
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  if (shield) {
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 6;
    ctx.stroke();
  }

  ctx.restore();
}

function drawTutorialEnemy(ctx, e) {
  ctx.save();
  ctx.translate(e.x, e.y);

  if (e.type === 'bug') {
    ctx.beginPath();
    ctx.moveTo(0, e.size);
    ctx.lineTo(e.size * 0.8, -e.size * 0.5);
    ctx.lineTo(0, -e.size);
    ctx.lineTo(-e.size * 0.8, -e.size * 0.5);
    ctx.closePath();
    ctx.fillStyle = '#10b981';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 8;
    ctx.fill();
  } else if (e.type === 'scout') {
    ctx.beginPath();
    ctx.moveTo(0, -e.size);
    ctx.lineTo(e.size, e.size * 0.3);
    ctx.lineTo(e.size * 0.3, e.size);
    ctx.lineTo(-e.size * 0.3, e.size);
    ctx.lineTo(-e.size, e.size * 0.3);
    ctx.closePath();
    ctx.fillStyle = '#ec4899';
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 8;
    ctx.fill();
  } else if (e.type === 'boss') {
    ctx.beginPath();
    ctx.moveTo(0, -25);
    ctx.lineTo(30, -5);
    ctx.lineTo(25, 25);
    ctx.lineTo(10, 15);
    ctx.lineTo(0, 30);
    ctx.lineTo(-10, 15);
    ctx.lineTo(-25, 25);
    ctx.lineTo(-30, -5);
    ctx.closePath();
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 12;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(-8, -5, 3.5, 0, Math.PI * 2);
    ctx.arc(8, -5, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#facc15';
    ctx.fill();
  }

  ctx.restore();
}

function drawTutorialBullet(ctx, b) {
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.isPlayer ? 3 : 4, 0, Math.PI * 2);
  ctx.fillStyle = b.isPlayer ? '#22d3ee' : '#f43f5e';
  ctx.shadowColor = b.isPlayer ? '#22d3ee' : '#f43f5e';
  ctx.shadowBlur = 5;
  ctx.fill();
}

function drawTutorialLoot(ctx, l) {
  ctx.save();
  ctx.translate(l.x, l.y);

  if (l.type === 'credit') {
    ctx.beginPath();
    ctx.arc(0, 0, l.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#facc15';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 8;
    ctx.fill();
  } else if (l.type === 'gem') {
    ctx.beginPath();
    ctx.moveTo(0, -l.radius);
    ctx.lineTo(l.radius, 0);
    ctx.lineTo(0, l.radius);
    ctx.lineTo(-l.radius, 0);
    ctx.closePath();
    ctx.fillStyle = '#c084fc';
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 8;
    ctx.fill();
  }

  ctx.restore();
}

function drawTutorialParticles(ctx) {
  for (let i = tutState.particles.length - 1; i >= 0; i--) {
    const p = tutState.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= p.decay;

    if (p.alpha <= 0) {
      tutState.particles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = p.alpha;

    if (p.text) {
      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = p.color;
      ctx.fillText(p.text, p.x - 15, p.y);
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }

    ctx.restore();
  }
}

function tutorialLoop() {
  if (!tutorialRunning) return;

  const canvas = document.getElementById('tutorial-canvas');
  if (!canvas) {
    tutorialAnimationId = requestAnimationFrame(tutorialLoop);
    return;
  }
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  if (tutState.screenShake > 0) {
    const dx = (Math.random() - 0.5) * tutState.screenShake;
    const dy = (Math.random() - 0.5) * tutState.screenShake;
    ctx.translate(dx, dy);
    tutState.screenShake *= 0.9;
    if (tutState.screenShake < 0.2) tutState.screenShake = 0;
  }

  drawTutorialStars(ctx);

  const isCrit = (tutorialStep === 2 && tutState.planetHealth < 50);
  drawTutorialPlanetBase(ctx, isCrit);

  tutorialTimer++;

  if (tutorialStep === 0) {
    // === STEP 1: MOVEMENT ===
    tutState.playerTargetX = 240 + Math.sin(tutorialTimer * 0.035) * 120;
    tutState.playerX += (tutState.playerTargetX - tutState.playerX) * 0.08;

    const keyA = document.getElementById('key-a');
    const keyD = document.getElementById('key-d');
    const keyLeft = document.getElementById('key-left');
    const keyRight = document.getElementById('key-right');
    const dx = tutState.playerTargetX - tutState.playerX;
    if (dx < -3) {
      if (keyA) keyA.className = "px-2.5 py-1 bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)] rounded-md text-[9px] font-bold transition-all duration-100";
      if (keyLeft) keyLeft.className = "px-2.5 py-2 bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)] rounded-md text-[9px] font-bold transition-all duration-100";
      if (keyD) keyD.className = "px-2.5 py-1 bg-[#121225] border border-slate-800 rounded-md text-[9px] text-slate-500 font-bold transition-all duration-100";
      if (keyRight) keyRight.className = "px-2.5 py-2 bg-[#121225] border border-slate-800 rounded-md text-[9px] text-slate-500 font-bold transition-all duration-100";
    } else if (dx > 3) {
      if (keyA) keyA.className = "px-2.5 py-1 bg-[#121225] border border-slate-800 rounded-md text-[9px] text-slate-500 font-bold transition-all duration-100";
      if (keyLeft) keyLeft.className = "px-2.5 py-2 bg-[#121225] border border-slate-800 rounded-md text-[9px] text-slate-500 font-bold transition-all duration-100";
      if (keyD) keyD.className = "px-2.5 py-1 bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)] rounded-md text-[9px] font-bold transition-all duration-100";
      if (keyRight) keyRight.className = "px-2.5 py-2 bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)] rounded-md text-[9px] font-bold transition-all duration-100";
    }

    ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(80, 210);
    ctx.lineTo(400, 210);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(34, 211, 238, 0.8)';
    ctx.beginPath();
    ctx.moveTo(80, 210); ctx.lineTo(90, 205); ctx.lineTo(90, 215); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(400, 210); ctx.lineTo(390, 205); ctx.lineTo(390, 215); ctx.closePath(); ctx.fill();

    drawTutorialPlayer(ctx, tutState.playerX, tutState.playerY, false, false, false, tutorialTimer);

  } else if (tutorialStep === 1) {
    // === STEP 2: SHOOT ===
    if (tutState.enemies.length === 0) {
      tutState.enemies.push({ x: 240, y: -20, vy: 1.5, hp: 3, maxHp: 3, size: 14, type: 'scout' });
    }

    if (tutorialTimer % 22 === 0) {
      tutState.bullets.push({ x: 240, y: 195, vy: -5, isPlayer: true });
      sounds.playLaser();
      const keySpace = document.getElementById('key-space');
      if (keySpace) {
        keySpace.className = "px-12 py-2 bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)] rounded-md text-[9px] font-bold uppercase tracking-widest transition-all duration-100";
        setTimeout(() => {
          const space = document.getElementById('key-space');
          if (space) space.className = "px-12 py-2 bg-[#121225] border border-slate-800 rounded-md text-[9px] text-slate-500 font-bold uppercase tracking-widest transition-all duration-100";
        }, 120);
      }
    }

    tutState.bullets.forEach((b, bIdx) => {
      b.y += b.vy;
      if (b.y < -10) tutState.bullets.splice(bIdx, 1);
    });

    tutState.enemies.forEach((e, eIdx) => {
      e.y += e.vy;
      if (e.y > 270) tutState.enemies.splice(eIdx, 1);
    });

    tutState.bullets.forEach((b, bIdx) => {
      tutState.enemies.forEach((e, eIdx) => {
        const d = Math.hypot(b.x - e.x, b.y - e.y);
        if (d < e.size + 4) {
          tutState.bullets.splice(bIdx, 1);
          e.hp--;
          for (let i = 0; i < 4; i++) {
            tutState.particles.push({
              x: b.x, y: b.y,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              color: '#ec4899', alpha: 1, decay: 0.06, size: 2
            });
          }
          if (e.hp <= 0) {
            tutState.enemies.splice(eIdx, 1);
            tutState.screenShake = 3;
            sounds.playExplosion();
            for (let i = 0; i < 12; i++) {
              tutState.particles.push({
                x: e.x, y: e.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: '#ec4899', alpha: 1, decay: 0.04, size: 3
              });
            }
          }
        }
      });
    });

    tutState.bullets.forEach(b => drawTutorialBullet(ctx, b));
    tutState.enemies.forEach(e => drawTutorialEnemy(ctx, e));
    drawTutorialPlayer(ctx, tutState.playerX, tutState.playerY, false, false, false, tutorialTimer);

  } else if (tutorialStep === 2) {
    // === STEP 3: PROTECT EARTH ===
    if (tutState.enemies.length === 0) {
      tutState.enemies.push({ x: 340, y: -20, vy: 2.2, hp: 1, maxHp: 1, size: 14, type: 'bug' });
    }

    tutState.enemies.forEach((e, eIdx) => {
      e.y += e.vy;
      if (e.y > 220) {
        tutState.enemies.splice(eIdx, 1);
        tutState.planetHealth = 20;
        tutState.warningTimer = 45;
        tutState.screenShake = 8;
        sounds.playHurt();
        for (let i = 0; i < 20; i++) {
          tutState.particles.push({
            x: e.x, y: 220,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 1) * 6,
            color: '#f43f5e', alpha: 1, decay: 0.03, size: 3
          });
        }
      }
    });

    if (tutState.planetHealth < 100 && tutState.enemies.length === 0 && tutState.warningTimer <= 0) {
      tutState.planetHealth += 2;
      if (tutState.planetHealth > 100) tutState.planetHealth = 100;
    }

    tutState.enemies.forEach(e => drawTutorialEnemy(ctx, e));
    drawTutorialPlayer(ctx, tutState.playerX, tutState.playerY, false, false, false, tutorialTimer);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(100, 15, 280, 22);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(100, 15, 280, 22);

    ctx.font = 'bold 8px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText("PLANET INTEGRITY", 110, 29);

    const barWidth = 140 * (tutState.planetHealth / 100);
    ctx.fillStyle = tutState.planetHealth > 40 ? '#10b981' : '#ef4444';
    ctx.fillRect(215, 22, barWidth, 8);
    ctx.strokeRect(215, 22, 140, 8);

    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = tutState.planetHealth > 40 ? '#10b981' : '#f43f5e';
    ctx.fillText(tutState.planetHealth + "%", 360, 29);

    if (tutState.warningTimer > 0) {
      tutState.warningTimer--;
      if (Math.floor(tutState.warningTimer / 6) % 2 === 0) {
        ctx.fillStyle = 'rgba(244, 63, 94, 0.85)';
        ctx.font = 'bold 12px monospace';
        ctx.fillText("⚠ WARNING: PLANET CORE BREACH ⚠", 130, 95);
      }
    }

  } else if (tutorialStep === 3) {
    // === STEP 4: COLLECT REWARDS ===
    if (tutState.loot.length === 0) {
      const type = Math.random() > 0.4 ? 'credit' : 'gem';
      tutState.loot.push({
        x: 120 + Math.random() * 240,
        y: 0,
        vy: 1.3,
        type: type,
        radius: type === 'credit' ? 7 : 6
      });
    }

    const activeLoot = tutState.loot[0];
    if (activeLoot) {
      tutState.playerTargetX = activeLoot.x;
    }
    tutState.playerX += (tutState.playerTargetX - tutState.playerX) * 0.08;

    tutState.loot.forEach((l, lIdx) => {
      l.y += l.vy;
      const d = Math.hypot(tutState.playerX - l.x, tutState.playerY - l.y);
      if (d < 22) {
        tutState.loot.splice(lIdx, 1);
        sounds.playPowerUp();
        const col = l.type === 'credit' ? '#facc15' : '#c084fc';
        for (let i = 0; i < 8; i++) {
          tutState.particles.push({
            x: l.x, y: l.y,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            color: col, alpha: 1, decay: 0.05, size: 2.5
          });
        }
        tutState.particles.push({
          x: l.x, y: l.y - 12,
          vx: 0, vy: -1.2,
          color: col, alpha: 1.2, decay: 0.02, size: 0,
          text: l.type === 'credit' ? "+10 CR" : "+1 GEM"
        });

        if (l.type === 'credit') {
          tutState.credits += 10;
          const tutCR = document.getElementById('tut-cr-val');
          if (tutCR) tutCR.innerText = tutState.credits;
        } else {
          tutState.gems += 1;
          const tutGems = document.getElementById('tut-gems-val');
          if (tutGems) tutGems.innerText = tutState.gems;
        }
      } else if (l.y > 250) {
        tutState.loot.splice(lIdx, 1);
      }
    });

    tutState.loot.forEach(l => drawTutorialLoot(ctx, l));
    drawTutorialPlayer(ctx, tutState.playerX, tutState.playerY, false, false, false, tutorialTimer);

  } else if (tutorialStep === 4) {
    // === STEP 5: USE ABILITIES ===
    tutState.abilityCycleTimer++;
    const cycle = tutState.abilityCycleTimer % 360;

    let healing = false;
    let shield = false;
    let activeBurst = false;

    const key1 = document.getElementById('key-1');
    const key2 = document.getElementById('key-2');
    const key3 = document.getElementById('key-3');

    if (key1) key1.className = "px-3 py-1.5 bg-[#121225] border border-slate-800 rounded-md text-[9px] text-slate-500 transition-all duration-100 flex flex-col items-center min-w-[50px]";
    if (key2) key2.className = "px-3 py-1.5 bg-[#121225] border border-slate-800 rounded-md text-[9px] text-slate-500 transition-all duration-100 flex flex-col items-center min-w-[50px]";
    if (key3) key3.className = "px-3 py-1.5 bg-[#121225] border border-slate-800 rounded-md text-[9px] text-slate-500 transition-all duration-100 flex flex-col items-center min-w-[50px]";

    if (cycle < 120) {
      const healProgress = cycle;
      if (key1) key1.className = "px-3 py-1.5 bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)] rounded-md text-[9px] transition-all duration-100 flex flex-col items-center min-w-[50px]";

      if (healProgress < 40) {
        tutState.playerHull = 25;
      } else if (healProgress === 40) {
        tutState.playerHull = 100;
        tutState.screenShake = 3;
        sounds.playSpecialActivate();
        for (let i = 0; i < 15; i++) {
          tutState.particles.push({
            x: 240, y: 210,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 1) * 3 - 1,
            color: '#10b981', alpha: 1, decay: 0.02, size: 2.5
          });
        }
        tutState.particles.push({
          x: 240, y: 195,
          vx: 0, vy: -1,
          color: '#10b981', alpha: 1.2, decay: 0.02, size: 0,
          text: "+REPAIR"
        });
      }

      if (healProgress >= 40 && healProgress < 100) {
        healing = true;
      }

      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.fillRect(150, 15, 180, 16);
      ctx.strokeRect(150, 15, 180, 16);
      ctx.font = 'bold 7px monospace';
      ctx.fillStyle = '#f43f5e';
      ctx.fillText("HULL HP", 160, 25);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(205, 19, 110 * (tutState.playerHull / 100), 8);

    } else if (cycle >= 120 && cycle < 240) {
      const turretProgress = cycle - 120;
      if (key2) key2.className = "px-3 py-1.5 bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)] rounded-md text-[9px] transition-all duration-100 flex flex-col items-center min-w-[50px]";

      if (turretProgress === 1) {
        sounds.playSpecialActivate();
        tutState.particles.push({
          x: 240, y: 195,
          vx: 0, vy: -1,
          color: '#06b6d4', alpha: 1.2, decay: 0.02, size: 0,
          text: "TURRETS ONLINE"
        });
      }

      shield = true;
      const droneRadius = 35;
      const angle1 = (tutorialTimer * 0.06);
      const angle2 = (tutorialTimer * 0.06) + Math.PI;

      const d1x = 240 + Math.cos(angle1) * droneRadius;
      const d1y = 210 + Math.sin(angle1) * droneRadius;
      const d2x = 240 + Math.cos(angle2) * droneRadius;
      const d2y = 210 + Math.sin(angle2) * droneRadius;

      ctx.fillStyle = '#38bdf8';
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#06b6d4';
      ctx.beginPath();
      ctx.arc(d1x, d1y, 4, 0, Math.PI * 2);
      ctx.arc(d2x, d2y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (turretProgress % 15 === 0) {
        tutState.bullets.push({ x: d1x, y: d1y - 5, vy: -5, isPlayer: true });
        tutState.bullets.push({ x: d2x, y: d2y - 5, vy: -5, isPlayer: true });
        sounds.playLaser();
      }

    } else if (cycle >= 240 && cycle < 360) {
      const burstProgress = cycle - 240;
      if (key3) key3.className = "px-3 py-1.5 bg-pink-500/20 border-pink-400 text-pink-400 shadow-[0_0_8px_rgba(236,72,153,0.5)] rounded-md text-[9px] transition-all duration-100 flex flex-col items-center min-w-[50px]";

      if (burstProgress === 5) {
        tutState.enemies = [
          { x: 195, y: 175, size: 10, hp: 1, type: 'bug' },
          { x: 285, y: 175, size: 10, hp: 1, type: 'bug' },
          { x: 240, y: 155, size: 10, hp: 1, type: 'bug' },
          { x: 180, y: 140, size: 10, hp: 1, type: 'bug' },
          { x: 300, y: 140, size: 10, hp: 1, type: 'bug' }
        ];
      }

      if (burstProgress === 40) {
        tutState.explosionTime = tutorialTimer;
        tutState.screenShake = 12;
        activeBurst = true;
        sounds.playExplosion();

        tutState.enemies = [];

        for (let i = 0; i < 25; i++) {
          tutState.particles.push({
            x: 240, y: 210,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            color: '#f43f5e', alpha: 1, decay: 0.03, size: 3
          });
        }
        tutState.particles.push({
          x: 240, y: 195,
          vx: 0, vy: -1,
          color: '#f43f5e', alpha: 1.2, decay: 0.02, size: 0,
          text: "BURST ATTACK!"
        });
      }

      if (burstProgress >= 40 && burstProgress < 65) {
        const radius = (burstProgress - 40) * 6;
        ctx.strokeStyle = `rgba(244, 63, 94, ${1.0 - (burstProgress - 40) / 25})`;
        ctx.lineWidth = 3;
        ctx.shadowColor = '#ec4899';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(240, 210, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    tutState.bullets.forEach((b, bIdx) => {
      b.y += b.vy;
      if (b.y < 0) tutState.bullets.splice(bIdx, 1);
      else drawTutorialBullet(ctx, b);
    });

    tutState.enemies.forEach(e => drawTutorialEnemy(ctx, e));
    drawTutorialPlayer(ctx, tutState.playerX, tutState.playerY, healing, shield, activeBurst, tutorialTimer);

  } else if (tutorialStep === 5) {
    // === STEP 6: BOSS BATTLE ===
    if (tutorialTimer < 80) {
      if (Math.floor(tutorialTimer / 8) % 2 === 0) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
        ctx.font = 'bold 12px monospace';
        ctx.fillText("⚠ WARNING: LARGE HOSTILE DETECTED ⚠", 115, 110);
      }
    } else {
      if (tutState.bossY < 65) {
        tutState.bossY += 1.2;
      }

      tutState.playerX = 240 + Math.sin(tutorialTimer * 0.03) * 110;
      tutState.bossX += (tutState.playerX - tutState.bossX) * 0.025;

      if (tutorialTimer % 45 === 0 && tutState.bossY >= 65) {
        tutState.bullets.push({ x: tutState.bossX, y: tutState.bossY + 15, vx: -1.2, vy: 3, isPlayer: false });
        tutState.bullets.push({ x: tutState.bossX, y: tutState.bossY + 15, vx: 0, vy: 3.4, isPlayer: false });
        tutState.bullets.push({ x: tutState.bossX, y: tutState.bossY + 15, vx: 1.2, vy: 3, isPlayer: false });
        sounds.playLaser();
      }

      if (tutorialTimer % 18 === 0) {
        tutState.bullets.push({ x: tutState.playerX - 6, y: tutState.playerY - 8, vx: 0, vy: -5.5, isPlayer: true });
        tutState.bullets.push({ x: tutState.playerX + 6, y: tutState.playerY - 8, vx: 0, vy: -5.5, isPlayer: true });
        sounds.playLaser();
      }

      tutState.bullets.forEach((b, bIdx) => {
        b.x += (b.vx || 0);
        b.y += b.vy;

        if (b.y < -10 || b.y > 270) {
          tutState.bullets.splice(bIdx, 1);
          return;
        }

        if (b.isPlayer) {
          const d = Math.hypot(b.x - tutState.bossX, b.y - tutState.bossY);
          if (d < 35) {
            tutState.bullets.splice(bIdx, 1);
            tutState.bossHP = Math.max(0, tutState.bossHP - 2);
            for (let i = 0; i < 3; i++) {
              tutState.particles.push({
                x: b.x, y: b.y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                color: '#fbbf24', alpha: 1, decay: 0.05, size: 2
              });
            }

            if (tutState.bossHP <= 0) {
              tutState.bossHP = 100;
              tutState.screenShake = 15;
              sounds.playExplosion();
              for (let i = 0; i < 35; i++) {
                tutState.particles.push({
                  x: tutState.bossX, y: tutState.bossY,
                  vx: (Math.random() - 0.5) * 9,
                  vy: (Math.random() - 0.5) * 9,
                  color: '#ef4444', alpha: 1, decay: 0.02, size: 3.5
                });
              }
            }
          }
        } else {
          const d = Math.hypot(b.x - tutState.playerX, b.y - tutState.playerY);
          if (d < 16) {
            tutState.bullets.splice(bIdx, 1);
            tutState.screenShake = 4;
            sounds.playShieldHit();
            for (let i = 0; i < 5; i++) {
              tutState.particles.push({
                x: b.x, y: b.y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                color: '#ef4444', alpha: 1, decay: 0.06, size: 2
              });
            }
          }
        }
      });

      if (tutState.bossY >= 65) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
        ctx.fillRect(160, 10, 160, 10);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(160, 10, 160, 10);

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(162, 12, 156 * (tutState.bossHP / 100), 6);
      }

      tutState.bullets.forEach(b => drawTutorialBullet(ctx, b));

      const mockBoss = { x: tutState.bossX, y: tutState.bossY, size: 30, type: 'boss' };
      drawTutorialEnemy(ctx, mockBoss);
    }

    drawTutorialPlayer(ctx, tutState.playerX, tutState.playerY, false, false, false, tutorialTimer);
  }

  drawTutorialParticles(ctx);

  ctx.restore();

  tutorialAnimationId = requestAnimationFrame(tutorialLoop);
}

function updateTutorialStepUI(step) {
  const indicator = document.getElementById('tutorial-step-indicator');
  if (indicator) {
    indicator.innerText = TUT_TITLES[step];
  }

  const caption = document.getElementById('tutorial-caption');
  if (caption) {
    caption.innerText = TUT_CAPTIONS[step];
  }

  const dotsContainer = document.getElementById('tutorial-progress-dots');
  if (dotsContainer) {
    let dotsHtml = '';
    for (let i = 0; i < 6; i++) {
      const activeClass = i === step ? 'bg-cyan-400 shadow-[0_0_6px_#06b6d4]' : 'bg-slate-800';
      dotsHtml += `<span class="w-1.5 h-1.5 rounded-full ${activeClass}"></span>`;
    }
    dotsContainer.innerHTML = dotsHtml;
  }

  const btnNext = document.getElementById('btn-tutorial-next');
  if (btnNext) {
    if (step === 5) {
      btnNext.innerText = "START DEFENDING EARTH";
      btnNext.className = "px-5 py-2.5 bg-pink-500 hover:bg-pink-400 text-white text-[10px] font-extrabold rounded-lg cursor-pointer uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(236,72,153,0.35)] min-w-[90px]";
    } else {
      btnNext.innerText = "NEXT";
      btnNext.className = "px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-extrabold rounded-lg cursor-pointer uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)] min-w-[90px]";
    }
  }

  const btnPrev = document.getElementById('btn-tutorial-prev');
  if (btnPrev) {
    if (step === 0) {
      btnPrev.classList.add('hidden');
    } else {
      btnPrev.classList.remove('hidden');
    }
  }

  updateTutorialKeycapsHTML(step);
  resetTutStepState(step);
}

function startTutorial() {
  tutorialRunning = true;
  tutorialStep = 0;
  tutorialTimer = 0;

  const modalHow = document.getElementById('instructions-modal');
  if (modalHow) {
    modalHow.classList.remove('hidden');
  }

  updateTutorialStepUI(tutorialStep);

  if (tutorialAnimationId) {
    cancelAnimationFrame(tutorialAnimationId);
  }
  tutorialAnimationId = requestAnimationFrame(tutorialLoop);
}

function stopTutorial() {
  tutorialRunning = false;
  if (tutorialAnimationId) {
    cancelAnimationFrame(tutorialAnimationId);
    tutorialAnimationId = null;
  }
  const modalHow = document.getElementById('instructions-modal');
  if (modalHow) {
    modalHow.classList.add('hidden');
  }
}

function initTutorialSystem() {
  const btnPrev = document.getElementById('btn-tutorial-prev');
  const btnNext = document.getElementById('btn-tutorial-next');
  const btnSkip = document.getElementById('btn-tutorial-skip');

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (tutorialStep > 0) {
        tutorialStep--;
        updateTutorialStepUI(tutorialStep);
        sounds.playLaser();
      }
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (tutorialStep < 5) {
        tutorialStep++;
        updateTutorialStepUI(tutorialStep);
        sounds.playLaser();
      } else {
        stopTutorial();
        sounds.init();
        showScreen('gameplay-container');
        if (currentGameInstance) {
          currentGameInstance.destroy();
        }
        currentGameInstance = createGame();
        currentGameInstance.start();
      }
    });
  }

  if (btnSkip) {
    btnSkip.addEventListener('click', () => {
      stopTutorial();
      sounds.init();
      showScreen('gameplay-container');
      if (currentGameInstance) {
        currentGameInstance.destroy();
      }
      currentGameInstance = createGame();
      currentGameInstance.start();
    });
  }
}

// Global start
window.addEventListener('DOMContentLoaded', () => {
  initSplashScreen();
  initMenuSystem();
});
