import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";
import { CalculatedPlayerStats } from "@/types/player";
import { Chatbot } from "./Chatbot";

interface ChatbotWidgetProps {
  players: CalculatedPlayerStats[];
}

export function ChatbotWidget({ players }: ChatbotWidgetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg" size="icon">
          <MessageCircle className="h-8 w-8" />
          <span className="sr-only">Abrir Chatbot</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[450px] p-0 flex flex-col">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Assistente de Análise</SheetTitle>
          <SheetDescription>
            Pergunte sobre os dados dos jogadores para obter insights.
          </SheetDescription>
        </SheetHeader>
        <Chatbot players={players} />
      </SheetContent>
    </Sheet>
  );
}