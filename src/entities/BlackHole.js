import { Entity } from './Entity.js';

/**
 * Cinematic Black Hole Gravitational Singularity.
 * Features realistic gravitational lensing, Interstellar-style warped accretion disk,
 * Doppler beaming, photon sphere, and absolute event horizon void.
 */
export class BlackHole extends Entity {
  constructor(x, y, perks = {}, isMini = false) {
    super(x, y, 40, 40);
    this.isMini = isMini;

    if (isMini) {
      this.radius = 75;
      this.lifetime = 1.6;
      this.maxLifetime = 1.6;
      this.pullForce = 190;
      this.damage = 1;
      this.shouldExplode = true;
    } else {
      this.radius = perks.blackHoleRadius || 110;
      this.lifetime = perks.blackHoleDuration || 2.8;
      this.maxLifetime = this.lifetime;
      this.pullForce = perks.blackHolePullForce || 140;
      this.damage = perks.blackHoleDamage || 1;
      this.shouldExplode = perks.blackHoleExplode || false;
    }

    this.damageTimer = 0;
    this.diskAngle = 0;
    this.pulseTime = 0;

    // Relativistic accretion disk particles
    this.particles = [];
    const particleCount = isMini ? 14 : 28;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(this.createParticle(true));
    }
  }

  createParticle(randomRadius = false) {
    const horizonR = 21;
    const maxR = this.radius * 0.72;
    const r = randomRadius ? horizonR + Math.random() * (maxR - horizonR) : maxR;
    const angle = Math.random() * Math.PI * 2;
    return {
      r: r,
      angle: angle,
      speed: 3.2 + Math.random() * 2.2,
      size: 1.2 + Math.random() * 2.2,
      hue: Math.random() < 0.65 ? 'gold' : 'violet', // hot gold plasma or cosmic violet
      trail: []
    };
  }

  update(dt, enemies, engine, onKill, boss = null, onBossDamage = null) {
    this.lifetime -= dt;
    this.diskAngle += dt * 2.4;
    this.pulseTime += dt;
    this.damageTimer += dt;

    const canDealTick = this.damageTimer >= 0.45;
    if (canDealTick) {
      this.damageTimer = 0;
    }

    // Update accretion disk particles spiraling into singularity
    const horizonR = 19;
    for (const p of this.particles) {
      // Closer particles orbit much faster (Keplerian differential rotation)
      const distRatio = Math.max(0.1, p.r / (this.radius * 0.72));
      const orbitalSpeed = p.speed / Math.sqrt(distRatio);
      p.angle += orbitalSpeed * dt;

      // Inward spiral pull
      p.r -= (32 / Math.max(0.3, distRatio)) * dt;

      // Re-spawn when swallowed by event horizon
      if (p.r <= horizonR) {
        p.r = this.radius * (0.6 + Math.random() * 0.15);
        p.angle = Math.random() * Math.PI * 2;
      }
    }

    // Pull and crush standard enemies in gravitational radius
    for (const enemy of enemies) {
      if (!enemy.isAlive) continue;
      const dx = this.x - enemy.x;
      const dy = this.y - enemy.y;
      const dist = Math.hypot(dx, dy);

      if (dist < this.radius && dist > 4) {
        // Gravitational suction force increases drastically near center
        const normalizedDist = Math.max(0.08, dist / this.radius);
        const force = (1 / Math.sqrt(normalizedDist)) * (this.pullForce * 0.45);
        enemy.pos.x += (dx / dist) * force * dt;
        enemy.pos.y += (dy / dist) * force * dt;

        // Periodic singularity tidal damage
        if (canDealTick) {
          const killed = enemy.takeDamage(this.damage, engine);
          if (killed && typeof onKill === 'function') {
            onKill(enemy);
          }
        }
      }
    }

    // Boss heavy gravitational drag & damage
    if (boss && boss.isAlive) {
      const distToBoss = Math.hypot(this.x - boss.x, this.y - boss.y);
      if (distToBoss < this.radius) {
        // Boss possesses heavy mass, pulled gently
        const bForce = (1 - distToBoss / this.radius) * (this.pullForce * 0.22);
        const bdx = this.x - boss.x;
        const bdy = this.y - boss.y;
        boss.pos.x += (bdx / distToBoss) * bForce * dt;
        boss.pos.y += (bdy / distToBoss) * bForce * dt;

        if (canDealTick) {
          const killed = boss.takeDamage(this.damage, engine);
          if (typeof onBossDamage === 'function') {
            onBossDamage(killed);
          }
        }
      }
    }

    // Atmospheric vacuum dust particles emitted around perimeter
    if (Math.random() < 0.75) {
      const pAngle = Math.random() * Math.PI * 2;
      const pDist = this.radius * (0.65 + Math.random() * 0.35);
      const px = this.x + Math.cos(pAngle) * pDist;
      const py = this.y + Math.sin(pAngle) * pDist;
      engine.particles.emit(px, py, 1, {
        color: Math.random() < 0.6 ? '#fde047' : '#a855f7',
        speed: 130,
        size: 2.2,
        life: 0.3,
        baseAngle: Math.atan2(this.y - py, this.x - px)
      });
    }

    // Singularity expiration & optional collapse supernova explosion
    if (this.lifetime <= 0) {
      this.isAlive = false;
      if (this.shouldExplode) {
        engine.sound.playExplosion();
        engine.camera.shake(12, 0.4);
        engine.particles.emit(this.x, this.y, 45, {
          color: '#fbbf24',
          speed: 260,
          size: 5,
          life: 0.65
        });
        engine.particles.emit(this.x, this.y, 35, {
          color: '#c084fc',
          speed: 220,
          size: 4,
          life: 0.75
        });

        const burstRadius = this.radius * 1.15;
        const burstDamage = this.damage * 4;

        // AoE damage enemies
        for (const enemy of enemies) {
          if (!enemy.isAlive) continue;
          if (Math.hypot(this.x - enemy.x, this.y - enemy.y) < burstRadius) {
            const killed = enemy.takeDamage(burstDamage, engine);
            if (killed && typeof onKill === 'function') {
              onKill(enemy);
            }
          }
        }

        // AoE damage boss
        if (boss && boss.isAlive) {
          if (Math.hypot(this.x - boss.x, this.y - boss.y) < burstRadius) {
            const killed = boss.takeDamage(burstDamage, engine);
            if (typeof onBossDamage === 'function') {
              onBossDamage(killed);
            }
          }
        }
      }
    }
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    const progress = Math.max(0, Math.min(1, this.lifetime / this.maxLifetime));
    const scale = Math.min(1, (1 - progress) < 0.15 ? (1 - progress) / 0.15 : progress < 0.15 ? progress / 0.15 : 1);
    const horizonR = (this.isMini ? 12 : 20) * scale;
    const effectiveRadius = this.radius * scale;

    // 1. Spacetime Distortion Field (Gravitational Well vignette)
    const wellGrad = ctx.createRadialGradient(0, 0, horizonR, 0, 0, effectiveRadius);
    wellGrad.addColorStop(0, 'rgba(10, 4, 18, 0.95)');
    wellGrad.addColorStop(0.3, 'rgba(88, 28, 135, 0.35)');
    wellGrad.addColorStop(0.7, 'rgba(30, 27, 75, 0.15)');
    wellGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = wellGrad;
    ctx.beginPath();
    ctx.arc(0, 0, effectiveRadius, 0, Math.PI * 2);
    ctx.fill();

    // 2. Gravitational Lensing Pulse Wave (Expanding spacetime ripples)
    const waveProgress = (this.pulseTime * 0.8) % 1.0;
    const waveR = horizonR + (effectiveRadius - horizonR) * waveProgress;
    ctx.strokeStyle = `rgba(168, 85, 247, ${0.4 * (1 - waveProgress)})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, waveR, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Gravitational Lensing Halo (Rear disk warped OVER the top of the shadow)
    // The classic Gargantua / Interstellar signature arched Einstein ring
    const lensR = horizonR * 1.95;
    const haloGrad = ctx.createRadialGradient(0, -horizonR * 0.3, horizonR * 0.8, 0, -horizonR * 0.3, lensR);
    haloGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    haloGrad.addColorStop(0.25, 'rgba(253, 224, 71, 0.85)');
    haloGrad.addColorStop(0.55, 'rgba(249, 115, 22, 0.6)');
    haloGrad.addColorStop(0.85, 'rgba(168, 85, 247, 0.3)');
    haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.save();
    ctx.scale(1.0, 1.15);
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(0, 0, lensR, Math.PI * 0.85, Math.PI * 2.15);
    ctx.fill();
    ctx.restore();

    // 4. Infalling Accretion Disk Matter & Spiraling Plasma Particles
    for (const p of this.particles) {
      const pr = p.r * scale;
      const px = Math.cos(p.angle) * pr;
      // Tilt disk plane slightly for 3D orbital perspective
      const py = Math.sin(p.angle) * pr * 0.38;

      // Relativistic Doppler Beaming: Approaching side (left) is brighter and hotter
      const isApproaching = Math.sin(p.angle) < 0;
      const alpha = isApproaching ? 0.95 : 0.45;

      ctx.save();
      ctx.shadowBlur = isApproaching ? 10 : 4;
      if (p.hue === 'gold') {
        ctx.fillStyle = isApproaching ? `rgba(255, 250, 204, ${alpha})` : `rgba(249, 115, 22, ${alpha})`;
        ctx.shadowColor = '#fde047';
      } else {
        ctx.fillStyle = isApproaching ? `rgba(216, 180, 254, ${alpha})` : `rgba(126, 34, 206, ${alpha})`;
        ctx.shadowColor = '#a855f7';
      }

      ctx.beginPath();
      ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 5. Equatorial Tilted Accretion Disk (Background Half)
    const diskRx = effectiveRadius * 0.72;
    const diskRy = diskRx * 0.32;

    ctx.save();
    ctx.rotate(0.15); // Slight cinematic slant
    const diskGrad = ctx.createRadialGradient(0, 0, horizonR * 0.9, 0, 0, diskRx);
    diskGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    diskGrad.addColorStop(0.2, 'rgba(253, 224, 71, 0.85)');
    diskGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.55)');
    diskGrad.addColorStop(0.8, 'rgba(168, 85, 247, 0.25)');
    diskGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = diskGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, diskRx, diskRy, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 6. Photon Sphere (Ultra-sharp razor-thin glowing boundary)
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.shadowColor = '#fde047';
    ctx.shadowBlur = 14;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.arc(0, 0, horizonR * 1.1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 7. Event Horizon (Pusat Lubang Hitam - True Absolute Black Void)
    // Nothing escapes this shadow!
    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(0, 0, horizonR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 8. Equatorial Accretion Disk (Foreground Half - Sweeps across front of the shadow)
    ctx.save();
    ctx.rotate(0.15);
    // Doppler effect: Left side much hotter than right
    const fgGrad = ctx.createLinearGradient(-diskRx, 0, diskRx, 0);
    fgGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    fgGrad.addColorStop(0.25, 'rgba(253, 224, 71, 0.9)');
    fgGrad.addColorStop(0.65, 'rgba(249, 115, 22, 0.65)');
    fgGrad.addColorStop(1, 'rgba(147, 51, 234, 0.2)');

    ctx.fillStyle = fgGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, diskRx, diskRy, 0, 0, Math.PI);
    ctx.fill();

    // High energy inner plasma rim
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(0, 0, horizonR * 1.35, horizonR * 0.45, 0, 0, Math.PI);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }
}
