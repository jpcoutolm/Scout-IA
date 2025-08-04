import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { PlayerDB } from '@/types/player';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { showError } from '@/utils/toast';
import { Skeleton } from '@/components/ui/skeleton';

interface MatchSetupProps {
  onStartMatch: (roster: PlayerDB[]) => void;
}

export function MatchSetup({ onStartMatch }: MatchSetupProps) {
  const { session } = useAuth();
  const [allPlayers, setAllPlayers] = useState<PlayerDB[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Map<string, PlayerDB>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      if (!session?.user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('players')
        .select('*');
      
      if (error) {
        showError('Falha ao carregar jogadores.');
        console.error(error);
      } else {
        setAllPlayers(data as PlayerDB[]);
      }
      setLoading(false);
    };
    fetchPlayers();
  }, [session]);

  const handleSelectPlayer = (player: PlayerDB, checked: boolean) => {
    const newSelection = new Map(selectedPlayers);
    if (checked) {
      newSelection.set(player.id, player);
    } else {
      newSelection.delete(player.id);
    }
    setSelectedPlayers(newSelection);
  };

  const handleStart = () => {
    if (selectedPlayers.size === 0) {
      showError("Selecione pelo menos um jogador para iniciar a partida.");
      return;
    }
    onStartMatch(Array.from(selectedPlayers.values()));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurar Partida Ao Vivo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="font-semibold">Selecione os Jogadores</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded-md">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
            ) : allPlayers.length > 0 ? (
              allPlayers.map(player => (
                <div key={player.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`player-${player.id}`}
                    onCheckedChange={(checked) => handleSelectPlayer(player, !!checked)}
                  />
                  <Label htmlFor={`player-${player.id}`}>{player.name}</Label>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">Nenhum jogador encontrado. Adicione jogadores na página principal primeiro.</p>
            )}
          </div>
          <Button onClick={handleStart} className="w-full">Iniciar Partida</Button>
        </div>
      </CardContent>
    </Card>
  );
}