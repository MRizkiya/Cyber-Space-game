import { Storage } from './Storage.js';

export const WEAPON_DEFINITIONS = {
  vulcan: {
    id: 'vulcan',
    name: 'Vulcan Gatling',
    tag: 'KINETIC RAPID',
    subtitle: 'High Cadence Shredder',
    color: '#38bdf8',
    stats: { damage: 2, fireRate: 5, range: 4, aoe: 1 },
    description: 'Tembakan kinetik beruntun berkecepatan tinggi. Menyapu musuh kerumunan dengan cepat.',
    baseDamage: 1.0,
    fireRate: 0.12,
    speed: 760,
    spread: 0.06,
    bulletScale: 0.9,
    bulletColor: '#38bdf8'
  },
  shotgun: {
    id: 'shotgun',
    name: 'Plasma Flak',
    tag: 'SCATTER PLASMA',
    subtitle: 'Close-Range Burst',
    color: '#f43f5e',
    stats: { damage: 5, fireRate: 2, range: 2, aoe: 3 },
    description: 'Menembakkan 6 proyektil plasma menyebar sekaligus. Damage kolosal pada pertempuran jarak dekat.',
    baseDamage: 0.85,
    pelletCount: 6,
    fireRate: 0.48,
    speed: 680,
    spread: 0.32,
    bulletScale: 1.0,
    bulletColor: '#fb7185'
  },
  railgun: {
    id: 'railgun',
    name: 'Heavy Railgun',
    tag: 'HYPER BEAM',
    subtitle: 'Piercing Hyper-Beam',
    color: '#10b981',
    stats: { damage: 5, fireRate: 1, range: 5, aoe: 2 },
    description: 'Berkas laser tajam hiper-cepat yang menembus seluruh musuh dalam satu garis lurus.',
    baseDamage: 3.5,
    fireRate: 0.65,
    speed: 980,
    spread: 0.0,
    pierce: 999,
    bulletScale: 1.5,
    bulletColor: '#10b981'
  },
  rocket: {
    id: 'rocket',
    name: 'Cluster Missile',
    tag: 'EXPLOSIVE SWARM',
    subtitle: 'Explosive Swarm',
    color: '#f59e0b',
    stats: { damage: 4, fireRate: 3, range: 4, aoe: 5 },
    description: 'Sepasang rudal dengan motor roket yang menghasilkan ledakan area (AoE) saat menghantam target.',
    baseDamage: 2.4,
    fireRate: 0.38,
    speed: 560,
    spread: 0.12,
    isRocket: true,
    explosionRadius: 50,
    bulletScale: 1.25,
    bulletColor: '#f59e0b'
  }
};

export const BRANCH_DEFINITIONS = {
  commander: {
    id: 'commander',
    name: 'Fleet Commander',
    subtitle: 'Drones & Pertahanan',
    color: '#38bdf8',
    description: 'Membangun armada drone penyerang, perisai deflektor peluru, dan overcharge taktis.',
    nodes: [
      { id: 1, name: 'Assault Escort', cost: 1, desc: 'Memanggil 1 Drone Serang otomatis yang mengawal dan menembaki musuh terdekat.' },
      { id: 2, name: 'Aegis Deflector', cost: 2, desc: 'Drone Perisai mengorbit player dan memusnahkan peluru musuh saat bersentuhan.' },
      { id: 3, name: 'Overcharge Protocol', cost: 3, desc: 'Skill Aktif [Q]: Seluruh drone masuk mode Overcharge (3x tembakan laser selama 6s).' },
      { id: 4, name: 'Wingman Replicator', cost: 4, desc: 'Menambah drone serang kedua (total armada 3 drone aktif mengawal player).' },
      { id: 5, name: 'Apex Carrier Matrix', cost: 6, desc: 'Drone mewarisi jenis senjata aktif player (Shotgun / Railgun / Rudal).' }
    ]
  },
  technomancer: {
    id: 'technomancer',
    name: 'Technomancer',
    subtitle: 'Petir & Status Beku',
    color: '#c084fc',
    description: 'Mengendalikan sambaran petir berantai, gelombang beku stasis, dan ledakan serpihan es.',
    nodes: [
      { id: 1, name: 'Chain Lightning', cost: 1, desc: 'Tembakan berpeluang 35% memicu sambaran petir berantai ke 2 musuh di sekitar target.' },
      { id: 2, name: 'Cryo Stasis', cost: 2, desc: 'Tembakan memperlambat laju musuh dan bos sebesar 45% (Chilled Status).' },
      { id: 3, name: 'Frost Nova', cost: 3, desc: 'Skill Aktif [Q]: Gelombang kejut es 360° yang membekukan seluruh musuh di layar selama 2.5s.' },
      { id: 4, name: 'Ice Shatter', cost: 4, desc: 'Musuh berstatus beku yang tewas akan pecah menjadi 4 serpihan es tajam penembus.' },
      { id: 5, name: 'Singularity Collapse', cost: 6, desc: 'Membunuh musuh elit memicu mini Black Hole yang menyedot dan meremukkan gerombolan.' }
    ]
  },
  berserker: {
    id: 'berserker',
    name: 'Berserker',
    subtitle: 'Blink, Crits & Overdrive',
    color: '#eab308',
    description: 'Kecepatan ekstrem, teleportasi kuantum berani mati, dan daya hancur jarak dekat.',
    nodes: [
      { id: 1, name: 'Kinetic Thrusters', cost: 1, desc: 'Kecepatan terbang pesawat +22% dan laju kecepatan proyektil peluru +25%.' },
      { id: 2, name: 'Close-Combat Surge', cost: 2, desc: 'Bonus damage bertambah hingga +45% semakin dekat pesawat dengan musuh saat menembak.' },
      { id: 3, name: 'Quantum Blink', cost: 3, desc: 'Skill Aktif [Q]: Teleportasi instan ke kursor mouse dengan kekebalan (i-frames) sesaat.' },
      { id: 4, name: 'Critical Overload', cost: 4, desc: 'Peluang Critical bertambah 25% dan damage Critical menghasilkan 2.2x lipat.' },
      { id: 5, name: 'Hyper Overdrive', cost: 6, desc: 'Saat Combo x5 ke atas, pesawat masuk Overdrive: Fire Rate +35% & peluru berdaya tinggi.' }
    ]
  }
};

export const SYNERGY_DEFINITIONS = [
  {
    id: 'tesla_drones',
    name: 'Tesla Drones',
    branchA: 'commander',
    nodeA: 1,
    branchB: 'technomancer',
    nodeB: 1,
    color: '#38bdf8',
    desc: 'Tembakan drone otomatis berpeluang memicu sambaran petir ke musuh terdekat.'
  },
  {
    id: 'glacial_warp',
    name: 'Glacial Warp',
    branchA: 'technomancer',
    nodeA: 3,
    branchB: 'berserker',
    nodeB: 3,
    color: '#c084fc',
    desc: 'Quantum Blink (Q) melepaskan ledakan Frost Nova di titik awal dan titik kedatangan.'
  },
  {
    id: 'vanguard_fleet',
    name: 'Vanguard Overdrive',
    branchA: 'commander',
    nodeA: 3,
    branchB: 'berserker',
    nodeB: 5,
    color: '#eab308',
    desc: 'Saat masuk Hyper Overdrive, seluruh armada drone menembak 2x lebih cepat.'
  }
];

class UpgradeManagerClass {
  constructor() {
    this.init();
  }

  init() {
    if (Storage.get('tech_points') === null) {
      Storage.set('tech_points', 0);
    }

    if (!Storage.get('equipped_weapon')) {
      Storage.set('equipped_weapon', 'vulcan');
    }

    let unlocked = Storage.get('unlocked_branch_nodes', null);
    if (!unlocked) {
      unlocked = {
        commander: [],
        technomancer: [],
        berserker: []
      };
      Storage.set('unlocked_branch_nodes', unlocked);
    }
  }

  getTechPoints() {
    return Storage.get('tech_points', 0);
  }

  addTechPoints(amount) {
    const current = this.getTechPoints();
    const updated = Math.max(0, current + amount);
    Storage.set('tech_points', updated);
    return updated;
  }

  getEquippedWeaponId() {
    return Storage.get('equipped_weapon', 'vulcan');
  }

  getEquippedWeapon() {
    const id = this.getEquippedWeaponId();
    return WEAPON_DEFINITIONS[id] || WEAPON_DEFINITIONS.vulcan;
  }

  setEquippedWeapon(weaponId) {
    if (WEAPON_DEFINITIONS[weaponId]) {
      Storage.set('equipped_weapon', weaponId);
      return true;
    }
    return false;
  }

  getUnlockedNodes(branchId) {
    const data = Storage.get('unlocked_branch_nodes', { commander: [], technomancer: [], berserker: [] });
    return data[branchId] || [];
  }

  isNodeUnlocked(branchId, nodeId) {
    const unlocked = this.getUnlockedNodes(branchId);
    return unlocked.includes(nodeId);
  }

  canUnlockNode(branchId, nodeId) {
    if (this.isNodeUnlocked(branchId, nodeId)) return false;

    if (nodeId > 1 && !this.isNodeUnlocked(branchId, nodeId - 1)) {
      return false;
    }

    const branch = BRANCH_DEFINITIONS[branchId];
    if (!branch) return false;
    const nodeDef = branch.nodes.find((n) => n.id === nodeId);
    if (!nodeDef) return false;

    return this.getTechPoints() >= nodeDef.cost;
  }

  unlockNode(branchId, nodeId) {
    if (!this.canUnlockNode(branchId, nodeId)) return false;

    const branch = BRANCH_DEFINITIONS[branchId];
    const nodeDef = branch.nodes.find((n) => n.id === nodeId);
    if (!nodeDef) return false;

    this.addTechPoints(-nodeDef.cost);

    const data = Storage.get('unlocked_branch_nodes', { commander: [], technomancer: [], berserker: [] });
    if (!data[branchId]) {
      data[branchId] = [];
    }
    data[branchId].push(nodeId);
    Storage.set('unlocked_branch_nodes', data);
    return true;
  }

  resetAllUpgrades() {
    const data = Storage.get('unlocked_branch_nodes', { commander: [], technomancer: [], berserker: [] });
    let refund = 0;

    Object.keys(BRANCH_DEFINITIONS).forEach((bId) => {
      const branch = BRANCH_DEFINITIONS[bId];
      const unlocked = data[bId] || [];
      unlocked.forEach((nid) => {
        const nDef = branch.nodes.find((n) => n.id === nid);
        if (nDef) refund += nDef.cost;
      });
      data[bId] = [];
    });

    this.addTechPoints(refund);
    Storage.set('unlocked_branch_nodes', data);
    return refund;
  }

  getActiveSynergies() {
    return SYNERGY_DEFINITIONS.filter((syn) => {
      return (
        this.isNodeUnlocked(syn.branchA, syn.nodeA) &&
        this.isNodeUnlocked(syn.branchB, syn.nodeB)
      );
    });
  }

  getCombatPerks() {
    const weapon = this.getEquippedWeapon();
    const commanderNodes = this.getUnlockedNodes('commander');
    const technomancerNodes = this.getUnlockedNodes('technomancer');
    const berserkerNodes = this.getUnlockedNodes('berserker');

    return {
      weapon: weapon,
      hasAssaultDrone: commanderNodes.includes(1),
      hasAegisDrone: commanderNodes.includes(2),
      hasDroneOvercharge: commanderNodes.includes(3),
      hasWingmanReplicator: commanderNodes.includes(4),
      hasApexCarrier: commanderNodes.includes(5),

      hasChainLightning: technomancerNodes.includes(1),
      hasCryoStasis: technomancerNodes.includes(2),
      hasFrostNova: technomancerNodes.includes(3),
      hasIceShatter: technomancerNodes.includes(4),
      hasSingularityCollapse: technomancerNodes.includes(5),

      speedMultiplier: berserkerNodes.includes(1) ? 1.22 : 1.0,
      bulletSpeedMultiplier: berserkerNodes.includes(1) ? 1.25 : 1.0,
      hasCloseCombatSurge: berserkerNodes.includes(2),
      hasQuantumBlink: berserkerNodes.includes(3),
      critChance: berserkerNodes.includes(4) ? 0.30 : 0.05,
      critMultiplier: berserkerNodes.includes(4) ? 2.2 : 1.5,
      hasHyperOverdrive: berserkerNodes.includes(5),

      synergyTeslaDrones: commanderNodes.includes(1) && technomancerNodes.includes(1),
      synergyGlacialWarp: technomancerNodes.includes(3) && berserkerNodes.includes(3),
      synergyVanguardFleet: commanderNodes.includes(3) && berserkerNodes.includes(5)
    };
  }
}

export const UpgradeManager = new UpgradeManagerClass();
