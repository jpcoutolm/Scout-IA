import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export interface Filters {
  name: string;
  minGoals: number | '';
  maxGoals: number | '';
  minPassingEfficiency: number | '';
  maxPassingEfficiency: number | '';
  minFouls: number | '';
  maxFouls: number | '';
  minMinutesPlayed: number | '';
  maxMinutesPlayed: number | '';
}

interface PlayerFiltersProps {
  onFilterChange: (filters: Filters) => void;
}

export function PlayerFilters({ onFilterChange }: PlayerFiltersProps) {
  const [filters, setFilters] = React.useState<Filters>({
    name: '',
    minGoals: '',
    maxGoals: '',
    minPassingEfficiency: '',
    maxPassingEfficiency: '',
    minFouls: '',
    maxFouls: '',
    minMinutesPlayed: '',
    maxMinutesPlayed: '',
  });

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange(filters);
    }, 300); // Debounce input to avoid re-rendering on every keystroke
    return () => clearTimeout(timer);
  }, [filters, onFilterChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: name === 'name' ? value : (value === '' ? '' : Number(value)),
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros e Pesquisa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Pesquisar por Nome</Label>
          <Input
            id="name"
            name="name"
            placeholder="Nome do jogador..."
            value={filters.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minGoals">Mín. Gols</Label>
            <Input id="minGoals" name="minGoals" type="number" placeholder="0" value={filters.minGoals} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="maxGoals">Máx. Gols</Label>
            <Input id="maxGoals" name="maxGoals" type="number" placeholder="10" value={filters.maxGoals} onChange={handleInputChange} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minPassingEfficiency">Mín. Efic. Passe (%)</Label>
            <Input id="minPassingEfficiency" name="minPassingEfficiency" type="number" placeholder="0" value={filters.minPassingEfficiency} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="maxPassingEfficiency">Máx. Efic. Passe (%)</Label>
            <Input id="maxPassingEfficiency" name="maxPassingEfficiency" type="number" placeholder="100" value={filters.maxPassingEfficiency} onChange={handleInputChange} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minFouls">Mín. Faltas</Label>
            <Input id="minFouls" name="minFouls" type="number" placeholder="0" value={filters.minFouls} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="maxFouls">Máx. Faltas</Label>
            <Input id="maxFouls" name="maxFouls" type="number" placeholder="10" value={filters.maxFouls} onChange={handleInputChange} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minMinutesPlayed">Mín. Minutos</Label>
            <Input id="minMinutesPlayed" name="minMinutesPlayed" type="number" placeholder="0" value={filters.minMinutesPlayed} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="maxMinutesPlayed">Máx. Minutos</Label>
            <Input id="maxMinutesPlayed" name="maxMinutesPlayed" type="number" placeholder="90" value={filters.maxMinutesPlayed} onChange={handleInputChange} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}