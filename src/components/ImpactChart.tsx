import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculatedPlayerStats } from "@/types/player";
import { useTheme } from "@/components/ThemeProvider";

interface ImpactChartProps {
  players: CalculatedPlayerStats[];
}

export function ImpactChart({ players }: ImpactChartProps) {
  const { theme } = useTheme();

  const mutedForeground = `hsl(var(--muted-foreground))`;
  const cardBackground = `hsl(var(--card))`;
  const primaryColor = `hsl(var(--primary))`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Impacto Ofensivo</CardTitle>
      </CardHeader>
      <CardContent>
        {players.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={players}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" stroke={mutedForeground} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} stroke={mutedForeground} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{
                  backgroundColor: cardBackground,
                  borderColor: mutedForeground,
                  borderRadius: 'var(--radius)',
                }}
                labelStyle={{ color: `hsl(var(--foreground))` }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', color: mutedForeground }} />
              <Bar dataKey="offensiveImpact" fill={primaryColor} name="Impacto Ofensivo" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Adicione jogadores para ver o gráfico.
          </div>
        )}
      </CardContent>
    </Card>
  );
}