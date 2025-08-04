import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Lightbulb, ThumbsUp } from "lucide-react";
import { CalculatedPlayerStats } from "@/types/player";

interface Suggestion {
  text: string;
  type: 'warning' | 'suggestion' | 'praise';
}

const generateSuggestions = (player: CalculatedPlayerStats): Suggestion[] => {
  const suggestions: Suggestion[] = [];
  const {
    position,
    goals,
    shotsOnTarget,
    totalPasses,
    passingEfficiency,
    fouls,
    minutesPlayed,
  } = player;

  switch (position) {
    case 'Atacante':
      if (goals === 0 && shotsOnTarget < 2 && minutesPlayed > 30) {
        suggestions.push({
          text: "Baixa produção ofensiva. Considerar treinos de finalização ou mudanças táticas para aumentar o envolvimento no ataque.",
          type: 'suggestion',
        });
      }
      if (goals >= 2) {
        suggestions.push({
          text: `Marcou ${goals} gols! Excelente poder de finalização. Continuar sendo decisivo.`,
          type: 'praise',
        });
      }
      if (fouls >= 3) {
        suggestions.push({
          text: `Cometeu ${fouls} faltas. Um atacante deve evitar infrações desnecessárias no campo de ataque.`,
          type: 'warning',
        });
      }
      break;

    case 'Meia':
    case 'Volante':
      if (totalPasses < 15 && minutesPlayed > 45) {
        suggestions.push({
          text: "Baixa participação no jogo (poucos passes). Pode se beneficiar de um reposicionamento para buscar mais a bola.",
          type: 'suggestion',
        });
      }
      if (passingEfficiency < 75 && totalPasses > 10) {
        suggestions.push({
          text: `A precisão de passe de ${passingEfficiency}% pode ser melhorada. Recomenda-se focar em exercícios de controle e distribuição.`,
          type: 'warning',
        });
      }
      if (passingEfficiency >= 90 && totalPasses > 20) {
        suggestions.push({
          text: `Excelente distribuição de jogo com ${passingEfficiency}% de precisão nos passes.`,
          type: 'praise',
        });
      }
      if (fouls >= 3) {
        suggestions.push({
          text: `Cometeu ${fouls} faltas. É importante manter a disciplina tática no meio-campo.`,
          type: 'warning',
        });
      }
      break;

    case 'Zagueiro':
    case 'Lateral':
      if (fouls >= 3) {
        suggestions.push({
          text: `Cometeu ${fouls} faltas. Para um defensor, é crucial melhorar o tempo de bola e o posicionamento para evitar infrações.`,
          type: 'warning',
        });
      }
      if (passingEfficiency < 80 && totalPasses > 10) {
        suggestions.push({
          text: `A saída de bola pode ser aprimorada. A precisão de passe de ${passingEfficiency}% está abaixo do ideal para um defensor.`,
          type: 'warning',
        });
      }
      if (passingEfficiency >= 95 && totalPasses > 15) {
        suggestions.push({
          text: `Ótima segurança na saída de bola, com ${passingEfficiency}% de precisão nos passes.`,
          type: 'praise',
        });
      }
      break;

    case 'Goleiro':
      if (fouls > 0) {
        suggestions.push({
          text: "Cometeu faltas, o que é incomum e arriscado para um goleiro. Revisar abordagem em saídas do gol.",
          type: 'warning',
        });
      }
      if (suggestions.length === 0) {
        suggestions.push({
          text: "Atuação segura e sem cometer faltas.",
          type: 'praise',
        });
      }
      break;
    
    default:
      // Fallback for players without a position or with an unknown one
      if (player.offensiveImpact < 2 && player.minutesPlayed > 45) {
        suggestions.push({
          text: "Baixo impacto ofensivo para os minutos jogados. Considerar uma mudança tática ou rotação.",
          type: 'suggestion',
        });
      }
      if (player.offensiveImpact >= 5) {
        suggestions.push({
          text: "Excelente impacto ofensivo! Continuar a ser decisivo no ataque.",
          type: 'praise',
        });
      }
      break;
  }

  // Add a generic praise if no specific suggestions were generated for field players
  if (suggestions.length === 0 && position !== 'Goleiro') {
    suggestions.push({
      text: "Desempenho sólido e equilibrado na sua posição.",
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