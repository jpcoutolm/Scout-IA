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
import { ArrowUpDown, Trash2 } from "lucide-react";
import { CalculatedPlayerStats } from "@/types/player";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PlayerTableProps {
  players: CalculatedPlayerStats[];
  deletePlayer: (id: string) => void;
}

type SortKey = keyof CalculatedPlayerStats;

const SortableHeader = ({ sortKey, label, sortConfig, requestSort }: { sortKey: SortKey, label: string, sortConfig: any, requestSort: (key: SortKey) => void }) => {
  const getSortIndicator = () => {
    if (!sortConfig || sortConfig.key !== sortKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortConfig.direction === 'ascending' ? '🔼' : '🔽';
  };

  return (
    <Button variant="ghost" onClick={() => requestSort(sortKey)} className="px-2">
      {label}
      {getSortIndicator()}
    </Button>
  );
};

export function PlayerTable({ players, deletePlayer }: PlayerTableProps) {
  const [outfieldSortConfig, setOutfieldSortConfig] = React.useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'offensiveImpact', direction: 'descending' });
  const [gkSortConfig, setGkSortConfig] = React.useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'saves', direction: 'descending' });

  const outfieldPlayers = React.useMemo(() => players.filter(p => p.position !== 'Goleiro'), [players]);
  const goalkeepers = React.useMemo(() => players.filter(p => p.position === 'Goleiro'), [players]);

  const useSortableData = (items: CalculatedPlayerStats[], config: { key: SortKey; direction: string } | null) => {
    return React.useMemo(() => {
      let sortableItems = [...items];
      if (config !== null) {
        sortableItems.sort((a, b) => {
          const valA = a[config.key] ?? 0;
          const valB = b[config.key] ?? 0;
          if (valA < valB) return config.direction === 'ascending' ? -1 : 1;
          if (valA > valB) return config.direction === 'ascending' ? 1 : -1;
          return 0;
        });
      }
      return sortableItems;
    }, [items, config]);
  };

  const sortedOutfieldPlayers = useSortableData(outfieldPlayers, outfieldSortConfig);
  const sortedGoalkeepers = useSortableData(goalkeepers, gkSortConfig);

  const requestSort = (key: SortKey, type: 'outfield' | 'gk') => {
    const config = type === 'outfield' ? outfieldSortConfig : gkSortConfig;
    const setConfig = type === 'outfield' ? setOutfieldSortConfig : setGkSortConfig;
    let direction: 'ascending' | 'descending' = 'ascending';
    if (config && config.key === key && config.direction === 'ascending') {
      direction = 'descending';
    }
    setConfig({ key, direction });
  };

  const outfieldHeaders: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'Nome' }, { key: 'position', label: 'Posição' }, { key: 'goals', label: 'Gols' }, { key: 'passingEfficiency', label: 'Efic. Passe' }, { key: 'shotsOnTarget', label: 'Chutes a Gol' }, { key: 'tackles', label: 'Desarmes' }, { key: 'minutesPlayed', label: 'Min. Jogados' }, { key: 'offensiveImpact', label: 'Impacto Of.' }, { key: 'fouls', label: 'Faltas' },
  ];
  const goalkeeperHeaders: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'Nome' }, { key: 'saves', label: 'Defesas' }, { key: 'goalsConceded', label: 'Gols Sofridos' }, { key: 'successfulExits', label: 'Saídas' }, { key: 'criticalErrors', label: 'Erros Críticos' }, { key: 'minutesPlayed', label: 'Min. Jogados' }, { key: 'fouls', label: 'Faltas' },
  ];
  const defensivePositions = ['Zagueiro', 'Lateral', 'Volante'];

  if (players.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Estatísticas dos Jogadores</CardTitle></CardHeader>
        <CardContent>
          <div className="h-24 text-center flex items-center justify-center">Nenhum jogador adicionado ainda.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {sortedOutfieldPlayers.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Jogadores de Linha</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {outfieldHeaders.map(h => <TableHead key={h.key}><SortableHeader sortKey={h.key} label={h.label} sortConfig={outfieldSortConfig} requestSort={(key) => requestSort(key, 'outfield')} /></TableHead>)}
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedOutfieldPlayers.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{p.position}</TableCell>
                      <TableCell>{p.goals}</TableCell>
                      <TableCell>{p.passingEfficiency}%</TableCell>
                      <TableCell>{p.shotsOnTarget}</TableCell>
                      <TableCell>{defensivePositions.includes(p.position) ? p.tackles ?? 0 : 'N/A'}</TableCell>
                      <TableCell>{p.minutesPlayed}</TableCell>
                      <TableCell>{p.offensiveImpact}</TableCell>
                      <TableCell>{p.fouls}</TableCell>
                      <TableCell><DeleteAction player={p} deletePlayer={deletePlayer} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
      {sortedGoalkeepers.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Goleiros</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {goalkeeperHeaders.map(h => <TableHead key={h.key}><SortableHeader sortKey={h.key} label={h.label} sortConfig={gkSortConfig} requestSort={(key) => requestSort(key, 'gk')} /></TableHead>)}
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedGoalkeepers.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{p.saves}</TableCell>
                      <TableCell>{p.goalsConceded}</TableCell>
                      <TableCell>{p.successfulExits}</TableCell>
                      <TableCell>{p.criticalErrors}</TableCell>
                      <TableCell>{p.minutesPlayed}</TableCell>
                      <TableCell>{p.fouls}</TableCell>
                      <TableCell><DeleteAction player={p} deletePlayer={deletePlayer} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const DeleteAction = ({ player, deletePlayer }: { player: CalculatedPlayerStats, deletePlayer: (id: string) => void }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
        <AlertDialogDescription>Esta ação não pode ser desfeita. Isso irá remover permanentemente os dados do jogador {player.name}.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction onClick={() => deletePlayer(player.id)} className="bg-destructive hover:bg-destructive/90">Remover</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);