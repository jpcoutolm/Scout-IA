import { useState } from 'react';
import { PlayerDB, PlayerFormData } from '@/types/player';
import { MatchSetup } from '@/components/live/MatchSetup';
import { LiveTracker } from '@/components/live/LiveTracker';
import { Header } from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';

export type LiveStats = Omit<PlayerFormData, 'name'>;

const LiveMatch = () => {
  const { session } = useAuth();
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
        goals: player.goals + matchStats.goals,
        accuratePasses: player.accuratePasses + matchStats.accuratePasses,
        missedPasses: player.missedPasses + matchStats.missedPasses,
        shotsOnTarget: player.shotsOnTarget + matchStats.shotsOnTarget,
        fouls: player.fouls + matchStats.fouls,
        minutesPlayed: player.minutesPlayed + Math.round(finalTime / 60),
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...updateData } = updatedPlayer;
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
      <Header />
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