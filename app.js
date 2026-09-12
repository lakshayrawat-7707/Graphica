/**
 * ============================================================================
 * QuestLog - OSS Edition | RPG Focus & Habit Dashboard
 * Battle Royale Character Studio, Weapons Vault & Dynamic Themes
 * ============================================================================
 * Strictly Vanilla JavaScript Architecture:
 * - SoundFX: Procedural Web Audio API sound synthesizer
 * - ConfettiEngine: Canvas-based particle explosion system
 * - ThemeManager: Dynamic Level-Up Themes (Rookie, Elite, Master) & Previewer
 * - StorageManager: LocalStorage state persistence & mock data seeding
 * - AuthManager: Mock login gateway & operator session control
 * - Inventory & AvatarManager: Layered SVG avatar, Weapons Vault & Free Fire VFX
 * - StreakManager: 7-day consistency heatmap & daily bounty system
 * - PlayerManager: Progression, XP curve, rank titles, and level-up celebrations
 * - TimerManager: Pomodoro Arena countdown & SVG progress ring
 * - QuestManager: Active & Completed bounty board management
 */

'use strict';

/* ============================================================================
   1. PROCEDURAL SOUND SYNTHESIZER (WEB AUDIO API)
   ============================================================================ */
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playEquip(isWeapon = false) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (isWeapon) {
      // Metallic slice / cocking sound for weapons
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  playQuestComplete() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50];

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.15, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.3);
    });
  }

  playLevelUp() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const fanfareNotes = [261.63, 392.00, 523.25, 659.25, 783.99, 1046.50];

    fanfareNotes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0.18, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + (idx === fanfareNotes.length - 1 ? 0.6 : 0.25));

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.65);
    });
  }

  playTimerComplete() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.8);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.25);
  }
}

const soundFX = new SoundFX();

// Extra feedback sounds used by Weekly Tasks, Activities, Badges and Tests.
SoundFX.prototype.playReward = function() {
  if (!this.enabled) return; this.init(); if (!this.ctx) return;
  const now = this.ctx.currentTime; const notes = [659.25, 783.99, 1046.50];
  notes.forEach((f,i) => { const o=this.ctx.createOscillator(), g=this.ctx.createGain(); o.type='triangle'; o.frequency.value=f; g.gain.setValueAtTime(0.16,now+i*.08); g.gain.exponentialRampToValueAtTime(.001,now+i*.08+.22); o.connect(g); g.connect(this.ctx.destination); o.start(now+i*.08); o.stop(now+i*.08+.24); });
};
SoundFX.prototype.playBadge = function() {
  if (!this.enabled) return; this.init(); if (!this.ctx) return;
  const now=this.ctx.currentTime, o=this.ctx.createOscillator(), g=this.ctx.createGain(); o.type='sine'; o.frequency.setValueAtTime(440,now); o.frequency.exponentialRampToValueAtTime(1320,now+.35); g.gain.setValueAtTime(.2,now); g.gain.exponentialRampToValueAtTime(.001,now+.45); o.connect(g); g.connect(this.ctx.destination); o.start(now); o.stop(now+.5);
};


/* ============================================================================
   2. FULLSCREEN CANVAS CONFETTI PARTICLE ENGINE
   ============================================================================ */
class ConfettiEngine {
  constructor() {
    this.canvas = document.getElementById('confetti-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.animationFrame = null;
    this.colors = ['#00d2ff', '#8a2be2', '#38bdf8', '#fbbf24', '#10b981', '#ffffff', '#f43f5e'];

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(count = 120) {
    if (!this.canvas || !this.ctx) return;
    this.resize();

    const originX = this.canvas.width / 2;
    const originY = this.canvas.height / 3;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 5;
      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: Math.random() * 8 + 4,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 70 + 80
      });
    }

    if (!this.animationFrame) {
      this.loop();
    }
  }

  loop() {
    if (this.particles.length === 0) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.animationFrame = null;
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25;
      p.vx *= 0.98;
      p.rotation += p.rotationSpeed;
      p.life++;
      p.opacity = Math.max(0, 1 - p.life / p.maxLife);

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      this.ctx.restore();

      if (p.life >= p.maxLife || p.y > this.canvas.height) {
        this.particles.splice(i, 1);
      }
    }

    this.animationFrame = requestAnimationFrame(() => this.loop());
  }
}

const confettiEngine = new ConfettiEngine();


/* ============================================================================
   3. DYNAMIC LEVEL-UP THEMES ENGINE (CORE FEATURE 1)
   ============================================================================ */
class ThemeManager {
  constructor(playerManager) {
    this.playerManager = playerManager;
    this.themeToggleBtn = document.getElementById('theme-toggle-btn');
    this.themeBadgeText = document.getElementById('theme-badge-text');

    // Manual override preview state: 'auto' | 'rookie' | 'elite' | 'master'
    this.manualOverride = StorageManager.loadThemePreference();

    this.init();
  }

  init() {
    this.applyTheme();

    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener('click', () => {
        soundFX.playClick();
        this.cycleThemePreview();
      });
    }
  }

  // Calculate theme based on player level:
  // Level 1-4: Rookie | Level 5-9: Elite | Level 10+: Master
  getExpectedThemeForLevel(level) {
    if (level >= 10) return 'master';
    if (level >= 5) return 'elite';
    return 'rookie';
  }

  applyTheme() {
    const level = this.playerManager ? this.playerManager.state.level : 1;
    const activeTheme = (this.manualOverride && this.manualOverride !== 'auto')
      ? this.manualOverride
      : this.getExpectedThemeForLevel(level);

    // Remove old themes
    document.body.classList.remove('theme-rookie', 'theme-elite', 'theme-master');
    document.body.classList.add(`theme-${activeTheme}`);

    // Update Header Badge Text
    if (this.themeBadgeText) {
      const isManual = this.manualOverride && this.manualOverride !== 'auto';
      const labelMap = {
        rookie: 'ROOKIE THEME (LVL 1-4)',
        elite: 'ELITE THEME (LVL 5-9)',
        master: 'MASTER THEME (LVL 10+)'
      };
      this.themeBadgeText.textContent = `${labelMap[activeTheme] || 'THEME'} ${isManual ? '(PREVIEW)' : ''}`;
    }
  }

  cycleThemePreview() {
    const cycle = ['auto', 'rookie', 'elite', 'master'];
    const currentIdx = cycle.indexOf(this.manualOverride || 'auto');
    const nextIdx = (currentIdx + 1) % cycle.length;
    this.manualOverride = cycle[nextIdx];
    StorageManager.saveThemePreference(this.manualOverride);
    this.applyTheme();
  }

  onLevelUp() {
    // If set to auto, upgrade theme smoothly
    if (!this.manualOverride || this.manualOverride === 'auto') {
      this.applyTheme();
    }
  }
}


/* ============================================================================
   4. DATA PERSISTENCE & STORAGE KEYS
   ============================================================================ */
const STORAGE_KEYS = {
  AUTH_USER: 'questlog_gamertag_v3',
  PLAYER: 'questlog_player_data_v3',
  EQUIPPED: 'questlog_equipped_loadout_v3',
  STREAK_MATRIX: 'questlog_streak_matrix_v3',
  ACTIVE_QUESTS: 'questlog_active_quests_v3',
  COMPLETED_QUESTS: 'questlog_completed_quests_v3',
  SETTINGS: 'questlog_settings_v3',
  THEME: 'questlog_theme_pref_v3',
  VIBE: 'questlog_3d_vibe_v3',
  WEEKLY: 'questlog_weekly_v1',
  ACTIVITIES: 'questlog_activities_v1',
  TESTS: 'questlog_tests_v1'
};

const DEFAULT_MOCK_QUESTS = [
  {
    id: 'mock-1',
    title: 'Master C++ Dynamic Vectors & Memory Allocation',
    difficulty: 'legendary',
    xp: 250,
    tierLabel: 'Legendary',
    createdAt: Date.now() - 3600000 * 4
  },
  {
    id: 'mock-2',
    title: 'Grind 5 HackerRank Array Manipulation Challenges',
    difficulty: 'normal',
    xp: 100,
    tierLabel: 'Veteran',
    createdAt: Date.now() - 3600000 * 3
  },
  {
    id: 'mock-3',
    title: 'Finish AIT OSS Club Open Source Contribution',
    difficulty: 'legendary',
    xp: 250,
    tierLabel: 'Legendary',
    createdAt: Date.now() - 3600000 * 2
  },
  {
    id: 'mock-4',
    title: 'Optimize Network Routing for Low-Ping Web Games',
    difficulty: 'normal',
    xp: 100,
    tierLabel: 'Veteran',
    createdAt: Date.now() - 3600000 * 1
  }
];

const DEFAULT_PLAYER_STATE = {
  level: 1,
  currentXP: 0,
  totalXPEarned: 0,
  streakDays: 3,
  lastDailyClaim: null,
  focusMinutes: 0,
  questsClearedCount: 0
};

// 4-Slot Loadout: Head, Torso, Weapon, Accessory
const DEFAULT_EQUIPPED_LOADOUT = {
  head: 'item-head-1',
  torso: 'item-torso-1',
  weapon: 'item-weapon-1',
  accessory: 'item-acc-1'
};

const DEFAULT_STREAK_MATRIX = [
  { day: 'Mon', level: 2 },
  { day: 'Tue', level: 3 },
  { day: 'Wed', level: 1 },
  { day: 'Thu', level: 2 },
  { day: 'Fri', level: 3 },
  { day: 'Sat', level: 3 },
  { day: 'Sun', level: 2 }
];

const StorageManager = {
  getAuthUser() {
    return localStorage.getItem(STORAGE_KEYS.AUTH_USER) || null;
  },

  setAuthUser(tag) {
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, tag);
  },

  clearAuthUser() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  },

  loadPlayer() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PLAYER);
      return raw ? JSON.parse(raw) : { ...DEFAULT_PLAYER_STATE };
    } catch (e) {
      return { ...DEFAULT_PLAYER_STATE };
    }
  },

  savePlayer(playerState) {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYER, JSON.stringify(playerState));
    } catch (e) {}
  },

  loadEquipped() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.EQUIPPED);
      return raw ? JSON.parse(raw) : { ...DEFAULT_EQUIPPED_LOADOUT };
    } catch (e) {
      return { ...DEFAULT_EQUIPPED_LOADOUT };
    }
  },

  saveEquipped(loadout) {
    try {
      localStorage.setItem(STORAGE_KEYS.EQUIPPED, JSON.stringify(loadout));
    } catch (e) {}
  },

  loadStreakMatrix() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.STREAK_MATRIX);
      return raw ? JSON.parse(raw) : [...DEFAULT_STREAK_MATRIX];
    } catch (e) {
      return [...DEFAULT_STREAK_MATRIX];
    }
  },

  saveStreakMatrix(matrix) {
    try {
      localStorage.setItem(STORAGE_KEYS.STREAK_MATRIX, JSON.stringify(matrix));
    } catch (e) {}
  },

  loadActiveQuests() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_QUESTS);
      if (raw) {
        const list = JSON.parse(raw);
        return list.map(q => {
          if (q.difficulty === 'boss') {
            return { ...q, difficulty: 'legendary', tierLabel: 'Legendary' };
          }
          return q;
        });
      }
      this.saveActiveQuests(DEFAULT_MOCK_QUESTS);
      return [...DEFAULT_MOCK_QUESTS];
    } catch (e) {
      return [...DEFAULT_MOCK_QUESTS];
    }
  },

  saveActiveQuests(quests) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_QUESTS, JSON.stringify(quests));
    } catch (e) {}
  },

  loadCompletedQuests() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED_QUESTS);
      if (raw) {
        const list = JSON.parse(raw);
        return list.map(q => {
          if (q.difficulty === 'boss') {
            return { ...q, difficulty: 'legendary', tierLabel: 'Legendary' };
          }
          return q;
        });
      }
      return [];
    } catch (e) {
      return [];
    }
  },

  saveCompletedQuests(quests) {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPLETED_QUESTS, JSON.stringify(quests));
    } catch (e) {}
  },

  loadSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return raw ? JSON.parse(raw) : { sound: true };
    } catch (e) {
      return { sound: true };
    }
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {}
  },

  loadThemePreference() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'auto';
  },

  saveThemePreference(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  loadVibePreference() {
    return localStorage.getItem(STORAGE_KEYS.VIBE) || 'neon-strike';
  },

  saveVibePreference(vibe) {
    localStorage.setItem(STORAGE_KEYS.VIBE, vibe);
  },

  loadJSON(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
  },

  saveJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  },

  resetAll() {
    localStorage.clear();
  }
};


/* ============================================================================
   5. CORE FEATURE 1: MOCK AUTHENTICATION GATEWAY
   ============================================================================ */
class AuthManager {
  constructor(onLoginSuccess) {
    this.onLoginSuccess = onLoginSuccess;
    this.authGatewayEl = document.getElementById('auth-gateway');
    this.mainAppEl = document.getElementById('main-app');
    this.loginForm = document.getElementById('login-form');
    this.gamerTagInput = document.getElementById('login-gamertag');
    this.passwordInput = document.getElementById('login-password');
    this.logoutBtn = document.getElementById('logout-btn');
    this.headerGamerTagEl = document.getElementById('header-gamertag-val');
    this.studioGamerTagEl = document.getElementById('studio-gamertag');
    this.quickTagButtons = document.querySelectorAll('.quick-tag-pill');

    this.init();
  }

  init() {
    this.quickTagButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        soundFX.playClick();
        if (this.gamerTagInput) {
          this.gamerTagInput.value = btn.dataset.tag;
          if (this.passwordInput) this.passwordInput.value = 'password123';
        }
      });
    });

    if (this.loginForm) {
      this.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }

    const loginBtn = document.getElementById('login-submit-btn');
    if (loginBtn) {
      loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }

    if (this.logoutBtn) {
      this.logoutBtn.addEventListener('click', () => {
        soundFX.playClick();
        this.handleLogout();
      });
    }

    const savedUser = StorageManager.getAuthUser();
    if (savedUser) {
      this.applyUser(savedUser);
      this.showDashboardImmediate();
    } else {
      this.showLoginImmediate();
    }
  }

  handleLogin() {
    const tag = this.gamerTagInput.value.trim() || 'CyberVanguard';
    soundFX.playClick();
    soundFX.playEquip(false);

    StorageManager.setAuthUser(tag);
    this.applyUser(tag);

    if (this.authGatewayEl) {
      this.authGatewayEl.classList.add('fade-out');
      setTimeout(() => {
        this.authGatewayEl.style.display = 'none';
        this.authGatewayEl.classList.remove('fade-out');
        if (this.mainAppEl) {
          this.mainAppEl.style.display = 'flex';
        }
        if (this.onLoginSuccess) {
          this.onLoginSuccess(tag);
        }
      }, 450);
    }
  }

  handleLogout() {
    StorageManager.clearAuthUser();
    if (this.mainAppEl) this.mainAppEl.style.display = 'none';
    if (this.authGatewayEl) {
      this.authGatewayEl.style.display = 'flex';
      this.authGatewayEl.classList.remove('fade-out');
      if (this.gamerTagInput) this.gamerTagInput.value = '';
      if (this.passwordInput) this.passwordInput.value = '';
    }
  }

  applyUser(tag) {
    if (this.headerGamerTagEl) this.headerGamerTagEl.textContent = tag.toUpperCase();
    if (this.studioGamerTagEl) this.studioGamerTagEl.textContent = tag.toUpperCase();
  }

  showDashboardImmediate() {
    if (this.authGatewayEl) this.authGatewayEl.style.display = 'none';
    if (this.mainAppEl) this.mainAppEl.style.display = 'flex';
    if (this.onLoginSuccess) this.onLoginSuccess(StorageManager.getAuthUser());
  }

  showLoginImmediate() {
    if (this.authGatewayEl) this.authGatewayEl.style.display = 'flex';
    if (this.mainAppEl) this.mainAppEl.style.display = 'none';
  }
}


/* ============================================================================
   6. CORE FEATURE 2 & 3: WEAPONS VAULT & 'FREE FIRE' STYLE ANIMATED AVATAR
   ============================================================================ */
const VAULT_ITEMS_CATALOG = [
  // --- HEADGEAR ---
  {
    id: 'item-head-1',
    name: 'Default Cyber Hair',
    category: 'head',
    icon: '⚡',
    rarity: 'common',
    minLevel: 1,
    desc: 'Standard-issue cyber-infused spiking hair with electric cyan highlights.',
    svgType: 'hair'
  },
  {
    id: 'item-head-2',
    name: 'Code Headset',
    category: 'head',
    icon: '🎧',
    rarity: 'rare',
    minLevel: 2,
    desc: 'High-fidelity acoustic isolation headset streaming 120BPM lofi synthwave for deep focus.',
    svgType: 'headset'
  },
  {
    id: 'item-head-3',
    name: 'Tactical Visor',
    category: 'head',
    icon: '🥽',
    rarity: 'epic',
    minLevel: 3,
    desc: 'Augmented reality heads-up display analyzing code complexity and syntax anomalies in real time.',
    svgType: 'visor'
  },
  {
    id: 'item-head-4',
    name: "Hacker's Crown",
    category: 'head',
    icon: '👑',
    rarity: 'legendary',
    minLevel: 5,
    desc: 'A radiant golden cybernetic tiara with continuous hover bobbing and glowing aura. Awarded at Level 5.',
    svgType: 'crown'
  },

  // --- TORSO CLOTHING ---
  {
    id: 'item-torso-1',
    name: "Beginner's Hoodie",
    category: 'torso',
    icon: '🥋',
    rarity: 'common',
    minLevel: 1,
    desc: 'Comfortable oversized dark-charcoal hoodie with neon purple stitch lining.',
    svgType: 'hoodie'
  },
  {
    id: 'item-torso-2',
    name: 'OSS Jacket',
    category: 'torso',
    icon: '🧥',
    rarity: 'rare',
    minLevel: 2,
    desc: 'Tactical open-source club jacket decorated with contribution patches and electric blue trim.',
    svgType: 'oss_jacket'
  },
  {
    id: 'item-torso-3',
    name: 'Neon Cyber Armor',
    category: 'torso',
    icon: '🛡️',
    rarity: 'epic',
    minLevel: 4,
    desc: 'Kinetic plating forged from recycled titanium and pulsating with luminescent cyan circuitry.',
    svgType: 'cyber_armor'
  },
  {
    id: 'item-torso-4',
    name: 'Quantum Overlord Trench',
    category: 'torso',
    icon: '🌌',
    rarity: 'legendary',
    minLevel: 7,
    desc: 'An ominous flow coat woven from dark matter and zero-point energy fields.',
    svgType: 'overlord_trench'
  },

  // --- CORE FEATURE 2: WEAPONS (GUNS & KATANAS) ---
  {
    id: 'item-weapon-1',
    name: 'Bare Cyber Gauntlets',
    category: 'weapon',
    icon: '👊',
    rarity: 'common',
    minLevel: 1,
    desc: 'Unarmed martial arts gauntlets with shock dampening knuckles.',
    svgType: 'fists'
  },
  {
    id: 'item-weapon-2',
    name: 'Cyber Katana',
    category: 'weapon',
    icon: '⚔️',
    rarity: 'epic',
    minLevel: 4,
    desc: 'High-frequency monomolecular blade with a diagonal 3-second glint shine animation and back scabbard sheath.',
    svgType: 'katana'
  },
  {
    id: 'item-weapon-3',
    name: 'Sci-Fi Plasma Gun',
    category: 'weapon',
    icon: '🔫',
    rarity: 'rare',
    minLevel: 5,
    desc: 'High-tech particle blaster with a breathing-glow neon barrel and recoil physics on hover.',
    svgType: 'gun'
  },
  {
    id: 'item-weapon-4',
    name: 'Quantum Void Cannon',
    category: 'weapon',
    icon: '☄️',
    rarity: 'legendary',
    minLevel: 10,
    desc: 'Grandmaster anti-matter beam projector with dual magnetic containment coils.',
    svgType: 'void_cannon'
  },

  // --- ACCESSORIES / RELICS ---
  {
    id: 'item-acc-1',
    name: 'Quantum Aura Field',
    category: 'accessory',
    icon: '✨',
    rarity: 'common',
    minLevel: 1,
    desc: 'Passive particle shield that boosts mental stamina.',
    svgType: 'aura'
  },
  {
    id: 'item-acc-2',
    name: 'Plasma Dagger',
    category: 'accessory',
    icon: '🗡️',
    rarity: 'rare',
    minLevel: 2,
    desc: 'Off-hand ionized tactical parrying dagger.',
    svgType: 'dagger'
  },
  {
    id: 'item-acc-3',
    name: 'Holographic Neural Pet',
    category: 'accessory',
    icon: '🤖',
    rarity: 'legendary',
    minLevel: 6,
    desc: 'Sentient cyber-familiar floating at your shoulder, cheering focus streaks.',
    svgType: 'drone'
  }
];

/* ============================================================================
   6.4. INTELLIGENT DYNAMIC EQUIP MANAGER (SKELETON AUTO-MAPPING & FUZZY MATCHER)
   ============================================================================ */
class DynamicEquipManager {
  constructor(engine) {
    this.engine = engine;
    this.boneMap = {
      HeadTarget: null,
      TorsoTarget: null,
      RightHandBone: null,
      LeftHandBone: null,
      BackSheathBone: null,
      PelvisBone: null,
      headMeshes: [],
      torsoMeshes: [],
      legMeshes: [],
      allMeshes: []
    };
    this.targets = this.boneMap;
    this.currentWeaponModel = null;
    this.currentScabbardModel = null;
    this.currentHeadgearModel = null;
    this.currentAccessoryModel = null;
  }

  get HeadTarget() {
    return (this.boneMap && this.boneMap.HeadTarget) || (this.targets && (this.targets.HeadTarget || this.targets.headTarget));
  }

  get TorsoTarget() {
    return (this.boneMap && this.boneMap.TorsoTarget) || (this.targets && (this.targets.TorsoTarget || this.targets.torsoTarget));
  }

  get RightHandBone() {
    return (this.boneMap && this.boneMap.RightHandBone) || (this.targets && (this.targets.RightHandBone || this.targets.rightHandBone));
  }

  get LeftHandBone() {
    return (this.boneMap && this.boneMap.LeftHandBone) || (this.targets && (this.targets.LeftHandBone || this.targets.leftHandBone));
  }

  // 1. AUTO-MAP THE SKELETON WITH FUZZY NAME MATCHING
  autoMapSkeleton(rootObject) {
    if (!rootObject) return;

    // Reset boneMap dictionary
    this.boneMap = {
      HeadTarget: null,
      TorsoTarget: null,
      RightHandBone: null,
      LeftHandBone: null,
      BackSheathBone: null,
      PelvisBone: null,
      headMeshes: [],
      torsoMeshes: [],
      legMeshes: [],
      allMeshes: []
    };
    this.targets = this.boneMap;
    // Lowercase synonyms for backward compatibility
    this.targets.headTarget = null;
    this.targets.torsoTarget = null;
    this.targets.rightHandBone = null;
    this.targets.leftHandBone = null;
    this.targets.backSheathBone = null;
    this.targets.pelvisBone = null;

    console.log('🔍 [DynamicEquipManager] Auto-mapping skeleton and scanning 3D hierarchy with traverse()...');

    // Traverse all children using Three.js traverse()
    rootObject.traverse((child) => {
      const rawName = child.name || '';
      const name = rawName.toLowerCase();
      const clean = name.replace(/[\s\-_.:]/g, '');

      // Catalog all renderable meshes
      if (child.isMesh || child.isSkinnedMesh) {
        this.boneMap.allMeshes.push(child);
        child.castShadow = true;
        child.receiveShadow = true;

        // Categorize meshes by fuzzy name keywords
        if (/jacket|torso|chest|hoodie|shirt|top|vest|coat|armor|body|suit|trench|cloth/i.test(name)) {
          this.boneMap.torsoMeshes.push(child);
        }
        if (/head|face|hair|helmet|visor|hat|crown|glasses|headset|cap|mask/i.test(name)) {
          this.boneMap.headMeshes.push(child);
        }
        if (/leg|pant|boot|shoe|feet|foot|thigh|shin|calf/i.test(name)) {
          this.boneMap.legMeshes.push(child);
        }
      }

      // Fuzzy Name Matching for RightHandBone (Weapon Socket)
      // Matches: "hand.r", "righthand", "mixamorig_righthand", "mixamorig:righthand", "wrist.r", "handr", "r_hand", "hand_r", etc.
      if (!this.boneMap.RightHandBone) {
        if (
          name.includes('hand.r') ||
          name.includes('hand_r') ||
          name.includes('r_hand') ||
          name.includes('righthand') ||
          name.includes('mixamorig_righthand') ||
          name.includes('mixamorig:righthand') ||
          clean.includes('righthand') ||
          clean.includes('handr') ||
          name.includes('wrist.r') ||
          name.includes('wrist_r') ||
          name.includes('r_wrist') ||
          name.includes('b_r_hand') ||
          name.includes('bip01_r_hand')
        ) {
          this.boneMap.RightHandBone = child;
          this.targets.RightHandBone = child;
          this.targets.rightHandBone = child;
          console.log(`✅ [DynamicEquipManager] Auto-mapped RightHandBone: "${rawName}" (Type: ${child.type})`);
        }
      }

      // Fuzzy Name Matching for LeftHandBone
      // Matches: "hand.l", "lefthand", "mixamorig_lefthand", "mixamorig:lefthand", "wrist.l", "handl", "l_hand", "hand_l", etc.
      if (!this.boneMap.LeftHandBone) {
        if (
          name.includes('hand.l') ||
          name.includes('hand_l') ||
          name.includes('l_hand') ||
          name.includes('lefthand') ||
          name.includes('mixamorig_lefthand') ||
          name.includes('mixamorig:lefthand') ||
          clean.includes('lefthand') ||
          clean.includes('handl') ||
          name.includes('wrist.l') ||
          name.includes('wrist_l') ||
          name.includes('l_wrist') ||
          name.includes('b_l_hand') ||
          name.includes('bip01_l_hand')
        ) {
          this.boneMap.LeftHandBone = child;
          this.targets.LeftHandBone = child;
          this.targets.leftHandBone = child;
          console.log(`✅ [DynamicEquipManager] Auto-mapped LeftHandBone: "${rawName}" (Type: ${child.type})`);
        }
      }

      // Fuzzy Name Matching for HeadTarget
      // Matches: "head", "neck", "mixamorig_head", "mixamorig:head", "mixamorighead", "b_head", "bip01_head"
      if (!this.boneMap.HeadTarget) {
        if (
          name.includes('mixamorig_head') ||
          name.includes('mixamorig:head') ||
          name.includes('head') ||
          name.includes('neck') ||
          clean.includes('head') ||
          clean.includes('neck') ||
          name.includes('b_head') ||
          name.includes('bip01_head')
        ) {
          this.boneMap.HeadTarget = child;
          this.targets.HeadTarget = child;
          this.targets.headTarget = child;
          console.log(`✅ [DynamicEquipManager] Auto-mapped HeadTarget: "${rawName}" (Type: ${child.type})`);
        }
      }

      // Fuzzy Name Matching for TorsoTarget
      // Matches: "spine", "torso", "chest", "jacket", "mixamorig_spine2", "mixamorig_chest", "upperbody"
      if (!this.boneMap.TorsoTarget) {
        if (
          name.includes('mixamorig_spine') ||
          name.includes('mixamorig_chest') ||
          name.includes('mixamorig:spine') ||
          name.includes('mixamorig:chest') ||
          name.includes('spine') ||
          name.includes('chest') ||
          name.includes('torso') ||
          name.includes('jacket') ||
          clean.includes('spine') ||
          clean.includes('chest') ||
          clean.includes('torso') ||
          clean.includes('jacket')
        ) {
          this.boneMap.TorsoTarget = child;
          this.targets.TorsoTarget = child;
          this.targets.torsoTarget = child;
          console.log(`✅ [DynamicEquipManager] Auto-mapped TorsoTarget: "${rawName}" (Type: ${child.type})`);
        }
      }

      // Fuzzy Name Matching for BackSheathBone
      if (!this.boneMap.BackSheathBone) {
        if (/back|sheath|scabbard|saya|holster/i.test(name)) {
          this.boneMap.BackSheathBone = child;
          this.targets.BackSheathBone = child;
          this.targets.backSheathBone = child;
        }
      }

      // Pelvis / Hips
      if (!this.boneMap.PelvisBone) {
        if (/hips|pelvis|root/i.test(name)) {
          this.boneMap.PelvisBone = child;
          this.targets.PelvisBone = child;
          this.targets.pelvisBone = child;
        }
      }
    });

    // Fallbacks to procedural joints if not matched in external GLTF
    if (!this.boneMap.RightHandBone && this.engine.rightHandSocket) {
      this.boneMap.RightHandBone = this.engine.rightHandSocket;
      this.targets.RightHandBone = this.engine.rightHandSocket;
      this.targets.rightHandBone = this.engine.rightHandSocket;
    }
    if (!this.boneMap.LeftHandBone && this.engine.leftArmBone) {
      this.boneMap.LeftHandBone = this.engine.leftArmBone;
      this.targets.LeftHandBone = this.engine.leftArmBone;
      this.targets.leftHandBone = this.engine.leftArmBone;
    }
    if (!this.boneMap.HeadTarget && this.engine.headSocket) {
      this.boneMap.HeadTarget = this.engine.headSocket;
      this.targets.HeadTarget = this.engine.headSocket;
      this.targets.headTarget = this.engine.headSocket;
    }
    if (!this.boneMap.TorsoTarget && this.engine.chestBone) {
      this.boneMap.TorsoTarget = this.engine.chestBone;
      this.targets.TorsoTarget = this.engine.chestBone;
      this.targets.torsoTarget = this.engine.chestBone;
    }
    if (!this.boneMap.BackSheathBone && this.engine.backSheathSocket) {
      this.boneMap.BackSheathBone = this.engine.backSheathSocket;
      this.targets.BackSheathBone = this.engine.backSheathSocket;
      this.targets.backSheathBone = this.engine.backSheathSocket;
    }

    console.log('🎯 [DynamicEquipManager] Auto-Map Skeleton Summary (Dictionary):', {
      HeadTarget: this.boneMap.HeadTarget ? this.boneMap.HeadTarget.name : 'none',
      TorsoTarget: this.boneMap.TorsoTarget ? this.boneMap.TorsoTarget.name : 'none',
      RightHandBone: this.boneMap.RightHandBone ? this.boneMap.RightHandBone.name : 'none',
      LeftHandBone: this.boneMap.LeftHandBone ? this.boneMap.LeftHandBone.name : 'none',
      torsoMeshes: this.boneMap.torsoMeshes.map(m => m.name),
      headMeshes: this.boneMap.headMeshes.map(m => m.name),
      totalRenderableMeshes: this.boneMap.allMeshes.length
    });
  }

  // 2. DYNAMIC TORSO / JACKET / CLOTHING EQUIPPING
  equipTorso(item) {
    if (!item) return;

    // Palette & Material definition for each tier
    let materialConfig = {
      color: 0x1a1d2e,
      roughness: 0.35,
      metalness: 0.75,
      emissive: 0x000000,
      emissiveIntensity: 0
    };

    if (item.id === 'item-torso-1') {
      // Beginner's Hoodie: Dark charcoal tactical fabric
      materialConfig = {
        color: 0x1f212d,
        roughness: 0.8,
        metalness: 0.15,
        emissive: 0x8a2be2,
        emissiveIntensity: 0.25
      };
    } else if (item.id === 'item-torso-2') {
      // OSS Jacket: Tactical open-source midnight navy with cyan accents
      materialConfig = {
        color: 0x16223a,
        roughness: 0.45,
        metalness: 0.65,
        emissive: 0x00d2ff,
        emissiveIntensity: 0.45
      };
    } else if (item.id === 'item-torso-3') {
      // Neon Cyber Armor: Beveled titanium plating with glowing cyan circuitry
      materialConfig = {
        color: 0x101322,
        roughness: 0.2,
        metalness: 0.88,
        emissive: 0x00f3ff,
        emissiveIntensity: 1.6
      };
    } else if (item.id === 'item-torso-4') {
      // Quantum Overlord Trench: Obsidian coat with dark matter emerald glow
      materialConfig = {
        color: 0x090a12,
        roughness: 0.14,
        metalness: 0.92,
        emissive: 0x10b981,
        emissiveIntensity: 1.8
      };
    }

    // Apply new MeshStandardMaterial to dynamically mapped torso meshes
    let updatedCount = 0;
    if (this.targets.torsoMeshes.length > 0) {
      this.targets.torsoMeshes.forEach((mesh) => {
        mesh.material = new THREE.MeshStandardMaterial(materialConfig);
        mesh.material.needsUpdate = true; // FORCE RENDER
        updatedCount++;
        console.log(`[DynamicEquipManager] Successfully updated material on mesh: "${mesh.name}" for "${item.name}" (needsUpdate = true)`);
      });
    }

    // Also update procedural armor plates in chestBone if present
    if (this.engine.materials && this.engine.materials.armor) {
      this.engine.materials.armor.color.setHex(materialConfig.color);
      this.engine.materials.armor.roughness = materialConfig.roughness;
      this.engine.materials.armor.metalness = materialConfig.metalness;
      this.engine.materials.armor.needsUpdate = true; // FORCE RENDER
      console.log(`[DynamicEquipManager] Successfully updated procedural armor material for "${item.name}" (needsUpdate = true)`);
    }

    this.forceRender();
  }

  // 3. DYNAMIC HEADGEAR EQUIPPING (.add() TO HEAD TARGET)
  equipHeadgear(item) {
    if (!item) return;

    // Remove previous headgear model from head target
    if (this.currentHeadgearModel && this.targets.headTarget) {
      this.targets.headTarget.remove(this.currentHeadgearModel);
      this.currentHeadgearModel = null;
    }
    if (this.engine.headSocket) {
      while (this.engine.headSocket.children.length > 0) {
        this.engine.headSocket.remove(this.engine.headSocket.children[0]);
      }
    }
    this.engine.floatingCrownGroup = null;

    const targetBone = this.targets.headTarget || this.engine.headSocket;
    if (!targetBone) {
      console.warn('[DynamicEquipManager] No HeadTarget bone available to attach headgear.');
      return;
    }

    if (item.id === 'item-head-4') {
      // 👑 HACKER'S CROWN: Radiant Golden Cyber Tiara (.add() to HeadTarget)
      const crownGroup = new THREE.Group();
      crownGroup.position.set(0, 0.22, 0);

      const circletGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.035, 24, 1, true);
      const circlet = new THREE.Mesh(circletGeo, this.engine.materials.gold);
      circlet.material.needsUpdate = true;
      crownGroup.add(circlet);

      for (let i = 0; i < 5; i++) {
        const spikeGeo = new THREE.ConeGeometry(0.035, 0.14, 8);
        const spike = new THREE.Mesh(spikeGeo, this.engine.materials.gold);
        spike.material.needsUpdate = true;
        const angle = (i / 5) * Math.PI * 2;
        spike.position.set(Math.cos(angle) * 0.16, 0.07, Math.sin(angle) * 0.16);
        crownGroup.add(spike);

        const gemGeo = new THREE.SphereGeometry(0.018, 8, 8);
        const gemMat = (i % 2 === 0) ? this.engine.materials.emissivePrimary : this.engine.materials.emissiveSecondary;
        gemMat.needsUpdate = true;
        const gem = new THREE.Mesh(gemGeo, gemMat);
        gem.position.set(Math.cos(angle) * 0.16, 0.14, Math.sin(angle) * 0.16);
        crownGroup.add(gem);
      }

      // Use .add() to attach to mapped HeadTarget!
      targetBone.add(crownGroup);
      this.currentHeadgearModel = crownGroup;
      this.engine.floatingCrownGroup = crownGroup;

      console.log(`[DynamicEquipManager] Successfully attached 3D Hacker's Crown to HeadTarget: "${targetBone.name}" (needsUpdate = true)`);

    } else if (item.id === 'item-head-2') {
      // 🎧 CODE HEADSET: High-Fidelity Acoustic Isolation Headset
      const headsetGroup = new THREE.Group();
      headsetGroup.position.set(0, 0.05, 0);

      const bandGeo = new THREE.TorusGeometry(0.19, 0.022, 12, 24, Math.PI);
      const band = new THREE.Mesh(bandGeo, this.engine.materials.trim);
      band.rotation.z = Math.PI;
      band.position.y = 0.1;
      headsetGroup.add(band);

      [-1, 1].forEach((side) => {
        const canGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.06, 20);
        const can = new THREE.Mesh(canGeo, this.engine.materials.armor);
        can.rotation.z = Math.PI / 2;
        can.position.set(side * 0.18, 0.02, 0);
        headsetGroup.add(can);

        const ringGeo = new THREE.TorusGeometry(0.075, 0.016, 12, 24);
        const ring = new THREE.Mesh(ringGeo, this.engine.materials.emissivePrimary);
        ring.rotation.y = Math.PI / 2;
        ring.position.set(side * 0.18, 0.02, 0);
        ring.material.needsUpdate = true;
        headsetGroup.add(ring);
      });

      targetBone.add(headsetGroup);
      this.currentHeadgearModel = headsetGroup;

      console.log(`[DynamicEquipManager] Successfully attached Code Headset to HeadTarget: "${targetBone.name}" (needsUpdate = true)`);

    } else if (item.id === 'item-head-3') {
      // 🥽 TACTICAL AR VISOR
      const visorGeo = new THREE.BoxGeometry(0.28, 0.09, 0.14);
      const visorMesh = new THREE.Mesh(visorGeo, this.engine.materials.visor);
      visorMesh.position.set(0, 0.02, 0.12);
      visorMesh.material.needsUpdate = true;

      targetBone.add(visorMesh);
      this.currentHeadgearModel = visorMesh;

      console.log(`[DynamicEquipManager] Successfully attached Tactical Visor to HeadTarget: "${targetBone.name}" (needsUpdate = true)`);

    } else {
      // ⚡ CYBER SPIKE HAIR
      const hairGroup = new THREE.Group();
      hairGroup.position.set(0, 0.12, 0);

      for (let i = 0; i < 6; i++) {
        const spikeGeo = new THREE.ConeGeometry(0.045, 0.24, 6);
        const spike = new THREE.Mesh(spikeGeo, this.engine.materials.emissivePrimary);
        spike.position.set((i - 2.5) * 0.05, 0.06, -(i * 0.02));
        spike.rotation.z = (i - 2.5) * -0.15;
        spike.rotation.x = -0.22;
        spike.material.needsUpdate = true;
        hairGroup.add(spike);
      }

      targetBone.add(hairGroup);
      this.currentHeadgearModel = hairGroup;

      console.log(`[DynamicEquipManager] Successfully attached Cyber Hair to HeadTarget: "${targetBone.name}" (needsUpdate = true)`);
    }

    // Also update any mapped head meshes
    this.targets.headMeshes.forEach(m => {
      if (m.material) {
        m.material.needsUpdate = true;
      }
    });

    this.forceRender();
  }

  // 4. DYNAMIC WEAPON EQUIPPING (.add() TO RIGHT HAND BONE)
  equipWeapon(item) {
    if (!item) return;

    // Clean up previous weapons
    if (this.currentWeaponModel && this.targets.rightHandBone) {
      this.targets.rightHandBone.remove(this.currentWeaponModel);
      this.currentWeaponModel = null;
    }
    if (this.currentScabbardModel && this.targets.backSheathBone) {
      this.targets.backSheathBone.remove(this.currentScabbardModel);
      this.currentScabbardModel = null;
    }
    if (this.engine.rightHandSocket) {
      while (this.engine.rightHandSocket.children.length > 0) {
        this.engine.rightHandSocket.remove(this.engine.rightHandSocket.children[0]);
      }
    }
    if (this.engine.backSheathSocket) {
      while (this.engine.backSheathSocket.children.length > 0) {
        this.engine.backSheathSocket.remove(this.engine.backSheathSocket.children[0]);
      }
    }
    this.engine.plasmaCoils = [];

    const handBone = this.targets.rightHandBone || this.engine.rightHandSocket;
    const sheathBone = this.targets.backSheathBone || this.engine.backSheathSocket;

    if (!handBone) {
      console.warn('[DynamicEquipManager] No RightHandBone found to attach weapon.');
      return;
    }

    if (item.id === 'item-weapon-2') {
      // ⚔️ CYBER KATANA: Monomolecular Blade & Back Scabbard Saya
      const katanaGroup = new THREE.Group();

      const handleGeo = new THREE.CylinderGeometry(0.022, 0.026, 0.32, 12);
      const handle = new THREE.Mesh(handleGeo, this.engine.materials.undersuit);
      handle.position.y = -0.12;
      handle.material.needsUpdate = true;
      katanaGroup.add(handle);

      const tsubaGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.025, 16);
      const tsuba = new THREE.Mesh(tsubaGeo, this.engine.materials.gold);
      tsuba.position.y = 0.05;
      tsuba.material.needsUpdate = true;
      katanaGroup.add(tsuba);

      const bladeLength = 1.18;
      const bladeGeo = new THREE.BoxGeometry(0.02, bladeLength, 0.055);
      const blade = new THREE.Mesh(bladeGeo, this.engine.materials.armor);
      blade.position.set(0, 0.05 + bladeLength / 2, 0.015);
      blade.castShadow = true;
      blade.material.needsUpdate = true;
      katanaGroup.add(blade);

      const edgeGeo = new THREE.BoxGeometry(0.008, bladeLength, 0.02);
      const edge = new THREE.Mesh(edgeGeo, this.engine.materials.katanaEdge);
      edge.position.set(0, 0.05 + bladeLength / 2, 0.045);
      edge.material.needsUpdate = true; // FORCE RENDER
      katanaGroup.add(edge);

      katanaGroup.rotation.set(-0.25, 0.35, 0.15);
      katanaGroup.position.set(0, 0.05, 0);

      // Programmatically attach to RightHandBone using .add()
      handBone.add(katanaGroup);
      this.currentWeaponModel = katanaGroup;

      // Attach Scabbard (Saya) to Back Sheath Bone
      if (sheathBone) {
        const scabbardGroup = new THREE.Group();
        const sayaGeo = new THREE.BoxGeometry(0.04, 1.25, 0.075);
        const saya = new THREE.Mesh(sayaGeo, this.engine.materials.scabbard);
        saya.position.y = 0.1;
        saya.castShadow = true;
        saya.material.needsUpdate = true;
        scabbardGroup.add(saya);

        const habakiGeo = new THREE.BoxGeometry(0.045, 0.08, 0.085);
        const habaki = new THREE.Mesh(habakiGeo, this.engine.materials.gold);
        habaki.position.y = 0.65;
        habaki.material.needsUpdate = true;
        scabbardGroup.add(habaki);

        sheathBone.add(scabbardGroup);
        this.currentScabbardModel = scabbardGroup;
      }

      console.log(`[DynamicEquipManager] Successfully attached Cyber Katana to RightHandBone: "${handBone.name}" (needsUpdate = true)`);

    } else if (item.id === 'item-weapon-3') {
      // 🔫 SCI-FI PLASMA GUN: Particle Blaster with Dual Glowing Plasma Coils
      const gunGroup = new THREE.Group();

      const gripGeo = new THREE.BoxGeometry(0.06, 0.22, 0.08);
      const grip = new THREE.Mesh(gripGeo, this.engine.materials.trim);
      grip.position.set(0, -0.06, -0.02);
      grip.rotation.x = -0.2;
      grip.material.needsUpdate = true;
      gunGroup.add(grip);

      const frameGeo = new THREE.BoxGeometry(0.12, 0.16, 0.44);
      const frame = new THREE.Mesh(frameGeo, this.engine.materials.armor);
      frame.position.set(0, 0.08, 0.16);
      frame.castShadow = true;
      frame.material.needsUpdate = true;
      gunGroup.add(frame);

      const coilGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.24, 16);
      const coil1 = new THREE.Mesh(coilGeo, this.engine.materials.emissivePrimary);
      coil1.rotation.x = Math.PI / 2;
      coil1.position.set(-0.04, 0.12, 0.36);
      coil1.material.needsUpdate = true;
      gunGroup.add(coil1);

      const coil2 = new THREE.Mesh(coilGeo, this.engine.materials.emissivePrimary);
      coil2.rotation.x = Math.PI / 2;
      coil2.position.set(0.04, 0.12, 0.36);
      coil2.material.needsUpdate = true;
      gunGroup.add(coil2);

      this.engine.plasmaCoils.push(coil1, coil2);

      const sightGeo = new THREE.BoxGeometry(0.06, 0.06, 0.12);
      const sight = new THREE.Mesh(sightGeo, this.engine.materials.visor);
      sight.position.set(0, 0.2, 0.15);
      sight.material.needsUpdate = true;
      gunGroup.add(sight);

      const muzzleGeo = new THREE.CylinderGeometry(0.03, 0.04, 0.1, 16);
      const muzzle = new THREE.Mesh(muzzleGeo, this.engine.materials.trim);
      muzzle.rotation.x = Math.PI / 2;
      muzzle.position.set(0, 0.08, 0.52);
      muzzle.material.needsUpdate = true;
      gunGroup.add(muzzle);

      gunGroup.rotation.set(-Math.PI / 2, 0, 0);
      gunGroup.position.set(0, 0, 0.05);

      handBone.add(gunGroup);
      this.currentWeaponModel = gunGroup;

      if (sheathBone) {
        const dockGeo = new THREE.BoxGeometry(0.18, 0.24, 0.06);
        const dock = new THREE.Mesh(dockGeo, this.engine.materials.trim);
        dock.castShadow = true;
        dock.material.needsUpdate = true;
        sheathBone.add(dock);
        this.currentScabbardModel = dock;
      }

      console.log(`[DynamicEquipManager] Successfully attached Sci-Fi Plasma Gun to RightHandBone: "${handBone.name}" (needsUpdate = true)`);

    } else if (item.id === 'item-weapon-4') {
      // ☄️ QUANTUM VOID CANNON
      const cannonGroup = new THREE.Group();

      const bodyGeo = new THREE.BoxGeometry(0.18, 0.2, 0.55);
      const body = new THREE.Mesh(bodyGeo, this.engine.materials.armor);
      body.position.set(0, 0.05, 0.2);
      body.castShadow = true;
      body.material.needsUpdate = true;
      cannonGroup.add(body);

      const railGeo = new THREE.BoxGeometry(0.03, 0.05, 0.45);
      const rail1 = new THREE.Mesh(railGeo, this.engine.materials.emissiveSecondary);
      rail1.position.set(-0.09, 0.12, 0.42);
      rail1.material.needsUpdate = true;
      cannonGroup.add(rail1);

      const rail2 = new THREE.Mesh(railGeo, this.engine.materials.emissiveSecondary);
      rail2.position.set(0.09, 0.12, 0.42);
      rail2.material.needsUpdate = true;
      cannonGroup.add(rail2);

      const coreGeo = new THREE.SphereGeometry(0.07, 16, 16);
      const core = new THREE.Mesh(coreGeo, this.engine.materials.emissivePrimary);
      core.position.set(0, 0.06, 0.22);
      core.material.needsUpdate = true;
      cannonGroup.add(core);

      cannonGroup.rotation.set(-Math.PI / 2, 0, 0);
      cannonGroup.position.set(0, 0, 0.05);

      handBone.add(cannonGroup);
      this.currentWeaponModel = cannonGroup;

      console.log(`[DynamicEquipManager] Successfully attached Quantum Void Cannon to RightHandBone: "${handBone.name}" (needsUpdate = true)`);

    } else {
      // 👊 BARE CYBER GAUNTLETS
      const knuckleGeo = new THREE.BoxGeometry(0.12, 0.06, 0.04);
      const knuckles = new THREE.Mesh(knuckleGeo, this.engine.materials.emissivePrimary);
      knuckles.position.set(0, 0.02, 0.08);
      knuckles.material.needsUpdate = true;

      handBone.add(knuckles);
      this.currentWeaponModel = knuckles;

      console.log(`[DynamicEquipManager] Successfully attached Bare Cyber Gauntlets to RightHandBone: "${handBone.name}"`);
    }

    this.forceRender();
  }

  // 5. DYNAMIC ACCESSORY EQUIPPING (.add() TO LEFT HAND / TORSO)
  equipAccessory(item) {
    if (!item) return;

    if (this.currentAccessoryModel) {
      if (this.targets.leftHandBone) this.targets.leftHandBone.remove(this.currentAccessoryModel);
      if (this.targets.torsoTarget) this.targets.torsoTarget.remove(this.currentAccessoryModel);
      this.currentAccessoryModel = null;
    }

    if (item.id === 'item-acc-2' && this.targets.leftHandBone) {
      // Plasma Dagger on left hand
      const daggerGroup = new THREE.Group();
      const bladeGeo = new THREE.BoxGeometry(0.015, 0.4, 0.04);
      const blade = new THREE.Mesh(bladeGeo, this.engine.materials.emissivePrimary);
      blade.material.needsUpdate = true;
      daggerGroup.add(blade);

      this.targets.leftHandBone.add(daggerGroup);
      this.currentAccessoryModel = daggerGroup;
      console.log(`[DynamicEquipManager] Successfully attached Plasma Dagger to LeftHandBone: "${this.targets.leftHandBone.name}"`);

    } else if (item.id === 'item-acc-3' && this.targets.torsoTarget) {
      // Neural Drone floating at shoulder
      const droneGroup = new THREE.Group();
      droneGroup.position.set(0.45, 0.35, 0.1);

      const droneBodyGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const droneBody = new THREE.Mesh(droneBodyGeo, this.engine.materials.armor);
      droneBody.material.needsUpdate = true;
      droneGroup.add(droneBody);

      const eyeGeo = new THREE.SphereGeometry(0.035, 12, 12);
      const eye = new THREE.Mesh(eyeGeo, this.engine.materials.emissivePrimary);
      eye.position.z = 0.07;
      eye.material.needsUpdate = true;
      droneGroup.add(eye);

      this.targets.torsoTarget.add(droneGroup);
      this.currentAccessoryModel = droneGroup;
      console.log(`[DynamicEquipManager] Successfully attached Neural Drone to TorsoTarget: "${this.targets.torsoTarget.name}"`);
    }

    this.forceRender();
  }

  // 6. APPLY VIBE TO MODEL MESHES
  applyVibe(vibeId) {
    if (this.targets.allMeshes.length > 0) {
      this.targets.allMeshes.forEach(mesh => {
        if (mesh.material) {
          mesh.material.needsUpdate = true;
        }
      });
      console.log(`[DynamicEquipManager] Successfully updated materials across ${this.targets.allMeshes.length} meshes for Vibe "${vibeId}" (needsUpdate = true)`);
    }
    this.forceRender();
  }

  // 7. IMMEDIATE FORCE RENDER
  forceRender() {
    if (this.engine && this.engine.renderer && this.engine.scene && this.engine.camera) {
      this.engine.renderer.render(this.engine.scene, this.engine.camera);
    }
  }
}


/* ============================================================================
   6.5. THREE.JS 3D OPERATIVE RENDERING ENGINE (ELITE TACTICAL DJ OPERATIVE)
   ============================================================================ */
class Character3DEngine {
  constructor(canvasId = 'character-3d-canvas', playerManager = null) {
    this.canvasId = canvasId;
    this.canvas = document.getElementById(canvasId);
    this.playerManager = playerManager;
    this.activeVibe = StorageManager.loadVibePreference();
    
    const equipped = StorageManager.loadEquipped();
    this.activeWeapon = equipped.weapon || 'item-weapon-2';
    this.activeHeadgear = equipped.head || 'item-head-1';
    this.activeTorso = equipped.torso || 'item-torso-1';

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.clock = (window.THREE) ? new THREE.Clock() : null;

    // Intelligent Dynamic Equip Manager
    this.dynamicEquipManager = new DynamicEquipManager(this);

    // Rig joints and sockets (Player Operative)
    this.characterGroup = null;
    this.spineBone = null;
    this.chestBone = null;
    this.headBone = null;
    this.headSocket = null;
    this.leftArmBone = null;
    this.rightArmBone = null;
    this.rightHandSocket = null;
    this.backSheathSocket = null;

    // Dynamic Elements
    this.equalizerBars = [];
    this.floatingCrownGroup = null;
    this.headphonesGroup = null;
    this.plasmaCoils = [];

    // Lighting nodes
    this.dirLight = null;
    this.rimLightLeft = null;
    this.rimLightRight = null;
    this.pedestalLight = null;
    this.ambLight = null;

    // Materials dictionary
    this.materials = {};

    // Victory celebration state
    this.isVictory = false;
    this.victoryTime = 0;
    this.victoryDuration = 2.4;
    this.victoryInitialAngle = 0;

    // GLTFLoader instance
    this.gltfLoader = (window.THREE && window.THREE.GLTFLoader) ? new THREE.GLTFLoader() : null;

    this.init();
  }

  init() {
    if (!window.THREE || !this.canvas) {
      console.warn('⚠️ Three.js not available or canvas not found. 3D Operative disabled.');
      return;
    }

    // 1. Scene Setup
    this.scene = new THREE.Scene();

    // 2. Camera Setup (Centered single-character perspective)
    const width = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : 380;
    const height = this.canvas.parentElement ? this.canvas.parentElement.clientHeight : 400;
    const aspect = width / (height || 1);

    this.camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 50);
    this.camera.position.set(0, 1.25, 4.3);
    this.camera.lookAt(0, 0.95, 0);

    // 3. Transparent High-Performance WebGL Renderer
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(width, height, false);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;
    } catch (e) {
      console.error('WebGL init error:', e);
      return;
    }

    // 4. Smooth Damped OrbitControls
    if (window.THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.target.set(0, 0.95, 0);
      this.controls.minPolarAngle = Math.PI / 2.7;
      this.controls.maxPolarAngle = Math.PI / 1.78;
      this.controls.minDistance = 2.4;
      this.controls.maxDistance = 6.0;
      this.controls.enablePan = false;
    }

    // 5. Dynamic Real-Time Lighting Rig
    this.setupLighting();

    // 6. Build Dynamic Materials Palette
    this.setupMaterials();

    // 7. Cyber Ground Pedestal
    this.buildCyberPedestal();

    // 8. Build Rigged 3D Elite Tactical DJ Operative
    this.buildOperativeRig();

    // 8.1 Auto-Map Skeleton and Meshes via DynamicEquipManager
    if (this.dynamicEquipManager && this.characterGroup) {
      this.dynamicEquipManager.autoMapSkeleton(this.characterGroup);
    }

    // 9. Attach Initial Weapons, Headgear & Torso Gear via DynamicEquipManager
    this.attachWeapon(this.activeWeapon);
    this.attachHeadgear(this.activeHeadgear);
    this.attachTorso(this.activeTorso);

    // 10. Apply Active Material Vibe
    this.applyVibe(this.activeVibe, false);

    // 10.1 Automatically fetch and load the 3D model ('./assets/lord.glb') on page initialization
    this.autoLoadModel('./assets/lord.glb');

    // 11. Handle Responsive Resize
    this.setupResizeObserver();

    // 12. Launch 60 FPS Render & Animation Loop
    this.animate();
  }

  setupLighting() {
    // Key Directional Light with soft shadows
    this.dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
    this.dirLight.position.set(2.0, 4.5, 3.2);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 10;
    this.dirLight.shadow.camera.left = -2.2;
    this.dirLight.shadow.camera.right = 2.2;
    this.dirLight.shadow.camera.top = 2.6;
    this.dirLight.shadow.camera.bottom = -0.5;
    this.dirLight.shadow.bias = -0.0008;
    this.scene.add(this.dirLight);

    // Left Neon Cyan Rim Light (Player Operative illumination)
    this.rimLightLeft = new THREE.PointLight(0x00d2ff, 2.8, 9);
    this.rimLightLeft.position.set(-2.6, 2.0, -1.0);
    this.scene.add(this.rimLightLeft);

    // Right Neon Purple Rim Light
    this.rimLightRight = new THREE.PointLight(0x8a2be2, 2.8, 9);
    this.rimLightRight.position.set(2.6, 2.0, -1.0);
    this.scene.add(this.rimLightRight);

    // Arena Floor Bounce Light
    this.pedestalLight = new THREE.PointLight(0x8a2be2, 2.4, 6);
    this.pedestalLight.position.set(0, -0.15, 0.4);
    this.scene.add(this.pedestalLight);

    // Ambient Fill Light
    this.ambLight = new THREE.AmbientLight(0x181a28, 1.0);
    this.scene.add(this.ambLight);
  }

  setupMaterials() {
    // Base Undersuit Material
    this.materials.undersuit = new THREE.MeshStandardMaterial({
      color: 0x0f111a,
      roughness: 0.8,
      metalness: 0.1
    });

    // Cyber Armor Plates (re-colored dynamically by Vibe)
    this.materials.armor = new THREE.MeshStandardMaterial({
      color: 0x1a1d2e,
      roughness: 0.25,
      metalness: 0.82
    });

    // Secondary Trim / Gold / Titanium Details
    this.materials.trim = new THREE.MeshStandardMaterial({
      color: 0x2b3047,
      roughness: 0.35,
      metalness: 0.75
    });

    // Emissive Primary LED Glow (Cyan / Red / White / Gold)
    this.materials.emissivePrimary = new THREE.MeshStandardMaterial({
      color: 0x00d2ff,
      emissive: 0x00d2ff,
      emissiveIntensity: 1.5,
      roughness: 0.2,
      metalness: 0.5
    });

    // Emissive Secondary LED Glow (Magenta / Amber / Purple)
    this.materials.emissiveSecondary = new THREE.MeshStandardMaterial({
      color: 0xff007f,
      emissive: 0xff007f,
      emissiveIntensity: 1.4,
      roughness: 0.2,
      metalness: 0.5
    });

    // Visor Sensor Glass
    this.materials.visor = new THREE.MeshStandardMaterial({
      color: 0x00d2ff,
      emissive: 0x00d2ff,
      emissiveIntensity: 1.8,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.92
    });

    // Katana Monomolecular Blade Edge
    this.materials.katanaEdge = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00d2ff,
      emissiveIntensity: 2.0,
      roughness: 0.1,
      metalness: 0.95
    });

    // Gold Fittings (Hilt, Tsuba, Crown)
    this.materials.gold = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.25,
      roughness: 0.2,
      metalness: 0.92
    });

    // Dark Carbon Fiber Saya (Scabbard)
    this.materials.scabbard = new THREE.MeshStandardMaterial({
      color: 0x0c0c14,
      roughness: 0.3,
      metalness: 0.7
    });

    // Pedestal Platform Material
    this.materials.pedestal = new THREE.MeshStandardMaterial({
      color: 0x0e0e18,
      roughness: 0.4,
      metalness: 0.8
    });
  }

  buildCyberPedestal() {
    const pedestalGroup = new THREE.Group();

    // Metallic Base Disc
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.3, 0.08, 36);
    const baseMesh = new THREE.Mesh(baseGeo, this.materials.pedestal);
    baseMesh.position.y = -0.04;
    baseMesh.receiveShadow = true;
    pedestalGroup.add(baseMesh);

    // Glowing Concentric Cyber Rings
    const ringGeo1 = new THREE.TorusGeometry(1.15, 0.02, 12, 48);
    const ringMesh1 = new THREE.Mesh(ringGeo1, this.materials.emissivePrimary);
    ringMesh1.rotation.x = Math.PI / 2;
    ringMesh1.position.y = 0.01;
    pedestalGroup.add(ringMesh1);

    const ringGeo2 = new THREE.TorusGeometry(0.85, 0.015, 12, 48);
    const ringMesh2 = new THREE.Mesh(ringGeo2, this.materials.emissiveSecondary);
    ringMesh2.rotation.x = Math.PI / 2;
    ringMesh2.position.y = 0.012;
    pedestalGroup.add(ringMesh2);

    // Shadow receiver plane under platform
    const shadowPlaneGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.45 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.041;
    shadowPlane.receiveShadow = true;
    pedestalGroup.add(shadowPlane);

    this.scene.add(pedestalGroup);
  }

  buildOperativeRig() {
    this.characterGroup = new THREE.Group();
    this.characterGroup.position.set(0, 0, 0);
    this.characterGroup.rotation.y = 0;

    // --- 1. PELVIS & UNDERSUIT ---
    const pelvisGeo = new THREE.BoxGeometry(0.42, 0.22, 0.28);
    const pelvis = new THREE.Mesh(pelvisGeo, this.materials.armor);
    pelvis.position.y = 0.92;
    pelvis.castShadow = true;
    pelvis.receiveShadow = true;
    this.characterGroup.add(pelvis);

    // Tactical Belt & Pouches
    const beltGeo = new THREE.BoxGeometry(0.45, 0.06, 0.3);
    const belt = new THREE.Mesh(beltGeo, this.materials.trim);
    belt.position.y = 0.98;
    this.characterGroup.add(belt);

    const buckleGeo = new THREE.BoxGeometry(0.1, 0.08, 0.32);
    const buckle = new THREE.Mesh(buckleGeo, this.materials.emissivePrimary);
    buckle.position.y = 0.98;
    this.characterGroup.add(buckle);

    // --- 2. LEGS & COMBAT BOOTS ---
    const createLeg = (sideMultiplier) => {
      const legGroup = new THREE.Group();
      legGroup.position.set(sideMultiplier * 0.16, 0.88, 0);

      // Thigh
      const thighGeo = new THREE.BoxGeometry(0.17, 0.38, 0.2);
      const thigh = new THREE.Mesh(thighGeo, this.materials.undersuit);
      thigh.position.y = -0.19;
      thigh.castShadow = true;
      legGroup.add(thigh);

      // Thigh Armor Plate
      const thighArmorGeo = new THREE.BoxGeometry(0.18, 0.22, 0.06);
      const thighArmor = new THREE.Mesh(thighArmorGeo, this.materials.armor);
      thighArmor.position.set(0, -0.16, 0.1);
      thighArmor.castShadow = true;
      legGroup.add(thighArmor);

      // Knee Guard
      const kneeGeo = new THREE.BoxGeometry(0.15, 0.11, 0.1);
      const knee = new THREE.Mesh(kneeGeo, this.materials.trim);
      knee.position.set(0, -0.38, 0.1);
      legGroup.add(knee);

      // Shin / Calf
      const shinGeo = new THREE.BoxGeometry(0.16, 0.38, 0.18);
      const shin = new THREE.Mesh(shinGeo, this.materials.undersuit);
      shin.position.y = -0.58;
      shin.castShadow = true;
      legGroup.add(shin);

      // Shin Armor Plate
      const shinArmorGeo = new THREE.BoxGeometry(0.17, 0.26, 0.05);
      const shinArmor = new THREE.Mesh(shinArmorGeo, this.materials.armor);
      shinArmor.position.set(0, -0.56, 0.09);
      legGroup.add(shinArmor);

      // Combat Boot
      const bootGeo = new THREE.BoxGeometry(0.18, 0.16, 0.3);
      const boot = new THREE.Mesh(bootGeo, this.materials.armor);
      boot.position.set(0, -0.82, 0.05);
      boot.castShadow = true;
      legGroup.add(boot);

      // Glowing Boot Sole Strip
      const soleGeo = new THREE.BoxGeometry(0.19, 0.03, 0.31);
      const sole = new THREE.Mesh(soleGeo, this.materials.emissivePrimary);
      sole.position.set(0, -0.89, 0.05);
      legGroup.add(sole);

      return legGroup;
    };

    this.characterGroup.add(createLeg(-1)); // Left leg
    this.characterGroup.add(createLeg(1));  // Right leg

    // --- 3. SPINE & CHEST (BREATHING JOINT) ---
    this.spineBone = new THREE.Group();
    this.spineBone.position.set(0, 1.05, 0);
    this.characterGroup.add(this.spineBone);

    this.chestBone = new THREE.Group();
    this.chestBone.position.set(0, 0.22, 0);
    this.spineBone.add(this.chestBone);

    // Torso Base Undersuit
    const torsoBaseGeo = new THREE.BoxGeometry(0.48, 0.44, 0.28);
    const torsoBase = new THREE.Mesh(torsoBaseGeo, this.materials.undersuit);
    torsoBase.castShadow = true;
    this.chestBone.add(torsoBase);

    // Beveled Tactical Armor Chest Plate
    const chestPlateGeo = new THREE.BoxGeometry(0.52, 0.36, 0.12);
    const chestPlate = new THREE.Mesh(chestPlateGeo, this.materials.armor);
    chestPlate.position.set(0, 0.03, 0.12);
    chestPlate.castShadow = true;
    this.chestBone.add(chestPlate);

    // DJ Equalizer LED Panel (5 Vertical Spectrum Bars on Chest)
    const eqGroup = new THREE.Group();
    eqGroup.position.set(0, 0.04, 0.185);
    this.equalizerBars = [];

    const barWidth = 0.035;
    const barSpacing = 0.06;
    for (let i = 0; i < 5; i++) {
      const barGeo = new THREE.BoxGeometry(barWidth, 0.16, 0.015);
      const barMat = (i % 2 === 0) ? this.materials.emissivePrimary : this.materials.emissiveSecondary;
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.x = (i - 2) * barSpacing;
      eqGroup.add(bar);
      this.equalizerBars.push(bar);
    }
    this.chestBone.add(eqGroup);

    // Back Sheath Socket (Mounted behind chest at an angle for weapons)
    this.backSheathSocket = new THREE.Group();
    this.backSheathSocket.position.set(0.12, 0.08, -0.18);
    this.backSheathSocket.rotation.set(0.2, 0.1, -0.65);
    this.chestBone.add(this.backSheathSocket);

    // --- 4. NECK & HEAD ---
    const neckGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.14, 16);
    const neck = new THREE.Mesh(neckGeo, this.materials.undersuit);
    neck.position.set(0, 0.3, 0);
    this.chestBone.add(neck);

    this.headBone = new THREE.Group();
    this.headBone.position.set(0, 0.44, 0);
    this.chestBone.add(this.headBone);

    // Head Base Shape
    const headGeo = new THREE.BoxGeometry(0.26, 0.28, 0.26);
    const head = new THREE.Mesh(headGeo, this.materials.undersuit);
    head.castShadow = true;
    this.headBone.add(head);

    // Jaw / Respirator Mask
    const maskGeo = new THREE.BoxGeometry(0.24, 0.12, 0.16);
    const mask = new THREE.Mesh(maskGeo, this.materials.trim);
    mask.position.set(0, -0.07, 0.08);
    this.headBone.add(mask);

    // Glowing Eye Visor Slit
    const visorGeo = new THREE.BoxGeometry(0.25, 0.06, 0.06);
    const visor = new THREE.Mesh(visorGeo, this.materials.visor);
    visor.position.set(0, 0.04, 0.13);
    this.headBone.add(visor);

    // Head Socket for Headgear (Crown, Visor, Spikes)
    this.headSocket = new THREE.Group();
    this.headSocket.position.set(0, 0.16, 0);
    this.headBone.add(this.headSocket);

    // DJ Headphones (Integral to the Tactical DJ Operative)
    this.buildDJHeadphones();

    // --- 5. ARMS & WEAPON SOCKETS ---
    this.buildArms();

    this.scene.add(this.characterGroup);
  }

  buildDJHeadphones() {
    this.headphonesGroup = new THREE.Group();

    // Headband
    const bandGeo = new THREE.TorusGeometry(0.18, 0.02, 12, 24, Math.PI);
    const band = new THREE.Mesh(bandGeo, this.materials.trim);
    band.rotation.z = Math.PI;
    band.position.y = 0.08;
    this.headphonesGroup.add(band);

    // Left & Right Ear Cushions with Pulsing LED Rings
    [-1, 1].forEach((side) => {
      const earcupGroup = new THREE.Group();
      earcupGroup.position.set(side * 0.16, 0.02, 0);

      // Outer Can
      const canGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 20);
      const can = new THREE.Mesh(canGeo, this.materials.armor);
      can.rotation.z = Math.PI / 2;
      earcupGroup.add(can);

      // Glowing Audio Ring
      const ringGeo = new THREE.TorusGeometry(0.07, 0.015, 12, 24);
      const ring = new THREE.Mesh(ringGeo, this.materials.emissivePrimary);
      ring.rotation.y = Math.PI / 2;
      earcupGroup.add(ring);

      this.headphonesGroup.add(earcupGroup);
    });

    this.headBone.add(this.headphonesGroup);
  }

  buildArms() {
    // --- LEFT ARM (STANCE / READY) ---
    this.leftArmBone = new THREE.Group();
    this.leftArmBone.position.set(-0.34, 0.16, 0);
    this.chestBone.add(this.leftArmBone);

    // Shoulder Pauldron
    const leftPauldronGeo = new THREE.BoxGeometry(0.18, 0.18, 0.2);
    const leftPauldron = new THREE.Mesh(leftPauldronGeo, this.materials.armor);
    leftPauldron.position.set(-0.06, 0, 0);
    leftPauldron.castShadow = true;
    this.leftArmBone.add(leftPauldron);

    // Upper Arm
    const leftUpperGeo = new THREE.BoxGeometry(0.12, 0.28, 0.14);
    const leftUpper = new THREE.Mesh(leftUpperGeo, this.materials.undersuit);
    leftUpper.position.set(-0.04, -0.16, 0);
    leftUpper.castShadow = true;
    this.leftArmBone.add(leftUpper);

    // Forearm & Gauntlet
    const leftForearm = new THREE.Group();
    leftForearm.position.set(-0.04, -0.32, 0);
    leftForearm.rotation.x = 0.45;
    leftForearm.rotation.z = 0.2;
    this.leftArmBone.add(leftForearm);

    const leftForearmMeshGeo = new THREE.BoxGeometry(0.12, 0.28, 0.14);
    const leftForearmMesh = new THREE.Mesh(leftForearmMeshGeo, this.materials.armor);
    leftForearmMesh.position.y = -0.14;
    leftForearmMesh.castShadow = true;
    leftForearm.add(leftForearmMesh);

    // Holographic Tech Gauntlet Display Strip
    const gauntletStripGeo = new THREE.BoxGeometry(0.04, 0.14, 0.15);
    const gauntletStrip = new THREE.Mesh(gauntletStripGeo, this.materials.emissiveSecondary);
    gauntletStrip.position.set(-0.05, -0.14, 0);
    leftForearm.add(gauntletStrip);

    // Left Fist Hand
    const leftHandGeo = new THREE.BoxGeometry(0.1, 0.1, 0.12);
    const leftHand = new THREE.Mesh(leftHandGeo, this.materials.trim);
    leftHand.position.set(0, -0.32, 0);
    leftForearm.add(leftHand);

    // --- RIGHT ARM (WEAPON ARM WITH BONE SOCKET) ---
    this.rightArmBone = new THREE.Group();
    this.rightArmBone.position.set(0.34, 0.16, 0);
    this.chestBone.add(this.rightArmBone);

    // Shoulder Pauldron
    const rightPauldronGeo = new THREE.BoxGeometry(0.18, 0.18, 0.2);
    const rightPauldron = new THREE.Mesh(rightPauldronGeo, this.materials.armor);
    rightPauldron.position.set(0.06, 0, 0);
    rightPauldron.castShadow = true;
    this.rightArmBone.add(rightPauldron);

    // Upper Arm
    const rightUpperGeo = new THREE.BoxGeometry(0.12, 0.28, 0.14);
    const rightUpper = new THREE.Mesh(rightUpperGeo, this.materials.undersuit);
    rightUpper.position.set(0.04, -0.16, 0);
    rightUpper.castShadow = true;
    this.rightArmBone.add(rightUpper);

    // Forearm angled ready to wield
    this.rightForearmBone = new THREE.Group();
    this.rightForearmBone.position.set(0.04, -0.32, 0);
    this.rightForearmBone.rotation.x = -0.65;
    this.rightForearmBone.rotation.y = -0.2;
    this.rightForearmBone.rotation.z = -0.15;
    this.rightArmBone.add(this.rightForearmBone);

    const rightForearmMeshGeo = new THREE.BoxGeometry(0.12, 0.28, 0.14);
    const rightForearmMesh = new THREE.Mesh(rightForearmMeshGeo, this.materials.armor);
    rightForearmMesh.position.y = -0.14;
    rightForearmMesh.castShadow = true;
    this.rightForearmBone.add(rightForearmMesh);

    // Right Fist Hand
    const rightHandGeo = new THREE.BoxGeometry(0.1, 0.1, 0.12);
    const rightHand = new THREE.Mesh(rightHandGeo, this.materials.trim);
    rightHand.position.set(0, -0.32, 0);
    this.rightForearmBone.add(rightHand);

    // RIGHT HAND WEAPON SOCKET (Used for .attach() mesh swapping)
    this.rightHandSocket = new THREE.Group();
    this.rightHandSocket.position.set(0, -0.32, 0.06);
    this.rightHandSocket.rotation.set(Math.PI / 2, 0, 0);
    this.rightForearmBone.add(this.rightHandSocket);
  }

  // =========================================================================
  // DYNAMIC MESH SWAPPING: WEAPONS, HEADGEAR & TORSO DELEGATION
  // =========================================================================
  attachWeapon(weaponId) {
    this.activeWeapon = weaponId;
    const item = VAULT_ITEMS_CATALOG.find(i => i.id === weaponId) || { id: weaponId, name: weaponId };
    if (this.dynamicEquipManager) {
      this.dynamicEquipManager.equipWeapon(item);
    }
  }

  attachHeadgear(headId) {
    this.activeHeadgear = headId;
    const item = VAULT_ITEMS_CATALOG.find(i => i.id === headId) || { id: headId, name: headId };
    if (this.dynamicEquipManager) {
      this.dynamicEquipManager.equipHeadgear(item);
    }
  }

  attachTorso(torsoId) {
    this.activeTorso = torsoId;
    const item = VAULT_ITEMS_CATALOG.find(i => i.id === torsoId) || { id: torsoId, name: torsoId };
    if (this.dynamicEquipManager) {
      this.dynamicEquipManager.equipTorso(item);
    }
  }

  attachAccessory(accId) {
    this.activeAccessory = accId;
    const item = VAULT_ITEMS_CATALOG.find(i => i.id === accId) || { id: accId, name: accId };
    if (this.dynamicEquipManager) {
      this.dynamicEquipManager.equipAccessory(item);
    }
  }

  // =========================================================================
  // AUTOMATED 3D MODEL LOADER ('./assets/lord.glb') & DYNAMIC AUTO-MAPPER
  // =========================================================================
  autoLoadModel(modelUrl = './assets/lord.glb') {
    this.loadGLBModel(modelUrl);
  }

  loadGLBModel(fileOrUrl = './assets/lord.glb') {
    if (!window.THREE || !window.THREE.GLTFLoader) {
      console.warn('⚠️ [Character3DEngine] Three.js or GLTFLoader is not available. Using procedural operative rig.');
      return;
    }
    if (!this.gltfLoader) {
      this.gltfLoader = new THREE.GLTFLoader();
    }

    const loadScene = (gltf) => {
      console.log('📦 [Character3DEngine] Successfully loaded 3D GLB/GLTF model:', gltf);

      // Hide/remove procedural rig if active
      if (this.characterGroup) {
        this.scene.remove(this.characterGroup);
      }
      if (this.loadedGLBScene) {
        this.scene.remove(this.loadedGLBScene);
      }

      this.loadedGLBScene = gltf.scene;

      // Compute bounding box and normalize scale & position
      const bbox = new THREE.Box3().setFromObject(this.loadedGLBScene);
      const size = bbox.getSize(new THREE.Vector3());
      const center = bbox.getCenter(new THREE.Vector3());

      const targetHeight = 1.9;
      if (size.y > 0) {
        const scale = targetHeight / size.y;
        this.loadedGLBScene.scale.set(scale, scale, scale);
      }

      // Position Player centered (position.x = 0), facing forward
      this.loadedGLBScene.position.x = -center.x * (this.loadedGLBScene.scale.x || 1);
      this.loadedGLBScene.position.y = 0;
      this.loadedGLBScene.position.z = -center.z * (this.loadedGLBScene.scale.z || 1);
      this.loadedGLBScene.rotation.y = 0;

      // Cast and receive shadows on all loaded meshes
      this.loadedGLBScene.traverse((child) => {
        if (child.isMesh || child.isSkinnedMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.scene.add(this.loadedGLBScene);

      // Setup AnimationMixer if clips exist in the loaded model
      if (gltf.animations && gltf.animations.length > 0) {
        this.mixer = new THREE.AnimationMixer(this.loadedGLBScene);
        this.gltfAnimations = gltf.animations;
        const idleClip = gltf.animations.find(a => /idle|stand|breath|wait/i.test(a.name)) || gltf.animations[0];
        if (idleClip) {
          this.activeAction = this.mixer.clipAction(idleClip);
          this.activeAction.play();
        }
      }

      // Auto-Map Skeleton on the loaded GLB model via traverse() & fuzzy matching!
      this.dynamicEquipManager.autoMapSkeleton(this.loadedGLBScene);

      // Re-equip current loadout items on the newly mapped bones/meshes
      this.attachWeapon(this.activeWeapon);
      this.attachHeadgear(this.activeHeadgear);
      this.attachTorso(this.activeTorso);

      this.dynamicEquipManager.forceRender();
    };

    if (fileOrUrl instanceof File || fileOrUrl instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        this.gltfLoader.parse(
          arrayBuffer,
          '',
          (gltf) => loadScene(gltf),
          (err) => console.error('Error parsing GLB file:', err)
        );
      };
      reader.readAsArrayBuffer(fileOrUrl);
    } else if (typeof fileOrUrl === 'string') {
      console.log(`[Character3DEngine] Fetching 3D model: "${fileOrUrl}"...`);
      this.gltfLoader.load(
        fileOrUrl,
        (gltf) => loadScene(gltf),
        (xhr) => {
          if (xhr.lengthComputable) {
            console.log(`[Character3DEngine] Loading "${fileOrUrl}": ${(xhr.loaded / xhr.total * 100).toFixed(0)}%`);
          }
        },
        (err) => {
          console.warn(`ℹ️ [Character3DEngine] Note: Could not load "${fileOrUrl}". Defaulting gracefully to procedural operative rig.`);
        }
      );
    }
  }

  // =========================================================================
  // DYNAMIC CUSTOMIZATION: "VIBES" MATERIAL & SHADER PALETTES
  // =========================================================================
  setVibe(vibeId) {
    this.applyVibe(vibeId, true);
    StorageManager.saveVibePreference(vibeId);

    // Synchronize UI active pills
    const pills = document.querySelectorAll('.vibe-pill');
    pills.forEach(p => {
      p.classList.toggle('active', p.dataset.vibe === vibeId);
    });
  }

  applyVibe(vibeId, playSound = false) {
    this.activeVibe = vibeId;
    if (playSound) soundFX.playClick();

    const glowEl = document.getElementById('pedestal-3d-glow');

    if (vibeId === 'charcoal-stealth') {
      // Matte Charcoal Tactical Stealth
      this.materials.armor.color.setHex(0x22252e);
      this.materials.armor.roughness = 0.68;
      this.materials.armor.metalness = 0.35;

      this.materials.trim.color.setHex(0x383e4d);
      this.materials.trim.metalness = 0.45;

      this.materials.emissivePrimary.color.setHex(0xe2e8f0);
      this.materials.emissivePrimary.emissive.setHex(0xe2e8f0);
      this.materials.emissivePrimary.emissiveIntensity = 0.9;

      this.materials.emissiveSecondary.color.setHex(0x64748b);
      this.materials.emissiveSecondary.emissive.setHex(0x64748b);
      this.materials.emissiveSecondary.emissiveIntensity = 0.6;

      this.materials.katanaEdge.emissive.setHex(0xe2e8f0);
      this.materials.visor.color.setHex(0xe2e8f0);
      this.materials.visor.emissive.setHex(0xe2e8f0);

      if (this.rimLightLeft) this.rimLightLeft.color.setHex(0x94a3b8);
      if (this.rimLightRight) this.rimLightRight.color.setHex(0x475569);
      if (this.pedestalLight) this.pedestalLight.color.setHex(0x334155);

      if (glowEl) glowEl.style.background = 'radial-gradient(ellipse, rgba(148, 163, 184, 0.35) 0%, transparent 75%)';

    } else if (vibeId === 'crimson-overlord') {
      // Aggressive Obsidian & Crimson Red
      this.materials.armor.color.setHex(0x13070a);
      this.materials.armor.roughness = 0.18;
      this.materials.armor.metalness = 0.88;

      this.materials.trim.color.setHex(0x2d0b14);
      this.materials.trim.metalness = 0.8;

      this.materials.emissivePrimary.color.setHex(0xff003c);
      this.materials.emissivePrimary.emissive.setHex(0xff003c);
      this.materials.emissivePrimary.emissiveIntensity = 1.8;

      this.materials.emissiveSecondary.color.setHex(0xff6a00);
      this.materials.emissiveSecondary.emissive.setHex(0xff6a00);
      this.materials.emissiveSecondary.emissiveIntensity = 1.4;

      this.materials.katanaEdge.emissive.setHex(0xff003c);
      this.materials.visor.color.setHex(0xff003c);
      this.materials.visor.emissive.setHex(0xff003c);

      if (this.rimLightLeft) this.rimLightLeft.color.setHex(0xff003c);
      if (this.rimLightRight) this.rimLightRight.color.setHex(0xff7700);
      if (this.pedestalLight) this.pedestalLight.color.setHex(0x990022);

      if (glowEl) glowEl.style.background = 'radial-gradient(ellipse, rgba(255, 0, 60, 0.45) 0%, transparent 75%)';

    } else if (vibeId === 'cyber-gold') {
      // Polished Gold Chrome & Royal Amethyst Purple
      this.materials.armor.color.setHex(0xffd700);
      this.materials.armor.roughness = 0.12;
      this.materials.armor.metalness = 0.95;

      this.materials.trim.color.setHex(0xb45309);
      this.materials.trim.metalness = 0.9;

      this.materials.emissivePrimary.color.setHex(0xbd00ff);
      this.materials.emissivePrimary.emissive.setHex(0xbd00ff);
      this.materials.emissivePrimary.emissiveIntensity = 1.6;

      this.materials.emissiveSecondary.color.setHex(0xf59e0b);
      this.materials.emissiveSecondary.emissive.setHex(0xf59e0b);
      this.materials.emissiveSecondary.emissiveIntensity = 1.3;

      this.materials.katanaEdge.emissive.setHex(0xffd700);
      this.materials.visor.color.setHex(0xbd00ff);
      this.materials.visor.emissive.setHex(0xbd00ff);

      if (this.rimLightLeft) this.rimLightLeft.color.setHex(0xffd700);
      if (this.rimLightRight) this.rimLightRight.color.setHex(0x9333ea);
      if (this.pedestalLight) this.pedestalLight.color.setHex(0x7c3aed);

      if (glowEl) glowEl.style.background = 'radial-gradient(ellipse, rgba(255, 215, 0, 0.4) 0%, transparent 75%)';

    } else {
      // Default: "Neon Strike" (Electric Cyan & Magenta)
      this.materials.armor.color.setHex(0x181c2e);
      this.materials.armor.roughness = 0.22;
      this.materials.armor.metalness = 0.82;

      this.materials.trim.color.setHex(0x28304c);
      this.materials.trim.metalness = 0.75;

      this.materials.emissivePrimary.color.setHex(0x00d2ff);
      this.materials.emissivePrimary.emissive.setHex(0x00d2ff);
      this.materials.emissivePrimary.emissiveIntensity = 1.5;

      this.materials.emissiveSecondary.color.setHex(0xff007f);
      this.materials.emissiveSecondary.emissive.setHex(0xff007f);
      this.materials.emissiveSecondary.emissiveIntensity = 1.4;

      this.materials.katanaEdge.emissive.setHex(0x00d2ff);
      this.materials.visor.color.setHex(0x00d2ff);
      this.materials.visor.emissive.setHex(0x00d2ff);

      if (this.rimLightLeft) this.rimLightLeft.color.setHex(0x00d2ff);
      if (this.rimLightRight) this.rimLightRight.color.setHex(0xff007f);
      if (this.pedestalLight) this.pedestalLight.color.setHex(0x8a2be2);

      if (glowEl) glowEl.style.background = 'radial-gradient(ellipse, rgba(0, 210, 255, 0.45) 0%, transparent 75%)';
    }
  }

  // =========================================================================
  // ANIMATIONS: IDLE BREATHING & LEVEL-UP VICTORY CELEBRATION
  // =========================================================================
  triggerVictory() {
    this.isVictory = true;
    this.victoryTime = 0;
    const activeModel = this.loadedGLBScene || this.characterGroup;
    this.victoryInitialAngle = activeModel ? activeModel.rotation.y : 0;

    // Check if the loaded model has an animation clip for victory/cheer/dance
    if (this.mixer && this.gltfAnimations && this.gltfAnimations.length > 0) {
      const victoryClip = this.gltfAnimations.find(a => /victory|win|cheer|dance|jump|attack/i.test(a.name));
      if (victoryClip) {
        const victoryAction = this.mixer.clipAction(victoryClip);
        victoryAction.reset().setLoop(THREE.LoopOnce, 1).play();
      }
    }

    soundFX.playLevelUp();
    confettiEngine.burst(180);
  }

  setupResizeObserver() {
    if (!window.ResizeObserver || !this.canvas || !this.canvas.parentElement) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0 && this.renderer && this.camera) {
          this.camera.aspect = width / height;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(width, height, false);
        }
      }
    });
    ro.observe(this.canvas.parentElement);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    if (!this.clock || !this.renderer || !this.scene || !this.camera) return;

    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    // 1. OrbitControls Damping Update
    if (this.controls) {
      this.controls.update();
    }

    // 2. Victory Animation or Idle Pose Update
    const activeModel = this.loadedGLBScene || this.characterGroup;
    const rightArm = (this.dynamicEquipManager && this.dynamicEquipManager.RightHandBone && this.dynamicEquipManager.RightHandBone.parent)
      ? this.dynamicEquipManager.RightHandBone.parent
      : this.rightArmBone;
    const torso = (this.dynamicEquipManager && this.dynamicEquipManager.TorsoTarget)
      ? this.dynamicEquipManager.TorsoTarget
      : this.chestBone;

    if (this.isVictory) {
      this.victoryTime += delta;
      const progress = Math.min(1, this.victoryTime / this.victoryDuration);

      // 360-Degree Combat Flourish Spin on loaded model or procedural rig
      if (activeModel) {
        activeModel.rotation.y = this.victoryInitialAngle + (progress * Math.PI * 2);
      }

      // Raise weapon arm high into victory pose
      if (rightArm) {
        rightArm.rotation.x = -1.8;
        rightArm.rotation.z = -0.4;
      }
      if (torso) {
        torso.rotation.x = -0.15; // Proud chest up
      }

      if (this.mixer) {
        this.mixer.update(delta);
      }

      if (progress >= 1) {
        this.isVictory = false;
        if (activeModel) activeModel.rotation.y = this.victoryInitialAngle;
        if (rightArm) {
          rightArm.rotation.set(0, 0, 0);
        }
        if (torso) {
          torso.rotation.set(0, 0, 0);
        }
      }

    } else {
      // Dynamic Combat Ready Idle Pose (Breathing & Micro-Swings)
      const breath = Math.sin(elapsed * 2.2);

      if (this.mixer) {
        this.mixer.update(delta);
      } else if (activeModel && activeModel === this.loadedGLBScene) {
        activeModel.position.y = Math.sin(elapsed * 2.0) * 0.015;
      }

      // Chest Breathing
      if (this.chestBone) {
        this.chestBone.scale.set(1 + breath * 0.02, 1 + breath * 0.025, 1);
        this.chestBone.rotation.x = breath * 0.015;
      }

      // Spine Micro-Sway
      if (this.spineBone) {
        this.spineBone.rotation.y = Math.sin(elapsed * 1.2) * 0.04;
      }

      // Left arm balance micro-motion
      if (this.leftArmBone) {
        this.leftArmBone.rotation.z = Math.sin(elapsed * 1.6) * 0.03 - 0.05;
      }

      // Right arm weapon ready micro-sway
      if (this.rightArmBone) {
        this.rightArmBone.rotation.z = Math.sin(elapsed * 1.6) * 0.02 + 0.03;
      }
    }

    // 3. Dynamic DJ Equalizer LED Heights Oscillation
    if (this.equalizerBars.length > 0) {
      this.equalizerBars.forEach((bar, idx) => {
        const wave = Math.sin(elapsed * 8 + idx * 1.4);
        const heightScale = Math.max(0.2, 0.6 + wave * 0.4);
        bar.scale.y = heightScale;
      });
    }

    // 4. Plasma Gun Coils Breathing Glow
    if (this.plasmaCoils.length > 0) {
      const coilGlow = 1.0 + Math.sin(elapsed * 4.5) * 0.6;
      this.plasmaCoils.forEach(coil => {
        if (coil.material) coil.material.emissiveIntensity = coilGlow;
      });
    }

    // 5. Floating Hacker's Crown Bobbing
    if (this.floatingCrownGroup) {
      this.floatingCrownGroup.position.y = 0.12 + Math.sin(elapsed * 2.8) * 0.04;
      this.floatingCrownGroup.rotation.y = elapsed * 0.8;
    }

    // 6. Headphones Audio Pulsing
    if (this.headphonesGroup) {
      const pulse = 1 + Math.sin(elapsed * 5) * 0.03;
      this.headphonesGroup.scale.set(pulse, pulse, pulse);
    }

    // 7. Render Three.js Scene
    this.renderer.render(this.scene, this.camera);
  }
}


/* ============================================================================
   7. THE VAULT INVENTORY & CHARACTER STUDIO CONTROLLER
   ============================================================================ */
class AvatarAndVaultManager {
  constructor(playerManager) {
    this.playerManager = playerManager;
    this.equipped = StorageManager.loadEquipped();
    this.currentFilter = 'all';
    this.selectedItem = VAULT_ITEMS_CATALOG[0];

    // Initialize High-Fidelity 3D WebGL Operative Engine
    this.character3DEngine = new Character3DEngine('character-3d-canvas', this.playerManager);
    window.character3DEngine = this.character3DEngine;

    // Vault DOM Elements
    this.vaultGridEl = document.getElementById('vault-items-grid');
    this.tabButtons = document.querySelectorAll('.vault-tab-btn');
    this.equippedCountEl = document.getElementById('vault-equipped-count');
    
    // Inspect DOM Elements
    this.inspectIconEl = document.getElementById('inspect-item-icon');
    this.inspectNameEl = document.getElementById('inspect-item-name');
    this.inspectRarityEl = document.getElementById('inspect-item-rarity');
    this.inspectDescEl = document.getElementById('inspect-item-desc');
    this.inspectReqEl = document.getElementById('inspect-item-req');
    this.inspectEquipBtn = document.getElementById('inspect-equip-btn');

    this.init();
  }

  init() {
    // Vault Category Tabs
    this.tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        soundFX.playClick();
        this.tabButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        this.currentFilter = btn.dataset.filter;
        this.renderVaultGrid();
      });
    });

    // Equip Button
    if (this.inspectEquipBtn) {
      this.inspectEquipBtn.addEventListener('click', () => {
        this.equipItem(this.selectedItem.id);
      });
    }

    // 3D Vibe Matrix Selector Pills
    const vibePills = document.querySelectorAll('.vibe-pill');
    vibePills.forEach(pill => {
      pill.addEventListener('click', () => {
        const vibe = pill.dataset.vibe;
        if (this.character3DEngine) {
          this.character3DEngine.setVibe(vibe);
        }
      });
    });

    // Victory Pose Trigger Button
    const victoryBtn = document.getElementById('btn-trigger-victory');
    if (victoryBtn) {
      victoryBtn.addEventListener('click', () => {
        if (this.character3DEngine) {
          this.character3DEngine.triggerVictory();
        }
      });
    }

    this.renderVaultGrid();
    this.updateEquippedCount();
    this.inspectItem(VAULT_ITEMS_CATALOG.find(i => i.id === 'item-weapon-2') || VAULT_ITEMS_CATALOG[0]);
  }

  // =========================================================================
  // DYNAMIC 3D & LOADOUT ATTACHMENT LOGIC
  // =========================================================================
  renderAvatarLayers() {
    if (this.character3DEngine) {
      this.character3DEngine.attachWeapon(this.equipped.weapon);
      this.character3DEngine.attachHeadgear(this.equipped.head);
      this.character3DEngine.attachTorso(this.equipped.torso);
      if (this.equipped.accessory) {
        this.character3DEngine.attachAccessory(this.equipped.accessory);
      }
    }
    this.updateEquippedCount();
  }

  // =========================================================================
  // VAULT (INVENTORY) GRID RENDERING & INTERACTIONS
  // =========================================================================
  renderVaultGrid() {
    if (!this.vaultGridEl) return;
    this.vaultGridEl.innerHTML = '';

    const currentLevel = this.playerManager.state.level;

    const filtered = VAULT_ITEMS_CATALOG.filter(item => {
      if (this.currentFilter === 'all') return true;
      return item.category === this.currentFilter;
    });

    filtered.forEach((item, idx) => {
      const isLocked = item.minLevel > currentLevel;
      const isEquipped = this.equipped[item.category] === item.id;

      const card = document.createElement('div');
      card.className = `vault-item-card rarity-${item.rarity} ${isLocked ? 'locked' : ''} ${isEquipped ? 'equipped' : ''}`;
      card.setAttribute('role', 'listitem');
      card.dataset.id = item.id;

      // FREE FIRE STAGGER ENTRANCE: sets CSS custom property
      card.style.setProperty('--stagger', idx);

      card.innerHTML = `
        ${isEquipped ? '<span class="equipped-tag">EQUIPPED</span>' : ''}
        ${isLocked ? `
          <div class="locked-overlay">
            <span class="lock-icon">🔒</span>
            <span class="lock-req-text">LVL ${item.minLevel}</span>
          </div>
        ` : ''}
        <div class="item-icon-display">${item.icon}</div>
        <div class="item-name-text">${item.name}</div>
        <div class="item-category-tag">${item.rarity.toUpperCase()} &bull; ${item.category}</div>
      `;

      card.addEventListener('click', () => {
        soundFX.playClick();
        this.inspectItem(item);
        if (!isLocked) {
          this.equipItem(item.id);
        }
      });

      this.vaultGridEl.appendChild(card);
    });
  }

  inspectItem(item) {
    this.selectedItem = item;
    const currentLevel = this.playerManager.state.level;
    const isLocked = item.minLevel > currentLevel;
    const isEquipped = this.equipped[item.category] === item.id;

    if (this.inspectIconEl) this.inspectIconEl.textContent = item.icon;
    if (this.inspectNameEl) this.inspectNameEl.textContent = item.name;
    if (this.inspectRarityEl) {
      this.inspectRarityEl.textContent = item.rarity.toUpperCase();
      this.inspectRarityEl.className = `inspect-rarity-tag rarity-${item.rarity}`;
    }
    if (this.inspectDescEl) this.inspectDescEl.textContent = item.desc;

    if (this.inspectReqEl) {
      if (isLocked) {
        this.inspectReqEl.textContent = `🔒 Locked: Requires Level ${item.minLevel}`;
        this.inspectReqEl.style.color = '#ef4444';
      } else {
        this.inspectReqEl.textContent = `✅ Unlocked (Level ${item.minLevel}+)`;
        this.inspectReqEl.style.color = '#34d399';
      }
    }

    if (this.inspectEquipBtn) {
      if (isLocked) {
        this.inspectEquipBtn.disabled = true;
        this.inspectEquipBtn.textContent = `Locked (LVL ${item.minLevel})`;
        this.inspectEquipBtn.style.opacity = '0.5';
      } else if (isEquipped) {
        this.inspectEquipBtn.disabled = true;
        this.inspectEquipBtn.textContent = 'Currently Equipped';
        this.inspectEquipBtn.style.opacity = '0.7';
      } else {
        this.inspectEquipBtn.disabled = false;
        this.inspectEquipBtn.textContent = 'Equip Gear';
        this.inspectEquipBtn.style.opacity = '1';
      }
    }
  }

  equipItem(itemId) {
    const item = VAULT_ITEMS_CATALOG.find(i => i.id === itemId);
    if (!item) return;

    if (item.minLevel > this.playerManager.state.level) {
      return;
    }

    const isWeapon = item.category === 'weapon';
    soundFX.playEquip(isWeapon);

    this.equipped[item.category] = item.id;
    StorageManager.saveEquipped(this.equipped);

    // Direct invocation on Dynamic Equip Manager for instantaneous feedback
    if (this.character3DEngine && this.character3DEngine.dynamicEquipManager) {
      if (item.category === 'torso') {
        this.character3DEngine.dynamicEquipManager.equipTorso(item);
      } else if (item.category === 'head') {
        this.character3DEngine.dynamicEquipManager.equipHeadgear(item);
      } else if (item.category === 'weapon') {
        this.character3DEngine.dynamicEquipManager.equipWeapon(item);
      } else if (item.category === 'accessory') {
        this.character3DEngine.dynamicEquipManager.equipAccessory(item);
      }
    }

    this.renderAvatarLayers();
    this.renderVaultGrid();
    this.inspectItem(item);
  }

  updateEquippedCount() {
    if (this.equippedCountEl) {
      const totalSlots = 4;
      let count = 0;
      if (this.equipped.head) count++;
      if (this.equipped.torso) count++;
      if (this.equipped.weapon) count++;
      if (this.equipped.accessory) count++;
      this.equippedCountEl.textContent = `${count} / ${totalSlots}`;
    }
  }

  checkForNewUnlocks(oldLevel, newLevel) {
    return VAULT_ITEMS_CATALOG.filter(
      item => item.minLevel > oldLevel && item.minLevel <= newLevel
    );
  }
}


/* ============================================================================
   7. CONSISTENCY MATRIX & STREAK TRACKER
   ============================================================================ */
class StreakManager {
  constructor(playerManager) {
    this.playerManager = playerManager;
    this.matrix = StorageManager.loadStreakMatrix();

    this.streakCounterEl = document.getElementById('streak-counter-number');
    this.blocksRowEl = document.getElementById('contribution-blocks-row');
    this.dailyClaimBtn = document.getElementById('claim-daily-btn');
    this.cheerTextEl = document.getElementById('streak-cheer-text');

    this.init();
  }

  init() {
    if (this.dailyClaimBtn) {
      this.dailyClaimBtn.addEventListener('click', () => {
        this.claimDailyBounty();
      });
    }

    this.render();
  }

  claimDailyBounty() {
    const todayStr = new Date().toDateString();
    if (this.playerManager.state.lastDailyClaim === todayStr) {
      soundFX.playClick();
      return;
    }

    soundFX.playQuestComplete();
    confettiEngine.burst(50);

    this.playerManager.state.lastDailyClaim = todayStr;
    this.playerManager.state.streakDays += 1;
    this.playerManager.addXP(50, this.dailyClaimBtn);

    const todayBlock = this.matrix[this.matrix.length - 1];
    if (todayBlock) {
      todayBlock.level = Math.min(3, todayBlock.level + 1);
      StorageManager.saveStreakMatrix(this.matrix);
    }

    StorageManager.savePlayer(this.playerManager.state);
    this.render();
  }

  render() {
    if (this.streakCounterEl) {
      this.streakCounterEl.textContent = this.playerManager.state.streakDays;
    }

    const todayStr = new Date().toDateString();
    const alreadyClaimed = this.playerManager.state.lastDailyClaim === todayStr;

    if (this.dailyClaimBtn) {
      if (alreadyClaimed) {
        this.dailyClaimBtn.classList.add('claimed');
        this.dailyClaimBtn.innerHTML = '<span>✅ Daily Bounty Claimed</span>';
      } else {
        this.dailyClaimBtn.classList.remove('claimed');
        this.dailyClaimBtn.innerHTML = '<span class="btn-icon">🎁</span><span>Claim Daily Bounty (+50 XP)</span>';
      }
    }

    if (this.blocksRowEl) {
      this.blocksRowEl.innerHTML = '';
      this.matrix.forEach((item, idx) => {
        const isToday = idx === this.matrix.length - 1;
        const col = document.createElement('div');
        col.className = 'activity-day-col';

        col.innerHTML = `
          <div class="activity-block level-${item.level} ${isToday ? 'is-today' : ''}" title="${item.day}: Activity Level ${item.level}"></div>
          <span class="day-name">${item.day}</span>
        `;

        this.blocksRowEl.appendChild(col);
      });
    }
  }
}


/* ============================================================================
   8. PLAYER PROGRESSION & LEVEL-UP CELEBRATION ENGINE
   ============================================================================ */
class PlayerManager {
  constructor() {
    this.state = StorageManager.loadPlayer();
    
    this.ranks = [
      { minLevel: 1, title: 'Novice Apprentice' },
      { minLevel: 2, title: 'Algorithm Knight' },
      { minLevel: 3, title: 'Cyber Blade' },
      { minLevel: 4, title: 'Memory Sorcerer' },
      { minLevel: 5, title: 'Fullstack Archmage' },
      { minLevel: 7, title: 'Kernel Vanguard' },
      { minLevel: 10, title: 'Ascended Cyber Overlord' }
    ];

    this.vaultManager = null;
    this.themeManager = null;

    // DOM Elements
    this.levelBadgeEl = document.getElementById('player-level-badge');
    this.rankTitleEl = document.getElementById('player-rank-title');
    this.currentXPEl = document.getElementById('current-xp-display');
    this.maxXPEl = document.getElementById('max-xp-display');
    this.xpFillBarEl = document.getElementById('xp-fill-bar');
    this.statQuestsEl = document.getElementById('stat-completed-quests');
    this.statFocusEl = document.getElementById('stat-focus-time');
    this.statTotalXPEl = document.getElementById('stat-total-xp');

    this.levelUpModal = document.getElementById('levelup-modal');
    this.modalNewLevelText = document.getElementById('modal-new-level-text');
    this.modalRankUpgradeText = document.getElementById('modal-rank-upgrade-text');
    this.modalUnlockedGearBox = document.getElementById('modal-unlocked-gear-box');
    this.modalUnlockedGearName = document.getElementById('modal-unlocked-gear-name');
    this.modalCloseBtn = document.getElementById('close-levelup-modal-btn');

    this.init();
  }

  init() {
    this.render();
    this.closeLevelUpModal(false);

    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener('click', () => {
        this.closeLevelUpModal(true);
      });
    }

    if (this.levelUpModal) {
      this.levelUpModal.addEventListener('click', (e) => {
        if (e.target === this.levelUpModal) {
          this.closeLevelUpModal(true);
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.levelUpModal && !this.levelUpModal.hidden && this.levelUpModal.style.display !== 'none') {
        this.closeLevelUpModal(true);
      }
    });
  }

  getXPForNextLevel(level) {
    return level * 500;
  }

  getRankTitle(level) {
    let currentRank = this.ranks[0].title;
    for (const r of this.ranks) {
      if (level >= r.minLevel) {
        currentRank = r.title;
      }
    }
    return currentRank;
  }

  addXP(amount, triggerElement = null) {
    if (amount <= 0) return;

    this.state.totalXPEarned += amount;
    this.state.currentXP += amount;

    this.spawnFloatingXP(amount, triggerElement);

    const oldLevel = this.state.level;
    let maxXP = this.getXPForNextLevel(this.state.level);
    let leveledUp = false;

    while (this.state.currentXP >= maxXP) {
      this.state.currentXP -= maxXP;
      this.state.level += 1;
      maxXP = this.getXPForNextLevel(this.state.level);
      leveledUp = true;
    }

    StorageManager.savePlayer(this.state);
    this.render();

    if (leveledUp) {
      // Notify theme manager of level-up
      if (this.themeManager) {
        this.themeManager.onLevelUp();
      }

      let newlyUnlocked = [];
      if (this.vaultManager) {
        newlyUnlocked = this.vaultManager.checkForNewUnlocks(oldLevel, this.state.level);
        this.vaultManager.renderVaultGrid();
      }
      this.triggerLevelUpCelebration(newlyUnlocked);
    }
  }

  incrementQuestsCleared() {
    this.state.questsClearedCount += 1;
    StorageManager.savePlayer(this.state);
    this.render();
  }

  addFocusMinutes(minutes) {
    this.state.focusMinutes += minutes;
    StorageManager.savePlayer(this.state);
    this.render();
  }

  spawnFloatingXP(amount, triggerElement) {
    const container = document.getElementById('xp-floating-container');
    if (!container) return;

    const popup = document.createElement('div');
    popup.className = 'floating-xp';
    popup.textContent = `+${amount} XP`;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (triggerElement) {
      const rect = triggerElement.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top;
    }

    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;

    container.appendChild(popup);

    setTimeout(() => {
      popup.remove();
    }, 1300);
  }

  triggerLevelUpCelebration(newlyUnlocked = []) {
    soundFX.playLevelUp();
    confettiEngine.burst(150);

    // Trigger 3D Operative Victory Pose Animation & Spin
    if (this.vaultManager && this.vaultManager.character3DEngine) {
      this.vaultManager.character3DEngine.triggerVictory();
    }

    if (this.modalNewLevelText) {
      this.modalNewLevelText.textContent = `LEVEL ${this.state.level}`;
    }
    if (this.modalRankUpgradeText) {
      this.modalRankUpgradeText.textContent = `Rank: ${this.getRankTitle(this.state.level)}`;
    }

    if (this.modalUnlockedGearBox && this.modalUnlockedGearName) {
      if (newlyUnlocked.length > 0) {
        this.modalUnlockedGearBox.style.display = 'block';
        this.modalUnlockedGearName.textContent = newlyUnlocked.map(i => `${i.icon} ${i.name}`).join(' &bull; ');
      } else {
        this.modalUnlockedGearBox.style.display = 'none';
      }
    }

    if (this.levelUpModal) {
      this.levelUpModal.removeAttribute('hidden');
      this.levelUpModal.classList.add('active');
      this.levelUpModal.style.display = 'flex';
    }
  }

  closeLevelUpModal(playSound = true) {
    if (playSound) soundFX.playClick();
    if (this.levelUpModal) {
      this.levelUpModal.setAttribute('hidden', '');
      this.levelUpModal.classList.remove('active');
      this.levelUpModal.style.display = 'none';
    }
  }

  render() {
    const maxXP = this.getXPForNextLevel(this.state.level);
    const progressPercent = Math.min(100, Math.round((this.state.currentXP / maxXP) * 100));

    if (this.levelBadgeEl) this.levelBadgeEl.textContent = `LVL ${this.state.level}`;
    if (this.rankTitleEl) this.rankTitleEl.textContent = this.getRankTitle(this.state.level);
    if (this.currentXPEl) this.currentXPEl.textContent = this.state.currentXP.toLocaleString();
    if (this.maxXPEl) this.maxXPEl.textContent = maxXP.toLocaleString();

    if (this.xpFillBarEl) {
      this.xpFillBarEl.style.width = `${progressPercent}%`;
    }

    if (this.statQuestsEl) this.statQuestsEl.textContent = this.state.questsClearedCount;
    if (this.statFocusEl) this.statFocusEl.textContent = `${this.state.focusMinutes}m`;
    if (this.statTotalXPEl) this.statTotalXPEl.textContent = this.state.totalXPEarned.toLocaleString();
  }
}


/* ============================================================================
   9. THE ARENA: CIRCULAR POMODORO FOCUS TIMER
   ============================================================================ */
class TimerManager {
  constructor(playerManager) {
    this.playerManager = playerManager;

    this.modes = {
      pomodoro: { label: 'Deep Grind', duration: 25 * 60, xpReward: 150 },
      shortBreak: { label: 'Mana Rest', duration: 5 * 60, xpReward: 30 },
      longBreak: { label: 'Tavern Break', duration: 15 * 60, xpReward: 75 }
    };

    this.currentMode = 'pomodoro';
    this.totalDuration = this.modes[this.currentMode].duration;
    this.timeLeft = this.totalDuration;
    this.isRunning = false;
    this.timerInterval = null;

    this.circumference = 2 * Math.PI * 118;

    this.displayEl = document.getElementById('timer-display');
    this.toggleBtn = document.getElementById('timer-toggle-btn');
    this.btnIconEl = document.getElementById('timer-btn-icon');
    this.btnLabelEl = document.getElementById('timer-btn-label');
    this.resetBtn = document.getElementById('timer-reset-btn');
    this.skipBtn = document.getElementById('timer-skip-btn');
    this.ringEl = document.getElementById('timer-progress-ring');
    this.stateLabelEl = document.getElementById('timer-state-label');
    this.statusBannerText = document.getElementById('status-banner-text');
    this.modeButtons = document.querySelectorAll('.mode-btn');

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateDisplay();
    this.updateRing();
  }

  setupEventListeners() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => {
        soundFX.playClick();
        this.toggle();
      });
    }

    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => {
        soundFX.playClick();
        this.reset();
      });
    }

    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', () => {
        soundFX.playClick();
        this.completeSession();
      });
    }

    this.modeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        soundFX.playClick();
        const mode = btn.dataset.mode;
        this.switchMode(mode);
      });
    });
  }

  switchMode(mode) {
    if (!this.modes[mode]) return;
    this.pause();
    this.currentMode = mode;
    this.totalDuration = this.modes[mode].duration;
    this.timeLeft = this.totalDuration;

    this.modeButtons.forEach(btn => {
      const isActive = btn.dataset.mode === mode;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (this.stateLabelEl) {
      this.stateLabelEl.textContent = mode === 'pomodoro' ? 'READY FOR BATTLE' : 'REST PHASE';
    }

    if (this.statusBannerText) {
      this.statusBannerText.textContent = `Switched to ${this.modes[mode].label} mode (${Math.round(this.totalDuration / 60)} min).`;
    }

    this.updateDisplay();
    this.updateRing();
  }

  toggle() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    if (this.toggleBtn) this.toggleBtn.classList.add('grinding');
    if (this.btnIconEl) this.btnIconEl.textContent = '⏸️';
    if (this.btnLabelEl) this.btnLabelEl.textContent = 'Pause Grind';

    if (this.stateLabelEl) {
      this.stateLabelEl.textContent = this.currentMode === 'pomodoro' ? '⚔️ IN COMBAT' : '🛡️ RESTING';
    }

    if (this.statusBannerText) {
      this.statusBannerText.textContent = this.currentMode === 'pomodoro' 
        ? 'Grind session in progress! Maintain relentless focus.' 
        : 'Resting mana pool. Breathe and stretch.';
    }

    this.timerInterval = setInterval(() => {
      this.tick();
    }, 1000);
  }

  pause() {
    if (!this.isRunning) return;
    this.isRunning = false;
    clearInterval(this.timerInterval);

    if (this.toggleBtn) this.toggleBtn.classList.remove('grinding');
    if (this.btnIconEl) this.btnIconEl.textContent = '⚔️';
    if (this.btnLabelEl) this.btnLabelEl.textContent = 'Resume Grind';

    if (this.stateLabelEl) {
      this.stateLabelEl.textContent = 'COMBAT PAUSED';
    }

    if (this.statusBannerText) {
      this.statusBannerText.textContent = 'Grind paused. Resume when ready to slay tasks.';
    }
  }

  reset() {
    this.pause();
    this.timeLeft = this.totalDuration;
    if (this.btnLabelEl) this.btnLabelEl.textContent = 'Start Grind';
    if (this.stateLabelEl) {
      this.stateLabelEl.textContent = this.currentMode === 'pomodoro' ? 'READY FOR BATTLE' : 'REST PHASE';
    }
    if (this.statusBannerText) {
      this.statusBannerText.textContent = 'Timer reset to initial countdown duration.';
    }
    document.title = 'QuestLog - OSS Edition | RPG Focus & Habit Dashboard';
    this.updateDisplay();
    this.updateRing();
  }

  tick() {
    if (this.timeLeft > 0) {
      this.timeLeft -= 1;
      this.updateDisplay();
      this.updateRing();
    } else {
      this.completeSession();
    }
  }

  completeSession() {
    this.pause();
    soundFX.playTimerComplete();
    confettiEngine.burst(80);

    const xpEarned = this.modes[this.currentMode].xpReward;
    const minutesCompleted = Math.round(this.totalDuration / 60);

    if (this.currentMode === 'pomodoro') {
      this.playerManager.addFocusMinutes(minutesCompleted);
      this.playerManager.addXP(xpEarned, this.toggleBtn);

      if (this.statusBannerText) {
        this.statusBannerText.textContent = `VICTORY! Completed ${minutesCompleted}m focus grind. Awarded +${xpEarned} XP!`;
      }
    } else {
      this.playerManager.addXP(xpEarned, this.toggleBtn);
      if (this.statusBannerText) {
        this.statusBannerText.textContent = `Rest finished! Mana regenerated. +${xpEarned} XP gained.`;
      }
    }

    this.reset();
  }

  updateDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (this.displayEl) {
      this.displayEl.textContent = formatted;
    }

    if (this.isRunning) {
      document.title = `(${formatted}) ${this.modes[this.currentMode].label} | QuestLog`;
    }
  }

  updateRing() {
    if (!this.ringEl) return;
    const progress = (this.totalDuration - this.timeLeft) / this.totalDuration;
    const offset = this.circumference * progress;
    this.ringEl.style.strokeDashoffset = offset;
  }
}


/* ============================================================================
   10. THE QUEST BOARD: BOUNTY & HABIT MANAGEMENT
   ============================================================================ */
class QuestManager {
  constructor(playerManager) {
    this.playerManager = playerManager;
    this.activeQuests = StorageManager.loadActiveQuests();
    this.completedQuests = StorageManager.loadCompletedQuests();

    this.activeListEl = document.getElementById('active-quests-list');
    this.completedListEl = document.getElementById('completed-quests-list');
    this.activeCountEl = document.getElementById('active-quests-count');
    this.completedCountEl = document.getElementById('completed-quests-count');
    this.toggleDrawerBtn = document.getElementById('toggle-add-quest-btn');
    this.addDrawerEl = document.getElementById('add-quest-drawer');
    this.newQuestForm = document.getElementById('new-quest-form');
    this.inputTitle = document.getElementById('quest-input-title');
    this.selectDifficulty = document.getElementById('quest-difficulty-select');
    this.cancelAddBtn = document.getElementById('cancel-add-quest-btn');
    this.clearCompletedBtn = document.getElementById('clear-completed-btn');

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.render();
  }

  setupEventListeners() {
    if (this.addDrawerEl) {
      this.addDrawerEl.setAttribute('hidden', '');
      this.addDrawerEl.style.display = 'none';
    }

    if (this.toggleDrawerBtn && this.addDrawerEl) {
      this.toggleDrawerBtn.addEventListener('click', () => {
        soundFX.playClick();
        const isHidden = this.addDrawerEl.hasAttribute('hidden') || this.addDrawerEl.style.display === 'none';
        if (isHidden) {
          this.addDrawerEl.removeAttribute('hidden');
          this.addDrawerEl.style.display = 'block';
          this.toggleDrawerBtn.setAttribute('aria-expanded', 'true');
          if (this.inputTitle) {
            setTimeout(() => this.inputTitle.focus(), 50);
          }
        } else {
          this.addDrawerEl.setAttribute('hidden', '');
          this.addDrawerEl.style.display = 'none';
          this.toggleDrawerBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    if (this.cancelAddBtn && this.addDrawerEl) {
      this.cancelAddBtn.addEventListener('click', () => {
        soundFX.playClick();
        this.addDrawerEl.setAttribute('hidden', '');
        this.addDrawerEl.style.display = 'none';
        if (this.toggleDrawerBtn) {
          this.toggleDrawerBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    if (this.newQuestForm) {
      this.newQuestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddQuest();
      });
    }

    if (this.clearCompletedBtn) {
      this.clearCompletedBtn.addEventListener('click', () => {
        if (this.completedQuests.length === 0) return;
        soundFX.playClick();
        this.completedQuests = [];
        StorageManager.saveCompletedQuests(this.completedQuests);
        this.render();
      });
    }

    // Drag-and-Drop: Allow dragging tasks to "Completed" to slay them
    if (this.completedListEl) {
      const completedCol = this.completedListEl.closest('.quest-column') || this.completedListEl;
      completedCol.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        completedCol.classList.add('drag-over');
      });
      completedCol.addEventListener('dragleave', (e) => {
        if (!completedCol.contains(e.relatedTarget)) {
          completedCol.classList.remove('drag-over');
        }
      });
      completedCol.addEventListener('drop', (e) => {
        e.preventDefault();
        completedCol.classList.remove('drag-over');
        const questId = e.dataTransfer.getData('text/plain');
        if (questId) {
          this.completeQuest(questId);
        }
      });
    }
  }

  handleAddQuest() {
    const title = this.inputTitle.value.trim();
    if (!title) return;

    const difficulty = this.selectDifficulty.value;
    let xp = 100;
    let tierLabel = 'Veteran';

    if (difficulty === 'easy') {
      xp = 50;
      tierLabel = 'Apprentice';
    } else if (difficulty === 'legendary') {
      xp = 250;
      tierLabel = 'Legendary';
    }

    const newQuest = {
      id: 'quest-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      title,
      difficulty,
      xp,
      tierLabel,
      createdAt: Date.now()
    };

    this.activeQuests.unshift(newQuest);
    StorageManager.saveActiveQuests(this.activeQuests);

    soundFX.playClick();
    this.inputTitle.value = '';
    this.addDrawerEl.setAttribute('hidden', '');
    this.addDrawerEl.style.display = 'none';
    if (this.toggleDrawerBtn) {
      this.toggleDrawerBtn.setAttribute('aria-expanded', 'false');
    }
    this.render();
  }

  completeQuest(questId, triggerElement) {
    const index = this.activeQuests.findIndex(q => q.id === questId);
    if (index === -1) return;

    const quest = this.activeQuests.splice(index, 1)[0];
    quest.completedAt = Date.now();
    this.completedQuests.unshift(quest);

    StorageManager.saveActiveQuests(this.activeQuests);
    StorageManager.saveCompletedQuests(this.completedQuests);

    soundFX.playQuestComplete();
    this.playerManager.addXP(quest.xp, triggerElement);
    this.playerManager.incrementQuestsCleared();

    this.render();
  }

  restoreQuest(questId) {
    const index = this.completedQuests.findIndex(q => q.id === questId);
    if (index === -1) return;

    const quest = this.completedQuests.splice(index, 1)[0];
    delete quest.completedAt;
    this.activeQuests.push(quest);

    StorageManager.saveActiveQuests(this.activeQuests);
    StorageManager.saveCompletedQuests(this.completedQuests);

    soundFX.playClick();
    this.render();
  }

  deleteQuest(questId, isCompleted = false) {
    soundFX.playClick();
    if (isCompleted) {
      this.completedQuests = this.completedQuests.filter(q => q.id !== questId);
      StorageManager.saveCompletedQuests(this.completedQuests);
    } else {
      this.activeQuests = this.activeQuests.filter(q => q.id !== questId);
      StorageManager.saveActiveQuests(this.activeQuests);
    }
    this.render();
  }

  formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  render() {
    if (this.activeCountEl) this.activeCountEl.textContent = this.activeQuests.length;
    if (this.completedCountEl) this.completedCountEl.textContent = this.completedQuests.length;

    if (this.activeListEl) {
      if (this.activeQuests.length === 0) {
        this.activeListEl.innerHTML = `
          <div class="empty-state">
            <span class="empty-state-icon">🛡️</span>
            <p class="empty-state-text">No active bounties! Summon a quest to begin your grind.</p>
          </div>
        `;
      } else {
        this.activeListEl.innerHTML = '';
        this.activeQuests.forEach(quest => {
          const card = document.createElement('div');
          card.className = `quest-card ${quest.difficulty}-tier`;
          card.setAttribute('role', 'listitem');
          card.dataset.id = quest.id;

          // Drag-and-Drop capability on active quest cards
          card.setAttribute('draggable', 'true');
          card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', quest.id);
            e.dataTransfer.effectAllowed = 'move';
            card.classList.add('dragging');
          });
          card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
          });

          card.innerHTML = `
            <button class="quest-check-btn" aria-label="Slay Quest and claim XP" title="Slay Quest (+${quest.xp} XP)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
            <div class="quest-content">
              <span class="quest-title-text">${this.escapeHTML(quest.title)}</span>
              <div class="quest-badges-row">
                <span class="quest-xp-pill">+${quest.xp} XP</span>
                <span class="quest-tier-pill">${quest.tierLabel}</span>
              </div>
            </div>
            <div class="quest-actions">
              <button class="card-action-icon delete-btn" aria-label="Abandon Quest" title="Abandon Quest">
                ✕
              </button>
            </div>
          `;

          const checkBtn = card.querySelector('.quest-check-btn');
          checkBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.completeQuest(quest.id, checkBtn);
          });

          const deleteBtn = card.querySelector('.delete-btn');
          deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteQuest(quest.id, false);
          });

          card.addEventListener('click', () => {
            this.completeQuest(quest.id, checkBtn);
          });

          this.activeListEl.appendChild(card);
        });
      }
    }

    if (this.completedListEl) {
      if (this.completedQuests.length === 0) {
        this.completedListEl.innerHTML = `
          <div class="empty-state">
            <span class="empty-state-icon">⚔️</span>
            <p class="empty-state-text">No completed quests yet. Slay active bounties to fill the victory hall!</p>
          </div>
        `;
      } else {
        this.completedListEl.innerHTML = '';
        this.completedQuests.forEach(quest => {
          const card = document.createElement('div');
          card.className = `quest-card completed ${quest.difficulty}-tier`;
          card.setAttribute('role', 'listitem');
          card.dataset.id = quest.id;

          card.innerHTML = `
            <div class="quest-check-btn" title="Completed">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div class="quest-content">
              <span class="quest-title-text">${this.escapeHTML(quest.title)}</span>
              <div class="quest-badges-row">
                <span class="quest-xp-pill">+${quest.xp} XP</span>
                <span class="quest-timestamp">Cleared ${this.formatTime(quest.completedAt)}</span>
              </div>
            </div>
            <div class="quest-actions">
              <button class="card-action-icon undo-btn" aria-label="Re-open Quest" title="Re-open Quest">
                ↺
              </button>
              <button class="card-action-icon delete-btn" aria-label="Remove from Archive" title="Remove from Archive">
                ✕
              </button>
            </div>
          `;

          const undoBtn = card.querySelector('.undo-btn');
          undoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.restoreQuest(quest.id);
          });

          const deleteBtn = card.querySelector('.delete-btn');
          deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteQuest(quest.id, true);
          });

          this.completedListEl.appendChild(card);
        });
      }
    }
  }

  escapeHTML(str) {
    const p = document.createElement('p');
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
  }
}


/* ============================================================================
   11. QUESTLOG ACADEMY SYSTEM: WEEKLY TASKS, ACTIVITIES, STUDY HUB,
       PORTFOLIO & LEADERBOARD
   ============================================================================ */
class QuestLogAcademy {
  constructor(playerManager) {
    this.playerManager = playerManager;
    this.user = () => StorageManager.getAuthUser() || 'OPERATOR';
    this.weekKey = this.getWeekKey();
    this.weekly = StorageManager.loadJSON(STORAGE_KEYS.WEEKLY, { week: this.weekKey, completed: [], xp: 0, bonus: 0 });
    this.activities = StorageManager.loadJSON(STORAGE_KEYS.ACTIVITIES, []);
    this.tests = StorageManager.loadJSON(STORAGE_KEYS.TESTS, []);
    if (this.weekly.week !== this.weekKey) this.weekly = { week: this.weekKey, completed: [], xp: 0, bonus: 0 };
    this.resourceMode = 'subjects'; this.leaderDomain = 'overall';
    this.weeklyTasks = [
      { id:'hackerrank', icon:'⭐', title:'Earn a Star in HackerRank', desc:'Solve enough challenges to earn or improve a HackerRank star.', xp:100 },
      { id:'club', icon:'🏫', title:'Complete One Club Activity', desc:'Attend, contribute or submit work for a college club activity.', xp:100 },
      { id:'project', icon:'🛠️', title:'Ship One Project Improvement', desc:'Push one meaningful feature, bug fix or UI improvement.', xp:125 },
      { id:'study', icon:'📚', title:'Complete 3 Study Sessions', desc:'Finish three focused sessions for your current subjects.', xp:100 },
      { id:'event', icon:'🚀', title:'Participate in an Event', desc:'Join a hackathon, quiz, competition or external event.', xp:150 }
    ];
    this.init();
  }

  getWeekKey(date = new Date()) {
    const d = new Date(date); const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day; d.setDate(d.getDate()+diff);
    return d.toISOString().slice(0,10);
  }
  save() { StorageManager.saveJSON(STORAGE_KEYS.WEEKLY,this.weekly); StorageManager.saveJSON(STORAGE_KEYS.ACTIVITIES,this.activities); StorageManager.saveJSON(STORAGE_KEYS.TESTS,this.tests); }
  xpForActivity(type,result) {
    const map = { club:{participated:25,finalist:100,won:250}, hackathon:{participated:75,finalist:175,won:400}, external:{participated:150,finalist:300,won:600}, competition:{participated:60,finalist:150,won:350} };
    return (map[type]||map.club)[result] || 25;
  }
  init() {
    document.querySelectorAll('.nav-tab').forEach(btn => btn.addEventListener('click',()=>{ soundFX.playClick(); this.showPage(btn.dataset.page); }));
    const add=document.getElementById('add-activity-btn'); if(add) add.addEventListener('click',()=>this.addActivity());
    document.querySelectorAll('.resource-tab').forEach(b=>b.addEventListener('click',()=>{soundFX.playClick(); this.resourceMode=b.dataset.resource; document.querySelectorAll('.resource-tab').forEach(x=>x.classList.toggle('active',x===b)); this.renderResources();}));
    document.querySelectorAll('.leader-tab').forEach(b=>b.addEventListener('click',()=>{soundFX.playClick(); this.leaderDomain=b.dataset.domain; document.querySelectorAll('.leader-tab').forEach(x=>x.classList.toggle('active',x===b)); this.renderLeaderboard();}));
    const submit=document.getElementById('submit-test-btn'); if(submit) submit.addEventListener('click',()=>this.submitTest());
    this.renderAll();
  }
  showPage(page) {
    document.querySelectorAll('.nav-tab').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
    document.querySelectorAll('.page-section').forEach(s=>s.hidden=!s.classList.contains(`page-${page}`));
    const target=document.getElementById(`page-${page}`); if(target) target.hidden=false;
    if(page==='portfolio') this.renderPortfolio(); if(page==='leaderboard') this.renderLeaderboard(); if(page==='study') this.renderResources(); if(page==='weekly') this.renderWeekly(); if(page==='activity') this.renderActivities();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  addXP(amount,source) { this.playerManager.addXP(amount); soundFX.playReward(); confettiEngine.burst(45); this.activities.push({id:Date.now(),name:source,type:'quest',result:'completed',xp:amount,at:Date.now()}); this.save(); this.renderAll(); }
  renderWeekly() {
    const grid=document.getElementById('weekly-tasks-grid'); if(!grid)return;
    const completed=new Set(this.weekly.completed);
    grid.innerHTML=this.weeklyTasks.map(t=>`<article class="weekly-task-card glass-panel ${completed.has(t.id)?'done':''}"><div class="task-icon">${t.icon}</div><div class="task-main"><div class="task-top"><h3>${t.title}</h3><span>+${t.xp} XP</span></div><p>${t.desc}</p><div class="task-progress"><div style="width:${completed.has(t.id)?100:0}%"></div></div></div><button class="task-complete-btn" data-task="${t.id}" ${completed.has(t.id)?'disabled':''}>${completed.has(t.id)?'✓ Completed':'Complete'}</button></article>`).join('');
    grid.querySelectorAll('.task-complete-btn').forEach(b=>b.addEventListener('click',()=>this.completeWeekly(b.dataset.task)));
    const count=completed.size, xp=this.weekly.xp, bonus=this.weekly.bonus;
    document.getElementById('weekly-completed-count').textContent=`${count} / 5`; document.getElementById('weekly-xp').textContent=`${xp} XP`; document.getElementById('weekly-bonus').textContent=`+${bonus} XP`; document.getElementById('weekly-reset-chip').textContent=`WEEK OF ${this.weekKey}`;
  }
  completeWeekly(id) {
    if(this.weekly.completed.includes(id))return; const t=this.weeklyTasks.find(x=>x.id===id); if(!t)return;
    this.weekly.completed.push(id); this.weekly.xp += t.xp; this.playerManager.addXP(t.xp);
    if(this.weekly.completed.length===5){ this.weekly.bonus=250; this.playerManager.addXP(250); soundFX.playLevelUp(); confettiEngine.burst(160); } else { soundFX.playQuestComplete(); confettiEngine.burst(70); }
    this.save(); this.renderAll();
  }
  addActivity() {
    const name=document.getElementById('activity-name').value.trim(); if(!name){alert('Enter an event name first.');return;}
    const type=document.getElementById('activity-type').value, result=document.getElementById('activity-result').value, xp=this.xpForActivity(type,result);
    const activity={id:Date.now(),name,type,result,xp,at:Date.now()}; this.activities.unshift(activity); this.playerManager.addXP(xp); soundFX.playReward(); confettiEngine.burst(result==='won'?140:70); this.save();
    document.getElementById('activity-name').value=''; this.renderAll();
  }
  renderActivities() {
    const el=document.getElementById('activity-list'); if(!el)return;
    if(!this.activities.length){el.innerHTML='<div class="empty-state glass-panel"><span>🏆</span><p>No achievements logged yet.</p></div>';return;}
    el.innerHTML=this.activities.slice(0,30).map(a=>`<article class="activity-card glass-panel"><div class="activity-icon">${a.result==='won'?'🏆':a.result==='finalist'?'🥈':'🎯'}</div><div><h3>${this.escape(a.name)}</h3><p>${this.label(a.type)} • ${this.label(a.result)} • ${new Date(a.at).toLocaleDateString()}</p></div><strong>+${a.xp} XP</strong></article>`).join('');
  }
  renderResources() {
    const el=document.getElementById('resource-content'); if(!el)return;
    const data={
      subjects:[['C++ / DSA','NeetCode + Striver-style problem solving','Use for algorithms, arrays, trees and competitive programming.','https://www.youtube.com/results?search_query=cpp+dsa+playlist','Book: Data Structures & Algorithms Made Easy'],['Python','Python fundamentals + project building','Good for automation, Flask and AI-assisted prototypes.','https://www.youtube.com/results?search_query=python+full+course+playlist','Book: Automate the Boring Stuff with Python'],['Mathematics','Discrete math, probability and linear algebra','Build the base for CSE and quantitative thinking.','https://www.youtube.com/results?search_query=discrete+mathematics+playlist','Book: Discrete Mathematics and Its Applications']],
      coding:[['HackerRank','Daily algorithms practice','Target one small challenge every day and track stars.','https://www.hackerrank.com/','Practice: solve 1–3 problems daily'],['Git & GitHub','Version control essentials','Branches, commits, pull requests and team workflows.','https://www.youtube.com/results?search_query=git+github+full+course','Book: Pro Git (free online)'],['Web Development','HTML → CSS → JS → deployment','Build real pages before moving to frameworks.','https://www.youtube.com/results?search_query=web+development+full+course','Book: Eloquent JavaScript']],
      hackathons:[['Before the hackathon','Pick a real problem + define MVP','Keep the first version demoable within the event time.','https://www.youtube.com/results?search_query=hackathon+winning+strategy','Guide: build the smallest working demo first'],['Team workflow','GitHub issues + branches + integration','Split frontend, backend, research and presentation work.','https://www.youtube.com/results?search_query=github+team+workflow','Book: The Pragmatic Programmer'],['Pitch & demo','Problem → solution → proof → impact','Show the working flow instead of only describing features.','https://www.youtube.com/results?search_query=hackathon+pitch+presentation','Guide: 3-minute demo + measurable impact']]
    };
    el.innerHTML=data[this.resourceMode].map(([title,sub,desc,url,book])=>`<article class="resource-card glass-panel"><div class="resource-icon">${this.resourceMode==='hackathons'?'🚀':this.resourceMode==='coding'?'💻':'📚'}</div><h3>${title}</h3><span>${sub}</span><p>${desc}</p><div class="resource-book">📕 ${book}</div><a href="${url}" target="_blank" rel="noopener">Open resource ↗</a></article>`).join('');
  }
  domainScores() {
    const scores={programming:0,math:0,science:0,hackathons:0};
    this.tests.forEach(t=>scores[t.subject]=(scores[t.subject]||0)+Number(t.score||0));
    this.activities.forEach(a=>{if(a.type==='hackathon'||a.type==='external')scores.hackathons+=a.xp;});
    scores.programming += this.playerManager.state.totalXPEarned*0.15; return scores;
  }
  renderLeaderboard() {
    const el=document.getElementById('leaderboard-table'); if(!el)return;
    const tag=this.user(), domains=this.domainScores(); const current={name:tag,xp:this.playerManager.state.totalXPEarned,tests:domains};
    const demo=[{name:'NovaKnight',xp:4200,tests:{programming:94,math:88,science:91,hackathons:760}},{name:'CodeRaptor',xp:3650,tests:{programming:97,math:74,science:83,hackathons:520}},{name:'OrbitMage',xp:3180,tests:{programming:82,math:95,science:93,hackathons:430}},{name:'ByteSamurai',xp:2890,tests:{programming:88,math:81,science:79,hackathons:610}}];
    const rows=[...demo,{name:current.name,xp:current.xp,tests:current.tests}].sort((a,b)=>this.leaderDomain==='overall'?b.xp-a.xp:b.tests[this.leaderDomain]-a.tests[this.leaderDomain]);
    const title=this.leaderDomain==='overall'?'Overall XP':`${this.label(this.leaderDomain)} Score`;
    el.innerHTML=`<div class="leader-head"><span>RANK</span><span>OPERATOR</span><span>${title.toUpperCase()}</span></div>`+rows.map((r,i)=>`<div class="leader-row ${r.name===tag?'you':''}"><strong>${i+1}</strong><span>⚔️ ${this.escape(r.name)} ${r.name===tag?'<em>YOU</em>':''}</span><strong>${Math.round(this.leaderDomain==='overall'?r.xp:r.tests[this.leaderDomain]||0)}${this.leaderDomain==='overall'?' XP':''}</strong></div>`).join('');
  }
  submitTest() {
    const subject=document.getElementById('test-subject').value, score=Number(document.getElementById('test-score').value); if(!Number.isFinite(score)||score<0||score>100){alert('Enter a score from 0 to 100.');return;}
    const sunday=new Date().getDay()===0; if(!sunday && !confirm('Today is not Sunday. Save this as a practice test anyway?'))return;
    this.tests.unshift({id:Date.now(),user:this.user(),subject,score,at:Date.now()}); this.playerManager.addXP(Math.round(score*2)); soundFX.playReward(); confettiEngine.burst(score>=90?130:60); this.save(); document.getElementById('test-score').value=''; this.renderAll();
  }
  renderPortfolio() {
    const p=this.playerManager.state, tag=this.user(); document.getElementById('portfolio-name').textContent=tag; document.getElementById('portfolio-rank').textContent=this.playerManager.getRankTitle(p.level); document.getElementById('portfolio-xp').textContent=p.totalXPEarned;
    document.getElementById('portfolio-stats').innerHTML=[['Level',p.level],['Quests',p.questsClearedCount],['Focus',`${p.focusMinutes}m`],['Events',this.activities.length]].map(x=>`<div class="stat-mini glass-panel"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('');
    const badges=[['⚔️','First Quest','Clear your first quest',p.questsClearedCount>=1],['🔥','Streak Hunter','Build a 3+ day streak',p.streakDays>=3],['🚀','Event Runner','Log an event',this.activities.length>=1],['🏆','Champion','Win an event',this.activities.some(a=>a.result==='won')],['📚','Scholar','Submit a weekly test',this.tests.length>=1],['⭐','Weekly Legend','Complete all 5 weekly tasks',this.weekly.completed.length===5],['💎','XP 1000','Earn 1000 total XP',p.totalXPEarned>=1000]];
    document.getElementById('badges-grid').innerHTML=badges.map(b=>`<div class="badge-card glass-panel ${b[3]?'unlocked':'locked'}"><div>${b[0]}</div><strong>${b[1]}</strong><span>${b[2]}</span><small>${b[3]?'UNLOCKED':'LOCKED'}</small></div>`).join('');
    const timeline=[...this.activities.map(a=>({at:a.at,icon:a.result==='won'?'🏆':'🎯',text:`${this.label(a.result)}: ${a.name}`,xp:a.xp})),...this.tests.map(t=>({at:t.at,icon:'📝',text:`${this.label(t.subject)} Sunday Test`,xp:t.score}))].sort((a,b)=>b.at-a.at).slice(0,20);
    document.getElementById('portfolio-timeline').innerHTML=timeline.length?timeline.map(x=>`<div class="timeline-item"><span>${x.icon}</span><div><strong>${this.escape(x.text)}</strong><small>${new Date(x.at).toLocaleString()} • +${x.xp} XP</small></div></div>`).join(''):'<div class="empty-state glass-panel">Your achievements will appear here.</div>';
  }
  renderAll(){this.renderWeekly();this.renderActivities();this.renderResources();this.renderPortfolio();this.renderLeaderboard();}
  label(x){return String(x).replace(/(^|_)(\w)/g,(_,a,b)=>` ${b.toUpperCase()}`).trim().replace(/^./,c=>c.toUpperCase());}
  escape(str){const d=document.createElement('div');d.textContent=str;return d.innerHTML;}
}

/* ============================================================================
   11. APPLICATION BOOTSTRAPPER & SYSTEM WIRING
   ============================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Player System
  const playerManager = new PlayerManager();

  // 2. Initialize Dynamic Level-Up Theme Engine
  const themeManager = new ThemeManager(playerManager);
  playerManager.themeManager = themeManager;

  // 3. Initialize Avatar & The Vault Inventory System (with Weapons)
  const vaultManager = new AvatarAndVaultManager(playerManager);
  playerManager.vaultManager = vaultManager;

  // 4. Initialize 7-Day Consistency & Streak Tracker
  const streakManager = new StreakManager(playerManager);

  // 5. Initialize The Arena Pomodoro Timer
  const timerManager = new TimerManager(playerManager);

  // 6. Initialize The Quest Board
  const questManager = new QuestManager(playerManager);

  // 7. Initialize Weekly Tasks, Activities, Study Hub, Portfolio & Leaderboards
  const academyManager = new QuestLogAcademy(playerManager);

  // 8. Initialize Mock Login Gateway
  const authManager = new AuthManager((loggedInUser) => {
    console.log(`🎮 Operator authenticated: ${loggedInUser}`);
    academyManager.renderAll();
  });

  // 8. Sound FX Toggle Button in Header
  const soundBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  const settings = StorageManager.loadSettings();

  soundFX.enabled = settings.sound !== false;
  if (soundIcon) {
    soundIcon.textContent = soundFX.enabled ? '🔊' : '🔇';
  }

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isEnabled = soundFX.toggle();
      if (soundIcon) soundIcon.textContent = isEnabled ? '🔊' : '🔇';
      StorageManager.saveSettings({ sound: isEnabled });
      if (isEnabled) soundFX.playClick();
    });
  }

  // 9. Reset Progress Button
  const resetBtn = document.getElementById('reset-progress-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      soundFX.playClick();
      const confirmed = window.confirm(
        '⚔️ Reset all operator credentials, weapons loadout, XP, level, and quest progression back to initial state?'
      );
      if (confirmed) {
        StorageManager.resetAll();
        window.location.reload();
      }
    });
  }

  console.log('⚔️ QuestLog - OSS Edition with Weapons Vault, Dynamic Themes & Free Fire VFX initialized.');
});
