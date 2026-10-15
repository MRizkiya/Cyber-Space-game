import {
  UpgradeManager,
  WEAPON_DEFINITIONS,
  BRANCH_DEFINITIONS,
  SYNERGY_DEFINITIONS
} from '../utils/UpgradeManager.js';

/**
 * Cyber Hangar & Weapon Matrix scene.
 * Polished, clean, professional sci-fi UI with:
 * - Two distinct tabs: [ Arsenal Senjata ] & [ Pohon Skill ]
 * - Spacious layout, no clutter, clear visual hierarchy.
 * - Muted sci-fi palette with intentional accents.
 */
export class UpgradeScene {
  constructor() {
    this.activeTab = 'weapons'; // 'weapons' | 'skills'
    this.selectedBranch = 'commander';
    this.selectedNodeId = 1;
    this.hoveredBranch = null;
    this.hoveredNodeId = null;
    this.hoveredWeaponId = null;
    this.pulse = 0;
    this.message = '';
    this.messageTimer = 0;

    // Subtle starfield for atmospheric background
    this.stars = [];
    for (let i = 0; i < 45; i++) {
      this.stars.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.2
      });
    }
  }

  enter() {
    this.pulse = 0;
    this.message = '';
    this.messageTimer = 0;
  }

  showMessage(msg) {
    this.message = msg;
    this.messageTimer = 2.2;
  }

  update(dt) {
    this.pulse += dt * 3.0;
    if (this.messageTimer > 0) {
      this.messageTimer -= dt;
      if (this.messageTimer <= 0) this.message = '';
    }

    const input = this.engine.input;
    const mx = input.mouse.x;
    const my = input.mouse.y;
    const clicked = input.justClicked() || input.justPressed('Enter');

    // Quick keyboard navigation
    if (input.justPressed('Escape')) {
      this.engine.sound.playClick();
      this.sceneManager.set('menu');
      return;
    }
    if (input.justPressed('Tab')) {
      this.activeTab = (this.activeTab === 'weapons') ? 'skills' : 'weapons';
      this.engine.sound.playClick();
    }
    if (input.justPressed('Digit1')) {
      this.activeTab = 'weapons';
      this.engine.sound.playClick();
    }
    if (input.justPressed('Digit2')) {
      this.activeTab = 'skills';
      this.engine.sound.playClick();
    }

    // 1. Top Bar Actions
    // Back to Menu button (x: 24, y: 14, w: 110, h: 42)
    if (clicked && mx >= 20 && mx <= 135 && my >= 12 && my <= 56) {
      this.engine.sound.playClick();
      this.sceneManager.set('menu');
      return;
    }

    // Tab Pill Switcher (x: 245 to 560, y: 12, h: 44)
    const tab1Rect = { x: 245, y: 12, w: 152, h: 44 };
    const tab2Rect = { x: 402, y: 12, w: 152, h: 44 };

    if (clicked && mx >= tab1Rect.x && mx <= tab1Rect.x + tab1Rect.w && my >= tab1Rect.y && my <= tab1Rect.y + tab1Rect.h) {
      if (this.activeTab !== 'weapons') {
        this.activeTab = 'weapons';
        this.engine.sound.playClick();
      }
    }
    if (clicked && mx >= tab2Rect.x && mx <= tab2Rect.x + tab2Rect.w && my >= tab2Rect.y && my <= tab2Rect.y + tab2Rect.h) {
      if (this.activeTab !== 'skills') {
        this.activeTab = 'skills';
        this.engine.sound.playClick();
      }
    }

    // Reset Build Button (x: 685, y: 16, w: 90, h: 36)
    if (clicked && mx >= 685 && mx <= 775 && my >= 16 && my <= 52) {
      const refund = UpgradeManager.resetAllUpgrades();
      this.engine.sound.playClick();
      this.showMessage(refund > 0 ? `Reset selesai! (+${refund} Cores dikembalikan)` : 'Semua node sudah kosong');
      return;
    }

    // 2. Active Tab Updates
    if (this.activeTab === 'weapons') {
      this.updateWeaponsTab(mx, my, clicked);
    } else {
      this.updateSkillsTab(mx, my, clicked);
    }
  }

  updateWeaponsTab(mx, my, clicked) {
    this.hoveredWeaponId = null;
    const weapons = Object.values(WEAPON_DEFINITIONS);
    const cardW = 355;
    const cardH = 225;
    const colX = [30, 415];
    const rowY = [78, 320];

    weapons.forEach((wDef, idx) => {
      const cx = colX[idx % 2];
      const cy = rowY[Math.floor(idx / 2)];

      if (mx >= cx && mx <= cx + cardW && my >= cy && my <= cy + cardH) {
        this.hoveredWeaponId = wDef.id;
        if (clicked) {
          UpgradeManager.setEquippedWeapon(wDef.id);
          this.engine.sound.playPickup();
          this.showMessage(`Senjata aktif: ${wDef.name}`);
        }
      }
    });
  }

  updateSkillsTab(mx, my, clicked) {
    this.hoveredBranch = null;
    this.hoveredNodeId = null;

    const branches = Object.values(BRANCH_DEFINITIONS);
    const colW = 236;
    const colGap = 16;
    const startColX = 30;
    const startNodeY = 145;
    const nodeStepY = 58;

    branches.forEach((bDef, colIdx) => {
      const bx = startColX + colIdx * (colW + colGap);
      bDef.nodes.forEach((nDef, rowIdx) => {
        const nx = bx + 36;
        const ny = startNodeY + rowIdx * nodeStepY;
        const dist = Math.hypot(mx - nx, my - ny);

        // Hover or click on node
        if (dist <= 24 || (mx >= bx && mx <= bx + colW && my >= ny - 20 && my <= ny + 20)) {
          this.hoveredBranch = bDef.id;
          this.hoveredNodeId = nDef.id;

          if (clicked) {
            this.selectedBranch = bDef.id;
            this.selectedNodeId = nDef.id;

            if (UpgradeManager.canUnlockNode(bDef.id, nDef.id)) {
              UpgradeManager.unlockNode(bDef.id, nDef.id);
              this.engine.sound.playPickup();
              this.showMessage(`Upgrade terbuka: ${nDef.name}`);
            } else {
              this.engine.sound.playClick();
            }
          }
        }
      });
    });

    // Detail Panel Action Button (bottom)
    const actionBtn = { x: 335, y: 508, w: 145, h: 44 };
    if (clicked && mx >= actionBtn.x && mx <= actionBtn.x + actionBtn.w && my >= actionBtn.y && my <= actionBtn.y + actionBtn.h) {
      if (UpgradeManager.canUnlockNode(this.selectedBranch, this.selectedNodeId)) {
        UpgradeManager.unlockNode(this.selectedBranch, this.selectedNodeId);
        this.engine.sound.playPickup();
        this.showMessage('Berhasil di-upgrade!');
      } else if (UpgradeManager.isNodeUnlocked(this.selectedBranch, this.selectedNodeId)) {
        this.showMessage('Node ini sudah aktif.');
      } else {
        this.showMessage('Cores tidak cukup atau buka node sebelumnya.');
      }
    }
  }

  render(ctx) {
    const w = this.engine.width;
    const h = this.engine.height;

    // Atmospheric deep void background
    ctx.fillStyle = '#070b12';
    ctx.fillRect(0, 0, w, h);

    // Soft starry backdrop
    ctx.fillStyle = '#94a3b8';
    this.stars.forEach((s) => {
      ctx.globalAlpha = s.alpha;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });
    ctx.globalAlpha = 1.0;

    // 1. Navigation Header
    this.renderHeader(ctx, w);

    // 2. Tab Content
    if (this.activeTab === 'weapons') {
      this.renderWeaponsTab(ctx, w);
    } else {
      this.renderSkillsTab(ctx, w);
    }

    // 3. Floating Notification
    if (this.message) {
      this.renderNotification(ctx, w);
    }
  }

  renderHeader(ctx, w) {
    ctx.save();

    // Back button
    this.drawRoundedRect(ctx, 24, 16, 105, 36, 6, 'rgba(15, 23, 42, 0.75)', 'rgba(51, 65, 85, 0.8)', 1);
    ctx.font = '600 12px "Orbitron", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText('← MENU', 76, 38);

    // Segmented Pill Tab Switcher
    const tab1Active = (this.activeTab === 'weapons');
    const tab2Active = (this.activeTab === 'skills');

    this.drawRoundedRect(ctx, 245, 14, 310, 40, 8, 'rgba(15, 23, 42, 0.85)', 'rgba(51, 65, 85, 0.6)', 1);

    // Tab 1: Arsenal
    const tab1Bg = tab1Active ? 'rgba(56, 189, 248, 0.2)' : 'transparent';
    const tab1Border = tab1Active ? '#38bdf8' : 'transparent';
    this.drawRoundedRect(ctx, 250, 18, 145, 32, 6, tab1Bg, tab1Border, tab1Active ? 1.5 : 0);
    ctx.font = tab1Active ? '700 12px "Orbitron", sans-serif' : '600 12px "Outfit", sans-serif';
    ctx.fillStyle = tab1Active ? '#38bdf8' : '#64748b';
    ctx.fillText('ARSENAL SENJATA', 322, 38);

    // Tab 2: Skills
    const tab2Bg = tab2Active ? 'rgba(56, 189, 248, 0.2)' : 'transparent';
    const tab2Border = tab2Active ? '#38bdf8' : 'transparent';
    this.drawRoundedRect(ctx, 405, 18, 145, 32, 6, tab2Bg, tab2Border, tab2Active ? 1.5 : 0);
    ctx.font = tab2Active ? '700 12px "Orbitron", sans-serif' : '600 12px "Outfit", sans-serif';
    ctx.fillStyle = tab2Active ? '#38bdf8' : '#64748b';
    ctx.fillText('POHON SKILL', 477, 38);

    // Tech Cores Pill Badge
    const points = UpgradeManager.getTechPoints();
    this.drawRoundedRect(ctx, 570, 16, 105, 36, 6, 'rgba(15, 23, 42, 0.85)', 'rgba(234, 179, 8, 0.5)', 1);
    ctx.font = '700 12px "Orbitron", sans-serif';
    ctx.fillStyle = '#eab308';
    ctx.fillText(`💎 ${points} CORES`, 622, 38);

    // Reset Button
    this.drawRoundedRect(ctx, 685, 16, 90, 36, 6, 'rgba(244, 63, 94, 0.08)', 'rgba(244, 63, 94, 0.4)', 1);
    ctx.font = '600 11px "Outfit", sans-serif';
    ctx.fillStyle = '#f43f5e';
    ctx.fillText('↺ Reset', 730, 38);

    ctx.restore();
  }

  renderWeaponsTab(ctx, w) {
    ctx.save();
    const equippedId = UpgradeManager.getEquippedWeaponId();
    const weapons = Object.values(WEAPON_DEFINITIONS);
    const cardW = 355;
    const cardH = 225;
    const colX = [30, 415];
    const rowY = [78, 320];

    weapons.forEach((wDef, idx) => {
      const cx = colX[idx % 2];
      const cy = rowY[Math.floor(idx / 2)];
      const isEquipped = (wDef.id === equippedId);
      const isHovered = (wDef.id === this.hoveredWeaponId);

      // Card Container
      const bgCol = isEquipped ? 'rgba(15, 23, 42, 0.95)' : (isHovered ? 'rgba(15, 23, 42, 0.85)' : 'rgba(15, 23, 42, 0.6)');
      const borderCol = isEquipped ? wDef.color : (isHovered ? 'rgba(148, 163, 184, 0.6)' : 'rgba(51, 65, 85, 0.6)');
      this.drawRoundedRect(ctx, cx, cy, cardW, cardH, 8, bgCol, borderCol, isEquipped ? 2 : 1);

      // Header: Name & Role Badge
      ctx.textAlign = 'left';
      ctx.font = '700 15px "Orbitron", sans-serif';
      ctx.fillStyle = isEquipped ? wDef.color : '#f1f5f9';
      ctx.fillText(wDef.name, cx + 18, cy + 32);

      // Category Tag Badge
      this.drawRoundedRect(ctx, cx + cardW - 125, cy + 18, 108, 20, 4, 'rgba(30, 41, 59, 0.7)', borderCol, 1);
      ctx.font = '700 9px "Orbitron", sans-serif';
      ctx.fillStyle = isEquipped ? wDef.color : '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText(wDef.tag, cx + cardW - 71, cy + 32);

      // Subtitle
      ctx.textAlign = 'left';
      ctx.font = '500 11px "Outfit", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(wDef.subtitle, cx + 18, cy + 52);

      // Description
      ctx.font = '400 11px "Outfit", sans-serif';
      ctx.fillStyle = '#cbd5e1';
      this.renderWrappedText(ctx, wDef.description, cx + 18, cy + 76, cardW - 36, 17);

      // Stat Bars
      const statsY = cy + 128;
      this.renderStatBar(ctx, 'DAMAGE', wDef.stats.damage, cx + 18, statsY, wDef.color);
      this.renderStatBar(ctx, 'CADENCE', wDef.stats.fireRate, cx + 18, statsY + 22, wDef.color);
      this.renderStatBar(ctx, 'REACH', wDef.stats.range, cx + 18, statsY + 44, wDef.color);

      // Action Button (Bottom Right)
      const btnX = cx + cardW - 120;
      const btnY = cy + cardH - 42;
      if (isEquipped) {
        this.drawRoundedRect(ctx, btnX, btnY, 102, 28, 4, 'rgba(16, 185, 129, 0.15)', '#10b981', 1.2);
        ctx.font = '700 10px "Orbitron", sans-serif';
        ctx.fillStyle = '#10b981';
        ctx.textAlign = 'center';
        ctx.fillText('● AKTIF', btnX + 51, btnY + 18);
      } else {
        this.drawRoundedRect(ctx, btnX, btnY, 102, 28, 4, isHovered ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.7)', borderCol, 1);
        ctx.font = '600 10px "Outfit", sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.textAlign = 'center';
        ctx.fillText('Pasang Senjata', btnX + 51, btnY + 18);
      }
    });

    ctx.restore();
  }

  renderStatBar(ctx, label, value, x, y, color) {
    ctx.textAlign = 'left';
    ctx.font = '600 9px "Orbitron", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(label, x, y + 8);

    const barStartX = x + 75;
    const segW = 14;
    const segGap = 3;

    for (let i = 1; i <= 5; i++) {
      const isFilled = (i <= value);
      ctx.fillStyle = isFilled ? color : 'rgba(51, 65, 85, 0.5)';
      ctx.fillRect(barStartX + (i - 1) * (segW + segGap), y, segW, 8);
    }
  }

  renderSkillsTab(ctx, w) {
    ctx.save();
    const branches = Object.values(BRANCH_DEFINITIONS);
    const colW = 236;
    const colGap = 16;
    const startColX = 30;
    const startNodeY = 125;
    const nodeStepY = 62;

    branches.forEach((bDef, colIdx) => {
      const bx = startColX + colIdx * (colW + colGap);

      // Branch Container
      this.drawRoundedRect(ctx, bx, startNodeY - 44, colW, 375, 8, 'rgba(15, 23, 42, 0.7)', 'rgba(51, 65, 85, 0.5)', 1);

      // Branch Header
      ctx.textAlign = 'left';
      ctx.font = '700 13px "Orbitron", sans-serif';
      ctx.fillStyle = bDef.color;
      ctx.fillText(bDef.name, bx + 16, startNodeY - 20);

      ctx.font = '500 10px "Outfit", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(bDef.subtitle, bx + 16, startNodeY - 5);

      // Circuit Trace Line
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bx + 32, startNodeY + 22);
      ctx.lineTo(bx + 32, startNodeY + 22 + 4 * nodeStepY);
      ctx.stroke();

      // Render 5 sequential nodes
      bDef.nodes.forEach((nDef, rowIdx) => {
        const nx = bx + 32;
        const ny = startNodeY + 22 + rowIdx * nodeStepY;
        const isUnlocked = UpgradeManager.isNodeUnlocked(bDef.id, nDef.id);
        const canUnlock = UpgradeManager.canUnlockNode(bDef.id, nDef.id);
        const isHovered = (this.hoveredBranch === bDef.id && this.hoveredNodeId === nDef.id);
        const isSelected = (this.selectedBranch === bDef.id && this.selectedNodeId === nDef.id);

        // Hover row background
        if (isHovered || isSelected) {
          this.drawRoundedRect(ctx, bx + 8, ny - 18, colW - 16, 36, 4, 'rgba(51, 65, 85, 0.3)', 'transparent', 0);
        }

        // Node Circle
        ctx.beginPath();
        ctx.arc(nx, ny, 14, 0, Math.PI * 2);

        if (isUnlocked) {
          ctx.fillStyle = bDef.color;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.textAlign = 'center';
          ctx.font = '800 10px "Orbitron", sans-serif';
          ctx.fillStyle = '#070b14';
          ctx.fillText('✓', nx, ny + 3.5);
        } else if (canUnlock) {
          ctx.fillStyle = '#0f172a';
          ctx.fill();
          ctx.strokeStyle = bDef.color;
          ctx.lineWidth = 1.8;
          ctx.stroke();

          ctx.textAlign = 'center';
          ctx.font = '700 10px "Orbitron", sans-serif';
          ctx.fillStyle = bDef.color;
          ctx.fillText(nDef.id, nx, ny + 3.5);
        } else {
          ctx.fillStyle = '#090d16';
          ctx.fill();
          ctx.strokeStyle = 'rgba(51, 65, 85, 0.5)';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          ctx.textAlign = 'center';
          ctx.font = '600 10px "Orbitron", sans-serif';
          ctx.fillStyle = '#475569';
          ctx.fillText(nDef.id, nx, ny + 3.5);
        }

        // Node Label
        ctx.textAlign = 'left';
        ctx.font = isUnlocked ? '600 11px "Orbitron", sans-serif' : '500 11px "Outfit", sans-serif';
        ctx.fillStyle = isUnlocked ? '#f8fafc' : (canUnlock ? '#e2e8f0' : '#64748b');
        ctx.fillText(nDef.name, nx + 22, ny - 1);

        // Cost / State Pill
        ctx.font = '600 9px "Outfit", sans-serif';
        if (isUnlocked) {
          ctx.fillStyle = bDef.color;
          ctx.fillText('Aktif', nx + 22, ny + 12);
        } else {
          ctx.fillStyle = canUnlock ? '#eab308' : '#475569';
          ctx.fillText(`${nDef.cost} Cores`, nx + 22, ny + 12);
        }

        // Skill [Q] Badge on node 3
        if (nDef.id === 3) {
          this.drawRoundedRect(ctx, bx + colW - 38, ny - 8, 26, 16, 3, 'rgba(56, 189, 248, 0.2)', '#38bdf8', 1);
          ctx.font = '700 8px "Orbitron", sans-serif';
          ctx.fillStyle = '#38bdf8';
          ctx.textAlign = 'center';
          ctx.fillText('[Q]', bx + colW - 25, ny + 3.5);
        }
      });
    });

    // Bottom Panels (y: 470, h: 108)
    this.renderBottomPanels(ctx, w);

    ctx.restore();
  }

  renderBottomPanels(ctx, w) {
    const bottomY = 472;
    const cardH = 106;

    // LEFT: Selected Node Details & Action (x: 30, w: 468)
    const activeBranch = BRANCH_DEFINITIONS[this.selectedBranch] || BRANCH_DEFINITIONS.commander;
    const activeNode = activeBranch.nodes.find((n) => n.id === this.selectedNodeId) || activeBranch.nodes[0];
    const isUnlocked = UpgradeManager.isNodeUnlocked(this.selectedBranch, this.selectedNodeId);
    const canUnlock = UpgradeManager.canUnlockNode(this.selectedBranch, this.selectedNodeId);

    this.drawRoundedRect(ctx, 30, bottomY, 468, cardH, 8, 'rgba(15, 23, 42, 0.88)', 'rgba(51, 65, 85, 0.7)', 1);

    // Detail Header
    ctx.textAlign = 'left';
    ctx.font = '700 13px "Orbitron", sans-serif';
    ctx.fillStyle = activeBranch.color;
    ctx.fillText(`${activeBranch.name.toUpperCase()} • ${activeNode.name.toUpperCase()}`, 46, bottomY + 24);

    // Node Description
    ctx.font = '400 11px "Outfit", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    this.renderWrappedText(ctx, activeNode.desc, 46, bottomY + 44, 280, 16);

    // Action Button
    const btnX = 335;
    const btnY = bottomY + 30;
    const btnW = 145;
    const btnH = 44;

    if (isUnlocked) {
      this.drawRoundedRect(ctx, btnX, btnY, btnW, btnH, 6, 'rgba(16, 185, 129, 0.12)', '#10b981', 1.2);
      ctx.font = '700 11px "Orbitron", sans-serif';
      ctx.fillStyle = '#10b981';
      ctx.textAlign = 'center';
      ctx.fillText('✓ AKTIF', btnX + btnW / 2, btnY + 27);
    } else {
      const bg = canUnlock ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.4)';
      const border = canUnlock ? '#38bdf8' : 'rgba(51, 65, 85, 0.5)';
      this.drawRoundedRect(ctx, btnX, btnY, btnW, btnH, 6, bg, border, 1.2);
      ctx.font = '700 10px "Orbitron", sans-serif';
      ctx.fillStyle = canUnlock ? '#f1f5f9' : '#64748b';
      ctx.textAlign = 'center';
      ctx.fillText(canUnlock ? `BUKA (${activeNode.cost} CORES)` : `TERKUNCI (${activeNode.cost})`, btnX + btnW / 2, btnY + 27);
    }

    // RIGHT: Cross-Branch Fusion Synergies (x: 512, w: 258)
    this.drawRoundedRect(ctx, 512, bottomY, 258, cardH, 8, 'rgba(15, 23, 42, 0.88)', 'rgba(51, 65, 85, 0.7)', 1);

    ctx.textAlign = 'left';
    ctx.font = '700 11px "Orbitron", sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('SINERGI SILANG (FUSION)', 526, bottomY + 24);

    const activeSynergies = UpgradeManager.getActiveSynergies();
    SYNERGY_DEFINITIONS.forEach((syn, sIdx) => {
      const isActive = activeSynergies.some((as) => as.id === syn.id);
      const sy = bottomY + 44 + sIdx * 19;

      ctx.font = isActive ? '600 11px "Orbitron", sans-serif' : '500 11px "Outfit", sans-serif';
      ctx.fillStyle = isActive ? syn.color : '#64748b';
      const mark = isActive ? '★ ' : '○ ';
      ctx.fillText(`${mark}${syn.name}`, 526, sy);
    });
  }

  drawRoundedRect(ctx, x, y, w, h, r, fillStyle, strokeStyle, lineWidth = 1) {
    ctx.save();
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, y, w, h, r);
    } else {
      ctx.rect(x, y, w, h);
    }
    if (fillStyle && fillStyle !== 'transparent') {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle && strokeStyle !== 'transparent' && lineWidth > 0) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
    ctx.restore();
  }

  renderWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let curY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, curY);
        line = words[n] + ' ';
        curY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, curY);
  }

  renderNotification(ctx, w) {
    ctx.save();
    const boxW = 480;
    const boxH = 32;
    const boxX = (w - boxW) / 2;
    const boxY = 556;

    this.drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 6, 'rgba(15, 23, 42, 0.95)', '#38bdf8', 1.2);
    ctx.textAlign = 'center';
    ctx.font = '600 11px "Orbitron", sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(this.message, w / 2, boxY + 20);
    ctx.restore();
  }
}
