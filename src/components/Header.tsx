import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export const Header = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <header className="text-center mb-8 relative">
            <h1 className="text-3xl md:text-4xl font-bold">Scout IA – Análise de Partidas de Futebol Amador</h1>
            <p className="text-muted-foreground mt-2">Registre e analise o desempenho dos jogadores após cada partida.</p>
            <Button onClick={handleLogout} variant="outline" className="absolute top-0 right-0 no-print">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
            </Button>
        </header>
    );
}