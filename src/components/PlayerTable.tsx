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
        const valA = a[sortConfig.key] ?? 0;
        const valB = b[sortConfig.key] ?? 0;
        if (valA < valB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
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

  const headers: { key: SortKey; label: string; isGk?: boolean }[] = [
    { key: 'name', label: 'Nome' },
    { key: 'position', label: 'Posição' },
    { key: 'goals', label: 'Gols' },
    { key: 'accuratePasses', label: 'Passes Certos' },
    { key: 'missedPasses', label: 'Passes Errados' },
    { key: 'passingEfficiency', label: 'Efic. Passe (%)' },
    { key: 'shotsOnTarget', label: 'Chutes a Gol' },
    { key: 'fouls', label: 'Faltas' },
    { key: 'tackles', label: 'Desarmes' },
    { key: 'minutesPlayed', label: 'Min. Jogados' },
    { key: 'offensiveImpact', label: 'Impacto Of.' },
    { key: 'saves', label: 'Defesas', isGk: true },
    { key: 'goalsConceded', label: 'Gols Sofridos', isGk: true },
    { key: 'criticalErrors', label: 'Erros Críticos', isGk: true },
  ];

  const defensivePositions = ['Zagueiro', 'Lateral', 'Volante'];

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
                    <TableCell>{player.position}</TableCell>
                    <TableCell>{player.position !== 'Goleiro' ? player.goals : 'N/A'}</TableCell>
                    <TableCell>{player.position !== 'Goleiro' ? player.accuratePasses : 'N/A'}</TableCell>
                    <TableCell>{player.position !== 'Goleiro' ? player.missedPasses : 'N/A'}</TableCell>
                    <TableCell>{player.position !== 'Goleiro' ? `${player.passingEfficiency}%` : 'N/A'}</TableCell>
                    <TableCell>{player.position !== 'Goleiro' ? player.shotsOnTarget : 'N/A'}</TableCell>
                    <TableCell>{player.fouls}</TableCell>
                    <TableCell>{defensivePositions.includes(player.position) ? player.tackles ?? 0 : 'N/A'}</TableCell>
                    <TableCell>{player.minutesPlayed}</TableCell>
                    <TableCell>{player.position !== 'Goleiro' ? player.offensiveImpact : 'N/A'}</TableCell>
                    <TableCell>{player.position === 'Goleiro' ? player.saves : 'N/A'}</TableCell>
                    <TableCell>{player.position === 'Goleiro' ? player.goalsConceded : 'N/A'}</TableCell>
                    <TableCell>{player.position === 'Goleiro' ? player.criticalErrors : 'N/A'}</TableCell>
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