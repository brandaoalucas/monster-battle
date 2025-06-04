import { Monster, BattleResult, BattleRound } from "../types";

function calculateDamage(attacker: Monster, defender: Monster): number {
  const damage = attacker.attack - defender.defense;
  return Math.max(damage, 1);
}

function calculateCriticalHit(attacker: Monster): boolean {
  const baseCritChance = 0.05;
  const speedBonus = attacker.speed / 1000;
  const totalCritChance = Math.min(baseCritChance + speedBonus, 0.25);

  return Math.random() < totalCritChance;
}

function calculateDodge(defender: Monster): boolean {
  const dodgeChance = Math.min(defender.speed / 500, 0.2);
  return Math.random() < dodgeChance;
}

export function executeBattle(
  monster1: Monster,
  monster2: Monster
): BattleResult {
  const fighter1 = { ...monster1, currentHp: monster1.hp };
  const fighter2 = { ...monster2, currentHp: monster2.hp };

  const rounds: BattleRound[] = [];
  let roundNumber = 1;

  let currentAttacker = fighter1.speed >= fighter2.speed ? fighter1 : fighter2;
  let currentDefender = currentAttacker === fighter1 ? fighter2 : fighter1;

  while (fighter1.currentHp > 0 && fighter2.currentHp > 0) {
    const isDodged = calculateDodge(currentDefender);
    const isCritical = !isDodged && calculateCriticalHit(currentAttacker);

    let damage = 0;
    let originalDamage = 0;

    if (!isDodged) {
      originalDamage = calculateDamage(currentAttacker, currentDefender);
      damage = isCritical ? Math.floor(originalDamage * 1.8) : originalDamage;
      currentDefender.currentHp = Math.max(
        0,
        currentDefender.currentHp - damage
      );
    }

    rounds.push({
      roundNumber,
      attacker: { ...currentAttacker },
      defender: { ...currentDefender },
      damage,
      defenderHpAfter: currentDefender.currentHp,
      isDodged,
      isCritical,
      originalDamage: isDodged ? 0 : originalDamage,
    });

    if (currentDefender.currentHp === 0) {
      break;
    }

    [currentAttacker, currentDefender] = [currentDefender, currentAttacker];
    roundNumber++;
  }

  const winner = fighter1.currentHp > 0 ? fighter1 : fighter2;
  const loser = winner === fighter1 ? fighter2 : fighter1;

  return {
    winner,
    loser,
    rounds,
    totalRounds: rounds.length,
  };
}
