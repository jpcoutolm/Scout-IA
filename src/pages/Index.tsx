import { useState } from "react";
import { PlayerForm } from "@/components/PlayerForm";
import { PlayerTable } from "@/components/PlayerTable";
import { ImpactChart } from "@/components/ImpactChart";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { CalculatedPlayerStats, PlayerFormData } from "@/types/player";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [players, setPlayers] = useState<CalculatedPlayerStats[]>([]);

  const addPlayer = (data: PlayerFormData) => {
    const totalPasses = data.accuratePasses + data.missedPasses;
    const passingEfficiency = totalPasses > 0 ? (data.accuratePasses / totalPasses) * 100 : 0;
    const offensiveImpact = 2 * data.goals + data.shotsOnTarget;

    const newPlayer: CalculatedPlayerStats = {
      ...data,
      id: `${data.name}-${new Date().getTime()}`,
      totalPasses,
      passingEfficiency: parseFloat(passingEfficiency.toFixed(1)),
      offensiveImpact,
    };

    setPlayers((prev) => [...prev, newPlayer]);
  };

  const handleDownloadCSV = () => {
    const headers = "Nome,Gols,Passes Certos,Passes Errados,Total de Passes,Eficiência de Passe (%),Chutes a Gol,Faltas,Minutos Jogados,Impacto Ofensivo";
    const rows = players.map(p =>
      [p.name, p.goals, p.accuratePasses, p.missedPasses, p.totalPasses, p.passingEfficiency, p.shotsOnTarget, p.fouls, p.minutesPlayed, p.offensiveImpact].join(',')
    ).join('\n');

    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "estatisticas_jogadores.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    // Save data to localStorage for the new tab to access
    localStorage.setItem('playerReportData', JSON.stringify(players));
    // Open the report page in a new tab
    window.open('/report', '_blank');
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Scout IA – Análise de Partidas de Futebol Amador</h1>
        <p className="text-muted-foreground mt-2">Registre e analise o desempenho dos jogadores após cada partida.</p>
      </header>

      <main className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <PlayerForm addPlayer={addPlayer} />
        </div>

        <div className="lg:col-span-2 space-y-8">
          {players.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Downloads</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleDownloadCSV} className="w-full sm:w-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar CSV
                </Button>
                <Button onClick={handleDownloadPDF} variant="outline" className="w-full sm:w-auto">
                  <FileText className="mr-2 h-4 w-4" />
                  Gerar Relatório PDF
                </Button>
              </CardContent>
            </Card>
          )}
          <PlayerTable players={players} />
          <ImpactChart players={players} />
        </div>
      </main>
    </div>
  );
};

export default Index;