import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { LogOut, Play } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export const Header = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <header className="mb-8 no-print py-4">
            {/* Top row for title and logout, using CSS Grid for robust alignment */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                
                {/* Title and Subtitle */}
                <div className="text-center sm:col-start-2 order-1 sm:order-none">
                    <h1 className="text-3xl md:text-4xl font-bold">Scout IA – Análise de Partidas de Futebol Amador</h1>
                    <p className="text-muted-foreground mt-2">Registre e analise o desempenho dos jogadores após cada partida.</p>
                </div>

                {/* Right side controls */}
                <div className="flex justify-center sm:justify-end items-center gap-2 sm:col-start-3 order-2 sm:order-none">
                    <ThemeToggle />
                    <Button onClick={handleLogout} variant="outline" size="sm">
                        <LogOut className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Sair</span>
                    </Button>
                </div>

            </div>

            {/* Live Match Button */}
            <div className="mt-4 flex justify-center">
                <Button onClick={() => navigate('/live')} size="lg">
                    <Play className="mr-2 h-4 w-4" />
                    Partida Ao Vivo
                </Button>
            </div>
        </header>
    );
}