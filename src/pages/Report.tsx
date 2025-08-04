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
          <p className="mb-4">No player data found. Please generate a report from the main page first.</p>
          <Button onClick={() => window.close()}>Close Tab</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8 no-print">
        <h1 className="text-2xl font-bold">Player Performance Report</h1>
        <Button onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Print Report
        </Button>
      </div>
      <div className="hidden print:block text-center mb-6">
         <h1 className="text-2xl font-bold">Scout IA – Player Performance Report</h1>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Goals</TableHead>
            <TableHead>Pass Eff. (%)</TableHead>
            <TableHead>Off. Impact</TableHead>
            <TableHead>Mins Played</TableHead>
            <TableHead>Fouls</TableHead>
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
        Use your browser's "Print" function and select "Save as PDF" to download the report. This dialog should have opened automatically.
      </p>
    </div>
  );
};

export default Report;