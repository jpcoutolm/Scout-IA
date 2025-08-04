import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalculatedPlayerStats } from '@/types/player';
import { ScrollArea } from './ui/scroll-area';
import { Send } from 'lucide-react';

interface ChatbotProps {
  players: CalculatedPlayerStats[];
}

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export function Chatbot({ players }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Olá! Como posso ajudar a analisar os dados? Pergunte sobre 'MVP', 'gols', 'passes' ou 'melhorar'." }
  ]);
  const [inputValue, setInputValue] = useState('');

  const generateBotResponse = (question: string): string => {
    if (players.length === 0) {
      return "Não há dados de jogadores para analisar. Adicione ou filtre jogadores primeiro.";
    }

    // MVP / Best player
    if (question.includes('mvp') || question.includes('melhor jogador')) {
      const mvp = [...players].sort((a, b) => b.offensiveImpact - a.offensiveImpact)[0];
      return `O MVP, com base no impacto ofensivo, é ${mvp.name}, com ${mvp.offensiveImpact} pontos de impacto.`;
    }

    // Most goals
    if (question.includes('gols') || question.includes('artilheiro')) {
      const topScorer = [...players].sort((a, b) => b.goals - a.goals)[0];
      if (topScorer.goals === 0) return "Nenhum gol foi marcado por estes jogadores.";
      return `${topScorer.name} foi o artilheiro, com ${topScorer.goals} gols.`;
    }

    // Passing efficiency
    if (question.includes('passe') || question.includes('passador')) {
      const bestPasser = [...players].sort((a, b) => b.passingEfficiency - a.passingEfficiency)[0];
      return `${bestPasser.name} teve a melhor eficiência de passe, com ${bestPasser.passingEfficiency}%.`;
    }

    // Area for improvement
    if (question.includes('melhorar') || question.includes('ponto fraco')) {
      const mostFouls = [...players].sort((a, b) => b.fouls - a.fouls)[0];
      const worstPassing = [...players].filter(p => p.totalPasses > 5).sort((a, b) => a.passingEfficiency - b.passingEfficiency)[0];

      const suggestions = [];
      if (mostFouls && mostFouls.fouls > 2) {
        suggestions.push(`a disciplina, pois ${mostFouls.name} cometeu ${mostFouls.fouls} faltas`);
      }
      if (worstPassing) {
        suggestions.push(`a precisão dos passes, onde ${worstPassing.name} teve apenas ${worstPassing.passingEfficiency}% de eficiência`);
      }

      if (suggestions.length > 0) {
        return `Uma área para melhoria é ${suggestions.join(' e ')}.`;
      }
      return "Com base nos dados, não há um ponto fraco óbvio. O time pareceu equilibrado.";
    }

    return "Desculpe, não entendi a pergunta. Tente perguntar sobre 'MVP', 'gols', 'passes' ou 'melhorar'.";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = { sender: 'user', text: inputValue };
    const botResponseText = generateBotResponse(inputValue.toLowerCase());
    const botMessage: Message = { sender: 'bot', text: botResponseText };

    setMessages([...messages, userMessage, botMessage]);
    setInputValue('');
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg px-4 py-2 max-w-xs ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Pergunte algo..."
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}