import { useEffect, useState } from 'react';
import { CalculatedPlayerStats } from '@/types/player';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer } from 'lucide-react';

interface ReportData {
  players: CalculatedPlayerStats[];
  header?: string;
  logo?: string | null;
}

const Report = () => {
  const [allPlayers, setAllPlayers] = useState<CalculatedPlayerStats[]>([]);
  const [header, setHeader] = useState('Scout IA – Relatório de Desempenho');
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('playerReportData');
    if (storedData) {
      const data: ReportData = JSON.parse(storedData);
      setAllPlayers(data.players || []);
      if (data.header) {
        setHeader(data.header);
      }
      if (data.logo) {
        setLogo(data.logo);
      }
    }
  }, []);

  useEffect(() => {
    if (allPlayers.length > 0) {
      setTimeout(() => window.print(), 500);
    }
  }, [allPlayers]);

  const outfieldPlayers = allPlayers.filter(p => p.position !== 'Goleiro');
  const goalkeepers = allPlayers.filter(p => p.position === 'Goleiro');
  const defensivePositions = ['Zagueiro', 'Lateral', 'Volante'];

  if (allPlayers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <div>
          <p className="mb-4">Nenhum dado de jogador encontrado. Por favor, gere um relatório na página principal primeiro.</p>
          <Button onClick={() => window.close()}>Fechar Aba</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8 no-print">
        <h1 className="text-2xl font-bold">Relatório de Desempenho</h1>
        <Button onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimir Relatório
        </Button>
      </div>
      
      <div className="hidden print:block text-center mb-6">
        {logo && <img src={logo} alt="Logo do Time" className="mx-auto h-24 w-auto object-contain mb-4" />}
        <h1 className="text-2xl font-bold">{header}</h1>
      </div>

      {outfieldPlayers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Desempenho - Jogadores de Linha</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Posição</TableHead>
                  <TableHead>Gols</TableHead>
                  <TableHead>Efic. Passe (%)</TableHead>
                  <TableHead>Impacto Of.</TableHead>
                  <TableHead>Desarmes</TableHead>
                  <TableHead>Min. Jogados</TableHead>
                  <TableHead>Faltas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outfieldPlayers.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.position}</TableCell>
                    <TableCell>{p.goals}</TableCell>
                    <TableCell>{p.passingEfficiency}%</TableCell>
                    <TableCell>{p.offensiveImpact}</TableCell>
                    <TableCell>{defensivePositions.includes(p.position) ? p.tackles ?? 0 : 'N/A'}</TableCell>
                    <TableCell>{p.minutesPlayed}</TableCell>
                    <TableCell>{p.fouls}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {goalkeepers.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Desempenho - Goleiros</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Defesas</TableHead>
                  <TableHead>Gols Sofridos</TableHead>
                  <TableHead>Saídas Bem-sucedidas</TableHead>
                  <TableHead>Erros Críticos</TableHead>
                  <TableHead>Min. Jogados</TableHead>
                  <TableHead>Faltas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {goalkeepers.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.saves}</TableCell>
                    <TableCell>{p.goalsConceded}</TableCell>
                    <TableCell>{p.successfulExits}</TableCell>
                    <TableCell>{p.criticalErrors}</TableCell>
                    <TableCell>{p.minutesPlayed}</TableCell>
                    <TableCell>{p.fouls}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <p className="text-sm text-muted-foreground mt-8 no-print">
        Use a função "Imprimir" do seu navegador e selecione "Salvar como PDF" para baixar o relatório. Esta janela de diálogo deveria ter aberto automaticamente.
      </p>
    </div>
  );
};

export default Report;