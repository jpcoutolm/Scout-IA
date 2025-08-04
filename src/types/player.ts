export interface PlayerFormData {
  name: string;
  goals: number;
  accuratePasses: number;
  missedPasses: number;
  shotsOnTarget: number;
  fouls: number;
  minutesPlayed: number;
}

export interface CalculatedPlayerStats extends PlayerFormData {
  id: string;
  totalPasses: number;
  passingEfficiency: number;
  offensiveImpact: number;
}