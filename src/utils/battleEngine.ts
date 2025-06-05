import { Monster, BattleResult, BattleRound } from "../types";

const chanceCache = new Map<string, { crit: number; dodge: number }>();

const BASE_CRIT_CHANCE = 0.05;
const MAX_CRIT_CHANCE = 0.25;
const MAX_DODGE_CHANCE = 0.2;
const CRIT_MULTIPLIER = 1.8;
const SPEED_CRIT_DIVISOR = 1000;
const SPEED_DODGE_DIVISOR = 500;

function getOrCalculateChances(monster: Monster): {
  crit: number;
  dodge: number;
} {
  const key = `${monster.speed}`;

  if (chanceCache.has(key)) {
    return chanceCache.get(key)!;
  }

  const speedBonus = monster.speed / SPEED_CRIT_DIVISOR;
  const crit = Math.min(BASE_CRIT_CHANCE + speedBonus, MAX_CRIT_CHANCE);
  const dodge = Math.min(monster.speed / SPEED_DODGE_DIVISOR, MAX_DODGE_CHANCE);

  const chances = { crit, dodge };
  chanceCache.set(key, chances);

  return chances;
}

function calculateDamage(attacker: Monster, defender: Monster): number {
  const damage = attacker.attack - defender.defense;
  return Math.max(damage, 1);
}

function calculateCriticalHit(critChance: number): boolean {
  return Math.random() < critChance;
}

function calculateDodge(dodgeChance: number): boolean {
  return Math.random() < dodgeChance;
}

export function executeBattle(
  monster1: Monster,
  monster2: Monster
): BattleResult {
  const monster1Chances = getOrCalculateChances(monster1);
  const monster2Chances = getOrCalculateChances(monster2);

  const fighter1 = { ...monster1, currentHp: monster1.hp };
  const fighter2 = { ...monster2, currentHp: monster2.hp };

  const rounds: BattleRound[] = [];
  let roundNumber = 1;

  let currentAttacker = fighter1.speed >= fighter2.speed ? fighter1 : fighter2;
  let currentDefender = currentAttacker === fighter1 ? fighter2 : fighter1;

  let attackerChances =
    currentAttacker === fighter1 ? monster1Chances : monster2Chances;
  let defenderChances =
    currentDefender === fighter1 ? monster1Chances : monster2Chances;

  while (fighter1.currentHp > 0 && fighter2.currentHp > 0) {
    const isDodged = calculateDodge(defenderChances.dodge);
    const isCritical = !isDodged && calculateCriticalHit(attackerChances.crit);

    let damage = 0;
    let originalDamage = 0;

    if (!isDodged) {
      originalDamage = calculateDamage(currentAttacker, currentDefender);
      damage = isCritical
        ? Math.floor(originalDamage * CRIT_MULTIPLIER)
        : originalDamage;
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
    [attackerChances, defenderChances] = [defenderChances, attackerChances];
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
