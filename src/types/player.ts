// Data from the form
export interface PlayerFormData {
  name: string;
  goals: number;
  accuratePasses: number;
  missedPasses: number;
  shotsOnTarget: number;
  fouls: number;
  minutesPlayed: number;
}

// Data structure in the database
export interface PlayerDB extends PlayerFormData {
  id: string;
  user_id: string;
  created_at: string;
}

// Data structure used in the app, with calculated fields
export interface CalculatedPlayerStats extends PlayerDB {
  totalPasses: number;
  passingEfficiency: number;
  offensiveImpact: number;
}