import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculatedPlayerStats } from "@/types/player";

interface ImpactChartProps {
  players: CalculatedPlayerStats[];
}

export function ImpactChart({ players }: ImpactChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Offensive Impact</CardTitle>
      </CardHeader>
      <CardContent>
        {players.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={players}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="offensiveImpact" fill="hsl(var(--primary))" name="Offensive Impact" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Add players to see the chart.
          </div>
        )}
      </CardContent>
    </Card>
  );
}