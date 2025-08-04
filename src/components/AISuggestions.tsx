import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Lightbulb, ThumbsUp } from "lucide-react";
import { CalculatedPlayerStats } from "@/types/player";

interface Suggestion {
  text: string;
  type: 'warning' | 'suggestion' | 'praise';
}

const generateSuggestions = (player: CalculatedPlayerStats): Suggestion[] => {
  const suggestions: Suggestion[] = [];

  // Warning: High number of fouls
  if (player.fouls >= 3) {
    suggestions.push({
      text: "Número elevado de faltas. Focar em treinos de desarme para melhorar a disciplina defensiva.",
      type: 'warning',
    });
  }

  // Warning: Low passing efficiency
  if (player.totalPasses > 10 && player.passingEfficiency < 70) {
    suggestions.push({
      text: `A precisão de passe de ${player.passingEfficiency}% está baixa. Recomenda-se praticar exercícios de passe.`,
      type: 'warning',
    });
  }

  // Suggestion: Low offensive impact
  if (player.offensiveImpact < 2 && player.minutesPlayed > 45) {
    suggestions.push({
      text: "Baixo impacto ofensivo para os minutos jogados. Considerar uma mudança tática ou rotação.",
      type: 'suggestion',
    });
  }

  // Praise: High offensive impact
  if (player.offensiveImpact >= 5) {
    suggestions.push({
      text: "Excelente impacto ofensivo! Continuar a ser decisivo no ataque.",
      type: 'praise',
    });
  }

  // Praise: High passing efficiency
  if (player.totalPasses > 10 && player.passingEfficiency >= 90) {
    suggestions.push({
      text: `Com ${player.passingEfficiency}% de precisão, a distribuição de jogo está ótima.`,
      type: 'praise',
    });
  }

  return suggestions;
};

const SuggestionIcon = ({ type }: { type: Suggestion['type'] }) => {
  switch (type) {
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'suggestion':
      return <Lightbulb className="h-5 w-5 text-blue-500" />;
    case 'praise':
      return <ThumbsUp className="h-5 w-5 text-green-500" />;
    default:
      return null;
  }
};

export function AISuggestions({ players }: { players: CalculatedPlayerStats[] }) {
  const allSuggestions = players.map(player => ({
    playerName: player.name,
    suggestions: generateSuggestions(player),
  })).filter(item => item.suggestions.length > 0);

  if (allSuggestions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5" />
          Análise e Sugestões da IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {allSuggestions.map(({ playerName, suggestions }) => (
          <div key={playerName}>
            <h4 className="font-semibold">{playerName}</h4>
            <ul className="mt-2 space-y-2 list-inside">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <SuggestionIcon type={suggestion.type} />
                  <span className="ml-3 text-sm text-muted-foreground">{suggestion.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
         <p className="text-xs text-muted-foreground pt-4 border-t">
          Nota: A análise de queda de desempenho ao longo do tempo requer o armazenamento de dados de múltiplas partidas, o que é um recurso futuro.
        </p>
      </CardContent>
    </Card>
  );
}