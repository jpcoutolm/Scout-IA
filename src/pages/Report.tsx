import { useEffect, useState } from 'react';
import { CalculatedPlayerStats } from '@/types/player';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer } from 'lucide-react';

const Report = () => {
  const [players, setPlayers] = useState<CalculatedPlayerStats[]>([]);

  useEffect(() => {
    const storedPlayers = localStorage.getItem('playerReportData');
    if (storedPlayers) {
      setPlayers(JSON.parse(storedPlayers));
    }
  }, []);

  useEffect(() => {
    // Automatically trigger print dialog once the component has mounted and rendered the players
    if (players.length > 0) {
      setTimeout(() => window.print(), 500);
    }
  }, [players]);

  if (players.length === 0) {
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
        <h1 className="text-2xl font-bold">Relatório de Desempenho do Jogador</h1>
        <Button onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimir Relatório
        </Button>
      </div>
      <div className="hidden print:block text-center mb-6">
         <h1 className="text-2xl font-bold">Scout IA – Relatório de Desempenho do Jogador</h1>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Gols</TableHead>
            <TableHead>Efic. Passe (%)</TableHead>
            <TableHead>Impacto Of.</TableHead>
            <TableHead>Min. Jogados</TableHead>
            <TableHead>Faltas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.goals}</TableCell>
              <TableCell>{p.passingEfficiency}%</TableCell>
              <TableCell>{p.offensiveImpact}</TableCell>
              <TableCell>{p.minutesPlayed}</TableCell>
              <TableCell>{p.fouls}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-sm text-muted-foreground mt-8 no-print">
        Use a função "Imprimir" do seu navegador e selecione "Salvar como PDF" para baixar o relatório. Esta janela de diálogo deveria ter aberto automaticamente.
      </p>
    </div>
  );
};

export default Report;