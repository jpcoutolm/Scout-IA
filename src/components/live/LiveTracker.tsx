import { useState, useEffect, useCallback, useMemo } from 'react';
import { PlayerDB } from '@/types/player';
import { LiveStats } from '@/pages/LiveMatch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pause, Play, Square } from 'lucide-react';

interface LiveTrackerProps {
  roster: PlayerDB[];
  initialStats: Map<string, LiveStats>;
  onEndMatch: (finalStats: Map<string, LiveStats>, finalTime: number) => void;
}

export function LiveTracker({ roster, initialStats, onEndMatch }: LiveTrackerProps) {
  const [activePlayerId, setActivePlayerId] = useState<string | null>(roster[0]?.id || null);
  const [liveStats, setLiveStats] = useState<Map<string, LiveStats>>(initialStats);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const activePlayer = useMemo(() => roster.find(p => p.id === activePlayerId), [activePlayerId, roster]);

  useEffect(() => {
    let interval: number | undefined;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleEvent = useCallback((statKey: keyof LiveStats) => {
    if (!activePlayerId) return;
    setLiveStats(prevStats => {
      const newStats = new Map(prevStats);
      const playerStats = newStats.get(activePlayerId);
      if (playerStats) {
        const currentVal = playerStats[statKey] ?? 0;
        const updatedPlayerStats = { ...playerStats, [statKey]: currentVal + 1 };
        newStats.set(activePlayerId, updatedPlayerStats);
      }
      return newStats;
    });
  }, [activePlayerId]);

  const getEventButtons = () => {
    if (!activePlayer) return [];

    const { position } = activePlayer;
    const defensivePositions = ['Zagueiro', 'Lateral', 'Volante'];

    const baseOutfieldButtons: { label: string; stat: keyof LiveStats }[] = [
      { label: "+ Gol", stat: "goals" },
      { label: "+ Chute a Gol", stat: "shotsOnTarget" },
      { label: "+ Passe Certo", stat: "accuratePasses" },
      { label: "+ Passe Errado", stat: "missedPasses" },
      { label: "+ Falta", stat: "fouls" },
    ];

    if (position === 'Goleiro') {
      return [
        { label: "+ Defesa", stat: "saves" },
        { label: "+ Gol Sofrido", stat: "goalsConceded" },
        { label: "+ Saída Bem-sucedida", stat: "successfulExits" },
        { label: "+ Erro Crítico", stat: "criticalErrors" },
        { label: "+ Falta", stat: "fouls" },
      ];
    }

    if (defensivePositions.includes(position)) {
      return [...baseOutfieldButtons, { label: "+ Desarme", stat: "tackles" }];
    }

    return baseOutfieldButtons;
  };

  const eventButtons = getEventButtons();
  const defensivePositions = ['Zagueiro', 'Lateral', 'Volante'];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Partida em Andamento</span>
            <div className="flex items-center gap-4">
              <span className="font-mono text-2xl">{formatTime(timer)}</span>
              <Button onClick={() => setIsTimerRunning(!isTimerRunning)} size="icon" variant="outline">
                {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <h4 className="font-semibold">Selecione o Jogador</h4>
            <div className="flex flex-col gap-2">
              {roster.map(player => (
                <Button
                  key={player.id}
                  variant={activePlayerId === player.id ? 'default' : 'outline'}
                  onClick={() => setActivePlayerId(player.id)}
                >
                  {player.name}
                </Button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-semibold">Registrar Evento para {activePlayer?.name || '...'}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {eventButtons.map(({ label, stat }) => (
                <Button key={stat} onClick={() => handleEvent(stat)} disabled={!activePlayerId || !isTimerRunning}>
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estatísticas da Partida</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jogador</TableHead>
                  <TableHead>Gols</TableHead>
                  <TableHead>Chutes</TableHead>
                  <TableHead>Passes C/E</TableHead>
                  <TableHead>Faltas</TableHead>
                  <TableHead>Desarmes</TableHead>
                  <TableHead>Defesas</TableHead>
                  <TableHead>Gols Sofr.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roster.map(player => {
                  const stats = liveStats.get(player.id);
                  return (
                    <TableRow key={player.id}>
                      <TableCell>{player.name}</TableCell>
                      <TableCell>{player.position !== 'Goleiro' ? stats?.goals ?? 0 : 'N/A'}</TableCell>
                      <TableCell>{player.position !== 'Goleiro' ? stats?.shotsOnTarget ?? 0 : 'N/A'}</TableCell>
                      <TableCell>{player.position !== 'Goleiro' ? `${stats?.accuratePasses ?? 0}/${stats?.missedPasses ?? 0}` : 'N/A'}</TableCell>
                      <TableCell>{stats?.fouls ?? 0}</TableCell>
                      <TableCell>{defensivePositions.includes(player.position) ? stats?.tackles ?? 0 : 'N/A'}</TableCell>
                      <TableCell>{player.position === 'Goleiro' ? stats?.saves ?? 0 : 'N/A'}</TableCell>
                      <TableCell>{player.position === 'Goleiro' ? stats?.goalsConceded ?? 0 : 'N/A'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Button onClick={() => onEndMatch(liveStats, timer)} size="lg" className="w-full bg-red-600 hover:bg-red-700">
        <Square className="mr-2 h-4 w-4" />
        Encerrar e Salvar Partida
      </Button>
    </div>
  );
}