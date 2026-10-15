# Cyber Defender - Modular 2D Web Game Framework

Framework game 2D modular berbasis **HTML5 Canvas**, **Vanilla JavaScript (ES Modules)**, dan didukung **Vite**. Menampilkan 10 Stage penuh aksi yang terbagi menjadi **World 1 (Neon Core)** dan **World 2 (Quantum Rift)** dengan ragam tipe musuh unik dan Boss interaktif.

---

## Struktur Direktori & Framework

```text
game_sederhana/
├── index.html                # Struktur HTML, SEO meta, dan game wrapper
├── package.json              # Dependensi Vite & scripts
├── public/                   # Asset statis publik
└── src/
    ├── main.js               # Entry point: Inisialisasi engine & scene
    ├── style.css             # Tema dark arcade modern & glassmorphism
    ├── engine/               # Core Engine game (independen & reusable)
    │   ├── Engine.js         # Game loop (delta time, pause, update, render)
    │   ├── Canvas.js         # Canvas helper (crisp rendering & shapes)
    │   ├── Input.js          # Unified controller (Keyboard, Mouse, Touch)
    │   ├── Audio.js          # Procedural Web Audio API sound synth
    │   ├── Camera.js         # 2D Camera dengan efek screen shake
    │   ├── ParticleSystem.js # Partikel visual (ledakan, thrust, sparks)
    │   ├── SceneManager.js   # Manajemen perpindahan scene (Menu, Play, Over, dll)
    │   └── Vector2.js        # Utilitas matematika 2D (posisi & kecepatan)
    ├── entities/             # Objek dalam game
    │   ├── Entity.js         # Base class entity
    │   ├── Player.js         # Karakter pemain (gerak, tembak, shield, perks)
    │   ├── Enemy.js          # Musuh (World 1: Drone/Fast/Tank | World 2: Stealth/Sniper/Splitter/Micro)
    │   ├── Boss.js           # Boss Stage 5 TITAN NEXUS (Mothership)
    │   ├── BossStage10.js    # Boss Stage 10 CHRONO MIRAGE (Hologram Decoys & Quantum Shuffle)
    │   ├── Bullet.js         # Proyektil peluru (homing, big laser, pierce, crit)
    │   ├── BlackHole.js      # Pusaran gravitasi aktif (skill singularitas)
    │   └── Item.js           # Item collectible (kristal skor & heal)
    ├── scenes/               # Layar / state permainan
    │   ├── MenuScene.js        # Layar utama (Mulai Misi, Upgrade, High Score)
    │   ├── StageSelectScene.js # Layar World 1 & 2 dengan tab & navigasi panah
    │   ├── UpgradeScene.js     # Sistem 5 Path & pohon keahlian 10 titik
    │   ├── GameScene.js        # Gameplay loop 10 Stage, combat & pause overlay
    │   ├── GameOverScene.js    # Layar akhir skor & restart
    │   └── VictoryScene.js     # Layar kemenangan World 1 dan Grand Victory World 2
    └── utils/
        ├── Collision.js      # Deteksi tabrakan (AABB & Circle)
        ├── Storage.js        # Penyimpanan lokal (High score, stage terbuka, cores)
        └── UpgradeManager.js # Manajemen kalkulasi skill tree dan perk tempur
```

---

## Rincian 10 Stage & Sistem 2 World

### World 1: Neon Core (Stage 1 - 5)
- **Stage 1**: Protocol Awakening (10 Drone Standar)
- **Stage 2**: Rapid Interception (14 Drone Cepat)
- **Stage 3**: Heavy Assault (18 Tank Drone Lapis Baja)
- **Stage 4**: Cyber Onslaught (22 Unit Gabungan)
- **Stage 5**: Titan Nexus Confrontation (12 Minion + **BOSS: TITAN NEXUS**)

### World 2: Quantum Rift (Stage 6 - 10)
- **Stage 6**: Quantum Horizon (16 Phantom Drone - Jubah Teleportasi)
- **Stage 7**: Perimeter Breach (20 Sniper Drone - Laser Jarak Jauh)
- **Stage 8**: Volatile Swarm (24 Splitter Drone - Membelah saat Hancur)
- **Stage 9**: Apex Convergence (28 Pasukan Elit Kombinasi)
- **Stage 10**: The Chrono Singularity (15 Pengawal + **BOSS: CHRONO MIRAGE**)
  - *Mekanik Boss Chrono Mirage*: Menciptakan 2 klon hologram ilusi (*Decoy Clones*), melakukan teleportasi acak (*Quantum Shuffle*), dan menembakkan pusaran peluru spiral ganda. Tembak inti asli yang berdenyut terang!

---

## Kontrol Permainan

- **Bergerak**: `W`, `A`, `S`, `D` atau tombol Panah (`↑`, `←`, `↓`, `→`)
- **Tembak**: Klik Kiri Mouse atau tombol `Space`
- **Skill Black Hole**: Tombol `Q` (bila memilih Path Black Hole)
- **Jeda / Pause**: Tombol `P` atau `Escape`
- **Navigasi World**: Tab `World 1` / `World 2` atau tombol panah samping `[◀]` dan `[▶]` (atau tombol `A` & `D`)
