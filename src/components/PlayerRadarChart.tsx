import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculatedPlayerStats } from "@/types/player";
import { useTheme } from "@/components/ThemeProvider";

interface PlayerRadarChartProps {
  players: CalculatedPlayerStats[];
}

const MAX_PLAYERS_TO_COMPARE = 3;

export function PlayerRadarChart({ players }: PlayerRadarChartProps) {
  const { theme } = useTheme();

  const mutedForeground = `hsl(var(--muted-foreground))`;
  const cardBackground = `hsl(var(--card))`;
  const primaryHsl = theme === 'dark' ? '210 40% 98%' : '222.2 47.4% 11.2%';

  const topPlayers = [...players]
    .sort((a, b) => b.offensiveImpact - a.offensiveImpact)
    .slice(0, MAX_PLAYERS_TO_COMPARE);

  if (topPlayers.length === 0) {
    return null;
  }

  const stats = [
    { name: 'Impacto Of.', key: 'offensiveImpact' },
    { name: 'Gols', key: 'goals' },
    { name: 'Chutes a Gol', key: 'shotsOnTarget' },
    { name: 'Efic. Passe', key: 'passingEfficiency' },
    { name: 'Min. Jogados', key: 'minutesPlayed' },
  ];

  const maxValues = stats.map(stat => {
    const allValues = players.map(p => p[stat.key as keyof CalculatedPlayerStats] as number);
    return Math.max(...allValues, 1);
  });

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
              <PolarGrid stroke={mutedForeground} strokeOpacity={0.3} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: mutedForeground, fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={{ fill: 'transparent' }} />
              <Tooltip
                cursor={{ stroke: mutedForeground, strokeOpacity: 0.5 }}
                contentStyle={{
                  backgroundColor: cardBackground,
                  borderColor: mutedForeground,
                  borderRadius: 'var(--radius)',
                }}
                labelStyle={{ color: `hsl(var(--foreground))` }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', color: mutedForeground }} />
              {topPlayers.map((player, index) => (
                <Radar
                  key={player.id}
                  name={player.name}
                  dataKey={player.name}
                  stroke={`hsla(${primaryHsl}, ${1 - index * 0.2})`}
                  fill={`hsla(${primaryHsl}, ${0.4 - index * 0.1})`}
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