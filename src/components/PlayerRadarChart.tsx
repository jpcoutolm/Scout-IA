import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculatedPlayerStats } from "@/types/player";

interface PlayerRadarChartProps {
  players: CalculatedPlayerStats[];
}

const MAX_PLAYERS_TO_COMPARE = 3;

export function PlayerRadarChart({ players }: PlayerRadarChartProps) {
  // Select top players based on offensive impact
  const topPlayers = [...players]
    .sort((a, b) => b.offensiveImpact - a.offensiveImpact)
    .slice(0, MAX_PLAYERS_TO_COMPARE);

  if (topPlayers.length === 0) {
    return null; // Don't render the card if there are no players
  }

  const stats = [
    { name: 'Impacto Of.', key: 'offensiveImpact' },
    { name: 'Gols', key: 'goals' },
    { name: 'Chutes a Gol', key: 'shotsOnTarget' },
    { name: 'Efic. Passe', key: 'passingEfficiency' },
    { name: 'Min. Jogados', key: 'minutesPlayed' },
  ];

  // Find the maximum value for each stat to set the scale
  const maxValues = stats.map(stat => {
    const allValues = players.map(p => p[stat.key as keyof CalculatedPlayerStats] as number);
    return Math.max(...allValues, 1); // Use 1 as a minimum max value to avoid division by zero
  });

  // Format data for the radar chart
  const chartData = stats.map((stat, index) => {
    const dataPoint: { subject: string; fullMark: number; [key: string]: string | number } = {
      subject: stat.name,
      fullMark: maxValues[index],
    };
    topPlayers.forEach(player => {
      dataPoint[player.name] = player[stat.key as keyof CalculatedPlayerStats];
    });
    return dataPoint;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparativo de Jogadores (Top {topPlayers.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {topPlayers.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} />
              <Tooltip />
              <Legend />
              {topPlayers.map((player, index) => (
                <Radar
                  key={player.id}
                  name={player.name}
                  dataKey={player.name}
                  stroke={`hsl(var(--primary), ${1 - index * 0.3})`}
                  fill={`hsl(var(--primary), ${1 - index * 0.3})`}
                  fillOpacity={0.6}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[350px] flex items-center justify-center text-muted-foreground">
            Adicione jogadores para ver o gráfico.
          </div>
        )}
      </CardContent>
    </Card>
  );
}