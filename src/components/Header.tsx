import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { LogOut, Play } from "lucide-react";

export const Header = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <header className="text-center mb-8 relative no-print py-4">
            <div className="absolute top-4 right-4">
                <Button onClick={handleLogout} variant="outline" size="sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                </Button>
            </div>
            <div className="flex flex-col items-center gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold">Scout IA – Análise de Partidas de Futebol Amador</h1>
                    <p className="text-muted-foreground mt-2">Registre e analise o desempenho dos jogadores após cada partida.</p>
                </div>
                <Button onClick={() => navigate('/live')} size="lg">
                    <Play className="mr-2 h-4 w-4" />
                    Partida Ao Vivo
                </Button>
            </div>
        </header>
    );
}