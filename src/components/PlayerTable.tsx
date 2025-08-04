import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { CalculatedPlayerStats } from "@/types/player";

interface PlayerTableProps {
  players: CalculatedPlayerStats[];
}

type SortKey = keyof CalculatedPlayerStats;

export function PlayerTable({ players }: PlayerTableProps) {
  const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'offensiveImpact', direction: 'descending' });

  const sortedPlayers = React.useMemo(() => {
    let sortableItems = [...players];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [players, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽';
  };

  const headers: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'Nome' },
    { key: 'goals', label: 'Gols' },
    { key: 'accuratePasses', label: 'Passes Certos' },
    { key: 'missedPasses', label: 'Passes Errados' },
    { key: 'totalPasses', label: 'Total de Passes' },
    { key: 'passingEfficiency', label: 'Efic. Passe (%)' },
    { key: 'shotsOnTarget', label: 'Chutes a Gol' },
    { key: 'fouls', label: 'Faltas' },
    { key: 'minutesPlayed', label: 'Min. Jogados' },
    { key: 'offensiveImpact', label: 'Impacto Of.' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas dos Jogadores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header.key}>
                    <Button variant="ghost" onClick={() => requestSort(header.key)}>
                      {header.label}
                      {getSortIndicator(header.key)}
                    </Button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPlayers.length > 0 ? (
                sortedPlayers.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">{player.name}</TableCell>
                    <TableCell>{player.goals}</TableCell>
                    <TableCell>{player.accuratePasses}</TableCell>
                    <TableCell>{player.missedPasses}</TableCell>
                    <TableCell>{player.totalPasses}</TableCell>
                    <TableCell>{player.passingEfficiency}%</TableCell>
                    <TableCell>{player.shotsOnTarget}</TableCell>
                    <TableCell>{player.fouls}</TableCell>
                    <TableCell>{player.minutesPlayed}</TableCell>
                    <TableCell>{player.offensiveImpact}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={headers.length} className="h-24 text-center">
                    Nenhum jogador adicionado ainda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}