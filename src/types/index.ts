export interface Monster {
  id: string;
  name: string;
  attack: number;
  defense: number;
  speed: number;
  hp: number;
  image_url: string;
  currentHp?: number;
}

export interface BattleRound {
  roundNumber: number;
  attacker: Monster;
  defender: Monster;
  damage: number;
  defenderHpAfter: number;
  isDodged: boolean;
  isCritical: boolean;
  originalDamage: number;
}

export interface BattleResult {
  winner: Monster;
  loser: Monster;
  rounds: BattleRound[];
  totalRounds: number;
}

export interface BattleArenaProps {
  monster1: Monster;
  monster2: Monster;
  onBattleComplete?: (result: BattleResult) => void;
  onReset?: () => void;
}
