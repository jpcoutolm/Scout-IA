import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerDB, PlayerFormData } from '@/types/player';
import { MatchSetup } from '@/components/live/MatchSetup';
import { LiveTracker } from '@/components/live/LiveTracker';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export type LiveStats = Omit<PlayerFormData, 'name' | 'position'>;

const LiveMatch = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [matchPhase, setMatchPhase] = useState<'setup' | 'live'>('setup');
  const [roster, setRoster] = useState<PlayerDB[]>([]);
  const [liveStats, setLiveStats] = useState<Map<string, LiveStats>>(new Map());

  const handleStartMatch = (selectedRoster: PlayerDB[]) => {
    setRoster(selectedRoster);
    const initialStats = new Map<string, LiveStats>();
    selectedRoster.forEach(player => {
      initialStats.set(player.id, {
        goals: 0,
        accuratePasses: 0,
        missedPasses: 0,
        shotsOnTarget: 0,
        fouls: 0,
        minutesPlayed: 0,
        saves: 0,
        goalsConceded: 0,
        successfulExits: 0,
        criticalErrors: 0,
        tackles: 0,
      });
    });
    setLiveStats(initialStats);
    setMatchPhase('live');
  };

  const handleEndMatch = async (finalStats: Map<string, LiveStats>, finalTime: number) => {
    if (!session?.user) {
      showError("Você não está logado.");
      return;
    }

    const toastId = showLoading("Salvando resultados da partida...");

    const updates = roster.map(player => {
      const matchStats = finalStats.get(player.id);
      if (!matchStats) return null;

      const updatedPlayer = {
        ...player,
        goals: player.goals + (matchStats.goals ?? 0),
        accuratePasses: player.accuratePasses + (matchStats.accuratePasses ?? 0),
        missedPasses: player.missedPasses + (matchStats.missedPasses ?? 0),
        shotsOnTarget: player.shotsOnTarget + (matchStats.shotsOnTarget ?? 0),
        fouls: player.fouls + (matchStats.fouls ?? 0),
        minutesPlayed: player.minutesPlayed + Math.round(finalTime / 60),
        tackles: (player.tackles ?? 0) + (matchStats.tackles ?? 0),
        saves: (player.saves ?? 0) + (matchStats.saves ?? 0),
        goalsConceded: (player.goalsConceded ?? 0) + (matchStats.goalsConceded ?? 0),
        successfulExits: (player.successfulExits ?? 0) + (matchStats.successfulExits ?? 0),
        criticalErrors: (player.criticalErrors ?? 0) + (matchStats.criticalErrors ?? 0),
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, created_at, user_id, ...updateData } = updatedPlayer;
      return supabase.from('players').update(updateData).eq('id', player.id);
    }).filter(Boolean);

    try {
      await Promise.all(updates);
      dismissToast(toastId);
      showSuccess("Resultados da partida salvos com sucesso!");
      setMatchPhase('setup');
      setRoster([]);
    } catch (error) {
      dismissToast(toastId);
      showError("Falha ao salvar os resultados.");
      console.error("Error saving match results:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="relative flex justify-center items-center mb-8">
        <div className="absolute left-0">
            <Button onClick={() => navigate('/')} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
            </Button>
        </div>
        <h1 className="text-3xl font-bold text-center">Partida Ao Vivo</h1>
      </div>
      <main>
        {matchPhase === 'setup' ? (
          <MatchSetup onStartMatch={handleStartMatch} />
        ) : (
          <LiveTracker
            roster={roster}
            initialStats={liveStats}
            onEndMatch={handleEndMatch}
          />
        )}
      </main>
    </div>
  );
};

export default LiveMatch;